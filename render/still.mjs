#!/usr/bin/env node
/**
 * Renders single frames for review, e.g.
 *   node render/still.mjs 0 240 600 1200
 *   node render/still.mjs --film=wellbeing 60 300
 * Writes output/stills/frame-<n>.png
 */
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {findBrowser} from './browser.mjs';

const browserExecutable = findBrowser();
if (browserExecutable) console.log(`> using browser: ${browserExecutable}`);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const filmArg = argv.find((a) => a.startsWith('--film='));
const film = filmArg ? filmArg.split('=')[1] : 'salary';
const COMPOSITIONS = {salary: 'SalaryCycleUpdate', wellbeing: 'WellbeingProgramme'};
if (!COMPOSITIONS[film]) {
  console.error(`unknown --film=${film}. Use one of: ${Object.keys(COMPOSITIONS).join(', ')}`);
  process.exit(1);
}
const frames = argv.filter((a) => !a.startsWith('--')).map(Number).filter((n) => Number.isFinite(n));
if (!frames.length) {
  console.error('usage: node render/still.mjs <frame> [frame …]');
  process.exit(1);
}

const outDir = path.join(root, 'output', 'stills', film);
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({
  entryPoint: path.join(root, 'src', 'index.ts'),
  publicDir: path.join(root, 'assets'),
});
const composition = await selectComposition({
  serveUrl,
  id: COMPOSITIONS[film],
  inputProps: {},
  browserExecutable,
});

for (const frame of frames) {
  const output = path.join(outDir, `frame-${String(frame).padStart(4, '0')}.png`);
  await renderStill({
    composition,
    serveUrl,
    output,
    frame,
    imageFormat: 'png',
    overwrite: true,
    chromiumOptions: {gl: 'angle'},
    browserExecutable,
  });
  console.log(output);
}
