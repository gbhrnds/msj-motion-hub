import React, { useState } from "react";
import { z } from "zod";
import { AbsoluteFill, getRemotionEnvironment, useVideoConfig } from "remotion";
import { writeStaticFile } from "@remotion/studio";
import { conteudoDe, roteiro } from "../../dados";
import { contorno } from "../../brand/grafismos";
import { fontFamily } from "../../fonts";
import { TelaV1 } from "./V1NuDay";
import { ARQUIVO_LAYOUT_V1, LayoutV1Context, schemaLayoutV1, type LayoutV1 } from "./layoutV1";

/*
 * Editor da V1 dentro do Remotion Studio (substitui a ida e volta pelo Figma).
 * Como usar: npm run dev → composição "V1-Editor-Respiro" → painel "Props" à
 * direita. Os campos mudam a tela na hora; "Salvar layout" grava em
 * layout-v1.json, que é o mesmo arquivo lido pela vinheta.
 * O texto não é editável aqui: vem sempre da redação (roteiro.json).
 */

export const schemaEditorRespiro = z.object({
  variante: z.enum(["semLogo", "comLogo"]),
  mostrarGuias: z.boolean(),
  layout: schemaLayoutV1,
});
type Props = z.infer<typeof schemaEditorRespiro>;

/** Guias: caixa do texto, máscara e contorno da forma (só no Studio, nunca no render). */
const Guias: React.FC<{ layout: LayoutV1; variante: Props["variante"] }> = ({ layout, variante }) => {
  const r = layout.respiro[variante];
  const pts = contorno({ id: "g", nome: r.forma.nome, x: r.forma.x, y: r.forma.y, largura: r.forma.largura, cor: "", rotacao: r.forma.rotacao });
  const caixa = (x: number, y: number, w: number, h: number, c: string, rotulo: string) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, outline: `2px dashed ${c}` }}>
      <span style={{ position: "absolute", top: -26, left: 0, font: `600 16px ${fontFamily}`, color: c }}>{rotulo}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {caixa(r.mascara.x, r.mascara.y, r.mascara.largura, r.mascara.altura, "#E5007E", "máscara")}
      {caixa(r.texto.x, r.texto.y, 600, r.texto.tamanho * 1.08 * 2, "#00A37A", "texto")}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#E5007E" strokeWidth={2} strokeDasharray="8 6" />
      </svg>
    </AbsoluteFill>
  );
};

const BotaoSalvar: React.FC<{ layout: LayoutV1 }> = ({ layout }) => {
  const [estado, setEstado] = useState<"" | "salvando" | "salvo" | "erro">("");
  const salvar = async () => {
    setEstado("salvando");
    try {
      await writeStaticFile({ filePath: ARQUIVO_LAYOUT_V1, contents: JSON.stringify(layout, null, 2) + "\n" });
      setEstado("salvo");
    } catch {
      setEstado("erro");
    }
  };
  const texto = { "": "Salvar layout", salvando: "Salvando…", salvo: "Salvo em layout-v1.json", erro: "Erro ao salvar" }[estado];
  return (
    <button
      onClick={salvar}
      style={{
        position: "absolute",
        right: 40,
        bottom: 40,
        padding: "18px 28px",
        borderRadius: 14,
        border: 0,
        background: estado === "erro" ? "#B00020" : "#000F44",
        color: "#FFFFFF",
        font: `600 26px ${fontFamily}`,
        cursor: "pointer",
      }}
    >
      {texto}
    </button>
  );
};

export const EditorRespiroV1: React.FC<Props> = ({ variante, mostrarGuias, layout }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const env = getRemotionEnvironment();
  const studio = env.isStudio && !env.isRendering;
  const tela = roteiro.telas.map(conteudoDe).find((c) => c.tipo === "respiro" && c.comLogo === (variante === "comLogo"));
  return (
    <LayoutV1Context.Provider value={layout}>
      {tela && <TelaV1 c={tela} frames={durationInFrames} rep={0} inicio={0} total={10 * 60 * fps} />}
      {studio && mostrarGuias && <Guias layout={layout} variante={variante} />}
      {studio && <BotaoSalvar layout={layout} />}
    </LayoutV1Context.Provider>
  );
};
