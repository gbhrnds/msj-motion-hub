# MSJ Motion Hub — Contexto Mestre

## Quem está usando isso
Produtor audiovisual e motion designer do Agibank, responsável pela criação
audiovisual de produtos de RH, governança corporativa, comunicação institucional,
marca empregadora e cultura — sempre seguindo o Brandbook oficial do Agibank.

## O que é este projeto
Hub de motion design para gerar, via código (Remotion), as vinhetas do
**Momento Sempre Juntos (MSJ)** — evento mensal híbrido do Agibank (presencial
para corporativo + transmissão online para rede e tech), onde são alinhados
resultados, estratégia e próximos passos.

Este hub substitui o fluxo manual em After Effects. O objetivo final é gerar
o vídeo pronto (mp4) a partir de um arquivo de redação, passando por uma etapa
de validação visual (storyboard estático) antes do render final.

## Regras técnicas inegociáveis
- Resolução: **1920x1080**
- Formato de entrega: **mp4**
- **Sem áudio** (vídeo mudo)
- FPS: **23,976fps**
- Ferramenta de produção: **Remotion** (React + TypeScript), renderizado via Chromium headless
- Nenhuma produção passa pelo After Effects

## Estrutura temporal da vinheta (pré-live)
A vinheta de abertura é sincronizada com o horário real do evento:

| Fase | Duração | Conteúdo |
|---|---|---|
| Fase 1 — Conteúdo | 10 minutos | Telas de conteúdo em looping (parsing da redação) |
| Fase 2 — Buffer de contingência | 5 minutos | Apenas o logo do MSJ (estático ou com wiggle sutil), sem texto, para cobrir eventuais atrasos antes da live com a MC |
| **Total pré-live** | **15 minutos** | |

Cada tela de conteúdo individual dura entre **10 e 20 segundos** (exceção: telas
com créditos/grid de nomes, como Destaques do Ciclo, podem ir até **30 segundos**), variando
conforme quantidade de informação e complexidade da animação — sempre pensando
em dar tempo de leitura confortável. Nunca estimar duração "no chute": seguir
a lógica documentada em `agents/01-parser-redacao.md`.

Periodicamente, entre telas de conteúdo, entram **telas de respiro** (tela de
aguarde, só com frase curta + logo MSJ) para quebrar a repetição do loop.
O texto das telas de respiro **vem da redação**, como qualquer outra tela: o
agente nunca escreve frase de respiro por conta própria.

## Linguagem visual (resumo — fonte completa em `brand/tokens.json`)
- Antes de montar ou revisar qualquer tela, ler `brand/boas-praticas-visuais.md`
  (aplicações do Brandbook + vinheta de Outubro + exceções aprovadas)
- **Formas nunca se sobrepõem** entre si nem invadem texto/logo/contador: declare os
  grafismos como dados e renderize com `CamadaGrafismos` (o render falha se houver conflito)
- Minimalista, fundos sólidos (uma cor de cada vez, sem gradientes)
- Fundos permitidos: azul Agibank, branco, azul médio, azul escuro e **cinza claro
  (#F3F3F3)** — este último é exceção aprovada para o MSJ (o Brandbook o restringe
  a Design System); texto sobre cinza claro sempre em azul escuro
- Logo Agibank no MSJ: versão reduzida "agi" (comunicação interna/eventos institucionais)
- Formas irregulares do Agibank, em outline e/ou preenchidas, como grafismo
  decorativo (nunca como elemento de leitura)
- Tipografia: Agibank Sans (fallback restrito: Arial, só em emergência)
- Paleta: azul Agibank é a cor-base obrigatória em toda comunicação; verde e
  amarelo só aparecem **acompanhados** do azul ou do branco, nunca sozinhos
  como fundo principal; amarelo nunca é cor de fundo
- Cantos sempre arredondados entre 12–17px (nunca retos, nunca >18px); exceção:
  **módulos grandes** (≈ meia tela ou mais) usam 30px, como no asset de módulos
