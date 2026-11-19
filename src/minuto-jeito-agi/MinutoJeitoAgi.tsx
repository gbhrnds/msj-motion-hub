import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import shapesData from "../shapesData.json";
import { BrandShape, type ShapeName } from "../brand/BrandShape";
import { contorno } from "../brand/grafismos";
import { cor } from "../brand/theme";
import { fontFamily } from "../fonts";
import { MorphForma } from "../motion/MorphForma";
import roteiro from "../../projects/2025-11_minuto-jeito-agi/roteiro.json";

/*
 * Minuto Jeito Agi · Novembro (quadro do MSJ).
 * O vídeo editado é a base (com a voz); as cartelas entram nas janelas do
 * roteiro, no estilo da V3: formas oficiais, sem fade, tipografia cinética.
 *
 * Direção de motion (skill motionmaxxing, references/type.md e transitions.md):
 * - nenhuma frase aparece parada e inteira: cada palavra entra no ritmo da fala,
 *   subindo de dentro da própria linha (desacelera, sem opacidade);
 * - a palavra-tese da cena "atua" o sentido (chega grande e assenta, risca,
 *   cresce); escala grande gasta uma vez por cena;
 * - saída acelerando (as palavras são "jogadas" para cima) e a cartela sai por
 *   um buraco com forma oficial que revela o vídeo — a forma é a transição.
 */

const VIDEO = "projects/2025-11_minuto-jeito-agi/video/minuto-jeito-agi-novembro_v2.mp4";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// curvas (nomes da skill): pouso desacelerado, chegada de herói, saída acelerada
const softLand = Easing.bezier(0.16, 1, 0.3, 1);
const snapSettle = Easing.bezier(0.05, 0.9, 0.1, 1);
const accelExit = Easing.bezier(0.55, 0, 0.9, 0.35);
const segue = Easing.bezier(0.65, 0, 0.35, 1);

const cena = (id: string) => roteiro.cenas.find((c) => c.id === id)!;

/* ------------------------------------------------------------------ texto */

type Palavra = {
  t: string;
  /** frame (local da cartela) em que a palavra pousa */
  em: number;
  peso?: number;
  cor?: string;
  /** chega maior e assenta (palavra-tese) */
  grande?: number;
  /** frame em que um traço risca a palavra (sentido de negação) */
  risca?: number;
};

/** Uma palavra que sobe de dentro da linha e sai acelerando para cima. */
const PalavraViva: React.FC<{ p: Palavra; tam: number; corBase: string; sai?: number; i: number }> = ({
  p,
  tam,
  corBase,
  sai,
  i,
}) => {
  const f = useCurrentFrame();
  const sobe = softLand(interpolate(f, [p.em - 2, p.em + 12], [0, 1], clamp));
  const vai = sai === undefined ? 0 : accelExit(interpolate(f, [sai + i * 0.5, sai + i * 0.5 + 6], [0, 1], clamp));
  const estilo: React.CSSProperties = {
    fontFamily,
    fontSize: tam,
    fontWeight: p.peso ?? 300,
    color: p.cor ?? corBase,
    lineHeight: 1.12,
    letterSpacing: tam > 90 ? -2 : -0.5,
    whiteSpace: "pre",
    display: "inline-block",
  };
  if (p.grande) {
    // chegada de herói: nasce grande e assenta (snap + cauda), sem quicar
    const k = snapSettle(interpolate(f, [p.em - 1, p.em + 12], [0, 1], clamp));
    const esc = f < p.em - 1 ? 0 : interpolate(k, [0, 1], [p.grande, 1]);
    return (
      <span style={{ display: "inline-block", overflow: "visible" }}>
        <span
          style={{
            ...estilo,
            transform: `scale(${esc * (1 - vai)})`,
            transformOrigin: "50% 60%",
          }}
        >
          {p.t}
        </span>
      </span>
    );
  }
  const traco = p.risca === undefined ? 0 : softLand(interpolate(f, [p.risca, p.risca + 7], [0, 1], clamp));
  return (
    <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em", verticalAlign: "bottom" }}>
      <span style={{ ...estilo, position: "relative", transform: `translateY(${(1 - sobe) * 112 - vai * 112}%)` }}>
        {p.t}
        {traco > 0 && (
          <span
            style={{
              position: "absolute",
              left: -6,
              right: -6,
              top: "54%",
              height: Math.max(6, tam * 0.09),
              borderRadius: 6,
              background: cor.verde,
              transform: `scaleX(${traco})`,
              transformOrigin: "0% 50%",
            }}
          />
        )}
      </span>
    </span>
  );
};

