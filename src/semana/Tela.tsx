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
const BASE = 8;
const PAUSA_LEITURA = 16; // frames com a frase completa antes do próximo bullet // a coreografia começa depois que a transição já revelou os módulos
// bounce com assentamento mais curto (rodada 3: refino "Apple/Itaú" — ainda pula, mas assenta em ~0,5s)
const BOUNCE = { damping: 11, stiffness: 150, mass: 0.7 } as const;
const BLUR = 0.55; // px de desfoque por px/frame de velocidade
const BLUR_MAX = 14;

/** Atraso de entrada (frames) por elemento. */
const atraso = (tela: string, id: string): number => {
  const T01: Record<string, number> = {
    "logo-semana": 0, recorte: 2, "foto-fundo": 18, "texto-proposito": 6, "op-mais-1": 16, "texto-pilares": 20,
    "op-mais-2": 30, "texto-respeito": 34, "op-igual": 48, "texto-resultado": 54,
  };
  const PILAR: Record<string, number> = {
    // bullets um de cada vez (rodada 3): ~1,75s entre eles, no ritmo de leitura; a bolinha puxa o texto
    "logo-pilar": 0, "texto-representa": 6, recorte: 2, "foto-fundo": 18,
    "bolinha-1": 24, "texto-bullet-1": 27, "bolinha-2": 66, "texto-bullet-2": 69, "bolinha-3": 108, "texto-bullet-3": 111,
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
export const Desfoque: React.FC<{ id: string; x?: number; y?: number; foco?: number; bloco?: boolean; children: React.ReactNode }> = ({ id, x = 0, y = 0, foco = 0, bloco, children }) => {
  // velocidade (motion blur direcional) + "foco" (desfoque que some ao assentar, o rack focus das keynotes)
  const sx = Math.min(BLUR_MAX, Math.abs(x) * BLUR + foco), sy = Math.min(BLUR_MAX, Math.abs(y) * BLUR + foco);
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

/** Textura "O Jeito Agi": as linhas sobem devagar e sem parar durante a tela (loop perfeito a cada 61px). */
const CACOS_PROP = 756.163 / 695.216; // altura/largura do cacos.svg
const CACOS_LOOP = 706 / 695.216; // passo vertical do mosaico "-loop" (medido: menor passo sem encostar peças, vão de 6px)
export const VELOC_TEXTURA = 16; // px por segundo: lento o bastante para ser textura, não leitura
export const Ghost: React.FC<{ h: number; t: number; fps: number; left?: number; size?: number; passo?: number; opacidade?: number }> = ({ h, t, fps, left = 16, size = 58, passo = 61, opacidade = 0.41 }) => {
  const sobe = ((t / fps) * VELOC_TEXTURA) % passo;
  return (
    <>
      {Array.from({ length: Math.ceil(h / passo) + 2 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left, top: -6 + i * passo - sobe, color: "#fff", opacity: opacidade, fontWeight: 300, fontSize: size, lineHeight: `${passo}px`, whiteSpace: "nowrap" }}>
          O Jeito Agi
        </div>
      ))}
    </>
  );
};

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
            <span style={{ display: "block", translate: `0 ${-p * 100}%`, filter: `blur(${(Math.sin(Math.PI * p) * size * 0.012).toFixed(2)}px)` }}>{ch}</span>
            <span style={{ position: "absolute", left: 0, top: 0, translate: `0 ${(1 - p) * 100}%`, filter: `blur(${(Math.sin(Math.PI * p) * size * 0.012).toFixed(2)}px)` }}>{seguinte[i]}</span>
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- texto palavra a palavra / letra a letra

type Peca = { tipo: "br" } | { tipo: "esp" } | { tipo: "pal"; texto: string; bold: boolean; vc: boolean; vd?: boolean };

/** Quebra o HTML da redação (só <br>, <b>, <span class="vc">) em palavras, preservando estilo e espaços inquebráveis. */
const pecas = (html: string): Peca[] => {
  const out: Peca[] = [];
  const pilha: { bold: boolean; vc: boolean; vd?: boolean }[] = [{ bold: false, vc: false }];
  for (const tk of html.split(/(<[^>]+>)/)) {
    if (!tk) continue;
    if (tk.startsWith("<")) {
      if (/^<br/i.test(tk)) out.push({ tipo: "br" });
      else if (tk.startsWith("</")) { if (pilha.length > 1) pilha.pop(); }
      else {
        const topo = pilha[pilha.length - 1];
        pilha.push({ bold: topo.bold || /^<b/i.test(tk), vc: topo.vc || /class="vc"/.test(tk), vd: topo.vd || /class="vd"/.test(tk) });
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
const subida = (t: number, d: number, dur: number) => (1 - interpolate(t, [d, d + dur], [0, 1], { ...cl, easing: SAIDA })) * 0.5;

const passoTexto = (letraALetra: boolean, k: number) => (letraALetra ? 1.4 : Math.max(1.6, 3 - k * 0.12)); // cascata decrescente

/** Frames até a última palavra (ou letra) de um texto assentar. */
export const duracaoTexto = (html: string): number => {
  const ps = pecas(html).filter((p) => p.tipo === "pal") as Extract<Peca, { tipo: "pal" }>[];
  const letraALetra = ps.length === 1;
  const unidades = letraALetra ? Array.from(ps[0].texto).length : ps.length;
  let acc = 0;
  for (let k = 0; k < unidades - 1; k++) acc += passoTexto(letraALetra, k);
  return acc + (letraALetra ? 14 : 18);
};

export const TextoAnimado: React.FC<{ id: string; html: string; t: number; d: number; size: number }> = ({ id, html, t, d, size }) => {
  const ps = pecas(html);
  const palavras = ps.filter((p) => p.tipo === "pal").length;
  const letraALetra = palavras === 1;
  let n = 0; // índice da unidade (palavra ou letra) na ordem de leitura
  let acc = 0;
  const atrasoDe = () => {
    const a = acc;
    acc += passoTexto(letraALetra, n);
    n++;
    return d + a;
  };
  const unidade = (txt: string, key: string, estilo: React.CSSProperties) => {
    const du = atrasoDe();
    const dur = letraALetra ? 14 : 18;
    const y = subida(t, du, dur);
    const v = (subida(t - 1, du, dur) - y) * size; // px/frame
    const op = interpolate(t, [du, du + dur * 0.55], [0, 1], cl);
    // foco: começa levemente desfocada e assenta nítida junto com a subida
    const foco = (1 - interpolate(t, [du, du + dur * 0.8], [0, 1], { ...cl, easing: SAIDA })) * size * 0.08;
    return (
      <Desfoque key={key} id={`${id}-${key}`} y={v} foco={foco}>
        <span style={{ display: "inline-block", whiteSpace: "pre", opacity: op, translate: `0 ${y}em`, ...estilo }}>{txt}</span>
      </Desfoque>
    );
  };
  return (
    <>
      {ps.map((p, i) => {
        if (p.tipo === "br") return <br key={i} />;
        if (p.tipo === "esp") return <React.Fragment key={i}> </React.Fragment>;
        const estilo: React.CSSProperties = { fontWeight: p.bold ? 700 : undefined, color: p.vc ? COR.vclaro : p.vd ? COR.verde : undefined };
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

  // Bullets em sequência (rodada 3): o próximo só começa quando a frase anterior terminou de entrar
  // e ficou ~0,7s parada para leitura. A bolinha pula 3 frames antes do seu texto.
  const atrasoBullets: Record<string, number> = {};
  {
    let cursor = atraso(tela.id, "texto-bullet-1");
    for (let i = 1; tela.els.some((e) => e.id === `texto-bullet-${i}`); i++) {
      const tx = tela.els.find((e) => e.id === `texto-bullet-${i}`) as Extract<Elemento, { tipo: "texto" }>;
      atrasoBullets[`texto-bullet-${i}`] = cursor;
      atrasoBullets[`bolinha-${i}`] = cursor - 3;
      cursor += duracaoTexto(tx.html) + PAUSA_LEITURA;
    }
  }

  const render = (el: Elemento) => {
    const caixa: React.CSSProperties = { position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h };
    const d = atrasoBullets[el.id] ?? atraso(tela.id, el.id);
    switch (el.tipo) {
      case "modulo": {
        const bolinha = !!el.raio && el.w <= 24;
        const s = bolinha ? pula(t, d, fps) : 1;
        return (
          <div key={el.id} style={{ ...caixa, background: COR[el.cor], borderRadius: el.raio, overflow: "hidden", opacity: bolinha ? Math.min(1, s * 3) : 1, scale: bolinha ? String(Math.max(0, s)) : undefined }}>
            {el.textura ? <Ghost h={el.h} t={t} fps={fps} /> : null}
          </div>
        );
      }
      case "cacos": {
        // Com o mosaico em loop, um módulo de cacos já cobre a coluna inteira: um segundo mosaico
        // sobreposto ao mesmo espaço (caso dos respiros) viraria duas texturas cruzadas. Fica só o primeiro.
        const anterior = tela.els.slice(0, tela.els.indexOf(el)).find(
          (o) => o.tipo === "cacos" && o.x < el.x + el.w && el.x < o.x + o.w && o.y < el.y + el.h && el.y < o.y + o.h,
        );
        if (anterior) return null;
        const p = entrada(t, d, 24);
        const respiro = Math.sin((t / fps) * 2 * Math.PI * 0.15) * 4; // wiggle contínuo (tokens: 4px, 0.15 ciclo/s)
        // Os cacos sobem devagar, como a textura "O Jeito Agi" (rodada 3). Versão "-loop" do mosaico:
        // sem as peças cortadas na borda do SVG, empilhada a cada 706 unidades (encaixe com o mesmo
        // vão do mosaico, sem emenda reta). Loop perfeito, inclusive nos 5 min de buffer.
        const ih = el.iw * CACOS_PROP;
        const periodo = el.iw * CACOS_LOOP;
        const sobe = ((t / fps) * VELOC_TEXTURA) % periodo;
        const n = Math.ceil((el.h - el.iy + periodo) / periodo) + 1;
        const src = arquivo(el).replace(".svg", "-loop.svg");
        return (
          <div key={el.id} style={{ ...caixa, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: p, translate: `${(1 - p) * 30 + respiro}px ${(1 - p) * 18 - sobe}px` }}>
              {Array.from({ length: n }, (_, j) => (
                <Img key={j} src={src} style={{ position: "absolute", left: el.ix, top: el.iy + j * periodo, width: el.iw, height: ih, maxWidth: "none", scale: el.flip ? "-1 1" : undefined }} />
              ))}
            </div>
          </div>
        );
      }
      case "texto": {
        // bullets: o texto desliza curto a partir da bolinha (a bolinha já pulou), um bullet por vez
        const bullet = el.id.startsWith("texto-bullet");
        const px = bullet ? (1 - entrada(t, d, 22)) * -28 : 0;
        return (
          <div key={el.id} style={{ ...caixa, translate: bullet ? `${px}px 0` : undefined, display: "flex", alignItems: { top: "flex-start", center: "center", bottom: "flex-end" }[el.valign], lineHeight: 1.14 }}>
            <div style={{ width: "100%", color: COR[el.cor], fontSize: el.size, fontWeight: el.peso, textAlign: el.align }}>
              <TextoAnimado id={`${tela.id}-${el.id}`} html={el.html} t={t} d={d} size={el.size} />
            </div>
          </div>
        );
      }
      case "timer":
        if (ocultarRelogio) return <div key={el.id} style={{ ...caixa, background: COR[el.fundo] }} />;
        return (
          <div key={el.id} style={{ ...caixa, background: COR[el.fundo], display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Relogio restante={restante} fps={fps} size={el.size} cor={COR[el.cor]} />
          </div>
        );
      case "imagem": {
        // logos: entrada em foco (desfocado -> nítido) com aproximação curta, sem pular
        const p = entrada(t, d, 22);
        return <Img key={el.id} src={arquivo(el)} style={{ ...caixa, opacity: Math.min(1, p * 1.6), translate: `0 ${(1 - p) * 16}px`, scale: String(0.96 + 0.04 * p), filter: p < 1 ? `blur(${((1 - p) * 10).toFixed(2)}px)` : undefined }} />;
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
