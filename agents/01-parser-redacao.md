# Agente 01 — Parser de Redação

## Objetivo
Transformar o arquivo de redação (.docx, convertido para .md/.txt antes de
rodar este agente) em um `roteiro.json` estruturado, pronto para a próxima
etapa (`agents/02-monta-roteiro.md`) montar a composição Remotion.

## Pré-requisito operacional
O Claude Code não interpreta a estrutura interna de um .docx de forma confiável.
Antes de rodar este agente, converta a redação para texto legível:

```bash
# opção simples: abrir no Word/Pages e exportar como .md ou .txt
# opção via terminal (se tiver pandoc instalado):
pandoc projects/{projeto}/redacao.docx -o projects/{projeto}/redacao.md
```

Confirme com o usuário qual arquivo (.md ou .txt) usar como fonte antes de
prosseguir.

## Entradas
1. `projects/{projeto}/redacao.md` (ou .txt) — conteúdo da redatora
2. `projects/{projeto}/manifest.json` — mapeamento manual de tela → arquivo de
   foto/logo (o usuário escolhe as fotos manualmente, não há nomenclatura
   automática). Exemplo de formato esperado:

```json
{
  "tela_04": { "foto": "fotos/evento_11_11.jpg" },
  "tela_02": { "grid_nomes": ["Fulano da Silva", "Ciclana Souza"] },
  "geral": { "logo_msj": "brand/shapes/logo-msj.svg" }
}
```

Se `manifest.json` não existir ainda, **pare e peça ao usuário** para
preenchê-lo antes de continuar — nunca adivinhar qual foto vai em qual tela.

## Regras de interpretação da redação

### Texto entre colchetes `[ ]`
Representa **instrução para quem monta a peça**, nunca texto visível na tela.
Exemplos reais já vistos:
- `[ criar grid com o nome das pessoas igual reconhecimentos do MSJ – lista aqui ]`
  → vira um componente de grid de nomes (ver `tela_destaques` no schema)
- `[ logo MSJ ]` → inserir o logo do Momento Sempre Juntos (buscar em
  `manifest.json → geral.logo_msj`)
- `[ usar uma foto que for tirada no dia 11/11 ]` → buscar em
  `manifest.json → tela_0X.foto`; se ainda não existir, marcar
  `"midia_pendente": true` na tela e seguir, avisando o usuário no resumo final
- `Artes feitas aqui` / `Desdobrar essa arte aqui` → indicam que aquela tela
  precisa de composição gráfica adicional (provavelmente um infográfico ou
  peça de campanha mais elaborada) — marcar `"requer_composicao_extra": true`

### Classificação do tipo de tela
Classificar cada bloco da redação em um dos tipos abaixo (criar novos tipos
apenas se nenhum servir, e avisar o usuário):

| Tipo | Como identificar | Exemplo da redação |
|---|---|---|
| `tela_aguarde` | Frase curta de espera + rótulo "(Tela de aguarde)" | "O Momento Sempre Juntos começa já já..." |
| `tela_destaques` | Lista de nomes de pessoas + contexto de reconhecimento | Tela 02 — Destaques do Ciclo |
| `tela_conteudo` | Texto corrido + lista de bullets, sem foto de pessoa específica | Tela 06 — Cursos obrigatórios |
| `tela_campanha` | Texto curto, geralmente ligado a uma data/campanha sazonal (ex: Novembro Azul), pode ou não ter logo de campanha | Tela 08 — Novembro Azul |
| `tela_indicacao_metricas` | Texto + números/percentuais em destaque + foto | Tela 04 — Programa de Indicação |

### Preservação do texto
**Nunca reescrever, resumir ou "melhorar" o texto da redação.** Copiar
exatamente como está, inclusive placeholders de dados ainda não preenchidos
(ex: "Xx indicados") — marcar esses casos com `"dado_pendente": true` e listar
no resumo final para o usuário completar antes do storyboard.

### Cálculo de duração estimada por tela
Usar como ponto de partida (todos ajustáveis depois, no storyboard):

```
duracao_base = 10 segundos
+ 1 segundo a cada 8 palavras no corpo do texto (título não conta)
+ 2 segundos se houver lista de bullets (qualquer quantidade de itens)
+ 3 segundos se houver grid de nomes/destaques
+ 2 segundos se houver foto + texto numérico (ex: percentuais, metas)
máximo = 20 segundos (se ultrapassar, sinalizar ao usuário que o texto
         pode estar longo demais para o padrão da vinheta)
exceção = telas com grid/créditos de nomes vão até 30 segundos (aprovado em
          2026-11-14): calcule para cada nome ficar 3–4s visível na janela
          (≈180–240px/s; o loop repete a lista, então não precisa ser mais lento)
```

### Telas de respiro
Telas marcadas como "(Tela de aguarde)" já funcionam como respiro natural no
loop — não é necessário inserir telas extras artificiais a menos que o
usuário peça.

## Schema de saída — `roteiro.json`

```json
{
  "projeto": "2025-11_abertura",
  "geradoEm": "ISO-8601 timestamp",
  "fasePreLive": {
    "contentLoopMinutes": 10,
    "bufferOnlyLogoMinutes": 5
  },
  "telas": [
    {
      "id": "tela_01",
      "tipo": "tela_aguarde",
      "duracaoSegundos": 10,
      "textos": {
        "titulo": "O Momento Sempre Juntos começa já já...",
        "corpo": null,
        "bullets": []
      },
      "midia": {
        "foto": null,
        "logo": "logo_msj",
        "gridNomes": null
      },
      "flags": {
        "midiaPendente": false,
        "dadoPendente": false,
        "requerComposicaoExtra": false
      },
      "observacoesOriginais": ""
    }
  ],
  "resumoParaRevisao": {
    "midiasPendentes": [],
    "dadosPendentes": [],
    "telasQueRequerComposicaoExtra": [],
    "telasAcimaDe20Segundos": []
  }
}
```

## Saída esperada da sua execução
1. Gerar `projects/{projeto}/roteiro.json` seguindo o schema acima
2. Imprimir um resumo em texto simples listando:
   - Quantas telas foram identificadas e de qual tipo
   - Duração total estimada da fase de conteúdo (comparar com o limite de 10 min)
   - Tudo que está pendente (`resumoParaRevisao`) e precisa de input do usuário
   - Qualquer bloco da redação que não se encaixou claramente em um tipo de tela

## Nunca fazer
- Nunca inventar números, nomes ou textos que não estão na redação
- Nunca escolher uma foto sozinho — sempre vai pelo `manifest.json`
- Nunca pular a validação de duração total vs. os 10 minutos da fase de conteúd