import React from "react";
import { quebraBoa } from "../brand/quebraDeLinha";
import { AbsoluteFill } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { CamadaGrafismos } from "../motion/CamadaGrafismos";
import { MorphPermitido } from "../motion/estilo";
import { Logo } from "../brand/Logo";
import { cor } from "../brand/theme";
import { girar180, GrafismoSpec, ZonaLivre } from "../brand/grafismos";
import { fontFamily } from "../fonts";

type TelaAguardeProps = {
  id: string;
  titulo: string;
  /** Trecho do título em Bold (vem do roteiro; o texto não muda). */
  destaque?: string;
  /** Cor do outline que se desenha em volta da frase. */
  corOutline: string;
  /** Caminho do logo MSJ (manifest). Ausente = tela sem logo (decisão aprovada). */
  logoMsj?: string;
  /** Gira o outline 180° (rotação permitida) nas repetições. */
  girarGrafismos?: boolean;
  duracaoFrames: number;
};

// Layout ajustado no Figma (2026-11-14): fundo cinza, um único outline
// atravessando a frase com máscara no texto, logo MSJ abaixo à direita.
const LOGO = { x: 1244, y: 750, altura: 110 };
export const MASCARA = { id: "frase", x: 691, y: 445, largura: 538, altura: 190 };

export const formasAguarde = (c: string): GrafismoSpec[] => [
  {
    id: "moldura",
    nome: "pentagon-03",
    x: 724,
    y: 289,
    largura: 471,
    cor: c,
    rotacao: 11.3,
    desenhar: true,
    moldura: true,
  },
];

export const zonasAguarde = (comLogo: boolean): ZonaLivre[] => [
  { id: "frase", x: 390, y: 500, largura: 1140, altura: 80 },
  ...(comLogo
    ? [{ id: "logo", x: LOGO.x, y: LOGO.y, largura: 376, altura: LOGO.altura }]
    : []),
];

/** Divide o título em [antes, destaque, depois] sem alterar o texto. */
const partes = (t: string, d?: string): [string, string, string] => {
  const q = quebraBoa(t); // mesmo comprimento: os índices continuam valendo
  const i = d ? t.indexOf(d) : -1;
  return i < 0 || !d
    ? [q, "", ""]
    : [q.slice(0, i), q.slice(i, i + d.length), q.slice(i + d.length)];
};

/** Tela de respiro: uma frase (Light + trecho Bold), outline se desenhando e logo MSJ. */
export const TelaAguarde: React.FC<TelaAguardeProps> = ({
  id,
  titulo,
  destaque,
  corOutline,
  logoMsj,
  girarGrafismos = false,
  duracaoFrames,
}) => {
  const base = formasAguarde(corOutline);
  const formas = girarGrafismos ? base.map(girar180) : base;
  const [antes, forte, depois] = partes(titulo, destaque);

  return (
    <MorphPermitido.Provider value>
    <AbsoluteFill style={{ backgroundColor: cor.cinzaClaro }}>
      <CamadaGrafismos
        tela={id}
        formas={formas}
        zonasLivres={zonasAguarde(Boolean(logoMsj))}
        duracaoFrames={duracaoFrames}
        mascaras={[{ ...MASCARA, cor: cor.cinzaClaro }]}
        coresMorph={[cor.azul, corOutline === cor.amarelo ? cor.verde : cor.amarelo]}
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <TextReveal delayFrames={6} distancia={20}>
          <h1
            style={{
              fontFamily,
              fontWeight: 300,
              fontSize: 60,
              lineHeight: 1.1,
              color: cor.azul,
              textAlign: "center",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            {antes}
            {forte && <span style={{ fontWeight: 700 }}>{forte}</span>}
            {depois}
          </h1>
        </TextReveal>
      </AbsoluteFill>

      {logoMsj && (
        <div style={{ position: "absolute", left: LOGO.x, top: LOGO.y }}>
          <TextReveal delayFrames={16} distancia={0}>
            <Logo arquivo={logoMsj} versao="positiva" altura={LOGO.altura} />
          </TextReveal>
        </div>
      )}
    </AbsoluteFill>
    </MorphPermitido.Provider>
  );
};
