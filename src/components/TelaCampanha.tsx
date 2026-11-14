import React from "react";
import { AbsoluteFill } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { CamadaGrafismos } from "../motion/CamadaGrafismos";
import { cor } from "../brand/theme";
import type { GrafismoSpec, ZonaLivre } from "../brand/grafismos";
import { fontFamily } from "../fonts";

type TelaCampanhaProps = {
  chamada: string;
  corpo?: string;
  duracaoFrames: number;
};

// "Formas ao redor do título" (Brandbook p.48): tamanhos variados, sem sobreposição.
const FORMAS: GrafismoSpec[] = [
  {
    id: "c1",
    nome: "pentagon-05",
    x: 1380,
    y: 300,
    largura: 380,
    cor: cor.azulMedio,
    rotacao: -10,
    delayFrames: 2,
    fase: 0.2,
  },
  {
    id: "c2",
    nome: "quadrilateral-14",
    x: 1500,
    y: 740,
    largura: 220,
    cor: cor.verde,
    modo: "outline",
    rotacao: 16,
    delayFrames: 6,
    fase: 1.3,
  },
  {
    id: "c3",
    nome: "triangle-10",
    x: 1240,
    y: 150,
    largura: 110,
    cor: cor.branco,
    rotacao: -24,
    delayFrames: 9,
    fase: 2.4,
  },
  {
    id: "c4",
    nome: "triangle-02",
    x: 1790,
    y: 70,
    largura: 150,
    cor: cor.azulMedio,
    rotacao: 14,
    delayFrames: 4,
    fase: 3.1,
  },
  {
    id: "c5",
    nome: "quadrilateral-16",
    x: 1240,
    y: 860,
    largura: 80,
    cor: cor.verde,
    rotacao: -6,
    delayFrames: 11,
    fase: 4.0,
  },
  {
    id: "c6",
    nome: "quadrilateral-05",
    x: 700,
    y: 930,
    largura: 56,
    cor: cor.branco,
    rotacao: 28,
    delayFrames: 12,
    fase: 4.8,
  },
];
const ZONAS: ZonaLivre[] = [
  { id: "texto", x: 140, y: 290, largura: 1060, altura: 520 },
];

/** Primeira oração em Regular, restante em Bold (pesos misturados). Texto intacto. */
const dividir = (t: string) => {
  const i = t.indexOf(", ", t.indexOf(",") + 1);
  return i > 0 ? [t.slice(0, i + 1), t.slice(i + 1)] : ["", t];
};

/** Campanha sazonal sem logo próprio (ex.: Novembro Azul). */
export const TelaCampanha: React.FC<TelaCampanhaProps> = ({
  chamada,
  corpo,
  duracaoFrames,
}) => {
  const [leve, forte] = dividir(chamada);
  return (
    <AbsoluteFill style={{ backgroundColor: cor.azul }}>
      <CamadaGrafismos
        tela="tela_campanha"
        formas={FORMAS}
        zonasLivres={ZONAS}
        duracaoFrames={duracaoFrames}
      />

      <div
        style={{
          position: "absolute",
          left: 140,
          top: 290,
          width: 1040,
          height: 520,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <TextReveal delayFrames={4} distancia={28}>
          <h1
            style={{
              fontFamily,
              fontSize: 80,
              lineHeight: 1.08,
              color: cor.branco,
              margin: 0,
              fontWeight: 700,
            }}
          >
            {leve && <span style={{ fontWeight: 400 }}>{leve}</span>}
            {forte}
          </h1>
        </TextReveal>
        {corpo && (
          <TextReveal delayFrames={16} distancia={16} style={{ marginTop: 40 }}>
            <p
              style={{
                fontFamily,
                fontWeight: 400,
                fontSize: 40,
                lineHeight: 1.3,
                color: cor.branco,
                margin: 0,
                maxWidth: 860,
              }}
            >
              {corpo}
            </p>
          </TextReveal>
        )}
      </div>
    </AbsoluteFill>
  );
};
