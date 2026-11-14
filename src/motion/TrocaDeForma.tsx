import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandShape, ShapeName } from "../brand/BrandShape";
import { motionTokens } from "../brand/theme";

const cfg = motionTokens.trocaDeForma;

type TrocaDeFormaProps = {
  formas: ShapeName[];
  largura: number;
  cor: string;
  modo?: "preenchida" | "outline";
  rotacaoInicial?: number;
};

/**
 * Substituto do morphing (que gerava formas intermediárias deformadas, proibido
 * pelo Brandbook p.46). Cada forma oficial gira devagar e dissolve na próxima:
 * a sensação de "forma viva" continua, sem nunca existir um desenho novo.
 */
export const TrocaDeForma: React.FC<TrocaDeFormaProps> = ({
  formas,
  largura,
  cor,
  modo = "outline",
  rotacaoInicial = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const porForma = Math.round(cfg.segundosPorForma * fps);
  const xf = cfg.crossfadeFrames;
  const indice = Math.floor(frame / porForma);
  const local = frame % porForma;
  const rot = rotacaoInicial + (frame / fps) * cfg.rotacaoGrausPorSegundo;

  const camada = (i: number, opacidade: number, escala: number) => (
    <div
      key={i}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: opacidade,
        scale: String(escala),
      }}
    >
      <BrandShape
        nome={formas[i % formas.length]}
        largura={largura}
        cor={cor}
        modo={modo}
        rotacao={rot}
      />
    </div>
  );

  const ease = Easing.inOut(Easing.cubic);
  const saindo = interpolate(local, [porForma - xf, porForma], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const entrando = 1 - saindo;

  return (
    <div style={{ position: "relative", width: largura, height: largura }}>
      {camada(indice, saindo, interpolate(saindo, [0, 1], [1.04, 1]))}
      {entrando > 0 && camada(indice + 1, entrando, interpolate(entrando, [0, 1], [0.96, 1]))}
    </div>
  );
};
