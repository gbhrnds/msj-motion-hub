import React from "react";
import { AbsoluteFill, interpolate, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { cor } from "../brand/theme";
import { fontFamily } from "../fonts";
import { TelaAguarde } from "./TelaAguarde";
import { CountdownProp1 } from "./CountdownProp1";
import { CountdownProp2 } from "./CountdownProp2";
import { CountdownProp3 } from "./CountdownProp3";
import { clamp } from "./contagem/base";

const LOGO = "brand/logos/logo-msj-negative.svg";
const LOGO_POS = "brand/logos/logo-msj-positive.svg";
export const SEGUNDOS_POR_PROPOSTA = 15;

/** Tela real por baixo do relógio, para avaliar o overlay em contexto. */
const Fundo: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <TelaAguarde
      id="showcase_fundo"
      titulo="Falta pouco para estarmos juntos..."
      destaque="estarmos juntos..."
      corOutline={cor.verde}
      logoMsj={LOGO_POS}
      duracaoFrames={Math.round(SEGUNDOS_POR_PROPOSTA * fps)}
    />
  );
};

/** Etiqueta só para a revisão interna (some em 3s; não entra na vinheta). */
const Etiqueta: React.FC<{ texto: string; claro?: boolean }> = ({ texto, claro }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const op = interpolate(frame, [0, 8, fps * 3, fps * 3 + 10], [0, 1, 1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        bottom: 60,
        fontFamily,
        fontSize: 28,
        fontWeight: 600,
        color: claro ? cor.branco : cor.azul,
        opacity: op,
      }}
    >
      {texto}
    </div>
  );
};

/**
 * Etapa 3 — as 3 propostas de relógio, 15s cada, começando em 00:15 para
 * mostrar o modo normal (5s) e a transição para os 10s finais.
 */
export const ShowcasePropostas: React.FC = () => {
  const { fps } = useVideoConfig();
  const d = Math.round(SEGUNDOS_POR_PROPOSTA * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: cor.branco }}>
      <Series>
        <Series.Sequence durationInFrames={d} name="Proposta 1 — Clássica">
          <Fundo />
          <CountdownProp1 segundosNoInicio={SEGUNDOS_POR_PROPOSTA} logoMsj={LOGO} />
          <Etiqueta texto="Proposta 1 — Clássica" />
        </Series.Sequence>
        <Series.Sequence durationInFrames={d} name="Proposta 2 — NuDay">
          <CountdownProp2 segundosNoInicio={SEGUNDOS_POR_PROPOSTA} logoMsj={LOGO} />
          <Etiqueta texto="Proposta 2 — inspirada no NuDay" claro />
        </Series.Sequence>
        <Series.Sequence durationInFrames={d} name="Proposta 3 — Motion elegante">
          <Fundo />
          <CountdownProp3 segundosNoInicio={SEGUNDOS_POR_PROPOSTA} logoMsj={LOGO} />
          <Etiqueta texto="Proposta 3 — Motion elegante" />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
