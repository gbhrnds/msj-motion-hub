import tokens from "../../brand/tokens.json";

/**
 * Atalhos tipados para os valores do brand/tokens.json.
 * Nenhum valor de marca deve ser escrito "na mão" nos componentes:
 * se faltar algo aqui, adicione primeiro no tokens.json.
 */
export const cor = {
  azul: tokens.colors.azulAgibank.hex,
  azulMedio: tokens.colors.azulMedio.hex,
  azulEscuro: tokens.colors.azulEscuro.hex,
  branco: tokens.colors.branco.hex,
  verde: tokens.colors.verde.hex,
  verdeClaro: tokens.colors.verdeClaro.hex,
  amarelo: tokens.colors.amarelo.hex,
  cinzaClaro: tokens.colors.cinzaClaro.hex,
} as const;

export const tipo = tokens.typography.typeScaleVideo;

export const raio = tokens.shapes.cornerRadiusPxRange.default;
export const strokeOutline = tokens.shapes.outlineConversion.strokeWidthPx;

export const tela = {
  largura: tokens.video.resolution.width,
  altura: tokens.video.resolution.height,
  margem: tokens.video.safeMarginPx.value,
  /** Coluna de conteúdo: margem confortável para telão (>= safe area). */
  colunaX: 140,
} as const;

/**
 * Área ocupada pelo contador regressivo (canto superior esquerdo).
 * Nenhum texto ou logo de tela pode entrar aqui.
 */
export const zonaContador = { x: 0, y: 0, largura: 400, altura: 210 } as const;

export const motionTokens = tokens.motion;
