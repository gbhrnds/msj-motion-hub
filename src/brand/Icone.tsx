import React from "react";
import { staticFile } from "remotion";

type IconeProps = {
  arquivo: string;
  /** Cor única e sólida (Brandbook p.77: sem duas cores, sem transparência). */
  cor: string;
  tamanho: number;
  style?: React.CSSProperties;
};

/** Ícone oficial de brand/icons/ pintado com uma cor da paleta via máscara. */
export const Icone: React.FC<IconeProps> = ({ arquivo, cor, tamanho, style }) => {
  const url = `url(${staticFile(arquivo)})`;
  return (
    <div
      style={{
        width: tamanho,
        height: tamanho,
        backgroundColor: cor,
        maskImage: url,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: url,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        ...style,
      }}
    />
  );
};
