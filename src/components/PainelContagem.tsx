import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../fonts";
import { cor } from "../brand/theme";
import { Logo } from "../brand/Logo";
import { CamadaGrafismos } from "../motion/CamadaGrafismos";
import { TextReveal } from "../motion/TextReveal";
import type { GrafismoSpec, ZonaLivre } from "../brand/grafismos";

type Props = {
  /** Segundos que faltam no primeiro frame do painel. */
  segundosNoInicio: number;
  logoMsj: string;
  duracaoFrames: number;
  id?: string;
};

export const formatarTempo = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const LOGO_ALT = 92;
export const ZONAS: ZonaLivre[] = [
  { id: "numero", x: 960 - 290, y: 540 - 100, largura: 580, altura: 200 },
  {
    id: "logo",
    x: 1920 - 140 - 320,
    y: 1080 - 110 - LOGO_ALT,
    largura: 320,
    altura: LOGO_ALT,
  },
];
// Ajustado no Figma (2026-11-14): outline atrás do número, com máscara no texto.
export const FORMAS: GrafismoSpec[] = [
  {
    id: "moldura",
    nome: "pentagon-01",
    x: 725,
    y: 320,
    largura: 471,
    cor: cor.verde,
    desenhar: true,
    moldura: true,
    rotacao: -4,
  },
];
export const MASCARA = { id: "numero", x: 691, y: 445, largura: 538, altura: 190 };

/**
 * Painel de contagem no padrão da vinheta de Outubro: fundo azul, número
 * branco centralizado como único protagonista, outline se desenhando ao redor
 * e o logo MSJ pequeno no canto inferior direito. Usado na TELA 00 e nos
 * 10 segundos finais da Fase 1.
 */
export const PainelContagem: React.FC<Props> = ({
  segundosNoInicio,
  logoMsj,
  duracaoFrames,
  id = "painel_contagem",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const restante = Math.max(0, segundosNoInicio - Math.floor(frame / fps));

  return (
    <AbsoluteFill style={{ backgroundColor: cor.azul }}>
      <CamadaGrafismos
        tela={id}
        formas={FORMAS}
        zonasLivres={ZONAS}
        duracaoFrames={duracaoFrames}
        comContador={false}
        mascaras={[{ ...MASCARA, cor: cor.azul }]}
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <TextReveal distancia={20}>
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 190,
              lineHeight: 1,
              color: cor.branco,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: -2,
            }}
          >
            {formatarTempo(restante)}
          </div>
        </TextReveal>
      </AbsoluteFill>

      <div style={{ position: "absolute", right: 140, bottom: 110 }}>
        <TextReveal delayFrames={10} distancia={0}>
          <Logo arquivo={logoMsj} versao="negativa" altura={LOGO_ALT} />
        </TextReveal>
      </div>
    </AbsoluteFill>
  );
};
