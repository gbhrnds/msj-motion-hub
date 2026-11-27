import React from "react";
import { Easing, Img, interpolate, spring, staticFile } from "remotion";
import { fontFamily } from "../fonts";
import cacosKv from "../../projects/semana-jeito-agi/render-assets/kv/cacos-kv.json";
import { COR } from "./layout";
import { Desfoque, Ghost, TextoAnimado } from "./Tela";

/**
 * KV da Semana do Jeito Agi animado: fecha a regressiva (entra quando o relógio chega a 00:00)
 * e abre o buffer. Reconstruído camada a camada a partir do PSD oficial, nas posições do PSD
 * (1957x1296), em escala 1 e deslocado para encaixar exatamente nos 1920x1080.
 *
 * Coreografia (skill choreograph):
 * - static → os 11 módulos encaixam numa onda que nasce no logo (canto superior esquerdo),
 *   cada um crescendo pela borda virada para a origem (a mesma gramática da transição A);
 * - lead → logo da Semana, em foco (desfocado -> nítido), assim que o módulo dele assenta;
 * - support → pessoas sobem de dentro dos módulos com bounce; depois os dois textos do KV, palavra a palavra;
 * - decoration → os 208 cacos se montam peça a peça (onda radial), a textura "O Jeito Agi" sobe sem parar.
 * Câmera: começa 6% mais perto e recua até o enquadramento exato (o KV encaixado na tela, como no JPG aprovado).
 * É a tela final da vinheta: fica no ar até o fim dos 5 min, com a textura subindo.
 */

const RA = "projects/semana-jeito-agi/render-assets/";
const SAIDA = Easing.bezier(0.23, 1, 0.32, 1);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BOUNCE = { damping: 11, stiffness: 150, mass: 0.7 } as const;

export const KV_W = 1957;
export const KV_H = 1296;
/** Enquadramento aprovado (JPG do usuário, 2026-11-27): KV em escala 1, deslocado (-34, -15), sangrando nas 4 bordas. */
const DX = -34;
const DY = -15;
const ORIGEM = { x: 290, y: 205 }; // centro do logo: a onda nasce dele

/** Módulos do PSD, na ordem de empilhamento (de baixo para cima). */
type Mod = { x0: number; y0: number; x1: number; y1: number; cor: string };
const MODULOS: Mod[] = [
  { x0: 1651, y0: 14, x1: 1958, y1: 388, cor: COR.verde },
  { x0: 953, y0: 14, x1: 1657, y1: 388, cor: COR.escuro },
  { x0: 550, y0: 14, x1: 955, y1: 388, cor: COR.medio },
  { x0: 33, y0: 14, x1: 552, y1: 388, cor: COR.branco },
  { x0: 1355, y0: 385, x1: 1956, y1: 760, cor: COR.branco },
  { x0: 952, y0: 757, x1: 1956, y1: 1099, cor: COR.azul },
  { x0: 33, y0: 385, x1: 955, y1: 760, cor: COR.azul },
];
const MODULOS_TOPO: Mod[] = [
  { x0: 952, y0: 385, x1: 1358, y1: 760, cor: COR.medio },
  { x0: 549, y0: 757, x1: 955, y1: 1101, cor: COR.verde },
  { x0: 33, y0: 757, x1: 552, y1: 1099, cor: COR.amarelo },
];

const atrasoOnda = (cx: number, cy: number) => Math.hypot(cx - ORIGEM.x, cy - ORIGEM.y) / 95; // frames

/** Módulo que cresce a partir da borda voltada para a origem da onda. */
const Modulo: React.FC<{ m: Mod; t: number; d: number; children?: React.ReactNode }> = ({ m, t, d, children }) => {
  const p = interpolate(t, [d, d + 18], [0, 1], { ...cl, easing: SAIDA });
  const cx = (m.x0 + m.x1) / 2, cy = (m.y0 + m.y1) / 2;
  const dx = cx - ORIGEM.x, dy = cy - ORIGEM.y;
  const r = (1 - p) * 100;
  // cresce na direção dominante do vetor origem -> módulo
  const clip = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? `inset(0 ${r}% 0 0)` : `inset(0 0 0 ${r}%)`) : dy > 0 ? `inset(0 0 ${r}% 0)` : `inset(${r}% 0 0 0)`;
  if (p <= 0) return null;
  return <div style={{ position: "absolute", left: m.x0, top: m.y0, width: m.x1 - m.x0, height: m.y1 - m.y0, background: m.cor, clipPath: p < 1 ? clip : undefined, overflow: "hidden" }}>{children}</div>;
};

/** Grupo de cacos vetorizado do PSD: cada peça assenta com leve giro e escala, numa onda radial. */
const Cacos: React.FC<{ grupo: "royal" | "marinho"; x: number; y: number; cor: string; t: number; d: number; fps: number }> = ({ grupo, x, y, cor, t, d, fps }) => {
  const g = cacosKv[grupo];
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={g.w} height={g.h} viewBox={`0 0 ${g.w} ${g.h}`}>
      {g.pecas.map((pc, i) => {
        const dist = atrasoOnda(x + pc.cx, y + pc.cy);
        const jitter = ((i * 37) % 11) / 3.5; // variação fixa: onda orgânica, não metrônomo
        const s = spring({ frame: t - d - dist * 0.9 - jitter, fps, config: BOUNCE });
        if (s <= 0.001) return null;
        const giro = (1 - s) * (i % 2 ? 14 : -14);
        return (
          <path
            key={i}
            d={pc.d}
            fill={cor}
            opacity={Math.min(1, s * 2.2)}
            style={{ transformOrigin: `${pc.cx}px ${pc.cy}px`, transformBox: "view-box", transform: `scale(${0.6 + 0.4 * s}) rotate(${giro}deg)` }}
          />
        );
      })}
    </svg>
  );
};

