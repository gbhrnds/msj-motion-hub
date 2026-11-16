import { useRefinado } from "../motion/estilo";
import React from "react";
import { quebraBoa } from "../brand/quebraDeLinha";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GrafismosPorAto } from "../motion/GrafismosPorAto";
import { Logo } from "../brand/Logo";
import { Icone } from "../brand/Icone";
import { cor, motionTokens } from "../brand/theme";
import type { GrafismoSpec, ZonaLivre } from "../brand/grafismos";
import { fontFamily } from "../fonts";

type TelaDestaquesProps = {
  chamada: string;
  fechamento?: string;
  nomes: string[];
  /** [logo destaques do ciclo, logo o jeito agi] — ordem do roteiro. */
  logos: string[];
  icone?: string;
  duracaoFrames: number;
};

// ---- Roteiro de tempo (segundos) ------------------------------------------
const T = {
  jeitoEntra: 0,
  fraseEntra: 0.6,
  fraseSai: 4.4,
  jeitoParaCanto: 4.4,
  destaquesEntra: 5.0,
  destaquesParaCanto: 6.6,
  nomesInicio: 7.0,
  // fim dos nomes e entrada do fechamento são calculados a partir da duração
  fechamentoAntesDoFim: 3.0,
};

// ---- Layout -----------------------------------------------------------------
const COLUNAS = 4;
const LINHA = 56;
const JANELA = { x: 260, y: 250, largura: 1400, altura: 710 };
const CANTO_Y = 118;
const JEITO = {
  centro: { x: 960, y: 470, h: 150 },
  canto: { x: 1672, y: CANTO_Y, h: 72 },
  ratio: 1505.1 / 498.1,
};
const DESTAQUES = {
  centro: { x: 960, y: 540, h: 240 },
  canto: { x: 1412, y: CANTO_Y, h: 86 },
  ratio: 1635 / 683.9,
};

// Fundo cinza + azul e amarelo, amarelo predominante (exceção aprovada).
// Arranjos de cada ato ajustados no Figma (2026-11-14): formas grandes saindo
// pelos cantos, sempre longe de logos, frases e da janela de nomes.
const am = cor.amarelo;
const az = cor.azul;
export const FORMAS_ATO1: GrafismoSpec[] = [
  { id: "b1", nome: "quadrilateral-16", x: -166, y: 363, largura: 503, cor: am, rotacao: -167.3, sangra: true, fase: 1.1 },
  { id: "y1", nome: "triangle-02", x: 176, y: 321, largura: 80, cor: am, rotacao: 52.1, delayFrames: 4, fase: 0.3 },
  { id: "y2", nome: "quadrilateral-05", x: 1726, y: 642, largura: 82, cor: az, rotacao: -134.8, delayFrames: 6, fase: 2.0 },
  { id: "y3", nome: "pentagon-05", x: 1457, y: 755, largura: 557, cor: am, rotacao: -9.6, sangra: true, delayFrames: 2, fase: 2.9 },
];
export const FORMAS_ATO2: GrafismoSpec[] = [
  { id: "y1", nome: "triangle-02", x: 1486, y: 890, largura: 92, cor: am, rotacao: -7.6, fase: 0.3 },
  { id: "b1", nome: "quadrilateral-16", x: 1182, y: 947, largura: 334, cor: az, rotacao: 88.8, sangra: true, fase: 1.1 },
  { id: "y2", nome: "quadrilateral-05", x: 1280, y: 856, largura: 74, cor: am, rotacao: -134, fase: 2.0 },
  { id: "y3", nome: "pentagon-05", x: 1503, y: 875, largura: 526, cor: am, rotacao: -6.1, sangra: true, fase: 2.9 },
];
export const FORMAS_ATO3: GrafismoSpec[] = [
  { id: "n1", nome: "quadrilateral-05", x: 1622, y: 865, largura: 247, cor: am, rotacao: 39.9, sangra: true, fase: 0.6 },
  { id: "n2", nome: "pentagon-05", x: -250, y: 511, largura: 372, cor: am, rotacao: 0, sangra: true, delayFrames: 3, fase: 1.7 },
  { id: "n3", nome: "triangle-07", x: 39, y: 488, largura: 87, cor: am, rotacao: -166.4, delayFrames: 6, fase: 2.6 },
  { id: "n4", nome: "triangle-02", x: 1806, y: 837, largura: 70, cor: am, rotacao: -8.6, delayFrames: 8, fase: 3.4 },
];
export const FORMAS_ATO4: GrafismoSpec[] = [
  { id: "b1", nome: "quadrilateral-16", x: 347, y: 934, largura: 372, cor: am, rotacao: -167.3, sangra: true, fase: 1.1 },
  { id: "y1", nome: "triangle-02", x: 600, y: 903, largura: 59, cor: am, rotacao: 52.1, delayFrames: 4, fase: 0.3 },
  { id: "y2", nome: "quadrilateral-05", x: 1825, y: 370, largura: 82, cor: az, rotacao: -134.8, sangra: true, delayFrames: 6, fase: 2.0 },
  { id: "y3", nome: "pentagon-05", x: 1556, y: 483, largura: 557, cor: am, rotacao: -9.6, sangra: true, delayFrames: 2, fase: 2.9 },
];

