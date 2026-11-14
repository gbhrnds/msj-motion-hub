import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../fonts";
import tokens from "../../brand/tokens.json";
import { MorphingShape } from "../motion/MorphingShape";

type CountdownOverlayProps = {
  durationInSeconds: number; // Tempo total da fase de conteudo (ex: 600s para 10min)
};

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  durationInSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calcula quanto tempo ja passou e quanto falta
  const elapsedSeconds = Math.floor(frame / fps);
  const remainingSeconds = Math.max(0, durationInSeconds - elapsedSeconds);

  // Formata para MM:SS
  const minutes = Math.floor(remainingSeconds / 60).toString().padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");
  const timeString = `${minutes}:${seconds}`;

  // Logica do Relatorio: nos ultimos 10s, o relogio vira "Hero" (gigante no centro)
  const isHero = remainingSeconds <= 10;

  if (isHero) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: tokens.colors.azulAgibank.hex,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100, // Garante que fica por cima de tudo
        }}
      >
        {/* Forma decorativa fina atras do numero (conforme relatorio) */}
        <div style={{ position: "absolute", opacity: 0.5 }}>
          <MorphingShape
            color={tokens.colors.verde.hex}
            width={800}
            height={800}
            framesPerMorph={15}
          />
        </div>

        <h1
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 280, // Relogio Gigante
            color: tokens.colors.branco.hex,
            margin: 0,
            fontVariantNumeric: "tabular-nums", // Evita que os numeros tremam (Dica do Claude!)
            zIndex: 101,
          }}
        >
          {timeString}
        </h1>
      </AbsoluteFill>
    );
  }

  // Estado "Corner" (Loop normal)
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 100 }}>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          backgroundColor: tokens.colors.branco.hex,
          padding: "20px 40px",
          borderRadius: tokens.shapes.cornerRadiusPxRange.default,
          transform: "rotate(-2deg)", // Leve rotacao de "plaquinha"
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 64,
            color: tokens.colors.azulAgibank.hex,
            margin: 0,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {timeString}
        </h2>
      </div>
    </AbsoluteFill>
  );
};
