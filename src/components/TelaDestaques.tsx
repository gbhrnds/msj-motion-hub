import React from "react";
import { AbsoluteFill, Img, interpolate } from "remotion";
import { useCurrentFrame } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { WiggleShape } from "../motion/WiggleShape";
import { fontFamily } from "../fonts";
import tokens from "../../brand/tokens.json";

type TelaDestaquesProps = {
  subtitulo: string;
  nomes: string[];
  fechamento: string;
  logos: string[];
  icone?: string;
  duracaoFrames: number;
};

const COLUNAS = 4;
const ITEM_HEIGHT = 56;
const ITEM_GAP = 16;
const ROW_HEIGHT = ITEM_HEIGHT + ITEM_GAP;
const HEADER_HEIGHT = 220;
const FOOTER_HEIGHT = 110;
const PADDING = tokens.video.safeMarginPx.value;
const SCROLL_START_FRAME = 12;
const SCROLL_END_BUFFER_FRAMES = 40;

/**
 * Tela de Destaques: ~68 nomes não cabem lidos em 1 tela estática no tempo
 * padrão, então o grid vira 4 colunas em scroll vertical contínuo (créditos
 * de filme), do início ao fim da tela — a única exceção deliberada à regra
 * "nunca motion contínuo em texto" do tokens.json, combinada com o usuário.
 */
export const TelaDestaques: React.FC<TelaDestaquesProps> = ({
  subtitulo,
  nomes,
  fechamento,
  logos,
  icone,
  duracaoFrames,
}) => {
  const frame = useCurrentFrame();

  const namesPerCol = Math.ceil(nomes.length / COLUNAS);
  const columns = Array.from({ length: COLUNAS }, (_, i) =>
    nomes.slice(i * namesPerCol, (i + 1) * namesPerCol)
  );

  const scrollAreaHeight =
    tokens.video.resolution.height - PADDING * 2 - HEADER_HEIGHT - FOOTER_HEIGHT;
  const contentHeight = namesPerCol * ROW_HEIGHT;
  const scrollEndFrame = duracaoFrames - SCROLL_END_BUFFER_FRAMES;

  const translateY = interpolate(
    frame,
    [SCROLL_START_FRAME, scrollEndFrame],
    [scrollAreaHeight, -contentHeight],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.branco.hex,
        padding: PADDING,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TextReveal>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {logos.map((src) => (
            <Img key={src} src={src} style={{ height: 56 }} />
          ))}
        </div>
      </TextReveal>

      <TextReveal delayFrames={6}>
        <p
          style={{
            fontFamily,
            fontWeight: 500,
            fontSize: tokens.typography.typeScaleVideo.subtitulo.sizePx,
            color: tokens.colors.azulEscuro.hex,
            maxWidth: "70%",
            margin: "16px 0 0",
          }}
        >
          {subtitulo}
        </p>
      </TextReveal>

      <div
        style={{
          position: "relative",
          height: scrollAreaHeight,
          marginTop: 24,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "row",
            gap: 32,
            transform: `translateY(${translateY}px)`,
          }}
        >
          {columns.map((coluna, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: ITEM_GAP,
              }}
            >
              {coluna.map((nome) => (
                <div
                  key={nome}
                  style={{
                    height: ITEM_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    background: tokens.colors.azulAgibank.hex,
                    color: tokens.colors.branco.hex,
                    borderRadius: tokens.shapes.cornerRadiusPxRange.default,
                    padding: "0 20px",
                    fontFamily,
                    fontWeight: 400,
                    fontSize: 24,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {nome}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <TextReveal delayFrames={scrollEndFrame}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 16,
          }}
        >
          <p
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 32,
              color: tokens.colors.azulAgibank.hex,
              margin: 0,
            }}
          >
            {fechamento}
          </p>
          {icone && <Img src={icone} style={{ height: 32 }} />}
        </div>
      </TextReveal>

      <WiggleShape>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            width: 100,
            height: 100,
            background: tokens.colors.amarelo.hex,
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
        />
      </WiggleShape>
    </AbsoluteFill>
  );
};