const LOGOS_CANTO: ZonaLivre = { id: "logos-canto", x: 1300, y: 70, largura: 490, altura: 96 };
export const ZONAS_ATO1: ZonaLivre[] = [
  { id: "logo-jeito", x: 733, y: 395, largura: 454, altura: 150 },
  { id: "frase", x: 533, y: 600, largura: 855, altura: 125 },
];
export const ZONAS_ATO2: ZonaLivre[] = [
  { id: "logo-destaques", x: 673, y: 420, largura: 574, altura: 240 },
  LOGOS_CANTO,
];
export const ZONAS_ATO3: ZonaLivre[] = [{ id: "nomes", ...JANELA }, LOGOS_CANTO];
export const ZONAS_ATO4: ZonaLivre[] = [
  { id: "fechamento", x: 385, y: 497, largura: 1080, altura: 86 },
  LOGOS_CANTO,
];

const mover = (a: number, b: number, p: number) => a + (b - a) * p;

/**
 * Destaques do Ciclo em 4 atos:
 * 1) logo "O jeito agi | Crescer na jornada" + frase;
 * 2) logo Destaques do Ciclo no centro;
 * 3) os dois logos vão para o canto e os nomes sobem como créditos (4 colunas);
 * 4) quando o último nome sai, entra o fechamento com o coração pulsando.
 */
