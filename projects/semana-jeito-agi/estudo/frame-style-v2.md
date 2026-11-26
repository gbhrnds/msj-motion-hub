# Frame style v2: Semana do Jeito Agi

Resultado da rodada 1 de ajustes do usuário na página de ajuste
(`ajuste-telas/`, dados brutos em `ajuste-telas/rodada-1/`), consolidado em
2026-11-26 e repetido nas telas da mesma série. A v2 é o novo padrão da página
de ajuste (o banco foi limpo depois de arquivado).

## Padrões tirados dos ajustes (valem para as próximas telas e para o motion)

**Telas de pilar (T02, T03, T04)**, a partir da T02 e da nota "tirar os traços, inserir bolinha":
- Topo: módulo azul de 632px só com o logo do pilar (margem 44, y 100, altura 160) +
  "Representa…" em **azul Light 44 sobre branco**, fora do módulo azul + módulo de cacos +
  timer. Na T03 (espelhada) os cacos vão para a esquerda (520px).
- Bullets: **um único módulo** de 3×2 células na cor do pilar (azul médio / verde /
  amarelo), sem módulo por bullet e **sem traço**: bolinha de 18px + texto Regular 46,
  bloco centralizado na vertical com 56px entre itens. Texto branco sobre azul médio,
  azul escuro sobre verde e amarelo.
- Foto 2×2 com o enquadramento definido pelo usuário (T02 com zoom 121%).

**T01 (equação):**
- Termos em módulos claros (verde, verde claro, amarelo) com texto azul escuro centralizado.
- `+` nas emendas verticais; `=` na emenda de baixo do módulo "pilares".
- Faixa de cacos do topo rebaixada (deixa respiro branco em cima).
- Textura mais estreita que a célula e timer mais largo.
- Acento em azul médio.
- **Pessoa trocada** (nota do usuário: a pessoa do KV já aparece na T02) por um recorte da
  CAN_9999 (`kv/recortes/CAN_9999.png`, recorte automático local: revisar a borda antes do render).

**Textura "O Jeito Agi":** módulo mais estreito que a célula (312–328px), encostado na
borda direita do quadro (T01, T05, buffer).

**Respiros (r1–r3):** só o logo da Semana (212px) centralizado na faixa branca; cacos da
direita na grade (360/720).

## Pontos para o usuário confirmar
- **Verde claro como fundo de módulo** (T01, "pilares") com texto azul escuro: o contraste
  é alto, mas o par não está na tabela aprovada (`colorContrastPairs`). Precisa entrar como
  exceção ou trocar o módulo.
- **Módulo atrás dos cacos nas telas de pilar:** na T02 estava azul e nas T03 e T04 estava
  branco. Na v2 os três ficaram brancos (a maioria).
- **Tamanho do "Representa…":** 51px na T02 e 44px nas outras. Na v2 os três ficaram em 44px.
