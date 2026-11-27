import { staticFile } from "remotion";
import layoutJson from "../../projects/semana-jeito-agi/layout-aprovado.json";

/**
 * Layout aprovado na página de ajuste (frame style v5): posição, tamanho, cor,
 * foto e enquadramento de cada elemento. Regenerar com o exportador da página
 * (projects/semana-jeito-agi/estudo/ajuste-telas) sempre que o layout mudar.
 */
export type Cor = "azul" | "medio" | "escuro" | "verde" | "vclaro" | "amarelo" | "branco";

type Base = { id: string; nome: string; x: number; y: number; w: number; h: number };
export type Elemento =
  | (Base & { tipo: "modulo"; cor: Cor; textura?: boolean; raio?: number })
  | (Base & { tipo: "cacos"; ix: number; iy: number; iw: number; variante: "medio" | "escuro"; flip?: boolean })
  | (Base & { tipo: "texto"; size: number; peso: number; cor: Cor; html: string; valign: "top" | "center" | "bottom"; align: "left" | "center" | "right" })
  | (Base & { tipo: "timer"; size: number; fundo: Cor; cor: Cor })
  | (Base & { tipo: "imagem"; src: string })
  | (Base & { tipo: "fotomask"; src: string; ix: number; iy: number; iw: number })
  | (Base & { tipo: "recorte"; src: string })
  | (Base & { tipo: "operador"; size: number; simbolo: string });

export type TelaLayout = { id: string; nome: string; els: Elemento[] };

export const TELAS: Record<string, TelaLayout> = Object.fromEntries(
  (layoutJson.telas as unknown as TelaLayout[]).map((t) => [t.id, t]),
);

export const COR: Record<Cor, string> = {
  azul: "#0064F5",
  medio: "#0033B0",
  escuro: "#000F44",
  verde: "#77DF40",
  vclaro: "#C9FF90",
  amarelo: "#FFD600",
  branco: "#FFFFFF",
};

const RA = "projects/semana-jeito-agi/render-assets/";
/** Caminhos da página de ajuste -> arquivos do repositório (versões em resolução cheia). */
export const arquivo = (el: Elemento): string => {
  if (el.tipo === "fotomask") return staticFile(`${RA}foto-${el.src}.jpg`);
  if (el.tipo === "recorte") return staticFile(`${RA}recorte-${el.src}.png`);
  if (el.tipo === "imagem") {
    const nome = el.src.replace("assets/", "");
    if (nome.startsWith("logo-semana")) return staticFile(`${RA}${nome}`);
    return staticFile(`brand/logos/${nome}`);
  }
  if (el.tipo === "cacos") return staticFile(`${RA}${el.variante === "escuro" ? "cacos-escuro" : "cacos"}.svg`);
  return "";
};
