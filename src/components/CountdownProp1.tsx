import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import shapesData from "../shapesData.json";
import { BrandShape } from "../brand/BrandShape";
import { Logo } from "../brand/Logo";
import { cor } from "../brand/theme";
import { clamp, easeEntra, easeMove, Numero, useContagem } from "./contagem/base";

type Props = { segundosNoInicio: number; logoMsj: string };

const FORMA = "quadrilateral-01" as const;
const RATIO = shapesData[FORMA].h / shapesData[FORMA].w;
// compacto: forma branca sangrando pelo canto superior esquerdo (padrão atual)
const COMPACTO = { x: -96, y: -92, largura: 470, num: { x: 62, y: 42, tam: 54 } };
// final: a mesma forma vira o palco, centralizada
const FINAL = { largura: 1180, tam: 230 };
const DUR = 30; // frames: deslocamento grande, ease-in-out forte

/**
 * Proposta 1 — Clássica.
 * O relógio de sempre (forma branca no canto). Nos 10s finais, forma e número
 * viajam juntos para o centro e crescem; o fundo vira azul sólido por baixo.
 * Lead: número. Support: forma (carrega o número). Decoração: logo MSJ (só fade).
 */
export const CountdownProp1: React.FC<Props> = ({ segundosNoInicio, logoMsj }) => {
  const { frame, restante, inicioFinal } = useContagem(segundosNoInicio);
  const p = easeMove(interpolate(frame, [inicioFinal, inicioFinal + DUR], [0, 1], clamp));
  const fundo = interpolate(frame, [inicioFinal, inicioFinal + DUR * 0.35], [0, 1], clamp);
  const logo = easeEntra(interpolate(frame, [inicioFinal + DUR, inicioFinal + DUR + 18], [0, 1], clamp));

  const larg = COMPACTO.largura + (FINAL.largura - COMPACTO.largura) * p;
  const alt = larg * RATIO;
  const cxIni = COMPACTO.x + COMPACTO.largura / 2;
  const cyIni = COMPACTO.y + (COMPACTO.largura * RATIO) / 2;
  const cx = cxIni + (960 - cxIni) * p;
  const cy = cyIni + (540 - cyIni) * p;
  const tam = COMPACTO.num.tam + (FINAL.tam - COMPACTO.num.tam) * p;
  // número: do canto (ancorado à esquerda) para o centro da forma
  const nx = COMPACTO.num.x + (960 - COMPACTO.num.x) * p;
  const ny = COMPACTO.num.y + COMPACTO.num.tam / 2 + (540 - COMPACTO.num.y - COMPACTO.num.tam / 2) * p;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {fundo > 0 && <AbsoluteFill style={{ backgroundColor: cor.azul, opacity: fundo }} />}
      <div style={{ position: "absolute", left: cx - larg / 2, top: cy - alt / 2 }}>
        <BrandShape nome={FORMA} largura={larg} cor={cor.branco} rotacao={-4} />
      </div>
      <div
        style={{
          position: "absolute",
          left: nx,
          top: ny,
          translate: `${-50 * p}% -50%`,
        }}
      >
        <Numero segundos={restante} noSegundo={99} tamanho={tam} cor={cor.azul} />
      </div>
      {logo > 0 && (
        <div style={{ position: "absolute", right: 140, bottom: 110, opacity: logo }}>
          <Logo arquivo={logoMsj} versao="negativa" altura={92} />
        </div>
      )}
    </AbsoluteFill>
  );
};
