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

export type Manifest = Record<string, Record<string, string>>;
/** Conteúdo de um evento: roteiro (telas) + manifest (arquivos por tela). */
export type Projeto = { roteiro: { telas: Tela[] }; manifest: Manifest };

/** Projeto de referência (abertura de novembro), usado quando nenhuma prop é passada. */
export const PROJETO_PADRAO: Projeto = {
  roteiro: roteiroData as unknown as { telas: Tela[] },
  manifest: manifestData as unknown as Manifest,
};

/*
 * Projeto ativo: as composições da vinheta recebem o projeto do evento por
 * props (app local / render com --props) e chamam usarProjeto() antes de
 * renderizar as telas. Sem props, vale o projeto de referência.
 */
let atual: Projeto = PROJETO_PADRAO;
export const usarProjeto = (p?: Projeto | null) => {
  atual = p && p.roteiro?.telas?.length ? p : PROJETO_PADRAO;
};
export const roteiro = {
  get telas(): Tela[] {
    return atual.roteiro.telas;
  },
};
const manifestAtual = () => atual.manifest;

/**
 * Logo do evento (V3 para outras lives): manifest.geral.logo_evento_negativo /
 * _positivo. Quando existe, ocupa o lugar do logo MSJ em todas as telas e na
 * Fase 2. Projetos da V1 (exclusiva do MSJ) não definem logo de evento.
 */
const logoEvento = (versao: "negativo" | "positivo") => {
  const g = manifestAtual().geral ?? {};
  return versao === "negativo" ? g.logo_evento_negativo || "" : g.logo_evento_positivo || g.logo_evento_negativo || "";
};
export const temLogoEvento = () => Boolean(logoEvento("negativo"));

/** Chave do roteiro → caminho do arquivo (manifest da tela, depois "geral"). */
export const midia = (chave: string, telaId: string): string => {
  if (chave === "logo_msj_negativo" && temLogoEvento()) return logoEvento("negativo");
  if (chave === "logo_msj_positivo" && temLogoEvento()) return logoEvento("positivo");
  return manifestAtual()[telaId]?.[chave] ?? manifestAtual().geral?.[chave] ?? "";
};

/** Separa os parágrafos do campo "corpo" (texto intacto, só dividido). */
export const paragrafos = (corpo: string | null) => (corpo ?? "").split("\n\n");

/** Logo principal da vinheta: MSJ, ou o logo do evento quando definido (V3). */
export const LOGO_MSJ = {
  get negativo() {
    return midia("logo_msj_negativo", "geral") || "brand/logos/logo-msj-negative.svg";
  },
  get positivo() {
    return midia("logo_msj_positivo", "geral") || "brand/logos/logo-msj-positive.svg";
  },
};

/** Logo agi (versão reduzida). */
export const LOGO_AGI = {
  get negativo() {
    return manifestAtual().geral?.logo_agi_negativo ?? "brand/logos/agi-negative.svg";
  },
  get positivo() {
    return manifestAtual().geral?.logo_agi_positivo ?? "brand/logos/agi-positive.svg";
  },
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
