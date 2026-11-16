import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { cor } from "../../brand/theme";
import { fontFamily } from "../../fonts";
import { Logo } from "../../brand/Logo";
import { Icone } from "../../brand/Icone";
import { BrandShape, ShapeName } from "../../brand/BrandShape";
import shapesData from "../../shapesData.json";
import { quebraBoa } from "../../brand/quebraDeLinha";
import { MorphForma } from "../../motion/MorphForma";
import { comDestaque, PalavrasReveal } from "../../motion/PalavrasReveal";
import { Conteudo, LOGO_AGI, LOGO_MSJ } from "../../dados";
import { LogoMSJAnimado } from "../../motion/LogoMSJAnimado";
import { clamp, easeEntra, Numero } from "../../components/contagem/base";
import { RelogioProps, SEGUNDOS_FINAIS, TelaProps, VersaoBase } from "../VersaoBase";

/*
 * VERSÃO 1 — inspirada no #NuDay (projetos_referencia/analise_nova).
 * Grade de transmissão: relógio fixo no meio-esquerda, um "slot" de conteúdo
 * à direita que troca a cada tela, logo agi fixo no topo. Fundo de uma cor só:
 * azul nas telas de conteúdo, branco nos respiros. Morph de formas só nos
 * respiros (formas em volta do texto) e nas transições entre telas.
 * Só a mecânica vem da referência; cores, formas e tipo são Agibank.
 */

const SLOT = { x: 660, largura: 1140 };
const RELOGIO = { x: 120, tam: 150 };
const claro = (c: Conteudo) => c.tipo === "respiro";
export const fundoV1 = (c: Conteudo) => (claro(c) ? cor.cinzaClaro : cor.azul);
/** Espessura dos outlines da V1. */
const TRACO = 3; // Figma: traço de 6px por dentro, com máscara = 3px visíveis (token)

/**
 * Forma oficial posicionada como no Figma (caixa x/y/largura + rotação) e
 * desenhada pelo MorphForma, que pode trocar de forma oficial no lugar.
 */
type Caixa = { nome: ShapeName; x: number; y: number; largura: number; rotacao: number };
const FormaNaCaixa: React.FC<{
  caixa: Caixa;
  cor: string;
  modo?: "preenchida" | "outline";
  outras?: ShapeName[];
  cores?: string[];
  delay?: number;
  segurar?: number;
}> = ({ caixa, cor: c, modo = "preenchida", outras = [], cores, delay = 0, segurar = 70 }) => {
  const f = useCurrentFrame();
  const sd = shapesData[caixa.nome];
  const altura = (caixa.largura * sd.h) / sd.w;
  const lado = Math.max(caixa.largura, altura);
  // entrada sem fade: a forma cresce do zero (ease-out)
  const v = easeEntra(interpolate(f, [delay, delay + 22], [0, 1], clamp));
  return (
    <div
      data-camada={`forma · ${caixa.nome}`}
      style={{
        position: "absolute",
        left: caixa.x + caixa.largura / 2 - lado / 2,
        top: caixa.y + altura / 2 - lado / 2,
        scale: String(v),
      }}
    >
      <MorphForma
        formas={[caixa.nome, ...outras]}
        tamanho={lado}
        cor={c}
        cores={cores}
        modo={modo}
        rotacao={caixa.rotacao}
        espessura={TRACO}
        segurar={segurar}
        morfar={20}
        atraso={-delay}
      />
    </div>
  );
};

/** Máscara na cor do fundo: o outline passa por trás do texto sem cruzá-lo. */
const Mascara: React.FC<{ x: number; y: number; w: number; h: number; cor: string }> = ({ x, y, w, h, cor: c }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, backgroundColor: c }} />
);

