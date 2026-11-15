import { cor } from "./brand/theme";
import roteiroData from "../projects/2025-11_abertura/roteiro.json";
import manifestData from "../projects/2025-11_abertura/manifest.json";

export type Tela = {
  id: string;
  tipo:
    | "tela_inicio_contagem"
    | "tela_aguarde"
    | "tela_destaques"
    | "tela_conteudo"
    | "tela_campanha"
    | "tela_indicacao_metricas";
  duracaoSegundos: number;
  exibicao?: "uma_vez";
  textos: { titulo: string | null; corpo: string | null; bullets: string[] };
  midia: {
    foto?: string | null;
    logo?: string | string[] | null;
    icone?: string;
    gridNomes?: string[] | null;
  };
  fundoHex?: string;
  layout?: { corOutline?: keyof typeof cor; destaque?: string };
};

export const roteiro = roteiroData as unknown as { telas: Tela[] };
const manifest = manifestData as unknown as Record<string, Record<string, string>>;

/** Chave do roteiro → caminho do arquivo (manifest da tela, depois "geral"). */
export const midia = (chave: string, telaId: string): string =>
  manifest[telaId]?.[chave] ?? manifest.geral?.[chave] ?? "";

/** Separa os parágrafos do campo "corpo" (texto intacto, só dividido). */
export const paragrafos = (corpo: string | null) => (corpo ?? "").split("\n\n");

export const LOGO_MSJ = {
  negativo: manifest.geral?.logo_msj_negativo ?? "",
  positivo: manifest.geral?.logo_msj_positivo ?? "",
};

/** Logo agi (versão reduzida). Vem do manifest ("geral"); vazio até o arquivo oficial ser adicionado. */
export const LOGO_AGI = {
  negativo: manifest.geral?.logo_agi_negativo ?? "",
  positivo: manifest.geral?.logo_agi_positivo ?? "",
};

/** Conteúdo de cada tela já resolvido (texto da redação + arquivos do manifest). */
export type Conteudo =
  | { tipo: "abertura"; id: string }
  | { tipo: "respiro"; id: string; titulo: string; destaque?: string; comLogo: boolean; variante: number }
  | {
      tipo: "destaques";
      id: string;
      chamada: string;
      fechamento: string;
      nomes: string[];
      logoDestaques: string;
      logoJeito: string;
      icone: string;
    }
  | { tipo: "indicacao"; id: string; corpo: string; bullets: string[]; foto: string; recorte: string; logo: string }
  | { tipo: "conteudo"; id: string; corpo: string; chamadaLista: string; bullets: string[]; logo: string }
  | { tipo: "campanha"; id: string; chamada: string; corpo: string };

export const conteudoDe = (t: Tela): Conteudo => {
  switch (t.tipo) {
    case "tela_inicio_contagem":
      return { tipo: "abertura", id: t.id };
    case "tela_aguarde":
      return {
        tipo: "respiro",
        id: t.id,
        titulo: t.textos.titulo ?? "",
        destaque: t.layout?.destaque,
        comLogo: Boolean(t.midia.logo),
        variante: Number(t.id.replace(/\D/g, "")),
      };
    case "tela_destaques": {
      const [chamada, fechamento] = paragrafos(t.textos.corpo);
      const [d, j] = ((t.midia.logo as string[]) ?? []).map((c) => midia(c, t.id));
      return {
        tipo: "destaques",
        id: t.id,
        chamada,
        fechamento: fechamento ?? "",
        nomes: t.midia.gridNomes ?? [],
        logoDestaques: d,
        logoJeito: j,
        icone: t.midia.icone ? midia(t.midia.icone, t.id) : "",
      };
    }
    case "tela_indicacao_metricas":
      return {
        tipo: "indicacao",
        id: t.id,
        corpo: t.textos.corpo ?? "",
        bullets: t.textos.bullets,
        foto: t.midia.foto ?? "",
        recorte: midia("foto_recorte", t.id),
        logo: midia(t.midia.logo as string, t.id),
      };
    case "tela_conteudo": {
      const [corpo, chamadaLista] = paragrafos(t.textos.corpo);
      return {
        tipo: "conteudo",
        id: t.id,
        corpo,
        chamadaLista: chamadaLista ?? "",
        bullets: t.textos.bullets,
        logo: t.midia.logo ? midia(t.midia.logo as string, t.id) : "",
      };
    }
    case "tela_campanha": {
      const [chamada, corpo] = paragrafos(t.textos.corpo);
      return { tipo: "campanha", id: t.id, chamada, corpo: corpo ?? "" };
    }
  }
};