- Quebra de linha: nunca artigo/preposição sozinho no fim da linha e nunca viúva
  (use `quebraBoa` de `src/brand/quebraDeLinha.ts` em todo texto de tela)
- Texto nunca sobre textura ou sobre grafismo colorido que prejudique leitura

## O que NUNCA fazer (direto do Brandbook — violação = reprovar a peça)
- Distorcer, rotacionar o logo do Agibank, separar "agi" de "bank", mudar cor fora da paleta aprovada
- Usar amarelo como cor de fundo
- Usar verde ou amarelo sem a presença do azul Agibank ou branco no layout
- Criar formas irregulares novas (só rotacionar/espelhar/escalonar as existentes)
- Aplicar textura como fundo e colocar texto ou logo por cima
- Usar combinação de cor de texto/fundo fora da tabela de contraste aprovada
- Inventar texto que não está na redação original (preservar 100% do copy)

## Fluxo de trabalho (você aciona cada agente manualmente, em sequência)
1. `agents/01-parser-redacao.md` → lê a redação (.docx convertido) + manifest de
   fotos/logos → gera `roteiro.json`
2. `agents/02-monta-roteiro.md` → roteiro.json → monta a composição Remotion
   (mapeia cada tela para um componente e define timing)
3. `agents/03-storyboard-estatico.md` → gera PNGs estáticos (1 por tela) +
   um PDF de contact sheet para sua aprovação de **layout** (sem animação ainda)
4. Você revisa, pede ajustes pontuais
5. `agents/04-qa-visual.md` → confere compliance com o Brandbook (contraste,
   cores, regras de logo, safe area)
6. `agents/05-motion-final.md` → aplica as animações finais (wiggle em
   elementos secundários, entrada de texto, timing)
7. `agents/06-render.md` → renderiza o mp4 final

Nunca pule a etapa 3 (storyboard estático) para economizar tempo — é nela que
erros de layout são pegos antes de gastar tempo/tokens com animação.
O storyboard é sempre **estático** (PNGs + PDF); não existe animatic em vídeo.

## Skills do projeto (`.claude/skills/`)
Instaladas dentro do repositório para valer em qualquer sessão. Cada agente diz
quando carregar cada uma.

| Skill | Origem | Usada em |
|---|---|---|
| `remotion-best-practices` | remotion-dev/skills | 02, 03, 05, 06 |
| `choreograph` | emilkowalski/skills | 05 (papéis e ordem dos elementos) |
| `animate` | emilkowalski/skills | 05 (curvas e propriedades) |

Regra de precedência: as skills são genéricas (web/UI). Quando uma skill
conflitar com este arquivo ou com `brand/tokens.json`, vale o projeto. Skills
de direção estética (frontend-design, taste-skill, ui-ux-pro-max,
theme-factory etc.) **não** são usadas: a direção visual é o Brandbook.

## Estrutura de pastas do projeto

```
msj-motion-hub/
├── CLAUDE.md
├── .claude/skills/     → skills de apoio (Remotion + motion), ver seção acima
├── brand/              → tokens, shapes SVG, fontes (fonte única da verdade visual)
├── agents/             → instruções de cada etapa do pipeline
├── src/                → código Remotion (componentes, motion, composição)
└── projects/
    └── AAAA-MM_tipo-de-vinheta/
        ├── redacao.docx (ou .md convertido)
        ├── manifest.json     → mapeia tela → arquivo de foto/logo
        ├── fotos/            → jpgs soltos
        ├── roteiro.json      → saída do parser
        ├── storyboard/       → pngs estáticos
        ├── storyboard.pdf
        └── render/
            └── MSJ_AAAA-MM_tipo_v1.mp4
```

## Convenção de nomes
- Pasta de projeto: `AAAA-MM_tipo-de-vinheta` (ex: `2025-11_abertura`)
- Arquivo final: `MSJ_AAAA-MM_tipo_vN.mp4`

## Quando tiver dúvida
Nunca inventar regra de marca que não está em `brand/tokens.json` ou neste
arquivo. Se faltar informação (ex: duração exata de uma tela, qual foto usar),
**perguntar antes de assumir**.