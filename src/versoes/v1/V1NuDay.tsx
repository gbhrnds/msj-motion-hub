import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { cor } from "../../brand/theme";
import { fontFamily } from "../../fonts";
import { Logo } from "../../brand/Logo";
import { Icone } from "../../brand/Icone";
import { BrandShape, ShapeName } from "../../brand/BrandShape";
import { FotoNaForma } from "../../brand/FotoNaForma";
import { quebraBoa } from "../../brand/quebraDeLinha";
import { MorphForma } from "../../motion/MorphForma";
import { comDestaque, PalavrasReveal } from "../../motion/PalavrasReveal";
import { Conteudo, LOGO_AGI, LOGO_MSJ } from "../../dados";
import { LogoMSJAnimado } from "../../motion/LogoMSJAnimado";
import { clamp, easeEntra, Numero } from "../../components/contagem/base";
import { RelogioProps, SEGUNDOS_FINAIS, TelaProps, VersaoBase } from "../VersaoBase";

/*
 * VERSÃO 1 — inspirada no #NuDay (projetos_referencia/analise_nova).
 * Grade de transmissão: relógio fixo no meio-esquerda, um "slot" de conteúdo
 * à direita que troca a cada tela, logo agi fixo no topo. Fundo de uma cor só:
 * azul nas telas de conteúdo, branco nos respiros. Morph de formas só nos
 * respiros (formas em volta do texto) e nas transições entre telas.
 * Só a mecânica vem da referência; cores, formas e tipo são Agibank.
 */

const SLOT = { x: 660, largura: 1140 };
const RELOGIO = { x: 120, tam: 150 };
const claro = (c: Conteudo) => c.tipo === "respiro";
export const fundoV1 = (c: Conteudo) => (claro(c) ? cor.branco : cor.azul);

/** Relógio da grade: mesma posição e tamanho em todas as telas (só a cor acompanha o fundo). */
const RelogioFixo: React.FC<{ inicio: number; total: number; corTexto: string }> = ({ inicio, total, corTexto }) => {
  const frame = useCurrentFrame() + inicio;
  const { fps } = useVideoConfig();
  const seg = Math.max(0, Math.round(total / fps) - Math.floor(frame / fps));
  const noSeg = frame - Math.ceil(Math.floor(frame / fps) * fps);
  return (
    <div style={{ position: "absolute", left: RELOGIO.x, top: 540, translate: "0 -50%" }}>
      <Numero segundos={seg} noSegundo={noSeg} tamanho={RELOGIO.tam} cor={corTexto} rolar />
    </div>
  );
};

/** Moldura superior fixa: logo agi (versão reduzida, Brandbook p.27). Sem arquivo no manifest, fica vazio. */
const Selo: React.FC<{ claro: boolean }> = ({ claro: c }) => {
  const arq = c ? LOGO_AGI.positivo : LOGO_AGI.negativo;
  return (
    <div data-camada="logo agi" style={{ position: "absolute", left: RELOGIO.x, top: 64, width: 120, height: 52 }}>
      {arq && <Logo arquivo={arq} versao={c ? "positiva" : "negativa"} altura={52} />}
    </div>
  );
};

const Slot: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      left: SLOT.x,
      width: SLOT.largura,
      top: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      fontFamily,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Entrada simples (fade + subida curta) para logos e blocos de apoio. */
const Entra: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties; sairEm?: number }> = ({
  delay = 0,
  children,
  style,
  sairEm,
}) => {
  const f = useCurrentFrame();
  const v = easeEntra(interpolate(f, [delay, delay + 18], [0, 1], clamp));
  const s = sairEm === undefined ? 0 : interpolate(f, [sairEm, sairEm + 10], [0, 1], clamp);
  return <div style={{ opacity: v * (1 - s), translate: `0 ${(1 - v) * 16 - s * 10}px`, ...style }}>{children}</div>;
};

// ---------------------------------------------------------------- telas
const Abertura: React.FC = () => (
  <Slot>
    <LogoMSJAnimado versao="negativa" altura={190} delay={6} />
  </Slot>
);

