import shapesData from "../shapesData.json";
import type { ShapeName } from "./BrandShape";
import { tela, zonaContador } from "./theme";

export type GrafismoSpec = {
  id: string;
  nome: ShapeName;
  x: number;
  y: number;
  largura: number;
  cor: string;
  modo?: "preenchida" | "outline";
  rotacao?: number;
  espelhar?: boolean;
  delayFrames?: number;
  fase?: number;
  wiggle?: boolean;
  /** Outline que se desenha e se apaga (trim path, referência Outubro). */
  desenhar?: boolean;
  /** Outline que emoldura um texto curto (Brandbook p.48): dispensa a checagem de zona, não a de forma. */
  moldura?: boolean;
  /** Forma grande de canto que sai pelo quadro (aprovado no Figma, 2026-11-14). Pequenas ficam inteiras. */
  sangra?: boolean;
};

/** Retângulo livre: texto, logo, foto, módulo... onde nenhuma forma pode entrar. */
export type ZonaLivre = {
  id: string;
  x: number;
  y: number;
  largura: number;
  altura: number;
};

type P = [number, number];

/** Folga mínima entre formas (cobre o wiggle de ±3° / ±4px do tokens). */
const FOLGA = 18;
/** "Máscara" ao redor de texto/logo: respiro mínimo entre forma e conteúdo. */
export const RESPIRO_CONTEUDO = 40;
/** Formas pequenas ficam inteiras e afastadas da borda; só as marcadas com `sangra` saem do quadro. */
export const MARGEM_QUADRO = 32;

const alturaDe = (g: GrafismoSpec) => {
  const f = shapesData[g.nome];
  return (g.largura * f.h) / f.w;
};

/** Pontos do contorno do path (vértices + curvas amostradas). */
export const pontosDoPath = (d: string): P[] => {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const pts: P[] = [];
  let cmd = "";
  let x = 0;
  let y = 0;
  let i = 0;
  const n = () => parseFloat(tokens[i++]);
  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) cmd = tokens[i++];
    const rel = cmd === cmd.toLowerCase();
    switch (cmd.toUpperCase()) {
      case "M":
      case "L": {
        const nx = n() + (rel ? x : 0);
        const ny = n() + (rel ? y : 0);
        x = nx;
        y = ny;
        pts.push([x, y]);
        if (cmd === "M") cmd = "L";
        if (cmd === "m") cmd = "l";
        break;
      }
      case "H":
        x = n() + (rel ? x : 0);
        pts.push([x, y]);
        break;
      case "V":
        y = n() + (rel ? y : 0);
        pts.push([x, y]);
        break;
      case "C": {
        const c = [n(), n(), n(), n(), n(), n()];
        const ox = rel ? x : 0;
        const oy = rel ? y : 0;
        const p0: P = [x, y];
        const p1: P = [c[0] + ox, c[1] + oy];
        const p2: P = [c[2] + ox, c[3] + oy];
        const p3: P = [c[4] + ox, c[5] + oy];
        // amostra a curva real (não os pontos de controle) para o contorno ficar justo
        for (let t = 0.125; t <= 1.0001; t += 0.125) {
          const u = 1 - t;
          const b = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
          pts.push([
            b[0] * p0[0] + b[1] * p1[0] + b[2] * p2[0] + b[3] * p3[0],
            b[0] * p0[1] + b[1] * p1[1] + b[2] * p2[1] + b[3] * p3[1],
          ]);
        }
        x = p3[0];
        y = p3[1];
        break;
      }
      case "Z":
        break;
      default:
        i++;
    }
  }
  return pts;
};

const fecho = (pts: P[]): P[] => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cruz = (o: P, a: P, b: P) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const inf: P[] = [];
  for (const q of p) {
    while (inf.length >= 2 && cruz(inf[inf.length - 2], inf[inf.length - 1], q) <= 0) inf.pop();
    inf.push(q);
  }
  const sup: P[] = [];
  for (const q of [...p].reverse()) {
    while (sup.length >= 2 && cruz(sup[sup.length - 2], sup[sup.length - 1], q) <= 0) sup.pop();
    sup.push(q);
  }
  return [...inf.slice(0, -1), ...sup.slice(0, -1)];
};

const FECHOS = Object.fromEntries(
  Object.entries(shapesData).map(([k, v]) => [k, fecho(pontosDoPath(v.d))]),
) as Record<ShapeName, P[]>;

/** Contorno (fecho convexo) da forma já posicionada, girada e espelhada como no CSS. */
export const contorno = (g: GrafismoSpec): P[] => {
  const f = shapesData[g.nome];
  const k = g.largura / f.w;
  const h = alturaDe(g);
  const cx = g.x + g.largura / 2;
  const cy = g.y + h / 2;
  const a = ((g.rotacao ?? 0) * Math.PI) / 180;
  return FECHOS[g.nome].map(([px, py]) => {
    let lx = px * k - g.largura / 2;
    const ly = py * k - h / 2;
    if (g.espelhar) lx = -lx;
    return [
      cx + lx * Math.cos(a) - ly * Math.sin(a),
      cy + lx * Math.sin(a) + ly * Math.cos(a),
    ];
  });
};

const retangulo = (z: ZonaLivre, r = 0): P[] => [
  [z.x - r, z.y - r],
  [z.x + z.largura + r, z.y - r],
  [z.x + z.largura + r, z.y + z.altura + r],
  [z.x - r, z.y + z.altura + r],
];

