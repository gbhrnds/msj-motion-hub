// O chat do Estúdio: Claude (Messages API) com ferramentas que leem a redação,
// montam o roteiro do evento e disparam o render. Roda no computador do usuário;
// as ferramentas mexem só na pasta projects/<evento>/.
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  RAIZ,
  arquivoExiste,
  conferirTexto,
  duracaoPelaRegra,
  gravarChat,
  gravarRoteiro,
  lerChat,
  lerProjeto,
  lerRedacao,
  limiteDuracao,
  logosOficiais,
} from "./projetos.mjs";
import { iniciarRender, statusRender } from "./render.mjs";

const MODELO = "claude-opus-5-5";
let cliente = null;
const api = () => (cliente ??= new Anthropic());

/* ------------------------------------------------------------- instruções */

const ler = (rel) => {
  try {
    return fs.readFileSync(path.join(RAIZ, rel), "utf8");
  } catch {
    return "";
  }
};

// Estável entre turnos (fica em cache): regras do projeto + guia do parser.
const SISTEMA = `Você é o assistente do Estúdio de Motion do Agibank: ajuda a montar, por conversa, a vinheta pré-live de um evento (10 min de conteúdo em loop + 5 min só com o logo). Fale sempre em português do Brasil, de forma curta e clara; quem usa é do time de comunicação, não programador.

## Como você trabalha
- Cada conversa é sobre um evento (projeto). Use ver_projeto para saber o que já existe (versão, arquivos enviados, telas).
- A versão do evento já vem definida: V1 é exclusiva do Momento Sempre Juntos (logo MSJ fixo); V3 é o padrão para outras lives (o logo do evento substitui o MSJ — use definir_logo_evento com o arquivo enviado). Nunca defina logo de evento num projeto V1.
- Quando houver redação, leia com ler_redacao e monte o roteiro com salvar_roteiro, seguindo o guia do parser abaixo (tipos de tela, respiros entre telas de conteúdo, tempo de leitura).
- O texto das telas é copiado da redação EXATAMENTE como está (mesmas palavras, pontuação e maiúsculas). Você nunca escreve, resume, corrige ou completa texto. O salvar_roteiro confere cada frase contra a redação e recusa a tela se algo não bater — se recusar, corrija copiando o trecho exato.
- Frases de respiro também vêm da redação. Se a redação não tiver frases de respiro suficientes, pergunte ao usuário em vez de inventar.
- Fotos e logos: use só arquivos enviados pelo usuário para o evento (caminhos em ver_projeto) ou logos oficiais (listar_logos_oficiais). Se faltar um arquivo que a tela precisa (ex.: foto da indicação, logo do programa), pergunte. Não existe ferramenta para recortar a pessoa da foto: o recorte é opcional e só entra se o usuário enviar o PNG recortado.
- Durações: deixe em branco para usar a regra do projeto; só defina quando o usuário pedir. Limites: 10–20 s (Destaques até 30 s).
- O layout fino (posição de formas e textos) não é feito aqui: diga que é ajustado no Remotion Studio, no editor da versão.
- Só chame gerar_mp4 quando o usuário pedir o render.
- Depois de cada mudança, resuma em poucas linhas o que ficou (telas, durações, o que falta).

## Tipos de tela que a vinheta sabe desenhar
- respiro: frase curta da redação, opcionalmente com um trecho em destaque (negrito) e com o logo do evento.
- destaques: chamada + fechamento + grade de nomes, com o logo "Destaques do Ciclo" e o logo do pilar do Jeito Agi.
- indicacao: corpo + métrica (ex.: "10 ganhadores no 2º trimestre", número primeiro) + foto + logo do programa.
- conteudo: corpo + chamada da lista + itens da lista + logo (opcional).
- campanha: chamada + corpo.
Se um assunto da redação não couber em nenhum tipo, avise o usuário e pergunte como seguir.

## Regras do projeto (CLAUDE.md)
${ler("CLAUDE.md")}

## Guia do parser de redação (agents/01-parser-redacao.md)
${ler("agents/01-parser-redacao.md")}`;

/* -------------------------------------------------------------- ferramentas */

const caminho = z.string().describe("Caminho de um arquivo enviado (projects/<evento>/arquivos/...) ou oficial (brand/logos/...)");
const segundos = z.number().int().min(10).max(30).optional().describe("Só se o usuário pedir; senão vale a regra do projeto");