/** Linhas centralizadas, slots finais fixos (a linha não recentraliza). */
const Linhas: React.FC<{
  linhas: Palavra[][];
  tam: number | number[];
  corBase: string;
  sai?: number;
  gap?: number;
  style?: React.CSSProperties;
}> = ({ linhas, tam, corBase, sai, gap = 0.28, style }) => {
  let n = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      {linhas.map((l, li) => {
        const t = Array.isArray(tam) ? tam[li] : tam;
        return (
          <div key={li} style={{ display: "flex", justifyContent: "center", gap: t * gap, marginTop: li ? t * 0.1 : 0 }}>
            {l.map((p) => (
              <PalavraViva key={`${li}-${p.t}-${p.em}`} p={p} tam={t} corBase={corBase} sai={sai} i={n++} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Um "beat" da história: um trecho curto, grande, que entra palavra a palavra,
 * vive com um leve push (câmera) e é jogado para fora quando o próximo chega.
 * Nunca há frase inteira parada: o texto avança em pedaços.
 */
const Beat: React.FC<{
  linhas: Palavra[][];
  tam: number[];
  corBase: string;
  sai?: number;
  top?: number;
}> = ({ linhas, tam, corBase, sai, top = 0 }) => {
  const f = useCurrentFrame();
  const em = Math.min(...linhas.flat().map((p) => p.em));
  if (f < em - 3 || (sai !== undefined && f > sai + 12)) return null;
  const fim = sai ?? em + 120;
  const push = interpolate(f, [em, fim + 10], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top }}>
      <div style={{ transform: `scale(${push})` }}>
        <Linhas linhas={linhas} tam={tam} corBase={corBase} sai={sai} gap={0.26} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ transições */

/** Entrada: a cor da cartela chega como forma oficial que cresce e cobre o vídeo. */
const EntradaForma: React.FC<{ corFundo: string; formas: ShapeName[]; dur: number; rot: number }> = ({
  corFundo,
  formas,
  dur,
  rot,
}) => {
  const f = useCurrentFrame();
  const p = segue(interpolate(f, [0, dur], [0, 1], clamp));
  if (p >= 1) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <MorphForma formas={formas} tamanho={4200 * p} cor={corFundo} segurar={0} morfar={dur} rotacao={rot + p * 50} />
    </AbsoluteFill>
  );
};

/** Saída: um buraco com forma oficial abre no centro e devolve o vídeo. */
const buracoClip = (nome: ShapeName, p: number, rot: number) => {
  if (p <= 0) return undefined;
  const larg = 3600 * p;
  const h = (larg * shapesData[nome].h) / shapesData[nome].w;
  const pts = contorno({ id: "b", nome, x: 960 - larg / 2, y: 540 - h / 2, largura: larg, cor: "", rotacao: rot });
  const furo = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return `path(evenodd, "M-10 -10 H1930 V1090 H-10 Z ${furo} Z")`;
};

/* --------------------------------------------------------------- cartela */

type CartelaProps = {
  /** frames globais da janela (do roteiro) */
  de: number;
  ate: number;
  fundo: string;
  /** frames antes de `de` em que a forma de entrada começa (0 = já começa coberta) */
  antes?: number;
  /** buraco de saída: forma e duração (0 = corte seco) */
  saida?: { forma: ShapeName; dur: number; rot: number };
  entrada?: { formas: ShapeName[]; rot: number };
  children: React.ReactNode;
};

const Cartela: React.FC<CartelaProps> = ({ de, ate, fundo, antes = 10, saida, entrada, children }) => {
  const f = useCurrentFrame(); // global
  const fim = ate + (saida?.dur ?? 0);
  const pSaida = saida ? accelExit(interpolate(f, [ate - 2, ate + saida.dur], [0, 1], clamp)) : 0;
  return (
    <>
      {antes > 0 && entrada && (
        <Sequence from={de - antes} durationInFrames={antes + 2} layout="none">
          <EntradaForma corFundo={fundo} formas={entrada.formas} dur={antes + 1} rot={entrada.rot} />
        </Sequence>
      )}
      <Sequence from={de} durationInFrames={fim - de}>
        <AbsoluteFill style={{ backgroundColor: fundo, clipPath: saida ? buracoClip(saida.forma, pSaida, saida.rot) : undefined }}>
          {children}
        </AbsoluteFill>
      </Sequence>
    </>
  );
};

/* ----------------------------------------------------------------- cacos */

type Caco = { nome: ShapeName; x: number; y: number; largura: number; rot: number; em: number };

/** Cacos do canto: entram girando e assentando, respiram, e saem antes do buraco. */
const Cacos: React.FC<{ cacos: Caco[]; corC: string; sai: number }> = ({ cacos, corC, sai }) => {
  const f = useCurrentFrame();
  return (
    <>
      {cacos.map((c, i) => {
        const k = snapSettle(interpolate(f, [c.em, c.em + 18], [0, 1], clamp));
        const vai = accelExit(interpolate(f, [sai + i * 2, sai + i * 2 + 10], [0, 1], clamp));
        const resp = Math.sin((f / 23.976) * Math.PI * 2 * 0.15 + i) * 2.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              transform: `scale(${k * (1 - vai)}) rotate(${c.rot + (1 - k) * -35 + resp + vai * 25}deg)`,
              transformOrigin: "50% 50%",
            }}
          >
            <BrandShape nome={c.nome} largura={c.largura} cor={corC} />
          </div>
        );
      })}
    </>
  );
};

/** Logo com entrada por máscara (sobe de dentro da caixa) e escala uniforme — nunca distorcido. */
const LogoEntra: React.FC<{ src: string; altura: number; em: number; sai?: number; style?: React.CSSProperties }> = ({
  src,
  altura,
  em,
  sai,
  style,
}) => {
  const f = useCurrentFrame();
  const k = softLand(interpolate(f, [em, em + 14], [0, 1], clamp));
  const vai = sai === undefined ? 0 : accelExit(interpolate(f, [sai, sai + 9], [0, 1], clamp));
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <Img src={staticFile(src)} style={{ height: altura, display: "block", transform: `translateY(${(1 - k) * 110 - vai * 110}%)` }} />
    </div>
  );
};

/* ---------------------------------------------------------------- cenas */

const s = (seg: number, fps: number) => Math.round(seg * fps);

/** Cena 01 (01a/01b/01c num "shell" único, 0–8,3 s): All Type na voz, em beats. */
const Cena01: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  const t = (x: number) => s(x, fps) - 1; // a palavra pousa um frame antes da sílaba
  const b = { peso: 700 } as const;
  // tempos estimados do envelope da voz (analise/palavras-cena01.md)
  return (
    <AbsoluteFill>
      <LogoEntra src="brand/logos/agi-negative.svg" altura={64} em={0} style={{ position: "absolute", left: 96, top: 72 }} />
      {/* forma de apoio: outline oficial grande morfando no canto (como o logo da V3) */}
      <div style={{ position: "absolute", right: -300, bottom: -340 }}>
        <MorphForma
          formas={["quadrilateral-05", "pentagon-03", "quadrilateral-16"]}
          tamanho={820}
          cor={cor.branco}
          modo="outline"
          segurar={34}
          morfar={14}
          rotacao={-18 + f * 0.15}
          espessura={3}
        />
      </div>
      <Beat
        corBase={cor.branco}
        tam={[150]}
        sai={t(0.92)}
        linhas={[[{ t: "Em", em: t(0.2) }, { t: "um", em: t(0.36) }, { t: "ano,", em: t(0.53), ...b }]]}
      />
      <Beat
        corBase={cor.branco}
        tam={[104, 176]}
        sai={t(1.94)}
        linhas={[
          [{ t: "a", em: t(1.1) }, { t: "gente", em: t(1.2) }, { t: "viu", em: t(1.42) }, { t: "o", em: t(1.52) }],
          [{ t: "Jeito Agi", em: t(1.63), ...b, cor: cor.verde, grande: 1.4 }],
        ]}
      />
      <Beat
        corBase={cor.branco}
        tam={[116, 150]}
        sai={t(4.12)}
        linhas={[[{ t: "acontecer", em: t(2.14) }], [{ t: "de", em: t(3.06) }, { t: "verdade.", em: t(3.3), ...b }]]}
      />
      {/* "Não em apresentações ou falas.": as palavras negadas são riscadas, uma após a outra */}
      <Beat
        corBase={cor.branco}
        tam={[96, 140, 140]}
        sai={t(6.58)}
        linhas={[
          [{ t: "Não", em: t(4.41) }, { t: "em", em: t(4.61) }],
          [{ t: "apresentações", em: t(4.82), ...b, risca: t(6.2) }],
          [{ t: "ou", em: t(5.84), risca: t(6.2) + 5 }, { t: "falas.", em: t(6.04), ...b, risca: t(6.2) + 8 }],
        ]}
      />
      <Beat
        corBase={cor.branco}
        tam={[96, 270]}
        linhas={[[{ t: "Mas", em: t(6.9) }, { t: "em", em: t(7.06) }], [{ t: "pessoas.", em: t(7.26), ...b, cor: cor.verde, grande: 1.8 }]]}
      />
    </AbsoluteFill>
  );
};

/** Moldura das cartelas cinza dos pilares (02, 03, 04): logo do pilar no topo e cacos no canto inferior. */
const CenaPilar: React.FC<{ logo: string; corCacos: string; cacos: Caco[]; dur: number; children: React.ReactNode }> = ({
  logo,
  corCacos,
  cacos,
  dur,
  children,
}) => {
  const sai = dur - 14;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center" }}>
        <LogoEntra src={logo} altura={84} em={2} sai={sai - 2} />
      </div>
      <AbsoluteFill style={{ top: 60 }}>{children}</AbsoluteFill>
      <Cacos cacos={cacos} corC={corCacos} sai={sai + 2} />
    </AbsoluteFill>
  );
};

/** Ritmo de fala para cartelas em silêncio: intervalos que encolhem, pausa antes da palavra-tese. */
const ritmo = (
  linhas: { t: string; peso?: number; cor?: string; grande?: number; pausa?: boolean }[][],
  inicio: number,
  passo: number,
): Palavra[][] => {
  let at = inicio;
  let g = passo;
  return linhas.map((l) =>
    l.map((p) => {
      if (p.pausa) at += passo * 1.6;
      const w = { ...p, em: Math.round(at) };
      at += g;
      g = Math.max(passo * 0.6, g * 0.9);
      return w;
    }),
  );
};

const b7 = { peso: 700 } as const;

/** 02 · Agir como empreendedor: "dono" chega pesado; "o próximo." é a promessa. */
const Cena02: React.FC<{ dur: number }> = ({ dur }) => {
  const sai = dur - 14;
  return (
    <CenaPilar
      logo="brand/logos/agir_como_empreendedor_positivo.svg"
      corCacos={cor.verde}
      dur={dur}
      cacos={[
        { nome: "quadrilateral-05", x: 1500, y: 780, largura: 520, rot: -14, em: 4 },
        { nome: "triangle-06", x: 1330, y: 930, largura: 110, rot: 24, em: 10 },
        { nome: "pentagon-03", x: -150, y: 860, largura: 360, rot: 12, em: 7 },
      ]}
    >
      <Beat corBase={cor.azul} tam={[100, 150]} sai={62} linhas={ritmo([[{ t: "Aqui," }, { t: "você" }], [{ t: "age", ...b7 }, { t: "como", ...b7 }, { t: "dono", ...b7, grande: 1.35, pausa: true }]], 8, 6)} />
      <Beat corBase={cor.azul} tam={[120, 120]} sai={114} linhas={ritmo([[{ t: "porque" }, { t: "já" }, { t: "é", ...b7 }], [{ t: "ou", pausa: true }, { t: "porque" }, { t: "sonha", ...b7 }]], 68, 6)} />
      <Beat corBase={cor.azul} tam={[100, 190]} sai={sai} linhas={ritmo([[{ t: "em" }, { t: "ser" }], [{ t: "o", ...b7, pausa: true }, { t: "próximo.", ...b7, grande: 1.45 }]], 120, 6)} />
    </CenaPilar>
  );
};

/** 03 · Crescer na jornada: a linha cresce enquanto entra; depois sobe e encolhe para "E na vida." aterrissar. */
const Cena03: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const sai = dur - 14;
  const l1: Palavra[] = [
    { t: "Crescer", em: 12, peso: 400 },
    { t: "na", em: 22, peso: 300 },
    { t: "jornada.", em: 28, peso: 400 },
  ];
  const vida: Palavra[] = [
    { t: "E", em: 108, peso: 700 },
    { t: "na", em: 114, peso: 700 },
    { t: "vida.", em: 122, peso: 700, grande: 1.35 },
  ];
  // "Crescer": a linha toda cresce (0,7 → 1); quando "E na vida." chega, ela sobe e reduz
  const cresce = interpolate(softLand(interpolate(f, [10, 96], [0, 1], clamp)), [0, 1], [0.7, 1]);
  const abre = segue(interpolate(f, [96, 112], [0, 1], clamp));
  return (
    <CenaPilar
      logo="brand/logos/crescer_na_jornada_positivo.svg"
      corCacos={cor.amarelo}
      dur={dur}
      cacos={[
        { nome: "quadrilateral-16", x: 1480, y: 760, largura: 560, rot: 8, em: 6 },
        { nome: "triangle-10", x: 1300, y: 940, largura: 120, rot: -20, em: 12 },
        { nome: "triangle-06", x: -40, y: 900, largura: 260, rot: 160, em: 9 },
      ]}
    >
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `translateY(${-abre * 150}px) scale(${cresce * (1 - abre * 0.42)})` }}>
          <Linhas linhas={[l1]} tam={150} corBase={cor.azul} sai={sai} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top: 120 }}>
        <Linhas linhas={[vida]} tam={220} corBase={cor.azul} sai={sai + 3} />
      </AbsoluteFill>
    </CenaPilar>
  );
};

