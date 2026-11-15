# Exportar telas para o Figma (ajuste fino de layout)

Arquivo de trabalho: https://www.figma.com/design/n7kUxuRsa1iHUqkhKlKKJq

1. `npm run figma:coletor` (deixa rodando) — recebe a geometria do navegador.
2. Para cada tela, renderize a composição `ExportaFigma` congelada no frame desejado:
   `npx remotion still src/index.ts ExportaFigma out/figma/<nome>.png --frame=0 --props='{"frame":<frame global>,"tela":"<nome>","coletor":"http://localhost:4599"}'`
3. `npm run figma:svg` — gera `out/figma/<nome>.svg` (formas, módulos, logos, ícones) e
   `<nome>.textos.json` (textos com quebras de linha reais, pesos e cores).
4. SVG sobe pelo Figma MCP (`upload_assets`); textos entram como camadas editáveis via `use_figma`.
   Fotos sobem à parte como preenchimento de imagem.

Camadas de forma se chamam `forma <id> · <nome>` — o mesmo id do `GrafismoSpec` no código,
para trazer as posições ajustadas de volta.
