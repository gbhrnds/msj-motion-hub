import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import shapesData from "../shapesData.json";
import type { ShapeName } from "../brand/BrandShape";
import type { GrafismoSpec, ZonaLivre } from "../brand/grafismos";
import { Icone } from "../brand/Icone";
import { quebraBoa } from "../brand/quebraDeLinha";
import { cor } from "../brand/theme";
import { fontFamily } from "../fonts";
import { CamadaGrafismos } from "../motion/CamadaGrafismos";

/*
 * Retrospectiva 2026 · storyboard estático (KV + 6 quadros) de 3 propostas.
 * Cada quadro é uma Sequence de QUADRO frames; o still sai do frame
 * QUADRO-1 de cada uma (grafismos já assentados).
 *
 * Texto: só copy do roteiro.md (cenas 01, 05, 06, 10, 29, 34). Os frames de
 * pessoas são PROVISÓRIOS (Minuto Jeito Agi) até chegar o vídeo editado.
 */

export const QUADRO = 30;

const W = 1920;
const H = 1080;
const X = 140; // coluna de texto

const FALA_PIU = "projects/retrospectiva-2026/storyboard/provisorio/fala-117.jpg";
const FALA_MARINA = "projects/retrospectiva-2026/storyboard/provisorio/fala-57.jpg";
const FALA_BROLL = "projects/retrospectiva-2026/storyboard/provisorio/fala-85.jpg";
const LOGO_POS = "brand/logos/agibank-positive-rgb.svg";
const LOGO_NEG = "brand/logos/agibank-negative-rgb.svg";
const SETA_CIMA = "brand/icons/arrow-up.svg";
const SETA_BAIXO = "brand/icons/arrow-down.svg";
const SETA_DIR = "brand/icons/arrow-right.svg";

/* ------------------------------------------------------------ primitivas */

const T: React.FC<{
  x: number;
  y: number;
  tam: number;
  peso?: number;
  c: string;
  w?: number;
  centro?: boolean;
  lh?: number;
  children: string;
  style?: React.CSSProperties;
}> = ({ x, y, tam, peso = 400, c, w, centro, lh = 1.05, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: centro ? 0 : x,
      top: y,
      width: centro ? W : w,
      textAlign: centro ? "center" : "left",
      fontFamily,
      fontSize: tam,
      fontWeight: peso,
      color: c,
      lineHeight: lh,
      letterSpacing: tam > 120 ? "-0.02em" : "-0.005em",
      whiteSpace: w || centro ? "normal" : "nowrap",
      ...style,
    }}
  >
    {quebraBoa(children)}
  </div>
);

const Fundo: React.FC<{ c: string }> = ({ c }) => <AbsoluteFill style={{ backgroundColor: c }} />;

const Foto: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }} />
);

/** Vídeo em card (técnica "janela" da referência): módulo com canto arredondado. */
const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  src: string;
  nome?: string;
  focoX?: string;
}> = ({ x, y, w, h, r = 16, src, nome, focoX = "50%" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, overflow: "hidden" }}>
    <Foto src={src} style={{ objectPosition: `${focoX} 30%` }} />
    {nome ? (
      <div
        style={{
          position: "absolute",
          left: 40,
          bottom: 36,
          fontFamily,
          fontWeight: 500,
          fontSize: 30,
          color: cor.branco,
          textShadow: "0 1px 12px rgba(0,15,68,.45)",
        }}
      >
        {nome}
      </div>
    ) : null}
  </div>
);