const TelaEntrada = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("respiro"),
    texto: z.string().describe("Frase exata da redação"),
    destaque: z.string().optional().describe("Trecho do texto que vai em negrito (tem que estar dentro do texto)"),
    comLogo: z.boolean(),
  }),
  z.object({
    tipo: z.literal("destaques"),
    chamada: z.string(),
    fechamento: z.string(),
    nomes: z.array(z.string()).min(1),
    logoDestaques: caminho,
    logoJeitoAgi: caminho,
    segundos,
  }),
  z.object({
    tipo: z.literal("indicacao"),
    corpo: z.string(),
    metrica: z.string().describe("Frase da métrica, começando pelo número"),
    foto: caminho,
    recorte: caminho.optional().describe("PNG da pessoa recortada, se o usuário enviou"),
    logo: caminho,
    segundos,
  }),
  z.object({
    tipo: z.literal("conteudo"),
    corpo: z.string(),
    chamadaLista: z.string(),
    itens: z.array(z.string()).min(1),
    logo: caminho.optional(),
    segundos,
  }),
  z.object({ tipo: z.literal("campanha"), chamada: z.string(), corpo: z.string(), segundos }),
]);

const FERRAMENTAS = {
  ver_projeto: {
    descricao: "Mostra o evento: versão (V1/V3), arquivos enviados, telas atuais com durações, logo do evento e se há redação.",
    schema: z.object({}),
  },
  ler_redacao: { descricao: "Lê o texto completo da redação enviada (.docx/.md convertido em texto).", schema: z.object({}) },
  listar_logos_oficiais: { descricao: "Lista os logos oficiais disponíveis em brand/logos (programas, pilares do Jeito Agi, MSJ, agi).", schema: z.object({}) },
  salvar_roteiro: {
    descricao:
      "Grava todas as telas do loop, em ordem (o relógio de abertura entra sozinho no início). Confere o texto contra a redação, os arquivos e as durações; devolve erros para corrigir ou o resumo do roteiro.",
    schema: z.object({ telas: z.array(TelaEntrada).min(1) }),
  },
  ajustar_duracao: {
    descricao: "Muda a duração de uma tela (10–20 s; Destaques até 30 s).",
    schema: z.object({ tela_id: z.string(), segundos: z.number().int().min(10).max(30) }),
  },
  definir_logo_evento: {
    descricao: "Só V3: define o logo do evento, que substitui o logo MSJ em todas as telas e na Fase 2.",
    schema: z.object({ negativo: caminho.describe("Versão para fundo azul"), positivo: caminho.optional().describe("Versão para fundo claro") }),
  },
  gerar_mp4: { descricao: "Renderiza a vinheta completa (15 min) em MP4. Só quando o usuário pedir.", schema: z.object({}) },
};

const ferramentasApi = Object.entries(FERRAMENTAS).map(([name, f]) => {
  const { $schema, ...input_schema } = z.toJSONSchema(f.schema);
  return { name, description: f.descricao, input_schema, eager_input_streaming: true };
});

/* --------------------------------------------------- execução das ferramentas */

const resumo = (proj) => {
  const telas = proj.roteiro.telas.map((t) => ({
    id: t.id,
    tipo: t.tipo,
    segundos: t.duracaoSegundos,
    texto: t.textos.titulo || (t.textos.corpo ?? "").slice(0, 80),
  }));
  const loop = proj.roteiro.telas.filter((t) => t.exibicao !== "uma_vez").reduce((a, t) => a + t.duracaoSegundos, 0);
  return {
    evento: proj.meta,
    logoEvento: proj.manifest.geral?.logo_evento_negativo ?? null,
    temRedacao: proj.temRedacao,
    arquivos: proj.arquivos,
    telas,
    segundosPorVoltaDoLoop: loop,
  };
};

