import React from "react";
import { quebraBoa } from "../brand/quebraDeLinha";
import { AbsoluteFill } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { CamadaGrafismos } from "../motion/CamadaGrafismos";
import type { GrafismoSpec, ZonaLivre } from "../brand/grafismos";
import { Logo } from "../brand/Logo";
import { FotoNaForma } from "../brand/FotoNaForma";
import { cor, raio } from "../brand/theme";
import { fontFamily } from "../fonts";

type TelaIndicacaoMetricasProps = {
  corpo: string;
  bullets: string[];
  foto: string;
  /** PNG da pessoa recortada (mesmo enquadramento da foto), por cima da forma. */
  recorte?: string;
  logo: string;
};

// Cores dos módulos de métrica (Brandbook p.50 + contraste p.38)
const MODULOS = [
  { fundo: cor.branco, numero: cor.azul, rotulo: cor.azulEscuro },
  { fundo: cor.verde, numero: cor.azulEscuro, rotulo: cor.azulEscuro },
  { fundo: cor.azulMedio, numero: cor.branco, rotulo: cor.branco },
];

/** "10 ganhadores no 2º trimestre" → ["10", "ganhadores no 2º trimestre"] (texto intacto). */
const separar = (b: string): [string, string] => {
  const m = b.match(/^(\S+)\s+(.*)$/);
  return m ? [m[1], m[2]] : [b, ""];
};

const LARG_MOD = 240;

// Ajustado no Figma (2026-11-14): foto recortada pela forma pentagon-06 (sangrando
// à direita e embaixo), recorte da pessoa saindo da forma, forma verde grande no canto.
export const FOTO = {
  forma: "pentagon-06" as const,
  x: 960,
  y: 97,
  largura: 1040,
  // enquadramento da imagem (mesma escala para a foto e o recorte)
  imagem: { x: 595, y: 0, largura: 1620, altura: 1080 },
};
export const FORMAS: GrafismoSpec[] = [
  { id: "i1", nome: "triangle-01", x: 1094, y: 147, largura: 80, cor: cor.azulMedio, rotacao: -81.6, delayFrames: 10, fase: 1.4 },
  { id: "i2", nome: "quadrilateral-05", x: 1589, y: -168, largura: 398, cor: cor.verde, rotacao: -82.4, sangra: true, delayFrames: 4, fase: 0.5 },
];
export const ZONAS: ZonaLivre[] = [
  { id: "logo", x: 140, y: 236, largura: 360, altura: 118 },
  { id: "corpo", x: 140, y: 404, largura: 780, altura: 160 },
  { id: "metricas", x: 140, y: 660, largura: 756, altura: 300 },
];
const GAP_MOD = 18; // 7,5% do módulo (Brandbook p.52: 5–8%)

/**
 * Programa de Indicação — modelo da aplicação "evento" do Brandbook:
 * foto em módulo grande + métricas em módulos coloridos com número em destaque.
 */
export const TelaIndicacaoMetricas: React.FC<TelaIndicacaoMetricasProps> = ({
  corpo,
  bullets,
  foto,
  recorte,
  logo,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: cor.azul }}>
      <TextReveal distancia={0} style={{ position: "absolute", inset: 0 }}>
        <FotoNaForma {...FOTO} foto={foto} recorte={recorte} />
      </TextReveal>
      <CamadaGrafismos
        tela="tela_indicacao_metricas"
        formas={FORMAS}
        zonasLivres={ZONAS}
      />

      <div style={{ position: "absolute", left: 140, top: 236 }}>
        <TextReveal distancia={0}>
          <Logo arquivo={logo} versao="negativa" altura={118} />
        </TextReveal>
      </div>

      {/* lead */}
      <TextReveal
        delayFrames={6}
        distancia={28}
        style={{ position: "absolute", left: 140, top: 404, width: 780 }}
      >
        <p
          style={{
            fontFamily,
            fontWeight: 300,
            fontSize: 44,
            lineHeight: 1.2,
            color: cor.branco,
            margin: 0,
          }}
        >
          {quebraBoa(corpo)}
        </p>
      </TextReveal>

      {/* support: métricas — stagger com passos decrescentes */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 660,
          display: "flex",
          gap: GAP_MOD,
        }}
      >
        {bullets.map((b, i) => {
          const [numero, rotulo] = separar(b);
          const m = MODULOS[i % MODULOS.length];
          return (
            <TextReveal
              key={b}
              delayFrames={18 + [0, 4, 7][i % 3]}
              distancia={20}
            >
              <div
                style={{
                  width: LARG_MOD,
                  height: 300,
                  backgroundColor: m.fundo,
                  borderRadius: raio,
                  padding: "69px 20px 0",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 9,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily,
                    fontWeight: 800,
                    fontSize: 84,
                    lineHeight: 1,
                    color: m.numero,
                    letterSpacing: -2,
                  }}
                >
                  {numero}
                </div>
                <div
                  style={{
                    fontFamily,
                    fontWeight: 500,
                    fontSize: 28,
                    lineHeight: 1.2,
                    color: m.rotulo,
                  }}
                >
                  {quebraBoa(rotulo)}
                </div>
              </div>
            </TextReveal>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
