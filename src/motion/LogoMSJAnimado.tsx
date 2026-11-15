import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { cor } from "../brand/theme";
import { BrandShape, ShapeName } from "../brand/BrandShape";
import { MSJ_LETRAS, MSJ_VIEWBOX } from "../brand/logoMsjPaths";
import { clamp, easeEntra, easeMove } from "../components/contagem/base";

/**
 * Entrada do logo Momento Sempre Juntos (V1).
 * O logo é montado com os paths do arquivo oficial: cada letra sobe por trás
 * de uma máscara da sua linha ("Momento" primeiro, "Sempre Juntos" logo depois),
 * com stagger decrescente, enquanto o espaçamento entre letras fecha até o
 * desenho exato. Atrás, formas oficiais explodem do centro e saem do quadro.
 * Ao fim (≈ 1,8s) o logo é idêntico ao arquivo: sem distorção, sem rotação.
 */
const [, , VBW, VBH] = MSJ_VIEWBOX.split(" ").map(Number);
const CORTE = 205; // y que separa as duas linhas no viewBox

const ESTILHACOS: { nome: ShapeName; ang: number; dist: number; tam: number; rot: number; cor: keyof typeof cor }[] = [
  { nome: "triangle-01", ang: -150, dist: 820, tam: 70, rot: -40, cor: "verde" },
  { nome: "quadrilateral-05", ang: -35, dist: 900, tam: 120, rot: 30, cor: "azulMedio" },
  { nome: "pentagon-05", ang: 25, dist: 760, tam: 90, rot: -20, cor: "verde" },
  { nome: "triangle-08", ang: 150, dist: 700, tam: 60, rot: 60, cor: "amarelo" },
  { nome: "quadrilateral-16", ang: 95, dist: 640, tam: 80, rot: -70, cor: "azulMedio" },
];

export const LogoMSJAnimado: React.FC<{
  altura: number;
  versao: "positiva" | "negativa";
  delay?: number;
  /** Sem estilhaços (ex.: export para Figma). */
  semFormas?: boolean;
}> = ({ altura, versao, delay = 0, semFormas }) => {
  const f = useCurrentFrame() - delay;
  const largura = (altura * VBW) / VBH;
  const porLinha = [0, 0];
  const idx = MSJ_LETRAS.map((l) => porLinha[l.linha]++);
  const total = [porLinha[0], porLinha[1]];
  const escala = interpolate(easeMove(interpolate(f, [0, 40], [0, 1], clamp)), [0, 1], [0.92, 1]);

  return (
    <div style={{ position: "relative", width: largura, height: altura }}>
      {!semFormas &&
        ESTILHACOS.map((e, i) => {
          const p = easeEntra(interpolate(f, [2 + i, 34 + i * 2], [0, 1], clamp));
          const op = interpolate(f, [2 + i, 6 + i, 22 + i * 2, 34 + i * 2], [0, 1, 1, 0], clamp);
          const rad = (e.ang * Math.PI) / 180;
          return (
            <div
              key={e.nome}
              style={{
                position: "absolute",
                left: largura / 2,
                top: altura / 2,
                opacity: op,
                translate: `calc(-50% + ${Math.cos(rad) * e.dist * p}px) calc(-50% + ${Math.sin(rad) * e.dist * p}px)`,
                scale: String(0.3 + 0.7 * p),
              }}
            >
              <BrandShape nome={e.nome} largura={e.tam} cor={cor[e.cor]} rotacao={e.rot + p * 90} />
            </div>
          );
        })}
      <svg viewBox={MSJ_VIEWBOX} width={largura} height={altura} style={{ position: "relative", display: "block", scale: String(escala) }}>
        <defs>
          <clipPath id="msj-linha-0">
            <rect x={0} y={0} width={VBW} height={CORTE} />
          </clipPath>
          <clipPath id="msj-linha-1">
            <rect x={0} y={CORTE} width={VBW} height={VBH - CORTE} />
          </clipPath>
        </defs>
        {[0, 1].map((linha) => (
          <g key={linha} clipPath={`url(#msj-linha-${linha})`}>
            {MSJ_LETRAS.map((l, i) => {
              if (l.linha !== linha) return null;
              const k = idx[i];
              // stagger decrescente: cada letra entra um pouco mais cedo que a anterior entraria
              const inicio = (linha === 0 ? 0 : 9) + 2.4 * ((1 - Math.pow(0.86, k)) / (1 - 0.86));
              const p = easeEntra(interpolate(f, [inicio, inicio + 16], [0, 1], clamp));
              const centro = (total[linha] - 1) / 2;
              const abre = (k - centro) * 14 * (1 - p); // tracking fecha até o desenho original
              return (
                <path
                  key={i}
                  d={l.d}
                  fill={versao === "negativa" ? l.negativo : l.positivo}
                  transform={`translate(${abre} ${(1 - p) * (linha === 0 ? CORTE : VBH - CORTE + 10)})`}
                />
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
};