/** Foto recortada por forma oficial (escala/rotação apenas). */
const FotoForma: React.FC<{ forma: ShapeName; x: number; y: number; largura: number; src: string; rot?: number }> = ({
  forma,
  x,
  y,
  largura,
  src,
  rot = 0,
}) => {
  const f = shapesData[forma];
  const k = largura / f.w;
  const h = f.h * k;
  const id = `ff-${forma}-${x}-${y}`;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <clipPath id={id}>
          <path d={f.d} transform={`translate(${x} ${y}) rotate(${rot} ${largura / 2} ${h / 2}) scale(${k})`} />
        </clipPath>
      </defs>
      <image
        href={staticFile(src)}
        x={x - largura * 0.1}
        y={y - h * 0.05}
        width={largura * 1.2}
        height={h * 1.1}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${id})`}
      />
    </svg>
  );
};

/** Módulo da marca: borda externa reta, divisão interna diagonal (p.49–54). */
const Modulo: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
  r?: number;
  /** segunda cor abaixo de uma diagonal: [y% esquerda, y% direita] */
  diag?: { c: string; de: number; ate: number };
  children?: React.ReactNode;
}> = ({ x, y, w, h, c, r = 16, diag, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, overflow: "hidden", backgroundColor: c }}>
    {diag ? (
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: diag.c,
          clipPath: `polygon(0 ${diag.de}%, 100% ${diag.ate}%, 100% 100%, 0 100%)`,
        }}
      />
    ) : null}
    {children}
  </div>
);

/** Pílula (tag) com ícone oficial opcional. */
const Pilula: React.FC<{
  x: number;
  y: number;
  fundo: string;
  c: string;
  tam?: number;
  icone?: string;
  children: string;
}> = ({ x, y, fundo, c, tam = 40, icone, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      display: "flex",
      alignItems: "center",
      gap: tam * 0.3,
      height: tam * 1.7,
      padding: `0 ${tam * 0.6}px`,
      borderRadius: 14,
      backgroundColor: fundo,
      fontFamily,
      fontWeight: 700,
      fontSize: tam,
      color: c,
      whiteSpace: "nowrap",
    }}
  >
    {icone ? <Icone arquivo={icone} cor={c} tamanho={tam * 0.9} /> : null}
    {children}
  </div>
);

/** Faixa horizontal de borda diagonal (linguagem dos módulos, proposta C). */
const Faixa: React.FC<{ c: string; topo: [number, number]; base: [number, number]; children?: React.ReactNode }> = ({
  c,
  topo,
  base,
  children,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: c,
      clipPath: `polygon(0 ${topo[0]}px, 100% ${topo[1]}px, 100% ${base[1]}px, 0 ${base[0]}px)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Formas: React.FC<{ tela: string; formas: GrafismoSpec[]; zonas: ZonaLivre[] }> = ({ tela, formas, zonas }) => (
  <CamadaGrafismos tela={tela} formas={formas.map((f) => ({ wiggle: false, ...f }))} zonasLivres={zonas} comContador={false} />
);

/** Logo Agibank (arquivo com respiro no próprio canvas 1920×1082): `cy` é o centro, `w` a largura do canvas. */
const Logo: React.FC<{ src: string; cy: number; w?: number }> = ({ src, cy, w = 760 }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", top: cy - (w * 1082.79) / 1920 / 2, left: (W - w) / 2, width: w }} />
);

/** Etiqueta de placeholder (não é copy): onde entra material ainda não recebido. */
const AReceber: React.FC<{ texto: string; c: string }> = ({ texto, c }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "grid",
      placeItems: "center",
      fontFamily,
      fontSize: 24,
      fontWeight: 500,
      color: c,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    }}
  >
    {texto}
  </div>
);

/* ===================================================== Proposta A · Janela */
/* cinza claro, vídeo em card, módulos que crescem como barras, lista editorial */

const A0: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.cinzaClaro} />
    <Card x={X} y={140} w={840} h={800} r={30} src={FALA_MARINA} nome="Marina Zelante" focoX="40%" />
    <T x={1060} y={150} tam={44} peso={500} c={cor.azul}>NPS</T>
    <Pilula x={1430} y={236} fundo={cor.verde} c={cor.azulEscuro} tam={40} icone={SETA_CIMA}>7%</Pilula>
    <Modulo x={1060} y={520} w={330} h={420} c={cor.branco}>
      <T x={40} y={36} tam={32} c={cor.azul}>2025</T>
      <T x={36} y={250} tam={140} peso={800} c={cor.azul}>72</T>
    </Modulo>
    <Modulo x={1430} y={340} w={350} h={600} c={cor.azul} diag={{ c: cor.azulMedio, de: 74, ate: 62 }}>
      <T x={40} y={36} tam={32} c={cor.branco}>2026</T>
      <T x={36} y={110} tam={190} peso={800} c={cor.branco}>77</T>
    </Modulo>
    <Formas
      tela="A0"
      formas={[
        { id: "a", nome: "triangle-04", x: 1700, y: 80, largura: 96, cor: cor.azul },
        { id: "b", nome: "quadrilateral-13", x: 1090, y: 300, largura: 150, cor: cor.verde, modo: "outline", rotacao: -8 },
      ]}
      zonas={[
        { id: "card", x: X, y: 140, largura: 840, altura: 800 },
        { id: "nps", x: 1060, y: 150, largura: 120, altura: 50 },
        { id: "pill", x: 1430, y: 236, largura: 200, altura: 70 },
        { id: "m1", x: 1060, y: 520, largura: 330, altura: 420 },
        { id: "m2", x: 1430, y: 340, largura: 350, altura: 600 },
      ]}
    />
  </AbsoluteFill>
);

