import React from "react";
import { Composition } from "remotion";
import { MSJComposition } from "./Composition";
import { CatalogoFormas } from "./components/CatalogoFormas";
import { ChecaFormas } from "./components/ChecaFormas";
import { ExportaFigma } from "./export/ExportaFigma";
import { duracaoReview } from "./versoes/VersaoBase";
import { V1NuDay } from "./versoes/v1/V1NuDay";
import { V2Modulos } from "./versoes/v2/V2Modulos";
import { V3Refinado } from "./versoes/v3/V3Refinado";
import tokens from "../brand/tokens.json";

const fps = tokens.video.fps;
// Fase 1 completa: 10 minutos de loop de conteudo (CLAUDE.md / tokens.json).
// O buffer de 5min so-logo (Fase 2) e o render final entram no Agente 06.
const durationInSeconds = tokens.timing.contentLoopMinutes * 60;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MSJ-2025-11-Abertura-Fase1"
        component={MSJComposition}
        durationInFrames={Math.round(durationInSeconds * fps)}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
      />
      <Composition
        id="CatalogoFormas"
        component={CatalogoFormas}
        durationInFrames={1}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
      />
      <Composition
        id="ChecaFormas"
        component={ChecaFormas}
        durationInFrames={1}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
      />
      {/* Etapa 3: versões novas da vinheta (1 volta do loop + 10s finais) */}
      <Composition
        id="Versao1-NuDay"
        component={V1NuDay}
        durationInFrames={duracaoReview(fps)}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
      />
      <Composition
        id="Versao2-Modulos"
        component={V2Modulos}
        durationInFrames={duracaoReview(fps)}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
      />
      <Composition
        id="Versao3-MotionRefinado"
        component={V3Refinado}
        durationInFrames={duracaoReview(fps)}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
      />
      {/* Só para exportar telas ao Figma (npm run figma:exporta) */}
      <Composition
        id="ExportaFigma"
        component={ExportaFigma}
        durationInFrames={Math.round(durationInSeconds * fps)}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
        defaultProps={{ frame: 0, tela: "tela", coletor: "http://localhost:4599" }}
      />
    </>
  );
};
