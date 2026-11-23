# Estúdio de Motion Agibank: análise, referências e passo a passo

Documentação de dois projetos feitos em novembro de 2026 para o **Momento Sempre Juntos (MSJ)**,
escrita para servir de base a um **agente de motion que trabalhe como um estúdio**: recebe o
material, analisa, propõe, anima dentro do Brandbook e entrega arquivos prontos.

| | Projeto 1 · Vinheta pré-live | Projeto 2 · Minuto Jeito Agi |
|---|---|---|
| Pasta | `projects/2025-11_abertura/` | `projects/2025-11_minuto-jeito-agi/` |
| Entrada | Redação (.docx → .md) + fotos e logos | Vídeo já editado com narração + roteiro com timecodes |
| O que o motion faz | **É** o vídeo inteiro: telas geradas do texto | **Sobrepõe** cartelas animadas a um vídeo existente |
| Duração | 15 min (10 min de loop + 5 min só logo) | 2:21.933 (a do vídeo) |
| Áudio | Mudo | Voz original preservada |
| Entregas | mp4 da V1 e da V3 (15 min cada) | mp4 completo + `.mov` só do motion com alfa (Premiere) |
| Composições | `MSJ-2025-11-Abertura-V1-Completa`, `MSJ-2025-11-Abertura-V3-Completa` | `MJA-2025-11-Final`, `MJA-2025-11-Motion-Alpha` |
| Código | `src/versoes/`, `src/components/`, `src/fases/` | `src/minuto-jeito-agi/MinutoJeitoAgi.tsx` |

### Padrões de vinheta (decisão do usuário, 2026-11-23)

| Padrão | Uso |
|---|---|
| **V1 · NuDay** | Exclusivo do **Momento Sempre Juntos** |
| **V3 · Refinado** | Padrão para **outros tipos de live** (além do MSJ). Entre eventos muda só o **logo do evento**; a duração é sempre 10 min de vinheta + 5 min de segurança |

Direção: ficar **independente do Figma**. Telas criadas e ajustadas dentro do próprio editor de
motion, sem a ida e volta pelo Figma descrita em 3.2, passo 4.

### Editor de layout sem Figma (piloto: respiro da V1)

- **Onde:** `npm run dev` → composição **`V1-Editor-Respiro`**.
- **Como:** o painel **Props**, à direita, mostra cada valor do layout:
  - forma oficial (lista com as 40 de `brand/shapes`);
  - X, Y, largura e rotação;
  - formas do morph;
  - cores (só as da paleta);
  - caixa da máscara;
  - posição e tamanho do texto.
- **Variante:** escolha `semLogo` ou `comLogo`.
- **Guias:** com `mostrarGuias` ligado, aparecem tracejadas a máscara, a caixa do texto e o contorno
  da forma.
- **Salvar:** o botão **"Salvar layout"**, no canto do quadro, grava em
  `src/versoes/v1/layout-v1.json`. É o mesmo arquivo que a vinheta usa, então a mudança vale em
  todos os renders.
- **Aviso do Studio:** a mensagem "Can't save default props" pode ser ignorada. O salvamento é
  feito pelo botão do quadro.
- **O que não se edita aqui:** o texto. Ele continua vindo da redação (`roteiro.json`). Guias e
  botão nunca aparecem no render.
- **Arquivos:** `layoutV1.ts` (schema que limita os campos ao que a marca permite) e `EditorV1.tsx`
  (composição do editor).

---

## 1. Fontes da verdade (o que o agente lê antes de qualquer coisa)