/** Formas que morfam em volta do texto do respiro (único lugar do loop com morph). */
const ORBITA: { x: number; y: number; tam: number; cor: string; formas: ShapeName[]; atraso: number; giro: number }[][] = [
  [
    { x: 700, y: 130, tam: 230, cor: cor.azul, formas: ["pentagon-05", "quadrilateral-05", "pentagon-03"], atraso: 0, giro: 3 },
    { x: 1530, y: 300, tam: 320, cor: cor.azulMedio, formas: ["quadrilateral-16", "pentagon-06", "quadrilateral-01"], atraso: 26, giro: -2 },
    { x: 1010, y: 790, tam: 170, cor: cor.verde, formas: ["triangle-02", "triangle-08", "triangle-01"], atraso: 48, giro: 5 },
    { x: 1500, y: 90, tam: 110, cor: cor.azul, formas: ["triangle-01", "triangle-07", "triangle-02"], atraso: 14, giro: -6 },
  ],
  [
    { x: 1480, y: 120, tam: 280, cor: cor.azulMedio, formas: ["pentagon-03", "pentagon-05", "quadrilateral-05"], atraso: 0, giro: -3 },
    { x: 720, y: 760, tam: 220, cor: cor.azul, formas: ["quadrilateral-05", "quadrilateral-16", "pentagon-01"], atraso: 22, giro: 3 },
    { x: 1600, y: 720, tam: 150, cor: cor.verde, formas: ["triangle-08", "triangle-02", "triangle-07"], atraso: 40, giro: 6 },
    { x: 760, y: 140, tam: 120, cor: cor.azul, formas: ["triangle-07", "triangle-01", "triangle-08"], atraso: 10, giro: -5 },
  ],
];

const Respiro: React.FC<{ c: Extract<Conteudo, { tipo: "respiro" }> }> = ({ c }) => {
  const f = useCurrentFrame();
  return (
    <>
      {ORBITA[c.variante % 2].map((o, i) => {
        const d = [0, 3, 5, 6][i];
        const v = easeEntra(interpolate(f, [4 + d, 26 + d], [0, 1], clamp));
        return (
          <div key={i} data-camada={`forma r${i + 1} · ${o.formas[0]}`} style={{ position: "absolute", left: o.x, top: o.y, opacity: v, scale: String(0.6 + 0.4 * v) }}>
            <MorphForma formas={o.formas} tamanho={o.tam} cor={o.cor} segurar={46} morfar={20} atraso={o.atraso} giro={o.giro} />
          </div>
        );
      })}
      <Slot style={{ left: 900, width: 600 }}>
        <div style={{ fontSize: 60, lineHeight: 1.12, color: cor.azul }}>
          <PalavrasReveal trechos={comDestaque(c.titulo, c.destaque, 300, 700)} delay={10} passo={5} />
        </div>
        {c.comLogo && (
          <Entra delay={30} style={{ marginTop: 40 }}>
            <Logo arquivo={LOGO_MSJ.positivo} versao="positiva" altura={80} />
          </Entra>
        )}
      </Slot>
    </>
  );
};

