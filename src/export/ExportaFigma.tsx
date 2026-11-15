import React, { useEffect, useRef } from "react";
import { AbsoluteFill, continueRender, delayRender, Freeze } from "remotion";
import { MSJComposition } from "../Composition";
import { V1NuDay } from "../versoes/v1/V1NuDay";

/**
 * Exportação para Figma (ajuste fino de layout).
 * Congela a vinheta num frame, percorre o DOM renderizado e envia a geometria
 * (formas, módulos, logos, textos) para o coletor local (scripts/figma/coletor.mjs),
 * que monta um SVG editável por tela. Não entra no render do vídeo.
 */
type Props = { frame: number; tela: string; coletor: string; /** "v1" exporta a Versão 1 (NuDay); padrão = vinheta clássica. */ versao?: string };

type No = Record<string, unknown>;

const ROTULO = "data-camada";

const nomeDe = (el: Element, padrao: string) =>
  el.closest(`[${ROTULO}]`)?.getAttribute(ROTULO) ?? padrao;

const opacidade = (el: Element, raiz: Element) => {
  let o = 1;
  for (let e: Element | null = el; e && e !== raiz; e = e.parentElement) {
    o *= parseFloat(getComputedStyle(e).opacity || "1");
  }
  return o;
};

const caminhoArquivo = (src: string) => {
  const m = src.match(/(brand\/.*|projects\/.*)$/);
  return m ? decodeURIComponent(m[1]) : src;
};

const INLINE = new Set(["SPAN", "B", "STRONG", "EM", "I", "BR"]);

