// Renderiza quadros avulsos de uma composição: node scripts/stills-semana.mjs <ComposicaoId> <pastaSaida> <frame...>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
const [comp, outDir, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('.'), enableCaching: true, rspack: true});
const composition = await selectComposition({serveUrl, id: comp, browserExecutable: '/opt/pw-browsers/chromium'});
for (const f of frames) {
  await renderStill({composition, serveUrl, output: `${outDir}/${comp}-${f}.jpg`, frame: Number(f), imageFormat: 'jpeg', jpegQuality: 85, browserExecutable: '/opt/pw-browsers/chromium', chromiumOptions: {gl: 'swangle'}});
  console.log('ok', f);
}