const A1: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.cinzaClaro} />
    <T x={X} y={250} tam={56} c={cor.azul}>Muitas pessoas não se sentem</T>
    <T x={X} y={340} tam={104} peso={700} c={cor.azul} w={1000} lh={1.02}>vistas, respeitadas ou valorizadas</T>
    <Card x={1160} y={500} w={620} h={460} src={FALA_BROLL} focoX="70%" />
    <Formas
      tela="A1"
      formas={[{ id: "a", nome: "pentagon-07", x: 1300, y: 150, largura: 220, cor: cor.azul }]}
      zonas={[
        { id: "t1", x: X, y: 250, largura: 760, altura: 60 },
        { id: "t2", x: X, y: 340, largura: 1000, altura: 330 },
        { id: "card", x: 1160, y: 500, largura: 620, altura: 460 },
      ]}
    />
  </AbsoluteFill>
);

const A2: React.FC = () => (
  <AbsoluteFill>
    <Card x={0} y={0} w={W} h={H} r={0} src={FALA_PIU} />
    <T x={X} y={930} tam={34} peso={500} c={cor.branco} style={{ textShadow: "0 1px 14px rgba(0,15,68,.5)" }}>
      Matheus Piuzana
    </T>
  </AbsoluteFill>
);

const A3: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.cinzaClaro} />
    <Modulo x={X} y={160} w={1640} h={760} r={30} c={cor.branco}>
      <div style={{ position: "absolute", right: 0, top: 0, width: 520, height: "100%", backgroundColor: cor.azul, clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }} />
      <T x={90} y={90} tam={44} peso={500} c={cor.azul}>Reclame Aqui</T>
      <T x={78} y={250} tam={290} peso={800} c={cor.azul}>90,1%</T>
      <T x={90} y={590} tam={52} c={cor.azul}>de problemas resolvidos</T>
    </Modulo>
    <Formas
      tela="A3"
      formas={[
        { id: "a", nome: "triangle-02", x: 1500, y: 330, largura: 200, cor: cor.verde },
        { id: "b", nome: "quadrilateral-05", x: 1600, y: 660, largura: 90, cor: cor.branco, modo: "outline" },
      ]}
      zonas={[{ id: "texto", x: X + 70, y: 240, largura: 1150, altura: 590 }]}
    />
  </AbsoluteFill>
);

const A4: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.cinzaClaro} />
    <T x={X} y={150} tam={44} peso={500} c={cor.azul}>Ranking de reclamações BCB</T>
    <Modulo x={X} y={300} w={760} h={600} c={cor.branco}>
      <T x={56} y={48} tam={34} c={cor.azul}>2025</T>
      <T x={50} y={300} tam={200} peso={800} c={cor.azul}>4ª</T>
      <T x={56} y={520} tam={40} c={cor.azul}>posição</T>
    </Modulo>
    <Modulo x={1020} y={300} w={760} h={600} c={cor.azul} diag={{ c: cor.azulMedio, de: 82, ate: 70 }}>
      <T x={56} y={48} tam={34} c={cor.branco}>2026</T>
      <T x={50} y={300} tam={200} peso={800} c={cor.branco}>27ª</T>
      <T x={56} y={520} tam={40} c={cor.branco}>posição</T>
    </Modulo>
    <Pilula x={1320} y={196} fundo={cor.verde} c={cor.azulEscuro} tam={38} icone={SETA_BAIXO}>23 posições</Pilula>
  </AbsoluteFill>
);

const VEICULOS = ["G1", "Bloomberg Línea", "Finsiders Brasil", "Forbes Brasil", "Infomoney"];

