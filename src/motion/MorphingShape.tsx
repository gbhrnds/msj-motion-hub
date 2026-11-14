import React, { useMemo } from "react";
import { useCurrentFrame, random } from "remotion";
import { interpolate } from "flubber";
import shapesDataRaw from "../shapesData.json";

const shapesData: Record<string, string> = shapesDataRaw;

type MorphingShapeProps = {
  color: string;
  width?: number;
  height?: number;
  framesPerMorph?: number;
  seed?: string;
};

const SHAPES_KEYS = Object.keys(shapesData);
const FALLBACK_PATH = "M 0 0 L 100 0 L 50 100 Z";

const getPalette = (seed: string) => {
  const tris = SHAPES_KEYS.filter((k) => k.includes("triangle"));
  const quads = SHAPES_KEYS.filter((k) => k.includes("quadrilateral"));
  const pents = SHAPES_KEYS.filter((k) => k.includes("pentagon"));

  if (tris.length === 0 || quads.length === 0 || pents.length === 0) {
    return [FALLBACK_PATH, FALLBACK_PATH, FALLBACK_PATH];
  }

  const tri = tris[Math.floor(random(`${seed}-1`) * tris.length)];
  const quad = quads[Math.floor(random(`${seed}-2`) * quads.length)];
  const pent = pents[Math.floor(random(`${seed}-3`) * pents.length)];

  return [
    shapesData[tri] || FALLBACK_PATH,
    shapesData[quad] || FALLBACK_PATH,
    shapesData[pent] || FALLBACK_PATH
  ];
};

export const MorphingShape: React.FC<MorphingShapeProps> = ({
  color,
  width = 400,
  height = 400,
  framesPerMorph = 15,
  seed = "msj-morph-v1",
}) => {
  const frame = useCurrentFrame();
  const palette = useMemo(() => getPalette(seed), [seed]);

  const currentIndex = Math.floor(frame / framesPerMorph);
  const nextIndex = currentIndex + 1;
  const progress = (frame % framesPerMorph) / framesPerMorph;

  const currentPath = palette[currentIndex % palette.length];
  const nextPath = palette[nextIndex % palette.length];

  const interpolator = useMemo(() => {
    try {
      return interpolate(currentPath, nextPath, { maxSegmentLength: 2 });
    } catch (e) {
      return () => currentPath;
    }
  }, [currentPath, nextPath]);

  return (
    // ViewBox aumentado para 150 para garantir que nenhuma forma seja cortada
    <svg width={width} height={height} viewBox="0 0 150 150" style={{ overflow: "visible" }}>
      <g transform="translate(15, 15)">
        <path d={interpolator(progress)} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      </g>
    </svg>
  );
};
