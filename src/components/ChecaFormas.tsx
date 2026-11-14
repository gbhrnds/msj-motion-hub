import React from "react";
import { AbsoluteFill } from "remotion";
import { conflitos, girar180, GrafismoSpec, ZonaLivre } from "../brand/grafismos";
import { cor } from "../brand/theme";
import { fontFamily } from "../fonts";
import * as Painel from "./PainelContagem";
import * as Aguarde from "./TelaAguarde";
import * as Destaques from "./TelaDestaques";
import * as Indicacao from "./TelaIndicacaoMetricas";
import * as Conteudo from "./TelaConteudo";
import * as Campanha from "./TelaCampanha";

type Caso = {
  nome: string;
  formas: GrafismoSpec[];
  zonas: ZonaLivre[];
  contador: boolean;
};

const respiro = (nome: string, c: string, logo: boolean, girar: boolean): Caso => ({
  nome,
  formas: Aguarde.formasAguarde(c).map((g) => (girar ? girar180(g) : g)),
  zonas: Aguarde.zonasAguarde(logo),
  contador: true,
});

const CASOS: Caso[] = [
  { nome: "Painel de contagem", formas: Painel.FORMAS, zonas: Painel.ZONAS, contador: false },
  respiro("Respiro amarelo (sem logo)", cor.amarelo, false, false),
  respiro("Respiro amarelo (girado 180°)", cor.amarelo, false, true),
  respiro("Respiro verde (com logo)", cor.verde, true, false),
  respiro("Respiro verde (girado 180°)", cor.verde, true, true),
  { nome: "Destaques — ato 1", formas: Destaques.FORMAS_ATO1, zonas: Destaques.ZONAS_ATO1, contador: true },
  { nome: "Destaques — ato 2", formas: Destaques.FORMAS_ATO2, zonas: Destaques.ZONAS_ATO2, contador: true },
  { nome: "Destaques — ato 3", formas: Destaques.FORMAS_ATO3, zonas: Destaques.ZONAS_ATO3, contador: true },
  { nome: "Destaques — ato 4", formas: Destaques.FORMAS_ATO4, zonas: Destaques.ZONAS_ATO4, contador: true },
  { nome: "Indicação + métricas", formas: Indicacao.FORMAS, zonas: Indicacao.ZONAS, contador: true },
  { nome: "Conteúdo (Uni Agi)", formas: Conteudo.FORMAS, zonas: Conteudo.ZONAS, contador: true },
  { nome: "Campanha", formas: Campanha.FORMAS, zonas: Campanha.ZONAS, contador: true },
];

/**
 * QA automático das regras de forma (brand/boas-praticas-visuais.md):
 * sem sobreposição, sem invadir texto/logo/contador (+ respiro), sem corte na borda.
 * Rodar: npx remotion still src/index.ts ChecaFormas out/checa-formas.png
 */
export const ChecaFormas: React.FC = () => (
  <AbsoluteFill
    style={{ backgroundColor: cor.branco, padding: 80, fontFamily }}
  >
    <h1 style={{ color: cor.azul, margin: "0 0 40px", fontSize: 48 }}>
      Checagem de formas
    </h1>
    {CASOS.map((c) => {
      const erros = conflitos(c.formas, c.zonas, c.contador);
      return (
        <div
          key={c.nome}
          style={{ fontSize: 28, margin: "10px 0", color: cor.azulEscuro }}
        >
          <b style={{ color: erros.length ? "#EF0000" : "#008A00" }}>
            {erros.length ? "FALHA" : "OK"}
          </b>
          {"  "}
          {c.nome}
          {erros.length > 0 && <span> — {erros.join("; ")}</span>}
        </div>
      );
    })}
  </AbsoluteFill>
);
