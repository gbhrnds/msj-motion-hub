import React from "react";
import { Composition } from "remotion";
import { MSJComposition } from "./Composition";
import { CatalogoFormas } from "./components/CatalogoFormas";
import { ChecaFormas } from "./components/ChecaFormas";
import { ExportaFigma } from "./export/ExportaFigma";
import { duracaoReview } from "./versoes/VersaoBase";
import { V1NuDay } from "./versoes/v1/V1NuDay";
import { V2Modulos } from "./versoes/v2/V2Modulos";
import { RELOGIO_NO_LOOP_V3, V3Refinado } from "./versoes/v3/V3Refinado";
import { framesFase1, framesFase2, VinhetaCompletaV1, VinhetaCompletaV3 } from "./fases/VinhetaCompleta";
import tokens from "../brand/tokens.json";
import { duracaoVolta, framesFase1 as sjaF1, framesFase2 as sjaF2, PreviaFechamento, PreviaVolta, VinhetaSemana } from "./semana/Vinheta";

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
        durationInFrames={duracaoReview(fps, RELOGIO_NO_LOOP_V3)}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
      />
      {/* Vinheta final: Fase 1 (10 min, V3) + Fase 2 (5 min só logo) = 15 min */}
      <Composition
        id="MSJ-2025-11-Abertura-V3-Completa"
        component={VinhetaCompletaV3}
        durationInFrames={framesFase1(fps) + framesFase2(fps)}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
      />
      {/* Vinheta final da V1: Fase 1 (10 min) + Fase 2 (5 min só logo) = 15 min */}
      <Composition
        id="MSJ-2025-11-Abertura-V1-Completa"
        component={VinhetaCompletaV1}
        durationInFrames={framesFase1(fps) + framesFase2(fps)}
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
          {/* Semana do Jeito Agi (projects/semana-jeito-agi): vinheta das 3 lives */}
      <Composition id="SJA-Vinheta-Completa" component={VinhetaSemana} durationInFrames={sjaF1(fps) + sjaF2(fps)} fps={fps} width={1920} height={1080} />
      <Composition id="SJA-Previa-Uma-Volta" component={PreviaVolta} durationInFrames={duracaoVolta(fps)} fps={fps} width={1920} height={1080} />
      <Composition id="SJA-Previa-Fechamento" component={PreviaFechamento} durationInFrames={Math.round(30 * fps)} fps={fps} width={1920} height={1080} />
    </>
  );
};
