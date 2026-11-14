import React from "react";
import { AbsoluteFill } from "remotion";
import { TextReveal } from "../motion/TextReveal";
import { Grafismo } from "../motion/Grafismo";
import { TrocaDeForma } from "../motion/TrocaDeForma";
import { BrandShape } from "../brand/BrandShape";
import { Logo } from "../brand/Logo";
import { cor, tipo } from "../brand/theme";
import { fontFamily } from "../fonts";

type TelaAguardeProps = {
  titulo: string;
  variante: "azul" | "cinza";
  /** Caminho do logo MSJ (manifest). Ausente = tela sem logo (decisão aprovada). */
  logoMsj?: string;
  /** Gira os grafismos 180° (rotação permitida pelo Brandbook) para as repetições não ficarem iguais, sem invadir a zona do contador. */
  espelharGrafismos?: boolean;
};

/**
 * Tela de respiro. Azul: texto branco, grafismos branco/verde/azul médio.
 * Cinza (#F3F3F3, exceção aprovada): texto em azul Agibank (decisão do usuário),
 * grafismos em proporção do Brandbook — azul predominante, azul médio de apoio,
 * verde como acento.
 */
export const TelaAguarde: React.FC<TelaAguardeProps> = ({
  titulo,
  variante,
  logoMsj,
  espelharGrafismos = false,
}) => {
  const azul = variante === "azul";

  return (
    <AbsoluteFill style={{ backgroundColor: azul ? cor.azul : cor.cinzaClaro }}>
      <AbsoluteFill style={{ scale: espelharGrafismos ? "-1 -1" : undefined }}>
        {azul ? (
          <>
            <Grafismo x={-150} y={700} delayFrames={2} fase={0.5}>
              <BrandShape nome="pentagon-02" largura={500} cor={cor.azulMedio} rotacao={-24} />
            </Grafismo>
            <Grafismo x={1460} y={-110} delayFrames={6} wiggle={false}>
              <TrocaDeForma
                formas={["quadrilateral-03", "pentagon-06", "quadrilateral-12"]}
                largura={520}
                cor={cor.verde}
                rotacaoInicial={10}
              />
            </Grafismo>
            <Grafismo x={1600} y={560} delayFrames={10} fase={2}>
              <BrandShape nome="triangle-07" largura={150} cor={cor.branco} rotacao={30} />
            </Grafismo>
            <Grafismo x={420} y={190} delayFrames={12} fase={3.1}>
              <BrandShape nome="triangle-02" largura={70} cor={cor.verde} rotacao={-15} />
            </Grafismo>
          </>
        ) : (
          <>
            <Grafismo x={-190} y={640} delayFrames={2} fase={0.5}>
              <BrandShape nome="pentagon-06" largura={640} cor={cor.azul} rotacao={-14} />
            </Grafismo>
            <Grafismo x={1530} y={-140} delayFrames={6} fase={1.7}>
              <BrandShape nome="quadrilateral-18" largura={460} cor={cor.azulMedio} rotacao={22} />
            </Grafismo>
            <Grafismo x={1560} y={380} delayFrames={8} wiggle={false}>
              <TrocaDeForma
                formas={["pentagon-03", "quadrilateral-23", "pentagon-01"]}
                largura={460}
                cor={cor.verde}
                rotacaoInicial={-6}
              />
            </Grafismo>
            <Grafismo x={430} y={230} delayFrames={12} fase={2.6}>
              <BrandShape nome="triangle-05" largura={80} cor={cor.azul} rotacao={12} />
            </Grafismo>
          </>
        )}
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <TextReveal delayFrames={4} distancia={32}>
          <h1
            style={{
              fontFamily,
              fontWeight: 800,
              fontSize: 96,
              lineHeight: tipo.titulo.lineHeight,
              color: azul ? cor.branco : cor.azul,
              textAlign: "center",
              maxWidth: 1100,
              margin: 0,
              letterSpacing: -1,
            }}
          >
            {titulo}
          </h1>
        </TextReveal>

        {logoMsj && (
          <TextReveal delayFrames={14} distancia={0} style={{ marginTop: 64 }}>
            <Logo arquivo={logoMsj} versao={azul ? "negativa" : "positiva"} altura={96} />
          </TextReveal>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
