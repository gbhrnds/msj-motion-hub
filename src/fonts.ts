import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontFamily = "Agibank Sans";

// Pesos carregados hoje — cobre tudo que o tokens.json usa (Regular, Medium,
// ExtraBold) + alguns extras de apoio (Light, SemiBold, Bold) para flexibilidade.
// Para adicionar outro peso depois (ex: Black ou alguma Italic), basta
// seguir o mesmo padrão de linha abaixo, apontando pro arquivo certo em brand/fonts/.
const pesos = [
  { weight: "300", arquivo: "AgibankSans-Light.woff2" },
  { weight: "400", arquivo: "AgibankSans-Regular.woff2" },
  { weight: "500", arquivo: "AgibankSans-Medium.woff2" },
  { weight: "600", arquivo: "AgibankSans-SemiBold.woff2" },
  { weight: "700", arquivo: "AgibankSans-Bold.woff2" },
  { weight: "800", arquivo: "AgibankSans-ExtraBold.woff2" },
];

export const fontsLoaded = Promise.all(
  pesos.map(({ weight, arquivo }) =>
    loadFont({
      family: fontFamily,
      url: staticFile(`brand/fonts/${arquivo}`),
      weight,
    }),
  ),
);
