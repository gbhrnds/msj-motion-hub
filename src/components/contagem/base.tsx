import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { motionTokens } from "../../brand/theme";
import { fontFamily } from "../../fonts";

export const SEGUNDOS_FINAIS = 10;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const [e1, e2, e3, e4] = motionTokens.entradaGrafismo.easingBezier;
const [m1, m2, m3, m4] = motionTokens.movimentoEmTela.easingBezier;
/** Entrada (skill animate: ease-out forte). */
export const easeEntra = Easing.bezier(e1, e2, e3, e4);
/** Movimento em tela (skill animate: ease-in-out forte). */
export const easeMove = Easing.bezier(m1, m2, m3, m4);

export const mmss = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * Estado do relógio a partir do frame: segundos restantes, quanto já passou do
 * segundo atual e o frame em que começam os 10s finais.
 */
export const useContagem = (segundosNoInicio: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const decorridos = Math.floor(frame / fps);
  const restante = Math.max(0, segundosNoInicio - decorridos);
  const inicioSegundo = Math.ceil(decorridos * fps);
  const inicioFinal = Math.ceil((segundosNoInicio - SEGUNDOS_FINAIS) * fps);
  return {
    frame,
    fps,
    restante,
    noSegundo: frame - inicioSegundo,
    inicioFinal,
    final: frame >= inicioFinal,
    /** 0 → 1 ao longo de toda a contagem. */
    progresso: Math.min(1, frame / (segundosNoInicio * fps)),
  };
};

type NumeroProps = {
  segundos: number;
  /** Frames desde a última troca de segundo. */
  noSegundo: number;
  tamanho: number;
  cor: string;
  /** Troca dos dígitos: rola só o dígito que mudou (odômetro). Sem isso, troca seca. */
  rolar?: boolean;
  style?: React.CSSProperties;
};

const ROLAGEM = 10; // frames (~0,4s): troca curta, entra com ease-out
const CASCATA = 2; // frames entre um dígito e o próximo à esquerda (todos ainda em movimento juntos)

/**
 * Número mm:ss com dígitos de largura fixa. Com `rolar`, cada dígito que muda
 * sobe para fora enquanto o novo sobe de baixo (só translate + opacity, com
 * máscara), e os dígitos que não mudam ficam parados.
 */
export const Numero: React.FC<NumeroProps> = ({
  segundos,
  noSegundo,
  tamanho,
  cor,
  rolar = false,
  style,
}) => {
  const atual = mmss(segundos);
  const anterior = mmss(segundos + 1);
  // Quando vários dígitos mudam juntos (ex.: 10:00 → 09:59), eles rolam em
  // cascata da direita para a esquerda, como um odômetro, e não todos de uma vez.
  const ordem = atual
    .split("")
    .map((c, i) => (c !== anterior[i] ? i : -1))
    .filter((i) => i >= 0)
    .reverse();
  const pDe = (i: number) => {
    if (!rolar) return 1;
    const atraso = Math.max(0, ordem.indexOf(i)) * CASCATA;
    return easeEntra(interpolate(noSegundo, [atraso, atraso + ROLAGEM], [0, 1], clamp));
  };
  return (
    <div
      style={{
        display: "flex",
        fontFamily,
        fontWeight: 700,
        fontSize: tamanho,
        lineHeight: 1,
        color: cor,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: -tamanho * 0.02,
        ...style,
      }}
    >
      {atual.split("").map((c, i) => {
        const p = pDe(i);
        const mudou = rolar && c !== anterior[i] && p < 1;
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              overflow: "hidden",
              height: tamanho * 1.05,
            }}
          >
            {mudou && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  translate: `0 ${-p * 100}%`,
                  opacity: 1 - p,
                }}
              >
                {anterior[i]}
              </span>
            )}
            <span
              style={{
                display: "inline-block",
                translate: mudou ? `0 ${(1 - p) * 100}%` : undefined,
              }}
            >
              {c}
            </span>
          </span>
        );
      })}
    </div>
  );
};
