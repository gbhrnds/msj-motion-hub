# Estudo de viabilidade — reproduzir as animações da retrospectiva 2026 dentro do Brandbook Agibank

Fonte: `brand/Agibank_Brandbook_Fevereiro_25_v5.pdf` (101 páginas no total
após extração — ver §4 sobre quais páginas foram inspecionadas visualmente),
cruzado com `roteiro.md`, `plano/scene-plan.json` e
`referencia/referencia-motion-nubank.md`.

## 1. O que o Brandbook completo confirma ou diverge dos documentos destilados

**Confirmação importante:** o texto completo do PDF não tem **nenhuma**
ocorrência das palavras "vídeo", "video", "motion" ou "animaç/anima" em
nenhuma das 101 páginas. Isso confirma, por busca exaustiva (não só amostral),
a premissa já registrada em `tokens.json` ("Brandbook não cobre vídeo/motion,
valores marcados `assumption` precisam validação") — não é uma lacuna nova,
é uma confirmação de algo que já era tratado como hipótese.

**Lacuna real encontrada (não é erro dos documentos atuais, é algo que eles
nunca chegaram a cobrir):** existe um capítulo inteiro chamado **"Ilustrações"
(p.68–74)**, com "Estilo - Personagens" (p.69), "Estilo - Ambientes" (p.71) e
"Composição - Formas irregulares/Módulos" (p.73–74). Nem `tokens.json` nem
`boas-praticas-visuais.md` citam essa faixa de página — os dois documentos
cobrem Logos (p.26-35), Cores (p.36-39), Tipografia (p.40-42), Grafismos
(p.43-54), Texturas (p.55-60), Fotografia (p.61-67), Iconografia (p.75-79) e
Boas práticas aplicadas (p.80-100), mas pulam direto de Fotografia (67) para
Iconografia (75) — o capítulo de Ilustrações ficou fora da destilação
original. **Isso não é uma divergência de regra, é conteúdo novo** (sugestão
de atualização futura no §5, não fiz a edição).

Essa lacuna é a parte mais relevante deste estudo: é exatamente o capítulo
que dá uma base real de marca para as 4 ilustrações com exceção aprovada
(ver §3).

## 2. Viabilidade por tipo de motion

### 2.1 Comparativo (número antes→depois)
Sem mudança de avaliação: o padrão "número ExtraBold + rótulo curto" de
`boas-praticas-visuais.md` §2/§3 segue sendo a referência correta — não
encontrei nada no texto pesquisado que contradiga isso. **Ressalva de
cobertura:** não inspecionei visualmente as páginas 80-100 (Boas práticas
aplicadas) nesta passada — se quiser confirmação visual exata de como um
card de métrica aparece aplicado no PDF (não só inferido de
`boas-praticas-visuais.md`), isso ainda está pendente.

### 2.2 Lettering (tipografia cinética)
Nenhuma contradição encontrada. A diretriz de `brand/estilo-tipografia-
cinetica.md` é uma decisão de projeto (não vem do Brandbook), e a hierarquia
tipográfica do Brandbook (`hierarquiaBrandbook`, fonte p.42) não trata de
como o texto entra em tela — é compatível por omissão, não por confirmação.

### 2.3 Gráfico (ranking BCB, treinamento horas/qtd., reconhecimentos)
**Confirma o ponto fraco já suspeitado.** A única menção a "infográficos" no
documento inteiro está na página 77 (Iconografia — Diretrizes): os ícones
"se integram... em ambientes, diagramações e infográficos", mas isso é só
dizendo que o *ícone* pode aparecer dentro de um infográfico — não existe
nenhuma página de data visualization, gráfico de barra/linha ou ranking
visual em lugar nenhum do Brandbook. **Recomendação:** tratar os 3 blocos
"gráfico" do roteiro (cena-06 ranking BCB, cena-15 treinamento/
reconhecimentos, cena-19 lucro líquido) como o mesmo card de métrica usado
nos "comparativo" (número + rótulo), e não como gráfico de barra/linha —
inventar um gráfico de barras do zero não teria nenhuma base no Brandbook.

### 2.4 Recortes de mídia (logos de terceiros)
A página 34 ("Logos — Assinaturas conjuntas e parcerias") é exatamente o
que `tokens.json.logo.assinaturaConjunta` já descreve (separador = altura
total do logo Agibank a 3x pingo de distância, logo parceiro entre 55-85%
da altura do Agibank). **Ressalva:** essa regra foi pensada para
co-branding/parceria formal (dois logos lado a lado numa mesma peça), não
necessariamente para "fomos citados por este veículo de imprensa" (cenas 21,
29, 30 do roteiro, onde os logos são G1/Bloomberg/Forbes etc., sem relação
de parceria). Recomendo usar a mesma disciplina de espaçamento/alinhamento
como referência de rigor visual, mas sinalizar ao usuário que não é
tecnicamente o mesmo caso de uso da regra — não assumi equivalência total.

## 3. As 4 ilustrações com exceção aprovada — direção de estilo proposta

### 3.1 Lojas se fundindo (cena-04)
**Alta viabilidade — já existe precedente quase literal.** A página 74
("Ilustrações — Composição - Módulos") mostra uma ilustração oficial de uma
**fachada de loja Agibank** no mesmo estilo pintado/gestual do capítulo de
Ilustrações: prédio azul com letreiro "agibank" em branco, vitrine, uma
pessoa andando na calçada, bicicleta estacionada, tudo emoldurado dentro de
uma forma irregular (triângulo verde + retângulos azuis). **Proposta:**
usar exatamente esse estilo de ilustração de fachada (mesma paleta azul/
verde, mesmo traço pintado/gestual, mesma lógica de moldura por forma
irregular) para as "várias lojas" que convergem — múltiplas instâncias
dessa mesma linguagem visual se aproximando/fundindo na loja única no final,
em vez de desenhar um ícone de loja genérico do zero.

### 3.2 Multidão de pessoas acendendo (cena-12)
**Alta viabilidade de linguagem, mas atenção à escala.** As páginas 69-72
("Estilo - Personagens") dão uma linguagem completa: proporção corporal
realista, paleta de pele diversa, cores Agibank + neutras, pintura gestual
com luz solar e volumes marcados. Os exemplos aplicados (p.70, p.72) sempre
mostram grupos pequenos (2 a 6 pessoas: família no sofá, fila de espera,
escritório), nunca uma multidão de milhares. **Proposta:** não tentar
desenhar milhares de personagens detalhados (custaria caro e fugiria da
"poucos elementos" que rege até a iconografia, p.77) — em vez disso, repetir
uma versão simplificada/miniatura do mesmo personagem pintado em grade ou
dispersão pela tela, "acendendo" via fade de opacidade em sequência
(`movimentoEmTela`), mantendo o DNA de cor/traço do capítulo de Ilustrações
mesmo em escala reduzida.

### 3.3 Mapa-múndi com países acendendo (cena-17)
**Viabilidade mais fraca das quatro — zero precedente no Brandbook.** Não há
nenhuma ocorrência da palavra "mapa" em nenhuma das 101 páginas, nem
qualquer ilustração cartográfica nas páginas inspecionadas. Não acho honesto
inventar uma "direção de estilo" para mapa-múndi citando uma página que não
existe. **Proposta:** se o mapa for mesmo necessário, a opção mais segura é
tratá-lo como um "Ambiente" (p.71: irregularidade controlada, pintura
gestual, paleta Agibank) estilizado como continentes/blocos geométricos
simplificados — nunca um mapa realista/cartográfico — mas isso já é
extrapolação, não aplicação direta de uma regra existente. A alternativa sem
ilustração nova que sugeri no roteiro (contador "+X países" com formas
oficiais) continua sendo a opção com menos risco de ficar "fora da família"
visual.

### 3.4 Robô mascote acenando (cena-22)
**A mais arriscada das quatro — vale reconsiderar mesmo com a exceção já
aprovada.** Em nenhuma das 101 páginas aparece a palavra "mascote", nem
qualquer personagem não-humano. O único capítulo de personagens existente
(p.69) é explicitamente sobre **pessoas reais brasileiras** — é a definição
oposta de um mascote robótico cartunizado. Criar um robô exigiria inventar
uma categoria de asset de marca inteiramente nova, sem nenhum DNA visual
pra ancorar (nem de traço, nem de proporção, nem de material/textura — o
Brandbook nunca mostra nada com "volume/3D" nesse sentido, e
`tokens.json.iconografia.naoFazer` já proíbe volume/3D nos ícones).
**Achado útil:** a página 72 (canto inferior direito) já tem uma ilustração
oficial de uma pessoa **saindo de dentro de uma tela de celular com um
check verde**, num contexto de tecnologia/agilidade — tematicamente muito
próximo do momento "IA" do roteiro (cena-22/23/24) e 100% dentro da
linguagem de Personagens já aprovada. **Recomendo levar essa alternativa ao
usuário antes de produzir o robô:** mesma ideia de "boas-vindas"/tecnologia,
zero risco de marca, reaproveitando um asset cuja linguagem já existe — mas
a decisão final de manter o robô ou trocar por essa alternativa é do
usuário, não minha.

## 4. Cobertura deste estudo

- **Lido por texto (pdftotext), 100% das 101 páginas**, usado para localizar
  páginas candidatas por palavra-chave (ícone, ilustra, fotografia, mascote,
  gráfico, mapa, parceria, vídeo/motion/animação, etc.) e para confirmar a
  ausência de vídeo/motion/mapa/mascote no documento inteiro.
- **Inspecionado visualmente (como imagem):** p.68-74 (capítulo Ilustrações
  completo) e p.77 (Iconografia — Diretrizes). Essas foram as páginas onde a
  busca por texto indicou conteúdo realmente novo/relevante.
- **Não inspecionado visualmente** (só por ausência/presença de palavra-chave
  no texto, sem abrir a página como imagem): p.1-67, 75-76, 78-101 — em
  particular, as páginas 80-100 ("Boas práticas" aplicadas, onde
  provavelmente estão os exemplos visuais mais próximos de "card de
  métrica" e módulos grandes) **não foram vistas visualmente nesta
  passada**, por limite de orçamento de contexto. Se for importante
  confirmar visualmente como um número com seta ou um módulo de
  "crescimento" aparece de fato aplicado no Brandbook, isso é o próximo
  passo natural de um estudo complementar.

## 5. Páginas relevantes não cobertas pelos documentos atuais

- **p.68-74 (capítulo "Ilustrações")** — não citado em nenhum momento por
  `tokens.json` nem `boas-praticas-visuais.md`. Sugestão (não feita agora,
  precisa confirmação do usuário): adicionar uma seção "Ilustrações" a
  `boas-praticas-visuais.md` cobrindo Estilo-Personagens (p.69), Estilo-
  Ambientes (p.71) e Composição (p.73-74), já que é exatamente o material
  que faltava para ancorar ilustrações customizadas como as 4 exceções
  deste projeto.
- **p.80-100 ("Boas práticas" aplicadas)** — já citado por
  `boas-praticas-visuais.md`, mas não reconferido visualmente nesta
  passada (ver §4). Não é uma lacuna nova, só uma reconfirmação pendente.
