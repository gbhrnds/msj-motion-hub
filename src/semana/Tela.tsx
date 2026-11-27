import React from "react";
import { Easing, Img, interpolate, spring } from "remotion";
import { fontFamily } from "../fonts";
import { COR, Elemento, TelaLayout, arquivo } from "./layout";

/**
 * Uma tela da Semana do Jeito Agi num instante `t` (frames desde o início da tela).
 *
 * Elenco (skill choreograph):
 * - static: fundo e módulos de cor (revelados pela transição de tela, sem animação própria);
 * - lead: logo do pilar / termos da equação / frases;
 * - support: bullets;
 * - a pessoa: o recorte entra primeiro (sobe com bounce) e a foto com fundo se abre a partir dela,
 *   para nunca aparecer a pessoa "cortada" pela borda do módulo antes do recorte;
 * - decoration: cacos (entram e depois só respiram).
 * Texto: palavra a palavra nas frases e letra a letra quando é uma palavra só; depois fica parado.
 * Motion blur: desfoque direcional proporcional à velocidade de cada frame (pedido do usuário, 2026-11-27).
 * Bounce: elementos que entram em escala usam spring com overshoot (pedido do usuário, 2026-11-27).
 */

const SAIDA = Easing.bezier(0.23, 1, 0.32, 1); // entrada: ease-out forte (tokens / agente 05)
const MEIO = Easing.bezier(0.65, 0, 0.35, 1); // movimento em tela: ease-in-out
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BASE = 8; // a coreografia começa depois que a transição já revelou os módulos
const BOUNCE = { damping: 9, stiffness: 140, mass: 0.7 } as const;
const BLUR = 0.55; // px de desfoque por px/frame de velocidade
const BLUR_MAX = 14;

/** Atraso de entrada (frames) por elemento. */
const atraso = (tela: string, id: string): number => {
  const T01: Record<string, number> = {
    "logo-semana": 0, recorte: 2, "foto-fundo": 18, "texto-proposito": 6, "op-mais-1": 16, "texto-pilares": 20,
    "op-mais-2": 30, "texto-respeito": 34, "op-igual": 48, "texto-resultado": 54,
  };
  const PILAR: Record<string, number> = {
    "logo-pilar": 0, "texto-representa": 6, recorte: 2, "foto-fundo": 18, "texto-bullet-1": 14, "bolinha-1": 12,
    "texto-bullet-2": 22, "bolinha-2": 20, "texto-bullet-3": 30, "bolinha-3": 28,
  };
  const T05: Record<string, number> = { recorte: 0, "foto-fundo": 16, "texto-frase-1": 10, "texto-frase-2": 40 };
  const mapa = tela === "t01" ? T01 : tela === "t05" ? T05 : ["t02", "t03", "t04"].includes(tela) ? PILAR : { "logo-semana": 6 };
  return BASE + (mapa[id] ?? 0);
};

const entrada = (t: number, d: number, dur = 18) => interpolate(t, [d, d + dur], [0, 1], { ...cl, easing: SAIDA });
const pula = (t: number, d: number, fps: number) => spring({ frame: t - d, fps, config: BOUNCE });

/** Escala do "push-in" lento da foto (1 -> 1.04 na tela toda), compartilhada pela foto e pelo recorte. */
const pushIn = (t: number, dur: number) => interpolate(t, [0, dur], [1, 1.04], { ...cl, easing: MEIO });

/** Motion blur direcional barato: filtro SVG com desvio proporcional à velocidade. */
export const Desfoque: React.FC<{ id: string; x?: number; y?: number; bloco?: boolean; children: React.ReactNode }> = ({ id, x = 0, y = 0, bloco, children }) => {
  const sx = Math.min(BLUR_MAX, Math.abs(x) * BLUR), sy = Math.min(BLUR_MAX, Math.abs(y) * BLUR);
  if (sx < 0.25 && sy < 0.25) return <>{children}</>;
  const fid = `mb-${id}`.replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <span style={{ display: bloco ? "block" : "inline-block", filter: `url(#${fid})`, width: bloco ? "100%" : undefined, height: bloco ? "100%" : undefined }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={fid} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
        </filter>
      </svg>
      {children}
    </span>
  );
};