const A5: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.cinzaClaro} />
    <T x={X} y={380} tam={72} peso={700} c={cor.azul} w={640} lh={1.05}>pelos principais investidores do mundo,</T>
    {VEICULOS.map((v, i) => {
      const aberto = i === 3;
      const y = 150 + i * 120 + (i > 3 ? 300 : 0);
      return (
        <React.Fragment key={v}>
          <div style={{ position: "absolute", left: 990, top: y + 22, width: 30, height: 30 }}>
            {aberto ? <Icone arquivo="brand/icons/triangle-up.svg" cor={cor.verde} tamanho={30} style={{ rotate: "90deg" }} /> : null}
          </div>
          <Modulo x={1050} y={y} w={730} h={aberto ? 400 : 76} c={aberto ? cor.branco : cor.azul}>
            <T x={36} y={18} tam={34} peso={600} c={aberto ? cor.azul : cor.branco}>{v}</T>
            {aberto ? (
              <div style={{ position: "absolute", left: 36, right: 36, top: 90, bottom: 36, borderRadius: 12, backgroundColor: cor.cinzaClaro }}>
                <AReceber texto="captura da matéria · a receber" c={cor.azul} />
              </div>
            ) : null}
          </Modulo>
        </React.Fragment>
      );
    })}
  </AbsoluteFill>
);

const A6: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.cinzaClaro} />
    <T x={0} y={360} tam={120} peso={700} c={cor.azul} centro>Nos vemos em 2027!</T>
    <Logo src={LOGO_POS} cy={690} />
    <Formas
      tela="A6"
      formas={[
        { id: "a", nome: "quadrilateral-19", x: 1500, y: 760, largura: 520, cor: cor.azul, sangra: true },
        { id: "b", nome: "triangle-07", x: 230, y: 140, largura: 110, cor: cor.verde },
      ]}
      zonas={[
        { id: "t", x: 360, y: 360, largura: 1200, altura: 140 },
        { id: "logo", x: 780, y: 630, largura: 360, altura: 120 },
      ]}
    />
  </AbsoluteFill>
);

/* ================================================= Proposta B · Forma-palco */
/* fundos azuis sólidos, palavra-chave gigante, vídeo dentro da forma oficial */

const B0: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.azul} />
    <FotoForma forma="pentagon-06" x={1040} y={150} largura={760} src={FALA_PIU} />
    <T x={X} y={330} tam={56} c={cor.branco}>Quando a gente tem</T>
    <T x={X - 8} y={400} tam={168} peso={800} c={cor.branco}>propósito,</T>
    <Formas
      tela="B0"
      formas={[
        { id: "a", nome: "triangle-03", x: 170, y: 790, largura: 130, cor: cor.verde },
        { id: "b", nome: "quadrilateral-09", x: 390, y: 850, largura: 110, cor: cor.amarelo },
        { id: "c", nome: "pentagon-06", x: 700, y: 80, largura: 150, cor: cor.verde, modo: "outline", rotacao: 14 },
      ]}
      zonas={[
        { id: "foto", x: 1040, y: 150, largura: 760, altura: 790 },
        { id: "t", x: X, y: 330, largura: 870, altura: 260 },
      ]}
    />
  </AbsoluteFill>
);

const B1: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.azulEscuro} />
    <T x={X} y={190} tam={52} c={cor.branco}>Muitas pessoas não se sentem</T>
    <T x={X - 6} y={280} tam={190} peso={800} c={cor.branco}>vistas,</T>
    <div style={{ position: "absolute", left: X - 20, top: 374, width: 620, height: 24, borderRadius: 12, backgroundColor: cor.verde }} />
    <T x={X - 6} y={500} tam={130} peso={800} c={cor.branco}>respeitadas</T>
    <T x={X - 6} y={660} tam={130} peso={800} c={cor.branco}>ou valorizadas</T>
    <Formas
      tela="B1"
      formas={[
        { id: "a", nome: "quadrilateral-21", x: 1360, y: 560, largura: 700, cor: cor.azul, sangra: true },
        { id: "b", nome: "triangle-05", x: 1480, y: 170, largura: 150, cor: cor.verde, modo: "outline" },
      ]}
      zonas={[{ id: "t", x: X - 20, y: 190, largura: 1050, altura: 630 }]}
    />
  </AbsoluteFill>
);

const B2: React.FC = () => {
  const f = shapesData["quadrilateral-18"];
  const larg = 1300;
  const k = larg / f.w;
  return (
    <AbsoluteFill>
      <Foto src={FALA_PIU} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d={f.d} fill={cor.azul} transform={`translate(860 470) rotate(-12 ${larg / 2} ${(f.h * k) / 2}) scale(${k})`} />
      </svg>
      <T x={1080} y={690} tam={170} peso={800} c={cor.branco}>enxerga</T>
    </AbsoluteFill>
  );
};

