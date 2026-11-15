import React from "react";
import { Series } from "remotion";
import tokens from "../../brand/tokens.json";
import { V3Refinado } from "../versoes/v3/V3Refinado";
import { BufferLogo } from "./BufferLogo";

/** Vinheta pré-live completa: Fase 1 (loop de 10 min, V3) + Fase 2 (5 min só logo). */
export const framesFase1 = (fps: number) => Math.round(tokens.timing.contentLoopMinutes * 60 * fps);
export const framesFase2 = (fps: number) => Math.round(tokens.timing.bufferOnlyLogoMinutes * 60 * fps);

export const VinhetaCompletaV3: React.FC = () => {
  const fps = tokens.video.fps;
  return (
    <Series>
      <Series.Sequence durationInFrames={framesFase1(fps)} name="Fase 1 · loop de conteúdo (10 min)">
        <V3Refinado duracao={framesFase1(fps)} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={framesFase2(fps)} name="Fase 2 · buffer só logo (5 min)">
        <BufferLogo />
      </Series.Sequence>
    </Series>
  );
};
