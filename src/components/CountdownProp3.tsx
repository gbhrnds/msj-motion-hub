import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import shapesData from "../shapesData.json";
import { BrandShape } from "../brand/BrandShape";
import { Logo } from "../brand/Logo";
import { cor, strokeOutline } from "../brand/theme";
import { clamp, easeEntra, easeMove, Numero, SEGUNDOS_FINAIS, useContagem } from "./contagem/base";

type Props = { segundosNoInicio: number; logoMsj: string };

// Módulo compacto (cantos 14px, dentro da zona do contador 400×210)
const MOD = { x: 48, y: 40, w: 268, h: 104, r: 14 };
const DUR = 26; // frames: o módulo vira a tela inteira
const MOLDURA = { nome: "pentagon-01" as const, largura: 700 };

/**
 * Proposta 3 — Motion elegante (proposta minha).
 * - Compacto: módulo azul-escuro com o número branco; os dígitos rolam como um
 *   odômetro (só o dígito que mudou). Um traço verde fino percorre a borda do
 *   módulo e mede o minuto corrente.
 * - 10s finais: o próprio módulo cresce até virar a tela (container transform),
 *   o número vai para o centro e uma forma oficial em outline se desenha em
 *   volta dele, fechando exatamente no 00:00.
 * Lead: número. Support: módulo (carrega o número). Decoração: traço/outline e
 * duas formas pequenas (só fade + scale).
 */
export const CountdownProp3: React.FC<Props> = ({ segundosNoInicio, logoMsj }) => {
  const { frame, fps, restante, noSegundo, inicioFinal } = useContagem(segundosNoInicio);
  const p = easeMove(interpolate(frame, [inicioFinal, inicioFinal + DUR], [0, 1], clamp));
  const lerp = (a: number, b: number) => a + (b - a) * p;

  const x = lerp(MOD.x, 0);
  const y = lerp(MOD.y, 0);
  const w = lerp(MOD.w, 1920);
  const h = lerp(MOD.h, 1080);
  const r = lerp(MOD.r, 0);

  // traço do minuto: 0 → 1 a cada 60s (some quando o módulo começa a crescer)
  const noMinuto = ((segundosNoInicio - restante) % 60) / 60 + noSegundo / fps / 60;
  const perimetro = 2 * (MOD.w + MOD.h);
  const traco = 1 - p * 4;

  // outline final: desenha ao longo dos 10s e fecha no 00:00
  const desenho = interpolate(
    frame,
    [inicioFinal + DUR, inicioFinal + SEGUNDOS_FINAIS * fps],
    [0, 1],
    clamp,
  );
  const f = shapesData[MOLDURA.nome];
  const altMoldura = (MOLDURA.largura * f.h) / f.w;
  const pad = (strokeOutline * f.w) / MOLDURA.largura;

  const deco = (atraso: number) =>
    easeEntra(interpolate(frame, [inicioFinal + DUR + atraso, inicioFinal + DUR + atraso + 22], [0, 1], clamp));

  const tam = lerp(56, 230);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* módulo: compacto no canto → tela inteira */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: r,
          backgroundColor: cor.azulEscuro,
        }}
      />
      {traco > 0 && (
        <svg
          width={MOD.w + 8}
          height={MOD.h + 8}
          style={{ position: "absolute", left: MOD.x - 4, top: MOD.y - 4, opacity: traco }}
        >
          <rect
            x={4}
            y={4}
            width={MOD.w}
            height={MOD.h}
            rx={MOD.r}
            fill="none"
            stroke={cor.verde}
            strokeWidth={strokeOutline}
            strokeLinecap="round"
            pathLength={perimetro}
            strokeDasharray={`${noMinuto * perimetro} ${perimetro}`}
          />
        </svg>
      )}

      {/* outline oficial que se desenha em volta do número nos 10s finais */}
      {desenho > 0 && (
        <svg
          width={MOLDURA.largura}
          height={altMoldura}
          viewBox={`${-pad} ${-pad} ${f.w + pad * 2} ${f.h + pad * 2}`}
          style={{
            position: "absolute",
            left: 960 - MOLDURA.largura / 2,
            top: 540 - altMoldura / 2,
            overflow: "visible",
            rotate: "-4deg",
          }}
        >
          <path
            d={f.d}
            fill="none"
            stroke={cor.verde}
            strokeWidth={pad}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${desenho} 1.0001`}
          />
        </svg>
      )}
      {/* máscara do número sobre o outline */}
      {desenho > 0 && (
        <div
          style={{
            position: "absolute",
            left: 960 - 330,
            top: 540 - 130,
            width: 660,
            height: 260,
            backgroundColor: cor.azulEscuro,
          }}
        />
      )}

      {/* decoração: duas formas pequenas nos cantos */}
      {p > 0.99 && (
        <>
          <div style={{ position: "absolute", left: 1640, top: 150, opacity: deco(0), scale: String(0.95 + 0.05 * deco(0)) }}>
            <BrandShape nome="triangle-02" largura={80} cor={cor.amarelo} rotacao={12} />
          </div>
          <div style={{ position: "absolute", left: 180, top: 860, opacity: deco(6), scale: String(0.95 + 0.05 * deco(6)) }}>
            <BrandShape nome="quadrilateral-05" largura={56} cor={cor.azul} rotacao={-18} />
          </div>
          <div style={{ position: "absolute", right: 140, bottom: 110, opacity: deco(10) }}>
            <Logo arquivo={logoMsj} versao="negativa" altura={92} />
          </div>
        </>
      )}

      {/* número: centro do módulo, sempre */}
      <div
        style={{
          position: "absolute",
          left: x + w / 2,
          top: y + h / 2,
          translate: "-50% -50%",
        }}
      >
        <Numero segundos={restante} noSegundo={noSegundo} tamanho={tam} cor={cor.branco} rolar />
      </div>
    </AbsoluteFill>
  );
};
