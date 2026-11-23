import { createContext, useContext } from "react";
import { z } from "zod";
import shapesData from "../../shapesData.json";
import type { ShapeName } from "../../brand/BrandShape";
import { cor } from "../../brand/theme";
import layoutSalvo from "./layout-v1.json";

/*
 * Layout editável da V1 (sem Figma): os valores ficam em layout-v1.json e são
 * ajustados no Remotion Studio pelas composições "V1-Editor-*" (painel de props
 * à direita + botão "Salvar layout" no quadro). A vinheta lê o mesmo arquivo.
 * Os campos só aceitam o que a marca permite: formas oficiais e cores da paleta.
 */

export const ARQUIVO_LAYOUT_V1 = "src/versoes/v1/layout-v1.json";

const nomesForma = Object.keys(shapesData) as [ShapeName, ...ShapeName[]];
const forma = z.enum(nomesForma);
// cores permitidas para outlines no cinza claro (paleta; amarelo só como traço)
const corPaleta = z.enum(["azul", "azulMedio", "azulEscuro", "verde", "amarelo"]);
export type CorPaleta = z.infer<typeof corPaleta>;
export const hexDe = (c: CorPaleta) => cor[c];

const px = (min: number, max: number) => z.number().min(min).max(max);

const respiroVariante = z.object({
  forma: z.object({
    nome: forma,
    x: px(-400, 1920),
    y: px(-400, 1080),
    largura: px(80, 1400),
    rotacao: px(-180, 180),
  }),
  morfaPara: z.array(forma).max(3),
  cores: z.array(corPaleta).min(1).max(3),
  mascara: z.object({ x: px(0, 1920), y: px(0, 1080), largura: px(0, 1920), altura: px(0, 1080) }),
  texto: z.object({ x: px(0, 1920), y: px(0, 1080), tamanho: px(40, 96) }),
});

export const schemaLayoutV1 = z.object({
  respiro: z.object({ semLogo: respiroVariante, comLogo: respiroVariante }),
});
export type LayoutV1 = z.infer<typeof schemaLayoutV1>;
export type LayoutRespiro = z.infer<typeof respiroVariante>;

export const LAYOUT_V1: LayoutV1 = schemaLayoutV1.parse(layoutSalvo);

/** O editor injeta o layout em edição; a vinheta usa o salvo. */
export const LayoutV1Context = createContext<LayoutV1>(LAYOUT_V1);
export const useLayoutV1 = () => useContext(LayoutV1Context);
