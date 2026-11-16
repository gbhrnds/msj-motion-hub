import React from "react";
import { Series } from "remotion";
import tokens from "../../brand/tokens.json";
import { V3Refinado } from "../versoes/v3/V3Refinado";
import { V1NuDay } from "../versoes/v1/V1NuDay";
import { BufferLogo } from "./BufferLogo";

/** Vinheta pré-live completa: Fase 1 (loop de 10 min) + Fase 2 (5 min só logo). */
export const framesFase1 = (fps: number) => Math.round(tokens.timing.contentLoopMinutes * 60 * fps);
export const framesFase2 = (fps: number) => Math.round(tokens.timing.bufferOnlyLogoMinutes * 60 * fps);

const Completa: React.FC<{ Fase1: React.FC<{ duracao?: number }> }> = ({ Fase1 }) => {
  const fps = tokens.video.fps;
  return (
    <Series>
      <Series.Sequence durationInFrames={framesFase1(fps)} name="Fase 1 · loop de conteúdo (10 min)">
        <Fase1 duracao={framesFase1(fps)} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={framesFase2(fps)} name="Fase 2 · buffer só logo (5 min)">
        <BufferLogo />
      </Series.Sequence>
    </Series>
  );
};

export const VinhetaCompletaV3: React.FC = () => <Completa Fase1={V3Refinado} />;
export const VinhetaCompletaV1: React.FC = () => <Completa Fase1={V1NuDay} />;