const Destaques: React.FC<{ c: Extract<Conteudo, { tipo: "destaques" }>; frames: number }> = ({ c, frames }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (x: number) => Math.round(x * fps);
  const fimNomes = frames - s(3);
  const COLS = 4;
  const LINHA = 52;
  const JAN = { y: 250, h: 620 };
  const linhas = Math.ceil(c.nomes.length / COLS);
  const topo = interpolate(f, [s(7), fimNomes], [JAN.y + JAN.h, JAN.y - linhas * LINHA], clamp);
  return (
    <>
      {f < s(4.8) && (
        <Slot>
          <Entra sairEm={s(4.4)}>
            <Logo arquivo={c.logoJeito} versao="negativa" altura={120} />
          </Entra>
          <div style={{ fontSize: 50, lineHeight: 1.18, color: cor.branco, marginTop: 48, maxWidth: 980 }}>
            <PalavrasReveal trechos={comDestaque(c.chamada, "se destaca!", 300, 700)} delay={12} passo={3} sairEm={s(4.4)} />
          </div>
        </Slot>
      )}
      {f >= s(4.6) && f < s(7) && (
        <Slot>
          <Entra delay={s(4.6)} sairEm={s(6.6)}>
            <Logo arquivo={c.logoDestaques} versao="negativa" altura={230} />
          </Entra>
        </Slot>
      )}
      {f >= s(6.8) && f < fimNomes && (
        <>
          <div style={{ position: "absolute", left: SLOT.x, top: 110 }}>
            <Entra delay={s(6.8)}>
              <Logo arquivo={c.logoDestaques} versao="negativa" altura={72} />
            </Entra>
          </div>
          <div
            style={{
              position: "absolute",
              left: SLOT.x,
              width: SLOT.largura,
              top: 0,
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              columnGap: 24,
              translate: `0 ${topo}px`,
              fontFamily,
              fontSize: 22,
              fontWeight: 400,
              color: cor.branco,
            }}
          >
            {c.nomes.map((n, i) => {
              const y = topo + Math.floor(i / COLS) * LINHA + LINHA / 2;
              const op = Math.min(
                interpolate(y, [JAN.y, JAN.y + 60], [0, 1], clamp),
                interpolate(y, [JAN.y + JAN.h - 60, JAN.y + JAN.h], [1, 0], clamp),
              );
              return (
                <div key={n} style={{ height: LINHA, display: "flex", alignItems: "center", whiteSpace: "nowrap", opacity: op }}>
                  {n}
                </div>
              );
            })}
          </div>
        </>
      )}
      {f >= fimNomes && (
        <Slot>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ fontSize: 72, color: cor.branco }}>
              <PalavrasReveal trechos={[{ texto: c.fechamento, peso: 700 }]} delay={fimNomes} passo={4} />
            </div>
            {c.icone && (
              <Entra delay={fimNomes + 14}>
                <div style={{ scale: String(1 + 0.12 * Math.pow(Math.max(0, Math.sin((2 * Math.PI * 1.1 * f) / fps)), 6)) }}>
                  <Icone arquivo={c.icone} cor={cor.amarelo} tamanho={72} />
                </div>
              </Entra>
            )}
          </div>
        </Slot>
      )}
    </>
  );
};

const separar = (b: string): [string, string] => {
  const m = b.match(/^(\S+)\s+(.*)$/);
  return m ? [m[1], m[2]] : [b, ""];
};

const Indicacao: React.FC<{ c: Extract<Conteudo, { tipo: "indicacao" }> }> = ({ c }) => (
  <>
    <Entra delay={8} style={{ position: "absolute", inset: 0 }}>
      <FotoNaForma
        forma="pentagon-06"
        x={1380}
        y={250}
        largura={440}
        foto={c.foto}
        recorte={c.recorte}
        imagem={{ x: 1180, y: 196, largura: 840, altura: 560 }}
      />
    </Entra>
    <Slot style={{ width: 660 }}>
      <Entra>
        <Logo arquivo={c.logo} versao="negativa" altura={92} />
      </Entra>
      <div style={{ fontSize: 40, lineHeight: 1.22, color: cor.branco, marginTop: 34 }}>
        <PalavrasReveal trechos={[{ texto: c.corpo, peso: 300 }]} delay={10} passo={2.2} modo="fade" />
      </div>
      <div style={{ display: "flex", gap: 44, marginTop: 52 }}>
        {c.bullets.map((b, i) => {
          const [n, r] = separar(b);
          return (
            <Entra key={b} delay={30 + [0, 4, 7][i % 3]} style={{ width: 190 }}>
              <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1, color: cor.branco }}>{n}</div>
              <div style={{ fontSize: 24, fontWeight: 400, lineHeight: 1.2, color: cor.branco, marginTop: 10 }}>{quebraBoa(r)}</div>
            </Entra>
          );
        })}
      </div>
    </Slot>
  </>
);

