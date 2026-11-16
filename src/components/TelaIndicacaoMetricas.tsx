import React from "react";
import { quebraBoa } from "../brand/quebraDeLinha";
import { AbsoluteFill } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { CamadaGrafismos } from "../motion/CamadaGrafismos";
import type { GrafismoSpec, ZonaLivre } from "../brand/grafismos";
import { Logo } from "../brand/Logo";
import { FotoNaForma } from "../brand/FotoNaForma";
import { cor } from "../brand/theme";
import { fontFamily } from "../fonts";

type TelaIndicacaoMetricasProps = {
  corpo: string;
  bullets: string[];
  foto: string;
  /** PNG da pessoa recortada (mesmo enquadramento da foto), por cima da forma. */
  recorte?: string;
  logo: string;
};

// Módulos da métrica (cards, cantos 17px, divisão diagonal entre eles), copiados
// do SVG do Figma "V3 - Tradicional/04 · Programa de indicação.svg" (2026-11-16)
const MODULO_NUMERO =
  "M138 678C138 668.611 145.611 661 155 661H316.553C323.473 661 329.702 665.195 332.305 671.607L387.505 807.607C392.042 818.785 383.817 831 371.753 831H155C145.611 831 138 823.389 138 814V678Z";
const MODULO_ROTULO =
  "M374.527 684.862C369.57 673.625 377.799 661 390.081 661H772C781.389 661 789 668.611 789 678V814C789 823.389 781.389 831 772 831H450.081C443.346 831 437.246 827.024 434.527 820.862L374.527 684.862Z";
const Modulo: React.FC<{ d: string; cor: string }> = ({ d, cor: c }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <path d={d} fill={c} />
  </svg>
);

/** "10 ganhadores no 2º trimestre" → ["10", "ganhadores no 2º trimestre"] (texto intacto). */
const separar = (b: string): [string, string] => {
  const m = b.match(/^(\S+)\s+(.*)$/);
  return m ? [m[1], m[2]] : [b, ""];
};


// Ajustado no Figma (2026-11-14): foto recortada pela forma pentagon-06 (sangrando
// à direita e embaixo), recorte da pessoa saindo da forma, forma verde grande no canto.
export const FOTO = {
  forma: "pentagon-06" as const,
  x: 960,
  y: 97,
  largura: 1040,
  // enquadramento da imagem (mesma escala para a foto e o recorte)
  imagem: { x: 595, y: 0, largura: 1620, altura: 1080 },
};
export const FORMAS: GrafismoSpec[] = [
  { id: "i1", nome: "triangle-01", x: 1094, y: 147, largura: 80, cor: cor.azulMedio, rotacao: -81.6, delayFrames: 10, fase: 1.4 },
  { id: "i2", nome: "quadrilateral-05", x: 1589, y: -168, largura: 398, cor: cor.verde, rotacao: -82.4, sangra: true, delayFrames: 4, fase: 0.5 },
];
export const ZONAS: ZonaLivre[] = [
  { id: "logo", x: 140, y: 284, largura: 360, altura: 118 },
  { id: "corpo", x: 140, y: 452, largura: 780, altura: 160 },
  { id: "metricas", x: 138, y: 661, largura: 651, altura: 170 },
];

/**
 * Programa de Indicação — modelo da aplicação "evento" do Brandbook:
 * foto em módulo grande + métricas em módulos coloridos com número em destaque.
 */
export const TelaIndicacaoMetricas: React.FC<TelaIndicacaoMetricasProps> = ({
  corpo,
  bullets,
  foto,
  recorte,
  logo,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: cor.azul }}>
      <TextReveal distancia={0} style={{ position: "absolute", inset: 0 }}>
        <FotoNaForma {...FOTO} foto={foto} recorte={recorte} />
      </TextReveal>
      <CamadaGrafismos
        tela="tela_indicacao_metricas"
        formas={FORMAS}
        zonasLivres={ZONAS}
      />

      <div style={{ position: "absolute", left: 140, top: 284 }}>
        <TextReveal distancia={0}>
          <Logo arquivo={logo} versao="negativa" altura={118} />
        </TextReveal>
      </div>

      {/* lead */}
      <TextReveal
        delayFrames={6}
        distancia={28}
        style={{ position: "absolute", left: 140, top: 452, width: 780 }}
      >
        <p
          style={{
            fontFamily,
            fontWeight: 300,
            fontSize: 44,
            lineHeight: 1.2,
            color: cor.branco,
            margin: 0,
          }}
        >
          {quebraBoa(corpo)}
        </p>
      </TextReveal>

      {/* support: métrica — layout final do Figma (2026-11-16): número num
          módulo azul médio e rótulo num módulo verde, encaixados pela diagonal */}
      {bullets.slice(0, 1).map((b) => {
        const [numero, rotulo] = separar(b);
        return (
          <React.Fragment key={b}>
            <TextReveal delayFrames={18} distancia={0} style={{ position: "absolute", inset: 0 }}>
              <Modulo d={MODULO_NUMERO} cor={cor.azulMedio} />
            </TextReveal>
            <TextReveal delayFrames={22} distancia={0} style={{ position: "absolute", inset: 0 }}>
              <Modulo d={MODULO_ROTULO} cor={cor.verde} />
            </TextReveal>
            <TextReveal delayFrames={24} distancia={20} style={{ position: "absolute", left: 138, top: 661, width: 236, height: 170, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily, fontWeight: 700, fontSize: 86, lineHeight: 1, color: cor.verde, letterSpacing: -1 }}>{numero}</div>
            </TextReveal>
            <TextReveal delayFrames={28} distancia={20} style={{ position: "absolute", left: 420, top: 661, width: 352, height: 170, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily, fontWeight: 600, fontSize: 30, lineHeight: 1.25, color: cor.azulEscuro, textAlign: "center" }}>{quebraBoa(rotulo)}</div>
            </TextReveal>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
