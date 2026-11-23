# Análise de motion · referência "Welcome to Nu" (revisão completa)

**Data:** 2026-11-23 · **Fonte:** `referencia/nubank-welcome-to-nu.mp4` (238s, 1280×720, 23,976fps)
**Método:** folhas de contato a 1 fps do filme inteiro + sequências a 7–8 fps nas transições
(`referencia/sequencias/`) + detecção de corte (ffmpeg, limiar 0,25 → 48 cortes).
Complementa `referencia/referencia-motion-nubank.md`; usada para as 3 propostas de `storyboard.pdf`.

## Gramática do filme

- **Fala ↔ janela:** a fala encolhe para um card arredondado no fundo cinza, segura ~1,5s e é empurrada
  para cima pelo bloco gráfico. É a costura de todos os atos (a transição de assinatura, mais que o wipe).
- **Direção única:** tudo entra por baixo e sai por cima. Crossfade é raro; fade para preto, nenhum.
- **Cor cheia só em palavra-cartão e transição.** Os blocos de informação vivem no cinza claro.
- **Ritmo:** planos de fala de 5–20s; blocos gráficos de 2–8s; palavra-cartão de ~0,6–0,9s.
- **Palavras-cartão não ficam paradas:** sobem junto com a faixa que as traz (corrige a análise anterior).

## Catálogo de técnicas

| Tempo | Técnica | Uso no Agibank |
|---|---|---|
| 0:00–0:03 | Logo se monta, sobe e dá lugar a um card de vídeo que sobe de baixo e cresce até a tela cheia (~1s, saída rápida, pouso suave). | 🚫 logo em pedaços · ✅ card que cresce até tela cheia |
| 0:10 · 0:42 · 1:22 · 2:22 · 2:58 | Janela: a fala encolhe para um card arredondado (~45% da tela) no fundo cinza, segura ~1,5s e é empurrada para cima pelo bloco gráfico. É a costura principal entre fala e grafismo. | ✅ cinza claro (exceção aprovada) + card com canto de módulo |
| o filme todo | Direção única: tudo entra por baixo e sai por cima (push vertical). Sensação de linha do tempo/feed. Quase nenhum crossfade. | ✅ direto |
| 0:17 | Palavra branca grande sobre a fala desfocada. | 🚫 blur (regra da marca) · ✅ palavra sobre cor/forma sólida |
| 0:17.9 · 2:25 · 3:13 | Wipe de faixas: 2–3 faixas de cor sólida sobem em cascata (defasagem de ~4–6 frames); cada faixa traz a próxima palavra-cartão (~0,6–0,9s por palavra). | ✅ faixas com borda diagonal (módulos) ou forma oficial gigante |
| 1:57 | Palavra que se divide: “Customer · Centricity” se afastam, um ponto surge no meio, e o bloco rola para cima. | ⚠️ ponto não é forma oficial → forma oficial pequena ou faixa |
| 3:13 | Frase grande que encolhe e vira título: entra palavra a palavra, encolhe (~0,8s) até cabeçalho e o conteúdo entra embaixo. | ✅ direto |
| 0:43 · 3:15 | Lista de veículos em pílulas; um marcador desce e a pílula selecionada abre em acordeão com a manchete. | ✅ marcador = triângulo oficial |
| 0:53 | Pílulas que se acumulam uma por batida; a linha recentraliza a cada entrada. | ✅ direto (sem o mapa de linhas que vem depois) |
| 1:09–1:21 | Prêmio troca no lugar dentro de louros fixos. | ⚠️ louros não são da marca · ✅ troca no lugar |
| 1:27 | Mapa de pontos acendendo. | 🚫 ponto não é forma oficial |
| 0:26–0:39 | Colagem de imprensa: dezenas de cards flutuando com sombra; densidade = credibilidade. | ⚠️ sombra solta · ✅ capturas em módulos |
| 1:59 | Ano gigante que troca (2012 → 2013) por rolagem de número. | ✅ “2027!” |
| 2:03 | Retrato com rede de linhas e pontos. | 🚫 vocabulário fora das formas oficiais |
| 2:35–2:39 | Bolhas proporcionais (1M → 10M → 100M) que crescem e empurram a anterior. | 🚫 círculo · ✅ ideia de escala com módulos de altura proporcional |
| 3:00–3:07 | Barras-módulo: cards cinza crescem em altura com o número contando (20M → 35M); o destaque vem em cor cheia. | ✅ base dos dados da proposta A |
| 2:41–2:57 | Arquivo (NYSE) em cards empilhados que rolam sem parar. | ✅ Ato 5 |
| 3:53–3:57 | Encerramento: logo no cinza, depois reduzido a um traço. | 🚫 desmontar logo · ✅ logo centralizado (exceção 2026-11-19) |

## Como isso virou proposta

- **A · Janela:** fala ↔ janela, tudo subindo, barras-módulo com número, lista com seletor.
- **B · Forma-palco:** o wipe de cor vira uma forma oficial que cresce até cobrir a tela; palavra-chave gigante; rajada de nomes.
- **C · Faixas:** o wipe de faixas com borda diagonal (módulos); palavra que se divide; pílulas que se acumulam; frase que vira título.

Quadros em `storyboard/quadros/` (A0, B0, C0 = KVs), gerados por `scripts/storyboard-retrospectiva.mjs`
(composição `RET-2026-Storyboard`, que checa sobreposição de formas). PDF: `scripts/storyboard-retrospectiva-pdf.mjs`.
