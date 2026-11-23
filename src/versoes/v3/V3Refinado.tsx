import React from "react";
import { useVideoConfig } from "remotion";
import { cor } from "../../brand/theme";
import { renderTela } from "../../Composition";
import { CountdownOverlay } from "../../components/CountdownOverlay";
import { PainelContagem } from "../../components/PainelContagem";
import { Conteudo, LOGO_MSJ, Projeto, roteiro, usarProjeto } from "../../dados";
import { EstiloMotion } from "../../motion/estilo";
import { RelogioProps, TelaProps, VersaoBase } from "../VersaoBase";

/*
 * VERSÃO 3 — o layout aprovado (ajustado no Figma) com motion refinado:
 * - formas: morfam de tempos em tempos para formas oficiais de proporção
 *   parecida (inclusive o outline que se desenha) e voltam;
 * - texto: revelado por máscara (sobe de dentro da própria caixa);
 * - relógio: dígitos em odômetro; antes dos 10s finais, uma forma azul sai do
 *   relógio e cresce morfando até virar o painel;
 * - entre telas: a cor do próximo fundo chega como uma forma oficial crescendo.
 */

const FUNDO: Record<Conteudo["tipo"], string> = {
  abertura: cor.azul,
  respiro: cor.cinzaClaro,
  destaques: cor.cinzaClaro,
  indicacao: cor.azul,
  conteudo: cor.branco,
  campanha: cor.azul,
};

const TelaV3: React.FC<TelaProps> = ({ c, frames, rep, total, inicio }) => {
  const { fps } = useVideoConfig();
  const tela = roteiro.telas.find((t) => t.id === c.id)!;
  if (c.tipo === "abertura" && inicio > 0) {
    // tela do relógio dentro do loop: mesmo painel da abertura, contando o tempo global
    return (
      <PainelContagem
        id={`${tela.id}_loop`}
        segundosNoInicio={Math.round(total / fps)}
        frameGlobalInicio={inicio}
        logoMsj={LOGO_MSJ.negativo}
        duracaoFrames={frames}
      />
    );
  }
  return <>{renderTela(tela, frames, rep, Math.round(total / fps))}</>;
};

const RelogioV3: React.FC<RelogioProps> = ({ segundosNoInicio, ocultarAte, ocultar }) => (
  <CountdownOverlay durationInSeconds={segundosNoInicio} ocultarAteFrame={ocultarAte} ocultar={ocultar} logoMsj={LOGO_MSJ.negativo} />
);

/** A tela só do relógio volta no meio de cada volta do loop, depois da Indicação (ou da tela do meio). */
export const RELOGIO_NO_LOOP_V3 = "tela_04";
export const relogioNoLoopV3 = () => {
  const loop = roteiro.telas.filter((t) => t.exibicao !== "uma_vez");
  const ind = loop.find((t) => t.tipo === "tela_indicacao_metricas");
  return (ind ?? loop[Math.floor((loop.length - 1) / 2)])?.id;
};

export const V3Refinado: React.FC<{ duracao?: number; projeto?: Projeto }> = ({ duracao, projeto }) => {
  if (projeto) usarProjeto(projeto);
  return (
  <EstiloMotion.Provider value="refinado">
    <VersaoBase
      duracao={duracao}
      relogioApos={relogioNoLoopV3()}
      Tela={TelaV3}
      Relogio={RelogioV3}
      fundo={(c) => FUNDO[c.tipo]}
      formasTransicao={[["pentagon-05", "quadrilateral-16"], ["pentagon-06", "pentagon-03"], ["quadrilateral-05", "pentagon-01"]]}
    />
  </EstiloMotion.Provider>
);
};
