import React from "react";
import { AbsoluteFill } from "remotion";
import {
  conflitos,
  girar180,
  GrafismoSpec,
  ZonaLivre,
} from "../brand/grafismos";
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

const CASOS: Caso[] = [
  {
    nome: "Painel de contagem",
    formas: Painel.FORMAS,
    zonas: Painel.ZONAS,
    contador: false,
  },
  {
    nome: "Respiro azul",
    formas: Aguarde.FORMAS_AZUL,
    zonas: Aguarde.zonasAguarde(false),
    contador: true,
  },
  {
    nome: "Respiro azul (girado 180°)",
    formas: Aguarde.FORMAS_AZUL.map(girar180),
    zonas: Aguarde.zonasAguarde(false),
    contador: true,
  },
  {
    nome: "Respiro cinza",
    formas: Aguarde.FORMAS_CINZA,
    zonas: Aguarde.zonasAguarde(true),
    contador: true,
  },
  {
    nome: "Respiro cinza (girado 180°)",
    formas: Aguarde.FORMAS_CINZA.map(girar180),
    zonas: Aguarde.zonasAguarde(true),
    contador: true,
  },
  {
    nome: "Destaques do Ciclo",
    formas: Destaques.FORMAS,
    zonas: Destaques.ZONAS,
    contador: true,
  },
  {
    nome: "Indicação + métricas",
    formas: Indicacao.FORMAS,
    zonas: Indicacao.ZONAS,
    contador: true,
  },
  {
    nome: "Conteúdo (Uni Agi)",
    formas: Conteudo.FORMAS,
    zonas: Conteudo.ZONAS,
    contador: true,
  },
  {
    nome: "Campanha",
    formas: Campanha.FORMAS,
    zonas: Campanha.ZONAS,
    contador: true,
  },
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
