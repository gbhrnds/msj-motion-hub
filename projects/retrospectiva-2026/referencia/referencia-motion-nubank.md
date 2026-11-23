# Análise de referência: "Welcome to Nu" (Nubank) — motion design e montagem

**Fonte:** "Welcome to Nu | The Story Behind a Digital Financial Services Platform",
canal oficial **Nu** (Nubank), publicado em 2026-10-15, 3min58s (238s), 1920x1080,
~23.976fps, codec AV1. Baixado de `https://youtu.be/_eZgPcmzjw8` como **referência
de motion design e montagem** para a retrospectiva 2026 da Agibank/MSJ — **não é
o vídeo final do projeto**, e nenhum elemento de marca/texto/logo da Nu deve ser
copiado, só os padrões de técnica descritos abaixo.

Seis frames ilustrativos ficam em `analise/frames-referencia/` para consulta
rápida, numerados conforme as seções abaixo.

## 1. Estrutura e ritmo de montagem

O filme tem **59 cortes de cena** em 238s (média de ~4s/corte), mas a distribuição
é muito desigual — esse é o dado mais importante da análise. A montagem alterna
dois modos:

- **Planos longos** (5–15s): entrevistas de fundadores/executivos falando direto
  pra câmera, sustentados sem corte.
- **Rajadas de corte rápido** (5 a 8 cortes em 2–3 segundos): usadas como
  "pontuação" rítmica em momentos estruturais específicos, não espalhadas
  uniformemente. Identificadas em:
  - **~15.3–17.7s** — rajada de abertura (gancho): intercala falas + capas de
    imprensa/revista.
  - **~119.2–127.1s** — início do bloco de histórico/timeline.
  - **~145.4–147.4s** (a mais densa: 8 cortes em 2s) — clímax do bloco de
    valores, coincide com a transição de wipe de cor sólida (seção 5).
  - **~211.2–219.5s** — reta final, bloco de produto/presente.

Fora dessas rajadas, o filme respira em planos de entrevista normais. Não há
**nenhum frame preto** detectado (`blackdetect` zerou) — a Nu nunca usa fade-to-
-black como transição; usa corte seco, crossfade leve entre tomadas do mesmo
entrevistado, ou o wipe de cor sólida (seção 5).

**Estrutura narrativa em 5 atos** (inferida pelo conteúdo dos frames):
1. **0–18s** — Gancho: entrevistas + prova social (imprensa) intercaladas rápido.
2. **18–115s** — Valores/cultura: entrevistas de fundadores + cartões de palavra
   (kinetic typography) + mapa de presença geográfica.
3. **115–150s** — Linha do tempo/história: ano de fundação, métricas, bloco de
   valores com transição de cor.
4. **150–210s** — Marcos e crescimento: gráfico de estatística, colagem de
   arquivo (imprensa, IPO, NYSE).
5. **210–238s** — Produto hoje + encerramento: telas de app, evento ao vivo,
   fala final, logo se construindo.

## 2. Áudio/narração e sincronismo com a imagem

`silencedetect` (-30dB, 0.3s) só aparece em dois lugares: um cluster de pausas
curtas entre **91.7s e 103.9s** (uma entrevistada falando em frases curtas,
sincronismo labial — som direto, não VO) e um silêncio final de 0.63s bem no
fim (237.6–238.2s), compatível com um fade-out de trilha. Fora isso, o áudio
é contínuo (trilha + narração/depoimentos sobrepostos) por quase todo o filme —
ou seja, os cortes rápidos descritos acima **não são guiados por pausas de fala**,
são guiados por **batida de trilha musical**, que não conseguimos extrair
diretamente, mas a convergência entre rajada de corte e marca de tempo sugere
um "hit" de música a cada bloco (~16s, ~120s, ~146s, ~212s).

## 3. Paleta de cores e color grading

Sem tratamento de cor "cinematográfico" forte (nada de teal&orange, grain
pesado ou vinheta) — a imagem ao vivo (entrevistas, escritório) tem grading
naturalista, tons de pele fiéis, levemente quente. **Toda a personalidade
visual vem da camada gráfica**, não da fotografia: cartões de texto, gráficos
de dado e mockups de UI usam o roxo de marca da Nu como cor de fundo quase
universal (chapado, sem gradiente), com branco para texto/formas. É
essencialmente um sistema de "uma cor de marca dominante aplicada em bloco
sólido" por cima de imagem real sem tratamento especial.

## 4. Tipografia e kinetic typography

