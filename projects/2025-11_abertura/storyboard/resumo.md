# Storyboard v1 — 2025-11_abertura (primeiro teste)

Frames capturados no meio de cada tela (1ª volta do loop). Composição
`MSJ-2025-11-Abertura-Fase1`, 23,976fps.

| Tela | Tipo | Duração | Status | Problemas encontrados |
|---|---|---|---|---|
| tela_01 | aguarde (azul) | 10s | ajustar | Texto deslocado para a esquerda (não centralizado); sem grafismo visível no frame |
| tela_02 | destaques | 18s | **refazer** | Título colide com o contador; logos "Destaques do Ciclo" e "Crescer na jornada" quase invisíveis e com fonte errada; grid sem máscara (nomes cortados no topo e no rodapé); triângulo amarelo sobre um nome; amarelo sem verde por perto |
| tela_03 | aguarde (cinza) | 10s | ajustar | Logo MSJ renderizando em fonte com serifa (SVG com texto vivo); texto em azul Agibank sobre cinza (Brandbook p.39 pede azul escuro); sem grafismo |
| tela_04 | indicação + métricas | 15s | **refazer** | Logo do programa minúsculo; textos e números pequenos para telão; grande área vazia; fragmento verde atrás do contador; dados "XX" pendentes |
| tela_05 | aguarde (azul) | 10s | ajustar | Igual à tela_01 |
| tela_06 | conteúdo | 14s | ajustar | Módulo diagonal encosta na borda e tem canto reto (p.54 pede margem de respiro e cantos 12–17px); bullets sem marcador; logo Uni Agi ausente (aparece só texto) |
| tela_07 | aguarde (cinza) | 10s | ajustar | Igual à tela_03 |
| tela_08 | campanha | 12s | ajustar | Triângulo verde sobre o texto (grafismo nunca sobre texto); texto pequeno; composição vazia |
| todas | contador | — | ajustar | Card com "ponteiro" triangular verde não aparece no Brandbook nem na referência de Outubro (cartão irregular branco) |

## Causa raiz comum
- **Logos SVG com texto vivo** (`<text>` com `font-family: AgibankSans-*`): dentro de
  `<img>` o navegador não acessa a fonte carregada e cai para Times. Afeta
  logo MSJ, Destaques do Ciclo e Crescer na jornada. Solução: exportar os SVGs
  com texto convertido em contorno (Illustrator: Type → Create Outlines).

## Pendências
- `tela_04`: "XX indicados" e "XX% indicações contratadas" (dados oficiais).
