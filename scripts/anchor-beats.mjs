#!/usr/bin/env node
/**
 * PLACE THE WORD-PINNED BEATS
 * ---------------------------
 * A handful of beats have to land on a particular WORD rather than at a fixed
 * offset into a phrase - the bottom-timeline month markers above all. This
 * measures where that word actually falls inside its recording and writes the
 * beat to match.
 *
 *   npm run voiceover:anchor              show what the audio implies
 *   npm run voiceover:anchor -- --write    apply it to src/config/scenes.ts
 *
 * Run it AFTER `npm run voiceover:plan -- --write`: plan places the phrases,
 * this places beats inside them. Running it before means measuring against
 * phrase starts that are about to move.
 *
 * WHY MEASURED AND NOT ESTIMATED. Spreading the words of a phrase evenly across
 * its duration is wrong by a third of a second or more on a long word, and a
 * marker that arrives before the month it names is the most visible sync error
 * this film has.
 *
 * With a local engine the word is measured by saying it on its own and finding
 * where in the phrase it fits best - see scripts/lib/word_probe.py. That is
 * exact where counting syllable nuclei is a guess: on this read the nuclei
 * count was out by up to six on a nineteen-syllable line, which placed APRIL a
 * second and a half from where it is actually said.
 *
 * With a hosted engine there is nothing to say the word with, so it falls back
 * to the nuclei estimate and marks every row it could not measure.
 *
 * Which beats, and which word each one waits for, is declared in
 * src/config/anchors.ts.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT, loadConfig} from './lib/config.mjs';
import {setBeat, sceneBlock} from './lib/scenes-edit.mjs';

const write = process.argv.includes('--write');
const SCENES_TS = path.join(ROOT, 'src', 'config', 'scenes.ts');
const LINES_DIR = path.join(ROOT, 'assets', 'audio', 'lines');

const cfg = loadConfig();
const anchors = cfg.anchors.anchors ?? cfg.anchors;

const LIB = JSON.stringify(path.join(ROOT, 'scripts', 'lib'));
const tts = cfg.voiceover.tts;
/** Only a local engine can say a probe word in the same voice, for free. */
const canProbe = tts.engine === 'kokoro';

/**
 * Where `word` starts inside `file`, in seconds from the start of the clip.
 * Returns {at, score, exact}. `exact` is false when this had to fall back to
 * the syllable estimate, which the report then says out loud.
 */
const onsetOf = (file, text, word) => {
  const idx = text
    .split(/\s+/)
    .findIndex((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '') === word.toLowerCase().replace(/[^a-z0-9]/g, ''));
  if (idx < 0) {
    throw new Error(`anchors.ts waits for "${word}", but the line says:\n  ${text}`);
  }

  if (canProbe) {
    const py = `
import json, sys
sys.path.insert(0, ${LIB})
import word_probe
at, score = word_probe.find(
    sys.argv[1], sys.argv[2],
    ${JSON.stringify(path.join(ROOT, 'assets', 'tts', 'kokoro'))},
    ${tts.speakerId}, ${tts.speed},
    text=sys.argv[3], word_index=int(sys.argv[4]))
print(json.dumps({"at": at, "score": score}))
`;
    const r = spawnSync('python3', ['-c', py, file, word, text, String(idx)], {encoding: 'utf8'});
    if (r.status !== 0) throw new Error(`word probe failed:\n${r.stderr}`);
    const {at, score} = JSON.parse(r.stdout);
    if (at !== null) return {at, score, exact: true};
  }

  const py = `
import json, sys
sys.path.insert(0, ${LIB})
import word_onsets
out, npk, tot = word_onsets.word_times(sys.argv[1], sys.argv[2])
print(json.dumps({"words": out, "nuclei": npk, "syllables": tot}))
`;
  const r = spawnSync('python3', ['-c', py, file, text], {encoding: 'utf8'});
  if (r.status !== 0) throw new Error(`word onsets failed:\n${r.stderr}`);
  const {words, nuclei, syllables} = JSON.parse(r.stdout);
  return {at: words[idx][1], score: 0, exact: nuclei >= syllables};
};

const bare = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

const rows = [];
const missing = [];
for (const a of anchors) {
  const scene = cfg.scenes.find((s) => s.id === a.scene);
  if (!scene) throw new Error(`anchors.ts names scene "${a.scene}", which does not exist`);
  if (scene.beats[a.beat] === undefined) {
    throw new Error(`anchors.ts names beat "${a.scene}.${a.beat}", which does not exist`);
  }
  const line = scene.voice.find((v) => v.id === a.line);
  if (!line) throw new Error(`anchors.ts names line "${a.line}", which is not in scene "${a.scene}"`);

  const file = path.join(LINES_DIR, `${a.line}.wav`);
  if (!fs.existsSync(file)) {
    missing.push(a);
    continue;
  }

  const text = line.spoken ?? line.text;
  const {at: offset, score, exact} = onsetOf(file, text, a.word);
  const at = +Math.max(0, line.start + offset - a.lead).toFixed(2);
  rows.push({...a, was: scene.beats[a.beat], at, offset, score, estimated: !exact});
}

if (missing.length) {
  console.log(
    `! no recording yet for: ${[...new Set(missing.map((m) => m.line))].join(' ')}\n` +
      `  ${missing.length} anchor(s) left alone. Generate the narration first.\n`,
  );
}

if (!rows.length) {
  console.log('Nothing to measure. Every anchored beat is waiting on its recording.');
  process.exit(0);
}

console.log(
  `placing beats on their word by ${canProbe ? 'matching a locally spoken probe' : 'syllable estimate'}\n`,
);
console.log('beat                              word         at      was     move   match');
let weak = 0;
for (const r of rows) {
  const d = +(r.at - r.was).toFixed(2);
  // Below this the probe is not confidently on the word, and the number it
  // returns should not be written into the film without a look.
  const low = r.score > 0 && r.score < 0.45;
  if (low || r.estimated) weak++;
  console.log(
    `${`${r.scene}.${r.beat}`.padEnd(33)} ${r.word.padEnd(12)} ` +
      `${r.at.toFixed(2).padStart(6)} ${r.was.toFixed(2).padStart(7)} ` +
      `${(d ? `${d > 0 ? '+' : ''}${d}` : '-').padStart(7)}` +
      `${r.estimated ? '   estimated only' : `   ${r.score.toFixed(2)}${low ? '  LOW' : ''}`}`,
  );
}
if (weak) {
  console.log(
    `\n! ${weak} beat(s) were not confidently measured. Check those against the\n` +
      `  audio before rendering - see the note in src/config/anchors.ts.`,
  );
}

const moved = rows.filter((r) => +(r.at - r.was).toFixed(2) !== 0);
if (!moved.length) {
  console.log('\nEvery anchored beat already sits on its word.');
  process.exit(0);
}
if (!write) {
  console.log('\nRe-run with --write to apply this to src/config/scenes.ts.');
  process.exit(0);
}

let src = fs.readFileSync(SCENES_TS, 'utf8');
for (const r of moved) {
  const [from, to] = sceneBlock(src, r.scene);
  src = src.slice(0, from) + setBeat(src.slice(from, to), r.scene, r.beat, r.at) + src.slice(to);
}
fs.writeFileSync(SCENES_TS, src);
console.log(`\n> updated ${path.relative(ROOT, SCENES_TS)} - ${moved.length} beat(s) placed on their word`);
console.log('\nNow: npm run check:sync && npm run captions && npm run render');
