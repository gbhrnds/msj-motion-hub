import React from "react";
import { Series } from "remotion";
import tokens from "../../brand/tokens.json";
import { V3Refinado } from "../versoes/v3/V3Refinado";
import { V1NuDay } from "../versoes/v1/V1NuDay";
import { BufferLogo } from "./BufferLogo";
import { LOGO_MSJ, Projeto, temLogoEvento, usarProjeto } from "../dados";

/** Vinheta pré-live completa: Fase 1 (loop de 10 min) + Fase 2 (5 min só logo). */
export const framesFase1 = (fps: number) => Math.round(tokens.timing.contentLoopMinutes * 60 * fps);
export const framesFase2 = (fps: number) => Math.round(tokens.timing.bufferOnlyLogoMinutes * 60 * fps);

type PropsCompleta = { projeto?: Projeto };

const Completa: React.FC<{ Fase1: React.FC<{ duracao?: number }>; projeto?: Projeto; logoEvento?: boolean }> = ({
  Fase1,
  projeto,
  logoEvento,
}) => {
  usarProjeto(projeto);
  const fps = tokens.video.fps;
  return (
    <Series>
      <Series.Sequence durationInFrames={framesFase1(fps)} name="Fase 1 · loop de conteúdo (10 min)">
        <Fase1 duracao={framesFase1(fps)} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={framesFase2(fps)} name="Fase 2 · buffer só logo (5 min)">
        <BufferLogo logo={logoEvento && temLogoEvento() ? LOGO_MSJ.negativo : undefined} />
      </Series.Sequence>
    </Series>
  );
};

/** V3: padrão para outras lives; com logo de evento no projeto, ele substitui o MSJ (inclusive na Fase 2). */
export const VinhetaCompletaV3: React.FC<PropsCompleta> = ({ projeto }) => <Completa Fase1={V3Refinado} projeto={projeto} logoEvento />;
/** V1: exclusiva do Momento Sempre Juntos. */
export const VinhetaCompletaV1: React.FC<PropsCompleta> = ({ projeto }) => <Completa Fase1={V1NuDay} projeto={projeto} />;