/** Relógio da grade: mesma posição e tamanho em todas as telas (só a cor acompanha o fundo). */
const RelogioFixo: React.FC<{ inicio: number; total: number; corTexto: string }> = ({ inicio, total, corTexto }) => {
  const frame = useCurrentFrame() + inicio;
  const { fps } = useVideoConfig();
  const seg = Math.max(0, Math.round(total / fps) - Math.floor(frame / fps));
  const noSeg = frame - Math.ceil(Math.floor(frame / fps) * fps);
  return (
    <div style={{ position: "absolute", left: RELOGIO.x, top: 540, translate: "0 -50%" }}>
      <Numero segundos={seg} noSegundo={noSeg} tamanho={RELOGIO.tam} cor={corTexto} rolar />
    </div>
  );
};

/** Moldura superior fixa: logo agi (versão reduzida, Brandbook p.27). Sem arquivo no manifest, fica vazio. */
const Selo: React.FC<{ claro: boolean }> = ({ claro: c }) => {
  const arq = c ? LOGO_AGI.positivo : LOGO_AGI.negativo;
  return (
    <div data-camada="logo agi" style={{ position: "absolute", left: RELOGIO.x, top: 64, height: 52 }}>
      {arq && <Logo arquivo={arq} versao={c ? "positiva" : "negativa"} altura={52} />}
    </div>
  );
};

const Slot: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      left: SLOT.x,
      width: SLOT.largura,
      top: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      fontFamily,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Entrada simples (fade + subida curta) para logos e blocos de apoio. */
const Entra: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties; sairEm?: number }> = ({
  delay = 0,
  children,
  style,
  sairEm,
}) => {
  const f = useCurrentFrame();
  const v = easeEntra(interpolate(f, [delay, delay + 18], [0, 1], clamp));
  const s = sairEm === undefined ? 0 : interpolate(f, [sairEm, sairEm + 10], [0, 1], clamp);
  return <div style={{ opacity: v * (1 - s), translate: `0 ${(1 - v) * 16 - s * 10}px`, ...style }}>{children}</div>;
};

// ---------------------------------------------------------------- telas
/** Outline grande atrás do logo MSJ (abertura e 10s finais), posição do Figma. */
const OUTLINE_LOGO: Caixa = { nome: "quadrilateral-05", x: 682, y: -156, largura: 999, rotacao: 312 };
const MASCARA_LOGO = { x: 648, y: 436, w: 706, h: 213 };

const LogoComOutline: React.FC<{ altura: number; delay: number }> = ({ altura, delay }) => (
  <>
    <FormaNaCaixa caixa={OUTLINE_LOGO} cor={cor.verde} modo="outline" delay={delay + 10} segurar={100000} />
    <Mascara {...MASCARA_LOGO} cor={cor.azul} />
    <Slot>
      <LogoMSJAnimado versao="negativa" altura={altura} delay={delay} />
    </Slot>
  </>
);

const Abertura: React.FC = () => <LogoComOutline altura={190} delay={6} />;

/**
 * Respiro (ajuste do Figma): fundo cinza claro e um único outline oficial em
 * volta do texto, com máscara na cor do fundo atrás das linhas. O outline
 * morfa entre formas oficiais (morph só nos respiros) trocando de cor.
 */
const RESPIRO = [
  {
    outline: { nome: "pentagon-01", x: 954, y: 340, largura: 428, rotacao: 21 } as Caixa,
    outras: ["pentagon-03", "quadrilateral-16"] as ShapeName[],
    cores: [cor.azulMedio, cor.azul, cor.verde],
    mascara: { x: 884, y: 457, w: 559, h: 166 },
    texto: { x: 890, y: 470 },
  },
  {
    outline: { nome: "quadrilateral-16", x: 830, y: 249, largura: 424, rotacao: 0 } as Caixa,
    outras: ["pentagon-01", "quadrilateral-05"] as ShapeName[],
    cores: [cor.amarelo, cor.azulMedio, cor.azul],
    mascara: { x: 807, y: 399, w: 559, h: 166 },
    texto: { x: 843, y: 412 },
  },
];

