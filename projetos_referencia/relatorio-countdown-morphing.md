# Relatório Técnico — Referência Visual para `CountdownOverlay.tsx` e `MorphingShape.tsx`

**Contexto:** comparação entre a vinheta atual do MSJ (Outubro/2026) e uma nova referência externa, para extrair diretrizes de contador regressivo e formas morfando, respeitando o Brandbook Agibank (ver `brand/tokens.json` e `CLAUDE.md`).

**Material analisado:**
- Vinheta atual: `VINHETA_OUTUBRO_MSJ.mp4` — 1920x1080, 23.976fps, 900.9s (15min — bate exatamente com a estrutura documentada: 10min conteúdo + 5min buffer).
- Nova referência: gravação de tela de 26s (2124x1204 @ 120fps). É o material do **"It's a #NuDay"** — vinheta de contagem regressiva do Nubank para a cerimônia de listagem na NYSE. É uma referência externa, não um asset do Agibank — tratar só como inspiração de *mecânica* de motion, não de paleta/marca.

---

## 1. Vinheta atual (Outubro) — Contador Regressivo

**Posição e layout (fase de conteúdo, loop de 10min):**
- Fica sempre fixo no **canto superior esquerdo**, dentro de um "cartão" branco irregular (uma das formas do brandbook, rotacionada, com leve inclinação/perspectiva — não é um retângulo reto).
- O texto do contador (ex: `04:59`, `03:19`, `01:39`) fica **dentro** desse cartão branco, em **azul Agibank**, fonte bold/condensada.
- Tamanho pequeno e discreto — não compete com o conteúdo principal da tela (foto, texto, QR code).
- É consistente em todas as telas de conteúdo que verifiquei (frames em 300s, 400s, 500s) — mesma posição, mesmo tratamento, só o cartão gira/inclina ligeiramente de tela pra tela (variação no grafismo decorativo).

**O que acontece nos últimos segundos (transição conteúdo → buffer, por volta dos 590-600s, ou seja, final dos 10 minutos):**
- O contador **sai do cartão pequeno** e vira um **número gigante centralizado** na tela, ocupando boa parte da altura do frame.
- Tipografia branca, extra bold, numerais grandes (`00:09`, `00:01`), formato `MM:SS`.
- Atrás/ao redor do número aparece uma **forma irregular em outline** (contorno fino, sem preenchimento), funcionando como moldura decorativa.
- **Detalhe sutil e interessante:** o stroke dessa forma muda de cor conforme o tempo se aproxima de zero — em `00:09` o contorno é **verde** (bem visível sobre o azul); em `00:01` o contorno já está em um **azul-marinho bem próximo do azul de fundo** (quase invisível, baixíssimo contraste). Ou seja, o grafismo "se apaga" visualmente conforme o tempo acaba, criando uma sensação de tensão/fechamento sem precisar de texto ou alarme.
- No canto inferior direito, durante essa contagem grande, já aparece a logo "Momento **Sempre Juntos**" (branco + verde, light + bold), antecipando a tela de buffer que vem a seguir.
- Depois do zero, acontece uma transição com **blur/glow pesado** (uma forma azul borrada em expansão, com a palavra "Sempre" aparecendo em verde no meio do blur) até estabilizar na tela de buffer final.
- **Nota de QA:** essa transição com blur ficou com uma leitura um pouco "suja"/acidental (mais parece artefato de render do que intenção de motion). Pode valer a pena refinar com uma transição mais controlada (ver recomendações).

**Tela de buffer (últimos 5 minutos, estática):**
- Fundo branco/cinza-claro (não azul — é a única tela do vídeo com fundo claro).
- Forma grande azul preenchida (pentagonal, cantos arredondados) ocupando o centro-esquerda, com a logo "Momento **Sempre Juntos**" dentro dela.
- Uma forma fina em outline verde no canto superior direito (outro grafismo do brandbook).
- Uma forma azul-marinho sólida no canto inferior esquerdo, cortada pela borda do frame.
- Não há contador visível nessa tela — bate com a regra documentada ("apenas o logo do MSJ, sem texto").

