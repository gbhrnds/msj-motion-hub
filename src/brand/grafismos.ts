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
/** Formas ficam inteiras dentro do quadro (decisão do usuário: sem corte na borda). */
export const MARGEM_QUADRO = 48;

const alturaDe = (g: GrafismoSpec) => {
  const f = shapesData[g.nome];
  return (g.largura * f.h) / f.w;
};

/** Quatro cantos da caixa da forma, rotacionada em torno do centro (como o CSS faz). */
const cantos = (g: GrafismoSpec, folga: number): P[] => {
  const h = alturaDe(g);
  const cx = g.x + g.largura / 2;
  const cy = g.y + h / 2;
  const a = ((g.rotacao ?? 0) * Math.PI) / 180;
  const hw = g.largura / 2 + folga / 2;
  const hh = h / 2 + folga / 2;
  return (
    [
      [-hw, -hh],
      [hw, -hh],
      [hw, hh],
      [-hw, hh],
    ] as P[]
  ).map(([px, py]) => [
    cx + px * Math.cos(a) - py * Math.sin(a),
    cy + px * Math.sin(a) + py * Math.cos(a),
  ]);
};

const retangulo = (z: ZonaLivre, r = 0): P[] => [
  [z.x - r, z.y - r],
  [z.x + z.largura + r, z.y - r],
  [z.x + z.largura + r, z.y + z.altura + r],
  [z.x - r, z.y + z.altura + r],
];

/** Teste de eixo separador (SAT) entre dois polígonos convexos. */
const intersecta = (a: P[], b: P[]) => {
  for (const poly of [a, b]) {
    for (let i = 0; i < poly.length; i++) {
      const [x1, y1] = poly[i];
      const [x2, y2] = poly[(i + 1) % poly.length];
      const nx = y2 - y1;
      const ny = x1 - x2;
      const proj = (p: P[]) => p.map(([x, y]) => x * nx + y * ny);
      const pa = proj(a);
      const pb = proj(b);
      if (
        Math.max(...pa) <= Math.min(...pb) ||
        Math.max(...pb) <= Math.min(...pa)
      )
        return false;
    }
  }
  return true;
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
    const ca = cantos(a, FOLGA);
    const fora = cantos(a, 0).some(
      ([x, y]) =>
        x < MARGEM_QUADRO ||
        y < MARGEM_QUADRO ||
        x > tela.largura - MARGEM_QUADRO ||
        y > tela.altura - MARGEM_QUADRO,
    );
    if (fora) out.push(`${a.id} cortada pela borda do quadro`);
    formas.slice(i + 1).forEach((b) => {
      if (intersecta(ca, cantos(b, 0))) out.push(`${a.id} × ${b.id}`);
    });
    if (a.moldura) return;
    todasZonas.forEach((z) => {
      if (
        intersecta(
          cantos(a, FOLGA),
          retangulo(z, z.id === "contador" ? 0 : RESPIRO_CONTEUDO),
        )
      )
        out.push(`${a.id} × zona ${z.id}`);
    });
  });
  return out;
};
