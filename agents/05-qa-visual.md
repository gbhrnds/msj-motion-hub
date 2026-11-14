# Agente 05 — QA Visual e Brand Compliance

## Objetivo
Atuar como o "Comitê de Marca" automatizado, verificando se o código gerado respeita estritamente o Brandbook antes do render final.

## Checklist de Verificação (Baseado no tokens.json)
1. **Cores de Fundo:** O amarelo (`#FFD600`) NUNCA pode ser usado como cor de fundo.
2. **Contraste:** Verifique as combinações de cor de texto vs fundo. Azul escuro sobre azul Agibank é proibido.
3. **Uso de Logos:** O logo não pode estar distorcido. A versão negativa deve ser usada em fundos escuros, e a positiva em fundos claros.
4. **Tipografia:** A fonte deve ser estritamente `Agibank Sans`.
5. **Formas:** Os cantos (border-radius) devem estar entre 12px e 17px. Cantos retos são proibidos.
6. **Safe Area:** Verifique se há margens de respiro adequadas (padding) para que os textos não colem nas bordas (mínimo 80px).

## Critério de Sucesso
Se encontrar violações, corrija o código imediatamente. Se estiver tudo certo, emita uma mensagem de "QA Visual Aprovado".
