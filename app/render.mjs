// Render da vinheta completa (15 min) de um evento, em segundo plano.
// Usa a CLI do Remotion com o projeto do evento passado por --props.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { RAIZ, lerProjeto } from "./projetos.mjs";

const execucoes = new Map(); // id → { estado, quadro, total, arquivo, erro, inicio }

/** Chrome local para o render (o download do Chromium do Remotion pode ser bloqueado na rede). */
const navegador = () => {
  if (process.env.REMOTION_CHROME) return process.env.REMOTION_CHROME;
  const mac = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  return fs.existsSync(mac) ? mac : null;
};

export const statusRender = (id) => execucoes.get(id) ?? { estado: "parado" };

export const iniciarRender = (id) => {
  const atual = execucoes.get(id);
  if (atual?.estado === "renderizando") return null; // já em andamento: quem chamou mostra o status
  const proj = lerProjeto(id);
  const comp = proj.meta.versao === "V1" ? "Vinheta-V1-Completa" : "Vinheta-V3-Completa";
  const dir = path.join(RAIZ, "projects", id, "render");
  fs.mkdirSync(dir, { recursive: true });
  const props = path.join(dir, "props.json");
  fs.writeFileSync(props, JSON.stringify({ projeto: { roteiro: proj.roteiro, manifest: proj.manifest } }));
  const saida = path.join(dir, `MSJ_${id}_${proj.meta.versao}.mp4`);
  const args = [
    "remotion", "render", "src/index.ts", comp, saida,
    `--props=${props}`, "--codec=h264", "--muted", "--crf=16",
    `--concurrency=${Math.max(1, os.cpus().length - 1)}`,
  ];
  const chrome = navegador();
  if (chrome) args.push(`--browser-executable=${chrome}`, "--chrome-mode=chrome-for-testing");
  const st = { estado: "renderizando", quadro: 0, total: 0, arquivo: path.relative(RAIZ, saida), inicio: Date.now() };
  execucoes.set(id, st);
  const proc = spawn("npx", args, { cwd: RAIZ, shell: process.platform === "win32" });
  let ultimo = "";
  const ler = (buf) => {
    const txt = buf.toString();
    ultimo = (ultimo + txt).slice(-4000);
    for (const m of txt.matchAll(/Rendered (\d+)\/(\d+)/g)) {
      st.quadro = Number(m[1]);
      st.total = Number(m[2]);
    }
    if (/Encoded|Stitching/.test(txt)) st.etapa = "codificando";
  };
  proc.stdout.on("data", ler);
  proc.stderr.on("data", ler);
  proc.on("close", (codigo) => {
    st.estado = codigo === 0 ? "pronto" : "erro";
    st.fim = Date.now();
    if (codigo !== 0) st.erro = ultimo.split("\n").slice(-12).join("\n");
  });
  return { iniciado: true, ...st };
};
