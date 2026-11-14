# Agente 05 — Motion Final (animação e coreografia)

## Objetivo
Aplicar a animação final sobre o layout já aprovado (Agente 03) e validado
(Agente 04), com ritmo profissional: nada linear, nada brusco, nada entrando
tudo de uma vez. O layout assentado **não muda** nesta etapa.

## Skills de apoio — e como traduzi-las para vídeo
Carregue `animate` e `choreograph` (Emil Kowalski) e
`remotion-best-practices` → `remotion-markup/timing.md`, `sequencing.md` e
`transitions.md`.

As skills do Emil foram escritas para interface web. Aproveite a **lógica de
decisão** (deve animar? com qual propósito? qual papel cada elemento tem? qual
curva?) e descarte o que é específico de UI:

| Na skill (web) | No MSJ (vídeo em telão, 23,976fps) |
|---|---|
| Durações de UI (150–300ms) | Não se aplicam. Durações vêm do `tokens.json` (`textReveal.durationFrames` = 18 frames ≈ 750ms). 1 frame ≈ 41,7ms |
| CSS transition, WAAPI, Motion, `@starting-style` | Proibidos. Só `useCurrentFrame()` + `interpolate()`/`spring()` |
| Curva `cubic-bezier(...)` | `Easing.bezier(...)` do Remotion |
| Reduced motion, hover, interrupção, gestos | Não se aplicam (vídeo não é interativo) |
| Stagger de produto (30–80ms) | Use o de "marketing/first-run": passos de 2–4 frames |
| "Never invent values / extend tokens" | Vale integralmente: valor novo vai para `tokens.json → motion`, marcado `"assumption"`, e o usuário aprova |

## Regras de execução
1. **Elenco de cada tela (choreograph, passo 1).** Antes de mexer em timing,
   classifique cada elemento:
   - **Lead:** título ou número em destaque — entra primeiro, com o maior deslocamento.
   - **Support:** corpo, bullets, grid de nomes — entra logo depois, com deslocamento menor.
   - **Decoration:** formas irregulares — só fade e o `WiggleShape`/`MorphingShape` contínuo; nunca disputam atenção com o lead.
   - **Static:** fundo e logo — presentes desde o frame 0 da tela (no máximo um fade curto).
   Se duas coisas quiserem ser o lead, pare e avise: é problema de hierarquia de layout, não de motion.
2. **Texto:** sempre via `TextReveal` (entrada única fade + translate). Depois
   da entrada, texto fica **parado** até o fim da tela. Nunca motion contínuo em texto.
3. **Stagger sem metrônomo:** delays que diminuem ao longo da lista (ex.: 4, 3,
   3, 2, 2… frames), nunca todos iguais. Em listas longas (grid de 68 nomes),
   escalone só os primeiros itens/linhas e deixe o restante chegar junto. Toda a
   coreografia de entrada de uma tela termina em até ~2s, para sobrar tempo de leitura.
4. **Uma entrada por container:** se um bloco entra inteiro, os filhos dele não
   ganham um segundo stagger.
5. **Curvas:** entrada = ease-out forte (`Easing.bezier(0.23, 1, 0.32, 1)` ou o
   spring com damping alto já usado no `TextReveal`). Movimento em tela/morph =
   ease-in-out. Nunca ease-in em entrada. Nunca `scale` partindo de 0 (mínimo 0.95).
6. **Propriedades:** só `opacity`, `translate`, `scale`, `rotate` (preferir as
   propriedades CSS individuais a uma string `transform`). Nada de animar
   `width`/`height`/`top`/`left`.
7. **Grafismo:** wiggle com a amplitude e a velocidade do `tokens.json`.
   Rotacionar, espelhar e escalar formas é permitido. Distorcer ou criar forma
   nova, não.
8. **Transição entre telas:** o padrão atual é corte seco (`<Series>`). Trocar
   por `TransitionSeries` (fade, slide etc.) é decisão do usuário: proponha e
   só aplique se ele aprovar. Atenção: crossfade entre dois fundos sólidos
   gera, por alguns frames, uma cor intermediária fora da paleta.

## Verificação
- `npm run lint` passa.
- Renderize 3–4 stills por tela (início, meio da entrada, assentado) e confira
  se o frame assentado continua idêntico ao storyboard aprovado.
- Para avaliar a sensação do movimento, gere um preview curto e só da tela
  alterada (`--frames=inicio-fim`), não do vídeo inteiro.

## Saída
Por tela: elenco (lead/support/decoration/static), delays e curvas aplicados,
e qualquer valor novo proposto para o `tokens.json`.
