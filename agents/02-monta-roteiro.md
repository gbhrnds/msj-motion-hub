# Agente 02 — Monta Roteiro (roteiro.json → composição Remotion)

## Objetivo
Ler `projects/{projeto}/roteiro.json` (saída do Agente 01) e traduzi-lo para a
composição Remotion em `src/`, com o layout final de cada tela. Animação ainda
**não** é o foco aqui: as telas precisam estar corretas no seu estado "assentado"
(todos os elementos visíveis), porque é isso que o storyboard estático vai mostrar.

## Skill de apoio
Carregue `remotion-best-practices` (em `.claude/skills/`) e, dentro dela,
`remotion-markup/REFERENCE.md`, `remotion-markup/sequencing.md`,
`remotion-markup/compositions.md` e `remotion-markup/local-fonts.md`.

A skill é genérica. Quando ela conflitar com este projeto, vale o projeto:
- Assets: o projeto usa `Config.setPublicDir(".")` (ver `remotion.config.ts`),
  então `staticFile()` aponta para a raiz: `staticFile("brand/logos/...")`.
  **Não** crie pasta `public/` nem duplique arquivos.
- Ignore tudo que envolva áudio, voiceover, legendas ou SFX: o vídeo é mudo.
- Fonte: Agibank Sans via `@remotion/fonts` (já carregada em `src/fonts.ts`).
- Não abra o Studio nem renderize nada nesta etapa.

## Entradas
1. `projects/{projeto}/roteiro.json`
2. `projects/{projeto}/manifest.json`
3. `brand/tokens.json` — única fonte de cores, tipografia, raios, safe area e timing

## Regras de execução
1. **Mapeamento:** cada `tipo` do roteiro vira o componente correspondente em
   `src/components/` (`TelaAguarde`, `TelaDestaques`, `TelaConteudo`,
   `TelaCampanha`, `TelaIndicacaoMetricas`). Se um tipo novo aparecer, crie o
   componente usando apenas valores do `tokens.json` e avise o usuário.
2. **Texto:** passe o texto do roteiro **exatamente** como está. Nunca reescreva,
   corte ou complete. Telas de respiro (`tela_aguarde`) usam só o texto que veio
   da redação.
3. **Mídia:** fotos e logos só pelo `manifest.json`. Se faltar, pare e pergunte.
4. **Duração:** dentro dos componentes, sempre `segundos * fps` com o `fps` de
   `useVideoConfig()` (nunca hardcode 24 ou 23.976). Arredonde com `Math.round`.
5. **Estrutura:** telas dentro de `<Series>` (um `<Series.Sequence>` por tela,
   com `name={tela.id}` para aparecer legível no Studio). Overlays globais
   (`CountdownOverlay`) ficam fora do `<Series>`, por cima, em `<AbsoluteFill>`.
6. **Composições no `src/Root.tsx`:** o ID segue `MSJ-AAAA-MM-Tipo-Fase1`.
   A Fase 2 (buffer de 5 min só com logo) é montada no Agente 06.
7. **Animação:** use os componentes existentes (`TextReveal`, `WiggleShape`,
   `MorphingShape`) com os valores padrão do `tokens.json`. Refinamento de
   curva, stagger e coreografia é trabalho do Agente 05 — não antecipe.
8. **Proibido em Remotion:** CSS `transition`/`animation`, classes de animação
   do Tailwind, `setTimeout`, `Math.random()` sem seed. Tudo deriva de
   `useCurrentFrame()`.

## Checagem antes de entregar
- Grafismos declarados como `GrafismoSpec[]` + `ZonaLivre[]` e renderizados por `CamadaGrafismos` (sobreposição = erro de render).
- Layout confere com `brand/boas-praticas-visuais.md`.
- `npm run lint` passa sem erros (ESLint + `tsc`).
- A soma das durações de um loop é coerente com o resumo do Agente 01.

## Saída
Resumo curto: lista de telas → componente → duração em segundos/frames, e
qualquer componente criado ou alterado.
