import React from "react";
import shapesData from "../shapesData.json";
import { BrandShape, ShapeName } from "../brand/BrandShape";
import { MorphForma } from "./MorphForma";
import { parceiras, useRefinado } from "./estilo";

type Props = {
  nome: ShapeName;
  largura: number;
  cor: string;
  modo?: "preenchida" | "outline";
  rotacao?: number;
  espelhar?: boolean;
  /** Desloca o ciclo de morph (formas vizinhas não trocam juntas). */
  fase?: number;
  /** Formas oficiais para onde ela pode morfar (validadas na tela). Vazio = não morfa. */
  alternativas?: ShapeName[];
};

/**
 * Forma oficial. No estilo "refinado" ela morfa de tempos em tempos para
 * formas oficiais de proporção parecida e volta — ocupando a mesma caixa
 * (mesmo centro e tamanho), então a composição validada não muda.
 */
export const FormaViva: React.FC<Props> = ({ nome, largura, cor, modo, rotacao = 0, espelhar, fase = 0, alternativas }) => {
  const refinado = useRefinado();
  const alts = alternativas ?? parceiras(nome).slice(0, 2);
  if (!refinado || alts.length === 0) {
    return <BrandShape nome={nome} largura={largura} cor={cor} modo={modo} rotacao={rotacao} espelhar={espelhar} />;
  }
  const f = shapesData[nome];
  const altura = (largura * f.h) / f.w;
  const lado = Math.max(largura, altura);
  return (
    <div style={{ width: largura, height: altura, position: "relative" }}>
      <div style={{ position: "absolute", left: (largura - lado) / 2, top: (altura - lado) / 2, scale: espelhar ? "-1 1" : undefined }}>
        <MorphForma
          formas={[nome, ...alts.slice(0, 2)]}
          tamanho={lado}
          cor={cor}
          modo={modo}
          rotacao={rotacao}
          segurar={84}
          morfar={22}
          atraso={Math.round(fase * 23)}
        />
      </div>
    </div>
  );
};
