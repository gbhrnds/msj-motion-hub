import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import shapesData from "../shapesData.json";
import type { ShapeName } from "../brand/BrandShape";
import { motionTokens, strokeOutline } from "../brand/theme";
import { MorphForma } from "./MorphForma";
import { parceiras, useRefinado } from "./estilo";

const cfg = motionTokens.outlineDesenhado;

type Props = {
  nome: ShapeName;
  largura: number;
  cor: string;
  rotacao?: number;
  delayFrames?: number;
  /** Duração total da tela, para o traço se apagar antes do corte. */
  duracaoFrames?: number;
};

/**
 * Outline oficial que se desenha, percorre o contorno aberto e se apaga
 * (trim path) — mecânica da vinheta de Outubro/2026. A forma nunca é deformada:
 * só a parte visível do traço muda.
 */
export const OutlineDesenhado: React.FC<Props> = ({
  nome,
  largura,
  cor,
  rotacao = 0,
  delayFrames = 0,
  duracaoFrames,
}) => {
  const frame = useCurrentFrame() - delayFrames;
  const { fps } = useVideoConfig();
  const f = shapesData[nome];
  const altura = (largura * f.h) / f.w;
  const pad = (strokeOutline * f.w) / largura;

  const entrada = Math.round(cfg.desenharSegundos * fps);
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;
  let visivel = interpolate(frame, [0, entrada], [0, cfg.fracaoVisivel], {
    ...clamp,
    easing: Easing.bezier(0.23, 1, 0.32, 1),
  });
  if (duracaoFrames) {
    const fim = duracaoFrames - delayFrames;
    visivel *= interpolate(frame, [fim - entrada, fim - 2], [1, 0], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    });
  }
  const deslocamento = -(frame / fps) * cfg.voltasPorSegundo;

  const refinado = useRefinado();
  if (refinado) {
    // o contorno que se desenha também troca de forma oficial no caminho
    const lado = Math.max(largura, altura);
    return (
      <div style={{ width: largura, height: altura, position: "relative" }}>
        <div style={{ position: "absolute", left: (largura - lado) / 2, top: (altura - lado) / 2 }}>
          <MorphForma
            formas={[nome, ...parceiras(nome)]}
            tamanho={lado}
            cor={cor}
            modo="outline"
            rotacao={rotacao}
            segurar={Math.round(fps * 3)}
            morfar={22}
            atraso={-delayFrames - entrada}
            trim={{ visivel, deslocamento }}
          />
        </div>
      </div>
    );
  }
  return (
    <svg
      width={largura}
      height={altura}
      viewBox={`${-pad} ${-pad} ${f.w + pad * 2} ${f.h + pad * 2}`}
      style={{ overflow: "visible", rotate: `${rotacao}deg` }}
    >
      <path
        d={f.d}
        fill="none"
        stroke={cor}
        // espessura em unidades do viewBox (non-scaling-stroke quebraria o pathLength)
        strokeWidth={(strokeOutline * f.w) / largura}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={`${visivel} ${1 - visivel + 0.0001}`}
        strokeDashoffset={deslocamento}
      />
    </svg>
  );
};
