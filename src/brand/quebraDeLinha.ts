/**
 * Regra de quebra de linha (decisão do usuário, 2026-11-14):
 * - artigo, preposição, conjunção ou número curto nunca fica sozinho no fim da
 *   linha: ele "gruda" na palavra seguinte;
 * - sem viúva: a última linha nunca tem uma palavra só (as duas últimas andam juntas).
 * O texto não muda: só alguns espaços viram espaço não separável (U+00A0).
 */
const NBSP = " ";

const CURTAS = new Set(
  (
    "o a os as um uma uns umas de do da dos das no na nos nas em ao aos à às " +
    "e ou com sem para pra por pelo pela pelos pelas que se nem mas é"
  ).split(" "),
);

const grudaNaProxima = (palavra: string) => {
  const p = palavra.toLowerCase().replace(/[.,;:!?…"“”()]/g, "");
  return CURTAS.has(p) || /^\d+[ºª°]?$/.test(p);
};

export const quebraBoa = (texto: string): string =>
  texto
    .split("\n")
    .map((linha) => {
      const palavras = linha.split(" ");
      if (palavras.length < 2) return linha;
      let out = "";
      palavras.forEach((p, i) => {
        if (i === 0) {
          out = p;
          return;
        }
        const anterior = palavras[i - 1];
        // anti-viúva só faz sentido com 3+ palavras (2 palavras precisam poder quebrar)
        const ultima = i === palavras.length - 1 && palavras.length >= 3;
        out += (grudaNaProxima(anterior) || ultima ? NBSP : " ") + p;
      });
      return out;
    })
    .join("\n");