const B3: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.azul} />
    <T x={X} y={140} tam={48} peso={500} c={cor.branco}>NPS</T>
    <T x={X - 20} y={250} tam={460} peso={800} c={cor.branco} lh={1}>77</T>
    <Pilula x={X} y={760} fundo={cor.verde} c={cor.azulEscuro} tam={48} icone={SETA_CIMA}>7%</Pilula>
    <T x={760} y={330} tam={44} c={cor.branco}>2026</T>
    <T x={760} y={560} tam={44} c={cor.branco}>2025: 72</T>
    <Formas
      tela="B3"
      formas={[
        { id: "a", nome: "pentagon-04", x: 1180, y: 640, largura: 900, cor: cor.azulMedio, sangra: true },
        { id: "b", nome: "triangle-08", x: 1560, y: 160, largura: 160, cor: cor.verde, modo: "outline", rotacao: 10 },
        { id: "c", nome: "quadrilateral-03", x: 1320, y: 330, largura: 90, cor: cor.amarelo },
      ]}
      zonas={[
        { id: "n", x: X - 20, y: 140, largura: 1000, altura: 560 },
        { id: "p", x: X, y: 760, largura: 260, altura: 90 },
      ]}
    />
  </AbsoluteFill>
);

const B4: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.azulMedio} />
    <T x={X} y={180} tam={48} peso={500} c={cor.branco}>Reclame Aqui</T>
    <T x={X - 14} y={290} tam={330} peso={800} c={cor.branco} lh={1}>90,1%</T>
    <T x={X} y={680} tam={64} c={cor.branco}>de problemas resolvidos</T>
    <Formas
      tela="B4"
      formas={[
        { id: "a", nome: "quadrilateral-13", x: 1330, y: 120, largura: 460, cor: cor.verde, modo: "outline", rotacao: -6 },
        { id: "b", nome: "triangle-01", x: 1540, y: 700, largura: 190, cor: cor.azul },
        { id: "c", nome: "triangle-09", x: 1350, y: 820, largura: 80, cor: cor.amarelo },
      ]}
      zonas={[{ id: "t", x: X - 14, y: 180, largura: 1130, altura: 590 }]}
    />
  </AbsoluteFill>
);

const B5: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.azulEscuro} />
    <T x={X} y={180} tam={44} c={cor.branco}>Matéria</T>
    <T x={X - 8} y={250} tam={170} peso={800} c={cor.branco} w={900} lh={0.98}>Forbes Brasil</T>
    <Modulo x={1100} y={190} w={680} h={700} r={30} c={cor.branco}>
      <AReceber texto="captura da matéria · a receber" c={cor.azul} />
    </Modulo>
    <div style={{ position: "absolute", left: X, top: 900, display: "flex", gap: 14 }}>
      {VEICULOS.map((v, i) => (
        <div key={v} style={{ width: 64, height: 10, borderRadius: 12, backgroundColor: i === 3 ? cor.verde : cor.azulMedio }} />
      ))}
    </div>
  </AbsoluteFill>
);

const B6: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.azul} />
    <T x={0} y={230} tam={72} c={cor.branco} centro>Nos vemos em</T>
    <T x={0} y={320} tam={300} peso={800} c={cor.branco} centro lh={1}>2027!</T>
    <Logo src={LOGO_NEG} cy={820} />
    <Formas
      tela="B6"
      formas={[
        { id: "a", nome: "quadrilateral-01", x: -260, y: 700, largura: 760, cor: cor.azulMedio, sangra: true },
        { id: "b", nome: "triangle-06", x: 1640, y: 70, largura: 150, cor: cor.verde },
        { id: "c", nome: "quadrilateral-16", x: 1640, y: 760, largura: 110, cor: cor.amarelo },
      ]}
      zonas={[
        { id: "t", x: 360, y: 230, largura: 1200, altura: 400 },
        { id: "logo", x: 780, y: 760, largura: 360, altura: 120 },
      ]}
    />
  </AbsoluteFill>
);

/* ======================================================== Proposta C · Faixas */
/* faixas de cor com borda diagonal que empurram a imagem; palavras que se
   separam; pílulas que se acumulam; frase que encolhe e vira título */

