import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { cor } from "../brand/theme";
import { LogoMSJAnimado } from "../motion/LogoMSJAnimado";
import { clamp } from "../components/contagem/base";

/**
 * Fase 2 — buffer de contingência (5 min): só o logo MSJ sobre azul, sem texto.
 * Entra montado letra a letra e depois fica com um wiggle sutil (flutuação
 * lenta de poucos px), para a tela não parecer congelada se a live atrasar.
 */
export const BufferLogo: React.FC<{ alturaLogo?: number }> = ({ alturaLogo = 260 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const vivo = interpolate(f, [fps * 2, fps * 4], [0, 1], clamp); // wiggle só depois da entrada
  const dx = vivo * 4 * Math.sin((2 * Math.PI * t) / 9);
  const dy = vivo * 5 * Math.sin((2 * Math.PI * t) / 7 + 1.3);
  return (
    <AbsoluteFill style={{ backgroundColor: cor.azul, justifyContent: "center", alignItems: "center" }}>
      <div style={{ translate: `${dx}px ${dy}px` }}>
        <LogoMSJAnimado versao="negativa" altura={alturaLogo} delay={6} />
      </div>
    </AbsoluteFill>
  );
};
