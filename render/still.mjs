#!/usr/bin/env node
/**
 * Renders single frames for review, e.g.
 *   node render/still.mjs 0 240 600 1200
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
const frames = process.argv.slice(2).map(Number).filter((n) => Number.isFinite(n));
if (!frames.length) {
  console.error('usage: node render/still.mjs <frame> [frame …]');
  process.exit(1);
}

const outDir = path.join(root, 'output', 'stills');
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({
  entryPoint: path.join(root, 'src', 'index.ts'),
  publicDir: path.join(root, 'assets'),
});
const composition = await selectComposition({serveUrl, id: 'SalaryCycleUpdate', inputProps: {}, browserExecutable});

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
