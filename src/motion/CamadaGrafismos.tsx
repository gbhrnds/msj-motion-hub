import React from "react";
import { AbsoluteFill } from "remotion";
import { BrandShape } from "../brand/BrandShape";
import { conflitos, GrafismoSpec, ZonaLivre } from "../brand/grafismos";
import { Grafismo } from "./Grafismo";
import { OutlineDesenhado } from "./OutlineDesenhado";

type Props = {
  tela: string;
  formas: GrafismoSpec[];
  zonasLivres: ZonaLivre[];
  duracaoFrames?: number;
  /** false só em telas sem contador (abertura). */
  comContador?: boolean;
};

/**
 * Renderiza os grafismos de uma tela e FALHA o render se alguma forma se
 * sobrepuser a outra ou invadir texto/logo/contador (regra do Brandbook).
 */
export const CamadaGrafismos: React.FC<Props> = ({
  tela,
  formas,
  zonasLivres,
  duracaoFrames,
  comContador = true,
}) => {
  const erros = conflitos(formas, zonasLivres, comContador);
  if (erros.length > 0) {
    throw new Error(
      `[${tela}] formas sobrepostas (proibido pelo Brandbook): ${erros.join(", ")}`,
    );
  }

  return (
    <AbsoluteFill>
      {formas.map((g) => (
        <Grafismo
          key={g.id}
          x={g.x}
          y={g.y}
          delayFrames={g.delayFrames ?? 0}
          fase={g.fase ?? 0}
          wiggle={g.desenhar ? false : (g.wiggle ?? true)}
        >
          {g.desenhar ? (
            <OutlineDesenhado
              nome={g.nome}
              largura={g.largura}
              cor={g.cor}
              rotacao={g.rotacao}
              delayFrames={g.delayFrames}
              duracaoFrames={duracaoFrames}
            />
          ) : (
            <BrandShape
              nome={g.nome}
              largura={g.largura}
              cor={g.cor}
              modo={g.modo}
              rotacao={g.rotacao}
              espelhar={g.espelhar}
            />
          )}
        </Grafismo>
      ))}
    </AbsoluteFill>
  );
};
