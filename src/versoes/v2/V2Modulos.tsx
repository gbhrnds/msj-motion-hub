import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { cor } from "../../brand/theme";
import { fontFamily } from "../../fonts";
import { Logo } from "../../brand/Logo";
import { Icone } from "../../brand/Icone";
import { BrandShape } from "../../brand/BrandShape";
import { roundedPolygon } from "../../brand/roundedPolygon";
import { quebraBoa } from "../../brand/quebraDeLinha";
import { MorphForma } from "../../motion/MorphForma";
import { comDestaque, PalavrasReveal } from "../../motion/PalavrasReveal";
import { Conteudo, LOGO_MSJ } from "../../dados";
import { clamp, easeEntra, easeMove, Numero } from "../../components/contagem/base";
import { RelogioProps, SEGUNDOS_FINAIS, TelaProps, VersaoBase } from "../VersaoBase";

/*
 * VERSÃO 2 — Brandbook, proposta nova: "mosaico de módulos".
 * Cada tela é montada com módulos do sistema da marca (p.49–54): bordas
 * externas retas, uma divisão diagonal por tela, espaço de 24px entre módulos
 * e margem de 48px até a borda. Fundo branco; os módulos carregam as cores.
 * O relógio é ele mesmo um módulo fixo no canto; nos 10s finais ele cresce até
 * ocupar o mosaico inteiro. Formas oficiais morfando vivem dentro dos módulos.
 */

type Pt = [number, number];
const R_GRANDE = 30; // módulos grandes (exceção aprovada)
const R_PEQUENO = 14;
const RELOGIO = { x: 48, y: 48, w: 300, h: 120 };

/** Lado de onde o módulo entra (o mais próximo da borda do quadro). */
type Lado = "esq" | "dir" | "cima" | "baixo";

