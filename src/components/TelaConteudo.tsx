import React from "react";
import { AbsoluteFill } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { Grafismo } from "../motion/Grafismo";
import { BrandShape } from "../brand/BrandShape";
import { Logo } from "../brand/Logo";
import { roundedPolygon } from "../brand/roundedPolygon";
import { cor, raio } from "../brand/theme";
import { fontFamily } from "../fonts";

type TelaConteudoProps = {
  /** Parágrafo principal (lado azul). */
  corpo: string;
  /** Linha que abre a lista (lado branco). */
  chamadaLista?: string;
  bullets: string[];
  logo?: string;
};

// Módulo azul: bordas externas retas, divisão interna diagonal (Brandbook p.49),
// margem de respiro de 80px e cantos de 14px.
const MODULO: [number, number][] = [
  [80, 80],
  [1080, 80],
  [820, 1000],
  [80, 1000],
];
const STAGGER = [0, 4, 7, 10, 12, 14];

/** Conteúdo com layout dividido em diagonal azul/branco (pedido da redação). */
export const TelaConteudo: React.FC<TelaConteudoProps> = ({
  corpo,
  chamadaLista,
  bullets,
  logo,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: cor.branco }}>
      <Grafismo x={0} y={0} wiggle={false}>
        <svg width={1920} height={1080}>
          <path d={roundedPolygon(MODULO, raio)} fill={cor.azul} />
        </svg>
      </Grafismo>

      {/* decoration */}
      <Grafismo x={1640} y={850} delayFrames={8} fase={1}>
        <BrandShape nome="quadrilateral-21" largura={260} cor={cor.azul} modo="outline" rotacao={-14} />
      </Grafismo>
      <Grafismo x={900} y={880} delayFrames={12} fase={2.5}>
        <BrandShape nome="triangle-03" largura={96} cor={cor.verde} rotacao={18} />
      </Grafismo>

      {/* lado azul */}
      {logo && (
        <div style={{ position: "absolute", left: 160, top: 268 }}>
          <TextReveal distancia={0}>
            <Logo arquivo={logo} versao="negativa" altura={104} />
          </TextReveal>
        </div>
      )}
      <TextReveal
        delayFrames={6}
        distancia={28}
        style={{ position: "absolute", left: 160, top: 430, width: 620 }}
      >
        <p
          style={{
            fontFamily,
            fontWeight: 500,
            fontSize: 46,
            lineHeight: 1.2,
            color: cor.branco,
            margin: 0,
          }}
        >
          {corpo}
        </p>
      </TextReveal>

      {/* lado branco */}
      <div style={{ position: "absolute", left: 1090, top: 300, width: 720 }}>
        {chamadaLista && (
          <TextReveal delayFrames={12} distancia={20}>
            <h2
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: 48,
                lineHeight: 1.1,
                color: cor.azul,
                margin: "0 0 40px",
                textWrap: "balance",
              }}
            >
              {chamadaLista}
            </h2>
          </TextReveal>
        )}
        {bullets.map((b, i) => (
          <TextReveal key={b} delayFrames={18 + STAGGER[Math.min(i, STAGGER.length - 1)]} distancia={14}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                marginBottom: 26,
              }}
            >
              <BrandShape nome="triangle-06" largura={24} cor={cor.verde} rotacao={-90} />
              <span
                style={{
                  fontFamily,
                  fontWeight: 400,
                  fontSize: 38,
                  lineHeight: 1.2,
                  color: cor.azulEscuro,
                }}
              >
                {b}
              </span>
            </div>
          </TextReveal>
        ))}
      </div>
    </AbsoluteFill>
  );
};
