# Estúdio de Motion: app local

Conversa com o Claude para montar a vinheta de um evento, com upload da redação, dos logos e das
fotos, prévia ao vivo e render do MP4 de 15 minutos (10 min de loop + 5 min só de logo).

## Primeira vez

1. `npm install`
2. Crie um arquivo `.env` na raiz do projeto com a chave da API da Anthropic:

   ```
   ANTHROPIC_API_KEY=sua-chave-aqui
   ```

   O `.env` fica só na sua máquina: está no `.gitignore` e nunca vai para o GitHub. Não cole a chave
   em chats nem em documentos.

## Usar

```bash
npm run app
```

Abra **http://localhost:4300**.

1. **Crie o evento.** Use um nome no formato `AAAA-MM_tipo` (ex.: `2026-12_abertura`) e escolha a
   versão:
   - **V1:** Momento Sempre Juntos;
   - **V3:** outras lives.
2. **Envie os arquivos.** Arraste para o chat a redação (`.docx`), os logos e as fotos. Na V3,
   envie também o logo do evento, nas versões negativa e positiva.
3. **Peça as telas.** Por exemplo: "monta as telas com essa redação". O Claude lê a redação,
   escolhe o tipo de cada tela e aplica a regra de duração.
   - **Copy conferida:** cada frase é comparada com a redação. Se o texto não bater, a tela não é
     salva.
4. **Revise conversando.** Por exemplo: "deixa os destaques com 24 segundos", "a foto da indicação
   é a outra" ou "usa o logo do Uni Agi".
5. **Gere o MP4.** Clique em **Gerar MP4** ou peça no chat. O arquivo sai em
   `projects/<evento>/render/`.

O layout fino (posição de formas e textos) é ajustado no Remotion Studio (`npm run dev`), no editor
da versão.

## Onde fica cada coisa

| Caminho | O que guarda |
|---|---|
| `projects/<evento>/projeto.json` | Nome e versão |
| `projects/<evento>/roteiro.json`, `manifest.json` | As telas e os arquivos de cada tela (mesmo formato do projeto de novembro) |
| `projects/<evento>/arquivos/` | O que foi enviado |
| `projects/<evento>/redacao.md` | O texto extraído do `.docx` |
| `projects/<evento>/chat.json` | A conversa |

## Detalhes técnicos

- **Modelo:** `claude-opus-5-5` com pensamento adaptativo (esforço `high`). Se o modelo recusar o
  pedido, o fallback automático do servidor tenta responder com outro modelo.
- **Ferramentas do agente** (`app/agente.mjs`):
  - `ver_projeto`, `ler_redacao`, `listar_logos_oficiais`;
  - `salvar_roteiro`: confere o texto, os arquivos e as durações;
  - `ajustar_duracao`, `definir_logo_evento` (só V3), `gerar_mp4`.
- **Render** (`app/render.mjs`): usa a CLI do Remotion, com as composições `Vinheta-V1-Completa` e
  `Vinheta-V3-Completa` e `--props` com o projeto.
  - No Mac, usa o Google Chrome instalado.
  - Em outro sistema, defina `REMOTION_CHROME` com o caminho do Chrome.
