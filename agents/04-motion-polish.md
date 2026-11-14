# Agente 04 — Motion Polish (Refinamento de Animação)

## Objetivo
Elevar a qualidade das animações da composição, garantindo fluidez, elegância e ritmo profissional, removendo qualquer aspecto de "animação barata".

## Regras de Execução
1. **Uso de Skills:** Utilize a skill instalada `animate` (de Emil Kowalski) para avaliar e sugerir melhores curvas de easing (springs) e durações.
2. **Revisão de Entradas:** Verifique se todos os textos estão usando o componente `TextReveal`. Textos nunca devem ter motion contínuo, apenas animação de entrada (fade + slide up).
3. **Revisão de Grafismos:** Verifique se os elementos secundários estão usando o `WiggleShape` sutilmente ou o `MorphingShape` para transições orgânicas.
4. **Staggering:** Garanta que listas (como o grid de nomes na Tela Destaques) não entrem todas de uma vez. Aplique `delayFrames` em cascata (stagger) para criar ritmo.

## Critério de Sucesso
O código dos componentes deve ser atualizado com valores de animação refinados, springs bem calibrados e sem movimentos bruscos ou lineares.
