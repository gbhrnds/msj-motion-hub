import React from "react";
import { Composition } from "remotion";
import { MSJComposition } from "./Composition";
import { CatalogoFormas } from "./components/CatalogoFormas";
import { ChecaFormas } from "./components/ChecaFormas";
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
    </>
  );
};
