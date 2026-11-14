import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { Grafismo } from "../motion/Grafismo";
import { BrandShape } from "../brand/BrandShape";
import { Logo } from "../brand/Logo";
import { Icone } from "../brand/Icone";
import { cor, motionTokens, raio } from "../brand/theme";
import { fontFamily } from "../fonts";

type TelaDestaquesProps = {
  chamada: string;
  fechamento?: string;
  nomes: string[];
  logos: string[];
  icone?: string;
  duracaoFrames: number;
};

const COLUNAS = 4;
const ALTURA_LINHA = 60;
// Módulo branco que segura os nomes (margens dentro da safe area)
const LINHAS_VISIVEIS = 8;
// Janela = múltiplo exato da linha: no início e no fim nenhum nome aparece cortado.
const JANELA = LINHAS_VISIVEIS * ALTURA_LINHA;
const MOD = { x: 140, y: 386, largura: 1640, padX: 48, padY: 24, altura: JANELA + 48 };

/**
 * Destaques do Ciclo: os nomes correm como créditos de filme em 4 colunas,
 * dentro de um módulo branco. Ordem alfabética lida linha a linha.
 * Começa com o módulo cheio, pausa, rola com ease-in-out e termina cheio com
 * a última linha visível — todos os nomes ficam vários segundos na tela.
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
  const sc = motionTokens.scrollCreditos;

  const linhas = Math.ceil(nomes.length / COLUNAS);
  const alturaLista = linhas * ALTURA_LINHA;
  const percurso = Math.max(0, alturaLista - JANELA);
  const inicio = Math.round(sc.pausaInicialSegundos * fps);
  const fim = duracaoFrames - Math.round(sc.pausaFinalSegundos * fps);
  const scrollY = interpolate(frame, [inicio, fim], [0, -percurso], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: cor.azul }}>
      {/* decoration */}
      <Grafismo x={1600} y={780} delayFrames={6} fase={0.8}>
        <BrandShape nome="pentagon-04" largura={460} cor={cor.azulMedio} rotacao={-18} />
      </Grafismo>
      <Grafismo x={1330} y={250} delayFrames={10} fase={2.2}>
        <BrandShape nome="triangle-09" largura={70} cor={cor.verde} rotacao={24} />
      </Grafismo>

      {/* static: logos do programa, canto superior direito */}
      <div
        style={{
          position: "absolute",
          top: 84,
          right: 140,
          display: "flex",
          alignItems: "center",
          gap: 56,
        }}
      >
        {logos.map((l, i) => (
          <TextReveal key={l} delayFrames={i * 3} distancia={0}>
            <Logo arquivo={l} versao="negativa" altura={i === 0 ? 112 : 92} />
          </TextReveal>
        ))}
      </div>

      {/* lead: chamada */}
      <TextReveal
        delayFrames={4}
        distancia={28}
        style={{ position: "absolute", left: 140, top: 228, width: 1120 }}
      >
        <h1
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 54,
            lineHeight: 1.12,
            color: cor.branco,
            margin: 0,
          }}
        >
          {chamada}
        </h1>
      </TextReveal>

      {/* support: módulo de nomes (uma entrada para o container inteiro) */}
      <Grafismo x={MOD.x} y={MOD.y} delayFrames={12} wiggle={false}>
        <div
          style={{
            width: MOD.largura,
            height: MOD.altura,
            backgroundColor: cor.branco,
            borderRadius: raio,
            padding: `${MOD.padY}px ${MOD.padX}px`,
            boxSizing: "border-box",
          }}
        >
          <div style={{ height: JANELA, overflow: "hidden" }}>
            <div
              style={{
                translate: `0px ${scrollY}px`,
                display: "grid",
                gridTemplateColumns: `repeat(${COLUNAS}, 1fr)`,
                gridAutoRows: ALTURA_LINHA,
                alignItems: "center",
                columnGap: 32,
              }}
            >
              {nomes.map((n) => (
                <div
                  key={n}
                  style={{
                    fontFamily,
                    fontWeight: 600,
                    fontSize: 30,
                    color: cor.azul,
                    whiteSpace: "nowrap",
                  }}
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Grafismo>

      {/* support: fechamento + ícone */}
      {fechamento && (
        <TextReveal
          delayFrames={20}
          distancia={16}
          style={{
            position: "absolute",
            left: 140,
            top: 930,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <span
            style={{ fontFamily, fontWeight: 700, fontSize: 44, color: cor.branco }}
          >
            {fechamento}
          </span>
          {icone && <Icone arquivo={icone} cor={cor.verde} tamanho={46} />}
        </TextReveal>
      )}
    </AbsoluteFill>
  );
};
