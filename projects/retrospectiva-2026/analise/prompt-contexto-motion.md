# Prompt de contexto — Motion Design, Retrospectiva 2026 (Agibank / MSJ)

> Documento autocontido para briefar outra pessoa, outra IA ou outra sessão
> sobre este projeto de motion, sem precisar reconstruir o histórico. Copie
> isso inteiro como contexto antes de pedir qualquer trabalho visual novo.

## 0. Por que este documento existe

Os mockups HTML feitos até agora (`moodboard/index.html` e
`moodboard/animatic.html`) comunicam **layout e ritmo** corretamente, mas
visualmente estão feios e sem impacto. Isso não é sinal de que as decisões de
conteúdo/estrutura estão erradas — é o teto natural de um wireframe em
CSS/JS: formas geométricas planas (círculo, retângulo) nunca vão parecer
"ilustração de marca de verdade", não importa quanto se refine CSS. Ilustração
real tem textura de pintura, luz, peso de traço; tipografia real tem kerning e
peso cuidados; motion real roda a 23.976fps renderizado, não em `requestAnimationFrame`
de navegador. Este documento existe pra alguém (pessoa ou IA) com capacidade de
produzir isso de verdade pegar o contexto completo e não reinventar a análise.

## 1. Mapa de pastas — onde está cada coisa

```
/Users/gabriel.hernandes/Desktop/editor-de-videos/      ← workspace raiz
├── CLAUDE.md                                            ← fluxo de trabalho completo, ler primeiro
├── brand/                                                ← fonte da verdade de marca (Agibank/MSJ)
│   ├── tokens.json                                       ← cores, tipografia, formas, motion, logo — machine-readable
│   ├── boas-praticas-visuais.md                          ← regras destiladas do Brandbook + decisões do usuário com data
│   │     §1 formas irregulares · §1.1 fundo sempre sólido, sem degradê (NOVO, 2026-11-23)
│   │     §2 módulos · §2.5 tipografia cinética · §2.6 ilustrações (NOVO, ver capítulo p.68-74 do Brandbook)
│   │     §3 tipografia · §4 logo · §5 vinheta de Outubro · §6 tabela de exceções aprovadas (com data)
│   ├── voice-guide.md                                    ← tom de voz — nunca reescrever copy
│   ├── estilo-tipografia-cinetica.md                     ← como o texto entra em tela (fade+scale, palavra a palavra)
│   ├── Agibank_Brandbook_Fevereiro_25_v5.pdf             ← Brandbook oficial completo, 101 páginas
│   ├── fonts/        Agibank Sans, todos os pesos, .woff2
│   ├── icons/        ícones oficiais (preenchido, cantos arredondados, traço humanizado, grid 24×24)
│   ├── logos/        logos de programa, positivo/negativo
│   └── shapes/       ÚNICAS formas permitidas: pentagon-01..07, quadrilateral-01..23, triangle-01..10 (só rotate/mirror/scale)
├── projects/
│   ├── minuto-jeito-agi-novembro/                        ← projeto irmão, MESMO TIPO (motion sobre vídeo editado com narração própria)
│   │   └── storyboard/*.png + aprovacoes.md              ← Key Visuals REAIS já renderizados e aprovados nesta marca — referência
│   │                                                        de "como fica de verdade" quando sai do wireframe (ver antes de julgar
│   │                                                        se o estilo da marca "tem como" ter impacto — aqui tem precedente que sim)
│   └── retrospectiva-2026/                               ← ESTE projeto
│       ├── roteiro.md                                    ← plano de cenas, 34 cenas / 6 atos, copy 100% preservado da redação
│       ├── plano/scene-plan.json                         ← mesma coisa, estruturado
│       ├── roteiro-conteudo-retrospectiva-2026.docx       ← doc original da redação (fonte do roteiro.md)
│       ├── referencia/                                    ← material de referência Nu/Nubank
│       │   ├── nubank-welcome-to-nu.mp4                   ← vídeo de referência (238s, "Welcome to Nu")
│       │   ├── referencia-motion-nubank.md                ← análise técnica completa (reproduzida na seção 3 abaixo)
│       │   └── frames-referencia/                         ← 6 frames extraídos ilustrando a análise
│       ├── analise/
│       │   ├── estudo-viabilidade-brandbook.md            ← cruza o Brandbook completo (101p) com roteiro + referência Nu
│       │   └── prompt-contexto-motion.md                  ← ESTE arquivo
│       └── moodboard/                                     ← mockups HTML (o que está "feio, sem impacto" — ver seção 5)
│           ├── index.html        storyboard estático das 15 telas de motion
│           ├── animatic.html     player animado, 46 beats em sequência
│           └── assets/fonts/     cópia das fontes da marca
└── (fora daqui) ~/Desktop/msj-motion-hub/                ← repo IRMÃO, separado — é onde a implementação Remotion de verdade mora
    ├── src/brand/      BrandShape, Logo, theme, quebraDeLinha, grafismos/conflitos (checker automático de sobreposição)
    ├── src/motion/     CamadaGrafismos, GrafismosPorAto, MorphForma, TextReveal, PalavrasReveal, WiggleShape, TrocaDeForma, OutlineDesenhado
    └── src/components/Tela*.tsx   telas prontas de OUTRO produto (vinheta pré-live) — referência de padrão de código, não de layout
```

