import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, Series, useCurrentFrame, useVideoConfig } from "remotion";
import { motionTokens } from "../brand/theme";
import type { ShapeName } from "../brand/BrandShape";
import { Conteudo, conteudoDe, roteiro } from "../dados";
import { MorphForma } from "../motion/MorphForma";

export const SEGUNDOS_FINAIS = 10;

export type TelaProps = { c: Conteudo; frames: number; rep: number; /** frame global em que a tela começa (para o relógio). */ inicio: number; /** frames totais da contagem. */ total: number };
export type RelogioProps = { segundosNoInicio: number; ocultarAte: number };

type Montagem = { key: string; c: Conteudo; frames: number; rep: number };

/** Abertura (1x) + uma volta do loop + 10s finais — a duração de review de uma versão. */
export const montarReview = (fps: number) => {
  const telas = roteiro.telas;
  const seq: Montagem[] = [];
  const add = (t: (typeof telas)[number], rep: number) =>
    seq.push({ key: `${t.id}-${rep}`, c: conteudoDe(t), frames: Math.round(t.duracaoSegundos * fps), rep });
  telas.filter((t) => t.exibicao === "uma_vez").forEach((t) => add(t, 0));
  const abertura = seq.reduce((a, s) => a + s.frames, 0);
  telas.filter((t) => t.exibicao !== "uma_vez").forEach((t) => add(t, 0));
  const conteudo = seq.reduce((a, s) => a + s.frames, 0);
  const final = Math.round(SEGUNDOS_FINAIS * fps);
  return { seq, abertura, total: conteudo + final };
};

export const duracaoReview = (fps: number) => montarReview(fps).total;

const [m1, m2, m3, m4] = motionTokens.movimentoEmTela.easingBezier;
const easeMove = Easing.bezier(m1, m2, m3, m4);

/**
 * Transição por forma: a cor de fundo da próxima tela chega como uma forma
 * oficial que cresce do centro, morfando no caminho, até cobrir o quadro.
 * O corte acontece por baixo; como a forma tem a cor do novo fundo, ela some sem emenda.
 */
const TransicaoForma: React.FC<{ cor: string; formas: ShapeName[]; dur: number; rotacao: number }> = ({
  cor,
  formas,
  dur,
  rotacao,
}) => {
  const frame = useCurrentFrame();
  const p = easeMove(interpolate(frame, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const tam = 140 + (4600 - 140) * p;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
      <div style={{ opacity: Math.min(1, p * 6) }}>
        <MorphForma formas={formas} tamanho={tam} cor={cor} segurar={0} morfar={dur} rotacao={rotacao + p * 40} />
      </div>
    </AbsoluteFill>
  );
};

type VersaoProps = {
  Tela: React.FC<TelaProps>;
  Relogio: React.FC<RelogioProps>;
  /** Cor de fundo de cada tela (usada pela transição por forma). */
  fundo?: (c: Conteudo) => string;
  /** Pares de formas oficiais usados nas transições (alternam a cada corte). */
  formasTransicao?: ShapeName[][];
  durTransicao?: number;
};

export const VersaoBase: React.FC<VersaoProps> = ({
  Tela,
  Relogio,
  fundo,
  formasTransicao = [["pentagon-05", "quadrilateral-05"], ["quadrilateral-16", "pentagon-03"], ["pentagon-06", "quadrilateral-01"]],
  durTransicao = 20,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { seq, abertura } = montarReview(fps);
  const cortes: { frame: number; cor: string }[] = [];
  let acc = 0;
  seq.forEach((s, i) => {
    acc += s.frames;
    const prox = seq[i + 1];
    if (prox && fundo) cortes.push({ frame: acc, cor: fundo(prox.c) });
  });
  const inicios = seq.map((_, i) => seq.slice(0, i).reduce((a, x) => a + x.frames, 0));
  return (
    <AbsoluteFill>
      <Series>
        {seq.map((s, i) => (
          <Series.Sequence key={s.key} durationInFrames={s.frames} name={s.key}>
            <Tela c={s.c} frames={s.frames} rep={s.rep} inicio={inicios[i]} total={durationInFrames} />
          </Series.Sequence>
        ))}
      </Series>
      {cortes.map((k, i) => (
        <Sequence key={k.frame} from={k.frame - durTransicao} durationInFrames={durTransicao + 1} name={`transição ${i + 1}`}>
          <TransicaoForma cor={k.cor} formas={formasTransicao[i % formasTransicao.length]} dur={durTransicao} rotacao={i * 37} />
        </Sequence>
      ))}
      <Relogio segundosNoInicio={Math.round(durationInFrames / fps)} ocultarAte={abertura} />
    </AbsoluteFill>
  );
};
