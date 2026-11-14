import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { fontFamily } from "../fonts";
import tokens from "../../brand/tokens.json";

type TelaConteudoProps = {
  corpo: string;
  bullets: string[];
  logo?: string;
};

/**
 * Layout em diagonal azul/branco, pedido pela redação para manter
 * consistência visual com a campanha de cursos obrigatórios.
 */
export const TelaConteudo: React.FC<TelaConteudoProps> = ({ corpo, bullets, logo }) => {
  const PADDING = tokens.video.safeMarginPx.value;
  const [introLinha, ...restoLinhas] = corpo.split("\n\n");

  return (
    <AbsoluteFill style={{ backgroundColor: tokens.colors.branco.hex }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: tokens.colors.azulAgibank.hex,
          clipPath: "polygon(0 0, 58% 0, 32% 100%, 0% 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "42%",
          height: "100%",
          padding: PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {logo && (
          <TextReveal>
            <Img src={logo} style={{ height: 56, marginBottom: 24 }} />
          </TextReveal>
        )}
        <TextReveal delayFrames={6}>
          <p
            style={{
              fontFamily,
              fontWeight: 500,
              fontSize: tokens.typography.typeScaleVideo.subtitulo.sizePx,
              color: tokens.colors.branco.hex,
              margin: 0,
            }}
          >
            {introLinha}
          </p>
        </TextReveal>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "55%",
          height: "100%",
          padding: PADDING,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {restoLinhas.map((linha, i) => (
          <TextReveal key={linha} delayFrames={12 + i * 6}>
            <p
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: tokens.typography.typeScaleVideo.corpo.sizePx,
                color: tokens.colors.azulAgibank.hex,
                margin: "0 0 16px",
              }}
            >
              {linha}
            </p>
          </TextReveal>
        ))}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {bullets.map((bullet, i) => (
            <TextReveal key={bullet} delayFrames={18 + i * 6}>
              <p
                style={{
                  fontFamily,
                  fontWeight: 400,
                  fontSize: tokens.typography.typeScaleVideo.corpo.sizePx,
                  color: tokens.colors.azulEscuro.hex,
                  margin: 0,
                }}
              >
                {bullet}
              </p>
            </TextReveal>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