---

## 2. Vinheta atual (Outubro) — Morphing Shapes (grafismos irregulares)

- **Dois tratamentos distintos observados:**
  1. **Preenchidas (solid fill):** usadas como moldura de foto (ex: a forma atrás da foto da colaboradora apontando, ou atrás da foto do time do Santos FC) e como fundo da logo na tela de buffer. Cor sólida única — branco, azul-marinho escuro, ou azul.
  2. **Outline puro (sem preenchimento):** usadas como grafismo decorativo solto no fundo, "flutuando" nos cantos ou atrás de elementos centrais. Stroke fino — pela proporção observada em 1920x1080, aparenta ser algo entre **2px e 4px** (fica próximo de um contorno "de linha", nunca grosso).
- **Cores das shapes:** sempre dentro da paleta aprovada — vi outline verde, outline azul-marinho (quase invisível sobre azul, ver seção do contador), preenchimento branco e preenchimento azul-marinho. **Nunca vi amarelo em nenhuma shape**, e nunca uma shape colorida sozinha sem azul/branco por perto — consistente com a regra do brandbook.
- **Comportamento no fundo:** nas telas de conteúdo, as shapes ficam normalmente **cortadas pela borda do frame** (não aparecem inteiras, "sangram" para fora) — reforça a ideia de grafismo decorativo e não elemento de leitura. Não notei nenhuma rotação/animação contínua das shapes durante o loop estático das telas de conteúdo (ficam estáticas enquanto o texto/foto mudam); a única animação clara de shape foi o próprio morph/blur na transição de fase.

---

## 3. Nova Referência (#NuDay — Nubank) — O que traz de sofisticado

Importante: a paleta (roxo Nubank) **não se aplica** — isso é só leitura de mecânica de motion/tipografia, nunca de cor.

- **Grid fixo e previsível:** contador sempre na mesma posição (meio-esquerda, não no canto como no MSJ), e a área à direita dele é um "slot de conteúdo" que troca — às vezes é uma frase, às vezes é a logo da marca sozinha, às vezes um destaque de nome. O contador nunca se move; só o conteúdo ao lado troca. Isso dá uma sensação de "painel de transmissão" (broadcast graphics) muito mais do que "slide".
- **Hierarquia tipográfica clara:** números do contador em um peso extra bold geométrico; textos de apoio em um peso bold mais "normal"; e um destaque pontual (o nome "Katia") aparece em uma fonte script/manuscrita, diferente do resto — um recurso de **humanizar um dado específico dentro de um sistema tipográfico rígido**. É um contraste controlado, usado com moderação (só quando há um nome ou dado que merece destaque emocional).
- **Barra inferior tipo "ticker" (estilo painel de bolsa):** uma faixa branca fixa na base, com texto correndo horizontalmente junto de ícones triangulares (▲), citando hashtags e marcos do evento. Reforça contexto institucional sem disputar atenção com o conteúdo principal — fica "fora" da área de leitura central.
- **Camadas fixas / elementos "non-diegéticos":** hashtag no canto superior esquerdo e logo no canto superior direito ficam presentes o tempo todo, como uma "moldura de transmissão" — não fazem parte do conteúdo que troca, dão a sensação de continuidade de um programa ao vivo.
- **Minimalismo com 1 cor de fundo só:** confirma que fundo sólido único (sem gradiente) + poucos elementos pode parecer muito sofisticado quando a tipografia e o alinhamento são extremamente consistentes — é mais sobre disciplina de grid do que sobre quantidade de efeitos.

---

## 4. Recomendações para `CountdownOverlay.tsx` e `MorphingShape.tsx`

Pensando em React/CSS/SVG dentro do Remotion, respeitando 100% o Brandbook Agibank (fundo sólido, cantos 12-17px, paleta azul/verde/amarelo+azul, sem inventar shapes novas):

