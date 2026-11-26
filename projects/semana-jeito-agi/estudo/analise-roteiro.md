# Análise do roteiro, tela a tela (antes dos frames)

**Status:** análise. Os frames de cada tela só começam quando o usuário avisar
que terminou de subir as fotos (lotes de 5). Redação em `../redacao.md`, fotos
em `../fotos/lote-01/`. Base visual: `estudo-vinheta.md` (grade 5×3 de
384×360px, mosaico de módulos, cacos, pessoas saindo do módulo).

## 0. Leitura geral da redação

O roteiro tem uma narrativa fechada, e ela já está no KV:

- **Tela 01** é a "equação" da cultura.
- **Telas 02, 03 e 04** são os três pilares. Cada um "representa" um público:
  clientes, acionistas e colaboradores.
- **Tela 05** fecha com os dois inegociáveis: respeito e meritocracia.

O texto 2 do KV ("...todos crescem: **acionistas, clientes e Agilizados**") é
exatamente o eixo das telas 02–04. Então as três telas de pilar devem ser
**uma série**, com o mesmo molde e variações de cor e de lado. Quem vê duas
delas já entende a terceira, e isso libera atenção para ler os bullets.

## 1. Tempo de cada tela (regra do `agents/01`)

| Tela | Palavras no corpo | Bullets | Cálculo | Proposta |
|---|---|---|---|---|
| 01 Equação | 0 (só título, 13 palavras) | não | 10s base | **12s**: a equação se monta em 4 tempos e precisa de 2s a mais |
| 02 Viver pelo cliente | 3 + 23 = 26 | sim | 10 + 3 + 2 | **15s** |
| 03 Agir como empreendedor | 3 + 29 = 32 | sim | 10 + 4 + 2 | **16s** |
| 04 Crescer na jornada | 3 + 12 = 15 | sim | 10 + 1 + 2 | **13s** |
| 05 Respeito e meritocracia | 15 | não | 10 + 1 | **12s**: +1s para os dois tempos (frase 2 entra depois) |
| **Conteúdo por volta** | | | | **68s** |

Nenhuma tela passa de 20s.

## 2. Respiros e timer em evidência

Regra do projeto: **o texto de respiro vem da redação**, e esta redação não
traz frases de respiro. Para não inventar copy, proponho que o respiro desta
vinheta seja uma **tela de timer**: o relógio regressivo grande, o logo da
Semana e os cacos se montando, **sem frase**. Isso atende ao pedido de dar mais
evidência ao timer e ainda quebra a repetição.

Se você quiser uma frase nos respiros, mande o texto e ele entra na redação.

**Ordem de uma volta (proposta):**

```
T01 Equação (12) → RESPIRO-timer (8)
→ T02 Cliente (15) → T03 Empreendedor (16) → RESPIRO-timer (8)
→ T04 Jornada (13) → T05 Respeito (12) → RESPIRO-timer (8)
= 92s por volta  →  6 voltas = 552s  +  48s de abertura e fechamento
```

O ajuste exato para fechar os 600s (abertura com relógio grande e 10s finais
de fechamento) fica para o `roteiro.json` (etapa 1).

Os três respiros da volta mudam de cor (azul, marinho e branco com número
azul), para o loop não parecer um carimbo.

## 3. Tela a tela

### TELA 01: a equação da cultura
> Propósito + pilares + respeito e meritocracia = uma cultura forte, do nosso jeito

**O desafio:** é uma frase longa que funciona como fórmula. Escrita em linha
corrida, vira um parágrafo difícil de ler no telão.

**Composição:** cada termo vira um **módulo** da grade. Os operadores `+` e
`=` ficam nas emendas entre módulos, como se fossem o "rejunte" do mosaico.

```
┌──────────┬──────────┬────────────────────┬────────┐
│Propósito │ pilares  │ respeito e         │ timer  │  ← linha 1: 3 termos (Light/Medium)
│          +          + meritocracia       │        │
├──────────┴──────────┴─────── = ──────────┴────────┤
│  uma cultura forte,          │  FOTO 04 (recorte) │  ← linha 2–3: resultado (Bold),
│  do nosso jeito  (verde cl.) │  saindo do módulo  │     módulo azul grande
└──────────────────────────────┴────────────────────┘
```

- **Hierarquia:** os termos somados em Light/Medium e o resultado em Bold.
  "do nosso jeito" fica em verde claro sobre azul, permitido em texto grande.
- **Foto:** 04 (colaborador com a placa agi), recortada. Repete o gesto da
  mulher com a placa no KV e dá um rosto à abertura.
- **Quebra:** "respeito e meritocracia" nunca separa o "e" (`quebraBoa`).

### TELAS 02, 03 e 04: os três pilares (molde único)

