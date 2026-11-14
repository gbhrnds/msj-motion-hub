import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../fonts";
import { cor } from "../brand/theme";
import { Logo } from "../brand/Logo";
import { BrandShape } from "../brand/BrandShape";
import { Grafismo } from "../motion/Grafismo";
import { TrocaDeForma } from "../motion/TrocaDeForma";
import { TextReveal } from "../motion/TextReveal";

type Props = {
  /** Segundos que faltam no primeiro frame desta tela (10:00 = 600). */
  segundosNoInicio: number;
  logoMsj: string;
};

const formatar = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * TELA 00 — abertura da contagem. O "10:00" da redação é o próprio relógio:
 * começa em 10:00 e já corre durante a tela. Exibida uma única vez (fora do loop).
 */
export const TelaInicioContagem: React.FC<Props> = ({ segundosNoInicio, logoMsj }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const restante = Math.max(0, segundosNoInicio - Math.floor(frame / fps));

  return (
    <AbsoluteFill style={{ backgroundColor: cor.azul }}>
      {/* decoration: forma azul médio sangrando no topo direito */}
      <Grafismo x={1440} y={-170} delayFrames={4} fase={1}>
        <BrandShape nome="pentagon-07" largura={620} cor={cor.azulMedio} rotacao={18} />
      </Grafismo>
      <Grafismo x={-160} y={780} delayFrames={8} fase={2.4}>
        <BrandShape nome="quadrilateral-09" largura={460} cor={cor.azulMedio} rotacao={-12} />
      </Grafismo>
      <Grafismo x={1540} y={640} delayFrames={12} fase={3.6}>
        <BrandShape nome="triangle-04" largura={120} cor={cor.verde} rotacao={-20} />
      </Grafismo>

      {/* outline oficial ao redor do número (referência Outubro/2026) */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Grafismo x={960 - 470} y={540 - 470} delayFrames={6} wiggle={false}>
          <TrocaDeForma
            formas={["pentagon-01", "quadrilateral-04", "pentagon-05"]}
            largura={940}
            cor={cor.verde}
            rotacaoInicial={-8}
          />
        </Grafismo>
      </AbsoluteFill>

      {/* lead: o relógio */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <TextReveal distancia={32}>
          <div
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 300,
              lineHeight: 1,
              color: cor.branco,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: -6,
            }}
          >
            {formatar(restante)}
          </div>
        </TextReveal>
      </AbsoluteFill>

      {/* static: logo do evento */}
      <div style={{ position: "absolute", right: 140, bottom: 110 }}>
        <TextReveal delayFrames={14} distancia={0}>
          <Logo arquivo={logoMsj} versao="negativa" altura={104} />
        </TextReveal>
      </div>
    </AbsoluteFill>
  );
};