/** 04 · Viver pelo cliente: "cliente" pesa; acolher e encorajar; "milhares" chega grande. */
const Cena04: React.FC<{ dur: number }> = ({ dur }) => {
  const sai = dur - 14;
  return (
    <CenaPilar
      logo="brand/logos/viver_pelo_cliente_positivo.svg"
      corCacos={cor.azulMedio}
      dur={dur}
      cacos={[
        { nome: "pentagon-06", x: 1490, y: 770, largura: 540, rot: -8, em: 4 },
        { nome: "triangle-01", x: 1320, y: 950, largura: 100, rot: 30, em: 10 },
        { nome: "quadrilateral-01", x: -130, y: 850, largura: 380, rot: -12, em: 7 },
      ]}
    >
      <Beat corBase={cor.azul} tam={[110, 160]} sai={60} linhas={ritmo([[{ t: "Vivendo", ...b7 }, { t: "pelo", ...b7 }], [{ t: "cliente,", ...b7, grande: 1.4, pausa: true }]], 8, 6)} />
      <Beat corBase={cor.azul} tam={[140, 110]} sai={112} linhas={ritmo([[{ t: "acolhemos" }], [{ t: "e", pausa: true }, { t: "encorajamos" }]], 66, 8)} />
      <Beat corBase={cor.azul} tam={[170, 120]} sai={sai} linhas={ritmo([[{ t: "milhares", ...b7, grande: 1.4 }], [{ t: "de", pausa: true }, { t: "brasileiros.", ...b7 }]], 118, 8)} />
    </CenaPilar>
  );
};