const C0: React.FC = () => (
  <AbsoluteFill>
    <Foto src={FALA_PIU} style={{ objectPosition: "50% 22%" }} />
    <Faixa c={cor.azul} topo={[0, 0]} base={[300, 360]}>
      <T x={X} y={110} tam={84} peso={700} c={cor.branco}>Quando a gente tem propósito,</T>
    </Faixa>
    <Faixa c={cor.branco} topo={[790, 730]} base={[H, H]}>
      <div style={{ position: "absolute", left: X, top: 850, fontFamily, fontSize: 58, color: cor.azul, whiteSpace: "nowrap" }}>
        a gente <b style={{ fontWeight: 800, fontSize: 84 }}>enxerga</b> quem atendemos de um jeito diferente.
      </div>
    </Faixa>
    <Formas
      tela="C0"
      formas={[{ id: "a", nome: "triangle-10", x: 1690, y: 120, largura: 110, cor: cor.verde }]}
      zonas={[{ id: "t", x: X, y: 110, largura: 1400, altura: 100 }]}
    />
  </AbsoluteFill>
);

const C1: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.branco} />
    <AbsoluteFill style={{ backgroundColor: cor.azul, clipPath: "polygon(55% 0, 100% 0, 100% 100%, 49% 100%)" }} />
    <T x={X} y={200} tam={48} c={cor.azul}>o melhor dos dois mundos:</T>
    <T x={X} y={430} tam={170} peso={800} c={cor.azul}>o físico</T>
    <T x={1080} y={430} tam={170} peso={800} c={cor.branco}>e o digital.</T>
    <Formas
      tela="C1"
      formas={[
        { id: "a", nome: "triangle-02", x: 560, y: 760, largura: 140, cor: cor.verde },
        { id: "b", nome: "quadrilateral-11", x: 1560, y: 150, largura: 120, cor: cor.branco, modo: "outline" },
      ]}
      zonas={[
        { id: "t0", x: X, y: 200, largura: 620, altura: 60 },
        { id: "t1", x: X, y: 430, largura: 700, altura: 200 },
        { id: "t2", x: 1080, y: 430, largura: 800, altura: 200 },
      ]}
    />
  </AbsoluteFill>
);

const C2: React.FC = () => (
  <AbsoluteFill>
    <Foto src={FALA_MARINA} style={{ objectPosition: "45% 30%" }} />
    <Faixa c={cor.azul} topo={[520, 470]} base={[H, H]} />
    <Faixa c={cor.azulMedio} topo={[700, 680]} base={[H, H]} />
    <Faixa c={cor.branco} topo={[900, 860]} base={[H, H]} />
  </AbsoluteFill>
);

const C3: React.FC = () => {
  const linhas = [
    { fundo: cor.branco, txt: cor.azul, rot: "NPS", de: "72", para: "77", tag: "7%", seta: SETA_CIMA, topo: [0, 0] as [number, number], base: [372, 340] as [number, number] },
    { fundo: cor.azul, txt: cor.branco, rot: "Reclame Aqui", de: "", para: "90,1%", tag: "", seta: "", topo: [372, 340] as [number, number], base: [712, 728] as [number, number] },
    { fundo: cor.azulMedio, txt: cor.branco, rot: "Ranking de reclamações BCB", de: "4ª", para: "27ª", tag: "23 posições", seta: SETA_BAIXO, topo: [712, 728] as [number, number], base: [H, H] as [number, number] },
  ];
  return (
    <AbsoluteFill>
      {linhas.map((l, i) => {
        const y0 = Math.max(l.topo[0], l.topo[1]);
        const yc = y0 + (Math.min(l.base[0], l.base[1]) - y0) / 2;
        return (
          <Faixa key={i} c={l.fundo} topo={l.topo} base={l.base}>
            <T x={X} y={yc - 24} tam={40} peso={500} c={l.txt} w={420}>{l.rot}</T>
            {l.de ? (
              <>
                <T x={640} y={yc - 86} tam={150} peso={300} c={l.txt}>{l.de}</T>
                <div style={{ position: "absolute", left: 880, top: yc - 30 }}>
                  <Icone arquivo={SETA_DIR} cor={l.txt} tamanho={64} />
                </div>
                <T x={990} y={yc - 110} tam={200} peso={800} c={l.txt}>{l.para}</T>
              </>
            ) : (
              <>
                <T x={640} y={yc - 110} tam={200} peso={800} c={l.txt}>{l.para}</T>
                <T x={1250} y={yc - 4} tam={48} c={l.txt}>de problemas resolvidos</T>
              </>
            )}
            {l.tag ? <Pilula x={1420} y={yc - 34} fundo={cor.verde} c={cor.azulEscuro} tam={40} icone={l.seta}>{l.tag}</Pilula> : null}
          </Faixa>
        );
      })}
    </AbsoluteFill>
  );
};

