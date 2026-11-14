import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { motionTokens } from "../brand/theme";

type TextRevealProps = {
  children: React.ReactNode;
  delayFrames?: number;
  durationFrames?: number;
  /** Deslocamento inicial em px. Lead desloca mais; support, menos (skill choreograph). */
  distancia?: number;
  style?: React.CSSProperties;
};

/**
 * Entrada unica (fade + slide up sutil). Depois disso o texto fica
 * completamente estatico. Nunca usar motion continuo em texto (regra do
 * CLAUDE.md: pessoas precisam conseguir ler sem problema).
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  delayFrames = 0,
  durationFrames = motionTokens.textReveal.durationFrames,
  distancia = 24,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delayFrames,
    fps,
    durationInFrames: durationFrames,
    config: { damping: 200, stiffness: 120 },
  });

  return (
    <div
      style={{
        opacity: progress,
        translate: `0px ${(1 - progress) * distancia}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
