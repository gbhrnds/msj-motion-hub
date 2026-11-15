import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FormaViva } from "./FormaViva";
import { conflitos, GrafismoSpec, parceirasSeguras, ZonaLivre } from "../brand/grafismos";
import { motionTokens } from "../brand/theme";
import { WiggleShape } from "./WiggleShape";

export type Ato = {
  /** Frame em que o ato começa (a transição de formas começa aqui). */
  inicio: number;
  formas: GrafismoSpec[];
  zonas: ZonaLivre[];
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const mov = motionTokens.movimentoEmTela;
const ent = motionTokens.entradaGrafismo;
const easeMov = Easing.bezier(...(mov.easingBezier as [number, number, number, number]));
const easeEnt = Easing.bezier(...(ent.easingBezier as [number, number, number, number]));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Menor caminho entre dois ângulos (evita giro de 300° numa troca de ato). */
const lerpAngulo = (a: number, b: number, p: number) => {
  const d = ((((b - a) % 360) + 540) % 360) - 180;
  return a + d * p;
};

const Camada: React.FC<{ g: GrafismoSpec; opacidade: number; escala?: number; alternativas?: Parameters<typeof FormaViva>[0]["alternativas"] }> = ({
  g,
  opacidade,
  escala = 1,
  alternativas = [],
}) => (
  <div
    style={{
      position: "absolute",
      left: g.x,
      top: g.y,
      opacity: opacidade,
      scale: String(escala),
    }}
  >
    <WiggleShape
      amplitudeDeg={motionTokens.wiggleShape.amplitudeDeg}
      amplitudePx={motionTokens.wiggleShape.amplitudePx}
      cyclesPerSecond={motionTokens.wiggleShape.speedCyclesPerSecond}
      fase={g.fase ?? 0}
    >
      <div data-camada={`forma ${g.id} · ${g.nome}`} style={{ display: "contents" }}>
        <FormaViva
          nome={g.nome}
          largura={g.largura}
          cor={g.cor}
          modo={g.modo}
          rotacao={g.rotacao}
          espelhar={g.espelhar}
          fase={g.fase}
          alternativas={alternativas}
        />
      </div>
    </WiggleShape>
  </div>
);

/**
 * Grafismos que mudam de arranjo a cada ato da tela.
 * - mesma forma (id) nos dois atos: desliza para a nova posição (movimentoEmTela);
 *   se a cor muda, as duas cores se dissolvem durante o deslize;
 * - forma que só existe num dos atos: sai (fade) ou entra (fade + scale) sem deslocar.
 * Cada arranjo é validado pela regra de sobreposição (o render falha se houver conflito).
 */
export const GrafismosPorAto: React.FC<{ tela: string; atos: Ato[] }> = ({
  tela,
  atos,
}) => {
  atos.forEach((a, i) => {
    const erros = conflitos(a.formas, a.zonas);
    if (erros.length)
      throw new Error(`[${tela} ato ${i + 1}] formas sobrepostas: ${erros.join(", ")}`);
  });

  const seguras = atos.map((a) => parceirasSeguras(a.formas, a.zonas));
  const frame = useCurrentFrame();
  const k = atos.reduce((acc, a, i) => (frame >= a.inicio ? i : acc), 0);
  const atual = atos[k];
  const anterior = k > 0 ? atos[k - 1] : null;
  const t = frame - atual.inicio;
  const pMov = easeMov(interpolate(t, [0, mov.durationFrames], [0, 1], clamp));

  const camadas: React.ReactNode[] = [];
  for (const g of atual.formas) {
    const de = anterior?.formas.find((f) => f.id === g.id);
    if (de) {
      const meio: GrafismoSpec = {
        ...g,
        x: lerp(de.x, g.x, pMov),
        y: lerp(de.y, g.y, pMov),
        largura: lerp(de.largura, g.largura, pMov),
        rotacao: lerpAngulo(de.rotacao ?? 0, g.rotacao ?? 0, pMov),
      };
      if (de.cor !== g.cor || de.nome !== g.nome) {
        camadas.push(
          <Camada key={`${g.id}-de`} g={{ ...meio, cor: de.cor, nome: de.nome }} opacidade={1 - pMov} />,
        );
      }
      camadas.push(
        <Camada key={g.id} g={meio} opacidade={de.cor !== g.cor || de.nome !== g.nome ? pMov : 1} alternativas={pMov >= 1 ? seguras[k][g.id] : []} />,
      );
    } else {
      const te = t - (g.delayFrames ?? 0) - (anterior ? mov.durationFrames / 2 : 0);
      const p = easeEnt(interpolate(te, [0, ent.durationFrames], [0, 1], clamp));
      camadas.push(<Camada key={g.id} g={g} opacidade={p} escala={lerp(ent.scaleFrom, 1, p)} alternativas={seguras[k][g.id]} />);
    }
  }
  for (const g of anterior?.formas ?? []) {
    if (atual.formas.some((f) => f.id === g.id)) continue;
    const p = interpolate(t, [0, mov.durationFrames / 2], [1, 0], clamp);
    if (p > 0) camadas.push(<Camada key={`${g.id}-sai`} g={g} opacidade={p} escala={lerp(ent.scaleFrom, 1, p)} />);
  }

  return <AbsoluteFill>{camadas}</AbsoluteFill>;
};
