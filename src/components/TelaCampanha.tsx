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

// Ajustado no Figma (2026-11-14): formas grandes saindo pelo canto direito.
export const FORMAS: GrafismoSpec[] = [
  { id: "c1", nome: "pentagon-05", x: 1312, y: 684, largura: 754, cor: cor.azulMedio, rotacao: -8, sangra: true, delayFrames: 2, fase: 0.2 },
  { id: "c4", nome: "triangle-02", x: 1802, y: 245, largura: 44, cor: cor.azulMedio, rotacao: -7.2, delayFrames: 9, fase: 3.1 },
  { id: "c5", nome: "quadrilateral-16", x: 1583, y: 60, largura: 205, cor: cor.verde, rotacao: 7.7, sangra: true, delayFrames: 6, fase: 4.0 },
  { id: "c6", nome: "quadrilateral-05", x: 1466, y: 217, largura: 386, cor: cor.branco, rotacao: -137.1, sangra: true, delayFrames: 4, fase: 4.8 },
];
export const ZONAS: ZonaLivre[] = [
  { id: "texto", x: 269, y: 348, largura: 830, altura: 404 },
];

/** Primeira oração em Light, restante em Bold (pesos misturados). Texto intacto. */
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
          left: 269,
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
            {leve && <span style={{ fontWeight: 300 }}>{leve}</span>}
            {forte}
          </h1>
        </TextReveal>
        {corpo && (
          <TextReveal delayFrames={16} distancia={16} style={{ marginTop: 40 }}>
            <p
              style={{
                fontFamily,
                fontWeight: 300,
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
