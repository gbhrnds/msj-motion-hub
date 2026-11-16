import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, PlayerRef } from "@remotion/player";
import tokens from "../../brand/tokens.json";
import { V1NuDay } from "../versoes/v1/V1NuDay";
import { V3Refinado } from "../versoes/v3/V3Refinado";
import { VinhetaCompletaV3, framesFase1, framesFase2 } from "../fases/VinhetaCompleta";
import { duracaoReview, montarReview, SEGUNDOS_FINAIS } from "../versoes/VersaoBase";
import { roteiro } from "../dados";

/*
 * Página de prévia (fora do Remotion Studio): as composições tocam no navegador
 * com o @remotion/player, para revisar o motion antes do render final.
 * Gerada por scripts/preview/build.mjs.
 */

const fps = tokens.video.fps;
const W = tokens.video.resolution.width;
const H = tokens.video.resolution.height;

type Capitulo = { nome: string; frame: number };

const NOMES: Record<string, string> = {
  tela_inicio_contagem: "Abertura",
  tela_aguarde: "Respiro",
  tela_destaques: "Destaques do Ciclo",
  tela_indicacao_metricas: "Programa de Indicação",
  tela_conteudo: "Uni Agi",
  tela_campanha: "Campanha",
};

const capitulosReview = (): Capitulo[] => {
  const { seq, total } = montarReview(fps);
  let acc = 0;
  const caps = seq.map((s) => {
    const t = roteiro.telas.find((x) => s.key.startsWith(x.id))!;
    const c = { nome: NOMES[t.tipo] ?? t.id, frame: acc };
    acc += s.frames;
    return c;
  });
  caps.push({ nome: "10s finais", frame: total - Math.round(SEGUNDOS_FINAIS * fps) });
  return caps;
};

const fmt = (frame: number) => {
  const s = Math.floor(frame / fps);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

type Versao = {
  id: string;
  titulo: string;
  nota: string;
  component: React.FC<Record<string, unknown>>;
  frames: number;
  capitulos: Capitulo[];
};

const montarVersoes = (): Versao[] => {
  const review = duracaoReview(fps);
  const caps = capitulosReview();
  return [
    {
      id: "v3-completa",
      titulo: "V3 · vinheta completa (15 min)",
      nota: "Fase 1: loop de 10 minutos. Fase 2: 5 minutos só com o logo MSJ.",
      component: VinhetaCompletaV3 as React.FC<Record<string, unknown>>,
      frames: framesFase1(fps) + framesFase2(fps),
      capitulos: [
        { nome: "Abertura (10:00)", frame: 0 },
        ...caps.slice(1, -1).map((c) => ({ ...c, nome: `${c.nome}` })),
        { nome: "10s finais", frame: framesFase1(fps) - Math.round(SEGUNDOS_FINAIS * fps) },
        { nome: "Fase 2 · logo", frame: framesFase1(fps) },
      ],
    },
    {
      id: "v3",
      titulo: "V3 · motion refinado (uma volta)",
      nota: "Abertura, uma volta do loop e os 10 segundos finais.",
      component: V3Refinado as React.FC<Record<string, unknown>>,
      frames: review,
      capitulos: caps,
    },
    {
      id: "v1",
      titulo: "V1 · NuDay (uma volta)",
      nota: "Layout ajustado no Figma em 16/11: abertura, uma volta do loop e os 10 segundos finais.",
      component: V1NuDay as React.FC<Record<string, unknown>>,
      frames: review,
      capitulos: caps,
    },
  ];
};

const App: React.FC = () => {
  const versoes = useMemo(montarVersoes, []);
  const inicial = () => {
    const h = typeof location !== "undefined" ? location.hash.slice(1) : "";
    return versoes.some((v) => v.id === h) ? h : versoes[0].id;
  };
  const [atual, setAtual] = useState(inicial);
  const [frame, setFrame] = useState(0);
  const ref = useRef<PlayerRef>(null);
  const v = versoes.find((x) => x.id === atual)!;

  useEffect(() => {
    const on = () => setAtual(inicial());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  });

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const on = (e: { detail: { frame: number } }) => setFrame(e.detail.frame);
    p.addEventListener("frameupdate", on);
    return () => p.removeEventListener("frameupdate", on);
  }, [atual]);

  const escolher = (id: string) => {
    setAtual(id);
    setFrame(0);
    try {
      history.replaceState(null, "", `#${id}`);
    } catch {
      /* hash opcional */
    }
  };

  const ativo = v.capitulos.reduce((a, c, i) => (frame >= c.frame ? i : a), 0);

  return (
    <div className="pagina">
      <header className="topo">
        <div>
          <p className="sobre">Momento Sempre Juntos · abertura de novembro</p>
          <h1>Prévia das animações</h1>
        </div>
        <nav className="abas" aria-label="Versões">
          {versoes.map((x) => (
            <button key={x.id} id={`aba-${x.id}`} className="aba" aria-pressed={x.id === atual} onClick={() => escolher(x.id)}>
              {x.titulo}
            </button>
          ))}
        </nav>
      </header>

      <main className="palco">
        <div className="tela">
          <Player
            key={v.id}
            ref={ref}
            component={v.component}
            durationInFrames={v.frames}
            fps={fps}
            compositionWidth={W}
            compositionHeight={H}
            style={{ width: "100%", aspectRatio: `${W} / ${H}` }}
            controls
            clickToPlay
            doubleClickToFullscreen
            showVolumeControls={false}
            acknowledgeRemotionLicense
          />
        </div>

        <aside className="lateral">
          <p className="nota">{v.nota}</p>
          <p className="tempo">
            <span>{fmt(frame)}</span> / {fmt(v.frames)} <small>· {fps.toFixed(3)} fps · 1920×1080 · sem áudio</small>
          </p>
          <ol className="capitulos">
            {v.capitulos.map((c, i) => (
              <li key={`${c.nome}-${c.frame}`}>
                <button
                  className="cap"
                  aria-current={i === ativo ? "step" : undefined}
                  onClick={() => {
                    // pula para ~1,5s dentro da tela, com os elementos já de entrada
                    const alvo = Math.min(v.frames - 1, c.frame + Math.round(fps * 1.5));
                    ref.current?.seekTo(alvo);
                    setFrame(alvo);
                  }}
                >
                  <span className="cap-t">{fmt(c.frame)}</span>
                  <span>{c.nome}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="aviso">
            Prévia no navegador: se o computador estiver lento, a reprodução pode pular quadros. O mp4 final é renderizado quadro a
            quadro.
          </p>
        </aside>
      </main>
    </div>
  );
};

createRoot(document.getElementById("app")!).render(<App />);
