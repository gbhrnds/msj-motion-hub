import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path';
const [,, outDir, ...ids] = process.argv;
const todos = ['A','B','C'].flatMap(p=>[0,1,2,3,4,5,6].map(n=>p+n));
const alvo = ids.length ? ids : todos;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('.'), rspack: true, ignoreRegisterRootWarning: true, onProgress: () => {}});
const opts={serveUrl, browserExecutable:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', chromeMode:'chrome-for-testing', logLevel:'error'};
const composition = await selectComposition({...opts, id: 'RET-2026-Storyboard'});
for (const id of alvo) {
  const i = todos.indexOf(id);
  try { await renderStill({...opts, composition, frame: i*30+29, output: path.join(outDir, `${id}.png`)}); console.log('ok', id); }
  catch (e) { console.log('ERRO', id, String(e.message).split('\n')[0]); }
}
