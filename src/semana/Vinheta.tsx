import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../fonts";
import tokens from "../../brand/tokens.json";
import { COR, Elemento, TELAS, TelaLayout } from "./layout";
import { EstiloTexto, Relogio, Tela } from "./Tela";

/**
 * Vinheta pré-live da Semana do Jeito Agi (um mp4 para as 3 lives).
 * Fase 1: 10 min de loop (o relógio conta 10:00 -> 00:00); Fase 2: 5 min de buffer só com o logo.
 *
 * Transições (aprovadas pelo usuário):
 * A · troca célula a célula (grade 5x3), onda saindo do relógio — entre telas de conteúdo
 * B · varredura de cacos + C · relógio que cresce/encolhe — entrada e saída dos respiros
 * D · foto que vira palco — uma vez por volta (T04 -> T05)
 */

const MEIO = Easing.bezier(0.65, 0, 0.35, 1);
const SAIDA = Easing.bezier(0.23, 1, 0.32, 1);
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Tempos de tela (s): regra do agents/01 (ver estudo/analise-roteiro.md). */
const VOLTA: { id: string; seg: number }[] = [
  { id: "t01", seg: 12 },
  { id: "r1", seg: 8 },
  { id: "t02", seg: 15 },
  { id: "t03", seg: 16 },
  { id: "r2", seg: 8 },
  { id: "t04", seg: 13 },
  { id: "t05", seg: 12 },
  { id: "r3", seg: 8 },
];
const SEG_FECHAMENTO = 10;

export const framesFase1 = (fps: number) => Math.round(tokens.timing.contentLoopMinutes * 60 * fps);
export const framesFase2 = (fps: number) => Math.round(tokens.timing.bufferOnlyLogoMinutes * 60 * fps);

type Trecho = { id: string; inicio: number; dur: number };
const respiro = (id: string) => id.startsWith("r") || id === "fim";

/** Monta a linha do tempo: voltas inteiras até sobrar só o fechamento (relógio grande até 00:00). */
export const montarLinha = (fps: number, total: number): Trecho[] => {
  const linha: Trecho[] = [];
  const limite = total - Math.round(SEG_FECHAMENTO * fps);
  let cursor = 0;
  for (let i = 0; ; i++) {
    const v = VOLTA[i % VOLTA.length];
    const d = Math.round(v.seg * fps);
    if (cursor + d > limite) break;
    linha.push({ id: v.id, inicio: cursor, dur: d });
    cursor += d;
  }
  linha.push({ id: "fim", inicio: cursor, dur: total - cursor });
  return linha;
};

const layoutDe = (id: string): TelaLayout => TELAS[id === "fim" ? "r1" : id];

const tipoTransicao = (de: string | null, para: string): "A" | "B" | "D" => {
  if (de === null) return "A";
  if (respiro(de) || respiro(para)) return "B";
  if (de === "t04" && para === "t05") return "D";
  return "A";
};
const DUR = { A: 26, B: 30, D: 22 };

/** A: a tela que entra é revelada célula a célula, numa onda que sai do relógio (canto superior direito). */
const OndaDeCelulas: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => {
  const celulas = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 5; c++) {
      const dist = Math.hypot(4 - c, r);
      const jitter = ((c * 7 + r * 13) % 5) / 2; // variação fixa, para a onda não virar metrônomo
      const d = dist * 2.6 + jitter;
      const p = interpolate(t, [d, d + 12], [0, 1], { ...cl, easing: SAIDA });
      if (p <= 0) continue;
      const x = c * 384, y = r * 360;
      // a célula cresce a partir da borda virada para a origem da onda (direita/topo)
      celulas.push(
        <div key={`${r}-${c}`} style={{ position: "absolute", left: x, top: y, width: 384, height: 360, overflow: "hidden", clipPath: `inset(0 0 ${(1 - p) * 100}% ${(1 - p) * 100}%)` }}>
          <div style={{ position: "absolute", left: -x, top: -y, width: 1920, height: 1080 }}>{children}</div>
        </div>,
      );
    }
  return <>{celulas}</>;
};

/** B: faixa de cacos atravessando a tela; a tela nova fica do lado de trás da faixa. */
const FaixaCacos: React.FC<{ x: number }> = ({ x }) => (
  <div style={{ position: "absolute", left: x - 360, top: 0, width: 720, height: 1080, background: COR.medio, overflow: "hidden", zIndex: 80 }}>
    <Img src={staticFile("projects/semana-jeito-agi/render-assets/cacos-escuro.svg")} style={{ position: "absolute", left: -20, top: -40, width: 760, maxWidth: "none" }} />
    <Img src={staticFile("projects/semana-jeito-agi/render-assets/cacos-escuro.svg")} style={{ position: "absolute", left: -20, top: 700, width: 760, maxWidth: "none", scale: "1 -1" }} />
  </div>
);

const caixaRelogio = (tela: TelaLayout) => tela.els.find((e) => e.tipo === "timer") as Extract<Elemento, { tipo: "timer" }> | undefined;

