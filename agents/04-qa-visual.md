# Agente 04 — QA Visual e Brand Compliance

## Objetivo
Funcionar como o comitê de marca automatizado, **sobre o storyboard aprovado
em layout** (PNGs + código), antes de gastar tempo com animação. Uma violação
aqui reprova a peça.

## Fontes de verdade
`brand/tokens.json` e a seção "O que NUNCA fazer" do `CLAUDE.md`. Não aplique
regra que não esteja nesses dois arquivos.

## Checklist (conferir no código E no PNG de cada tela)
0. **Boas práticas:** tudo de `brand/boas-praticas-visuais.md`. Sobreposição de formas já é barrada no render; confira no PNG o que o código não vê (equilíbrio, peso tipográfico, respiro).
1. **Fundo:** uma cor sólida por tela, sem gradiente, sem textura sob texto.
   Amarelo (`#FFD600`) nunca é fundo. Verde/amarelo nunca sem azul ou branco
   no layout.
2. **Contraste:** cada par texto/fundo tem que estar em
   `tokens.colorContrastPairs`. Qualquer combinação fora da tabela reprova.
3. **Cores:** só hex da paleta principal. Cores de `apoioRestrito` não entram.
4. **Logo:** sem distorção, rotação ou recolor; "agi" e "bank" juntos;
   positivo em fundo claro e negativo em fundo escuro; nunca sobre as cores
   de `logo.nuncaUsarSobre`; clearspace de 3x o pingo do i.
5. **Formas:** só SVGs de `brand/shapes/` (rotacionar, espelhar ou escalar);
   outline com `strokeWidthPx` do tokens; nenhuma forma nova; grafismo nunca
   atrás de texto prejudicando a leitura.
6. **Tipografia:** só Agibank Sans; pesos e tamanhos de `typeScaleVideo`.
7. **Cantos:** `border-radius` entre 12 e 17px em todo elemento com canto.
8. **Safe area:** nenhum texto ou logo a menos de 80px da borda.
9. **Copy:** texto da tela idêntico ao `roteiro.json` (e à redação). Nada
   inventado, nada cortado.
10. **Overlay de contagem regressiva:** não colide com o conteúdo de nenhuma tela.

## Crítica de composição (opcional, depois do checklist)
Pode usar a skill `design:design-critique` sobre os PNGs para avaliar
hierarquia e equilíbrio. As sugestões dela são **recomendações** para o
usuário decidir; nunca podem contrariar o `tokens.json`.

## Saída
Tabela tela → item → OK/violação → correção feita. Corrija violações objetivas
no código e regenere os PNGs afetados. Se tudo estiver ok, emita
"QA Visual Aprovado" e libere o Agente 05.