| Arquivo | Papel | Regra de uso |
|---|---|---|
| `CLAUDE.md` | Regras técnicas e de marca do hub, fluxo de agentes | Inegociável; vale mais que qualquer skill |
| `brand/tokens.json` | Cores, tipografia, formas, motion, timing | Valores marcados `"assumption"` são provisórios: confirmar com o usuário |
| `brand/boas-praticas-visuais.md` | Leitura aplicada do Brandbook + vinheta de Outubro + **§6 Exceções aprovadas** (com data) | Toda exceção nova aprovada pelo usuário é escrita aqui, com data |
| `brand/voice-guide.md` | Tom de voz | Nunca gerar nem reescrever copy; só sinalizar desvio |
| `brand/shapes/` + `src/shapesData.json` | As 40 formas irregulares oficiais | Só rotacionar, espelhar e escalonar. Nunca criar forma |
| `brand/logos/` | Logos oficiais (positivo/negativo) | Nunca recolorir, distorcer ou rotacionar |
| `brand/fonts/` | Agibank Sans (Light a ExtraBold) | Fallback Arial só em emergência |
| `agents/01…06` | Passo a passo do produto vinheta | Seguir na ordem; nunca pular o storyboard estático |

**Precedência:** as skills (`remotion-best-practices`, `animate`, `choreograph`, `motionmaxxing`) são
genéricas. Quando conflitam com o `CLAUDE.md` ou com o `tokens.json`, vale o projeto.

### Regras de marca que mais pesaram nos dois projetos

- Azul Agibank é obrigatório; verde e amarelo só com azul ou branco. Amarelo nunca é fundo.
- Fundos sólidos: azul, branco, azul médio, azul escuro e cinza claro `#F3F3F3`. O cinza claro é
  uma exceção aprovada para o MSJ, com texto em azul Agibank.
- Formas nunca se sobrepõem nem invadem texto, logo ou contador. São declaradas como dados e
  checadas (`CamadaGrafismos`, `conflitos()`). Respiro mínimo de 40 px em volta do conteúdo.
- Cantos de 12–17 px; módulos grandes (meia tela ou mais) com 30 px.
- Quebra de linha: nunca artigo ou preposição sozinho no fim da linha, nunca viúva (`quebraBoa`).
- Logo no MSJ: versão reduzida "agi". Exceções por projeto ficam registradas em §6.
- **Copy é intocável:** 100% do texto vem da redação ou do roteiro.

---

## 2. Stack técnica

| Peça | Uso |
|---|---|
| Remotion 4.0.543 + React + TypeScript | Composições, render quadro a quadro em Chromium headless |
| `remotion.config.ts` | `setPublicDir(".")`: `staticFile()` enxerga `brand/` e `projects/` direto |
| flubber | Morph entre formas oficiais (`MorphForma`) |
| @remotion/player + esbuild | Página de prévia fora do Studio (`scripts/preview/build.mjs`) |
| ffmpeg / ffprobe | Análise do vídeo, conferência de entrega, conversão para QuickTime Animation |
| `scripts/stills.mjs` | Stills em lote de uma composição (um bundle só): `node scripts/stills.mjs <comp> <pasta> <frames…>` |

**Navegador do render:** o Remotion tenta baixar o próprio Chromium, e isso pode ser bloqueado pelo
filtro corporativo. Use sempre um Chrome já instalado:

```bash
npx remotion render src/index.ts <ID> <saida> \
  --browser-executable="<caminho do Chrome>" --chrome-mode=chrome-for-testing
```

No Mac: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.

**Especificação fixa:** 1920×1080, 23,976 fps (`24000/1001`), H.264, CRF 16.
Conversão de tempo para quadro: `quadro = round(segundos × 24000 / 1001)`.

---

## 3. Projeto 1 · Vinheta pré-live (15 min)

### 3.1 Estrutura temporal

| Fase | Duração | Quadros | Conteúdo |
|---|---|---|---|
| Fase 1 | 10 min | 14.386 | Abertura com relógio (10:00) + loop de telas de conteúdo e respiros; os 10 s finais viram contagem cheia |
| Fase 2 | 5 min | 7.193 | Só o logo MSJ, com wiggle sutil, sem texto (buffer de atraso) |
| Total | 15 min | 21.579 | |

O relógio mostra o tempo real até a live e fica no canto em todas as telas.

### 3.2 Passo a passo