**Estrutura de texto igual nas três:** título (pilar), linha "Representa ..."
e 3 bullets.

**Molde:**

```
┌──────────────────────────────┬──────────────────┬────────┐
│ PILAR (Bold 88)              │                  │ timer  │
│ Representa ... (Light 40)    │   FOTO           ├────────┤
├──────────────────────────────┤   (módulo 2×2,   │ cacos  │
│ ▸ bullet 1  (módulo)         │    recorte da    │        │
│ ▸ bullet 2  (módulo)         │    cena)         │        │
│ ▸ bullet 3  (módulo)         │                  │        │
└──────────────────────────────┴──────────────────┴────────┘
```

- **Cada bullet é um módulo próprio**, uma faixa horizontal com o texto em
  Regular de 38–40px. A lista vira três peças que se encaixam, sem o
  "marcador de bullet" de slide.
- **Variação da série:**

| | T02 Cliente | T03 Empreendedor | T04 Jornada |
|---|---|---|---|
| Cor dominante | azulAgibank | azulMedio | azulEscuro |
| Destaque | verde claro | amarelo (módulo 1×1 de acento) | verde |
| Foto | 02 atendentes na loja | 03 colaboradora + NYSE no notebook | 05 time na mesa, campus |
| Lado da foto | direita | esquerda (espelhado) | direita |

- **Por que essas fotos:**
  - **Cliente → 02:** é a loja, com o atendimento acontecendo.
  - **Acionistas → 03:** a bandeira agi na NYSE está literalmente na tela
    do notebook. É o melhor vínculo com "acionistas" que temos.
  - **Colaboradores → 05:** é o time trabalhando junto, com a parede do
    propósito ao fundo.
- **Palavra-chave em Bold** dentro dos bullets? **Não proponho.** Escolher qual
  palavra destacar é edição de texto. Se a redação marcar destaques, eles entram.
- **T03 tem os bullets mais longos** (29 palavras). O módulo de bullets
  precisa de ~1150px de largura para cada item caber em até 2 linhas sem
  descer de 38px.
- **Logo do pilar:** existe `brand/logos/crescer_na_jornada_*.svg` (vetor). Há
  logos equivalentes de "Viver pelo cliente" e "Agir como empreendedor"? Se
  houver as três, o título vira logo nas três telas. Se só existir o da jornada,
  sugiro manter **tipografia nas três** para a série ficar coerente.

### TELA 05: respeito e meritocracia
> Pra gente, respeitar todas as pessoas é inegociável.
> E a meritocracia é uma crença real.

São **duas frases, em dois tempos**. Cada uma ganha um módulo, e a segunda
entra ~1s depois da primeira para que sejam lidas como duas afirmações.

```
┌────────────────────────────────────────┬────────┐
│  FOTO 01 (grupo caminhando, campus)    │ timer  │
│  módulo 3×2, recorte horizontal        ├────────┤
├───────────────────────┬────────────────┴────────┤
│ Pra gente, respeitar  │ E a meritocracia é uma  │
│ todas as pessoas é    │ crença real.            │
│ inegociável.  (azul)  │        (marinho)        │
└───────────────────────┴─────────────────────────┘
```

- **Foto 01:** quatro pessoas diferentes caminhando juntas. É o "todas as
  pessoas" em imagem.
- **Ênfase:** Bold em "inegociável" e "crença real"? Essas palavras são o
  sentido da frase, mas a marcação é decisão sua (mesma regra dos bullets).

## 4. Fotos do lote 01

| Arquivo | Onde | Tratamento | Observação |
|---|---|---|---|
| 01-grupo-caminhando-campus | T05 | recorte horizontal em módulo largo | pessoas no centro-esquerda; o logo agi da parede pode aparecer |
| 02-atendentes-loja-notebook | T02 | módulo 2×2 | ótima para a pessoa "saindo" do módulo pelo topo, se recortada |
| 03-colaboradora-tela-nyse | T03 | módulo 2×2, centrado no rosto + notebook | profundidade de campo curta: **não dá para recortar a pessoa**, fica dentro do módulo |
| 04-colaborador-loja-placa-agi | T01 | **recorte da pessoa** (sem fundo), saindo do módulo | espelha o gesto da placa no KV |
| 05-time-mesa-campus | T04 | módulo 2×2 | a parede azul ao fundo com o texto do propósito é um bônus |

Resolução 2000×1333: suficiente para módulos de até ~2 células de largura.
Foto em tela cheia ficaria no limite. Se houver originais maiores, melhor.

O lote 01 já cobre as 5 telas. Fotos dos próximos lotes podem entrar como:
- **variação por volta:** o loop roda ~6 vezes, e trocar a foto da T02 entre
  voltas mantém o conteúdo e evita o "enjoo";
- **pessoas recortadas** para o mosaico da abertura e do fechamento.

