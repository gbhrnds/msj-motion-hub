import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import tokens from "../../brand/tokens.json";
import { VinhetaCompletaV1, VinhetaCompletaV3, framesFase1, framesFase2 } from "../../src/fases/VinhetaCompleta";
import type { Projeto, Tela } from "../../src/dados";

/*
 * Estúdio de Motion (app local): conversa com o Claude para montar a vinheta
 * do evento, upload de redação/logos/fotos, prévia e render.
 */

type Meta = { id: string; nome: string; versao: "V1" | "V3"; criadoEm: string };
type Fala = { de: "voce" | "estudio"; texto: string; anexos?: string[]; ferramentas?: string[] };
type Render = { estado: string; quadro?: number; total?: number; arquivo?: string; erro?: string; etapa?: string };
type Estado = {
  meta: Meta;
  roteiro: { telas: Tela[] };
  manifest: Projeto["manifest"];
  arquivos: string[];
  temRedacao: boolean;
  conversa: Fala[];
  render: Render;
};

const fps = tokens.video.fps;
const W = tokens.video.resolution.width;
const H = tokens.video.resolution.height;

const api = async <T,>(url: string, init?: RequestInit): Promise<T> => {
  const r = await fetch(url, init);
  const j = await r.json();
  if (!r.ok) throw new Error(j.erro ?? `Erro ${r.status}`);
  return j as T;
};

const NOME_TIPO: Record<string, string> = {
  tela_inicio_contagem: "Relógio",
  tela_aguarde: "Respiro",
  tela_destaques: "Destaques",
  tela_indicacao_metricas: "Indicação",
  tela_conteudo: "Conteúdo",
  tela_campanha: "Campanha",
};

