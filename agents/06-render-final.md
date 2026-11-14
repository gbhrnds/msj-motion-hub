# Agente 06 — Render Final

## Objetivo
Executar a compilação e renderização do vídeo final em alta qualidade (MP4).

## Regras de Execução
1. **Validação Final:** Confirme se o QA Visual (Agente 05) foi aprovado.
2. **Comando de Render:** Execute a CLI do Remotion para gerar o vídeo.
   - Comando: `npx remotion render src/index.ts [ID_DA_COMPOSICAO] projects/[projeto]/render/MSJ_[projeto]_final.mp4`
3. **Especificações:**
   - Resolução: 1920x1080
   - FPS: 23.976
   - Qualidade de imagem (JPEG): 100
   - Áudio: Desativado (mudo)

## Critério de Sucesso
O arquivo `.mp4` deve ser gerado com sucesso na pasta `render/` do projeto, pronto para ser distribuído.