const Respiro: React.FC<{ c: Extract<Conteudo, { tipo: "respiro" }> }> = ({ c }) => {
  const r = RESPIRO[c.comLogo ? 1 : 0];
  return (
    <>
      <FormaNaCaixa caixa={r.outline} cor={r.cores[0]} cores={r.cores} outras={r.outras} modo="outline" delay={4} segurar={60} />
      <Mascara {...r.mascara} cor={cor.cinzaClaro} />
      {c.comLogo && <Mascara x={r.texto.x + 40} y={r.texto.y + 228} w={200} h={96} cor={cor.cinzaClaro} />}
      <div style={{ position: "absolute", left: r.texto.x, top: r.texto.y, width: 600, fontFamily }}>
        <div style={{ fontSize: 60, lineHeight: 1.08, color: cor.azul }}>
          <PalavrasReveal trechos={comDestaque(c.titulo, c.destaque, 300, 700)} delay={10} passo={5} />
        </div>
        {c.comLogo && (
          <Entra delay={30} style={{ marginTop: 92, marginLeft: 57 }}>
            <Logo arquivo={LOGO_MSJ.positivo} versao="positiva" altura={70} />
          </Entra>
        )}
      </div>
    </>
  );
};

const Destaques: React.FC<{ c: Extract<Conteudo, { tipo: "destaques" }>; frames: number }> = ({ c, frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (x: number) => Math.round(x * fps);
  const fimNomes = frames - s(3);
  const COLS = 4;
  // 52px como no Figma; com mais nomes, a linha aperta para a grade caber até y≈1010
  const LINHA = Math.min(52, Math.floor(770 / Math.ceil(c.nomes.length / COLS)));
  // Figma (2026-11-16): grade inteira parada, todos os nomes com opacidade total
  const TOPO = 244;
  const COL = 291;
  return (
    <>
      {f < s(4.8) && (
        <Slot>
          <Entra sairEm={s(4.4)}>
            <Logo arquivo={c.logoJeito} versao="negativa" altura={120} />
          </Entra>
          <div style={{ fontSize: 50, lineHeight: 1.18, color: cor.branco, marginTop: 48, maxWidth: 980 }}>
            <PalavrasReveal trechos={comDestaque(c.chamada, "se destaca!", 300, 700)} delay={12} passo={3} sairEm={s(4.4)} />
          </div>
        </Slot>
      )}
      {f >= s(4.6) && f < s(7) && (
        <Slot>
          <Entra delay={s(4.6)} sairEm={s(6.6)}>
            <Logo arquivo={c.logoDestaques} versao="negativa" altura={230} />
          </Entra>
        </Slot>
      )}
      {f >= s(6.8) && f < fimNomes && (
        <>
          <div style={{ position: "absolute", left: SLOT.x, top: 110 }}>
            <Entra delay={s(6.8)}>
              <Logo arquivo={c.logoDestaques} versao="negativa" altura={72} />
            </Entra>
          </div>
          <div
            style={{
              position: "absolute",
              left: SLOT.x,
              top: TOPO,
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, ${COL}px)`,
              fontFamily,
              fontSize: 22,
              fontWeight: 400,
              color: cor.branco,
            }}
          >
            {c.nomes.map((n, i) => {
              // cada linha sobe de dentro da própria caixa (máscara), em cascata
              const linha = Math.floor(i / COLS);
              const v = easeEntra(interpolate(f, [s(7) + linha * 2, s(7) + linha * 2 + 14], [0, 1], clamp));
              return (
                <div key={n} style={{ height: LINHA, overflow: "hidden", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
                  <span style={{ translate: `0 ${(1 - v) * LINHA}px` }}>{n}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
      {f >= fimNomes && (
        <Slot>
          <div style={{ display: "flex", alignItems: "center", gap: 64 }}>
            <div style={{ fontSize: 72, color: cor.branco }}>
              <PalavrasReveal trechos={[{ texto: c.fechamento, peso: 700 }]} delay={fimNomes} passo={4} />
            </div>
            {c.icone && (
              <Entra delay={fimNomes + 14}>
                <div style={{ scale: String(1 + 0.12 * Math.pow(Math.max(0, Math.sin((2 * Math.PI * 1.1 * f) / fps)), 6)) }}>
                  <Icone arquivo={c.icone} cor={cor.amarelo} tamanho={72} />
                </div>
              </Entra>
            )}
          </div>
        </Slot>
      )}
    </>
  );
};

const separar = (b: string): [string, string] => {
  const m = b.match(/^(\S+)\s+(.*)$/);
  return m ? [m[1], m[2]] : [b, ""];
};

/**
 * Indicação (Figma 2026-11-16): foto sangrando numa coluna à direita, outline
 * verde (pentagon-02) passando por trás da pessoa recortada, número em verde.
 */
const PAINEL_FOTO = { x: 1288 };
const IMAGEM = { x: 767, y: -84, largura: 1774, altura: 1183 };
const OUTLINE_IND: Caixa = { nome: "pentagon-02", x: 1184, y: 145, largura: 895, rotacao: 300 };

const Indicacao: React.FC<{ c: Extract<Conteudo, { tipo: "indicacao" }> }> = ({ c }) => {
  const f = useCurrentFrame();
  // painel entra como cortina da direita (sem fade)
  const v = easeEntra(interpolate(f, [2, 22], [0, 1], clamp));
  const img = (arq: string) => (
    <Img src={staticFile(arq)} style={{ position: "absolute", left: IMAGEM.x, top: IMAGEM.y, width: IMAGEM.largura, height: IMAGEM.altura }} />
  );
  const [n, r] = separar(c.bullets[0] ?? "");
  return (
    <>
      <div style={{ position: "absolute", left: PAINEL_FOTO.x, top: 0, right: 0, bottom: 0, overflow: "hidden", clipPath: `inset(0 0 0 ${(1 - v) * 100}%)` }}>
        <div style={{ position: "absolute", left: -PAINEL_FOTO.x, top: 0 }}>{img(c.foto)}</div>
      </div>
      <FormaNaCaixa caixa={OUTLINE_IND} cor={cor.verde} modo="outline" delay={14} segurar={100000} />
      <Mascara x={660} y={400} w={578} h={305} cor={cor.azul} />
      {c.recorte && <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${(1 - v) * 100}%)` }}>{img(c.recorte)}</div>}
      <div style={{ position: "absolute", left: SLOT.x, top: 298, width: 600, fontFamily }}>
        <Entra>
          <Logo arquivo={c.logo} versao="negativa" altura={92} />
        </Entra>
        <div style={{ fontSize: 40, lineHeight: 1.22, color: cor.branco, marginTop: 36 }}>
          <PalavrasReveal trechos={[{ texto: c.corpo, peso: 300 }]} delay={10} passo={2.2} modo="fade" />
        </div>
        {n && (
          <Entra delay={30} style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 56 }}>
            <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1, color: cor.verde }}>{n}</div>
            <div style={{ fontSize: 20, fontWeight: 400, lineHeight: 1.2, color: cor.branco, width: 150 }}>{quebraBoa(r)}</div>
          </Entra>
        )}
      </div>
    </>
  );
};