## 5. Ideias de animação e transição (para aprovar antes de animar)

**Princípio:** tudo na vinheta é uma **peça que se encaixa**, seja módulo,
caco, foto ou texto. Nada surge do nada; tudo chega de uma borda ou de uma
emenda da grade. O **timer é a âncora**: ele fica sempre na mesma célula e
atravessa todas as transições sem se mexer.

### 5.1 Transições entre telas

| # | Nome | Como é | Onde usar |
|---|---|---|---|
| A | **Troca célula a célula** | A próxima tela substitui a atual célula por célula da grade 5×3, numa onda diagonal que sai do timer. Cada célula chega como um bloco de cor sólida que desliza da emenda, com atraso por distância e uma pequena variação aleatória (semente fixa), para a onda não parecer metrônomo. Sem crossfade, então nenhuma cor fora da paleta. ~20 frames | conteúdo → conteúdo (T02→T03, T04→T05) |
| B | **Varredura de cacos** | Uma faixa do mosaico (os 56 cacos) atravessa a tela. A tela antiga sai por trás dela e a nova fica do outro lado. Cada caco tem seu próprio atraso e uma rotação leve | **entrada e saída dos respiros**: vira a assinatura da Semana |
| C | **Timer que cresce** | No respiro, a célula do timer cresce até virar o módulo central e o número aumenta junto. Na volta ao conteúdo, ela encolhe de volta para o canto. Continuidade total: o olho segue o número | respiro (combinado com B) |
| D | **Foto que vira palco** | O módulo da foto da tela que sai se expande e cobre a tela; a cor do próximo fundo vem por baixo | uso pontual, uma vez por volta (T01→respiro, por exemplo), para variar |

### 5.2 Dentro de cada tela (ordem de entrada)

1. **Módulos de fundo** encaixam a partir da borda mais próxima, com stagger
   decrescente (4-3-3-2-2 frames) e ease-out forte. É o papel *static*.
2. **Título** é revelado por máscara (sobe de dentro do próprio módulo, como na V3).
   A palavra em Bold ou verde chega 3–4 frames depois do resto da linha.
3. **Foto:** o módulo abre como uma janela e a imagem tem um *push-in* lento
   (escala 1,00 → 1,04 durante toda a tela) para a tela não ficar parada. Na
   pessoa recortada, ela sobe 40–60px de dentro do módulo e "fura" a borda.
4. **Bullets:** um módulo por bullet, entrando em cascata (o 1º com o título,
   o 2º e o 3º em seguida). Toda a entrada termina em ~2s, e o resto da tela é leitura.
5. **T01:** a equação se monta termo a termo: Propósito → `+` → pilares → `+`
   → respeito e meritocracia → `=` → resultado. O resultado entra com o
   maior deslocamento, por ser o *lead*. Fica pronta em ~3s.
6. **T05:** frase 1 → pausa de ~1s → frase 2.
7. **Grafismo contínuo** depois da entrada:
   - cacos com wiggle mínimo (≤2px, fases diferentes);
   - textura "O Jeito Agi" deslizando devagar (pendente de aprovação).

   **Texto nunca se mexe depois de entrar.**

### 5.3 Fechamento e buffer

- **Últimos 10s da Fase 1:** todos os módulos colapsam, célula a célula, para
  o módulo azul central, que vira o palco do logo. O timer chega a 00:00 dentro dele.
- **Buffer (5 min):**
  - logo parado e cacos "respirando";
  - a cada ~20s, uma célula de acento troca de cor pela transição A, em
    escala mínima, para o telão não congelar.

## 6. Studio e render pelo terminal (localhost)

Já está preparado no projeto:
- `npm run dev` abre o Remotion Studio em `http://localhost:3000` para revisar.
- Render final em alta qualidade, sugestão para a etapa 06:
  `npx remotion render src/index.ts <Composicao> out/MSJ_....mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --concurrency=50%`.
  Para a entrega no telão, vale testar `--crf=12`, ou ProRes com conversão
  depois, se o arquivo puder ser grande.

## 7. Perguntas pendentes desta etapa

1. **Respiro só com timer (sem frase):** ok? Ou vem texto de respiro na redação?
2. **Logos dos pilares:** existem os de "Viver pelo cliente" e "Agir como
   empreendedor", além do "Crescer na jornada"?
3. **Destaques em Bold** em palavras dos bullets e da T05: você marca na
   redação, ou fica tudo no mesmo peso?
4. **Transições A–D:** quais aprova? Minha recomendação é **A** entre
   conteúdos, **B + C** nos respiros e **D** uma vez por volta.
5. As pendências do `estudo-vinheta.md` §7 continuam abertas, principalmente:
   - E1–E6: seguir o KV;
   - logo negativo da Semana;
   - 1 mp4 ou 3.