1. **Redação → `roteiro.json`** (`agents/01-parser-redacao.md`).
   - Converter o .docx para .md antes.
   - Cada bloco vira uma tela com `tipo`, `exibicao` e `duracaoSegundos`.
   - **Regra de duração:**
     - base de 10 s;
     - +1 s a cada 8 palavras de corpo;
     - +2 s se houver lista;
     - +3 s se houver grid de nomes;
     - +2 s se houver foto com número;
     - máximo de 20 s, ou 30 s em telas de créditos.
   - Telas de novembro:
     - `tela_00` relógio (10 s, só uma vez);
     - respiros de 10 s;
     - Destaques de 24 s;
     - Indicação de 15 s;
     - Uni Agi de 14 s;
     - Campanha de 12 s.
2. **Layout de cada tipo de tela** (`agents/02`).
   - Componentes em `src/components/Tela*.tsx`, um por tipo de tela.
   - Formas declaradas como dados (`GrafismoSpec`) com zonas livres de texto e logo.
3. **Storyboard estático** (`agents/03`): um PNG por tela + PDF, com o layout parado. É obrigatório e
   é onde os erros de layout aparecem antes de animar.
4. **Ida e volta com o Figma:** as telas foram exportadas com a geometria real do render, ajustadas
   pelo usuário no Figma e aplicadas de volta no código a partir dos SVGs (`projects/…/figma/`).
5. **QA de marca** (`agents/04`): contraste, paleta, logo, safe area, sobreposição de formas
   (`npm run checa:formas`).
6. **Três propostas de motion** sobre o mesmo conteúdo (`src/versoes/`):
   - **V1 · NuDay:** layout de transmissão, clima de evento, morph em todos os outlines e nomes do
     Destaques subindo como créditos.
   - **V2 · Módulos:** mosaico de módulos do Brandbook.
   - **V3 · Refinado:** layout aprovado com motion refinado. Foi a escolhida junto com a V1.
7. **Motion final** (`agents/05`). Ver 3.3.
8. **Montagem dos 15 min** (`src/fases/VinhetaCompleta.tsx`, `src/versoes/VersaoBase.tsx`).
   - `montarCompleta()` repete o loop até preencher 10 min.
   - A última tela, cortada pelo fim da Fase 1, segue no tempo natural e é só interrompida.
   - A tela do relógio entra dentro do loop (`relogioApos`).
   - A Fase 2 é emendada no fim.
9. **Prévia para revisão:**
   - Remotion Studio (`npm run dev`).
   - Página com @remotion/player publicada como Artifact, com imagens embutidas como data URI e
     abas por versão e capítulos.
10. **Render e entrega** (`agents/06`). Ver 3.4.

### 3.3 Linguagem de motion da V3 (referência para outros projetos)

| Elemento | Como é feito | Onde |
|---|---|---|
| Entrada de texto | Máscara: o bloco sobe de dentro da própria caixa. Sem fade | `TextReveal` (refinado) |
| Texto palavra a palavra | Intervalos que encolhem, nunca uniformes | `PalavrasReveal` |
| Módulos e fundos de texto | Revelados primeiro e inteiros; o texto só entra depois | `TelaIndicacaoMetricas`, `TelaConteudo` |
| Formas | Nascem com escala 0, sem opacidade; wiggle sutil (±3°, ±4 px, 0,15 ciclo/s) | `Grafismo`, `WiggleShape` |
| Morph | Forma oficial parada a maior parte do tempo; a troca é rápida, com ease forte | `MorphForma` (flubber) |
| Transição entre telas | A cor da próxima tela chega como forma oficial que cresce do centro e cobre o quadro. **Sem fade** | `TransicaoForma` |
| Relógio 10:00 → 09:59 | Só os dígitos que mudam rolam, da direita para a esquerda, 2 quadros entre cada um | `contagem/base.tsx` |
| Créditos (Destaques) | Janela com overflow; os nomes sobem devagar e cada linha é revelada ao passar pela base | `TelaDestaques` |

### 3.4 Render e entrega