const montarRoteiro = (id, telasEntrada, proj) => {
  const redacao = lerRedacao(id);
  if (!redacao) return { erro: "Ainda não há redação neste evento. Peça para o usuário enviar o arquivo (.docx)." };
  const erros = [];
  const textos = [];
  const manifest = { geral: { ...proj.manifest.geral } };
  const telas = [proj.roteiro.telas.find((t) => t.tipo === "tela_inicio_contagem") ?? proj.roteiro.telas[0]];
  telasEntrada.forEach((e, i) => {
    const id_ = `tela_${String(i + 1).padStart(2, "0")}`;
    const arq = (campo, c, opcional) => {
      if (!c) {
        if (!opcional) erros.push(`${id_}: falta ${campo}`);
        return null;
      }
      if (!arquivoExiste(c)) erros.push(`${id_}: arquivo não encontrado em ${campo}: ${c}`);
      return c;
    };
    let t;
    if (e.tipo === "respiro") {
      textos.push([`${id_} texto`, e.texto]);
      if (e.destaque && !e.texto.includes(e.destaque)) erros.push(`${id_}: o destaque "${e.destaque}" não está dentro do texto`);
      t = {
        tipo: "tela_aguarde",
        textos: { titulo: e.texto, corpo: null, bullets: [] },
        midia: { foto: null, logo: e.comLogo ? "logo_msj_positivo" : null, gridNomes: null },
        layout: e.destaque ? { destaque: e.destaque } : undefined,
      };
    } else if (e.tipo === "destaques") {
      textos.push([`${id_} chamada`, e.chamada], [`${id_} fechamento`, e.fechamento], ...e.nomes.map((n) => [`${id_} nome`, n]));
      manifest[id_] = { logo_destaques: arq("logoDestaques", e.logoDestaques), logo_jeito_agi: arq("logoJeitoAgi", e.logoJeitoAgi), icone_coracao: "brand/icons/heart.svg" };
      t = {
        tipo: "tela_destaques",
        textos: { titulo: null, corpo: `${e.chamada}\n\n${e.fechamento}`, bullets: [] },
        midia: { foto: null, logo: ["logo_destaques", "logo_jeito_agi"], icone: "icone_coracao", gridNomes: e.nomes },
      };
    } else if (e.tipo === "indicacao") {
      textos.push([`${id_} corpo`, e.corpo], [`${id_} métrica`, e.metrica]);
      if (!/^\S*\d/.test(e.metrica)) erros.push(`${id_}: a métrica precisa começar pelo número (ex.: "10 ganhadores...")`);
      const m = { logo_programa: arq("logo", e.logo) };
      if (e.recorte) m.foto_recorte = arq("recorte", e.recorte, true);
      manifest[id_] = m;
      t = {
        tipo: "tela_indicacao_metricas",
        textos: { titulo: null, corpo: e.corpo, bullets: [e.metrica] },
        midia: { foto: arq("foto", e.foto), logo: "logo_programa", gridNomes: null },
      };
    } else if (e.tipo === "conteudo") {
      textos.push([`${id_} corpo`, e.corpo], [`${id_} chamada da lista`, e.chamadaLista], ...e.itens.map((b) => [`${id_} item`, b]));
      if (e.logo) manifest[id_] = { logo_conteudo: arq("logo", e.logo, true) };
      t = {
        tipo: "tela_conteudo",
        textos: { titulo: null, corpo: `${e.corpo}\n\n${e.chamadaLista}`, bullets: e.itens },
        midia: { foto: null, logo: e.logo ? "logo_conteudo" : null, gridNomes: null },
      };
    } else {
      textos.push([`${id_} chamada`, e.chamada], [`${id_} corpo`, e.corpo]);
      t = { tipo: "tela_campanha", textos: { titulo: null, corpo: `${e.chamada}\n\n${e.corpo}`, bullets: [] }, midia: { foto: null, logo: null, gridNomes: null } };
    }
    t = { id: id_, ...t };
    const [min, max] = limiteDuracao(t.tipo);
    const pedido = "segundos" in e ? e.segundos : undefined;
    if (pedido !== undefined && (pedido < min || pedido > max)) erros.push(`${id_}: duração fora do limite (${min}–${max} s)`);
    t.duracaoSegundos = pedido ?? duracaoPelaRegra(t);
    telas.push(t);
  });
  const faltando = conferirTexto(redacao, textos);
  if (faltando.length) erros.push(...faltando.map((f) => `texto diferente da redação → ${f}`));
  if (erros.length) return { erro: "Roteiro não salvo. Corrija e chame salvar_roteiro de novo.", detalhes: erros };
  gravarRoteiro(id, { projeto: id, telas }, manifest);
  return { ok: true, ...resumo(lerProjeto(id)) };
};

