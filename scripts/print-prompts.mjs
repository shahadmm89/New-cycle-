#!/usr/bin/env node
/**
 * THE GENERATION ORDER
 * --------------------
 * Prints exactly what has to be sent to the speech engine, in the order it has
 * to be sent, so recording the film is a mechanical pass rather than a judgement
 * call made 34 times.
 *
 *   npm run voiceover:prompts            what is still missing
 *   npm run voiceover:prompts -- --all   the whole script, recorded or not
 *
 * Two things this exists to prevent:
 *
 *   1. Sending the on-screen wording instead of the spoken wording. A line's
 *      `spoken` field is what the engine gets - "April first", "H R personnel",
 *      "Company Performance K-P-Is" - and it is never what appears on screen.
 *   2. Sending too many at once. The account allows TWO concurrent requests; a
 *      third fails AND IS STILL BILLED. So the output is paired, and a pair is
 *      only started once the previous pair has come back.
 *
 * The character count is the credit estimate: this engine bills at roughly one
 * credit per character, so a run that does not fit the balance can be seen
 * before it is started rather than halfway through.
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, loadConfig, flatVoiceLines} from './lib/config.mjs';

const all = process.argv.includes('--all');
const cfg = loadConfig();
const el = cfg.voiceover.tts.elevenlabs;
const LINES_DIR = path.join(ROOT, 'assets', 'audio', 'lines');

const lines = flatVoiceLines(cfg).filter(
  (l) => all || !fs.existsSync(path.join(LINES_DIR, `${l.id}.wav`)),
);

if (!lines.length) {
  console.log('Every phrase is recorded. Nothing to generate.');
  process.exit(0);
}

const chars = lines.reduce((n, l) => n + (l.spoken ?? l.text).length, 0);

console.log(`voice   ${el.voiceName}  (${el.voiceId})`);
console.log(`model   ${el.modelId}`);
console.log(`to do   ${lines.length} of ${flatVoiceLines(cfg).length} phrases, ${chars} characters`);
console.log(`        ~${chars} credits at this engine's rate, so budget ~${Math.ceil((chars * 1.1) / 100) * 100}\n`);

for (let i = 0; i < lines.length; i += 2) {
  const pair = lines.slice(i, i + 2);
  console.log(`--- pair ${String(i / 2 + 1).padStart(2)} (wait for both before starting the next) ---`);
  for (const l of pair) {
    console.log(`${l.id.padEnd(7)} ${String((l.spoken ?? l.text).length).padStart(3)}c  ${l.spoken ?? l.text}`);
    if (l.spoken) console.log(`${''.padEnd(7)}      on screen: ${l.text}`);
  }
}

console.log(`
Then, in order:
  npm run voiceover:build -- --assemble-only   lay the takes onto one track
  npm run voiceover:plan -- --write            re-time every scene to the new read
  npm run check:sync                           prove nothing is cut off or stranded
  npm run captions && npm run render

Between the re-time and the render, re-measure the beats that are pinned to a
particular word - the bottom-timeline markers above all - against the onsets in
the new clips. See RE-ANCHORING in src/config/scenes.ts.`);
