import React, { useMemo } from "react";
import { interpolate as morph } from "flubber";
import { Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import shapesData from "../shapesData.json";
import type { ShapeName } from "../brand/BrandShape";
import { pontosDoPath } from "../brand/grafismos";
import { motionTokens, strokeOutline } from "../brand/theme";

type P = [number, number];
const [m1, m2, m3, m4] = motionTokens.movimentoEmTela.easingBezier;
const easeMove = Easing.bezier(m1, m2, m3, m4);

/** Contorno da forma oficial normalizado numa caixa 100×100 (centro 50,50, lado maior = 100). */
const anel = (nome: ShapeName): P[] => {
  const f = shapesData[nome];
  const k = 100 / Math.max(f.w, f.h);
  const ox = (100 - f.w * k) / 2;
  const oy = (100 - f.h * k) / 2;
  return pontosDoPath(f.d).map(([x, y]) => [x * k + ox, y * k + oy]);
};

const cache = new Map<string, (t: number) => string>();
const interpolador = (a: ShapeName, b: ShapeName) => {
  const chave = `${a}>${b}`;
  if (!cache.has(chave)) {
    cache.set(chave, morph(anel(a), anel(b), { maxSegmentLength: 2, string: true }));
  }
  return cache.get(chave)!;
};

type Props = {
  /** Sequência de formas oficiais. A forma fica parada (oficial) e só morfa na troca. */
  formas: ShapeName[];
  /** Lado da caixa em px (o lado maior da forma). */
  tamanho: number;
  cor: string;
  /** Cores que acompanham a troca de forma (uma por forma, em ciclo). Sem isso, usa `cor`. */
  cores?: string[];
  modo?: "preenchida" | "outline";
  /** Frames parado em cada forma oficial. */
  segurar?: number;
  /** Frames da troca (morph). Curto: a forma intermediária só existe em movimento. */
  morfar?: number;
  /** Desloca o ciclo (formas vizinhas não trocam juntas). */
  atraso?: number;
  rotacao?: number;
  /** Rotação contínua lenta (graus por segundo, 0 = parada). */
  giro?: number;
  fps?: number;
  /** Trim path (outline que se desenha): fração visível e deslocamento. */
  trim?: { visivel: number; deslocamento: number };
  /** Espessura do outline em px (padrão: tokens.shapes.outlineConversion). */
  espessura?: number;
  style?: React.CSSProperties;
};

/**
 * Morph entre formas oficiais do Agibank (pedido da redação: "usar morphing
 * shape decorativo"). Regra para não "inventar forma": cada forma oficial fica
 * parada a maior parte do tempo e a troca é rápida, com ease-in-out forte;
 * as formas intermediárias só existem durante o movimento.
 */
export const MorphForma: React.FC<Props> = ({
  formas,
  tamanho,
  cor: corBase,
  cores,
  modo = "preenchida",
  segurar = 60,
  morfar = 18,
  atraso = 0,
  rotacao = 0,
  giro = 0,
  fps = 23.976,
  trim,
  espessura = strokeOutline,
  style,
}) => {
  const frame = useCurrentFrame() + atraso;
  const ciclo = segurar + morfar;
  const i = Math.floor(Math.max(0, frame) / ciclo);
  const local = Math.max(0, frame) - i * ciclo;
  const de = formas[i % formas.length];
  const para = formas[(i + 1) % formas.length];
  const p = easeMove(interpolate(local, [segurar, ciclo], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const d = useMemo(
    () => (p <= 0 || de === para ? null : interpolador(de, para)(p)),
    [de, para, p],
  );
  const caminho = p >= 1 ? null : d;
  const cor =
    cores && cores.length > 0
      ? interpolateColors(p, [0, 1], [cores[i % cores.length], cores[(i + 1) % cores.length]])
      : corBase;
  const outline = modo === "outline";
  const sw = (espessura * 100) / tamanho;
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 100 100"
      style={{
        overflow: "visible",
        rotate: `${rotacao + (giro * frame) / fps}deg`,
        ...style,
      }}
    >
      {caminho ? (
        <path d={caminho} fill={outline ? "none" : cor} stroke={outline ? cor : "none"} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" {...tracos(trim)} />
      ) : (
        <FormaNormalizada nome={p >= 1 ? para : de} cor={cor} outline={outline} sw={sw} trim={trim} />
      )}
    </svg>
  );
};

const tracos = (trim?: { visivel: number; deslocamento: number }) =>
  trim
    ? { pathLength: 1, strokeDasharray: `${trim.visivel} ${1 - trim.visivel + 0.0001}`, strokeDashoffset: trim.deslocamento }
    : {};

/** A forma oficial (path original), na mesma caixa normalizada do morph. */
const FormaNormalizada: React.FC<{ nome: ShapeName; cor: string; outline: boolean; sw: number; trim?: { visivel: number; deslocamento: number } }> = ({
  nome,
  cor,
  outline,
  sw,
  trim,
}) => {
  const f = shapesData[nome];
  const k = 100 / Math.max(f.w, f.h);
  return (
    <path
      d={f.d}
      transform={`translate(${(100 - f.w * k) / 2} ${(100 - f.h * k) / 2}) scale(${k})`}
      fill={outline ? "none" : cor}
      stroke={outline ? cor : "none"}
      strokeWidth={sw / k}
      strokeLinejoin="round"
      strokeLinecap="round"
      {...tracos(trim)}
    />
  );
};