const extrair = (raiz: HTMLElement): No[] => {
  const rr = raiz.getBoundingClientRect();
  const nos: No[] = [];
  const px = (v: string) => parseFloat(v) || 0;

  const texto = (el: HTMLElement, o: number) => {
    const cs = getComputedStyle(el);
    const runs: No[] = [];
    // percorre os nós de texto, quebrando linha onde o navegador quebrou
    let ultimoTopo: number | null = null;
    const visitar = (n: Node) => {
      if (n.nodeType === Node.TEXT_NODE) {
        const pai = n.parentElement as HTMLElement;
        const ps = getComputedStyle(pai);
        const bruto = (n.textContent ?? "").replace(/\s+/g, " ");
        let atual = "";
        const range = document.createRange();
        for (let i = 0; i < bruto.length; i++) {
          range.setStart(n, i);
          range.setEnd(n, i + 1);
          const r = range.getBoundingClientRect();
          if (bruto[i] !== " " && r.height > 0) {
            if (
              ultimoTopo !== null &&
              r.top - ultimoTopo > parseFloat(ps.fontSize) * 0.5
            ) {
              atual = atual.replace(/ $/, "");
              if (!atual && runs.length) {
                const ant = runs[runs.length - 1];
                ant.t = String(ant.t).replace(/ $/, "");
              }
              atual += "\n";
            }
            ultimoTopo = r.top;
          }
          atual += bruto[i];
        }
        runs.push({
          t: atual,
          peso: parseInt(ps.fontWeight, 10),
          cor: ps.color,
          tam: px(ps.fontSize),
        });
      } else if ((n as Element).tagName === "BR") {
        runs.push({ t: "\n" });
      } else {
        n.childNodes.forEach(visitar);
      }
    };
    el.childNodes.forEach(visitar);
    if (runs.length) {
      runs[0].t = String(runs[0].t).replace(/^ /, "");
      const u = runs[runs.length - 1];
      u.t = String(u.t).replace(/ $/, "");
    }
    const r = el.getBoundingClientRect();
    const escala = el.offsetWidth ? r.width / el.offsetWidth : 1;
    const conteudo = runs.map((x) => x.t).join("");
    const faixa = document.createRange();
    faixa.selectNodeContents(el);
    const rt = faixa.getBoundingClientRect();
    nos.push({
      tipo: "texto",
      nome: nomeDe(el, conteudo.slice(0, 40)),
      x: r.left - rr.left + px(cs.paddingLeft) * escala,
      y: r.top - rr.top + px(cs.paddingTop) * escala,
      w: r.width - (px(cs.paddingLeft) + px(cs.paddingRight)) * escala,
      h: r.height,
      escala,
      tx: rt.left - rr.left,
      tw: rt.width,
      alinhar: cs.textAlign,
      entrelinha:
        cs.lineHeight === "normal" ? null : px(cs.lineHeight) * escala,
      espacamento: cs.letterSpacing === "normal" ? 0 : px(cs.letterSpacing),
      opacidade: o,
      runs,
    });
  };

  const visitar = (el: Element) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;
    const o = opacidade(el, raiz);
    if (o < 0.03) return;

    if (el instanceof SVGSVGElement) {
      const ctm = el.getScreenCTM();
      if (!ctm) return;
      const vb = el.viewBox.baseVal;
      const w = el.width.baseVal.value;
      const h = el.height.baseVal.value;
      const vx = vb && vb.width ? vb.x : 0;
      const vy = vb && vb.width ? vb.y : 0;
      const vw = vb && vb.width ? vb.width : w;
      const vh = vb && vb.width ? vb.height : h;
      const p = (x: number, y: number) =>
        new DOMPoint(x, y).matrixTransform(ctm);
      const p0 = p(vx, vy);
      const p1 = p(vx + vw, vy);
      const p2 = p(vx, vy + vh);
      const escalaVb = Math.hypot(p1.x - p0.x, p1.y - p0.y) / vw;
      const formas: No[] = [];
      el.querySelectorAll("path, rect, circle, ellipse, polygon").forEach(
        (f) => {
          const fs = getComputedStyle(f);
          const naoEscala =
            f.getAttribute("vector-effect") === "non-scaling-stroke";
          const sw = px(fs.strokeWidth);
          formas.push({
            tag: f.tagName,
            d: f.getAttribute("d"),
            attrs: Object.fromEntries(
              ["x", "y", "width", "height", "rx", "cx", "cy", "r", "points"]
                .filter((a) => f.hasAttribute(a))
                .map((a) => [a, f.getAttribute(a)]),
            ),
            fill: fs.fill,
            stroke: fs.stroke,
            strokeWidth: naoEscala ? sw / escalaVb : sw,
            linejoin: fs.strokeLinejoin,
            linecap: fs.strokeLinecap,
          });
        },
      );
      nos.push({
        tipo: "svg",
        nome: nomeDe(el, "forma"),
        viewBox: [vx, vy, vw, vh],
        // matriz do sistema do viewBox para o quadro 1920x1080
        m: [
          (p1.x - p0.x) / vw,
          (p1.y - p0.y) / vw,
          (p2.x - p0.x) / vh,
          (p2.y - p0.y) / vh,
          p0.x - rr.left - (vx * (p1.x - p0.x)) / vw - (vy * (p2.x - p0.x)) / vh,
          p0.y - rr.top - (vx * (p1.y - p0.y)) / vw - (vy * (p2.y - p0.y)) / vh,
        ],
        opacidade: o,
        formas,
      });
      return;
    }

    if (el instanceof HTMLImageElement) {
      const r = el.getBoundingClientRect();
      const clip = el.parentElement
        ? getComputedStyle(el.parentElement)
        : null;
      nos.push({
        tipo: "imagem",
        nome: nomeDe(el, caminhoArquivo(el.src)),
        arquivo: caminhoArquivo(el.src),
        x: r.left - rr.left,
        y: r.top - rr.top,
        w: r.width,
        h: r.height,
        cobrir: cs.objectFit === "cover",
        raio:
          clip && clip.overflow === "hidden"
            ? px(clip.borderTopLeftRadius)
            : px(cs.borderTopLeftRadius),
        opacidade: o,
      });
      return;
    }

    const he = el as HTMLElement;
    const temFundo =
      cs.backgroundColor !== "rgba(0, 0, 0, 0)" &&
      cs.backgroundColor !== "transparent";
    const mascara = cs.maskImage || cs.webkitMaskImage;
    if (temFundo) {
      const r = he.getBoundingClientRect();
      if (mascara && mascara !== "none") {
        const url = mascara.match(/url\("?(.*?)"?\)/)?.[1] ?? "";
        nos.push({
          tipo: "icone",
          nome: nomeDe(el, caminhoArquivo(url)),
          arquivo: caminhoArquivo(url),
          x: r.left - rr.left,
          y: r.top - rr.top,
          w: r.width,
          h: r.height,
          cor: cs.backgroundColor,
          opacidade: o,
        });
        return;
      }
      const escala = he.offsetWidth ? r.width / he.offsetWidth : 1;
      nos.push({
        tipo: "retangulo",
        nome: nomeDe(el, el === raiz.firstElementChild ? "fundo" : "módulo"),
        x: r.left - rr.left,
        y: r.top - rr.top,
        w: r.width,
        h: r.height,
        raio: px(cs.borderTopLeftRadius) * escala,
        cor: cs.backgroundColor,
        opacidade: o,
      });
    }

    const filhos = Array.from(el.children);
    if (
      (he.textContent ?? "").trim() &&
      filhos.every((c) => INLINE.has(c.tagName)) &&
      filhos.length < el.childNodes.length + 1
    ) {
      texto(he, o);
      return;
    }
    filhos.forEach(visitar);
  };

  Array.from(raiz.children).forEach(visitar);
  return nos;
};

export const ExportaFigma: React.FC<Props> = ({ frame, tela, coletor, versao }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [handle] = React.useState(() => delayRender("exporta-figma"));

  useEffect(() => {
    const t = setTimeout(async () => {
      await document.fonts.ready;
      const imgs = Array.from(ref.current!.querySelectorAll("img"));
      await Promise.all(imgs.map((i) => (i.complete ? null : i.decode())));
      const nos = extrair(ref.current!);
      await fetch(coletor, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ tela, frame, nos }),
      });
      continueRender(handle);
    }, 300);
    return () => clearTimeout(t);
  }, [coletor, frame, handle, tela]);

  return (
    <AbsoluteFill ref={ref}>
      <Freeze frame={frame}>
        {versao === "v1" ? <V1NuDay /> : <MSJComposition />}
      </Freeze>
    </AbsoluteFill>
  );
};
