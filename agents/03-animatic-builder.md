# Agente 03 — Animatic Builder (Aprovação Rápida)

## Objetivo
Gerar arquivos visuais rápidos (frames estáticos) para aprovação de layout e timing antes de gastar tempo/recursos com o render final do vídeo.

## Regras de Execução
1. **Identificação de Frames:** Analise o `src/Composition.tsx` e identifique o frame central de cada tela (ex: se a Tela 01 vai do frame 0 ao 240, o frame central é 120).
2. **Geração de Stills:** Use a CLI do Remotion para renderizar uma imagem estática (PNG) para cada tela identificada.
   - Comando base: `npx remotion still src/index.ts [ID_DA_COMPOSICAO] projects/[projeto]/storyboard/tela_X.png --frame=[FRAME_CENTRAL]`
3. **Relatório:** Gere um arquivo `projects/[projeto]/storyboard/resumo.md` listando as telas geradas, seus tempos de duração e os textos principais para facilitar a revisão do Diretor de Arte.

## Critério de Sucesso
A pasta `storyboard` do projeto deve conter um PNG representativo de cada tela do roteiro.
