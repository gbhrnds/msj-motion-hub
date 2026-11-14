# Agente 02 — Montagem do Roteiro (Storyboard em Código)

## Objetivo
Ler o `projects/{projeto}/roteiro.json` gerado pelo Agente 01 e traduzi-lo para código React/Remotion, atualizando o arquivo `src/Composition.tsx`.

## Regras de Execução
1. **Leitura:** Leia o `roteiro.json` e o `manifest.json` do projeto atual.
2. **Mapeamento de Componentes:** Para cada tela no JSON, chame o componente correspondente em `src/components/` (ex: `TelaAguarde`, `TelaDestaques`, `TelaCampanha`). Se um componente não existir, crie-o seguindo as diretrizes do `brand/tokens.json`.
3. **Duração:** Converta a duração de segundos para frames (`durationInFrames = segundos * fps`). O FPS oficial é 23.976.
4. **Estrutura:** Envolva as telas em um componente `<Series>` do Remotion. Cada tela deve ser um `<Series.Sequence>`.
5. **Overlays:** Garanta que componentes globais (como o `CountdownOverlay`) fiquem fora do `<Series>`, renderizados por cima da composição, usando `<AbsoluteFill>`.

## Critério de Sucesso
O arquivo `src/Composition.tsx` deve ser atualizado sem erros de TypeScript e refletir 100% o fluxo do `roteiro.json`.
