import { useRefinado } from "./estilo";
import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { motionTokens } from "../brand/theme";
import { WiggleShape } from "./WiggleShape";

const ent = motionTokens.entradaGrafismo;
const [x1, y1, x2, y2] = ent.easingBezier;

type GrafismoProps = {
  children: React.ReactNode;
  /** Posição absoluta na tela (px). Pode ser negativa para sangrar pela borda. */
  x: number;
  y: number;
  delayFrames?: number;
  /** Wiggle contínuo sutil (tokens.motion.wiggleShape). Desligue em módulos que seguram texto. */
  wiggle?: boolean;
  /** Fase do wiggle, para formas vizinhas não balançarem em uníssono. */
  fase?: number;
};

/**
 * Papel "decoration" (skill choreograph): entra só com fade + scale leve,
 * sem deslocamento, e depois fica com o wiggle sutil do tokens.
 */
export const Grafismo: React.FC<GrafismoProps> = ({
  children,
  x,
  y,
  delayFrames = 0,
  wiggle = true,
  fase = 0,
}) => {
  const frame = useCurrentFrame();
  const opts = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(x1, y1, x2, y2),
  } as const;
  const t = frame - delayFrames;
  // V3: sem fade nas entradas (a transição por forma já faz a troca); a forma cresce do zero
  const refinado = useRefinado();

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: refinado ? undefined : interpolate(t, [0, ent.durationFrames], [0, 1], opts),
        scale: interpolate(
          t,
          [0, ent.durationFrames],
          [refinado ? 0 : ent.scaleFrom, 1],
          opts,
        ),
      }}
    >
      {wiggle ? (
        <WiggleShape
          amplitudeDeg={motionTokens.wiggleShape.amplitudeDeg}
          amplitudePx={motionTokens.wiggleShape.amplitudePx}
          cyclesPerSecond={motionTokens.wiggleShape.speedCyclesPerSecond}
          fase={fase}
        >
          {children}
        </WiggleShape>
      ) : (
        children
      )}
    </div>
  );
};