```bash
npx remotion render src/index.ts MSJ-2025-11-Abertura-V3-Completa \
  projects/2025-11_abertura/render/MSJ_2025-11_abertura-V3_v1.mp4 \
  --codec=h264 --muted --crf=16 --concurrency=4 --browser-executable=… --chrome-mode=chrome-for-testing
```

- Cerca de 35–40 min por vídeo de 15 min com 4 núcleos; cerca de 190 MB.
- Conferir antes de entregar:

```bash
ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate,nb_frames \
  -show_entries format=duration -of compact <arquivo>
```

  Esperado: só stream de vídeo, 21.579 quadros, 900 s. Depois extrair alguns quadros com
  `ffmpeg -ss <t>` e olhar.
- Arquivos acima de 100 MB **não vão para o git** (`.gitignore`); são entregues como anexo.

### 3.5 Erros que aconteceram e a lição de cada um

| Erro | Causa | Lição para o agente |
|---|---|---|
| Render de 15 min quebrou aos 9:55 | A última tela do loop, cortada, comprimia a animação dos créditos (`inputRange` invertido) | Tela cortada roda no tempo natural. Testar o vídeo inteiro antes do render longo |
| "10 ganhadores" e bullets brancos apareciam sobre o fundo errado | O texto entrava antes do módulo; o wipe usava a tela inteira como caixa | O fundo de um texto entra primeiro e inteiro. A máscara usa a caixa do próprio elemento |
| Foto da indicação sumia na prévia | `clip-path` com `overflow` dentro de um player escalado falha em alguns navegadores | Para cortinas, preferir `overflow` + borda animada |
| Imagens quebradas no Artifact | Caminhos relativos não existiam na página publicada | Embutir imagens como data URI. Fontes ficam como arquivo |
| Contagem 10:00 → 09:59 parecia "subir tudo de uma vez" | Todos os dígitos rolavam juntos | Cascata só nos dígitos que mudam |
| Cascata com 4 quadros de atraso mostrava números falsos (10:09) | Estado intermediário visível por tempo demais | Atraso curto (2 quadros) |
| Forma que não era "caco" na V3 | Uso de forma fora do conjunto aprovado | Conferir toda forma contra `brand/shapes` |

---

## 4. Projeto 2 · Minuto Jeito Agi (motion sobre vídeo editado)

### 4.1 Insumos

- Vídeo editado `minuto-jeito-agi-novembro_v2.mp4`: 2:21.933, 3.403 quadros, voz mono AAC.
  Fica fora do git, em `projects/…/video/`.
- `roteiro.md` com as cenas por timecode, a sincronia (voz ou silêncio), o fundo, o texto, o logo e
  os cacos.
- Logos: Minuto Jeito Agi e Agibank (enviados); lockups dos pilares copiados dos assets oficiais do
  Estúdio.

### 4.2 Análise técnica (passo 1 do fluxo de motion sobre vídeo)

```bash
ffmpeg -i video.mp4 -ar 16000 -ac 1 -vn analise/audio.wav
ffmpeg -i video.mp4 -af silencedetect=noise=-30dB:d=0.3 -vn -f null - 2> analise/silences.log
ffmpeg -i video.mp4 -vf blackdetect=d=0.1:pix_th=0.10 -an -f null - 2> analise/black.log
ffmpeg -i video.mp4 -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2> analise/scenecuts.log
```

**Resultado:**
- Os pretos (0–8,3 s · 29,3–37,0 s · 61,7–71,4 s · 96,4–104,4 s) batem com as janelas das cenas
  01, 02, 03 e 04.
- A cena 05 (2:12–2:17) **não** está num preto: a cartela cobre o vídeo e a voz continua.

**Transcrição palavra a palavra:** não houve modelo disponível. O Hugging Face e os modelos do
Whisper são bloqueados, aqui e na máquina corporativa. A saída foi estimar pelo **envelope de
volume** da voz:
- `silencedetect` com d=0,06 separa as frases (0,2–3,99 · 4,41–6,45 · 6,90–8,06 s);
- dentro de cada frase, as sílabas são distribuídas proporcionalmente.

