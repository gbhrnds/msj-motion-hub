// Monta o PDF de KVs + storyboard da Retrospectiva 2026 a partir dos PNGs de
// projects/retrospectiva-2026/storyboard/quadros (gerados por storyboard-retrospectiva.mjs).
// Uso: node scripts/storyboard-retrospectiva-pdf.mjs
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// playwright vem do ambiente (global); no Mac: npm i -g playwright
const { chromium } = createRequire(import.meta.url)("playwright");
const RAIZ = path.resolve(".");
const PROJ = path.join(RAIZ, "projects/retrospectiva-2026");
const Q = path.join(PROJ, "storyboard/quadros");
const TMP = path.join(PROJ, "storyboard/.pdf-tmp");
fs.mkdirSync(TMP, { recursive: true });

// jpg leve só para o PDF (os PNGs ficam como entrega)
const jpg = (id) => {
  const out = path.join(TMP, `${id}.jpg`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", path.join(Q, `${id}.png`), "-q:v", "3", out]);
  return `file://${out}`;
};
const seq = (n) => `file://${path.join(PROJ, "referencia/sequencias", n)}`;
const fonte = (f) => `file://${path.join(RAIZ, "brand/fonts", f)}`;

const TECNICAS = [
  ["0:00–0:03", "Logo se monta, sobe e dá lugar a um card de vídeo que sobe de baixo e cresce até a tela cheia (~1s, saída rápida, pouso suave).", "🚫 logo em pedaços · ✅ card que cresce até tela cheia"],
  ["0:10 · 0:42 · 1:22 · 2:22 · 2:58", "Janela: a fala encolhe para um card arredondado (~45% da tela) no fundo cinza, segura ~1,5s e é empurrada para cima pelo bloco gráfico. É a costura principal entre fala e grafismo.", "✅ cinza claro (exceção aprovada) + card com canto de módulo"],
  ["o filme todo", "Direção única: tudo entra por baixo e sai por cima (push vertical). Sensação de linha do tempo/feed. Quase nenhum crossfade.", "✅ direto"],
  ["0:17", "Palavra branca grande sobre a fala desfocada.", "🚫 blur (regra da marca) · ✅ palavra sobre cor/forma sólida"],
  ["0:17.9 · 2:25 · 3:13", "Wipe de faixas: 2–3 faixas de cor sólida sobem em cascata (defasagem de ~4–6 frames); cada faixa traz a próxima palavra-cartão (~0,6–0,9s por palavra).", "✅ faixas com borda diagonal (módulos) ou forma oficial gigante"],
  ["1:57", "Palavra que se divide: “Customer · Centricity” se afastam, um ponto surge no meio, e o bloco rola para cima.", "⚠️ ponto não é forma oficial → forma oficial pequena ou faixa"],
  ["3:13", "Frase grande que encolhe e vira título: entra palavra a palavra, encolhe (~0,8s) até cabeçalho e o conteúdo entra embaixo.", "✅ direto"],
  ["0:43 · 3:15", "Lista de veículos em pílulas; um marcador desce e a pílula selecionada abre em acordeão com a manchete.", "✅ marcador = triângulo oficial"],
  ["0:53", "Pílulas que se acumulam uma por batida; a linha recentraliza a cada entrada.", "✅ direto (sem o mapa de linhas que vem depois)"],
  ["1:09–1:21", "Prêmio troca no lugar dentro de louros fixos.", "⚠️ louros não são da marca · ✅ troca no lugar"],
  ["1:27", "Mapa de pontos acendendo.", "🚫 ponto não é forma oficial"],
  ["0:26–0:39", "Colagem de imprensa: dezenas de cards flutuando com sombra; densidade = credibilidade.", "⚠️ sombra solta · ✅ capturas em módulos"],
  ["1:59", "Ano gigante que troca (2012 → 2013) por rolagem de número.", "✅ “2027!”"],
  ["2:03", "Retrato com rede de linhas e pontos.", "🚫 vocabulário fora das formas oficiais"],
  ["2:35–2:39", "Bolhas proporcionais (1M → 10M → 100M) que crescem e empurram a anterior.", "🚫 círculo · ✅ ideia de escala com módulos de altura proporcional"],
  ["3:00–3:07", "Barras-módulo: cards cinza crescem em altura com o número contando (20M → 35M); o destaque vem em cor cheia.", "✅ base dos dados da proposta A"],
  ["2:41–2:57", "Arquivo (NYSE) em cards empilhados que rolam sem parar.", "✅ Ato 5"],
  ["3:53–3:57", "Encerramento: logo no cinza, depois reduzido a um traço.", "🚫 desmontar logo · ✅ logo centralizado (exceção 2026-11-19)"],
];

const PROPOSTAS = [
  {
    id: "A",
    nome: "Janela",
    lema: "A fala vira janela; o dado cresce.",
    conceito:
      "Traduz a gramática central da Nu (fala ↔ card no cinza, tudo subindo) para a linguagem de módulos do Brandbook. Fundo cinza claro e azul Agibank; cor cheia só no dado em destaque. É a mais próxima da referência e a mais sóbria.",
    base: "Técnicas 1, 2, 3, 7, 8 e 16 · Brandbook: módulos (p.49–54), pesos misturados, verde só como sinal de positivo.",
    quadros: [
      ["A1", "Cena 01 · abertura", "O off entra palavra a palavra; “vistas, respeitadas ou valorizadas” em Bold. Um card de b-roll sobe de baixo e cresce até a tela cheia (~1s)."],
      ["A2", "Cena 05 · refrão", "Fala em tela cheia, limpa; só o nome (Medium, sem placa). No fim do refrão o vídeo encolhe para card e é empurrado para cima pela rajada."],
      ["A3", "Cena 06 · Reclame Aqui", "Módulo grande sobe; “90,1%” conta de 0 até o valor (~18 frames); a faixa azul diagonal entra pela direita."],
      ["A4", "Cena 06 · Ranking BCB", "Dois módulos lado a lado contando 4ª → 27ª; pílula verde com seta para baixo: o verde diz “positivo”, a seta só a direção."],
      ["A5", "Cena 29 · mídia", "Frase do off à esquerda; o triângulo verde desce pela lista e abre cada veículo em acordeão com a captura (~0,5s cada, em rajada)."],
      ["A6", "Cena 34 · encerramento", "O card da dupla encolhe até sumir no centro; “Nos vemos em 2027!” entra e o logo Agibank pousa centralizado."],
    ],
  },
  {
    id: "B",
    nome: "Forma-palco",
    lema: "A forma oficial é o corte.",
    conceito:
      "O equivalente Agibank ao wipe de cor da Nu: uma forma irregular oficial cresce até cobrir a tela e vira o fundo da cena seguinte; a fala aparece dentro da forma. Fundos sólidos azuis, palavra-chave ExtraBold gigante, verde e amarelo só em acento. A de maior impacto, e usa o mesmo motor já aprovado no Minuto Jeito Agi.",
    base: "Técnicas 4 (sem blur), 5, 13 e rajada de corte · Brandbook: forma gigante como palco (§1), palavra-chave em ExtraBold (§3), foto em forma oficial (exceção 2026-11-14).",
    quadros: [
      ["B1", "Cena 01 · abertura", "Azul escuro. “vistas,” chega grande e um traço verde risca a palavra no “não se sentem” (a palavra atua o sentido); as outras entram no ritmo do off."],
      ["B2", "Cena 05 · refrão", "Fala em tela cheia; a forma azul entra do canto girando até o lugar e traz “enxerga”. Na saída a forma cresce até cobrir a tela: esse é o corte para o dado."],
      ["B3", "Cena 06 · NPS", "“77” pousa gigante com um assentamento curto; “2025: 72” menor ao lado; pílula verde. Forma azul médio sangra pelo canto."],
      ["B4", "Cena 06 · Reclame Aqui", "Corte por buraco em forma oficial revela o azul médio; “90,1%” conta; outline verde emoldura à distância."],
      ["B5", "Cena 29 · mídia", "Rajada: o nome do veículo troca no lugar a cada ~0,4s (5 nomes em 2s) e a captura troca junto; régua de 5 traços marca a sequência."],
      ["B6", "Cena 34 · encerramento", "“Nos vemos em” + “2027!” gigante, com o ano entrando por rolagem de número; logo Agibank centralizado."],
    ],
  },
  {
    id: "C",
    nome: "Faixas",
    lema: "Faixas que empurram a história.",
    conceito:
      "O wipe de faixas da Nu com bordas diagonais não paralelas (regra dos módulos). Cada virada de assunto é uma cascata de faixas que sobe; os dados vivem dentro das faixas, as palavras se separam e as pílulas se acumulam. A mais editorial e rítmica, boa para cortar na batida da trilha.",
    base: "Técnicas 5, 6, 7 e 9 · Brandbook: divisões diagonais dos módulos (p.49–54), fundos sólidos, pesos misturados.",
    quadros: [
      ["C1", "Cena 01 · abertura", "“o físico” e “e o digital.” se afastam e a faixa diagonal azul abre entre elas (a palavra dividida, sem o ponto)."],
      ["C2", "Transição de ato", "Três faixas (azul, azul médio, branco) sobem em cascata com defasagem de 4–6 frames, cobrindo a fala; a cena seguinte já vem na última faixa."],
      ["C3", "Cena 06 · rajada", "As três métricas empilhadas: cada faixa entra empurrando a anterior; os números contam; o verde marca resultado positivo."],
      ["C4", "Cena 10 · lettering", "As pílulas entram uma por batida da fala e a linha recentraliza; “para todos os clientes.” fecha embaixo."],
      ["C5", "Cena 29 · mídia", "A frase do off entra grande e encolhe até virar título; as capturas entram em módulos diagonais e o destaque passa de um para o outro."],
      ["C6", "Cena 34 · encerramento", "As faixas azuis fecham de cima e de baixo; sobra a faixa branca com “Nos vemos em 2027!” e o logo centralizado."],
    ],
  },
];

const css = `
@font-face{font-family:A;src:url(${fonte("AgibankSans-Regular.woff2")});font-weight:400}
@font-face{font-family:A;src:url(${fonte("AgibankSans-Medium.woff2")});font-weight:500}
@font-face{font-family:A;src:url(${fonte("AgibankSans-Bold.woff2")});font-weight:700}
@font-face{font-family:A;src:url(${fonte("AgibankSans-ExtraBold.woff2")});font-weight:800}
@page{size:1920px 1080px;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:A,Arial,sans-serif;color:#000F44}
.p{width:1920px;height:1080px;padding:90px 120px;position:relative;overflow:hidden;page-break-after:always;background:#F3F3F3}
.az{background:#0064F5;color:#fff}
h1{font-size:120px;font-weight:800;margin:0;line-height:1}
h2{font-size:64px;font-weight:700;margin:0 0 24px;color:#0064F5}
.az h2{color:#fff}
.k{font-size:26px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:#0064F5;margin-bottom:18px}
.az .k{color:#C9FF90}
p{font-size:30px;line-height:1.4;margin:0 0 18px;max-width:1500px}
table{border-collapse:collapse;width:100%;font-size:21px}
td{padding:9px 12px;border-bottom:1px solid #DCE1EC;vertical-align:top;line-height:1.3}
td:first-child{white-space:nowrap;color:#0064F5;font-weight:700;width:230px}
td:last-child{width:470px}
.g{display:grid;grid-template-columns:repeat(3,1fr);gap:28px 32px}
.g img{width:100%;border-radius:14px;display:block}
.g b{display:block;font-size:22px;margin:12px 0 4px;color:#0064F5}
.g span{display:block;font-size:19px;line-height:1.3}
.kv{position:absolute;inset:0}
.kv img{width:100%;height:100%;display:block}
.tag{position:absolute;left:40px;bottom:40px;background:#000F44;color:#fff;border-radius:14px;padding:16px 26px;font-size:26px;font-weight:700}
.seq{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.seq img{width:100%;border-radius:12px;display:block}
.seq b{font-size:20px;color:#0064F5;display:block;margin-top:6px}
`;

const pag = (cls, html) => `<section class="p ${cls}">${html}</section>`;
let h = "";

h += pag("az", `
<div class="k">Retrospectiva 2026 · Agibank</div>
<h1>KVs e storyboard<br>3 propostas de motion</h1>
<p style="margin-top:60px;font-size:34px">A · Janela &nbsp;·&nbsp; B · Forma-palco &nbsp;·&nbsp; C · Faixas</p>
<p style="position:absolute;bottom:90px;font-size:22px;max-width:1600px">Storyboard estático (sem animação). Texto: só o copy do roteiro.md. Pessoas: frames provisórios do Minuto Jeito Agi até chegar o vídeo editado. Capturas de matéria e ilustrações das cenas 04, 12, 17 e 22 ainda a receber.</p>`);

h += pag("", `
<div class="k">Referência · Welcome to Nu (3min58s)</div>
<h2>Como o filme funciona</h2>
<p>O filme tem uma gramática só: <b>a fala vira um card no fundo cinza, tudo sobe, e a cor cheia aparece só em palavra-cartão e transição</b>. Alterna planos longos de fala (5–20s) com blocos gráficos curtos (2–8s); cada palavra-cartão dura ~0,6–0,9s. Toda a personalidade vem da camada gráfica: a imagem tem cor natural, sem grading forte.</p>
<p>48 cortes detectados (limiar 0,25). Zero fade para preto. Transições: push vertical, wipe de faixas, card que cresce/encolhe. Crossfade é raro.</p>
<p style="font-size:24px;color:#4A5578">Revisão da análise anterior: a transição de assinatura não é um wipe isolado, é o par <b>fala ↔ janela</b>, que aparece em todos os atos. As palavras-cartão não ficam paradas: elas sobem junto com a faixa que as traz.</p>`);

h += pag("", `
<div class="k">Referência · catálogo de técnicas</div>
<table>${TECNICAS.map(([t, d, a]) => `<tr><td>${t}</td><td>${d}</td><td>${a}</td></tr>`).join("")}</table>`);

const SEQS = [
  ["01-abertura-logo-card.jpg", "0:00 · logo → card que cresce até tela cheia"],
  ["07-janela-e-barras-numero.jpg", "2:57 · janela sobe e dá lugar às barras com número"],
  ["02-palavra-e-wipe-faixas.jpg", "0:16 · palavra sobre a fala → wipe de faixas"],
  ["03-wipe-faixas-palavras.jpg", "2:25 · faixas em cascata trazendo palavras"],
];
const SEQS2 = [
  ["04-palavra-dividida.jpg", "1:56 · palavra que se divide"],
  ["05-frase-encolhe-titulo.jpg", "3:12 · frase grande que encolhe e vira título"],
  ["06-lista-pilulas-seletor.jpg", "0:42 · janela sai, lista de veículos com seletor"],
  ["08-pilulas-acumulam.jpg", "0:52 · pílulas que se acumulam"],
];
for (const [i, lista] of [SEQS, SEQS2].entries())
  h += pag("", `<div class="k">Referência · sequências quadro a quadro (${i + 1}/2)</div>
<div class="seq">${lista.map(([f, l]) => `<div><img src="${seq(f)}"><b>${l}</b></div>`).join("")}</div>`);

for (const pr of PROPOSTAS) {
  h += pag("az", `
<div class="k">Proposta ${pr.id}</div>
<h1>${pr.nome}</h1>
<p style="font-size:44px;font-weight:700;margin:28px 0 50px">${pr.lema}</p>
<p>${pr.conceito}</p>
<p style="font-size:24px">${pr.base}</p>`);
  h += `<section class="p"><div class="kv"><img src="${jpg(pr.id + "0")}"></div><div class="tag">KV · Proposta ${pr.id} · ${pr.nome}</div></section>`;
  h += pag("", `
<div class="k">Proposta ${pr.id} · ${pr.nome} · storyboard</div>
<div class="g">${pr.quadros.map(([id, c, n]) => `<div><img src="${jpg(id)}"><b>${id} · ${c}</b><span>${n}</span></div>`).join("")}</div>`);
}

h += pag("", `
<div class="k">Comparativo</div>
<h2>Qual caminho escolher</h2>
<table style="font-size:26px">
<tr><td>A · Janela</td><td>Mais próxima da referência e mais institucional. Menor risco de marca. O impacto vem do ritmo, não da cor.</td><td>Risco: ficar parecida demais com a Nu.</td></tr>
<tr><td>B · Forma-palco</td><td>Maior impacto e identidade Agibank mais forte (forma oficial como corte). Reaproveita o motor do Minuto Jeito Agi.</td><td>Risco: muito azul cheio cansa em ~4 min. Precisa alternar com fala limpa.</td></tr>
<tr><td>C · Faixas</td><td>A mais rítmica e editorial. As rajadas de dados (C3) são as mais legíveis das três.</td><td>Risco: faixa diagonal é linguagem derivada dos módulos e precisa de aprovação.</td></tr>
</table>
<p style="margin-top:50px"><b>Recomendação:</b> B como linguagem do filme (refrões, aberturas de ato, encerramento) com as rajadas de dados em faixas da C (C3) nos Atos 1, 2 e 3.</p>
<p style="font-size:24px">Depois da escolha: refinar os quadros da proposta, aplicar ao roteiro inteiro e só então animar (agentes 04 e 05).</p>`);

const htmlPath = path.join(PROJ, "storyboard/storyboard.html");
fs.writeFileSync(htmlPath, `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><style>${css}</style><body>${h}</body></html>`);
const b = await chromium.launch();
const pg = await b.newPage();
await pg.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
await pg.evaluate(() => document.fonts.ready);
await pg.pdf({ path: path.join(PROJ, "storyboard.pdf"), width: "1920px", height: "1080px", printBackground: true });
await b.close();
fs.rmSync(TMP, { recursive: true, force: true });
fs.rmSync(htmlPath);
console.log("ok", path.join(PROJ, "storyboard.pdf"));
