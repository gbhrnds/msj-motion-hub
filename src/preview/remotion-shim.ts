// Usado só na página de prévia: as imagens (logos, ícones, fotos) vão embutidos
// como data: URI, porque a página publicada não serve SVG por caminho relativo.
// "preview-arquivos" é um módulo virtual gerado por scripts/preview/build.mjs
import arquivos from "preview-arquivos";
import { staticFile as staticFileOriginal } from "remotion-original";

export * from "remotion-original";

export const staticFile = (caminho: string): string => {
  const chave = caminho.replace(/^\.?\//, "");
  return arquivos[chave] ?? staticFileOriginal(caminho);
};