/** Teste de eixo separador (SAT): true se os polígonos convexos ficam a menos de `folga`. */
const intersecta = (a: P[], b: P[], folga = 0) => {
  for (const poly of [a, b]) {
    for (let i = 0; i < poly.length; i++) {
      const [x1, y1] = poly[i];
      const [x2, y2] = poly[(i + 1) % poly.length];
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const nx = (y2 - y1) / len;
      const ny = (x1 - x2) / len;
      const proj = (p: P[]) => p.map(([x, y]) => x * nx + y * ny);
      const pa = proj(a);
      const pb = proj(b);
      if (
        Math.max(...pa) + folga <= Math.min(...pb) ||
        Math.max(...pb) + folga <= Math.min(...pa)
      )
        return false;
    }
  }
  return true;
};

/** Parte visível de um polígono convexo (recorte pelo quadro, Sutherland–Hodgman). */
const noQuadro = (poly: P[]): P[] => {
  const bordas: [(p: P) => number][] = [
    [(p) => p[0]],
    [(p) => tela.largura - p[0]],
    [(p) => p[1]],
    [(p) => tela.altura - p[1]],
  ];
  let out = poly;
  for (const [dist] of bordas) {
    const ent = out;
    out = [];
    for (let i = 0; i < ent.length; i++) {
      const a = ent[i];
      const b = ent[(i + 1) % ent.length];
      const da = dist(a);
      const db = dist(b);
      if (da >= 0) out.push(a);
      if (da >= 0 !== db >= 0) {
        const t = da / (da - db);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    if (!out.length) return out;
  }
  return out;
};

/** Gira o layout 180° (rotação permitida) mantendo as coordenadas reais na tela. */
export const girar180 = (g: GrafismoSpec): GrafismoSpec => ({
  ...g,
  x: tela.largura - g.x - g.largura,
  y: tela.altura - g.y - alturaDe(g),
  rotacao: (g.rotacao ?? 0) + 180,
});

/**
 * Regra do Brandbook (registrada em brand/boas-praticas-visuais.md):
 * formas nunca se sobrepõem entre si nem invadem texto, logo ou contador.
 * Retorna a lista de conflitos (vazia = ok).
 */
export const conflitos = (
  formas: GrafismoSpec[],
  zonas: ZonaLivre[],
  comContador = true,
) => {
  const todasZonas = comContador
    ? [{ id: "contador", ...zonaContador }, ...zonas]
    : zonas;
  const out: string[] = [];
  formas.forEach((a, i) => {
    const ca = contorno(a);
    const va = noQuadro(ca);
    const fora = ca.some(
      ([x, y]) =>
        x < MARGEM_QUADRO ||
        y < MARGEM_QUADRO ||
        x > tela.largura - MARGEM_QUADRO ||
        y > tela.altura - MARGEM_QUADRO,
    );
    if (fora && !a.sangra) out.push(`${a.id} cortada pela borda do quadro`);
    formas.slice(i + 1).forEach((b) => {
      // só conta o que aparece: formas que sangram podem se cruzar fora do quadro
      const vb = noQuadro(contorno(b));
      if (va.length > 2 && vb.length > 2 && intersecta(va, vb, FOLGA))
        out.push(`${a.id} × ${b.id}`);
    });
    if (a.moldura) return;
    todasZonas.forEach((z) => {
      if (
        va.length > 2 &&
        intersecta(
          va,
          retangulo(z),
          z.id === "contador" ? 0 : RESPIRO_CONTEUDO,
        )
      )
        out.push(`${a.id} × zona ${z.id}`);
    });
  });
  return out;
};

/** Formas oficiais de proporção parecida (candidatas a morph sem mudar o "tamanho"). */
export const parceiras = (nome: ShapeName, n = 3): ShapeName[] => {
  const r = shapesData[nome].w / shapesData[nome].h;
  return (Object.keys(shapesData) as ShapeName[])
    .filter((k) => k !== nome)
    .map((k) => ({ k, d: Math.abs(shapesData[k].w / shapesData[k].h - r) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((x) => x.k);
};

/** A mesma forma trocada por outra oficial, na mesma caixa (mesmo centro e lado maior). */
export const trocarForma = (g: GrafismoSpec, nome: ShapeName): GrafismoSpec => {
  const f0 = shapesData[g.nome];
  const alt = (g.largura * f0.h) / f0.w;
  const lado = Math.max(g.largura, alt);
  const f1 = shapesData[nome];
  const larg = (lado * f1.w) / Math.max(f1.w, f1.h);
  const h1 = (larg * f1.h) / f1.w;
  return { ...g, nome, largura: larg, x: g.x + g.largura / 2 - larg / 2, y: g.y + alt / 2 - h1 / 2 };
};

/**
 * Para o morph (Versão 3): de cada forma, só as parceiras que continuam
 * respeitando a regra contra TODAS as variantes das outras formas da tela
 * (original + parceiras), contra as zonas e contra a borda.
 */
export const parceirasSeguras = (
  formas: GrafismoSpec[],
  zonas: ZonaLivre[],
  comContador = true,
): Record<string, ShapeName[]> => {
  const variantes = (g: GrafismoSpec) => [g, ...parceiras(g.nome).map((p) => trocarForma(g, p))];
  return Object.fromEntries(
    formas.map((g) => {
      const outras = formas.filter((h) => h.id !== g.id);
      const ok = parceiras(g.nome).filter((p) => {
        const t = trocarForma(g, p);
        if (conflitos([t], zonas, comContador).length) return false;
        return outras.every((h) => variantes(h).every((v) => conflitos([t, v], [], false).length === 0));
      });
      return [g.id, ok];
    }),
  );
};
