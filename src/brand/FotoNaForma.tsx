import React from "react";
import { Img, staticFile } from "remotion";
import shapesData from "../shapesData.json";
import type { ShapeName } from "./BrandShape";

type Props = {
  forma: ShapeName;
  x: number;
  y: number;
  largura: number;
  rotacao?: number;
  foto: string;
  recorte?: string;
  imagem: { x: number; y: number; largura: number; altura: number };
};

/**
 * Foto recortada por uma forma oficial (só escalonada/rotacionada, nunca deformada).
 * Se houver o PNG da pessoa recortada, ele entra por cima com o mesmo enquadramento,
 * e a pessoa "sai" da forma.
 */
export const FotoNaForma: React.FC<Props> = ({
  forma,
  x,
  y,
  largura,
  rotacao = 0,
  foto,
  recorte,
  imagem,
}) => {
  const f = shapesData[forma];
  const k = largura / f.w;
  const h = f.h * k;
  const id = `clip-${forma}`;
  return (
    <>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <defs>
          <clipPath id={id}>
            <path
              d={f.d}
              transform={`translate(${x} ${y}) rotate(${rotacao} ${largura / 2} ${h / 2}) scale(${k})`}
            />
          </clipPath>
        </defs>
        <image
          href={staticFile(foto)}
          x={imagem.x}
          y={imagem.y}
          width={imagem.largura}
          height={imagem.altura}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id})`}
        />
      </svg>
      {recorte && (
        <Img
          src={staticFile(recorte)}
          style={{
            position: "absolute",
            left: imagem.x,
            top: imagem.y,
            width: imagem.largura,
            height: imagem.altura,
            objectFit: "cover",
          }}
        />
      )}
    </>
  );
};
