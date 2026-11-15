import React from "react";
import { quebraBoa } from "../brand/quebraDeLinha";
import { AbsoluteFill } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { CamadaGrafismos } from "../motion/CamadaGrafismos";
import type { GrafismoSpec, ZonaLivre } from "../brand/grafismos";
import { BrandShape } from "../brand/BrandShape";
import { Logo } from "../brand/Logo";
import { cor } from "../brand/theme";
import { fontFamily } from "../fonts";

type TelaConteudoProps = {
  /** Parágrafo principal (lado azul). */
  corpo: string;
  /** Linha que abre a lista (lado branco). */
  chamadaLista?: string;
  bullets: string[];
  logo?: string;
};

// Ajustado no Figma (2026-11-14): dois módulos (azul + azul médio) separados por
// uma divisão diagonal, a partir do asset de módulos do Brandbook trazido pelo usuário.
const MODULOS = [
  {
    id: "modulo-01",
    x: 57.39,
    y: 54.89,
    cor: cor.azul,
    d: "M610.65 970.23L30.08 970.23C13.47 970.23 0 956.76 0 940.15L0 30.08C0 13.47 13.47 0 30.08 0L764.38 0C783 0 797.14 16.74 794.04 35.09L640.32 945.16C637.87 959.64 625.34 970.23 610.66 970.23Z",
  },
  {
    id: "modulo-02",
    x: 755.63,
    y: 54.88,
    cor: cor.azulMedio,
    d: "M183.81 0L1076.9 0C1093.51 0 1106.98 13.47 1106.98 30.08L1106.98 940.15C1106.98 956.76 1093.51 970.23 1076.9 970.23L30.09 970.23C11.47 970.23 -2.67 953.49 0.43 935.14L154.15 25.08C156.6 10.6 169.13 0.01 183.81 0.01Z",
  },
];
const STAGGER = [0, 4, 7, 10, 12, 14];

export const FORMAS: GrafismoSpec[] = [
  { id: "o3", nome: "triangle-08", x: 867, y: 106, largura: 70, cor: cor.amarelo, rotacao: -19.2, delayFrames: 14, fase: 3.4 },
];
export const ZONAS: ZonaLivre[] = [
  { id: "logo", x: 160, y: 324, largura: 245, altura: 74 },
  { id: "corpo", x: 160, y: 441, largura: 560, altura: 230 },
  { id: "lista", x: 1090, y: 300, largura: 720, altura: 480 },
];

/** Conteúdo em dois módulos com divisão diagonal (azul / azul médio). */
export const TelaConteudo: React.FC<TelaConteudoProps> = ({
  corpo,
  chamadaLista,
  bullets,
  logo,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: cor.branco }}>
      <TextReveal distancia={0} style={{ position: "absolute", inset: 0 }}>
        <svg width={1920} height={1080}>
          {MODULOS.map((m) => (
            <path
              key={m.id}
              data-camada={m.id}
              d={m.d}
              transform={`translate(${m.x} ${m.y})`}
              fill={m.cor}
            />
          ))}
        </svg>
      </TextReveal>

      <CamadaGrafismos
        tela="tela_conteudo"
        formas={FORMAS}
        zonasLivres={ZONAS}
      />

      {/* lado azul */}
      {logo && (
        <div style={{ position: "absolute", left: 160, top: 324 }}>
          <TextReveal distancia={0}>
            <Logo arquivo={logo} versao="negativa" altura={74} />
          </TextReveal>
        </div>
      )}
      <TextReveal
        delayFrames={6}
        distancia={28}
        style={{ position: "absolute", left: 160, top: 441, width: 560 }}
      >
        <p
          style={{
            fontFamily,
            fontWeight: 300,
            fontSize: 46,
            lineHeight: 1.2,
            color: cor.branco,
            margin: 0,
          }}
        >
          {quebraBoa(corpo)}
        </p>
      </TextReveal>

      {/* lado branco */}
      <div style={{ position: "absolute", left: 1090, top: 300, width: 720 }}>
        {chamadaLista && (
          <TextReveal delayFrames={12} distancia={20}>
            <h2
              style={{
                fontFamily,
                fontWeight: 700,
                fontSize: 48,
                lineHeight: 1.1,
                color: cor.verde,
                margin: "0 0 40px",
                maxWidth: 600,
              }}
            >
              {quebraBoa(chamadaLista)}
            </h2>
          </TextReveal>
        )}
        {bullets.map((b, i) => (
          <TextReveal
            key={b}
            delayFrames={18 + STAGGER[Math.min(i, STAGGER.length - 1)]}
            distancia={14}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                marginBottom: 26,
              }}
            >
              <BrandShape
                nome="triangle-06"
                largura={24}
                cor={cor.verde}
                rotacao={-90}
              />
              <span
                style={{
                  fontFamily,
                  fontWeight: 300,
                  fontSize: 38,
                  lineHeight: 1.2,
                  color: cor.branco,
                }}
              >
                {quebraBoa(b)}
              </span>
            </div>
          </TextReveal>
        ))}
      </div>
    </AbsoluteFill>
  );
};
