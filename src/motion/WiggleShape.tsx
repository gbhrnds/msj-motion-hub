import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

type WiggleShapeProps = {
  children: React.ReactNode;
  amplitudeDeg?: number;
  amplitudePx?: number;
  cyclesPerSecond?: number;
  /** Deslocamento de fase (radianos) para formas vizinhas não moverem juntas. */
  fase?: number;
};

/**
 * Aplica um wiggle sutil e continuo. Uso restrito a formas e grafismos
 * secundarios. Nunca usar em texto (regra do CLAUDE.md).
 */
export const WiggleShape: React.FC<WiggleShapeProps> = ({
  children,
  amplitudeDeg = 3,
  amplitudePx = 4,
  cyclesPerSecond = 0.15,
  fase = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (frame / fps) * cyclesPerSecond * 2 * Math.PI + fase;

  return (
    <div
      style={{
        rotate: `${Math.sin(w) * amplitudeDeg}deg`,
        translate: `0px ${Math.sin(w + Math.PI / 3) * amplitudePx}px`,
      }}
    >
      {children}
    </div>
  );
};
