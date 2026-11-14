import React from "react";
import { AbsoluteFill, Series, useVideoConfig } from "remotion";
import { PainelContagem } from "./components/PainelContagem";
import { TelaAguarde } from "./components/TelaAguarde";
import { TelaDestaques } from "./components/TelaDestaques";
import { TelaIndicacaoMetricas } from "./components/TelaIndicacaoMetricas";
import { TelaConteudo } from "./components/TelaConteudo";
import { TelaCampanha } from "./components/TelaCampanha";
import { CountdownOverlay } from "./components/CountdownOverlay";
import { cor } from "./brand/theme";
import roteiroData from "../projects/2025-11_abertura/roteiro.json";
import manifestData from "../projects/2025-11_abertura/manifest.json";

type Tela = {
  id: string;
  tipo:
    | "tela_inicio_contagem"
    | "tela_aguarde"
    | "tela_destaques"
    | "tela_conteudo"
    | "tela_campanha"
    | "tela_indicacao_metricas";
  duracaoSegundos: number;
  exibicao?: "uma_vez";
  textos: { titulo: string | null; corpo: string | null; bullets: string[] };
  midia: {
    foto?: string | null;
    logo?: string | string[] | null;
    icone?: string;
    gridNomes?: string[] | null;
  };
  fundoHex?: string;
};

const roteiro = roteiroData as unknown as { telas: Tela[] };
const manifest = manifestData as unknown as Record<
  string,
  Record<string, string>
>;

/** Chave do roteiro → caminho do arquivo (manifest da tela, depois "geral"). */
const midia = (chave: string, telaId: string): string =>
  manifest[telaId]?.[chave] ?? manifest.geral?.[chave] ?? "";

/** Separa os parágrafos do campo "corpo" (texto intacto, só dividido). */
const paragrafos = (corpo: string | null) => (corpo ?? "").split("\n\n");

const renderTela = (
  tela: Tela,
  duracaoFrames: number,
  repeticao: number,
  segundosTotais: number,
): React.ReactNode => {
  switch (tela.tipo) {
    case "tela_inicio_contagem":
      return (
        <PainelContagem
          id={tela.id}
          segundosNoInicio={segundosTotais}
          logoMsj={midia(tela.midia.logo as string, tela.id)}
          duracaoFrames={duracaoFrames}
        />
      );
    case "tela_aguarde": {
      const cinza =
        tela.fundoHex?.toUpperCase() === cor.cinzaClaro.toUpperCase();
      const n = Number(tela.id.replace(/\D/g, ""));
      return (
        <TelaAguarde
          id={tela.id}
          duracaoFrames={duracaoFrames}
          titulo={tela.textos.titulo ?? ""}
          variante={cinza ? "cinza" : "azul"}
          logoMsj={
            tela.midia.logo
              ? midia(tela.midia.logo as string, tela.id)
              : undefined
          }
          // telas repetidas (01/05, 03/07) e voltas do loop alternam a rotação dos grafismos
          girarGrafismos={(Math.floor(n / 4) + repeticao) % 2 === 1}
        />
      );
    }
    case "tela_destaques": {
      const [chamada, fechamento] = paragrafos(tela.textos.corpo);
      return (
        <TelaDestaques
          chamada={chamada}
          fechamento={fechamento}
          nomes={tela.midia.gridNomes ?? []}
          logos={((tela.midia.logo as string[]) ?? []).map((c) =>
            midia(c, tela.id),
          )}
          icone={
            tela.midia.icone ? midia(tela.midia.icone, tela.id) : undefined
          }
          duracaoFrames={duracaoFrames}
        />
      );
    }
    case "tela_indicacao_metricas":
      return (
        <TelaIndicacaoMetricas
          corpo={tela.textos.corpo ?? ""}
          bullets={tela.textos.bullets}
          foto={tela.midia.foto ?? ""}
          logo={midia(tela.midia.logo as string, tela.id)}
        />
      );
    case "tela_conteudo": {
      const [corpo, chamadaLista] = paragrafos(tela.textos.corpo);
      return (
        <TelaConteudo
          corpo={corpo}
          chamadaLista={chamadaLista}
          bullets={tela.textos.bullets}
          logo={
            tela.midia.logo
              ? midia(tela.midia.logo as string, tela.id)
              : undefined
          }
        />
      );
    }
    case "tela_campanha": {
      const [chamada, corpo] = paragrafos(tela.textos.corpo);
      return (
        <TelaCampanha
          chamada={chamada}
          corpo={corpo}
          duracaoFrames={duracaoFrames}
        />
      );
    }
    default:
      return null;
  }
};

export const MSJComposition: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const segundosTotais = Math.round(durationInFrames / fps);
  const frames = (t: Tela) => Math.round(t.duracaoSegundos * fps);

  // Abertura (exibida uma vez) + loop das telas até completar a Fase 1.
  const abertura = roteiro.telas.filter((t) => t.exibicao === "uma_vez");
  const loop = roteiro.telas.filter((t) => t.exibicao !== "uma_vez");

  const sequencias: { key: string; tela: Tela; frames: number; rep: number }[] =
    [];
  let acumulado = 0;
  const adicionar = (tela: Tela, rep: number) => {
    const restante = durationInFrames - acumulado;
    if (restante <= 0) return;
    const f = Math.min(frames(tela), restante);
    sequencias.push({ key: `${tela.id}-r${rep}`, tela, frames: f, rep });
    acumulado += f;
  };
  abertura.forEach((t) => adicionar(t, 0));
  const framesAbertura = acumulado;
  for (let rep = 0; acumulado < durationInFrames && loop.length > 0; rep++) {
    loop.forEach((t) => adicionar(t, rep));
  }

  return (
    <AbsoluteFill>
      <Series>
        {sequencias.map(({ key, tela, frames: f, rep }) => (
          <Series.Sequence
            key={key}
            durationInFrames={f}
            name={`${tela.id} (volta ${rep + 1})`}
          >
            {renderTela(tela, f, rep, segundosTotais)}
          </Series.Sequence>
        ))}
      </Series>

      {/* O relógio fica por cima de tudo; na abertura ele já é a própria tela */}
      <CountdownOverlay
        durationInSeconds={segundosTotais}
        ocultarAteFrame={framesAbertura}
        logoMsj={manifest.geral?.logo_msj_negativo ?? ""}
      />
    </AbsoluteFill>
  );
};
