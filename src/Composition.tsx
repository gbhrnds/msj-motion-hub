import React from "react";
import { AbsoluteFill, Series, staticFile, useVideoConfig } from "remotion";
import { TelaAguarde } from "./components/TelaAguarde";
import { TelaDestaques } from "./components/TelaDestaques";
import { TelaIndicacaoMetricas } from "./components/TelaIndicacaoMetricas";
import { TelaConteudo } from "./components/TelaConteudo";
import { TelaCampanha } from "./components/TelaCampanha";
import { CountdownOverlay } from "./components/CountdownOverlay";
import roteiroData from "../projects/2025-11_abertura/roteiro.json";
import manifestData from "../projects/2025-11_abertura/manifest.json";

type Tela = {
  id: string;
  tipo:
    | "tela_aguarde"
    | "tela_destaques"
    | "tela_conteudo"
    | "tela_campanha"
    | "tela_indicacao_metricas";
  duracaoSegundos: number;
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
const manifest = manifestData as unknown as Record<string, Record<string, string>>;

const resolveMidia = (chave: string, telaId: string): string => {
  const caminho = manifest[telaId]?.[chave] ?? manifest.geral?.[chave] ?? "";
  return staticFile(caminho);
};

const renderTela = (tela: Tela, duracaoFrames: number): React.ReactNode => {
  switch (tela.tipo) {
    case "tela_aguarde": {
      const escura = tela.fundoHex === "#0064F5";
      return (
        <TelaAguarde
          titulo={tela.textos.titulo ?? ""}
          variante={escura ? "escura" : "clara"}
          mostrarLogoMsj={Boolean(tela.midia.logo)}
        />
      );
    }
    case "tela_destaques": {
      const [subtitulo, fechamento] = (tela.textos.corpo ?? "").split("\n\n");
      const logos = (tela.midia.logo as string[]) ?? [];
      return (
        <TelaDestaques
          subtitulo={subtitulo}
          fechamento={fechamento}
          nomes={tela.midia.gridNomes ?? []}
          logos={logos.map((chave) => resolveMidia(chave, tela.id))}
          icone={tela.midia.icone ? resolveMidia(tela.midia.icone, tela.id) : undefined}
          duracaoFrames={duracaoFrames}
        />
      );
    }
    case "tela_indicacao_metricas":
      return (
        <TelaIndicacaoMetricas
          corpo={tela.textos.corpo ?? ""}
          bullets={tela.textos.bullets}
          foto={staticFile(tela.midia.foto ?? "")}
          logo={resolveMidia(tela.midia.logo as string, tela.id)}
        />
      );
    case "tela_conteudo":
      return (
        <TelaConteudo
          corpo={tela.textos.corpo ?? ""}
          bullets={tela.textos.bullets}
          logo={tela.midia.logo ? resolveMidia(tela.midia.logo as string, tela.id) : undefined}
        />
      );
    case "tela_campanha":
      return <TelaCampanha corpo={tela.textos.corpo ?? ""} />;
    default:
      return null;
  }
};

export const MSJComposition: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const durationInSeconds = Math.floor(durationInFrames / fps);

  // Converte a duracao de cada tela (segundos, do roteiro.json) para frames no
  // fps oficial do projeto (23.976fps — CLAUDE.md, regra inegociavel).
  const telasComFrames = roteiro.telas.map((tela) => ({
    tela,
    frames: Math.round(tela.duracaoSegundos * fps),
  }));

  // A Fase 1 (loop das 8 telas) se repete ate preencher o total de frames da
  // composicao. A ultima tela do ultimo loop e cortada exatamente no limite,
  // caso nao feche uma volta inteira.
  const sequencias: { key: string; tela: Tela; frames: number }[] = [];
  let acumulado = 0;
  let loopIndex = 0;
  while (acumulado < durationInFrames) {
    for (const { tela, frames } of telasComFrames) {
      const restante = durationInFrames - acumulado;
      if (restante <= 0) break;
      const framesDaVez = Math.min(frames, restante);
      sequencias.push({ key: `${tela.id}-loop${loopIndex}`, tela, frames: framesDaVez });
      acumulado += framesDaVez;
    }
    loopIndex += 1;
  }

  return (
    <AbsoluteFill>
      <Series>
        {sequencias.map(({ key, tela, frames }) => (
          <Series.Sequence key={key} durationInFrames={frames}>
            {renderTela(tela, frames)}
          </Series.Sequence>
        ))}
      </Series>

      {/* O Relogio fica por cima de tudo, rodando independente das telas */}
      <CountdownOverlay durationInSeconds={durationInSeconds} />
    </AbsoluteFill>
  );
};
