# Motion: Semana do Jeito Agi (etapa 05)

Código: `src/semana/` (`layout.ts`, `Tela.tsx`, `Vinheta.tsx`). Layout: `layout-aprovado.json`,
exportado da página de ajuste (frame style v5 + ajustes salvos pelo usuário). Assets em resolução cheia:
`render-assets/`.

## Composições (Remotion Studio: `npm run dev` → http://localhost:3000)

| ID | O que é | Duração |
|---|---|---|
| `SJA-Vinheta-Completa` | entrega: Fase 1 (10 min de loop) + Fase 2 (5 min de buffer) | 15:00 |
| `SJA-Previa-Uma-Volta` | revisão: uma volta inteira + a T01 da volta seguinte | ~1:44 |
| `SJA-Previa-Fechamento` | revisão: últimos 20s da Fase 1 + 10s do buffer | 0:30 |

## Linha do tempo

Volta de 92s: T01 (12) → R1 (8) → T02 (15) → T03 (16) → R2 (8) → T04 (13) → T05 (12) → R3 (8).
São 6 voltas inteiras + T01/R1/T02 da 7ª. Os segundos restantes até 10:00 viram o **fechamento**:
o layout do respiro com o relógio grande indo a 00:00. Em seguida a onda de células abre o buffer (5 min).

**Relógio:** regressivo relativo, de 10:00 até 00:00 na Fase 1 (o mesmo padrão do MSJ), com
dígitos em odômetro (o dígito que muda rola nos 6 últimos frames do segundo). Não mostra hora real,
então serve para as 3 lives. Some no buffer.

## Transições

| | Onde | Como |
|---|---|---|
| A · troca célula a célula | entre telas de conteúdo e na entrada do buffer | a tela nova entra pelas 15 células (5×3), numa onda que sai do relógio (canto superior direito), cada célula crescendo do lado da origem da onda; atraso por distância + variação fixa; 26 frames; ease-out forte. Sem crossfade (nenhuma cor fora da paleta) |
| B · faixa de cacos | entrada e saída dos respiros | faixa azul médio com cacos azul escuro atravessa a tela da esquerda para a direita; a tela nova fica atrás da faixa; 30 frames, ease-in-out |
| C · relógio viajante | junto com B | o relógio sai da célula da tela de conteúdo e vira o módulo grande do respiro (e volta); posição, tamanho e corpo interpolados; a cor do módulo troca no meio (sem mistura) |
| D · foto vira palco | T04 → T05, uma vez por volta | a máscara da foto da T04 cresce até a tela cheia (16 frames, ease-in-out) e a T05 entra no corte |

## Elenco e entradas dentro da tela (frames a 23,976 fps, depois de 8 frames de transição)

- **Static:** fundo e módulos de cor. A transição já é o "encaixe" dos módulos, então eles não têm animação própria.
- **Lead:**
  - T01: termos da equação em sequência (Propósito 6 → + 14 → pilares 18 → + 26 → respeito 30 → = 40 → resultado 46); a equação fica montada em ~2,3s.
  - Pilares: logo do pilar no frame 0; "Representa…" no 6.
  - T05: frase 1 no 8; frase 2 no 32 (~1s depois, os dois tempos).
- **Support:**
  - Bullets em cascata decrescente: 12, 16, 19, com a bolinha junto (escala 0,95 → 1).
  - Foto: abre de baixo para cima dentro da máscara (22 frames).
- **Decoration:**
  - Recorte da pessoa: aparece 18 frames depois da foto. Dentro do módulo ele coincide com a foto, então o que se vê é a pessoa "saindo" do módulo.
  - Cacos: entram com fade + deslize curto e depois só respiram (wiggle 4px a 0,15 ciclo/s, tokens).
- **Texto:**
  - Máscara presa ao bloco: as linhas sobem de dentro da caixa (18 frames, `Easing.bezier(0.23,1,0.32,1)`) e ficam paradas.
  - Bold ("respeitar", "meritocracia") e verde claro ("do nosso jeito") chegam 4 frames depois do resto.
- **Foto + recorte:** *push-in* lento de 1,00 → 1,04 na tela inteira, com a mesma origem nas duas camadas (continuam alinhadas).
- **Propriedades animadas:** só opacity, translate, scale e clip-path. Escala nunca parte de menos de 0,95.