const C4: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.branco} />
    <Faixa c={cor.azul} topo={[0, 0]} base={[230, 280]} />
    <div style={{ position: "absolute", left: 0, top: 420, width: W, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
      {[["Open finance,", cor.azul], ["CDB", cor.azulMedio]].map(([t, c]) => (
        <div key={t} style={{ position: "relative", height: 112, padding: "0 44px", borderRadius: 16, backgroundColor: c, display: "flex", alignItems: "center", fontFamily, fontWeight: 700, fontSize: 64, color: cor.branco }}>
          {t}
        </div>
      ))}
      <div style={{ fontFamily, fontSize: 64, color: cor.azul, padding: "0 6px" }}>e</div>
      <div style={{ height: 112, padding: "0 44px", borderRadius: 16, backgroundColor: cor.azulEscuro, display: "flex", alignItems: "center", fontFamily, fontWeight: 700, fontSize: 64, color: cor.branco }}>
        carteiras digitais
      </div>
    </div>
    <T x={0} y={600} tam={60} c={cor.azul} centro>para todos os clientes.</T>
    <Formas
      tela="C4"
      formas={[
        { id: "a", nome: "pentagon-01", x: 1600, y: 760, largura: 200, cor: cor.verde },
        { id: "b", nome: "triangle-04", x: 200, y: 800, largura: 110, cor: cor.azul, modo: "outline" },
      ]}
      zonas={[
        { id: "p", x: 260, y: 420, largura: 1400, altura: 112 },
        { id: "t", x: 600, y: 600, largura: 720, altura: 70 },
      ]}
    />
  </AbsoluteFill>
);

const C5: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.branco} />
    <Faixa c={cor.cinzaClaro} topo={[250, 300]} base={[H, H]} />
    <T x={X} y={110} tam={60} peso={700} c={cor.azul}>pelos principais investidores do mundo,</T>
    {VEICULOS.map((v, i) => {
      const x = X + i * 336;
      return (
        <React.Fragment key={v}>
          <Modulo x={x} y={400} w={304} h={420} c={i === 3 ? cor.azul : cor.branco} diag={{ c: i === 3 ? cor.azulMedio : cor.cinzaClaro, de: 84, ate: 72 }}>
            <AReceber texto="captura" c={i === 3 ? cor.branco : cor.azul} />
          </Modulo>
          <T x={x} y={850} tam={32} peso={i === 3 ? 700 : 400} c={cor.azul}>{v}</T>
        </React.Fragment>
      );
    })}
  </AbsoluteFill>
);

const C6: React.FC = () => (
  <AbsoluteFill>
    <Fundo c={cor.branco} />
    <Faixa c={cor.azul} topo={[0, 0]} base={[250, 300]} />
    <Faixa c={cor.azul} topo={[800, 760]} base={[H, H]} />
    <T x={0} y={400} tam={120} peso={700} c={cor.azul} centro>Nos vemos em 2027!</T>
    <Logo src={LOGO_POS} cy={650} w={680} />
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- índice */

export const QUADROS: { id: string; C: React.FC }[] = [
  { id: "A0", C: A0 }, { id: "A1", C: A1 }, { id: "A2", C: A2 }, { id: "A3", C: A3 }, { id: "A4", C: A4 }, { id: "A5", C: A5 }, { id: "A6", C: A6 },
  { id: "B0", C: B0 }, { id: "B1", C: B1 }, { id: "B2", C: B2 }, { id: "B3", C: B3 }, { id: "B4", C: B4 }, { id: "B5", C: B5 }, { id: "B6", C: B6 },
  { id: "C0", C: C0 }, { id: "C1", C: C1 }, { id: "C2", C: C2 }, { id: "C3", C: C3 }, { id: "C4", C: C4 }, { id: "C5", C: C5 }, { id: "C6", C: C6 },
];

export const RetrospectivaStoryboard: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: cor.branco }}>
    {QUADROS.map(({ id, C }, i) => (
      <Sequence key={id} from={i * QUADRO} durationInFrames={QUADRO} name={id}>
        <C />
      </Sequence>
    ))}
  </AbsoluteFill>
);