Há pequena margem de erro. Quando houver transcrição com timestamps, substituir esses tempos.

### 4.3 Roteiro em quadros

`roteiro.json` guarda cada cena com timecode, quadros, duração, sincronia, fundo, texto **exato**,
logo e formas, mais os pretos medidos. É a única fonte de tempos da composição.

### 4.4 Direção de motion ("impacto que conta a história")

Pedido do usuário: animações de impacto, profissionais, que contem uma história, **sem frases
completas paradas e sem emoção**. Referência: skill `motionmaxxing` (lista
`awesome-claude-video-skills`), arquivos `references/type.md`, `motion.md` e `transitions.md`.

| Regra | Aplicação |
|---|---|
| O texto avança em **beats** (pedaços curtos e grandes), não em frase inteira | Cada cena tem 2 ou 3 beats; um sai antes do próximo entrar |
| A palavra pousa **onde a sílaba é falada** (cenas com voz) | Abertura sincronizada com o envelope da voz, 1 quadro antes da sílaba |
| Sem voz: ritmo de fala, intervalos que encolhem e uma pausa antes da palavra-tese | Função `ritmo()` |
| **A palavra atua o sentido** | "apresentações ou falas" são riscadas em verde; "Crescer na jornada." cresce enquanto entra; "pessoas." chega grande e revela pessoas no vídeo |
| **Escala é entonação, gasta uma vez por beat** | Palavra-tese nasce maior (1,35–1,8×) e assenta sem quicar |
| Entrada desacelera, saída acelera | `softLand` / `snapSettle` na entrada; `accelExit` na saída |
| **Sem crossfade, sem fade de opacidade, sem blur** (o blur também é evitado pela marca) | Texto sobe de dentro da linha (máscara); some pela mesma máscara |
| **Transição feita com a forma da marca** | Entrada: a cor da cartela cresce como forma oficial **antes** do preto do vídeo. Saída: abre um **buraco com forma oficial** que revela o vídeo |
| Um segundo elemento vivo atrás do texto | Outline oficial morfando no canto (abertura); cacos que entram girando, respiram e saem antes do buraco |
| O fechamento é o mais rápido e seco | Logo do Minuto chega grande e assenta; a resposta termina em "**sua.**"; o logo Agibank revela da esquerda |

### 4.5 Implementação (`src/minuto-jeito-agi/MinutoJeitoAgi.tsx`)

| Peça | O que faz |
|---|---|
| `Cartela` | Janela de uma cena: forma de entrada antes do preto, fundo sólido e saída por buraco (`clip-path: path(evenodd, …)` com o contorno da forma oficial) |
| `Beat` | Um trecho da história: palavras entrando, leve push de câmera (1 → 1,05) e saída acelerada |
| `PalavraViva` | Palavra com máscara de subida, chegada grande opcional (`grande`) e risco opcional (`risca`) |
| `Cacos` | Formas oficiais no canto inferior: entram girando, respiram e saem |
| `LogoEntra` | Logo por máscara e escala uniforme (nunca distorcido) |
| `comVideo` (prop) | `true` = vídeo de base com voz (`MJA-2025-11-Final`); `false` = só o motion com fundo transparente (`MJA-2025-11-Motion-Alpha`) |

### 4.6 Render e entregas

**mp4 completo, com a voz:**

```bash
npx remotion render src/index.ts MJA-2025-11-Final \
  projects/2025-11_minuto-jeito-agi/render/MSJ_2025-11_minuto-jeito-agi_v1.mp4 \
  --codec=h264 --crf=16 --concurrency=4 --browser-executable=… --chrome-mode=chrome-for-testing
```

**`.mov` só do motion com alfa (para o Premiere).** O formato que funciona no Premiere do time é o
**QuickTime Animation (RGB+alfa)**; o ProRes 4444 do ffmpeg apareceu preto. Primeiro, a sequência PNG
com transparência:

```bash
npx remotion render src/index.ts MJA-2025-11-Motion-Alpha <pasta-png> \
  --sequence --image-format=png --concurrency=4 --browser-executable=… --chrome-mode=chrome-for-testing
```

