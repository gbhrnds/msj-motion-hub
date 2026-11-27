import React from "react";
import { Easing, Img, interpolate } from "remotion";
import { fontFamily } from "../fonts";
import { COR, Elemento, TelaLayout, arquivo } from "./layout";

/**
 * Uma tela da Semana do Jeito Agi num instante `t` (frames desde o início da tela).
 *
 * Elenco (skill choreograph):
 * - static: fundo e módulos de cor (revelados pela transição de tela, sem animação própria);
 * - lead: logo do pilar / título / termos da equação;
 * - support: bullets, frases, foto;
 * - decoration: cacos (entram e depois só respiram) e o recorte que "sai" do módulo.
 * Texto entra uma vez (máscara de baixo para cima) e fica parado.
 */

const SAIDA = Easing.bezier(0.23, 1, 0.32, 1); // entrada: ease-out forte (tokens / agente 05)
const MEIO = Easing.bezier(0.65, 0, 0.35, 1); // movimento em tela: ease-in-out
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BASE = 8; // a coreografia começa depois que a transição já revelou os módulos

/** Atraso de entrada (frames) por elemento: cascata decrescente, terminando em ~2s. */
const atraso = (tela: string, id: string): number => {
  const T01: Record<string, number> = {
    "logo-semana": 0, "foto-fundo": 4, "texto-proposito": 6, "op-mais-1": 14, "texto-pilares": 18,
    "op-mais-2": 26, "texto-respeito": 30, "op-igual": 40, "texto-resultado": 46, recorte: 24,
  };
  const PILAR: Record<string, number> = {
    "logo-pilar": 0, "texto-representa": 6, "foto-fundo": 4, "texto-bullet-1": 12, "bolinha-1": 12,
    "texto-bullet-2": 16, "bolinha-2": 16, "texto-bullet-3": 19, "bolinha-3": 19, recorte: 22,
  };
  const T05: Record<string, number> = { "foto-fundo": 0, recorte: 14, "texto-frase-1": 8, "texto-frase-2": 32 };
  const mapa = tela === "t01" ? T01 : tela === "t05" ? T05 : ["t02", "t03", "t04"].includes(tela) ? PILAR : { "logo-semana": 6 };
  return BASE + (mapa[id] ?? 0);
};

const entrada = (t: number, d: number, dur = 18) => interpolate(t, [d, d + dur], [0, 1], { ...cl, easing: SAIDA });

/** Escala do "push-in" lento da foto (1 -> 1.04 na tela toda), compartilhada pela foto e pelo recorte. */
const pushIn = (t: number, dur: number) => interpolate(t, [0, dur], [1, 1.04], { ...cl, easing: MEIO });

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
  const esc = pushIn(t, dur);

  const render = (el: Elemento) => {
    const caixa: React.CSSProperties = { position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h };
    const d = atraso(tela.id, el.id);
    switch (el.tipo) {
      case "modulo": {
        const bolinha = !!el.raio && el.w <= 24;
        const p = bolinha ? entrada(t, d, 14) : 1;
        return (
          <div key={el.id} style={{ ...caixa, background: COR[el.cor], borderRadius: el.raio, overflow: "hidden", opacity: p, scale: bolinha ? interpolate(p, [0, 1], [0.95, 1]) : undefined }}>
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
      case "texto": {
        const p = entrada(t, d);
        const enfase = entrada(t, d + 4, 14);
        return (
          <div key={el.id} style={{ ...caixa, display: "flex", alignItems: { top: "flex-start", center: "center", bottom: "flex-end" }[el.valign], lineHeight: 1.14 }}>
            {/* máscara presa ao bloco de texto: as linhas sobem de dentro da própria caixa */}
            <div style={{ width: "100%", overflow: "hidden", paddingBottom: "0.12em", marginBottom: "-0.12em" }}>
              <div
                className="sja-txt"
                style={{ color: COR[el.cor], fontSize: el.size, fontWeight: el.peso, textAlign: el.align, translate: `0 ${(1 - p) * 105}%`, ["--enfase" as string]: enfase }}
                dangerouslySetInnerHTML={{ __html: el.html }}
              />
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
        const p = entrada(t, d);
        return <Img key={el.id} src={arquivo(el)} style={{ ...caixa, opacity: p, translate: `0 ${(1 - p) * 24}px` }} />;
      }
      case "operador": {
        const p = entrada(t, d, 12);
        return (
          <div key={el.id} style={{ ...caixa, borderRadius: "50%", background: "#fff", color: COR.escuro, fontWeight: 700, fontSize: el.size, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, scale: interpolate(p, [0, 1], [0.95, 1]) }}>
            {el.simbolo}
          </div>
        );
      }
      case "fotomask": {
        const p = entrada(t, d, 22);
        // Transição D: a máscara cresce até a tela cheia; a foto acompanha mantendo-se "cover".
        const bx = interpolate(palco, [0, 1], [el.x, 0]);
        const by = interpolate(palco, [0, 1], [el.y, 0]);
        const bw = interpolate(palco, [0, 1], [el.w, 1920]);
        const bh = interpolate(palco, [0, 1], [el.h, 1080]);
        const k = Math.max(1, bw / el.w, bh / el.h);
        return (
          <div key={el.id} style={{ position: "absolute", left: bx, top: by, width: bw, height: bh, overflow: "hidden", clipPath: `inset(${(1 - p) * 100}% 0 0 0)`, zIndex: palco > 0 ? 50 : undefined }}>
            <Img
              src={arquivo(el)}
              style={{ position: "absolute", left: el.ix, top: el.iy, width: el.iw, maxWidth: "none", transformOrigin: `${el.w / 2 - el.ix}px ${el.h / 2 - el.iy}px`, scale: String(esc * k), translate: `${(bw - el.w) / 2}px ${(bh - el.h) / 2}px` }}
            />
          </div>
        );
      }
      case "recorte": {
        if (palco > 0) return null;
        const p = entrada(t, d, 14);
        // Mesmo push-in da foto, com origem no centro da máscara: o recorte continua alinhado à pessoa da foto.
        const ox = foto ? foto.x + foto.w / 2 - el.x : el.w / 2;
        const oy = foto ? foto.y + foto.h / 2 - el.y : el.h / 2;
        return <Img key={el.id} src={arquivo(el)} style={{ ...caixa, opacity: p, transformOrigin: `${ox}px ${oy}px`, scale: String(esc) }} />;
      }
    }
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily, background: "#fff" }}>
      {tela.els.map(render)}
    </div>
  );
};

/** CSS das ênfases da redação: Bold e verde claro chegam 4 frames depois da linha. */
export const EstiloTexto: React.FC = () => (
  <style>{`.sja-txt b{font-weight:700;opacity:var(--enfase)}.sja-txt .vc{color:${COR.vclaro};opacity:var(--enfase)}`}</style>
);
