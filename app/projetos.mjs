// Projetos de evento: pastas em projects/<id>/ no mesmo formato do projeto de
// novembro (roteiro.json + manifest.json), mais projeto.json, arquivos/ e chat.json.
import fs from "node:fs";
import path from "node:path";
import mammoth from "mammoth";

export const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PROJETOS = path.join(RAIZ, "projects");

export const idValido = (id) => typeof id === "string" && /^[a-z0-9][a-z0-9_-]{2,60}$/i.test(id);
const pasta = (id) => {
  if (!idValido(id)) throw new Error("Nome de evento inválido. Use letras, números, - e _ (ex.: 2026-12_abertura).");
  return path.join(PROJETOS, id);
};
const lerJson = (arq, padrao) => {
  try {
    return JSON.parse(fs.readFileSync(arq, "utf8"));
  } catch {
    return padrao;
  }
};
const gravarJson = (arq, dados) => fs.writeFileSync(arq, JSON.stringify(dados, null, 2) + "\n");

const MANIFEST_BASE = {
  geral: {
    logo_msj_positivo: "brand/logos/logo-msj-positive.svg",
    logo_msj_negativo: "brand/logos/logo-msj-negative.svg",
    logo_agi_negativo: "brand/logos/agi-negative.svg",
    logo_agi_positivo: "brand/logos/agi-positive.svg",
  },
};
const TELA_RELOGIO = {
  id: "tela_00",
  tipo: "tela_inicio_contagem",
  duracaoSegundos: 10,
  exibicao: "uma_vez",
  textos: { titulo: "10:00", corpo: null, bullets: [] },
  midia: { foto: null, logo: "logo_msj_negativo", gridNomes: null },
};

/** Projetos que o app mostra: só os criados por ele (têm projeto.json). */
export const listarProjetos = () =>
  fs
    .readdirSync(PROJETOS, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(PROJETOS, d.name, "projeto.json")))
    .map((d) => lerJson(path.join(PROJETOS, d.name, "projeto.json"), null))
    .filter(Boolean)
    .sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1));

export const criarProjeto = ({ id, nome, versao }) => {
  const p = pasta(id);
  if (fs.existsSync(p)) throw new Error(`Já existe uma pasta projects/${id}.`);
  if (!["V1", "V3"].includes(versao)) throw new Error("Versão deve ser V1 (MSJ) ou V3 (outras lives).");
  fs.mkdirSync(path.join(p, "arquivos"), { recursive: true });
  fs.mkdirSync(path.join(p, "render"), { recursive: true });
  const meta = { id, nome: nome || id, versao, criadoEm: new Date().toISOString() };
  gravarJson(path.join(p, "projeto.json"), meta);
  gravarJson(path.join(p, "roteiro.json"), { projeto: id, telas: [TELA_RELOGIO] });
  gravarJson(path.join(p, "manifest.json"), MANIFEST_BASE);
  gravarJson(path.join(p, "chat.json"), { mensagens: [], conversa: [] });
  return meta;
};

export const lerProjeto = (id) => {
  const p = pasta(id);
  const meta = lerJson(path.join(p, "projeto.json"), null);
  if (!meta) throw new Error(`Evento ${id} não encontrado.`);
  return {
    meta,
    roteiro: lerJson(path.join(p, "roteiro.json"), { telas: [TELA_RELOGIO] }),
    manifest: lerJson(path.join(p, "manifest.json"), MANIFEST_BASE),
    arquivos: listarArquivos(id),
    temRedacao: fs.existsSync(path.join(p, "redacao.md")),
  };
};

export const listarArquivos = (id) => {
  const dir = path.join(pasta(id), "arquivos");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).map((f) => `projects/${id}/arquivos/${f}`);
};

export const lerRedacao = (id) => {
  const arq = path.join(pasta(id), "redacao.md");
  return fs.existsSync(arq) ? fs.readFileSync(arq, "utf8") : "";
};

const nomeSeguro = (nome) =>
  path
    .basename(nome)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+/, "")
    .slice(0, 80) || "arquivo";

const EXTENSOES = /\.(svg|png|jpe?g|docx|md|txt)$/i;

/** Guarda um arquivo enviado. Redação (.docx/.md/.txt) vira redacao.md (texto puro). */
export const salvarArquivo = async (id, nomeOriginal, buffer) => {
  const nome = nomeSeguro(nomeOriginal);
  if (!EXTENSOES.test(nome)) throw new Error("Tipos aceitos: SVG, PNG, JPG (logos e fotos) e DOCX, MD ou TXT (redação).");
  const destino = path.join(pasta(id), "arquivos", nome);
  fs.writeFileSync(destino, buffer);
  let redacao = false;
  if (/\.docx$/i.test(nome)) {
    const { value } = await mammoth.extractRawText({ buffer });
    fs.writeFileSync(path.join(pasta(id), "redacao.md"), value);
    redacao = true;
  } else if (/\.(md|txt)$/i.test(nome)) {
    fs.writeFileSync(path.join(pasta(id), "redacao.md"), buffer.toString("utf8"));
    redacao = true;
  }
  return { caminho: `projects/${id}/arquivos/${nome}`, redacao };
};

export const lerChat = (id) => lerJson(path.join(pasta(id), "chat.json"), { mensagens: [], conversa: [] });
export const gravarChat = (id, chat) => gravarJson(path.join(pasta(id), "chat.json"), chat);

/* ------------------------------------------------------------------ regras */

/** Texto comparável: espaços, aspas e travessões normalizados (o conteúdo não muda). */
const normalizar = (t) =>
  String(t ?? "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Toda frase de tela tem que existir, igual, na redação (copy intocável). */
export const conferirTexto = (redacao, textos) => {
  const base = normalizar(redacao).toLowerCase();
  const faltando = [];
  for (const [onde, t] of textos) {
    if (!t) continue;
    if (!base.includes(normalizar(t).toLowerCase())) faltando.push(`${onde}: "${t}"`);
  }
  return faltando;
};

const palavras = (t) => normalizar(t).split(" ").filter(Boolean).length;

/** Regra de duração do agents/01-parser-redacao.md. */
export const duracaoPelaRegra = (t) => {
  if (t.tipo === "tela_inicio_contagem" || t.tipo === "tela_aguarde") return 10;
  let d = 10 + Math.floor(palavras(t.textos.corpo) / 8);
  if (t.textos.bullets?.length) d += 2;
  if (t.midia.gridNomes?.length) d += 3;
  if (t.midia.foto && /\d/.test([t.textos.corpo, ...(t.textos.bullets ?? [])].join(" "))) d += 2;
  return Math.min(d, t.tipo === "tela_destaques" ? 30 : 20);
};
export const limiteDuracao = (tipo) => (tipo === "tela_destaques" ? [10, 30] : [10, 20]);

/** Arquivo permitido numa tela: enviado para o evento ou da biblioteca oficial (brand/). */
export const arquivoExiste = (caminho) => {
  if (typeof caminho !== "string" || !/^(projects|brand)\//.test(caminho) || caminho.includes("..")) return false;
  return fs.existsSync(path.join(RAIZ, caminho));
};

export const gravarRoteiro = (id, roteiro, manifest) => {
  const p = pasta(id);
  gravarJson(path.join(p, "roteiro.json"), roteiro);
  gravarJson(path.join(p, "manifest.json"), manifest);
};

export const logosOficiais = () =>
  fs
    .readdirSync(path.join(RAIZ, "brand/logos"))
    .filter((f) => /\.svg$/i.test(f) && !/-rgb\.svg$/.test(f))
    .map((f) => `brand/logos/${f}`);
