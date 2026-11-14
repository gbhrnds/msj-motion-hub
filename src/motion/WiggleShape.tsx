import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

type WiggleShapeProps = {
  children: React.ReactNode;
  amplitudeDeg?: number;
  amplitudePx?: number;
  cyclesPerSecond?: number;
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
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const angle = Math.sin(t * cyclesPerSecond * 2 * Math.PI) * amplitudeDeg;
  const offsetY =
    Math.sin(t * cyclesPerSecond * 2 * Math.PI + Math.PI / 3) * amplitudePx;

  return (
    <div style={{ transform: `rotate(${angle}deg) translateY(${offsetY}px)` }}>
      {children}
    </div>
  );
};