## Render (etapa 06) pelo terminal

Ver `agents/06-render.md`. Sugestão de comando, na raiz do repositório:

```
npx remotion render src/index.ts SJA-Vinheta-Completa projects/semana-jeito-agi/render/MSJ_AAAA-MM_semana-jeito-agi_v1.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p
```

Pendente: mês/ano das lives para o nome do arquivo (`AAAA-MM`).

## Rodada de motion 2 (2026-11-27, pedidos do usuário)

- **Foto + recorte sem falha:**
  - o recorte entra primeiro (sobe 90px com bounce);
  - a foto com fundo se abre ~16 frames depois, num círculo que nasce no centro da pessoa;
  - a pessoa nunca aparece cortada pela borda do módulo.
- **Texto:**
  - palavra a palavra nas frases (cascata 3 → 1,6 frames);
  - letra a letra quando é uma palavra só (1,4 frame por letra);
  - cada unidade sobe 0,75em com fade.
- **Motion blur:** desfoque direcional (filtro SVG) proporcional à velocidade de cada frame, aplicado em:
  - palavras e letras (vertical);
  - recorte (vertical);
  - faixa de cacos (horizontal).

  É barato no render (não multiplica frames como o `CameraMotionBlur`).
- **Bounce:** spring (damping 9, stiffness 140, massa 0,7) nos elementos que entram em escala:
  operadores `+`/`=`, bolinhas dos bullets e recorte (0,9 → 1).
  Isso substitui a regra antiga "escala nunca parte de menos de 0,95" para esses elementos (pedido explícito do usuário).

## Rodada de motion 3 (2026-11-27): refino e KV final

Pedidos do usuário: bullets um de cada vez; KV animado assim que a regressiva acaba; textura
"O Jeito Agi" subindo; refinar tudo para um acabamento "Apple / Itaú" (skills `animate` e `choreograph`).

- **Bullets um de cada vez:** a bolinha pula e 3 frames depois o texto entra palavra a palavra,
  deslizando 28px a partir da bolinha. Intervalo de ~1,75s entre bullets (frames 24 / 66 / 108),
  o ritmo de leitura de uma linha. A tela deixa de ficar parada depois do primeiro segundo.
- **Textura "O Jeito Agi":** as linhas sobem a 16px/s durante toda a tela, em loop perfeito (passo de 61px).
  Vale para os módulos com textura das telas e para o KV.
- **KV animado (Fase 2, 0–12s):** reconstruído camada a camada a partir do PSD, nas posições originais
  (`render-assets/kv/`: pessoas, cunha e 208 cacos vetorizados em `cacos-kv.json`). Ordem:
  - entrada pela onda de células sobre a tela 00:00;
  - os 11 módulos encaixam numa onda que nasce no logo, cada um crescendo pela borda virada para ele;
  - os cacos se montam peça a peça (escala 0,6 → 1, giro de 14° → 0, spring), em onda radial com variação fixa;
  - logo em foco (desfocado → nítido, 0,94 → 1);
  - pessoas sobem de dentro dos módulos com bounce e motion blur (principal, depois 04, 02, 03);
  - os dois textos do KV entram palavra a palavra;
  - push-in de câmera de 1 → 1,03 em todo o KV.

  Depois de 12s, a onda de células abre o buffer. Os textos do KV são o copy oficial da peça, não vêm da redação.
- **Refino geral:**
  - **Texto:** entra com "rack focus" (desfoque que some ao assentar), que se soma ao motion blur
    de velocidade. A subida caiu de 0,75em para 0,5em, com 18 frames por palavra: menos pulo, mais elegância.
  - **Logos dos pilares:** entram em foco, sem deslizar.
  - **Onda de células (transição A):** o conteúdo de cada célula assenta de 1,05 → 1 enquanto ela abre,
    o que dá profundidade de peça encaixando.
  - **Relógio:** blur vertical leve enquanto o dígito rola.
  - **Bounce:** spring mais assentado (damping 11, stiffness 150). Ainda tem overshoot, mas assenta em ~0,5s.
- `SJA-Previa-Fechamento` agora tem 38s: últimos 20s da regressiva + KV + entrada do buffer.