/** Pessoa do KV: sobe de dentro do módulo com bounce e motion blur vertical. */
const Pessoa: React.FC<{ src: string; x: number; y: number; w: number; h: number; t: number; d: number; fps: number; id: string }> = ({ src, x, y, w, h, t, d, fps, id }) => {
  const s = spring({ frame: t - d, fps, config: BOUNCE });
  const s1 = spring({ frame: t - 1 - d, fps, config: BOUNCE });
  if (s <= 0.001) return null;
  const sobe = (1 - s) * 80;
  const v = (1 - s1) * 80 - sobe;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: Math.min(1, s * 2.5), translate: `0 ${sobe}px` }}>
      <Desfoque id={`kv-${id}`} y={v} bloco>
        <Img src={staticFile(`${RA}kv/${src}`)} style={{ width: "100%", height: "100%", display: "block" }} />
      </Desfoque>
    </div>
  );
};

/** Os dois textos do KV (copy oficial da peça, com quebras e pesos do PSD). */
const TEXTO_1 = "A semana<br>de <b>Cultura</b><br>do Agibank";
// texto 2 conforme a versão final do KV enviada pelo usuário (JPG de 2026-11-27)
const TEXTO_2 = 'Lutamos pelo nosso<br>propósito de uma forma<br>que todos crescem:<br><b><span class="vd">clientes, acionistas</span></b><br><b><span class="vd">e colaboradores</span></b>';

export const KvAnimado: React.FC<{ t: number; fps: number }> = ({ t, fps }) => {
  // câmera: começa 6% mais perto e recua até assentar no enquadramento exato do KV (~5s); depois fica parada
  const camera = interpolate(t, [0, 120], [1.06, 1], { ...cl, easing: Easing.bezier(0.33, 0, 0.15, 1) });
  const dMod = (m: Mod) => 2 + atrasoOnda((m.x0 + m.x1) / 2, (m.y0 + m.y1) / 2);
  const logo = interpolate(t, [10, 32], [0, 1], { ...cl, easing: SAIDA });
  const texturaOp = interpolate(t, [dMod(MODULOS[0]) + 8, dMod(MODULOS[0]) + 26], [0, 1], cl);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", overflow: "hidden", fontFamily }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "960px 540px", scale: String(camera) }}>
        <div style={{ position: "absolute", left: DX, top: DY, width: KV_W, height: KV_H }}>
          {MODULOS.map((m, i) => (
            <Modulo key={i} m={m} t={t} d={dMod(m)}>
              {i === 0 ? (
                <div style={{ position: "absolute", inset: 0, opacity: texturaOp }}>
                  {/* textura do PSD: Light 59,8px, branco a 41% x grupo a 73%, linhas a cada 61px */}
                  <Ghost h={m.y1 - m.y0} t={t} fps={fps} left={20} size={59.8} passo={61} opacidade={0.41 * 0.73} />
                </div>
              ) : null}
            </Modulo>
          ))}
          <Cacos grupo="royal" x={0} y={387} cor={COR.medio} t={t} d={14} fps={fps} />
          <Cacos grupo="marinho" x={954} y={903} cor={COR.escuro} t={t} d={14} fps={fps} />
          {MODULOS_TOPO.map((m, i) => (
            <Modulo key={`topo-${i}`} m={m} t={t} d={dMod(m)} />
          ))}
          {/* cunha branca: a única diagonal do KV, chega com o módulo azul */}
          <Img src={staticFile(`${RA}kv/cunha.png`)} style={{ position: "absolute", left: 454, top: 364, width: 58, height: 96, opacity: interpolate(t, [dMod(MODULOS[6]) + 6, dMod(MODULOS[6]) + 14], [0, 1], cl) }} />

          <Pessoa id="04" src="pessoa-04.png" x={516} y={0} w={436} h={666} t={t} d={24} fps={fps} />
          <Pessoa id="03" src="pessoa-03.png" x={153} y={458} w={483} h={699} t={t} d={34} fps={fps} />
          <Pessoa id="02" src="pessoa-02.png" x={826} y={153} w={530} h={608} t={t} d={29} fps={fps} />
          <Pessoa id="principal" src="pessoa-principal.png" x={1107} y={286} w={800} h={837} t={t} d={20} fps={fps} />

          <div style={{ position: "absolute", left: 544, top: 466, color: "#fff", fontSize: 55.4, fontWeight: 300, lineHeight: 1.2, letterSpacing: "-0.028em", whiteSpace: "nowrap" }}>
            <TextoAnimado id="kv-t1" html={TEXTO_1} t={t} d={42} size={55.4} />
          </div>
          <div style={{ position: "absolute", left: 1336, top: 111, color: "#fff", fontSize: 27.6, fontWeight: 300, lineHeight: 1.2, letterSpacing: "-0.028em", whiteSpace: "nowrap" }}>
            <TextoAnimado id="kv-t2" html={TEXTO_2} t={t} d={54} size={27.6} />
          </div>

          <Img
            src={staticFile(`${RA}logo-semana-do-jeito-agi-positivo.svg`)}
            style={{ position: "absolute", left: 159, top: 68, width: 263, height: 263, objectFit: "contain", opacity: Math.min(1, logo * 1.6), scale: String(0.94 + 0.06 * logo), filter: logo < 1 ? `blur(${((1 - logo) * 12).toFixed(2)}px)` : undefined }}
          />
        </div>
      </div>
    </div>
  );
};
