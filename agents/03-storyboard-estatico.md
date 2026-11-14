# Agente 03 — Storyboard Estático (aprovação de layout)

## Objetivo
Gerar 1 PNG por tela + um PDF de contact sheet para o usuário aprovar o
**layout** antes de qualquer trabalho de animação. Esta etapa nunca é pulada.
Não existe animatic em vídeo neste fluxo.

## Skill de apoio
`remotion-best-practices` → `remotion-render/REFERENCE.md` (seção de stills e
`render --frames`).

## Regras de execução
1. **Qual frame capturar:** o frame em que a tela está "assentada" (todas as
   entradas terminaram, nada a meio caminho). Regra: `inicio_da_tela +
   max(frame_final_das_entradas) + 6`. Se não for possível calcular, use o
   frame central da tela. Capture só a primeira volta do loop.
2. **Render dos stills** (um comando para todos os frames):
   ```bash
   npx remotion render src/index.ts {ID_COMPOSICAO} projects/{projeto}/storyboard --frames={f1},{f2},... --image-format=png
   ```
   Depois liste a pasta e renomeie para `tela_01.png`, `tela_02.png`, ...
   (não adivinhe o nome que o Remotion gerou).
3. **Autorrevisão visual:** abra cada PNG (ferramenta Read) e confira antes de
   entregar: texto cortado ou estourando, texto colado na borda (safe area 80px),
   sobreposição de texto com grafismo, foto distorcida, logo ausente. Corrija o
   que for erro de layout e gere o PNG de novo.
4. **Contact sheet:** junte os PNGs num `projects/{projeto}/storyboard.pdf`,
   uma tela por página ou em grade 2x2, com legenda `tela_XX — tipo — Ns`.
   Use a ferramenta disponível na máquina (ex.: Pillow/img2pdf em Python).
5. **Resumo:** `projects/{projeto}/storyboard/resumo.md` com tabela
   tela → tipo → duração → texto principal → pendências (dados/mídias).

## Critério de sucesso
Um PNG por tela, `storyboard.pdf` gerado e o usuário notificado para revisar.
**Pare aqui** e espere a aprovação ou os pedidos de ajuste. Ajustes pontuais
voltam para o código (Agente 02) e o storyboard é regenerado só das telas
alteradas.