**Para `CountdownOverlay.tsx`:**
1. Manter os **dois modos** já existentes na vinheta de Outubro — eles funcionam bem e dão variedade sem fugir da marca:
   - `size="compact"`: card pequeno no canto superior esquerdo (reaproveitar uma das shapes de `brand/shapes/` como moldula do card, com leve `rotate`).
   - `size="hero"`: número gigante centralizado, para o fechamento de cada bloco/fase.
2. Replicar o efeito de **contorno que perde contraste conforme o tempo some** (verde vivo → quase-invisível) como uma interpolação de cor controlada por `interpolate()` do Remotion, usando só cores do `tokens.json` (ex: de verde-Agibank para azul-Agibank, nunca indo para fora da paleta). É um efeito sutil, sofisticado, e 100% compatível com a regra "verde só acompanhado de azul/branco".
3. Adotar o "slot fixo + conteúdo que troca" do Nubank: deixar o contador sempre no mesmo lugar/tamanho dentro de cada fase, e variar só o elemento ao lado (texto, logo, ou nada) — isso já é quase o que a vinheta atual faz no modo compacto; vale formalizar como um padrão de componente (`<CountdownOverlay><Slot>...</Slot></CountdownOverlay>`).
4. Evitar o blur/glow "sujo" da transição atual. Sugestão: trocar por um morph de path SVG (interpolação de pontos entre a shape pequena do canto e a shape grande central) ou um scale+fade limpo, sem gaussian blur, mantendo a nitidez do brandbook ("minimalista, sem textura").
5. Tipografia: números sempre em Agibank Sans Black/ExtraBold; texto de apoio em peso Regular/Medium — já é a lógica atual, só reforçar a hierarquia.

**Para `MorphingShape.tsx`:**
1. **Nunca gerar shape nova** — o componente deve receber como prop qual arquivo de `brand/shapes/*.svg` usar, e só aplicar `scale`, `rotate`, `flipX/flipY` nele (conforme a regra do brandbook).
2. Suportar os **dois modos** observados: `fill` (cor sólida, usado como moldura de foto/logo) e `outline` (stroke fino, ~2-4px em 1920x1080, usado como grafismo solto de fundo).
3. Permitir **crop/overflow pela borda** do frame (`overflow: visible` fora do safe-area de texto, mas a própria shape pode sangrar para fora do viewport) — é parte da identidade visual observada.
4. Adicionar suporte a **interpolação de cor do stroke** ao longo do tempo (ligado ao progresso da fase/contador), reaproveitando o mesmo mecanismo do item 2 do `CountdownOverlay` — dá pra ser o mesmo helper de cor usado nos dois componentes.
5. (Opcional, inspirado no ticker do Nubank, mas 100% dentro da paleta Agibank) — avaliar uma variação de `MorphingShape` em formato de "barra" fina acompanhando a base ou o topo do frame, com um ícone/triângulo do brandbook se repetindo, para telas de transição entre blocos. Isso é uma ideia nova, não existe na vinheta atual — só sugerir se fizer sentido para o roteiro, nunca obrigatório.

---

## 5. Resumo rápido (TL;DR para o arquiteto)

- Contador: 2 tamanhos (canto/compacto e hero/centralizado), cor do contorno ao redor interpola de verde pra quase-invisível perto do zero, número sempre em peso extra bold.
- Shapes: só reaproveitar SVGs existentes (fill ou outline ~2-4px), permitir sangria pela borda, nunca combinar verde/amarelo sem azul ou branco por perto.
- Da referência nova: vale copiar a disciplina de "slot fixo + conteúdo que troca" e a ideia de interpolar cor para dar sofisticação, mas **não** a paleta roxa nem o ticker de bolsa (a não ser como ideia adaptada, com cores Agibank).
- Transição atual com blur entre fases deveria ser refeita de forma mais limpa (morph de path, não gaussian blur).

---

*Frames extraídos para esta análise estão em `projetos_referencia/analise_outubro/` e `projetos_referencia/analise_nova/`, caso o arquiteto queira conferir visualmente antes de codar.*
