#!/usr/bin/env node
/**
 * SCENE STILLS FOR THE ASSET PACKAGE
 * ----------------------------------
 *     npm run export:stills
 *
 * One PNG per scene at the moment everything in it has arrived, plus one per
 * narration beat, because several scenes say three or four different things and
 * a single frame of those is not the scene.
 *
 * Rendered from the film itself, so what comes out is the actual design -
 * characters, timeline, icons, type and all - not a reconstruction of it.
 *
 * Writes output/asset-package/03_scenes/.
 */
import fs from 'node:fs';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {ROOT, loadConfig, flatVoiceLines} from './lib/config.mjs';
import {readWavInfo} from './lib/wav.mjs';
import {findBrowser} from '../render/browser.mjs';

const OUT = path.join(ROOT, 'output', 'asset-package', '03_scenes');
const cfg = loadConfig();
const lines = flatVoiceLines(cfg);
const pad2 = (n) => String(n).padStart(2, '0');
const withCaptions = process.argv.includes('--captions');

fs.mkdirSync(path.join(OUT, 'states'), {recursive: true});

/** Frames worth having, with the name each should carry. */
const shots = [];
cfg.scenes.forEach((scene, i) => {
  const start = cfg.sceneStarts[i];
  const no = pad2(i + 1);

  // The scene entire: late enough that every element has landed, early enough
  // that the next scene has not started fading in over it.
  shots.push({
    at: start + scene.duration - 0.9,
    file: path.join(OUT, `${no}_scene_${scene.id}.png`),
    label: `scene ${no} (${scene.id})`,
  });

  // One state per narration beat. Placed a beat after the phrase begins, which
  // is where whatever that phrase introduces has just appeared.
  const own = lines.filter((l) => l.sceneId === scene.id);
  own.forEach((l, k) => {
    const dur = readWavInfo(path.join(ROOT, 'assets', 'audio', 'lines', `${l.id}.wav`)).duration;
    shots.push({
      at: l.absoluteStart + Math.min(1.5, dur * 0.75),
      file: path.join(OUT, 'states', `${no}_scene_state${k + 1}_${l.id}.png`),
      label: `  state ${k + 1}: "${l.text.slice(0, 44)}${l.text.length > 44 ? '…' : ''}"`,
    });
  });
});

const browserExecutable = findBrowser();
console.log(`> ${shots.length} stills${withCaptions ? ' (with burned-in captions)' : ' (no captions - the .srt is a sidecar)'}`);

const serveUrl = await bundle({entryPoint: path.join(ROOT, 'src', 'index.ts'), publicDir: path.join(ROOT, 'assets')});
const composition = await selectComposition({
  serveUrl,
  id: withCaptions ? 'SalaryCycleUpdate' : 'SalaryCycleUpdate-NoCaptions',
  inputProps: {},
  browserExecutable,
});

for (const shot of shots) {
  const frame = Math.min(composition.durationInFrames - 1, Math.max(0, Math.round(shot.at * cfg.FPS)));
  await renderStill({composition, serveUrl, output: shot.file, frame, imageFormat: 'png', browserExecutable});
  console.log(`${shot.label.padEnd(58)} ${path.basename(shot.file)}`);
}
console.log(`\n> ${shots.length} PNGs in ${path.relative(ROOT, OUT)}`);
