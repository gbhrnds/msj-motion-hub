# Boas práticas visuais — Agibank / MSJ

Registro do que o Brandbook v5.0 (Fev/2025) **mostra nas aplicações** (não só o
que está escrito) e do que a vinheta de Outubro/2026 faz. Complementa o
`tokens.json`. Todo agente que monta ou revisa tela lê este arquivo.

## 1. Formas irregulares (p.45–48 + aplicações p.80–100)

- **Nunca se sobrepõem.** Nenhuma forma encosta ou passa por cima de outra
  (preenchida ou outline). Sempre há respiro entre elas. Checagem automática:
  `npm run checa:formas` (gera `out/checa-formas.png` com OK/FALHA por tela) e o
  próprio render falha se houver conflito.
- **Nunca passam por trás/por cima de texto, logo ou foto.** Elas *contornam*
  o conteúdo, com uma "máscara" de respiro de 40px em volta (nada de forma
  "recortando" um texto ou o canto de uma foto).
- **Borda do quadro (ajuste do usuário no Figma, 2026-11-14):** formas
  **grandes** (≈250–750px) podem sangrar pelos cantos (`sangra: true`). Formas
  **pequenas** ficam inteiras, a pelo menos 32px da borda. Nunca uma forma
  pequena "mordida" pela borda.
- **Poucas, com contraste de escala:** 2 a 4 formas por tela, misturando uma ou
  duas grandes de canto com uma ou duas pequenas de acento. A checagem só conta
  o que aparece: formas que sangram podem se cruzar fora do quadro.
- **Máscara no texto:** um outline pode atravessar a frase/número desde que um
  retângulo na cor do fundo abra o respiro onde o texto passa (`mascaras` no
  `CamadaGrafismos`). É o padrão das telas de contagem e de respiro.
- **Arranjo por ato:** em telas com vários atos (Destaques), cada ato tem seu
  arranjo; a mesma forma desliza para a nova posição e formas novas entram com
  fade + scale (`GrafismosPorAto`).
- **Composição "ao redor do título" (p.48):** 4 a 6 formas de tamanhos bem
  diferentes (a maior ~3–4x a menor), rotações variadas, espalhadas em volta do
  texto, todas inteiras dentro do quadro.
- **Tamanho:** formas de apoio são pequenas/médias em relação ao quadro. Formas
  gigantes só como "palco" de um elemento (ex.: buffer de Outubro, forma azul que
  segura o logo MSJ).
- **Mistura preenchida + outline**, com o outline fino (traço do tokens) e do
  mesmo porte das preenchidas.
- **Outline emoldurando:** pode envolver um texto curto ou o número do relógio
  (citação p.48, contagem de Outubro), sempre com folga — nunca riscar por cima
  de letras nem cruzar foto.
- **Transformações:** só rotacionar, espelhar, escalonar (p.46).
- **Morph (pedido da redação e do usuário, 2026-11-14):** permitido **só entre
  formas oficiais** (`MorphForma`). A forma fica parada como forma oficial a
  maior parte do tempo e a troca é curta (≈20 frames, ease-in-out forte): as
  formas intermediárias só existem em movimento. Para não mudar a composição,
  a forma morfa para parceiras de proporção parecida, na mesma caixa, e só para
  as que passam na checagem daquela tela (`parceirasSeguras`).
- **Cores (p.47):** monocromático azul ou verde sobre branco; duas/três cores
  sobre branco ou azul; amarelo sempre em menor proporção (ver exceção §6).

## 2. Módulos (p.49–54, aplicação de evento p.97)

- Bordas externas retas, divisões internas diagonais, nunca paralelas entre si.
- Cantos 12–17px, espaço 5–8% entre módulos, margem até a borda do quadro.
- Métricas: número enorme (ExtraBold) + rótulo curto pequeno; módulo amarelo
  com texto azul escuro é permitido (p.97 "75%").
- Foto em módulo pode ter um lado cortado em diagonal (p.84 "Não basta ser bom").

## 3. Tipografia nas aplicações

- Títulos em **Medium/Bold**, não ExtraBold em tudo. ExtraBold fica para
  números e palavra-chave.
- **Mistura de pesos na mesma frase** (Outubro: "Pode abrir passagem" Regular +
  "para celebrar junto!" Bold). Dá elegância e hierarquia sem aumentar tamanho.
- Alinhamento à esquerda predomina; centralizado só em telas de uma frase.
- Muito espaço vazio. Texto de respiro em Regular/Light, tamanho moderado (~48–56px).

- **Quebra de linha (decisão do usuário, 2026-11-14):** artigo, preposição,
  conjunção ou número curto nunca fica no fim da linha (gruda na palavra
  seguinte) e nunca há viúva (palavra sozinha na última linha). Aplicado por
  `quebraBoa` com espaço não separável — o texto da redação não muda.

## 4. Logo

- Logo da marca/evento sempre no **canto inferior direito** nas aplicações.
- Logos de programa (O jeito agi, Destaques) no topo, junto ao conteúdo.

## 5. Vinheta de Outubro/2026 (projetos_referencia/)

- **Contador pequeno:** moldura = **forma irregular branca** sangrando pelo canto
  superior esquerdo; número azul Bold ~44px dentro da parte visível.
- **Telas de contagem (intervalos):** fundo azul, número branco Bold ~170px
  centralizado, uma forma em **outline fino que se desenha e se apaga**
  (trim path) ao redor do número, logo MSJ pequeno no canto inferior direito.
  Muito vazio — o número é o único protagonista.
- **Respiro cinza:** uma linha de texto Regular azul, outline verde se desenhando
  em volta, logo MSJ logo abaixo à direita.
- **Conteúdo:** fundo cinza, foto/ilustração à direita, amarelo como outline
  fino ao redor da foto + triângulo preenchido; texto com pesos misturados.
- **Evitar:** transição com blur; "Sempre Juntos" verde sobre fundo claro.

## 6. Exceções aprovadas pelo usuário

| Data | Exceção | Onde |
|---|---|---|
| 2026-11-14 | Cinza claro `#F3F3F3` como fundo | respiro, buffer, destaques |
| 2026-11-14 | Texto em azul Agibank sobre cinza claro (Brandbook pede azul escuro) | todas as telas cinza |
| 2026-11-14 | Telas de respiro todas em cinza claro (outline amarelo sem logo / verde com logo) | respiro |
| 2026-11-14 | Módulos grandes (meia tela ou mais) com canto de 30px; módulos pequenos seguem 12–17px | Uni Agi e futuros módulos grandes |
| 2026-11-14 | Coração amarelo sobre cinza (ícone decorativo, ao lado do texto azul) | fechamento Destaques |
| 2026-11-14 | Foto recortada por forma oficial (pentagon-06) com a pessoa recortada saindo da forma | tela Indicação |
| 2026-11-14 | Azul + amarelo **sem verde**, com amarelo predominante entre os grafismos (Brandbook p.47 pede amarelo em menor proporção e com verde) — precedente na vinheta de Outubro | Tela Destaques do Ciclo |