const Modulo: React.FC<{ pts: Pt[]; cor: string; delay?: number; lado?: Lado; raio?: number; foto?: string; corPara?: string; trocaEm?: number }> = ({
  pts,
  cor: c,
  delay = 0,
  lado = "dir",
  raio = R_GRANDE,
  foto,
  corPara,
  trocaEm,
}) => {
  const f = useCurrentFrame();
  const v = easeEntra(interpolate(f, [delay, delay + 22], [0, 1], clamp));
  const d = (1 - v) * 90;
  const t = { esq: `${-d}px 0`, dir: `${d}px 0`, cima: `0 ${-d}px`, baixo: `0 ${d}px` }[lado];
  const path = roundedPolygon(pts, raio);
  const id = `mod-${pts.flat().join("-")}`;
  const troca = corPara && trocaEm !== undefined ? easeMove(interpolate(f, [trocaEm, trocaEm + 16], [0, 1], clamp)) : 0;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: v, translate: t }}>
      {foto ? (
        <>
          <defs>
            <clipPath id={id}>
              <path d={path} />
            </clipPath>
          </defs>
          <image href={staticFile(foto)} x={Math.min(...pts.map((p) => p[0]))} y={48} width={1872 - Math.min(...pts.map((p) => p[0]))} height={984} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${id})`} />
        </>
      ) : (
        <>
          <path d={path} fill={c} />
          {troca > 0 && <path d={path} fill={corPara} opacity={troca} />}
        </>
      )}
    </svg>
  );
};

/** Entrada de bloco de apoio (fade + subida curta). */
const Entra: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties; sairEm?: number }> = ({ delay = 0, children, style, sairEm }) => {
  const f = useCurrentFrame();
  const v = easeEntra(interpolate(f, [delay, delay + 18], [0, 1], clamp));
  const s = sairEm === undefined ? 0 : interpolate(f, [sairEm, sairEm + 10], [0, 1], clamp);
  return <div style={{ position: "absolute", opacity: v * (1 - s), translate: `0 ${(1 - v) * 14}px`, fontFamily, ...style }}>{children}</div>;
};

const Morph: React.FC<{ x: number; y: number; tam: number; cor: string; modo?: "preenchida" | "outline"; formas?: Parameters<typeof MorphForma>[0]["formas"]; delay?: number; atraso?: number }> = ({
  x,
  y,
  tam,
  cor: c,
  modo = "preenchida",
  formas = ["pentagon-05", "quadrilateral-05", "pentagon-03", "triangle-02"],
  delay = 10,
  atraso = 0,
}) => {
  const f = useCurrentFrame();
  const v = easeEntra(interpolate(f, [delay, delay + 22], [0, 1], clamp));
  return (
    <div style={{ position: "absolute", left: x - tam / 2, top: y - tam / 2, opacity: v, scale: String(0.95 + 0.05 * v) }}>
      <MorphForma formas={formas} tamanho={tam} cor={c} modo={modo} segurar={56} morfar={20} atraso={atraso} giro={3} />
    </div>
  );
};

// ------------------------------------------------------------------ telas
const Abertura: React.FC = () => (
  <>
    <Modulo pts={[[48, 192], [348, 192], [276, 1032], [48, 1032]]} cor={cor.azulMedio} lado="esq" />
    <Modulo pts={[[372, 48], [1872, 48], [1872, 1032], [300, 1032]]} cor={cor.azul} delay={5} />
    <Morph x={176} y={612} tam={190} cor={cor.verde} modo="outline" delay={16} />
    <Entra delay={14} style={{ left: 1086, top: 540, translate: "-50% -50%" }}>
      <Logo arquivo={LOGO_MSJ.negativo} versao="negativa" altura={210} />
    </Entra>
  </>
);

const Respiro: React.FC<{ c: Extract<Conteudo, { tipo: "respiro" }> }> = ({ c }) => {
  const a = c.variante % 4 === 1;
  return (
    <>
      <Modulo pts={[[900, 48], [1872, 48], [1872, 1032], [780, 1032]]} cor={cor.azul} />
      <Morph x={1360} y={540} tam={400} cor={a ? cor.branco : cor.verde} modo={a ? "preenchida" : "outline"} formas={a ? ["pentagon-06", "quadrilateral-16", "pentagon-05"] : ["pentagon-01", "quadrilateral-05", "pentagon-03"]} />
      <div style={{ position: "absolute", left: 120, top: 540, width: 760, translate: "0 -50%", fontFamily }}>
        <div style={{ fontSize: 64, lineHeight: 1.12, color: cor.azul }}>
          <PalavrasReveal trechos={comDestaque(c.titulo, c.destaque, 300, 700)} delay={10} passo={5} />
        </div>
        {c.comLogo && (
          <div style={{ marginTop: 44 }}>
            <Entra delay={30} style={{ position: "relative" }}>
              <Logo arquivo={LOGO_MSJ.positivo} versao="positiva" altura={90} />
            </Entra>
          </div>
        )}
      </div>
    </>
  );
};

const Destaques: React.FC<{ c: Extract<Conteudo, { tipo: "destaques" }>; frames: number }> = ({ c, frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (x: number) => Math.round(x * fps);
  const fim = frames - s(3);
  const COLS = 3;
  const LINHA = 54;
  const JAN = { y: 110, h: 860 };
  const linhas = Math.ceil(c.nomes.length / COLS);
  const topo = interpolate(f, [s(7), fim], [JAN.y + JAN.h, JAN.y - linhas * LINHA], clamp);
  return (
    <>
      <Modulo pts={[[48, 192], [700, 192], [640, 1032], [48, 1032]]} cor={cor.azul} lado="esq" />
      <Modulo pts={[[724, 48], [1872, 48], [1872, 1032], [664, 1032]]} cor={cor.cinzaClaro} delay={5} corPara={cor.amarelo} trocaEm={fim} />
      {/* esquerda: logos e chamada */}
      {f < s(4.8) && (
        <>
          <Entra delay={12} sairEm={s(4.4)} style={{ left: 110, top: 300 }}>
            <Logo arquivo={c.logoJeito.replace("_positivo", "_negativo")} versao="negativa" altura={110} />
          </Entra>
          <div style={{ position: "absolute", left: 110, top: 480, width: 480, fontFamily, fontSize: 40, lineHeight: 1.2, color: cor.branco }}>
            <PalavrasReveal trechos={comDestaque(c.chamada, "se destaca!", 300, 700)} delay={20} passo={3} sairEm={s(4.4)} />
          </div>
        </>
      )}
      {f >= s(4.6) && (
        <Entra delay={s(4.6)} style={{ left: 110, top: f < s(6.8) ? 480 : 300 }}>
          <Logo arquivo={c.logoDestaques} versao="negativa" altura={f < s(6.8) ? 170 : 120} />
        </Entra>
      )}
      {f >= s(6.8) && (
        <Entra delay={s(6.8)} style={{ left: 110, top: 470 }}>
          <Logo arquivo={c.logoJeito} versao="negativa" altura={72} />
        </Entra>
      )}
      {/* direita: forma viva → nomes → fechamento no módulo amarelo */}
      {f < s(7.2) && <Morph x={1290} y={540} tam={480} cor={cor.amarelo} formas={["pentagon-05", "quadrilateral-16", "triangle-02", "quadrilateral-05"]} />}
      {f >= s(6.8) && f < fim && (
        <div style={{ position: "absolute", left: 760, width: 1070, top: 0, display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, columnGap: 20, translate: `0 ${topo}px`, fontFamily, fontSize: 26, color: cor.azul }}>
          {c.nomes.map((n, i) => {
            const y = topo + Math.floor(i / COLS) * LINHA + LINHA / 2;
            const op = Math.min(interpolate(y, [JAN.y, JAN.y + 70], [0, 1], clamp), interpolate(y, [JAN.y + JAN.h - 70, JAN.y + JAN.h], [1, 0], clamp));
            return (
              <div key={n} style={{ height: LINHA, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", opacity: op }}>
                {n}
              </div>
            );
          })}
        </div>
      )}
      {f >= fim && (
        <div style={{ position: "absolute", left: 1268, top: 540, translate: "-50% -50%", display: "flex", alignItems: "center", gap: 24, fontFamily }}>
          <div style={{ fontSize: 60, color: cor.azulEscuro, whiteSpace: "nowrap" }}>
            <PalavrasReveal trechos={[{ texto: c.fechamento, peso: 700 }]} delay={fim + 8} passo={4} />
          </div>
          {c.icone && (
            <Entra delay={fim + 22} style={{ position: "relative" }}>
              <div style={{ scale: String(1 + 0.12 * Math.pow(Math.max(0, Math.sin((2 * Math.PI * 1.1 * f) / fps)), 6)) }}>
                <Icone arquivo={c.icone} cor={cor.azulEscuro} tamanho={64} />
              </div>
            </Entra>
          )}
        </div>
      )}
    </>
  );
};

const separar = (b: string): [string, string] => {
  const m = b.match(/^(\S+)\s+(.*)$/);
  return m ? [m[1], m[2]] : [b, ""];
};

const METRICAS = [
  { fundo: cor.azul, num: cor.branco, rot: cor.branco },
  { fundo: cor.verde, num: cor.azulEscuro, rot: cor.azulEscuro },
  { fundo: cor.amarelo, num: cor.azulEscuro, rot: cor.azulEscuro },
];

const Indicacao: React.FC<{ c: Extract<Conteudo, { tipo: "indicacao" }> }> = ({ c }) => (
  <>
    <Modulo pts={[[1000, 48], [1872, 48], [1872, 1032], [880, 1032]]} cor={cor.azul} foto={c.foto} />
    <Entra delay={8} style={{ left: 120, top: 230 }}>
      <Logo arquivo={c.logo.replace("-negative", "-positive")} versao="positiva" altura={100} />
    </Entra>
    <div style={{ position: "absolute", left: 120, top: 390, width: 700, fontFamily, fontSize: 40, lineHeight: 1.22, color: cor.azul }}>
      <PalavrasReveal trechos={[{ texto: c.corpo, peso: 300 }]} delay={14} passo={2.2} modo="fade" />
    </div>
    {c.bullets.map((b, i) => {
      const [n, r] = separar(b);
      const m = METRICAS[i % 3];
      const x = 120 + i * 238;
      return (
        <React.Fragment key={b}>
          <Modulo pts={[[x, 640], [x + 220, 640], [x + 220, 940], [x, 940]]} cor={m.fundo} raio={R_PEQUENO} lado="baixo" delay={26 + [0, 4, 7][i]} />
          <Entra delay={34 + [0, 4, 7][i]} style={{ left: x + 22, top: 670, width: 180 }}>
            <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1, color: m.num }}>{n}</div>
            <div style={{ fontSize: 24, lineHeight: 1.2, marginTop: 100, color: m.rot }}>{quebraBoa(r)}</div>
          </Entra>
        </React.Fragment>
      );
    })}
  </>
);

const ConteudoTela: React.FC<{ c: Extract<Conteudo, { tipo: "conteudo" }> }> = ({ c }) => (
  <>
    <Modulo pts={[[48, 192], [760, 192], [700, 1032], [48, 1032]]} cor={cor.azul} lado="esq" />
    <Modulo pts={[[794, 48], [1872, 48], [1872, 300], [776, 300]]} cor={cor.verde} lado="cima" delay={4} />
    <Modulo pts={[[775, 324], [1872, 324], [1872, 1032], [724, 1032]]} cor={cor.azulMedio} lado="baixo" delay={8} />
    {c.logo && (
      <Entra delay={12} style={{ left: 120, top: 320 }}>
        <Logo arquivo={c.logo} versao="negativa" altura={80} />
      </Entra>
    )}
    <div style={{ position: "absolute", left: 120, top: 450, width: 520, fontFamily, fontSize: 42, lineHeight: 1.2, color: cor.branco }}>
      <PalavrasReveal trechos={[{ texto: c.corpo, peso: 300 }]} delay={16} passo={2.4} modo="fade" />
    </div>
    <Entra delay={18} style={{ left: 850, top: 120, width: 950, fontSize: 46, fontWeight: 700, lineHeight: 1.1, color: cor.azulEscuro }}>
      {quebraBoa(c.chamadaLista)}
    </Entra>
    {c.bullets.map((b, i) => (
      <Entra key={b} delay={26 + [0, 4, 7, 9, 11][i % 5]} style={{ left: 840, top: 400 + i * 74, display: "flex", alignItems: "center", gap: 20 }}>
        <BrandShape nome="triangle-06" largura={24} cor={cor.verde} rotacao={-90} />
        <span style={{ fontSize: 36, fontWeight: 300, color: cor.branco }}>{quebraBoa(b)}</span>
      </Entra>
    ))}
    <Morph x={1690} y={880} tam={170} cor={cor.verde} modo="outline" delay={30} />
  </>
);

const dividirCampanha = (t: string) => {
  const i = t.indexOf(", ", t.indexOf(",") + 1);
  return i > 0 ? [t.slice(0, i + 1), t.slice(i + 1)] : ["", t];
};

const Campanha: React.FC<{ c: Extract<Conteudo, { tipo: "campanha" }> }> = ({ c }) => {
  const [leve, forte] = dividirCampanha(c.chamada);
  return (
    <>
      <Modulo pts={[[48, 192], [1180, 192], [1110, 1032], [48, 1032]]} cor={cor.azul} lado="esq" />
      <Modulo pts={[[1216, 48], [1872, 48], [1872, 520], [1177, 520]]} cor={cor.verde} lado="cima" delay={4} />
      <Modulo pts={[[1175, 544], [1872, 544], [1872, 1032], [1134, 1032]]} cor={cor.azulMedio} lado="baixo" delay={8} />
      <Morph x={1530} y={284} tam={250} cor={cor.azulMedio} formas={["quadrilateral-16", "pentagon-05", "triangle-02"]} />
      <Morph x={1510} y={788} tam={260} cor={cor.branco} modo="outline" formas={["pentagon-03", "quadrilateral-05", "pentagon-06"]} atraso={30} />
      <div style={{ position: "absolute", left: 120, top: 610, translate: "0 -50%", width: 940, fontFamily, color: cor.branco }}>
        <div style={{ fontSize: 76, lineHeight: 1.08 }}>
          <PalavrasReveal trechos={[{ texto: leve, peso: 300 }, { texto: forte, peso: 700 }].filter((t) => t.texto)} delay={12} passo={4} />
        </div>
        <div style={{ fontSize: 36, lineHeight: 1.3, marginTop: 40, maxWidth: 820 }}>
          <PalavrasReveal trechos={[{ texto: c.corpo, peso: 300 }]} delay={38} passo={2} modo="fade" />
        </div>
      </div>
    </>
  );
};

const TelaV2: React.FC<TelaProps> = ({ c, frames }) => {
  const f = useCurrentFrame();
  // saída: tudo junto, curta (skill choreograph: exits simultâneos e mais curtos)
  const sai = interpolate(f, [frames - 9, frames - 1], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: cor.branco }}>
      <AbsoluteFill style={{ opacity: 1 - sai, scale: String(1 - 0.015 * sai) }}>
        {c.tipo === "abertura" && <Abertura />}
        {c.tipo === "respiro" && <Respiro c={c} />}
        {c.tipo === "destaques" && <Destaques c={c} frames={frames} />}
        {c.tipo === "indicacao" && <Indicacao c={c} />}
        {c.tipo === "conteudo" && <ConteudoTela c={c} />}
        {c.tipo === "campanha" && <Campanha c={c} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Relógio = módulo fixo no canto. Nos 10s finais ele cresce até ocupar o mosaico inteiro. */
const RelogioV2: React.FC<RelogioProps> = ({ segundosNoInicio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seg = Math.max(0, segundosNoInicio - Math.floor(frame / fps));
  const noSeg = frame - Math.ceil(Math.floor(frame / fps) * fps);
  const ini = Math.ceil((segundosNoInicio - SEGUNDOS_FINAIS) * fps);
  const p = easeMove(interpolate(frame, [ini, ini + 26], [0, 1], clamp));
  const l = (a: number, b: number) => a + (b - a) * p;
  const x = l(RELOGIO.x, 48);
  const y = l(RELOGIO.y, 48);
  const w = l(RELOGIO.w, 1824);
  const h = l(RELOGIO.h, 984);
  const deco = easeEntra(interpolate(frame, [ini + 26, ini + 48], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {p > 0 && <AbsoluteFill style={{ backgroundColor: cor.branco, opacity: Math.min(1, p * 3) }} />}
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: l(R_PEQUENO, R_GRANDE), backgroundColor: cor.azulEscuro }} />
      {deco > 0 && (
        <>
          <div style={{ position: "absolute", left: 960 - 360, top: 540 - 360, opacity: deco }}>
            <MorphForma formas={["pentagon-01", "pentagon-05", "quadrilateral-05"]} tamanho={720} cor={cor.verde} modo="outline" segurar={50} morfar={20} giro={3} />
          </div>
          <div style={{ position: "absolute", left: 960 - 340, top: 540 - 140, width: 680, height: 280, backgroundColor: cor.azulEscuro }} />
          <div style={{ position: "absolute", right: 140, bottom: 110, opacity: deco }}>
            <Logo arquivo={LOGO_MSJ.negativo} versao="negativa" altura={80} />
          </div>
        </>
      )}
      <div style={{ position: "absolute", left: x + w / 2, top: y + h / 2, translate: "-50% -50%" }}>
        <Numero segundos={seg} noSegundo={noSeg} tamanho={l(64, 240)} cor={cor.branco} rolar />
      </div>
    </AbsoluteFill>
  );
};

export const V2Modulos: React.FC = () => <VersaoBase Tela={TelaV2} Relogio={RelogioV2} />;