const Ghost: React.FC<{ h: number }> = ({ h }) => (
  <>
    {Array.from({ length: Math.ceil(h / 61) + 1 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: 16, top: -6 + i * 61, color: "#fff", opacity: 0.41, fontWeight: 300, fontSize: 58, lineHeight: "61px", whiteSpace: "nowrap" }}>
        O Jeito Agi
      </div>
    ))}
  </>
);

/** Relógio com dígitos em odômetro: o dígito que muda rola para cima nos 6 últimos frames do segundo. */
export const Relogio: React.FC<{ restante: number; fps: number; size: number; cor: string }> = ({ restante, fps, size, cor }) => {
  const seg = Math.max(0, Math.ceil(restante / fps));
  const atual = `${String(Math.floor(seg / 60)).padStart(2, "0")}:${String(seg % 60).padStart(2, "0")}`;
  const prox = Math.max(0, seg - 1);
  const seguinte = `${String(Math.floor(prox / 60)).padStart(2, "0")}:${String(prox % 60).padStart(2, "0")}`;
  const faltam = restante - (seg - 1) * fps; // frames até a troca
  const p = seg > 0 ? interpolate(faltam, [0, 6], [1, 0], { ...cl, easing: MEIO }) : 0;
  return (
    <div style={{ display: "flex", fontSize: size, fontWeight: 700, color: cor, lineHeight: 1, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
      {atual.split("").map((ch, i) => {
        const muda = ch !== seguinte[i];
        if (!muda || p === 0) return <span key={i}>{ch}</span>;
        return (
          <span key={i} style={{ position: "relative", overflow: "hidden", display: "inline-block", height: "1em" }}>
            <span style={{ display: "block", translate: `0 ${-p * 100}%` }}>{ch}</span>
            <span style={{ position: "absolute", left: 0, top: 0, translate: `0 ${(1 - p) * 100}%` }}>{seguinte[i]}</span>
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- texto palavra a palavra / letra a letra

type Peca = { tipo: "br" } | { tipo: "esp" } | { tipo: "pal"; texto: string; bold: boolean; vc: boolean };

/** Quebra o HTML da redação (só <br>, <b>, <span class="vc">) em palavras, preservando estilo e espaços inquebráveis. */
const pecas = (html: string): Peca[] => {
  const out: Peca[] = [];
  const pilha: { bold: boolean; vc: boolean }[] = [{ bold: false, vc: false }];
  for (const tk of html.split(/(<[^>]+>)/)) {
    if (!tk) continue;
    if (tk.startsWith("<")) {
      if (/^<br/i.test(tk)) out.push({ tipo: "br" });
      else if (tk.startsWith("</")) { if (pilha.length > 1) pilha.pop(); }
      else {
        const topo = pilha[pilha.length - 1];
        pilha.push({ bold: topo.bold || /^<b/i.test(tk), vc: topo.vc || /class="vc"/.test(tk) });
      }
      continue;
    }
    const st = pilha[pilha.length - 1];
    tk.split(/( +)/).forEach((p) => {
      if (!p) return;
      if (/^ +$/.test(p)) out.push({ tipo: "esp" });
      else out.push({ tipo: "pal", texto: p, ...st });
    });
  }
  return out;
};

/** Posição (em em) de uma unidade que sobe: usada para o deslocamento e para a velocidade (motion blur). */
const subida = (t: number, d: number, dur: number) => (1 - interpolate(t, [d, d + dur], [0, 1], { ...cl, easing: SAIDA })) * 0.75;

const TextoAnimado: React.FC<{ id: string; html: string; t: number; d: number; size: number }> = ({ id, html, t, d, size }) => {
  const ps = pecas(html);
  const palavras = ps.filter((p) => p.tipo === "pal").length;
  const letraALetra = palavras === 1;
  let n = 0; // índice da unidade (palavra ou letra) na ordem de leitura
  const passo = (k: number) => (letraALetra ? 1.4 : Math.max(1.6, 3 - k * 0.12)); // cascata decrescente
  let acc = 0;
  const atrasoDe = () => {
    const a = acc;
    acc += passo(n);
    n++;
    return d + a;
  };
  const unidade = (txt: string, key: string, estilo: React.CSSProperties) => {
    const du = atrasoDe();
    const dur = letraALetra ? 12 : 14;
    const y = subida(t, du, dur);
    const v = (subida(t - 1, du, dur) - y) * size; // px/frame
    const op = interpolate(t, [du, du + dur * 0.6], [0, 1], cl);
    return (
      <Desfoque key={key} id={`${id}-${key}`} y={v}>
        <span style={{ display: "inline-block", whiteSpace: "pre", opacity: op, translate: `0 ${y}em`, ...estilo }}>{txt}</span>
      </Desfoque>
    );
  };
  return (
    <>
      {ps.map((p, i) => {
        if (p.tipo === "br") return <br key={i} />;
        if (p.tipo === "esp") return <React.Fragment key={i}> </React.Fragment>;
        const estilo: React.CSSProperties = { fontWeight: p.bold ? 700 : undefined, color: p.vc ? COR.vclaro : undefined };
        if (!letraALetra) return unidade(p.texto, `w${i}`, estilo);
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre" }}>
            {Array.from(p.texto).map((ch, j) => unidade(ch, `w${i}l${j}`, estilo))}
          </span>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------- tela

type Props = {
  tela: TelaLayout;
  t: number;
  dur: number;
  fps: number;
  restante: number;
  ocultarRelogio?: boolean;
  /** Transição D: a máscara da foto cresce até a tela cheia (0..1). */
  palco?: number;
};

export const Tela: React.FC<Props> = ({ tela, t, dur, fps, restante, ocultarRelogio, palco = 0 }) => {
  const foto = tela.els.find((e) => e.tipo === "fotomask") as Extract<Elemento, { tipo: "fotomask" }> | undefined;
  const rec = tela.els.find((e) => e.tipo === "recorte") as Extract<Elemento, { tipo: "recorte" }> | undefined;
  const esc = pushIn(t, dur);

  const render = (el: Elemento) => {
    const caixa: React.CSSProperties = { position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h };
    const d = atraso(tela.id, el.id);
    switch (el.tipo) {
      case "modulo": {
        const bolinha = !!el.raio && el.w <= 24;
        const s = bolinha ? pula(t, d, fps) : 1;
        return (
          <div key={el.id} style={{ ...caixa, background: COR[el.cor], borderRadius: el.raio, overflow: "hidden", opacity: bolinha ? Math.min(1, s * 3) : 1, scale: bolinha ? String(Math.max(0, s)) : undefined }}>
            {el.textura ? <Ghost h={el.h} /> : null}
          </div>
        );
      }
      case "cacos": {
        const p = entrada(t, d, 24);
        const respiro = Math.sin((t / fps) * 2 * Math.PI * 0.15) * 4; // wiggle contínuo (tokens: 4px, 0.15 ciclo/s)
        return (
          <div key={el.id} style={{ ...caixa, overflow: "hidden" }}>
            <Img src={arquivo(el)} style={{ position: "absolute", left: el.ix, top: el.iy, width: el.iw, maxWidth: "none", opacity: p, scale: el.flip ? "-1 1" : undefined, translate: `${(1 - p) * 30 + respiro}px ${(1 - p) * 18}px` }} />
          </div>
        );
      }
      case "texto":
        return (
          <div key={el.id} style={{ ...caixa, display: "flex", alignItems: { top: "flex-start", center: "center", bottom: "flex-end" }[el.valign], lineHeight: 1.14 }}>
            <div style={{ width: "100%", color: COR[el.cor], fontSize: el.size, fontWeight: el.peso, textAlign: el.align }}>
              <TextoAnimado id={`${tela.id}-${el.id}`} html={el.html} t={t} d={d} size={el.size} />
            </div>
          </div>
        );
      case "timer":
        if (ocultarRelogio) return <div key={el.id} style={{ ...caixa, background: COR[el.fundo] }} />;
        return (
          <div key={el.id} style={{ ...caixa, background: COR[el.fundo], display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Relogio restante={restante} fps={fps} size={el.size} cor={COR[el.cor]} />
          </div>
        );
      case "imagem": {
        const p = entrada(t, d);
        return <Img key={el.id} src={arquivo(el)} style={{ ...caixa, opacity: p, translate: `0 ${(1 - p) * 24}px` }} />;
      }
      case "operador": {
        const s = pula(t, d, fps);
        return (
          <div key={el.id} style={{ ...caixa, borderRadius: "50%", background: "#fff", color: COR.escuro, fontWeight: 700, fontSize: el.size, display: "flex", alignItems: "center", justifyContent: "center", opacity: Math.min(1, s * 3), scale: String(Math.max(0, s)) }}>
            {el.simbolo}
          </div>
        );
      }
      case "fotomask": {
        // A foto se abre num círculo que nasce no centro da pessoa (o recorte já está na tela).
        const p = interpolate(t, [d, d + 20], [0, 1], { ...cl, easing: SAIDA });
        const cx = rec ? rec.x + rec.w / 2 - el.x : el.w / 2;
        const cy = rec ? rec.y + rec.h * 0.45 - el.y : el.h / 2;
        const raio = Math.hypot(Math.max(cx, el.w - cx), Math.max(cy, el.h - cy)) * p;
        // Transição D: a máscara cresce até a tela cheia; a foto acompanha mantendo-se "cover".
        const bx = interpolate(palco, [0, 1], [el.x, 0]);
        const by = interpolate(palco, [0, 1], [el.y, 0]);
        const bw = interpolate(palco, [0, 1], [el.w, 1920]);
        const bh = interpolate(palco, [0, 1], [el.h, 1080]);
        const k = Math.max(1, bw / el.w, bh / el.h);
        return (
          <div key={el.id} style={{ position: "absolute", left: bx, top: by, width: bw, height: bh, overflow: "hidden", clipPath: palco > 0 ? undefined : `circle(${raio}px at ${cx}px ${cy}px)`, zIndex: palco > 0 ? 50 : undefined }}>
            <Img
              src={arquivo(el)}
              style={{ position: "absolute", left: el.ix, top: el.iy, width: el.iw, maxWidth: "none", transformOrigin: `${el.w / 2 - el.ix}px ${el.h / 2 - el.iy}px`, scale: String(esc * k), translate: `${(bw - el.w) / 2}px ${(bh - el.h) / 2}px` }}
            />
          </div>
        );
      }
      case "recorte": {
        if (palco > 0) return null;
        // Entra primeiro: sobe de dentro do módulo com bounce; depois a foto se abre atrás dele.
        const s = pula(t, d, fps);
        const s1 = pula(t - 1, d, fps);
        const sobe = (1 - s) * 90; // px
        const v = (1 - s1) * 90 - sobe;
        const ox = foto ? foto.x + foto.w / 2 - el.x : el.w / 2;
        const oy = foto ? foto.y + foto.h / 2 - el.y : el.h / 2;
        return (
          <div key={el.id} style={{ ...caixa, opacity: Math.min(1, s * 2.5), translate: `0 ${sobe}px` }}>
            <Desfoque id={`${tela.id}-rec`} y={v} bloco>
              <Img src={arquivo(el)} style={{ width: "100%", height: "100%", display: "block", transformOrigin: `${ox}px ${oy}px`, scale: String(esc * interpolate(s, [0, 1], [0.9, 1])) }} />
            </Desfoque>
          </div>
        );
      }
    }
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily, background: "#fff" }}>
      {tela.els.map(render)}
    </div>
  );
};

/** Mantido por compatibilidade com o Vinheta.tsx (as ênfases agora entram na ordem das palavras). */
export const EstiloTexto: React.FC = () => null;
