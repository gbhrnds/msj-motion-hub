// Estúdio de Motion · app local (npm run app → http://localhost:4300).
// Chat com o Claude + upload de redação, logos e fotos + prévia da vinheta + render.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";
import { RAIZ, criarProjeto, idValido, lerChat, lerProjeto, listarProjetos, salvarArquivo } from "./projetos.mjs";
import { conversar } from "./agente.mjs";
import { iniciarRender, statusRender } from "./render.mjs";

try {
  process.loadEnvFile(path.join(RAIZ, ".env")); // ANTHROPIC_API_KEY fica só no .env local (fora do git)
} catch {
  /* sem .env: vale o ambiente */
}

const PORTA = Number(process.env.PORTA_ESTUDIO ?? 4300);
const WEB = path.join(RAIZ, "app/web");
const SAIDA = path.join(RAIZ, "app/.build");

await build({
  entryPoints: [path.join(WEB, "App.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  outfile: path.join(SAIDA, "app.js"),
  define: { "process.env.NODE_ENV": '"production"' },
  loader: { ".json": "json" },
  logLevel: "warning",
});

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".mp4": "video/mp4",
};

const enviar = (res, status, corpo, tipo = "application/json; charset=utf-8") => {
  res.writeHead(status, { "Content-Type": tipo, "Cache-Control": "no-store" });
  res.end(typeof corpo === "string" || Buffer.isBuffer(corpo) ? corpo : JSON.stringify(corpo));
};
const arquivo = (res, abs) => {
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) return enviar(res, 404, { erro: "Não encontrado" });
  res.writeHead(200, { "Content-Type": TIPOS[path.extname(abs).toLowerCase()] ?? "application/octet-stream" });
  fs.createReadStream(abs).pipe(res);
};
const corpo = (req, limite = 60 * 1024 * 1024) =>
  new Promise((ok, falha) => {
    const partes = [];
    let tam = 0;
    req.on("data", (c) => {
      tam += c.length;
      if (tam > limite) {
        falha(new Error("Arquivo grande demais (máx. 60 MB)."));
        req.destroy();
      } else partes.push(c);
    });
    req.on("end", () => ok(Buffer.concat(partes)));
    req.on("error", falha);
  });
const json = async (req) => JSON.parse((await corpo(req, 1024 * 1024)).toString() || "{}");

const estadoProjeto = (id) => ({ ...lerProjeto(id), conversa: lerChat(id).conversa, render: statusRender(id) });

const servidor = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const p = decodeURIComponent(url.pathname);
    if (p === "/") return arquivo(res, path.join(WEB, "index.html"));
    if (p === "/app.js") return arquivo(res, path.join(SAIDA, "app.js"));
    // arquivos usados pela vinheta (staticFile): só brand/ e projects/
    if (/^\/(brand|projects)\//.test(p)) {
      const abs = path.resolve(RAIZ, "." + path.posix.normalize(p));
      const rel = path.relative(RAIZ, abs).split(path.sep).join("/");
      if (!/^(brand|projects)\//.test(rel) || /chat\.json$|props\.json$/.test(rel)) return enviar(res, 403, { erro: "Proibido" });
      return arquivo(res, abs);
    }
    if (p === "/api/status") return enviar(res, 200, { chaveApi: Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) });
    if (p === "/api/projetos" && req.method === "GET") return enviar(res, 200, listarProjetos());
    if (p === "/api/projetos" && req.method === "POST") {
      const meta = criarProjeto(await json(req));
      return enviar(res, 201, meta);
    }
    const m = p.match(/^\/api\/projetos\/([^/]+)(\/[a-z]+)?$/);
    if (m && idValido(m[1])) {
      const [, id, acao = ""] = m;
      if (acao === "" && req.method === "GET") return enviar(res, 200, estadoProjeto(id));
      if (acao === "/arquivos" && req.method === "POST") {
        const r = await salvarArquivo(id, url.searchParams.get("nome") ?? "arquivo", await corpo(req));
        return enviar(res, 201, r);
      }
      if (acao === "/chat" && req.method === "POST") {
        const { texto, anexos } = await json(req);
        const r = await conversar(id, String(texto ?? ""), Array.isArray(anexos) ? anexos : []);
        return enviar(res, 200, { ...r, projeto: estadoProjeto(id) });
      }
      if (acao === "/render" && req.method === "POST") {
        iniciarRender(id);
        return enviar(res, 202, statusRender(id));
      }
      if (acao === "/render" && req.method === "GET") return enviar(res, 200, statusRender(id));
    }
    return enviar(res, 404, { erro: "Rota não encontrada" });
  } catch (e) {
    console.error(e);
    return enviar(res, 500, { erro: String(e?.message ?? e) });
  }
});

servidor.listen(PORTA, "127.0.0.1", () => {
  console.log(`\nEstúdio de Motion aberto em http://localhost:${PORTA}\n`);
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN)
    console.log("Atenção: sem ANTHROPIC_API_KEY no .env — o chat não vai responder até a chave ser configurada.\n");
});
