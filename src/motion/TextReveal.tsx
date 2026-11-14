import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";

type TextRevealProps = {
  children: React.ReactNode;
  delayFrames?: number;
  durationFrames?: number;
};

/**
 * Entrada unica (fade + slide up sutil). Depois disso o texto fica
 * completamente estatico. Nunca usar motion continuo em texto (regra do
 * CLAUDE.md: pessoas precisam conseguir ler sem problema).
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  delayFrames = 0,
  durationFrames = 18,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    durationInFrames: durationFrames,
    config: { damping: 200, stiffness: 120 },
  });

  const opacity = progress;
  const translateY = (1 - progress) * 24;

  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </div>
  );
};
