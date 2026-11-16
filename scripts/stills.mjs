import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path';
const [,, comp, outDir, ...frames] = process.argv;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('.'), rspack: true, ignoreRegisterRootWarning: true, onProgress: () => {}, webpackOverride: (c) => c});
const opts={serveUrl, browserExecutable:'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome', chromeMode:'chrome-for-testing'};
const composition = await selectComposition({...opts, id: comp});
console.log('dur', composition.durationInFrames);
for (const f of frames) {
  const fr = Number(f) < 0 ? composition.durationInFrames + Number(f) : Number(f);
  await renderStill({...opts, composition, frame: fr, output: path.join(outDir, `${comp}_${String(fr).padStart(5,'0')}.png`), scale: 0.5});
}
