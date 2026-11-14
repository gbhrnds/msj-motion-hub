import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { WiggleShape } from "../motion/WiggleShape";
import { fontFamily } from "../fonts";
import tokens from "../../brand/tokens.json";

type TelaAguardeProps = {
  titulo: string;
  mostrarLogoMsj?: boolean;
  variante?: "clara" | "escura";
};

export const TelaAguarde: React.FC<TelaAguardeProps> = ({
  titulo,
  mostrarLogoMsj = true,
  variante = "escura",
}) => {
  const isEscura = variante === "escura";
  const bgColor = isEscura ? tokens.colors.azulAgibank.hex : "#F3F3F3";
  const textColor = isEscura ? tokens.colors.branco.hex : tokens.colors.azulAgibank.hex;
  const logoFile = isEscura ? "logo-msj-negative.svg" : "logo-msj-positive.svg";

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* grafismo decorativo secundario, com wiggle sutil */}
      <WiggleShape amplitudeDeg={2} amplitudePx={6}>
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 80,
            width: 140,
            height: 140,
            background: tokens.colors.verde.hex,
            clipPath: "polygon(0 0, 100% 20%, 60% 100%)",
          }}
        />
      </WiggleShape>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <TextReveal>
          <h1
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: tokens.typography.typeScaleVideo.titulo.sizePx,
              color: textColor,
              textAlign: "center",
              maxWidth: "70%",
              margin: 0,
            }}
          >
            {titulo}
          </h1>
        </TextReveal>

        {mostrarLogoMsj && (
          <div style={{ marginTop: 48 }}>
            <Img
              src={staticFile(`brand/logos/${logoFile}`)}
              style={{ height: 80 }}
            />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
