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
import { EditorRespiroV1, schemaEditorRespiro } from "./versoes/v1/EditorV1";
import { LAYOUT_V1 } from "./versoes/v1/layoutV1";
import { FRAMES_MJA, MinutoJeitoAgi } from "./minuto-jeito-agi/MinutoJeitoAgi";

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
      {/* Editor de layout da V1 (sem Figma): ajuste no painel Props e "Salvar layout" no quadro */}
      <Composition
        id="V1-Editor-Respiro"
        component={EditorRespiroV1}
        schema={schemaEditorRespiro}
        durationInFrames={Math.round(10 * fps)}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
        defaultProps={{ variante: "semLogo" as const, mostrarGuias: true, layout: LAYOUT_V1 }}
      />
      {/* Minuto Jeito Agi (nov): vídeo editado + cartelas animadas, com a voz */}
      <Composition
        id="MJA-2025-11-Final"
        component={MinutoJeitoAgi}
        durationInFrames={FRAMES_MJA}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
      />
      {/* Só o motion do Minuto Jeito Agi, com alfa (render em PNG → .mov QuickTime Animation) */}
      <Composition
        id="MJA-2025-11-Motion-Alpha"
        component={MinutoJeitoAgi}
        durationInFrames={FRAMES_MJA}
        fps={fps}
        width={tokens.video.resolution.width}
        height={tokens.video.resolution.height}
        defaultProps={{ comVideo: false }}
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
