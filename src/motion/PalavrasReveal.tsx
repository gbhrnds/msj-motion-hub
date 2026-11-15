import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { motionTokens } from "../brand/theme";
import { quebraBoa } from "../brand/quebraDeLinha";

const [e1, e2, e3, e4] = motionTokens.entradaGrafismo.easingBezier;
const easeEntra = Easing.bezier(e1, e2, e3, e4);

export type Trecho = { texto: string; peso?: number; cor?: string };

type Props = {
  trechos: Trecho[];
  delay?: number;
  /** Frames de entrada de cada palavra. */
  dur?: number;
  /** Intervalo entre palavras: começa em `passo` e encolhe (stagger decrescente, nunca uniforme). */
  passo?: number;
  /** "mascara": a palavra sobe de dentro da própria linha. "fade": só opacidade + 12px. */
  modo?: "mascara" | "fade";
  /** Saída: frame local em que as palavras saem juntas (sem stagger reverso). */
  sairEm?: number;
  style?: React.CSSProperties;
};

/**
 * Tipografia cinética por palavra (skill choreograph: lead entra palavra a
 * palavra, com intervalos que encolhem; saída simultânea e mais curta).
 * Aplica a regra de quebra de linha: unidades "grudadas" entram juntas.
 */
export const PalavrasReveal: React.FC<Props> = ({
  trechos,
  delay = 0,
  dur = 16,
  passo = 4,
  modo = "mascara",
  sairEm,
  style,
}) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  // quebra boa no texto inteiro (mesmo comprimento), depois volta para os trechos
  const inteiro = trechos.map((t) => t.texto).join("");
  const q = quebraBoa(inteiro);
  let pos = 0;
  const palavras: { w: string; t: Trecho; espaco: boolean }[] = [];
  trechos.forEach((t) => {
    const parte = q.slice(pos, pos + t.texto.length);
    pos += t.texto.length;
    parte.split(/( )/).forEach((w) => {
      if (w === " ") {
        if (palavras.length) palavras[palavras.length - 1].espaco = true;
      } else if (w) palavras.push({ w, t, espaco: false });
    });
  });
  let atraso = delay;
  const saida = sairEm === undefined ? 0 : easeEntra(interpolate(frame, [sairEm, sairEm + 10], [0, 1], clamp));
  return (
    <span style={style}>
      {palavras.map((p, i) => {
        const inicio = atraso;
        atraso += Math.max(1.5, passo * Math.pow(0.88, i));
        const v = easeEntra(interpolate(frame, [inicio, inicio + dur], [0, 1], clamp));
        const conteudo = (
          <span
            style={{
              display: "inline-block",
              fontWeight: p.t.peso,
              color: p.t.cor,
              translate: modo === "mascara" ? `0 ${(1 - v) * 105 - saida * 30}%` : `0 ${(1 - v) * 12 - saida * 12}px`,
              opacity: modo === "fade" ? v * (1 - saida) : 1 - saida,
            }}
          >
            {p.w}
          </span>
        );
        return (
          <React.Fragment key={i}>
            {modo === "mascara" ? (
              <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.08em" }}>{conteudo}</span>
            ) : (
              conteudo
            )}
            {p.espaco ? " " : ""}
          </React.Fragment>
        );
      })}
    </span>
  );
};

/** Separa o texto em [antes, destaque, depois] como trechos (texto intacto). */
export const comDestaque = (texto: string, destaque: string | undefined, leve: number, forte: number): Trecho[] => {
  const i = destaque ? texto.indexOf(destaque) : -1;
  if (!destaque || i < 0) return [{ texto, peso: leve }];
  return [
    { texto: texto.slice(0, i), peso: leve },
    { texto: destaque, peso: forte },
    { texto: texto.slice(i + destaque.length), peso: leve },
  ].filter((t) => t.texto);
};