Depois, a conversão:

```bash
ffmpeg -framerate 24000/1001 -i <pasta-png>/element-%04d.png -c:v qtrle -pix_fmt argb \
  projects/2025-11_minuto-jeito-agi/render/MSJ_2025-11_minuto-jeito-agi_motion_alpha_v1.mov
```

- **Conferir o alfa** no próprio `.mov`: extrair um quadro com cartela (alfa 255), um de transição
  (0–255) e um vazio (0).
- **No Premiere:** o `.mov` começa no quadro 0, numa trilha acima do vídeo. A duração é igual à do
  vídeo, e as saídas por forma revelam o vídeo de baixo.

**Tempos de referência:** com 4 núcleos, o mp4 com vídeo levou cerca de 12 min e a sequência PNG
cerca de 5 min.

### 4.7 Decisões tomadas sem confirmação (para validar)

- **Palavras em negrito nas cenas 01, 02 e 04.** O roteiro só diz "Light e Bold".
- **Verde nas palavras-tese:** "Jeito Agi", "pessoas.", "Agi?" e "sua.".
- **Risco verde na abertura:** recurso visual; o texto não muda.
- **Tempos das palavras da abertura:** estimados pela voz.

---

## 5. Referências

| Referência | Para quê |
|---|---|
| Brandbook Agibank v5 (fev/2025) | Formas (p.45–48), módulos (p.49–54), cor (p.39, p.47), tipografia, logo, aplicações de evento |
| Vinheta MSJ de Outubro/2026 | Precedentes: cinza claro, outline desenhado, azul + amarelo nos Destaques |
| `remotion-best-practices` (`.claude/skills/`) | Composição, sequências, stills, render, fontes locais |
| `animate` e `choreograph` (Emil Kowalski) | Curvas, papéis dos elementos, stagger decrescente |
| `motionmaxxing` (github.com/Tejashmakwana/motionmaxxing) | Tipografia cinética em beats, palavra que atua, transições com a forma da marca, sem crossfade |
| Lista `awesome-claude-video-skills` (github.com/zhuyansen) | Catálogo de skills de vídeo para escolher novas referências |
| Repositório do Estúdio (`gbhrnds/agibank-motion-hub`) | Assets oficiais (lockups do Jeito Agi), nota de entrega `.mov` para o Premiere, plataforma onde o agente vai morar |

---

## 6. Blueprint do agente "Estúdio de Motion"

### 6.1 Missão

Receber um pedido de motion da comunicação interna do Agibank e entregar arquivos de vídeo prontos
(mp4, `.mov` com alfa ou stills), dentro do Brandbook, sem inventar texto, com aprovação humana nos
pontos certos.

### 6.2 Tipos de pedido que ele reconhece

| Tipo | Entrada | Molde |
|---|---|---|
| **A · Vinheta gerada de redação** (pré-live, loops, telão) | Redação + fotos e logos | Projeto 1 |
| **B · Motion sobre vídeo editado** (quadros, depoimentos, compilados) | Vídeo com voz + roteiro com timecodes | Projeto 2 |
| **C · Lettering, GC ou cartela isolada** | Texto + duração | Projeto 2, só `comVideo: false` |

### 6.3 Etapas (cada uma com entrada, saída e portão)