Fonte sans-serif geométrica arredondada, peso bold/extrabold, só preenchimento
(sem contorno, sem sombra). Dois padrões de cartão de palavra observados
(frames 1 e 4):
- **Palavra única centralizada** ("Intuitive") em fundo roxo full-bleed, branco.
- **Duas palavras empilhadas** ("Customer" / "Centricity") em fundo bege/creme
  com barra superior roxa fina, texto roxo, alinhado à esquerda, com um ponto
  decorativo pequeno abaixo.

Nos frames amostrados (40ms de intervalo), a palavra já aparece **inteira e
estática** logo após o corte — não há evidência de revelação progressiva
(letra a letra ou palavra a palavra) nesses instantes; a entrada parece ser
corte seco direto pro texto já em estado final, ou um fade tão rápido (<40ms)
que não foi capturado. Isso é relevante porque é o oposto do padrão que este
workspace já usa (ver seção 7).

Textos sobre vídeo (nome de entrevistado) seguem um padrão simples e repetido:
texto branco direto sobre a imagem (sem fundo/placa), alinhado à esquerda,
duas linhas quando tem cargo ("Edward Wible / Co-Founder, Distinguished
Software"), uma linha quando é só nome ("David", "Cristina").

## 5. Elementos gráficos e overlays

- **Colagem de prova social** (~25.6s, frame 2): capas de revista e produto
  (cartão Nu) flutuando com sombra suave sobre fundo cinza-claro, em
  composição assimétrica, sem grade rígida — tratamento "editorial/scrapbook".
- **Cartão de ano** (~119.2s, frame 3): número gigante ("2010") roxo sobre
  fundo branco, centralizado, sem nenhum outro elemento — marco de linha do
  tempo.
- **Retrato emoldurado com grafismo de rede** (~123.5s): foto de entrevistado
  dentro de um cartão com cantos arredondados e sombra, cercado por um motivo
  gráfico abstrato de **pontos conectados por linhas** (estética "rede/dado"),
  sobre fundo branco.
- **Mapa de presença** (~87.2s): mapa do Brasil/América do Sul construído como
  **matriz de pontos (dot map)**, brancos sobre cinza, com 2-3 pontos
  destacados em roxo — visualização de dado usando pontos como unidade.
- **Gráfico de bolhas proporcional** (~157.1s, frame 5): dois círculos de
  tamanho proporcional ao valor ("10M / 5 Years" grande, "1M / 2 Years"
  pequeno), roxo sobre branco — clássico "stat reveal" de crescimento.
- **Colagem de arquivo empilhada** (~166.6–175.6s, frame 6): fotos/vídeos de
  bastidores (sino de abertura da NYSE, 09/dez/2021; outdoor em Times Square)
  em cartões de canto arredondado com sombra, empilhados verticalmente sobre
  fundo cinza-claro — mesmo tratamento "scrapbook" da seção de imprensa.
- **Mockup de app real** (~211.3s): print/gravação de tela do app Nu dentro de
  um frame de celular, centralizado sobre fundo roxo full-bleed.
- **Callout de elemento de UI isolado** (~216.9s): botão "Send" (pílula roxa,
  texto branco) isolado e ampliado sobre fundo branco, com um leve glow/pulso
  atrás do texto.
- **Bumper de logo** (~63.3s): quadrado roxo full-bleed com o wordmark "nu"
  branco centralizado — funciona como uma "cortininha" de troca de capítulo.
- **Construção do logo no encerramento** (~232.8s): dois fragmentos
  retangulares roxos soltos sobre fundo quase branco, no instante de montagem
  — o vídeo termina com o logo se construindo a partir de peças soltas.
- O wordmark "nu" também aparece **constantemente no cenário físico**
  (escritório, parede, telão do evento) como still de produção, não como
  overlay — reforço de marca "ambiental", não gráfico.

## 6. Efeitos visuais

Nenhum efeito "pesado" (sem grain, glitch, chromatic aberration ou double
exposure). Os únicos tratamentos não-fotográficos são:
- **Wipe de cor sólida**: uma barra de cor chapada (roxo ou verde-água) desliza
  verticalmente cobrindo o quadro por completo antes de revelar a cena
  seguinte — confirmado em ~145.4–147.4s, coincidindo com a rajada de corte
  mais densa do filme (frame 4). É a transição de maior "assinatura" do vídeo.
- **Sombra suave (drop shadow)** em cartões/fotos flutuantes sobre fundo
  neutro (seções de imprensa e arquivo) — nunca em texto ou logo, só em
  fotografia/produto.
- **Glow/pulso discreto** atrás de um elemento de UI isolado (botão "Send").

## 7. Leitura crítica: o que é replicável dentro da marca Agibank/MSJ e o que não é

Baseado em `brand/tokens.json` e `brand/boas-praticas-visuais.md`. Nenhuma
destas classificações aprova uma exceção sozinha — onde eu sinalizo 🚫 ou ⚠️
com necessidade de exceção, a decisão é do usuário e, se aprovada, precisa ser
registrada em `boas-praticas-visuais.md` §6 com data.

| Técnica da Nu (timestamp) | Classificação | Por quê |
|---|---|---|
| Cartão de palavra full-bleed em cor de marca (16.1s) | ⚠️ **adaptável** | A ideia (palavra grande, fundo de marca, texto branco) é compatível com `colorCombosPermitidas` ("branco sobre azulAgibank"). Mas a Nu revela a palavra já pronta no corte; o projeto Agibank **exige** entrada fade + leve crescimento de escala, por palavra/bloco (`estilo-tipografia-cinetica.md`, `tokens.motion.textReveal`) — não copiar o corte seco da Nu, manter a entrada já definida para este workspace. |
| Nome do entrevistado em texto simples, sem placa, canto inferior esquerdo (39.7s) | ✅ **aplicável direto** | Não conflita com nenhuma regra de marca; é só uma escolha de lower-third. Usar Agibank Sans em peso institucional (Medium/Bold) e combinação de cor aprovada para o fundo em questão. |
| Wipe de cor sólida como transição de capítulo (145–147s) | ⚠️ **adaptável** | Bem alinhado ao gosto da marca por fundos chapados (`boas-praticas-visuais.md` evita é "blur/glow", não wipe sólido). Trocar as cores da Nu (roxo/verde-água) por `azulAgibank`, `azulMedio` ou `verde` — sempre dentro de `colorCombosPermitidas`, nunca amarelo como maior área. |
| Bumper de logo full-screen como "cortininha" entre capítulos (63.3s) | 🚫 **precisa de exceção aprovada** | A regra geral (§4) manda logo no canto inferior direito; a única exceção hoje registrada (2026-11-19) é logo centralizado **no encerramento**, não como interstício no meio do vídeo. Usar isso como transição recorrente exigiria uma exceção nova em §6 — sinalizar ao usuário, não decidir. |
| Logo se construindo a partir de fragmentos soltos no encerramento (232.8s) | 🚫 **não aplicável sem aprovação** | O logo Agibank proíbe explicitamente "alterar proporção/espaçamento/posição das letras" e "separar Agi de bank" (`tokens.json.logo.naoFazer`). Uma animação que mostra o logo em pedaços soltos, mesmo que monte no final, esbarra nessa regra enquanto os pedaços estão separados. Só com aprovação explícita e registro em §6. |
| Gráfico de bolhas proporcional ao valor (157.1s) | 🚫 **não aplicável como está / ⚠️ com adaptação forte** | Círculo simples não é uma forma oficial da marca (`brand/shapes/` só tem `pentagon-*` e `quadrilateral-*`); usar um círculo "inventado" fere `shapes.proibido: "criar forma nova"`. A ideia de **número grande + rótulo curto** já existe no brand (`tokens.typography.typeScaleVideo.destaqueNumero`, módulos com "número enorme + rótulo curto") — recriar o conceito de destaque numérico com as formas oficiais ou como card tipográfico puro, não como bolha redonda. |
| Mapa de presença como matriz de pontos (dot map) (87.2s) | 🚫 **não aplicável como está** | Mesmo problema: pontos/círculos como unidade gráfica não são forma oficial. Se o roteiro precisar comunicar presença geográfica, resolver com tipografia/número ou com as formas oficiais, não com um mapa pontilhado novo. |
| Grafismo de "rede" (pontos conectados por linhas) emoldurando retrato (123.5s) | 🚫 **não aplicável como está / ⚠️ com adaptação** | É um vocabulário gráfico novo (linhas + nós) fora das formas oficiais. O equivalente já documentado no brand é a composição "ao redor do título" (4–6 formas oficiais de tamanhos variados ao redor do conteúdo, `boas-praticas-visuais.md` §1) — usar esse padrão existente em vez de inventar o motivo de rede. |
| Colagem de arquivo/imprensa em cartões de canto arredondado com sombra, empilhados (25.6s e 166–176s) | ⚠️ **adaptável** | Cantos arredondados estão dentro da faixa aprovada (12–17px, ou 30px para módulo grande). Mas os módulos da marca exigem **divisões internas diagonais** e bordas externas retas (`boas-praticas-visuais.md` §2) — o tratamento "cartão flutuante com sombra solta" da Nu não segue essa construção. Adaptar para módulos reais (diagonal, sem sombra solta — sombra não é citada como proibida em foto, mas não é o padrão do brand) em vez de copiar o estilo "scrapbook" literal. |
| Mockup de app real em fundo de marca full-bleed (211.3s) | ✅ **aplicável direto** | Sem conflito de regra — é só fundo de marca + produto, desde que o fundo use uma cor aprovada (`azulAgibank`, `branco` etc.) e, se houver logo visível na UI, ele não seja distorcido/recolorido. |
| Glow/pulso atrás de botão de UI isolado (216.9s) | ⚠️ **cautela** | `boas-praticas-visuais.md` cita "evitar transição com blur/glow (leitura suja)" especificamente para transições; um glow estático atrás de um elemento não é uma transição, mas é prudente perguntar ao usuário antes de usar, já que o espírito da regra é evitar "leitura suja". |
| Alternância de planos longos de entrevista com rajadas de corte rápido pontuando momentos estruturais (ritmo geral) | ✅ **aplicável direto** | É puramente uma técnica de montagem/ritmo, sem componente de marca — totalmente transferível, desde que o material bruto do projeto permita (checar quantidade de ângulos/cortes disponíveis no vídeo editado de origem). |
| Cartão de ano/número grande centralizado em marco de linha do tempo (119.2s) | ✅ **aplicável direto, já existe padrão equivalente** | Praticamente idêntico ao padrão já documentado em `referenciasVinheta.countdown.hero` ("número grande centralizado em branco, com forma outline ao redor") — só usar o padrão que o workspace já tem, com a forma outline oficial no lugar do fundo liso da Nu. |

### Resumo da seção 7
Os ganhos realmente aproveitáveis da Nu são de **ritmo e estrutura** (alternância
plano-longo/rajada-rápida amarrada a momentos de virada, wipe de cor sólida como
transição de capítulo, cartão numérico de marco histórico) — tudo isso não
depende de inventar nada visualmente novo. Os elementos que mais chamam atenção
visualmente (mapa de pontos, grafismo de rede, bolha proporcional, logo se
montando em pedaços, bumper de logo full-screen) esbarram em regras já
registradas no brand (proibição de forma nova, regra de logo) e precisam de uma
conversa explícita com o usuário antes de qualquer adoção — não foram aprovados
aqui.

## 8. Timestamps de referência (índice rápido)

| Tempo | O que acontece | Tipo de tratamento |
|---|---|---|
| 0–7s | Entrevistas (David, Cristina) | Plano de entrevista, nome em lower-third |
| ~7–18s | Rajada: chyron de TV (Bloomberg), reentrada de falas | Corte rápido, prova social |
| ~16s | Cartão "Intuitive" | Kinetic typography, fundo roxo full-bleed |
| ~25.6s | Capas de revista/produto flutuando | Colagem editorial, sombra suave |
| ~39.7s | Edward Wible, entrevista | Lower-third 2 linhas (nome + cargo) |
| ~57–63s | Bumper "nu" | Logo full-screen, transição de capítulo |
| ~87.2s | Mapa de presença (dot map) | Visualização de dado, matriz de pontos |
| ~91.7–103.9s | Entrevista com pausas de fala | Som direto, sem rajada de corte |
| ~105–147s | Cartões "Customer" / "Centricity" | Kinetic typography, 2 variações de fundo |
| ~119.2s | Cartão "2010" | Marco de linha do tempo, número grande |
| ~123.5s | Retrato + grafismo de rede | Overlay gráfico sobre entrevista |
| ~127.1s | Ícone + rótulo "California Street" | Par de cards ícone/texto, cor sólida |
| ~145.4–147.4s | Rajada mais densa do filme | Wipe de cor sólida (transição de capítulo) |
| ~157.1s | Gráfico "10M/5 Years" vs "1M/2 Years" | Bolha proporcional, stat reveal |
| ~166.6–175.6s | Colagem de arquivo (NYSE, Times Square) | Cartões empilhados, sombra, fundo cinza |
| ~204.8s | B-roll de evento/keynote | Documental, sem overlay |
| ~211.3s | Mockup de app | UI real, fundo roxo full-bleed |
| ~216.9s | Callout "Send" | Elemento de UI isolado, glow |
| ~232.8s | Logo se montando | Outro, fragmentos de cor se juntando |
| ~237.6–238.2s | Fade final de áudio | Encerramento |
