import React from "react";
import { AbsoluteFill } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { Grafismo } from "../motion/Grafismo";
import { BrandShape } from "../brand/BrandShape";
import { cor, tipo } from "../brand/theme";
import { fontFamily } from "../fonts";

type TelaCampanhaProps = {
  chamada: string;
  corpo?: string;
};

/**
 * Campanha sazonal sem logo próprio (ex.: Novembro Azul). Texto à esquerda,
 * grafismos agrupados à direita — nunca sobre o texto.
 */
export const TelaCampanha: React.FC<TelaCampanhaProps> = ({ chamada, corpo }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: cor.azul }}>
      <Grafismo x={1390} y={170} delayFrames={2} fase={0.3}>
        <BrandShape nome="pentagon-05" largura={640} cor={cor.azulMedio} rotacao={-10} />
      </Grafismo>
      <Grafismo x={1250} y={560} delayFrames={6} fase={1.9}>
        <BrandShape nome="quadrilateral-14" largura={330} cor={cor.verde} modo="outline" rotacao={16} />
      </Grafismo>
      <Grafismo x={1330} y={130} delayFrames={9} fase={3.3}>
        <BrandShape nome="triangle-10" largura={120} cor={cor.branco} rotacao={-24} />
      </Grafismo>

      <div style={{ position: "absolute", left: 140, top: 0, bottom: 0, width: 1060, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <TextReveal delayFrames={4} distancia={32}>
          <h1
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: tipo.titulo.sizePx,
              lineHeight: tipo.titulo.lineHeight,
              color: cor.branco,
              margin: 0,
              letterSpacing: -1,
            }}
          >
            {chamada}
          </h1>
        </TextReveal>
        {corpo && (
          <TextReveal delayFrames={16} distancia={18} style={{ marginTop: 44 }}>
            <p
              style={{
                fontFamily,
                fontWeight: 400,
                fontSize: 44,
                lineHeight: 1.3,
                color: cor.branco,
                margin: 0,
                maxWidth: 900,
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