const ConteudoTela: React.FC<{ c: Extract<Conteudo, { tipo: "conteudo" }> }> = ({ c }) => (
  <Slot style={{ flexDirection: "row", alignItems: "center", gap: 70 }}>
    <div style={{ width: 500 }}>
      {c.logo && (
        <Entra>
          <Logo arquivo={c.logo} versao="negativa" altura={70} />
        </Entra>
      )}
      <div style={{ fontSize: 40, lineHeight: 1.22, color: cor.branco, marginTop: 34 }}>
        <PalavrasReveal trechos={[{ texto: c.corpo, peso: 300 }]} delay={8} passo={2.4} modo="fade" />
      </div>
    </div>
    <div style={{ width: 570 }}>
      <Entra delay={20}>
        <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15, color: cor.branco, marginBottom: 30 }}>{quebraBoa(c.chamadaLista)}</div>
      </Entra>
      {c.bullets.map((b, i) => (
        <Entra key={b} delay={28 + [0, 4, 7, 9, 11][i % 5]} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
          <BrandShape nome="triangle-06" largura={20} cor={cor.branco} rotacao={-90} />
          <span style={{ fontSize: 30, fontWeight: 300, color: cor.branco }}>{quebraBoa(b)}</span>
        </Entra>
      ))}
    </div>
  </Slot>
);

const dividirCampanha = (t: string) => {
  const i = t.indexOf(", ", t.indexOf(",") + 1);
  return i > 0 ? [t.slice(0, i + 1), t.slice(i + 1)] : ["", t];
};

const Campanha: React.FC<{ c: Extract<Conteudo, { tipo: "campanha" }> }> = ({ c }) => {
  const [leve, forte] = dividirCampanha(c.chamada);
  return (
    <Slot style={{ width: 1000 }}>
      <div style={{ fontSize: 76, lineHeight: 1.08, color: cor.branco }}>
        <PalavrasReveal trechos={[{ texto: leve, peso: 300 }, { texto: forte, peso: 700 }].filter((t) => t.texto)} delay={8} passo={4} />
      </div>
      <div style={{ fontSize: 36, lineHeight: 1.3, color: cor.branco, marginTop: 40, maxWidth: 820 }}>
        <PalavrasReveal trechos={[{ texto: c.corpo, peso: 300 }]} delay={34} passo={2} modo="fade" />
      </div>
    </Slot>
  );
};

const TelaV1: React.FC<TelaProps> = ({ c, frames, inicio, total }) => {
  const bg = fundoV1(c);
  const c1 = claro(c);
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      {c.tipo === "abertura" && <Abertura />}
      {c.tipo === "respiro" && <Respiro c={c} />}
      {c.tipo === "destaques" && <Destaques c={c} frames={frames} />}
      {c.tipo === "indicacao" && <Indicacao c={c} />}
      {c.tipo === "conteudo" && <ConteudoTela c={c} />}
      {c.tipo === "campanha" && <Campanha c={c} />}
      <Selo claro={c1} />
      <RelogioFixo inicio={inicio} total={total} corTexto={c1 ? cor.azul : cor.branco} />
    </AbsoluteFill>
  );
};

/** Os 10s finais: o slot recebe o logo MSJ com a entrada montada letra a letra. */
const RelogioV1: React.FC<RelogioProps> = ({ segundosNoInicio }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicioFinal = Math.ceil((segundosNoInicio - SEGUNDOS_FINAIS) * fps);
  const final = frame >= inicioFinal;
  const seg = Math.max(0, segundosNoInicio - Math.floor(frame / fps));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {final && (
        <AbsoluteFill style={{ backgroundColor: cor.azul }}>
          <Slot>
            <LogoMSJAnimado versao="negativa" altura={170} delay={4} />
          </Slot>
          <Selo claro={false} />
          <div style={{ position: "absolute", left: RELOGIO.x, top: 540, translate: "0 -50%" }}>
            <Numero segundos={seg} noSegundo={frame - Math.ceil(Math.floor(frame / fps) * fps)} tamanho={RELOGIO.tam} cor={cor.branco} rolar />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const V1NuDay: React.FC = () => (
  <VersaoBase
    Tela={TelaV1}
    Relogio={RelogioV1}
    fundo={fundoV1}
    formasTransicao={[["pentagon-05", "quadrilateral-05"], ["quadrilateral-16", "pentagon-06"], ["pentagon-03", "triangle-02"]]}
  />
);

