import React from "react";
import { AbsoluteFill } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { CamadaGrafismos } from "../motion/CamadaGrafismos";
import { Logo } from "../brand/Logo";
import { cor } from "../brand/theme";
import { girar180, GrafismoSpec, ZonaLivre } from "../brand/grafismos";
import { fontFamily } from "../fonts";

type TelaAguardeProps = {
  id: string;
  titulo: string;
  variante: "azul" | "cinza";
  /** Caminho do logo MSJ (manifest). Ausente = tela sem logo (decisão aprovada). */
  logoMsj?: string;
  /** Gira o conjunto de grafismos 180° (rotação permitida) nas repetições. */
  girarGrafismos?: boolean;
  duracaoFrames: number;
};

const LOGO_ALT = 86;

// Moldura: outline que se desenha em volta da frase (padrão Outubro/2026).
const moldura = (c: string): GrafismoSpec => ({
  id: "moldura",
  nome: "quadrilateral-07",
  x: 960 - 620,
  y: 540 - 330,
  largura: 1240,
  cor: c,
  desenhar: true,
  moldura: true,
});

export const FORMAS_AZUL: GrafismoSpec[] = [
  moldura(cor.verde),
  {
    id: "a1",
    nome: "pentagon-03",
    x: 1660,
    y: 560,
    largura: 150,
    cor: cor.azulMedio,
    rotacao: 12,
    delayFrames: 2,
    fase: 0.4,
  },
  {
    id: "a2",
    nome: "triangle-02",
    x: 1700,
    y: 260,
    largura: 70,
    cor: cor.branco,
    rotacao: -10,
    delayFrames: 8,
    fase: 1.6,
  },
  {
    id: "a3",
    nome: "quadrilateral-05",
    x: 520,
    y: 880,
    largura: 50,
    cor: cor.verde,
    rotacao: 20,
    delayFrames: 10,
    fase: 2.8,
  },
  {
    id: "a4",
    nome: "triangle-05",
    x: 110,
    y: 420,
    largura: 110,
    cor: cor.azulMedio,
    rotacao: 8,
    delayFrames: 4,
    fase: 3.7,
  },
];

export const FORMAS_CINZA: GrafismoSpec[] = [
  moldura(cor.verde),
  {
    id: "c1",
    nome: "pentagon-06",
    x: 120,
    y: 790,
    largura: 170,
    cor: cor.azul,
    rotacao: -10,
    delayFrames: 2,
    fase: 0.4,
  },
  {
    id: "c2",
    nome: "quadrilateral-17",
    x: 1700,
    y: 280,
    largura: 80,
    cor: cor.azulMedio,
    rotacao: 14,
    delayFrames: 6,
    fase: 1.5,
  },
  {
    id: "c3",
    nome: "triangle-09",
    x: 1740,
    y: 600,
    largura: 60,
    cor: cor.azul,
    rotacao: -18,
    delayFrames: 10,
    fase: 2.6,
  },
];

export const zonasAguarde = (comLogo: boolean): ZonaLivre[] => [
  { id: "frase", x: 360, y: 490, largura: 1200, altura: 100 },
  ...(comLogo
    ? [{ id: "logo", x: 960 - 150, y: 616, largura: 300, altura: LOGO_ALT }]
    : []),
];

/** Últimas 2 palavras em Bold (pesos misturados, padrão Outubro). Texto intacto. */
const comDestaque = (t: string) => {
  const p = t.split(" ");
  return [p.slice(0, -2).join(" "), p.slice(-2).join(" ")];
};

/**
 * Tela de respiro no padrão da vinheta de Outubro: uma frase, outline se
 * desenhando ao redor, logo MSJ discreto e poucos grafismos nas bordas.
 */
export const TelaAguarde: React.FC<TelaAguardeProps> = ({
  id,
  titulo,
  variante,
  logoMsj,
  girarGrafismos = false,
  duracaoFrames,
}) => {
  const azul = variante === "azul";
  const base = azul ? FORMAS_AZUL : FORMAS_CINZA;
  const formas = girarGrafismos ? base.map(girar180) : base;
  const zonas = zonasAguarde(Boolean(logoMsj));
  const [inicio, destaque] = comDestaque(titulo);

  return (
    <AbsoluteFill style={{ backgroundColor: azul ? cor.azul : cor.cinzaClaro }}>
      <CamadaGrafismos
        tela={id}
        formas={formas}
        zonasLivres={zonas}
        duracaoFrames={duracaoFrames}
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <TextReveal delayFrames={6} distancia={20}>
          <h1
            style={{
              fontFamily,
              fontWeight: 400,
              fontSize: 60,
              lineHeight: 1.1,
              color: azul ? cor.branco : cor.azul,
              textAlign: "center",
              margin: 0,
            }}
          >
            {inicio} <span style={{ fontWeight: 700 }}>{destaque}</span>
          </h1>
        </TextReveal>
      </AbsoluteFill>

      {logoMsj && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 616,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextReveal delayFrames={16} distancia={0}>
            <Logo
              arquivo={logoMsj}
              versao={azul ? "negativa" : "positiva"}
              altura={LOGO_ALT}
            />
          </TextReveal>
        </div>
      )}
    </AbsoluteFill>
  );
};
