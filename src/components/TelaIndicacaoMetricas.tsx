import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { Grafismo } from "../motion/Grafismo";
import { CamadaGrafismos } from "../motion/CamadaGrafismos";
import type { GrafismoSpec, ZonaLivre } from "../brand/grafismos";
import { Logo } from "../brand/Logo";
import { cor, raio } from "../brand/theme";
import { fontFamily } from "../fonts";

type TelaIndicacaoMetricasProps = {
  corpo: string;
  bullets: string[];
  foto: string;
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

// Forma interagindo com a borda da foto (Brandbook p.48) + acento no rodapé.
export const FORMAS: GrafismoSpec[] = [
  {
    id: "i1",
    nome: "triangle-01",
    x: 580,
    y: 96,
    largura: 80,
    cor: cor.verde,
    rotacao: -32,
    delayFrames: 10,
    fase: 1.4,
  },
];
export const ZONAS: ZonaLivre[] = [
  { id: "foto", x: 1000, y: 80, largura: 780, altura: 920 },
  { id: "logo", x: 140, y: 236, largura: 360, altura: 118 },
  { id: "corpo", x: 140, y: 404, largura: 780, altura: 200 },
  { id: "metricas", x: 140, y: 640, largura: 760, altura: 340 },
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
  logo,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: cor.azul }}>
      {/* módulo de foto */}
      <Grafismo x={1000} y={80} delayFrames={0} wiggle={false}>
        <div
          style={{
            width: 780,
            height: 920,
            borderRadius: raio,
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile(foto)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </Grafismo>
      {/* forma interagindo com a foto (Brandbook p.48) */}
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
            fontWeight: 500,
            fontSize: 44,
            lineHeight: 1.2,
            color: cor.branco,
            margin: 0,
          }}
        >
          {corpo}
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
                  padding: "30px 26px",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
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
                  {rotulo}
                </div>
              </div>
            </TextReveal>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