| # | Etapa | Saída | Portão |
|---|---|---|---|
| 1 | **Intake:** entender o pedido, identificar o tipo, listar o que falta | Pasta `projects/AAAA-MM_<nome>/` + lista de pendências | Perguntar o que faltar (bold, entrega, áudio, logo). Nunca assumir |
| 2 | **Análise:** tipo A, contagem e durações da redação; tipo B, pretos, silêncios, cortes e transcrição | `analise/` + `roteiro.json` em quadros | — |
| 3 | **Roteiro e plano de cenas** | `roteiro.md` / `roteiro.json` com texto exato | Usuário confirma o roteiro |
| 4 | **Key Visual / storyboard estático** | Um PNG por cena + `aprovacoes.md` | **Aprovação obrigatória**, salvo quando o usuário dispensar explicitamente (como no Projeto 2) |
| 5 | **QA de marca** | Checklist 6.5 preenchido | Violação reprova |
| 6 | **Motion** | Composição Remotion + stills de pontos críticos (entrada, meio e saída de cada cena) | Revisar os stills antes do render longo |
| 7 | **Prévia** | Remotion Studio ou página com player | Usuário revisa |
| 8 | **Render** | mp4 / `.mov` | Só quando o usuário pedir |
| 9 | **Conferência e entrega** | ffprobe + quadros extraídos + arquivo anexado | Relatar o que foi verificado e o que ficou estimado |
| 10 | **Registro** | Exceções aprovadas em `boas-praticas §6`; lições neste documento | — |

### 6.4 Regras invioláveis

1. Copy intocável: nenhuma palavra criada, cortada ou reescrita.
2. Só formas de `brand/shapes` (rotacionar, espelhar, escalonar). Logos como fornecidos.
3. Formas não se sobrepõem nem invadem texto, logo ou contador.
4. Paleta e contraste do `tokens.json`; amarelo nunca é fundo; verde e amarelo sempre com azul ou
   branco.
5. Sem fade de opacidade, sem crossfade e sem blur em transição de cena: a transição é feita com
   forma da marca.
6. O fundo de um texto entra antes do texto. Nada de texto sobre fundo que ainda não chegou.
7. Nenhuma frase inteira parada sem motivo: o texto avança em beats e a palavra principal atua.
8. Vídeo de terceiros não se corta: o motion se encaixa no corte existente e entra antes do preto.
9. Exceção só com aprovação do usuário, registrada com data.
10. Entrega conferida: duração, quadros, fps, resolução, áudio (presente ou ausente, como pedido) e
    alfa, quando houver.

### 6.5 Checklist de QA antes do render

- [ ] Texto de cada cena idêntico ao roteiro (comparar caractere a caractere).
- [ ] Quebras sem preposição ou artigo no fim e sem viúva.
- [ ] Toda forma existe em `brand/shapes`; nenhuma sobreposição (`checa:formas` ou stills).
- [ ] Cores só da paleta; pares de contraste aprovados.
- [ ] Logo certo (positivo/negativo, versão), sem distorção, na posição pedida.
- [ ] Nenhum quadro com texto sobre fundo errado (stills na entrada de cada cena).
- [ ] Teste do vídeo inteiro em baixa resolução, ou stills perto de cada corte e do fim.
- [ ] Especificação: 1920×1080, 23,976 fps, codec e áudio conforme o tipo.

### 6.6 Perguntas que o agente sempre faz no intake

1. Qual é o tipo (A, B ou C) e qual é o formato de entrega: mp4 completo, `.mov` com alfa ou os dois?
2. O áudio fica (vídeo com voz) ou sai (vinheta)?
3. Quais palavras levam destaque (Bold ou cor), se o roteiro não disser?
4. Há exceção de marca necessária? Ela já está em `boas-praticas §6`?
5. O storyboard estático precisa de aprovação antes da animação, ou o usuário dispensa?

---

## 7. Pendências e riscos conhecidos

- **Transcrição automática** bloqueada (Hugging Face / Whisper). Sem ela, a sincronia com a voz é
  estimada. Vale pedir liberação ou usar um serviço aprovado.
- **Licença do Remotion:** para uso interno em escala no Agibank, é preciso a Company License.
- **Duas cópias de `brand/`** (este repositório e o workspace de pré-produção) podem divergir.
  Conferir as duas antes de assumir sincronia.
- **Render longo** (15 min ≈ 40 min por versão). Para a plataforma web, considerar render na nuvem
  (Remotion Lambda) ou máquina dedicada, e reaproveitar a Fase 2, que é sempre igual.
- **Logo Minuto Jeito Agi positivo** usa `#0064F9`, não `#0064F5`. Corrigir na origem.