## 2. Estado atual / pendências reais (não assumir resolvido)

- **Vídeo editado da Agibank não foi entregue** — o roteiro cita brutos por
  nome (`AGI2501-Opus_RS-E25-TW-Delivery.mp4`, campanhas, NYSE, mídia), mas não
  existe corte fechado. Sem ele, não há timing real nem passo 1 (análise
  técnica: silêncios/blacks/cortes de cena).
- **2 inconsistências numéricas no roteiro**, sinalizadas e não corrigidas:
  cena-08 "Clientes ativos" vem com cifrão R$ (provável erro — clientes é
  contagem); cena-19 "Lucro líquido" cai de R$210,5mi pra R$8,3mi mas está
  marcado como alta de 31%, e "Ratings" repete os valores de "Carteira de
  crédito" da cena-08.
- **3 blocos de conteúdo vazios**: Agi+ (cena-10, "usar o mesmo gráfico do
  relatório de resultados"), números de IA (cena-24), valores de
  Inscritos/Efetivados e Horas/Qtd. (cena-15).
- **4 ilustrações com exceção de marca já aprovada** pelo usuário em
  2026-11-23 (`boas-praticas-visuais.md` §6): lojas se fundindo (cena-04),
  multidão acendendo (cena-12), mapa-múndi (cena-17 — viabilidade fraca, zero
  precedente no Brandbook), robô mascote **ou** alternativa oficial da p.72 do
  Brandbook (cena-22 — decisão adiada para o storyboard, ainda em aberto).
- **Logo de encerramento confirmado centralizado** (precedente
  minuto-jeito-agi-novembro), não o canto inferior direito da regra geral.

## 3. Análise detalhada do vídeo de referência (Nu/Nubank) — na íntegra

Fonte: "Welcome to Nu | The Story Behind a Digital Financial Services
Platform", canal oficial Nu, 2026-10-15, 3min58s, 1920×1080, baixado como
referência de **técnica de motion/montagem** — nunca cor/forma/logo/copy da Nu.

### 3.1 Estrutura e ritmo de montagem
59 cortes de cena em 238s (~4s/corte em média), mas distribuição desigual —
esse é o dado mais importante. Alterna **planos longos** (5–15s, entrevistas
sustentadas sem corte) com **rajadas de corte rápido** (5 a 8 cortes em 2–3s)
usadas como pontuação rítmica em momentos estruturais específicos:
~15.3–17.7s (gancho de abertura), ~119.2–127.1s (início do histórico),
~145.4–147.4s (a mais densa — 8 cortes em 2s, coincide com um wipe de cor
sólida), ~211.2–219.5s (reta final). Fora das rajadas, o filme respira em
planos de entrevista normais. **Zero frames pretos** — nunca fade-to-black;
transições são corte seco, crossfade leve ou wipe de cor sólida. Estrutura em
5 atos: gancho (0–18s) → valores/cultura (18–115s) → linha do tempo
(115–150s) → marcos/crescimento (150–210s) → produto hoje + encerramento
(210–238s).

### 3.2 Áudio e sincronismo
Silêncios de fala só em dois pontos (91.7–103.9s e um de 0.63s no fim). Os
cortes rápidos **não são guiados por pausa de fala** — parecem guiados por
batida de trilha musical (convergência de rajada de corte com marcos de
tempo a cada ~16s/120s/146s/212s).

### 3.3 Paleta e color grading
Sem grading cinematográfico forte (sem teal&orange, grain, vinheta). Imagem
ao vivo é naturalista. **Toda a personalidade visual vem da camada gráfica**:
cartões de texto, gráficos e mockups de UI usam o roxo de marca em bloco
sólido (nunca degradê) com branco por cima — "uma cor de marca dominante
aplicada em bloco sólido" sobre fotografia sem tratamento especial.

### 3.4 Tipografia e kinetic typography
Sans-serif geométrica arredondada, bold/extrabold, só preenchimento. Dois
padrões de cartão de palavra: palavra única centralizada em fundo full-bleed;
duas palavras empilhadas em fundo claro com barra superior fina. **A palavra
aparece inteira e estática logo após o corte — sem revelação progressiva**
(isso é o oposto do padrão que este workspace já define para a Agibank, ver
§3.7 abaixo — não copiar). Nome de entrevistado: texto branco direto sobre a
imagem, sem placa, alinhado à esquerda.

### 3.5 Elementos gráficos e overlays (com timestamp)
- Colagem de prova social (~25.6s): capas de revista flutuando com sombra, estilo "scrapbook" editorial.
- Cartão de ano (~119.2s): número gigante centralizado, fundo liso, sem mais nada.
- Retrato emoldurado por grafismo de rede — pontos conectados por linhas (~123.5s).
- Mapa de presença como matriz de pontos, dot map (~87.2s).
- Gráfico de bolhas proporcional ao valor (~157.1s): "10M/5 Years" vs "1M/2 Years".
- Colagem de arquivo empilhada, cantos arredondados + sombra (~166.6–175.6s): sino da NYSE, Times Square.
- Mockup de app real em fundo full-bleed (~211.3s).
- Callout de botão de UI isolado com glow discreto (~216.9s).
- Bumper de logo full-screen como "cortininha" de capítulo (~63.3s).
- Logo se construindo a partir de fragmentos soltos no encerramento (~232.8s).

### 3.6 Efeitos visuais
Nada pesado (sem glitch/chromatic aberration/double exposure). Só: wipe de
cor sólida (barra chapada desliza cobrindo o quadro — a transição de maior
assinatura do filme), sombra suave em cards/fotos flutuantes (nunca em
texto/logo), glow discreto atrás de UM elemento de UI.

### 3.7 Leitura crítica — o que é aplicável à Agibank e o que não é

| Técnica da Nu | Classificação | Por quê |
|---|---|---|
| Cartão de palavra full-bleed em cor de marca | ⚠️ adaptável | Ideia compatível (`colorCombosPermitidas`), mas a Nu revela a palavra pronta no corte — a Agibank **exige** entrada fade+scale por palavra (`estilo-tipografia-cinetica.md`). Não copiar o corte seco. |
| Nome do entrevistado, texto simples sem placa | ✅ direto | Sem conflito de regra. |
| Wipe de cor sólida como transição de capítulo | ⚠️ adaptável | Alinhado ao gosto por fundo chapado; trocar roxo/verde-água por azulAgibank/azulMedio/verde, dentro de `colorCombosPermitidas`. |
| Bumper de logo full-screen entre capítulos | 🚫 precisa exceção | Regra geral manda logo no canto; única exceção hoje é encerramento centralizado, não interstício no meio. |
| Logo se montando em fragmentos soltos | 🚫 não aplicável sem aprovação | Fere `logo.naoFazer` ("separar Agi de bank", alterar proporção/posição das letras) enquanto os pedaços estão soltos. |
| Gráfico de bolhas proporcional | 🚫 / ⚠️ forte adaptação | Círculo não é forma oficial (`shapes.proibido: criar forma nova`). Usar número grande + rótulo (`typeScaleVideo.destaqueNumero`) em vez de bolha. |
| Mapa de pontos (dot map) | 🚫 não aplicável | Mesmo problema — ponto como unidade gráfica não é forma oficial. |
| Grafismo de rede (pontos+linhas) | 🚫 / ⚠️ adaptação | Vocabulário novo fora das formas oficiais; usar o padrão já existente "4-6 formas ao redor do título". |
| Colagem de arquivo em cards com sombra solta | ⚠️ adaptável | Cantos arredondados ok, mas módulos da marca exigem divisão interna diagonal — adaptar pra módulo real, não copiar "scrapbook" literal. |
| Mockup de app em fundo full-bleed | ✅ direto | Sem conflito, desde que a cor de fundo seja aprovada. |
| Glow atrás de UI isolada | ⚠️ cautela | Regra evita "blur/glow" em transição; não é bem o mesmo caso, mas perguntar antes. |
| Alternância plano-longo / rajada-rápida | ✅ direto | Pura técnica de ritmo, sem componente de marca. |
| Cartão de número grande centralizado em marco | ✅ direto, já tem padrão equivalente | Idêntico ao padrão já documentado (`referenciasVinheta.countdown.hero`). |

**Resumo**: os ganhos realmente aproveitáveis da Nu são de **ritmo e
estrutura** (plano-longo/rajada amarrada a viradas, wipe de cor sólida,
cartão numérico de marco) — nada disso exige inventar nada visualmente novo.
Os elementos mais vistosos (mapa de pontos, rede, bolha, logo em pedaços,
bumper de logo) esbarram em regras já registradas da marca.

## 4. O roteiro da Agibank — estrutura e sinergia com a referência

O roteiro (`roteiro.md`, 34 cenas) se organiza em **6 atos amarrados por um
refrão**: *"Quando a gente tem propósito, a gente..."*, dito alternadamente
por Marina (Zelante) e Piu (Matheus Piuzana), sempre abrindo um bloco
temático novo:

1. **Abertura** — gancho institucional (b-roll + locução).
2. **Propósito & Clientes** — NPS, Reclame Aqui, ranking BCB, clientes
   ativos, carteira de crédito, funding, FIDC.
3. **Pessoas** — estágio/devs, treinamento, Tô de Dono, reconhecimentos.
4. **Resultados do negócio** — lucro líquido, market share, ratings,
   reconhecimento internacional (Top Fintechs).
5. **Inteligência/IA** — big numbers de IA.
6. **NYSE** — recortes de mídia (G1, Bloomberg, Forbes, Letsmoney...).
7. **Encerramento** — reflexão final + "Nos vemos em 2027!" + logo.

**Sinergia direta com a referência Nu** (o que já foi mapeado cena a cena):
- O refrão de Marina/Piu = exatamente o papel do "plano longo" da Nu — câmera
  limpa, sem grafismo, pontuando a virada de assunto.
- Cada rajada de cards de métrica (NPS→Reclame Aqui→Ranking BCB, por
  exemplo) = a "rajada de corte rápido" da Nu, só que com cards de dado em
  vez de corte de plano.
- As transições entre atos (cena-04 lojas, cena-12 multidão, cena-17 mapa,
  cena-22 robô) são o equivalente ao **wipe de cor sólida** e ao **bumper de
  capítulo** da Nu — já adaptados (wipe sim, bumper de logo full-screen não,
  por regra de marca).
- Os 3 blocos do roteiro marcados "gráfico" (ranking BCB, treinamento,
  lucro líquido) foram deliberadamente tratados como o mesmo card de métrica
  dos "comparativo" — **porque nem a Nu (de fato) nem o Brandbook da Agibank
  têm uma linguagem real de gráfico de dado**; a Nu usa bolha/mapa de pontos
  (não aplicável aqui), e o Brandbook só tem número+rótulo.
- As colagens de mídia (cena-21, 29, 30 — logos de imprensa) ecoam a seção de
  "prova social"/colagem de arquivo da Nu (~25.6s e ~166s) — mesma ideia de
  densidade de logos para transmitir credibilidade, adaptada pra módulo
  oficial em vez de "scrapbook" com sombra solta.

## 5. Diagnóstico — por que o mockup atual está "feio, sem impacto"

`moodboard/index.html` e `moodboard/animatic.html` são HTML/CSS/JS puro,
sem build, sem lib de design. Eles **comunicam corretamente** layout
(onde cada elemento fica) e ritmo (quando cada coisa entra, por quanto
tempo). O que eles **não têm, e estruturalmente não podem ter**:
- Ilustração de verdade (as 4 cenas de exceção hoje são formas geométricas
  planas — círculo, retângulo — não a "pintura gestual com luz solar e
  volumes marcados" que o próprio capítulo de Ilustrações do Brandbook
  (p.68-74, documentado em `boas-praticas-visuais.md` §2.6) define como
  estilo da marca).
- Tipografia com peso de verdade (kerning, otimização óptica) — é só a
  fonte web carregada sem nenhum tratamento.
- Renderização em frame rate real (23.976fps) com motion blur, só CSS
  `animation` de navegador.
- Qualquer prova de que isso funciona nesta marca já existe:
  `projects/minuto-jeito-agi-novembro/storyboard/*.png` são Key Visuals
  **reais**, renderizados em Remotion e aprovados — vale abrir esses PNGs
  antes de concluir que "o estilo da marca não tem impacto": o problema é o
  meio (wireframe HTML), não o sistema de marca.

## 6. O que precisa acontecer pra ter impacto de verdade

1. **Arte real para as 4 ilustrações de exceção** (lojas, multidão, mapa,
   robô/alternativa) — produzida por ilustrador humano ou geração de imagem
   fiel ao estilo documentado em `boas-praticas-visuais.md` §2.6 (personagens
   com proporção realista, diversidade de tons de pele, pintura gestual, luz
   solar, paleta Agibank + neutros), não formas geométricas genéricas.
2. **Implementação real em Remotion**, em `~/Desktop/msj-motion-hub`,
   reaproveitando `TextReveal`/`PalavrasReveal`/`MorphForma`/`WiggleShape`
   já existentes — não mais HTML/CSS. Esse repo ainda não tem uma composição
   para este tipo de projeto (motion sobre vídeo com narração própria); ela
   precisa ser criada lá, só depois do roteiro estar fechado (pendências da
   seção 2 resolvidas).
3. Seguir o fluxo documentado em `CLAUDE.md`: passo 2.5 (Key Visual estático
   aprovado via `/gerar-storyboard`) **antes** de qualquer timing de
   animação — é o mesmo processo que já produziu os PNGs reais de
   `minuto-jeito-agi-novembro`.

## 7. O que pedir de quem receber este prompt

Se o objetivo é conseguir um visual de impacto de verdade (não mais um
wireframe), o pedido concreto é: **gerar/desenhar as 4 ilustrações de
exceção no estilo documentado na seção 6.1**, e/ou **montar a primeira
composição Remotion real de uma das cenas do roteiro** (seção 4), usando os
tokens/regras de `brand/tokens.json` e `brand/boas-praticas-visuais.md` como
fonte de verdade — não os mockups HTML de `moodboard/`, que são só
referência de layout/ritmo, nunca de acabamento visual.