/** C: o relógio sai da célula da tela atual e vira o módulo grande do respiro (ou volta). */
const RelogioViajante: React.FC<{ de: TelaLayout; para: TelaLayout; p: number; restante: number; fps: number }> = ({ de, para, p, restante, fps }) => {
  const a = caixaRelogio(de), b = caixaRelogio(para);
  if (!a || !b) return null;
  const k = interpolate(p, [0, 1], [0, 1], { ...cl, easing: MEIO });
  const mix = (u: number, v: number) => u + (v - u) * k;
  return (
    <div style={{ position: "absolute", left: mix(a.x, b.x), top: mix(a.y, b.y), width: mix(a.w, b.w), height: mix(a.h, b.h), background: COR[k < 0.5 ? a.fundo : b.fundo], display: "flex", alignItems: "center", justifyContent: "center", zIndex: 90, fontFamily }}>
      <Relogio restante={restante} fps={fps} size={mix(a.size, b.size)} cor={COR[k < 0.5 ? a.cor : b.cor]} />
    </div>
  );
};

/** Fase 1: loop de conteúdo com relógio regressivo. `total` = frames da fase. */
export const Fase1: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const linha = React.useMemo(() => montarLinha(fps, total), [fps, total]);
  const i = linha.findIndex((s) => frame >= s.inicio && frame < s.inicio + s.dur);
  const atual = linha[Math.max(0, i)];
  const anterior = i > 0 ? linha[i - 1] : null;
  const t = frame - atual.inicio;
  const restante = total - frame;
  const telaAtual = layoutDe(atual.id);
  const tipo = tipoTransicao(anterior?.id ?? null, atual.id);
  const emTransicao = t < DUR[tipo];

  const nova = (oculta = false) => <Tela tela={telaAtual} t={t} dur={atual.dur} fps={fps} restante={restante} ocultarRelogio={oculta} />;
  if (!emTransicao) return <AbsoluteFill>{nova()}</AbsoluteFill>;

  const telaAnt = anterior ? layoutDe(anterior.id) : null;
  const velha = (oculta = false, palco = 0) =>
    anterior && telaAnt ? <Tela tela={telaAnt} t={frame - anterior.inicio} dur={anterior.dur} fps={fps} restante={restante} ocultarRelogio={oculta} palco={palco} /> : <AbsoluteFill style={{ background: COR.azul }} />;

  if (tipo === "A")
    return (
      <AbsoluteFill>
        {velha()}
        <OndaDeCelulas t={t}>{nova()}</OndaDeCelulas>
      </AbsoluteFill>
    );

  if (tipo === "D") {
    const cresce = interpolate(t, [0, 16], [0, 1], { ...cl, easing: MEIO });
    if (t < 16) return <AbsoluteFill>{velha(false, cresce)}</AbsoluteFill>;
    return <AbsoluteFill>{nova()}</AbsoluteFill>;
  }

  // B + C
  const p = t / DUR.B;
  const x = interpolate(p, [0, 1], [-400, 1920 + 400], { ...cl, easing: MEIO });
  return (
    <AbsoluteFill>
      {velha(true)}
      <AbsoluteFill style={{ clipPath: `inset(0 ${Math.max(0, 1920 - x)}px 0 0)` }}>{nova(true)}</AbsoluteFill>
      <FaixaCacos x={x} />
      {telaAnt ? <RelogioViajante de={telaAnt} para={telaAtual} p={p} restante={restante} fps={fps} /> : null}
    </AbsoluteFill>
  );
};

/** Fase 2: 5 min só com o logo; a tela de buffer entra pela onda de células e os cacos respiram. */
export const Fase2: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const buffer = TELAS.buffer;
  const fim = TELAS.r1;
  const nova = <Tela tela={buffer} t={frame + 40} dur={total} fps={fps} restante={0} />;
  if (frame >= DUR.A) return <AbsoluteFill>{nova}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      <Tela tela={fim} t={9999} dur={9999} fps={fps} restante={0} />
      <OndaDeCelulas t={frame}>{nova}</OndaDeCelulas>
    </AbsoluteFill>
  );
};

export const VinhetaSemana: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f1 = framesFase1(fps);
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <EstiloTexto />
      {frame < f1 ? <Fase1 total={f1} /> : <FaseDois inicio={f1} />}
    </AbsoluteFill>
  );
};

const FaseDois: React.FC<{ inicio: number }> = ({ inicio }) => {
  const { fps } = useVideoConfig();
  // Fase 2 com o próprio tempo local
  return <Desloca by={inicio}><Fase2 total={framesFase2(fps)} /></Desloca>;
};

/** Desloca o tempo dos filhos. */
const Desloca: React.FC<{ by: number; children: React.ReactNode }> = ({ by, children }) => (
  <Sequence from={by} layout="none">
    {children}
  </Sequence>
);

/** Prévia de revisão: começo da vinheta, uma volta inteira + a primeira tela da volta seguinte. */
export const PreviaVolta: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <EstiloTexto />
      <Fase1 total={framesFase1(fps)} />
    </AbsoluteFill>
  );
};

/** Prévia do fechamento: últimos 20s da Fase 1 + 10s do buffer. */
export const PreviaFechamento: React.FC = () => {
  const { fps } = useVideoConfig();
  const f1 = framesFase1(fps);
  const ini = f1 - Math.round(20 * fps);
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <EstiloTexto />
      <Sequence from={-ini} layout="none">
        <VinhetaSemana />
      </Sequence>
    </AbsoluteFill>
  );
};

export const duracaoVolta = (fps: number) => VOLTA.reduce((a, v) => a + Math.round(v.seg * fps), 0) + Math.round(12 * fps);
