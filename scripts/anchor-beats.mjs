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
 * this film has. The onsets come from syllable nuclei rather than from silence
 * between words, because these voices link words together and leave no gaps to
 * find - see scripts/lib/word_onsets.py.
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

/** Word onsets inside one clip, via the syllable-nuclei locator. */
const onsets = (file, text) => {
  const py = `
import json, sys
sys.path.insert(0, ${JSON.stringify(path.join(ROOT, 'scripts', 'lib'))})
import word_onsets
out, npk, tot = word_onsets.word_times(sys.argv[1], sys.argv[2])
print(json.dumps({"words": out, "nuclei": npk, "syllables": tot}))
`;
  const r = spawnSync('python3', ['-c', py, file, text], {encoding: 'utf8'});
  if (r.status !== 0) throw new Error(`word onsets failed:\n${r.stderr}`);
  return JSON.parse(r.stdout);
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
  const {words, nuclei, syllables} = onsets(file, text);
  const hit = words.find(([w]) => bare(w) === bare(a.word));
  if (!hit) {
    throw new Error(
      `anchors.ts waits for "${a.word}" in ${a.line}, but that line says:\n  ${text}`,
    );
  }
  const at = +Math.max(0, line.start + hit[1] - a.lead).toFixed(2);
  rows.push({
    ...a,
    was: scene.beats[a.beat],
    at,
    offset: hit[1],
    // The locator degrades to a syllable-proportional spread when it cannot
    // find enough nuclei; that is worth saying out loud rather than hiding.
    estimated: nuclei < syllables,
  });
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

console.log('beat                              word         at      was     move');
for (const r of rows) {
  const d = +(r.at - r.was).toFixed(2);
  console.log(
    `${`${r.scene}.${r.beat}`.padEnd(33)} ${r.word.padEnd(12)} ` +
      `${r.at.toFixed(2).padStart(6)} ${r.was.toFixed(2).padStart(7)} ` +
      `${(d ? `${d > 0 ? '+' : ''}${d}` : '-').padStart(7)}` +
      `${r.estimated ? '   (estimated - too few nuclei to place it exactly)' : ''}`,
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
