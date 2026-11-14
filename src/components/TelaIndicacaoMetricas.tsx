import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { WiggleShape } from "../motion/WiggleShape";
import { fontFamily } from "../fonts";
import tokens from "../../brand/tokens.json";

type TelaIndicacaoMetricasProps = {
  corpo: string;
  bullets: string[];
  foto: string;
  logo: string;
};

const NUMERO_REGEX = /^([\dXx]+%?)\s+(.*)$/;

export const TelaIndicacaoMetricas: React.FC<TelaIndicacaoMetricasProps> = ({
  corpo,
  bullets,
  foto,
  logo,
}) => {
  const PADDING = tokens.video.safeMarginPx.value;

  return (
    <AbsoluteFill style={{ backgroundColor: tokens.colors.branco.hex }}>
      <AbsoluteFill style={{ flexDirection: "row" }}>
        <div
          style={{
            width: "52%",
            padding: PADDING,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <TextReveal>
            <Img src={logo} style={{ height: 56, marginBottom: 24 }} />
          </TextReveal>

          <TextReveal delayFrames={6}>
            <p
              style={{
                fontFamily,
                fontWeight: 400,
                fontSize: tokens.typography.typeScaleVideo.corpo.sizePx,
                color: tokens.colors.azulEscuro.hex,
                maxWidth: "90%",
                margin: 0,
              }}
            >
              {corpo}
            </p>
          </TextReveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 32 }}>
            {bullets.map((bullet, i) => {
              const match = bullet.match(NUMERO_REGEX);
              return (
                <TextReveal key={bullet} delayFrames={12 + i * 6}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                    <span
                      style={{
                        fontFamily,
                        fontWeight: 800,
                        fontSize: 56,
                        color: tokens.colors.azulAgibank.hex,
                        lineHeight: 1,
                      }}
                    >
                      {match ? match[1] : "•"}
                    </span>
                    <span
                      style={{
                        fontFamily,
                        fontWeight: 400,
                        fontSize: tokens.typography.typeScaleVideo.corpo.sizePx,
                        color: tokens.colors.azulEscuro.hex,
                      }}
                    >
                      {match ? match[2] : bullet}
                    </span>
                  </div>
                </TextReveal>
              );
            })}
          </div>
        </div>

        <div style={{ width: "48%", position: "relative", overflow: "hidden" }}>
          <Img
            src={foto}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: tokens.shapes.cornerRadiusPxRange.default,
            }}
          />
        </div>
      </AbsoluteFill>

      <WiggleShape amplitudeDeg={2} amplitudePx={5}>
        <div
          style={{
            position: "absolute",
            top: 60,
            left: PADDING,
            width: 64,
            height: 64,
            background: tokens.colors.verde.hex,
            borderRadius: tokens.shapes.cornerRadiusPxRange.default,
          }}
        />
      </WiggleShape>
    </AbsoluteFill>
  );
};