const ConteudoTela: React.FC<{ c: Extract<Conteudo, { tipo: "conteudo" }> }> = ({ c }) => (
  <Slot style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-start", paddingTop: 390, gap: 70 }}>
    <div style={{ width: 500 }}>
      {c.logo && (
        <Entra>
          <Logo arquivo={c.logo} versao="negativa" altura={70} />
        </Entra>
      )}
      <div style={{ fontSize: 40, lineHeight: 1.22, color: cor.branco, marginTop: 30 }}>
        <PalavrasReveal trechos={[{ texto: c.corpo, peso: 300 }]} delay={8} passo={2.4} modo="fade" />
      </div>
    </div>
    <div style={{ width: 570 }}>
      <Entra delay={20}>
        <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.15, color: cor.verde, marginTop: 8, marginBottom: 50 }}>{quebraBoa(c.chamadaLista)}</div>
      </Entra>
      {c.bullets.map((b, i) => (
        <Entra key={b} delay={28 + [0, 4, 7, 9, 11][i % 5]} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
          <BrandShape nome="triangle-06" largura={20} cor={cor.branco} rotacao={-90} />
          <span style={{ fontSize: 30, fontWeight: 300, color: cor.branco }}>{quebraBoa(b)}</span>
        </Entra>
      ))}
    </div>
  </Slot>
);

