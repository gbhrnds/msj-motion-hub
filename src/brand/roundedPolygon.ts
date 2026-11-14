/**
 * Gera o path SVG de um polígono com cantos arredondados (raio fixo),
 * para módulos de composição (Brandbook p.49-54: cantos 12-17px).
 */
export const roundedPolygon = (pontos: [number, number][], raio: number): string => {
  const n = pontos.length;
  const partes: string[] = [];
  for (let i = 0; i < n; i++) {
    const [px, py] = pontos[(i - 1 + n) % n];
    const [cx, cy] = pontos[i];
    const [nx, ny] = pontos[(i + 1) % n];
    const d1 = Math.hypot(px - cx, py - cy);
    const d2 = Math.hypot(nx - cx, ny - cy);
    const r1 = Math.min(raio, d1 / 2);
    const r2 = Math.min(raio, d2 / 2);
    const ax = cx + ((px - cx) / d1) * r1;
    const ay = cy + ((py - cy) / d1) * r1;
    const bx = cx + ((nx - cx) / d2) * r2;
    const by = cy + ((ny - cy) / d2) * r2;
    partes.push(`${i === 0 ? "M" : "L"} ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`);
  }
  return `${partes.join(" ")} Z`;
};
