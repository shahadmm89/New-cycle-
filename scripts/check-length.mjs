#!/usr/bin/env node
/**
 * The mounted audio and the composition must be the same length.
 *
 * They drift apart in one specific way: the scenes get re-timed and the track
 * is not re-assembled afterwards, so every line sits where the previous read
 * put it. The film still renders - it just runs out of sync, increasingly, from
 * whichever scene moved first. That is invisible in a still and obvious in the
 * finished MP4, which is the worst place to find it.
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, loadConfig} from './lib/config.mjs';
import {readWavInfo} from './lib/wav.mjs';

const cfg = loadConfig();
const file = cfg.voiceover.audioFile;
if (!file) process.exit(0); // deliberately silent film

const wav = path.join(ROOT, 'assets', file);
if (!fs.existsSync(wav)) {
  console.error(`No mounted audio at assets/${file}. Run: npm run voiceover:build`);
  process.exit(1);
}

const audio = readWavInfo(wav).duration;
const film = cfg.totalDuration;
const drift = +(audio - film).toFixed(2);
// One frame. Anything more means the track and the timeline disagree.
const TOLERANCE = 1 / cfg.FPS;

console.log(`audio ${audio.toFixed(2)}s vs film ${film.toFixed(2)}s (drift ${drift >= 0 ? '+' : ''}${drift}s)`);
if (Math.abs(drift) > TOLERANCE) {
  console.error(
    `\nThe narration track does not match the timeline.\n` +
      `Re-assemble it against the current scene times:\n` +
      `  npm run voiceover:build -- --assemble-only`,
  );
  process.exit(1);
}