export const TelaDestaques: React.FC<TelaDestaquesProps> = ({
  chamada,
  fechamento,
  nomes,
  logos,
  icone,
  duracaoFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (seg: number) => Math.round(seg * fps);
  const t = frame / fps;
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;
  const [bx1, by1, bx2, by2] = motionTokens.movimentoEmTela.easingBezier;
  const easeMov = Easing.bezier(bx1, by1, bx2, by2);
  const easeEntra = Easing.bezier(0.23, 1, 0.32, 1);
  const durMov = motionTokens.movimentoEmTela.durationFrames;

  const [logoDestaques, logoJeito] = logos;
  const fimNomes = duracaoFrames - s(T.fechamentoAntesDoFim);

  // --- Logo O jeito agi
  const refinado = useRefinado();
  const jeitoIn = interpolate(
    frame,
    [s(T.jeitoEntra), s(T.jeitoEntra) + 20],
    [0, 1],
    { ...clamp, easing: easeEntra },
  );
  const jeitoMov = interpolate(
    frame,
    [s(T.jeitoParaCanto), s(T.jeitoParaCanto) + durMov],
    [0, 1],
    { ...clamp, easing: easeMov },
  );
  // --- Frase
  const fraseIn = interpolate(
    frame,
    [s(T.fraseEntra), s(T.fraseEntra) + 18],
    [0, 1],
    { ...clamp, easing: easeEntra },
  );
  const fraseOut = interpolate(
    frame,
    [s(T.fraseSai), s(T.fraseSai) + 12],
    [0, 1],
    { ...clamp, easing: Easing.in(Easing.cubic) },
  );
  // --- Logo Destaques
  const destIn = interpolate(
    frame,
    [s(T.destaquesEntra), s(T.destaquesEntra) + 20],
    [0, 1],
    { ...clamp, easing: easeEntra },
  );
  const destMov = interpolate(
    frame,
    [s(T.destaquesParaCanto), s(T.destaquesParaCanto) + durMov],
    [0, 1],
    { ...clamp, easing: easeMov },
  );
  // --- Créditos: sobem em velocidade constante (movimento contínuo = linear)
  const linhas = Math.ceil(nomes.length / COLUNAS);
  const topoLista = interpolate(
    frame,
    [s(T.nomesInicio), fimNomes],
    [JANELA.y + JANELA.altura - LINHA, JANELA.y - linhas * LINHA],
    clamp,
  );
  // cada linha é revelada (sobe por máscara) ao passar pela base da janela
  const REVELA = JANELA.y + JANELA.altura - LINHA * 0.5;
  // --- Fechamento
  const fechIn = interpolate(frame, [fimNomes, fimNomes + 18], [0, 1], {
    ...clamp,
    easing: easeEntra,
  });
  const pulso = motionTokens.coracaoPulso;
  const batida = Math.pow(
    Math.max(0, Math.sin(2 * Math.PI * pulso.batidasPorSegundo * t)),
    6,
  );
  const escalaCoracao = 1 + (pulso.escalaMax - 1) * batida;

  const logoEmMovimento = (
    arquivo: string,
    cfg: typeof JEITO,
    entrada: number,
    mov: number,
  ) => {
    const h = mover(cfg.centro.h, cfg.canto.h, mov);
    return (
      <div
        style={{
          position: "absolute",
          left: mover(cfg.centro.x, cfg.canto.x, mov),
          top: mover(cfg.centro.y, cfg.canto.y, mov),
          translate: "-50% -50%",
          ...(refinado ? { clipPath: `inset(${(1 - entrada) * 100}% 0 0 0)` } : { opacity: entrada }),
          scale: String(mover(0.96, 1, entrada) * (h / cfg.centro.h)),
        }}
      >
        <Logo arquivo={arquivo} versao="positiva" altura={cfg.centro.h} />
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: cor.cinzaClaro }}>
      <GrafismosPorAto
        tela="tela_destaques"
        atos={[
          { inicio: 0, formas: FORMAS_ATO1, zonas: ZONAS_ATO1 },
          { inicio: s(T.jeitoParaCanto), formas: FORMAS_ATO2, zonas: ZONAS_ATO2 },
          { inicio: s(T.destaquesParaCanto), formas: FORMAS_ATO3, zonas: ZONAS_ATO3 },
          { inicio: fimNomes, formas: FORMAS_ATO4, zonas: ZONAS_ATO4 },
        ]}
      />

      {/* Ato 1 — frase (Regular + destaque Bold no final) */}
      {frame < s(T.fraseSai) + 12 && (
        <div
          style={{
            position: "absolute",
            left: 310,
            width: 1300,
            top: 600,
            textAlign: "center",
            opacity: fraseIn * (1 - fraseOut),
            translate: `0px ${(1 - fraseIn) * 20 - fraseOut * 16}px`,
            fontFamily,
            fontSize: 52,
            lineHeight: 1.2,
            color: cor.azul,
            fontWeight: 400,
            textWrap: "balance",
          }}
        >
          {(() => {
            const q = quebraBoa(chamada);
            const d = "se destaca!";
            const n = chamada.endsWith(d) ? q.length - d.length : q.length;
            return (
              <>
                {q.slice(0, n)}
                {n < q.length && (
                  <span style={{ fontWeight: 700 }}>{q.slice(n)}</span>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Ato 3 — créditos */}
      {frame >= s(T.nomesInicio) && frame < fimNomes && (
        // créditos: sem fade nas bordas, a janela corta; as linhas aparecem uma a uma
        <div style={{ position: "absolute", left: JANELA.x, top: JANELA.y, width: JANELA.largura, height: JANELA.altura, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: JANELA.largura,
              display: "grid",
              gridTemplateColumns: `repeat(${COLUNAS}, 1fr)`,
              translate: `0px ${topoLista - JANELA.y}px`,
            }}
          >
            {nomes.map((n, i) => {
              const yLinha = topoLista + Math.floor(i / COLUNAS) * LINHA;
              const v = easeEntra(interpolate(REVELA - yLinha, [0, LINHA * 1.4], [0, 1], clamp));
              return (
                <div
                  key={n}
                  style={{
                    height: LINHA,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily,
                    fontWeight: 300,
                    fontSize: 28,
                    color: cor.azul,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ translate: `0 ${(1 - v) * LINHA}px` }}>{n}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Logos (ato 1 → canto; ato 2 → canto) */}
      {logoJeito && logoEmMovimento(logoJeito, JEITO, jeitoIn, jeitoMov)}
      {logoDestaques &&
        frame >= s(T.destaquesEntra) &&
        logoEmMovimento(logoDestaques, DESTAQUES, destIn, destMov)}

      {/* Ato 4 — fechamento */}
      {fechamento && frame >= fimNomes && (
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              opacity: fechIn,
              translate: `0px ${(1 - fechIn) * 24}px`,
            }}
          >
            <span
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: 72,
                color: cor.azul,
              }}
            >
              {quebraBoa(fechamento)}
            </span>
            {icone && (
              <div style={{ scale: String(escalaCoracao) }}>
                <Icone arquivo={icone} cor={cor.amarelo} tamanho={76} />
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