/** Cena 05 + Encerramento: mesma base azul; o bloco sai e só o logo Agibank entra. */
const Cena05Enc: React.FC<{ fimBloco: number; inicioEnc: number }> = ({ fimBloco, inicioEnc }) => {
  const f = useCurrentFrame();
  // logo do Minuto: chega grande e assenta (herói)
  const k = snapSettle(interpolate(f, [4, 24], [0, 1], clamp));
  const vaiBloco = accelExit(interpolate(f, [fimBloco - 4, fimBloco + 8], [0, 1], clamp));
  const pergunta: Palavra[] = [
    { t: "Sua", em: 24 },
    { t: "jornada", em: 29 },
    { t: "tem", em: 34 },
    { t: "O", em: 38, peso: 700 },
    { t: "Jeito", em: 41, peso: 700 },
    { t: "Agi?", em: 44, peso: 700, cor: cor.verde },
  ];
  const resposta: Palavra[] = [
    { t: "A", em: 60, peso: 700 },
    { t: "próxima", em: 64, peso: 700 },
    { t: "história", em: 69, peso: 700 },
    { t: "pode", em: 74, peso: 700 },
    { t: "ser", em: 78, peso: 700 },
    { t: "a", em: 84, peso: 700 },
    { t: "sua.", em: 88, peso: 700, cor: cor.verde, grande: 1.6 },
  ];
  // encerramento: logo Agibank revela da esquerda e assenta
  const e = snapSettle(interpolate(f, [inicioEnc, inicioEnc + 22], [0, 1], clamp));
  return (
    <AbsoluteFill>
      {f < fimBloco + 10 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `translateY(${-vaiBloco * 140}px) scale(${1 - vaiBloco * 0.3})`,
            clipPath: `inset(0 0 ${vaiBloco * 100}% 0)`,
          }}
        >
          <Img
            src={staticFile("brand/logos/minuto-jeito-agi-negative.svg")}
            style={{ height: 380, display: "block", transform: `scale(${f < 4 ? 0 : interpolate(k, [0, 1], [1.6, 1])})` }}
          />
          <Linhas linhas={[pergunta]} tam={64} corBase={cor.branco} style={{ marginTop: 64 }} />
          <Linhas linhas={[resposta]} tam={76} corBase={cor.branco} style={{ marginTop: 8 }} />
        </AbsoluteFill>
      )}
      {f >= inicioEnc && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Img
            src={staticFile("brand/logos/agibank-negative-rgb.svg")}
            style={{
              width: 960,
              display: "block",
              clipPath: `inset(0 ${(1 - e) * 100}% 0 0)`,
              transform: `scale(${interpolate(e, [0, 1], [0.88, 1])})`,
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------- composição */

export const MinutoJeitoAgi: React.FC = () => {
  const c01 = { de: 0, ate: Math.round(8.3 * 23.976) };
  const c02 = cena("02").frames;
  const c03 = cena("03").frames;
  const c04 = cena("04").frames;
  const c05 = cena("05").frames;
  const enc = cena("enc").frames;
  const SAI = 14;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile(VIDEO)} />

      <Cartela de={c01.de} ate={c01.ate} fundo={cor.azul} antes={0} saida={{ forma: "pentagon-05", dur: SAI, rot: 10 }}>
        <Cena01 />
      </Cartela>

      <Cartela
        de={c02[0]}
        ate={c02[1]}
        fundo={cor.cinzaClaro}
        entrada={{ formas: ["quadrilateral-05", "pentagon-03"], rot: -20 }}
        saida={{ forma: "quadrilateral-16", dur: SAI, rot: -12 }}
      >
        <Cena02 dur={c02[1] - c02[0]} />
      </Cartela>

      <Cartela
        de={c03[0]}
        ate={c03[1]}
        fundo={cor.cinzaClaro}
        entrada={{ formas: ["quadrilateral-16", "pentagon-06"], rot: 15 }}
        saida={{ forma: "pentagon-03", dur: SAI, rot: 20 }}
      >
        <Cena03 dur={c03[1] - c03[0]} />
      </Cartela>

      <Cartela
        de={c04[0]}
        ate={c04[1]}
        fundo={cor.cinzaClaro}
        entrada={{ formas: ["pentagon-06", "quadrilateral-01"], rot: -8 }}
        saida={{ forma: "quadrilateral-05", dur: SAI, rot: 8 }}
      >
        <Cena04 dur={c04[1] - c04[0]} />
      </Cartela>

      {/* 05 cobre o vídeo (não é janela preta) e emenda no Encerramento até o fim */}
      <Cartela de={c05[0]} ate={enc[1]} fundo={cor.azul} entrada={{ formas: ["pentagon-05", "quadrilateral-05"], rot: 12 }}>
        <Cena05Enc fimBloco={c05[1] - c05[0]} inicioEnc={enc[0] - c05[0]} />
      </Cartela>
    </AbsoluteFill>
  );
};

export const FRAMES_MJA = roteiro.video.frames;
