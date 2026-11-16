// Gera a página de prévia (Remotion Player) em out/preview/.
// Uso: node scripts/preview/build.mjs
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";

const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const saida = path.join(raiz, "out/preview");
fs.rmSync(saida, { recursive: true, force: true });
fs.mkdirSync(saida, { recursive: true });

await build({
  entryPoints: [path.join(raiz, "src/preview/Preview.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  outfile: path.join(saida, "app.js"),
  define: { "process.env.NODE_ENV": '"production"' },
  // staticFile() passa a gerar caminhos relativos à página ("./brand/...")
  banner: { js: 'window.remotion_staticBase=".";' },
  loader: { ".json": "json" },
  logLevel: "warning",
});

// Arquivos que as composições carregam com staticFile()
const copiar = (rel) => {
  const de = path.join(raiz, rel);
  const para = path.join(saida, rel);
  fs.mkdirSync(path.dirname(para), { recursive: true });
  fs.copyFileSync(de, para);
};
// fontes usadas em src/fonts.ts (a página usa Regular/SemiBold/Bold)
for (const f of ["Light", "Regular", "Medium", "SemiBold", "Bold", "ExtraBold"]) copiar(`brand/fonts/AgibankSans-${f}.woff2`);
for (const f of fs.readdirSync(path.join(raiz, "brand/logos"))) {
  if (/\.svg$/i.test(f) && !/-rgb\.svg$/.test(f)) copiar(`brand/logos/${f}`);
}
// ícones citados no manifest
const manifest = fs.readFileSync(path.join(raiz, "projects/2025-11_abertura/manifest.json"), "utf8");
for (const m of manifest.matchAll(/"(brand\/icons\/[^"]+)"/g)) copiar(m[1]);
for (const f of fs.readdirSync(path.join(raiz, "projects/2025-11_abertura/fotos"))) {
  if (/\.(jpg|png)$/i.test(f)) copiar(`projects/2025-11_abertura/fotos/${f}`);
}
fs.copyFileSync(path.join(raiz, "src/preview/pagina.html"), path.join(saida, "index.html"));

const arquivos = [];
const listar = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) listar(p);
    else if (!["index.html", "teste.html", "arquivos.json"].includes(f.name)) arquivos.push(path.relative(saida, p));
  }
};
listar(saida);
fs.writeFileSync(path.join(saida, "arquivos.json"), JSON.stringify(arquivos, null, 1));
console.log(`ok: ${arquivos.length} arquivos em out/preview`);
