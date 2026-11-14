import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Logo } from "../brand/Logo";
import { cor } from "../brand/theme";
import { fontFamily } from "../fonts";
import { clamp, easeEntra, Numero, useContagem } from "./contagem/base";

type Props = {
  segundosNoInicio: number;
  logoMsj: string;
  /** Frase que se completa com o tempo (texto do usuário/redação, não inventar). */
  frase?: { linha1: string[]; linha2: string[] };
};

const PADRAO = {
  linha1: ["Quase", "prontos", "para..."],
  linha2: ["...estarmos", "juntos"],
};
const TAM_NUM = 300;
const TAM_FRASE = 64;

/**
 * Proposta 2 — inspirada no NuDay.
 * Fundo azul sólido, número gigante alinhado à esquerda e centralizado na
 * vertical, sem card e sem formas. Ao lado, a frase vai se completando ao longo
 * de toda a contagem: a última palavra chega exatamente nos 10s finais.
 * Lead: número (parado, só troca de dígito). Support: palavras da frase,
 * uma de cada vez (fade + 16px). Decoração: logo MSJ.
 */
export const CountdownProp2: React.FC<Props> = ({
  segundosNoInicio,
  logoMsj,
  frase = PADRAO,
}) => {
  const { frame, fps, restante, noSegundo, inicioFinal } = useContagem(segundosNoInicio);
  const palavras = [...frase.linha1, ...frase.linha2];
  // momentos de entrada: espalhados até o início dos 10s finais (a última fecha a frase)
  const momento = (i: number) =>
    Math.round((inicioFinal * i) / (palavras.length - 1));
  const entrada = (i: number) =>
    easeEntra(interpolate(frame, [momento(i), momento(i) + 18], [0, 1], clamp));

  const linha = (lista: string[], offset: number, peso: number) => (
    <div style={{ display: "flex", gap: TAM_FRASE * 0.28, whiteSpace: "nowrap" }}>
      {lista.map((w, k) => {
        const p = entrada(offset + k);
        return (
          <span
            key={w}
            style={{
              opacity: p,
              translate: `0 ${(1 - p) * 16}px`,
              fontWeight: peso,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: cor.azul }}>
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 540,
          translate: "0 -50%",
          display: "flex",
          alignItems: "center",
          gap: 72,
        }}
      >
        <Numero segundos={restante} noSegundo={noSegundo} tamanho={TAM_NUM} cor={cor.branco} />
        <div
          style={{
            fontFamily,
            fontSize: TAM_FRASE,
            lineHeight: 1.15,
            color: cor.branco,
          }}
        >
          {linha(frase.linha1, 0, 300)}
          {linha(frase.linha2, frase.linha1.length, 700)}
        </div>
      </div>
      <div style={{ position: "absolute", right: 140, bottom: 110, opacity: interpolate(frame, [0, fps * 0.6], [0, 1], clamp) }}>
        <Logo arquivo={logoMsj} versao="negativa" altura={72} />
      </div>
    </AbsoluteFill>
  );
};
