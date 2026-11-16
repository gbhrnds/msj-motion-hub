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
import { interpolate } from "remotion";
import { useRefinado } from "../motion/estilo";
import { MorphForma } from "../motion/MorphForma";
import { easeMove, Numero } from "./contagem/base";

type CountdownOverlayProps = {
  durationInSeconds: number; // Tempo total da fase de conteudo (ex: 600s para 10min)
  /** Frames iniciais em que o overlay não aparece (a tela de abertura já mostra o relógio). */
  ocultarAteFrame?: number;
  /** Trechos [início, fim) em que a tela já é o relógio (tela do relógio no loop). */
  ocultar?: [number, number][];
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
  ocultar = [],
  logoMsj,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const restante = Math.max(0, durationInSeconds - Math.floor(frame / fps));
  const inicioHero = Math.ceil((durationInSeconds - SEGUNDOS_HERO) * fps);

  const refinado = useRefinado();
  if (frame < ocultarAteFrame) return null;
  if (frame < inicioHero && ocultar.some(([a, b]) => frame >= a && frame < b)) return null;
  const noSegundo = frame - Math.ceil(Math.floor(frame / fps) * fps);

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

  // refinado: nos 16 frames antes do painel final, uma forma azul sai do
  // relógio e cresce morfando até cobrir a tela (o painel nasce dela)
  const WIPE = 16;
  const pw = refinado
    ? easeMove(interpolate(frame, [inicioHero - WIPE, inicioHero], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
    : 0;
  const lado = 200 + 4800 * pw;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pw > 0 && (
        <div style={{ position: "absolute", left: 140 + (960 - 140) * pw - lado / 2, top: 60 + (540 - 60) * pw - lado / 2 }}>
          <MorphForma formas={["quadrilateral-01", "pentagon-01"]} tamanho={lado} cor={cor.azul} segurar={0} morfar={WIPE} atraso={-(inicioHero - WIPE)} rotacao={-4 + 30 * pw} />
        </div>
      )}
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
        {refinado ? (
          <Numero segundos={restante} noSegundo={noSegundo} tamanho={54} cor={cor.azul} rolar />
        ) : (
          formatarTempo(restante)
        )}
      </div>
    </AbsoluteFill>
  );
};
