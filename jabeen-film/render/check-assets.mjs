#!/usr/bin/env node
/**
 * Lists every footage/render slot, its required length, and whether it is
 * filled - plus every project fact the film still needs.
 *
 *   node render/check-assets.mjs           report only
 *   node render/check-assets.mjs --strict  exit 1 if anything is missing (used by render:film)
 *
 * Reads the TypeScript config through Remotion's bundler-free path: the
 * config files are plain data, so a tiny transform is enough.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.argv.includes('--strict');

// Compile the timeline + config to a temp ESM bundle with esbuild (ships with Remotion).
const esbuild = await import(pathToFileURL(path.join(root, 'node_modules', 'esbuild', 'lib', 'main.js')).href);
const out = path.join(root, 'output', '.check-assets.mjs');
fs.mkdirSync(path.dirname(out), {recursive: true});
await esbuild.build({
  stdin: {
    contents: `export {TIMELINE, FPS} from './src/lib/timeline'; export {ASSETS} from './src/config/assets'; export {PROJECT} from './src/config/project';`,
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: out,
  logLevel: 'silent',
});
const {TIMELINE, FPS, ASSETS, PROJECT} = await import(pathToFileURL(out).href + `?t=${Date.now()}`);

const problems = [];
const pub = (p) => path.join(root, 'public', p);
const probe = (file) => {
  try {
    return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());
  } catch {
    return NaN;
  }
};

console.log('\nFOOTAGE / RENDER SLOTS');
console.log('slot         need   status');
const slots = [];
TIMELINE.shots.forEach((s, i) => {
  if (s.move === 'endFrame') return;
  const next = TIMELINE.shots[i + 1]?.overlap ?? 0;
  const need = (s.duration + (i === 0 ? 0 : s.overlap) + next) / FPS;
  if (s.move === 'floorPlan') slots.push({slot: `6B-top@${s.villa?.id}`, need: 0, still: true});
  else slots.push({slot: s.slot, need});
});
for (const {slot, need, still} of slots) {
  const a = ASSETS[slot];
  let status;
  if (!a) {
    status = 'MISSING';
    problems.push(`asset slot ${slot}`);
  } else if (!fs.existsSync(pub(a.src))) {
    status = `FILE NOT FOUND: public/${a.src}`;
    problems.push(`file public/${a.src}`);
  } else if (a.kind === 'video') {
    const have = probe(pub(a.src)) - (a.trimStart ?? 0);
    status = have + 0.01 >= need ? `ok (${have.toFixed(1)}s)` : `TOO SHORT (${have.toFixed(1)}s)`;
    if (have + 0.01 < need) problems.push(`clip ${slot} too short`);
  } else status = 'ok (still)';
  console.log(`${slot.padEnd(12)} ${still ? ' still' : (need.toFixed(1) + 's').padStart(6)}  ${status}`);
}

console.log('\nPROJECT FACTS');
const fact = (label, ok) => {
  console.log(`${ok ? 'ok     ' : 'MISSING'} ${label}`);
  if (!ok) problems.push(label);
};
fact('company name', !!PROJECT.companyName);
fact('company logo', !!PROJECT.companyLogo && fs.existsSync(pub(PROJECT.companyLogo)));
fact('JABEEN logo', fs.existsSync(pub(PROJECT.jabeenLogo)));
fact('neighbourhood name (confirmed spelling)', !!PROJECT.placeLabel);
fact('at least one villa type', PROJECT.villaTypes.length > 0);
for (const v of PROJECT.villaTypes) {
  fact(`villa ${v.id}: name`, !!v.name);
  fact(`villa ${v.id}: floor plans`, v.floors.length > 0 && v.floors.every((f) => fs.existsSync(pub(f.planImage))));
  fact(`villa ${v.id}: room names + dimensions`, v.floors.every((f) => f.rooms.length > 0));
}
fact('licensed music (public/audio/score.wav)', fs.existsSync(pub('audio/score.wav')));

console.log(`\n${problems.length === 0 ? 'Everything is in place.' : `${problems.length} item(s) missing.`}`);
fs.rmSync(out, {force: true});
if (strict && problems.length) process.exit(1);
