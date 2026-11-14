import React from "react";
import { AbsoluteFill } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { WiggleShape } from "../motion/WiggleShape";
import { fontFamily } from "../fonts";
import tokens from "../../brand/tokens.json";

type TelaCampanhaProps = {
  corpo: string;
  logo?: string;
};

export const TelaCampanha: React.FC<TelaCampanhaProps> = ({ corpo }) => {
  const linhas = corpo.split("\n\n");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.azulAgibank.hex,
        padding: tokens.video.safeMarginPx.value,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <WiggleShape amplitudeDeg={2} amplitudePx={6}>
        <div
          style={{
            position: "absolute",
            top: 90,
            right: 100,
            width: 120,
            height: 120,
            background: tokens.colors.verdeClaro.hex,
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />
      </WiggleShape>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {linhas.map((linha, i) => (
          <TextReveal key={linha} delayFrames={i * 10}>
            <p
              style={{
                fontFamily,
                fontWeight: i === 0 ? 700 : 400,
                fontSize: i === 0
                  ? tokens.typography.typeScaleVideo.subtitulo.sizePx
                  : tokens.typography.typeScaleVideo.corpo.sizePx,
                color: tokens.colors.branco.hex,
                textAlign: "center",
                maxWidth: "75%",
                margin: 0,
              }}
            >
              {linha}
            </p>
          </TextReveal>
        ))}
      </div>
    </AbsoluteFill>
  );
};
