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
- **Inteiras dentro do quadro** (decisão do usuário, 2026-11-14): nenhuma forma
  é cortada pela borda; margem mínima de 48px. Isso substitui o "sangrar pela
  borda" que aparece em algumas aplicações do Brandbook e na vinheta de Outubro.
- **Poucas e pequenas:** formas de apoio do porte do texto ao lado (≈40–120px em
  telas com texto pequeno; até ~300px só em telas com pouco texto). No máximo
  ~5–6 por tela — mais que isso polui.
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
- **Transformações:** só rotacionar, espelhar, escalonar (p.46). Morph proibido.
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
| 2026-11-14 | Azul + amarelo **sem verde**, com amarelo predominante entre os grafismos (Brandbook p.47 pede amarelo em menor proporção e com verde) — precedente na vinheta de Outubro | Tela Destaques do Ciclo |