export const executar = async (id, nome, entrada) => {
  const proj = lerProjeto(id);
  switch (nome) {
    case "ver_projeto":
      return resumo(proj);
    case "ler_redacao":
      return lerRedacao(id) || "Nenhuma redação enviada ainda.";
    case "listar_logos_oficiais":
      return logosOficiais();
    case "salvar_roteiro":
      return montarRoteiro(id, entrada.telas, proj);
    case "ajustar_duracao": {
      const t = proj.roteiro.telas.find((x) => x.id === entrada.tela_id);
      if (!t) return { erro: `Tela ${entrada.tela_id} não existe.` };
      const [min, max] = limiteDuracao(t.tipo);
      if (entrada.segundos < min || entrada.segundos > max) return { erro: `Limite para essa tela: ${min}–${max} s.` };
      t.duracaoSegundos = entrada.segundos;
      gravarRoteiro(id, proj.roteiro, proj.manifest);
      return { ok: true, ...resumo(lerProjeto(id)) };
    }
    case "definir_logo_evento": {
      if (proj.meta.versao !== "V3") return { erro: "Este evento usa a V1 (exclusiva do MSJ): o logo é sempre o MSJ." };
      for (const c of [entrada.negativo, entrada.positivo].filter(Boolean)) if (!arquivoExiste(c)) return { erro: `Arquivo não encontrado: ${c}` };
      proj.manifest.geral = { ...proj.manifest.geral, logo_evento_negativo: entrada.negativo };
      if (entrada.positivo) proj.manifest.geral.logo_evento_positivo = entrada.positivo;
      gravarRoteiro(id, proj.roteiro, proj.manifest);
      return { ok: true, logoEvento: entrada };
    }
    case "gerar_mp4":
      if (proj.roteiro.telas.length < 2) return { erro: "O roteiro ainda não tem telas de conteúdo." };
      return iniciarRender(id) ?? statusRender(id);
    default:
      return { erro: `Ferramenta desconhecida: ${nome}` };
  }
};

/* ------------------------------------------------------------------ conversa */

/** Um turno do chat: roda o loop de ferramentas e devolve o texto para a tela. */
export const conversar = async (id, texto, anexos = []) => {
  const chat = lerChat(id);
  const aviso = anexos.length ? `\n\n[Arquivos enviados agora: ${anexos.join(", ")}]` : "";
  chat.mensagens.push({ role: "user", content: `${texto || "(enviei arquivos)"}${aviso}` });
  chat.conversa.push({ de: "voce", texto: texto || "", anexos });
  const respostas = [];
  const usadas = [];
  let tentativasJson = 0;
  for (let volta = 0; volta < 16; volta++) {
    let msg;
    try {
      const stream = api().beta.messages.stream({
        model: MODELO,
        max_tokens: 64000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: "high" },
        system: [{ type: "text", text: SISTEMA, cache_control: { type: "ephemeral" } }],
        tools: ferramentasApi,
        messages: chat.mensagens,
      });
      msg = await stream.finalMessage();
      tentativasJson = 0;
    } catch (err) {
      if (err instanceof Anthropic.APIError || tentativasJson++ >= 2) throw err;
      continue; // entrada de ferramenta ilegível ou conexão caiu: refaz o turno
    }
    chat.mensagens.push({ role: "assistant", content: msg.content });
    for (const b of msg.content) if (b.type === "text" && b.text.trim()) respostas.push(b.text.trim());
    if (msg.stop_reason === "refusal") {
      respostas.push("Não consegui continuar com esse pedido. Tente reformular.");
      break;
    }
    if (msg.stop_reason === "pause_turn") continue;
    const usos = msg.content.filter((b) => b.type === "tool_use");
    if (!usos.length) break;
    if (msg.stop_reason === "max_tokens") throw new Error("Resposta longa demais (limite de tokens).");
    const resultados = [];
    for (const u of usos) {
      usadas.push(u.name);
      const f = FERRAMENTAS[u.name];
      const ok = f?.schema.safeParse(u.input);
      if (!f || !ok.success) {
        resultados.push({ type: "tool_result", tool_use_id: u.id, is_error: true, content: JSON.stringify({ entradaInvalida: ok?.error?.issues ?? "ferramenta desconhecida" }) });
        continue;
      }
      try {
        const r = await executar(id, u.name, ok.data);
        resultados.push({ type: "tool_result", tool_use_id: u.id, content: typeof r === "string" ? r : JSON.stringify(r) });
      } catch (e) {
        resultados.push({ type: "tool_result", tool_use_id: u.id, is_error: true, content: String(e.message ?? e) });
      }
    }
    chat.mensagens.push({ role: "user", content: resultados });
  }
  const resposta = respostas.join("\n\n") || "Pronto.";
  chat.conversa.push({ de: "estudio", texto: resposta, ferramentas: [...new Set(usadas)] });
  gravarChat(id, chat);
  return { resposta, ferramentas: [...new Set(usadas)] };
};
