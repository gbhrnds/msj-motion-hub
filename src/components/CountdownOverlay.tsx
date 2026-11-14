import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "../fonts";
import { cor } from "../brand/theme";
import { BrandShape } from "../brand/BrandShape";
import { PainelContagem, formatarTempo } from "./PainelContagem";

type CountdownOverlayProps = {
  durationInSeconds: number; // Tempo total da fase de conteudo (ex: 600s para 10min)
  /** Frames iniciais em que o overlay não aparece (a tela de abertura já mostra o relógio). */
  ocultarAteFrame?: number;
  logoMsj: string;
};

const SEGUNDOS_HERO = 10;

/**
 * Relógio da Fase 1.
 * - Compacto: moldura = forma irregular oficial (quadrilateral-01) em branco,
 *   sangrando pelo canto superior esquerdo, número azul (padrão Outubro/2026).
 * - Últimos 10s: painel de contagem em tela cheia.
 */
export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  durationInSeconds,
  ocultarAteFrame = 0,
  logoMsj,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const restante = Math.max(0, durationInSeconds - Math.floor(frame / fps));
  const inicioHero = Math.ceil((durationInSeconds - SEGUNDOS_HERO) * fps);

  if (frame < ocultarAteFrame) return null;

  if (frame >= inicioHero) {
    return (
      <Sequence from={inicioHero} layout="none">
        <AbsoluteFill>
          <PainelContagem
            id="contagem_final"
            segundosNoInicio={SEGUNDOS_HERO}
            logoMsj={logoMsj}
            duracaoFrames={Math.round(SEGUNDOS_HERO * fps)}
          />
        </AbsoluteFill>
      </Sequence>
    );
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div data-camada="moldura do contador" style={{ position: "absolute", left: -96, top: -92 }}>
        <BrandShape
          nome="quadrilateral-01"
          largura={470}
          cor={cor.branco}
          rotacao={-4}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 42,
          fontFamily,
          fontWeight: 700,
          fontSize: 54,
          lineHeight: 1,
          color: cor.azul,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatarTempo(restante)}
      </div>
    </AbsoluteFill>
  );
};