const dividirCampanha = (t: string) => {
  const i = t.indexOf(", ", t.indexOf(",") + 1);
  return i > 0 ? [t.slice(0, i + 1), t.slice(i + 1)] : ["", t];
};

const FORMAS_CAMPANHA: { caixa: Caixa; cor: string; delay: number }[] = [
  { caixa: { nome: "pentagon-03", x: 1475, y: 734, largura: 729, rotacao: 141 }, cor: cor.azulMedio, delay: 2 },
  { caixa: { nome: "quadrilateral-05", x: 1594, y: 246, largura: 386, rotacao: 222 }, cor: cor.branco, delay: 6 },
  { caixa: { nome: "quadrilateral-16", x: 1711, y: 88, largura: 205, rotacao: 9 }, cor: cor.verde, delay: 10 },
  { caixa: { nome: "triangle-10", x: 1475, y: 822, largura: 52, rotacao: 252 }, cor: cor.amarelo, delay: 14 },
];

const Campanha: React.FC<{ c: Extract<Conteudo, { tipo: "campanha" }> }> = ({ c }) => {
  const [leve, forte] = dividirCampanha(c.chamada);
  return (
    <>
    {FORMAS_CAMPANHA.map((g) => (
      <FormaNaCaixa key={g.caixa.nome} caixa={g.caixa} cor={g.cor} delay={g.delay} segurar={100000} />
    ))}
    <Slot style={{ width: 1000 }}>
      <div style={{ fontSize: 76, lineHeight: 1.08, color: cor.branco }}>
        <PalavrasReveal trechos={[{ texto: leve, peso: 300 }, { texto: forte, peso: 700 }].filter((t) => t.texto)} delay={8} passo={4} />
      </div>
      <div style={{ fontSize: 36, lineHeight: 1.3, color: cor.branco, marginTop: 40, maxWidth: 820 }}>
        <PalavrasReveal trechos={[{ texto: c.corpo, peso: 300 }]} delay={34} passo={2} modo="fade" />
      </div>
    </Slot>
    </>
  );
};

const TelaV1: React.FC<TelaProps> = ({ c, frames, inicio, total }) => {
  const bg = fundoV1(c);
  const c1 = claro(c);
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {c.tipo === "abertura" && <Abertura />}
      {c.tipo === "respiro" && <Respiro c={c} />}
      {c.tipo === "destaques" && <Destaques c={c} frames={frames} />}
      {c.tipo === "indicacao" && <Indicacao c={c} />}
      {c.tipo === "conteudo" && <ConteudoTela c={c} />}
      {c.tipo === "campanha" && <Campanha c={c} />}
      <Selo claro={c1} />
      <RelogioFixo inicio={inicio} total={total} corTexto={c1 ? cor.azul : cor.branco} />
    </AbsoluteFill>
  );
};

/** Os 10s finais: o slot recebe o logo MSJ com a entrada montada letra a letra. */
const RelogioV1: React.FC<RelogioProps> = ({ segundosNoInicio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicioFinal = Math.ceil((segundosNoInicio - SEGUNDOS_FINAIS) * fps);
  const final = frame >= inicioFinal;
  const seg = Math.max(0, segundosNoInicio - Math.floor(frame / fps));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {final && (
        <AbsoluteFill style={{ backgroundColor: cor.azul }}>
          <LogoComOutline altura={170} delay={4} />
          <Selo claro={false} />
          <div style={{ position: "absolute", left: RELOGIO.x, top: 540, translate: "0 -50%" }}>
            <Numero segundos={seg} noSegundo={frame - Math.ceil(Math.floor(frame / fps) * fps)} tamanho={RELOGIO.tam} cor={cor.branco} rolar />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const V1NuDay: React.FC = () => (
  <VersaoBase
    Tela={TelaV1}
    Relogio={RelogioV1}
    fundo={fundoV1}
    formasTransicao={[["pentagon-05", "quadrilateral-05"], ["quadrilateral-16", "pentagon-06"], ["pentagon-03", "triangle-02"]]}
  />
);

