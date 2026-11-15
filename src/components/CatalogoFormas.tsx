import React from "react";
import { AbsoluteFill } from "remotion";
import shapesData from "../shapesData.json";
import { BrandShape, ShapeName } from "../brand/BrandShape";
import { cor } from "../brand/theme";
import { fontFamily } from "../fonts";

/** Ferramenta de consulta: as 40 formas oficiais de brand/shapes/ com o nome. */
export const CatalogoFormas: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: cor.branco,
      padding: 40,
      display: "grid",
      gridTemplateColumns: "repeat(8, 1fr)",
      gap: 16,
    }}
  >
    {(Object.keys(shapesData) as ShapeName[]).map((n) => (
      <div
        key={n}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ height: 150, display: "flex", alignItems: "center" }}>
          <BrandShape
            nome={n}
            largura={Math.min(170, 130 * (shapesData[n].w / shapesData[n].h))}
            cor={cor.azul}
          />
        </div>
        <span
          style={{
            fontFamily,
            fontSize: 18,
            color: cor.azulEscuro,
            marginTop: 8,
          }}
        >
          {n}
        </span>
      </div>
    ))}
  </AbsoluteFill>
);
