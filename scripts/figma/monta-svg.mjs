// Converte a geometria coletada (out/figma/*.json) em:
//  - um SVG por tela (fundo, módulos, formas, logos, foto, ícones) com camadas nomeadas;
//  - textos.json com os textos (montados como texto editável no Figma).
import fs from "node:fs";
import path from "node:path";
const pasta = process.argv[2] ?? "out/figma";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const r2 = (n) => Math.round(n * 1000) / 1000;

// Logo SVG -> conteúdo com estilos de classe aplicados como atributos (evita conflito entre logos)
const svgInline = (arquivo, cor) => {
  let s = fs.readFileSync(arquivo, "utf8");
  const vb = s.match(/viewBox="([^"]+)"/)[1];
  const estilos = {};
  for (const [, cls, corpo] of s.matchAll(/\.([\w-]+)\s*\{([^}]*)\}/g)) estilos[cls] = corpo;
  s = s.replace(/<\?xml[^>]*>|<!--[\s\S]*?-->|<defs>[\s\S]*?<\/defs>/g, "");
  s = s.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  s = s.replace(/class="([^"]+)"/g, (_, c) => {
    const decl = c.split(/\s+/).map((k) => estilos[k] ?? "").join(";");
    const attrs = [...decl.matchAll(/(fill|stroke|stroke-width|opacity)\s*:\s*([^;]+)/g)]
      .map(([, k, v]) => `${k}="${v.trim()}"`);
    return attrs.join(" ");
  });
  s = s.replace(/\sid="[^"]*"|\sdata-name="[^"]*"/g, "");
  if (cor) s = s.replace(/fill:\s*#[0-9a-fA-F]+;?/g, `fill:${cor};`).replace(/fill="#[0-9a-fA-F]+"/g, `fill="${cor}"`);
  return { vb, s };
};

for (const arq of fs.readdirSync(pasta).filter((f) => /^\d[^.]*\.json$/.test(f))) {
  const { tela, nos } = JSON.parse(fs.readFileSync(path.join(pasta, arq), "utf8"));
  const partes = [];
  let clip = 0;
  for (const n of nos) {
    const op = n.opacidade < 0.999 ? ` opacity="${r2(n.opacidade)}"` : "";
    if (n.tipo === "retangulo") {
      const nome = n.w >= 1919 && n.h >= 1079 ? "fundo" : n.nome;
      partes.push(`<rect id="${esc(nome)}" x="${r2(n.x)}" y="${r2(n.y)}" width="${r2(n.w)}" height="${r2(n.h)}" rx="${r2(n.raio)}" fill="${n.cor}"${op}/>`);
    } else if (n.tipo === "svg") {
      const filhos = n.formas.map((f) => {
        const geo = f.d ? `d="${f.d}"` : Object.entries(f.attrs).map(([k, v]) => `${k}="${v}"`).join(" ");
        const tag = f.tag.toLowerCase();
        const st = f.stroke !== "none" ? ` stroke="${f.stroke}" stroke-width="${r2(f.strokeWidth)}" stroke-linejoin="${f.linejoin}" stroke-linecap="${f.linecap}"` : "";
        return `<${tag} ${geo} fill="${f.fill}"${st}/>`;
      }).join("");
      partes.push(`<g id="${esc(n.nome)}" transform="matrix(${n.m.map(r2).join(" ")})"${op}>${filhos}</g>`);
    } else if (n.tipo === "imagem" && n.arquivo.endsWith(".svg")) {
      const { vb, s } = svgInline(n.arquivo);
      const nome = "logo " + path.basename(n.arquivo, ".svg");
      partes.push(`<svg id="${esc(nome)}" x="${r2(n.x)}" y="${r2(n.y)}" width="${r2(n.w)}" height="${r2(n.h)}" viewBox="${vb}"${op}>${s}</svg>`);
    } else if (n.tipo === "imagem") {
      const b64 = fs.readFileSync(n.arquivo).toString("base64");
      const id = `clip${clip++}`;
      partes.push(`<clipPath id="${id}"><rect x="${r2(n.x)}" y="${r2(n.y)}" width="${r2(n.w)}" height="${r2(n.h)}" rx="${r2(n.raio)}"/></clipPath>`);
      partes.push(`<g id="foto ${esc(path.basename(n.arquivo))}" clip-path="url(#${id})"${op}><image x="${r2(n.x)}" y="${r2(n.y)}" width="${r2(n.w)}" height="${r2(n.h)}" preserveAspectRatio="xMidYMid ${n.cobrir ? "slice" : "meet"}" href="data:image/jpeg;base64,${b64}"/></g>`);
    } else if (n.tipo === "icone") {
      const { vb, s } = svgInline(n.arquivo, n.cor);
      partes.push(`<svg id="ícone ${esc(path.basename(n.arquivo, ".svg"))}" x="${r2(n.x)}" y="${r2(n.y)}" width="${r2(n.w)}" height="${r2(n.h)}" viewBox="${vb}"${op}>${s}</svg>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">${partes.join("")}</svg>`;
  fs.writeFileSync(path.join(pasta, `${tela}.svg`), svg);
  const textos = nos.filter((n) => n.tipo === "texto").map((n) => ({
    n: n.nome, x: r2(n.x), y: r2(n.y), w: r2(n.w), a: n.alinhar, lh: n.entrelinha && r2(n.entrelinha),
    o: r2(n.opacidade), r: n.runs.map((u) => [u.t, u.peso, u.cor, u.tam * n.escala]),
  }));
  fs.writeFileSync(path.join(pasta, `${tela}.textos.json`), JSON.stringify(textos));
  console.log(tela, (svg.length / 1024).toFixed(0) + "KB", textos.length, "textos");
}
