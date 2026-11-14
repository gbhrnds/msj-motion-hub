import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CamadaGrafismos } from "../motion/CamadaGrafismos";
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
const JANELA = { x: 160, y: 250, largura: 1600, altura: 710 };
const FADE_BORDA = 70;
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
// Todas as formas ficam nas bordas, fora de logos, frases e da janela de nomes.
const FORMAS: GrafismoSpec[] = [
  {
    id: "y1",
    nome: "triangle-06",
    x: -70,
    y: 880,
    largura: 200,
    cor: cor.amarelo,
    rotacao: 10,
    delayFrames: 2,
    fase: 0.3,
  },
  {
    id: "b1",
    nome: "quadrilateral-20",
    x: 1800,
    y: 760,
    largura: 120,
    cor: cor.azul,
    rotacao: -8,
    delayFrames: 6,
    fase: 1.1,
  },
  {
    id: "y2",
    nome: "quadrilateral-07",
    x: 620,
    y: -40,
    largura: 220,
    cor: cor.amarelo,
    rotacao: 6,
    delayFrames: 4,
    fase: 2.0,
  },
  {
    id: "y3",
    nome: "triangle-03",
    x: 1810,
    y: 360,
    largura: 90,
    cor: cor.amarelo,
    rotacao: 16,
    delayFrames: 9,
    fase: 2.9,
  },
  {
    id: "y4",
    nome: "pentagon-02",
    x: 30,
    y: 400,
    largura: 90,
    cor: cor.amarelo,
    modo: "outline",
    rotacao: -12,
    delayFrames: 11,
    fase: 3.6,
  },
  {
    id: "b2",
    nome: "triangle-10",
    x: 980,
    y: 990,
    largura: 110,
    cor: cor.azul,
    rotacao: -12,
    delayFrames: 8,
    fase: 4.4,
  },
  {
    id: "y5",
    nome: "pentagon-07",
    x: 1500,
    y: 985,
    largura: 260,
    cor: cor.amarelo,
    rotacao: 4,
    delayFrames: 12,
    fase: 5.2,
  },
];

const ZONAS: ZonaLivre[] = [
  { id: "nomes", ...JANELA },
  { id: "logos-canto", x: 1250, y: 60, largura: 560, altura: 120 },
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
    [JANELA.y + JANELA.altura, JANELA.y - linhas * LINHA],
    clamp,
  );
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
          opacity: entrada,
          scale: String(mover(0.96, 1, entrada) * (h / cfg.centro.h)),
        }}
      >
        <Logo arquivo={arquivo} versao="positiva" altura={cfg.centro.h} />
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: cor.cinzaClaro }}>
      <CamadaGrafismos
        tela="tela_destaques"
        formas={FORMAS}
        zonasLivres={ZONAS}
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
          {chamada.replace(/se destaca!$/, "")}
          {chamada.endsWith("se destaca!") && (
            <span style={{ fontWeight: 700 }}>se destaca!</span>
          )}
        </div>
      )}

      {/* Ato 3 — créditos */}
      {frame >= s(T.nomesInicio) && frame < fimNomes && (
        <div
          style={{
            position: "absolute",
            left: JANELA.x,
            top: 0,
            width: JANELA.largura,
            display: "grid",
            gridTemplateColumns: `repeat(${COLUNAS}, 1fr)`,
            translate: `0px ${topoLista}px`,
          }}
        >
          {nomes.map((n, i) => {
            const y = topoLista + Math.floor(i / COLUNAS) * LINHA + LINHA / 2;
            const op = Math.min(
              interpolate(y, [JANELA.y, JANELA.y + FADE_BORDA], [0, 1], clamp),
              interpolate(
                y,
                [
                  JANELA.y + JANELA.altura - FADE_BORDA,
                  JANELA.y + JANELA.altura,
                ],
                [1, 0],
                clamp,
              ),
            );
            return (
              <div
                key={n}
                style={{
                  height: LINHA,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily,
                  fontWeight: 600,
                  fontSize: 30,
                  color: cor.azul,
                  whiteSpace: "nowrap",
                  opacity: op,
                }}
              >
                {n}
              </div>
            );
          })}
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
              {fechamento}
            </span>
            {icone && (
              <div style={{ scale: String(escalaCoracao) }}>
                <Icone arquivo={icone} cor={cor.azul} tamanho={76} />
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
