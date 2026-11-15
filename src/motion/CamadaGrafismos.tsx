import React from "react";
import { AbsoluteFill } from "remotion";
import { FormaViva } from "./FormaViva";
import { conflitos, GrafismoSpec, parceirasSeguras, ZonaLivre } from "../brand/grafismos";
import { Grafismo } from "./Grafismo";
import { OutlineDesenhado } from "./OutlineDesenhado";

type Props = {
  tela: string;
  formas: GrafismoSpec[];
  zonasLivres: ZonaLivre[];
  duracaoFrames?: number;
  /** false só em telas sem contador (abertura). */
  comContador?: boolean;
  /**
   * "Máscara" do texto: retângulo na cor do fundo, por cima dos grafismos,
   * que abre um respiro no outline onde o texto passa (padrão do Figma aprovado).
   */
  mascaras?: (ZonaLivre & { cor: string })[];
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
  mascaras = [],
}) => {
  const erros = conflitos(formas, zonasLivres, comContador);
  const seguras = parceirasSeguras(formas, zonasLivres, comContador);
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
          <div data-camada={`forma ${g.id} · ${g.nome}`} style={{ display: "contents" }}>
          {g.desenhar ? (
            <OutlineDesenhado
              nome={g.nome}
              largura={g.largura}
              cor={g.cor}
              rotacao={g.rotacao}
              delayFrames={g.delayFrames}
              duracaoFrames={duracaoFrames}
              alternativas={seguras[g.id]}
            />
          ) : (
            <FormaViva
              nome={g.nome}
              largura={g.largura}
              cor={g.cor}
              modo={g.modo}
              rotacao={g.rotacao}
              espelhar={g.espelhar}
              fase={g.fase}
              alternativas={seguras[g.id]}
            />
          )}
          </div>
        </Grafismo>
      ))}
      {mascaras.map((m) => (
        <div
          key={m.id}
          data-camada={`máscara ${m.id}`}
          style={{
            position: "absolute",
            left: m.x,
            top: m.y,
            width: m.largura,
            height: m.altura,
            backgroundColor: m.cor,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