const NovoEvento: React.FC<{ criado: (m: Meta) => void }> = ({ criado }) => {
  const [id, setId] = useState("");
  const [versao, setVersao] = useState<"V1" | "V3">("V1");
  const [erro, setErro] = useState("");
  const criar = async () => {
    setErro("");
    try {
      criado(await api<Meta>("/api/projetos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, nome: id, versao }) }));
      setId("");
    } catch (e) {
      setErro((e as Error).message);
    }
  };
  return (
    <span className="linha">
      <input type="text" placeholder="Digite o nome do evento (ex.: 2026-12_abertura)" value={id} onChange={(e) => setId(e.target.value)} aria-label="Nome do novo evento" style={{ width: 300 }} />
      <select value={versao} onChange={(e) => setVersao(e.target.value as "V1" | "V3")} aria-label="Versão da vinheta">
        <option value="V1">V1 · Momento Sempre Juntos</option>
        <option value="V3">V3 · outras lives</option>
      </select>
      <button className="botao" onClick={criar} disabled={!id}>
        Criar evento
      </button>
      {erro && <span className="aviso">{erro}</span>}
    </span>
  );
};

const Chat: React.FC<{ estado: Estado; atualizar: (e: Estado) => void; chaveApi: boolean }> = ({ estado, atualizar, chaveApi }) => {
  const [texto, setTexto] = useState("");
  const [anexos, setAnexos] = useState<File[]>([]);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");
  const [arrastando, setArrastando] = useState(false);
  const fim = useRef<HTMLDivElement>(null);
  const arquivoRef = useRef<HTMLInputElement>(null);
  useEffect(() => fim.current?.scrollIntoView({ behavior: "smooth" }), [estado.conversa.length, ocupado]);

  const enviar = async () => {
    if (!texto.trim() && !anexos.length) return;
    setOcupado(true);
    setErro("");
    try {
      const enviados: string[] = [];
      for (const f of anexos) {
        const r = await api<{ caminho: string; redacao: boolean }>(`/api/projetos/${estado.meta.id}/arquivos?nome=${encodeURIComponent(f.name)}`, { method: "POST", body: f });
        enviados.push(r.redacao ? `${r.caminho} (redação)` : r.caminho);
      }
      const r = await api<{ projeto: Estado }>(`/api/projetos/${estado.meta.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, anexos: enviados }),
      });
      setTexto("");
      setAnexos([]);
      atualizar(r.projeto);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setOcupado(false);
    }
  };

  return (
    <section
      className={`caixa chat ${arrastando ? "soltar" : ""}`}
      aria-label="Conversa"
      onDragOver={(e) => {
        e.preventDefault();
        setArrastando(true);
      }}
      onDragLeave={() => setArrastando(false)}
      onDrop={(e) => {
        e.preventDefault();
        setArrastando(false);
        setAnexos((a) => [...a, ...Array.from(e.dataTransfer.files)]);
      }}
    >
      <div className="mensagens">
        {estado.conversa.length === 0 && (
          <p className="suave">
            Comece arrastando a redação (.docx) e os logos e fotos do evento para cá. Depois diga, por exemplo: “monta as telas da vinheta com essa redação”.
          </p>
        )}
        {estado.conversa.map((m, i) => (
          <div key={i} className={`msg ${m.de}`}>
            {m.texto}
            {m.anexos?.length ? <small>Arquivos: {m.anexos.map((a) => a.split("/").pop()).join(", ")}</small> : null}
          </div>
        ))}
        {ocupado && <div className="msg estudio suave">Trabalhando…</div>}
        <div ref={fim} />
      </div>
      <div className="entrada">
        {!chaveApi && <p className="aviso" style={{ margin: 0 }}>Sem chave da API no arquivo .env: o chat não vai responder.</p>}
        {anexos.length > 0 && (
          <div className="linha">
            {anexos.map((f, i) => (
              <span key={i} className="anexo">
                {f.name}{" "}
                <button className="botao sec" style={{ padding: "0 6px" }} onClick={() => setAnexos((a) => a.filter((_, j) => j !== i))} aria-label={`Remover ${f.name}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite o que precisa (ex.: monta as telas com essa redação)"
          aria-label="Mensagem"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) enviar();
          }}
        />
        <div className="linha">
          <input ref={arquivoRef} type="file" multiple hidden accept=".docx,.md,.txt,.svg,.png,.jpg,.jpeg" onChange={(e) => setAnexos((a) => [...a, ...Array.from(e.target.files ?? [])])} />
          <button className="botao sec" onClick={() => arquivoRef.current?.click()}>
            Escolher arquivos
          </button>
          <button className="botao" onClick={enviar} disabled={ocupado || (!texto.trim() && !anexos.length)}>
            Enviar
          </button>
          {erro && <span className="aviso">{erro}</span>}
        </div>
      </div>
    </section>
  );
};

const Previa: React.FC<{ estado: Estado; atualizar: (e: Estado) => void }> = ({ estado, atualizar }) => {
  const telas = estado.roteiro.telas;
  const temConteudo = telas.length > 1;
  const projeto = useMemo<Projeto>(() => ({ roteiro: estado.roteiro, manifest: estado.manifest }), [estado.roteiro, estado.manifest]);
  const Comp = estado.meta.versao === "V1" ? VinhetaCompletaV1 : VinhetaCompletaV3;
  const [render, setRender] = useState<Render>(estado.render);
  useEffect(() => setRender(estado.render), [estado.render]);
  useEffect(() => {
    if (render.estado !== "renderizando") return;
    const t = setInterval(async () => setRender(await api<Render>(`/api/projetos/${estado.meta.id}/render`)), 3000);
    return () => clearInterval(t);
  }, [render.estado, estado.meta.id]);
  const loop = telas.filter((t) => t.exibicao !== "uma_vez").reduce((a, t) => a + t.duracaoSegundos, 0);
  const pct = render.total ? Math.round((100 * (render.quadro ?? 0)) / render.total) : 0;

  return (
    <div className="direita">
      <div className="tela">
        {temConteudo ? (
          <Player
            key={JSON.stringify(projeto).length + estado.meta.id}
            component={Comp as React.FC<Record<string, unknown>>}
            inputProps={{ projeto }}
            durationInFrames={framesFase1(fps) + framesFase2(fps)}
            fps={fps}
            compositionWidth={W}
            compositionHeight={H}
            style={{ width: "100%", aspectRatio: `${W} / ${H}` }}
            controls
            clickToPlay
            showVolumeControls={false}
            acknowledgeRemotionLicense
          />
        ) : (
          <div className="vazio">A prévia aparece aqui quando as telas forem montadas.</div>
        )}
      </div>
      <section className="caixa painel" aria-label="Telas e render">
        <div className="linha" style={{ justifyContent: "space-between" }}>
          <h2>
            {estado.meta.nome} · {estado.meta.versao === "V1" ? "V1 · Momento Sempre Juntos" : "V3 · outras lives"}
          </h2>
          <span className="linha">
            <button
              className="botao"
              disabled={!temConteudo || render.estado === "renderizando"}
              onClick={async () => setRender(await api<Render>(`/api/projetos/${estado.meta.id}/render`, { method: "POST" }))}
            >
              Gerar MP4 (15 min)
            </button>
          </span>
        </div>
        {render.estado === "renderizando" && (
          <div style={{ margin: "8px 0 12px" }}>
            <div className="barra" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div style={{ width: `${pct}%` }} />
            </div>
            <span className="suave">
              {render.etapa === "codificando" ? "Finalizando o arquivo…" : `Renderizando: ${pct}% (${render.quadro}/${render.total} quadros)`}
            </span>
          </div>
        )}
        {render.estado === "pronto" && <p>MP4 pronto em <code>{render.arquivo}</code></p>}
        {render.estado === "erro" && <pre className="aviso" style={{ whiteSpace: "pre-wrap" }}>{render.erro}</pre>}
        <p className="suave" style={{ margin: "4px 0 10px" }}>
          Uma volta do loop: {Math.floor(loop / 60)} min {loop % 60} s · a vinheta repete o loop até 10 min e fecha com 5 min só de logo.
        </p>
        <table>
          <thead>
            <tr>
              <th>Tela</th>
              <th>Tipo</th>
              <th>Seg.</th>
              <th>Texto</th>
            </tr>
          </thead>
          <tbody>
            {telas.map((t) => (
              <tr key={t.id}>
                <td>{t.id.replace("tela_", "")}</td>
                <td>{NOME_TIPO[t.tipo] ?? t.tipo}</td>
                <td>{t.duracaoSegundos}</td>
                <td>{t.textos.titulo && t.tipo !== "tela_inicio_contagem" ? t.textos.titulo : (t.textos.corpo ?? "").split("\n\n")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 style={{ marginTop: 16 }}>Arquivos do evento</h2>
        <p className="suave" style={{ margin: 0 }}>
          {estado.arquivos.length ? estado.arquivos.map((a) => a.split("/").pop()).join(" · ") : "Nenhum arquivo enviado ainda."}
          {estado.temRedacao ? " · redação lida" : ""}
        </p>
        <button className="botao sec" style={{ marginTop: 12 }} onClick={async () => atualizar(await api<Estado>(`/api/projetos/${estado.meta.id}`))}>
          Atualizar
        </button>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  const [projetos, setProjetos] = useState<Meta[]>([]);
  const [atual, setAtual] = useState<string>(() => location.hash.slice(1));
  const [estado, setEstado] = useState<Estado | null>(null);
  const [chaveApi, setChaveApi] = useState(true);

  const carregarLista = useCallback(async () => setProjetos(await api<Meta[]>("/api/projetos")), []);
  useEffect(() => {
    carregarLista();
    api<{ chaveApi: boolean }>("/api/status").then((s) => setChaveApi(s.chaveApi));
  }, [carregarLista]);
  useEffect(() => {
    if (!atual) return setEstado(null);
    history.replaceState(null, "", `#${atual}`);
    api<Estado>(`/api/projetos/${atual}`).then(setEstado, () => setEstado(null));
  }, [atual]);

  return (
    <>
      <header className="topo">
        <h1>Estúdio de Motion</h1>
        <select value={atual} onChange={(e) => setAtual(e.target.value)} aria-label="Evento">
          <option value="">Escolher evento…</option>
          {projetos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} · {p.versao}
            </option>
          ))}
        </select>
        <NovoEvento
          criado={(m) => {
            carregarLista();
            setAtual(m.id);
          }}
        />
      </header>
      {estado ? (
        <main className="grade">
          <Chat estado={estado} atualizar={setEstado} chaveApi={chaveApi} />
          <Previa estado={estado} atualizar={setEstado} />
        </main>
      ) : (
        <main style={{ padding: 24 }}>
          <p>Escolha um evento na lista ou crie um novo (V1 para o Momento Sempre Juntos, V3 para outras lives).</p>
        </main>
      )}
    </>
  );
};

createRoot(document.getElementById("app")!).render(<App />);
