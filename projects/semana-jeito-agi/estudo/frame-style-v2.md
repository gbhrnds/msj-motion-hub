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

## v3: todas as pessoas recortadas (2026-11-26)

Decisão do usuário: padronizar as fotos, todas recortadas. Os recortes foram feitos
pelo Adobe (remoção de fundo do Photoshop, skill `adobe-product-photo-cutout`) e
estão em `kv/recortes/` em resolução cheia (CAN_9999, CAN_0024, CAN_0504,
BAIXA_time-mesa-campus, CAN_0009). Nas telas, a foto deu lugar a um módulo azul com a
pessoa recortada por cima, apoiada na base do quadro (como no KV). O recorte local
anterior da CAN_9999 foi descartado.

Pontos de atenção:
- **T04 (BAIXA_time-mesa-campus):** a mesa saiu no recorte, então os notebooks
  ficam "flutuando". Sugestão: trocar por uma foto de pé (CAN_9981, trio rindo com notebook).
  Essa foto também só existe em baixa resolução.
- **T05 (CAN_0009):** o grupo ocupa pouco do quadro original. Recortado, ele tem 942px
  de altura e está sendo usado a ~700px: bom para 1080p, sem folga para zoom.
- **T02:** camisas azuis sobre o módulo azul se misturam. Dá para trocar a cor do módulo na página.

Para usar o fluxo Adobe nesta sessão, o ambiente "Vinheta-MSJ" ganhou os hosts
`at.adobe.com`, `acp-aep-cs-blobstore-prod-va6-data.adobe.io`, `photoshop-api.adobe.io` e
`cis-utils-storage-prod.s3-accelerate.amazonaws.com`.

## v4: foto com fundo mascarada no módulo + vazamento (2026-11-26)

Pedido do usuário: as fotos com fundo voltam para dentro dos módulos (como máscara),
e algumas partes "vazam" para os módulos vizinhos, para a tela não parecer vazia.

Técnica (elemento `fotovaza` na página de ajuste, a mesma que vai para o Remotion):
1. **Camada 1:** a foto original, recortada pela caixa do módulo (máscara).
2. **Camada 2:** o recorte do Adobe da **mesma foto**, na mesma posição e escala,
   recortado por uma caixa maior (a caixa do módulo + as margens de vazamento
   topo/esquerda/direita/base). Dentro do módulo ele coincide com a foto; fora, só a pessoa aparece.
3. A camada fica acima dos módulos vizinhos e abaixo dos textos. O vazamento nunca cobre
   texto: ele vai para a área livre (lateral do módulo de bullets, módulo de textura).

Padrão aplicado:
- **T01:** cabelo vazando para cima, na textura; braço e placa vazando para a esquerda.
- **T02:** ombro vazando para a esquerda, no módulo de bullets.
- **T03:** vazamento para a direita.
- **T04:** vazamento para a esquerda.
- **T05:** a foto preenche o módulo, sem vazamento (o texto fica logo abaixo).

Para o motion, o vazamento é um ótimo gancho: o módulo abre como janela e a pessoa
"sai" dele por último.
