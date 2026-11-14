import React from "react";
import shapesData from "../shapesData.json";
import { strokeOutline } from "./theme";

export type ShapeName = keyof typeof shapesData;

type BrandShapeProps = {
  /** Nome do arquivo em brand/shapes/ (sem .svg). Formas novas são proibidas. */
  nome: ShapeName;
  /** Largura renderizada em px; a altura segue a proporção original (nunca distorce). */
  largura: number;
  cor: string;
  modo?: "preenchida" | "outline";
  /** Transformações permitidas pelo Brandbook: rotacionar, espelhar, escalonar. */
  rotacao?: number;
  espelhar?: boolean;
  style?: React.CSSProperties;
};

/**
 * Renderiza uma forma irregular oficial do Agibank.
 * Outline usa o mesmo path da forma preenchida (tokens.shapes.outlineConversion),
 * com traço de espessura constante em qualquer escala.
 */
export const BrandShape: React.FC<BrandShapeProps> = ({
  nome,
  largura,
  cor,
  modo = "preenchida",
  rotacao = 0,
  espelhar = false,
  style,
}) => {
  const forma = shapesData[nome];
  const altura = (largura * forma.h) / forma.w;
  const outline = modo === "outline";
  // Margem interna para o traço do outline não ser cortado pelo viewBox.
  const pad = outline ? (strokeOutline * forma.w) / largura : 0;

  return (
    <svg
      width={largura}
      height={altura}
      viewBox={`${-pad} ${-pad} ${forma.w + pad * 2} ${forma.h + pad * 2}`}
      style={{
        overflow: "visible",
        rotate: `${rotacao}deg`,
        scale: espelhar ? "-1 1" : undefined,
        ...style,
      }}
    >
      <path
        d={forma.d}
        fill={outline ? "none" : cor}
        stroke={outline ? cor : "none"}
        strokeWidth={outline ? strokeOutline : 0}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};
