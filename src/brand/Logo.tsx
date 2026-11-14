import React from "react";
import { Img, staticFile } from "remotion";

type LogoProps = {
  /** Caminho a partir da raiz do projeto (vem do manifest.json). */
  arquivo: string;
  /** Versão de acordo com o fundo: positiva em fundo claro, negativa em fundo escuro. */
  versao: "positiva" | "negativa";
  altura: number;
  style?: React.CSSProperties;
};

/**
 * Troca entre as versões positiva/negativa pelo nome do arquivo
 * (-positive/-negative, _positivo/_negativo), sem nunca recolorir o SVG.
 */
export const versaoDoArquivo = (arquivo: string, versao: LogoProps["versao"]) =>
  versao === "negativa"
    ? arquivo.replace("-positive", "-negative").replace("_positivo", "_negativo")
    : arquivo.replace("-negative", "-positive").replace("_negativo", "_positivo");

export const Logo: React.FC<LogoProps> = ({ arquivo, versao, altura, style }) => (
  <Img
    src={staticFile(versaoDoArquivo(arquivo, versao))}
    style={{ height: altura, width: "auto", display: "block", ...style }}
  />
);
