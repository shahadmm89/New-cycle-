#!/usr/bin/env node
/**
 *   node render/render.mjs animatic        -> output/jabeen-animatic.mp4 (1920x1080, slate, temp score)
 *   node render/render.mjs film            -> output/jabeen-film.mp4 (refuses while anything is missing)
 *   node render/render.mjs still <sec...>  -> output/stills/animatic-<sec>s.png
 *
 * Flags: --scale=0.5 (smaller, faster), --concurrency=N
 */
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {findBrowser} from './browser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'output');
const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const mode = positional[0] ?? 'animatic';
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=')[1];
const scale = Number(flag('scale') ?? 1);
const concurrency = flag('concurrency') ? Number(flag('concurrency')) : undefined;
const browserExecutable = findBrowser() ?? undefined;

if (mode === 'film') {
  try {
    execFileSync('node', [path.join(root, 'render', 'check-assets.mjs'), '--strict'], {stdio: 'inherit'});
  } catch {
    console.error('\nRelease render stopped: fill the items above first (or render the animatic).');
    process.exit(1);
  }
}

fs.mkdirSync(outDir, {recursive: true});
console.log('> bundling…');
const serveUrl = await bundle({entryPoint: path.join(root, 'src', 'index.ts'), publicDir: path.join(root, 'public')});
const id = mode === 'film' ? 'JabeenFilm' : mode === 'demo' ? 'JabeenDemo' : 'JabeenAnimatic';
const composition = await selectComposition({serveUrl, id, inputProps: {}, browserExecutable});

if (mode === 'still') {
  const dir = path.join(outDir, 'stills');
  fs.mkdirSync(dir, {recursive: true});
  for (const sec of positional.slice(1)) {
    const output = path.join(dir, `animatic-${sec}s.png`);
    await renderStill({composition, serveUrl, frame: Math.round(Number(sec) * composition.fps), output, scale, browserExecutable, chromiumOptions: {gl: 'angle'}});
    console.log(`  ${output}`);
  }
  process.exit(0);
}

const outputLocation = path.join(outDir, mode === 'film' ? 'jabeen-film.mp4' : mode === 'demo' ? 'jabeen-demo.mp4' : 'jabeen-animatic.mp4');
console.log(`> rendering ${id}: ${composition.durationInFrames} frames @ ${composition.fps}fps, scale ${scale}`);
let last = -1;
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  pixelFormat: 'yuv420p',
  colorSpace: 'bt709',
  crf: mode === 'film' || mode === 'demo' ? 16 : 20,
  x264Preset: mode === 'film' ? 'slow' : 'medium',
  imageFormat: 'jpeg',
  jpegQuality: 92,
  scale,
  audioCodec: 'aac',
  audioBitrate: '256k',
  outputLocation,
  concurrency,
  browserExecutable,
  chromiumOptions: {gl: 'angle'},
  onProgress: ({progress}) => {
    const pct = Math.floor(progress * 100);
    if (pct !== last) process.stdout.write(`  ${(last = pct)}%\r`);
  },
});
console.log(`\n  -> ${outputLocation} (${(fs.statSync(outputLocation).size / 1e6).toFixed(1)} MB)`);
