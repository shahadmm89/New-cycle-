#!/usr/bin/env node
/**
 * SYNC AUDIT
 * ----------
 * Checks the two things that make a film feel out of step with its narrator,
 * both of which are easy to introduce by nudging a number in scenes.ts:
 *
 *   1. A phrase cut off by a scene boundary - the next scene starts before the
 *      thought has finished.
 *   2. The animation finishing well before the narration, leaving the viewer
 *      looking at a still frame while the voice carries on.
 *
 * It reads the beat times from src/config/scenes.ts and the animation lengths
 * out of the scene components themselves, so it cannot drift out of date.
 *
 * Film-level layers count too: the bottom timeline in src/Video.tsx animates
 * over several scenes, and a scene is not "still" while one of its timeline
 * cues is running.
 *
 *   npm run check:sync
 *
 * Exits non-zero if anything fails, so it can gate a render.
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, loadConfig, flatVoiceLines} from './lib/config.mjs';
import {readWavInfo} from './lib/wav.mjs';

/** How long a scene may sit still while the narrator is still speaking. */
const STILL_UNDER_SPEECH = 1.5;
/** How long a scene may hold a finished frame after the last word. */
const STILL_AT_END = 1.6;

const cfg = loadConfig();
const lines = flatVoiceLines(cfg);
const SCENES_DIR = path.join(ROOT, 'src', 'scenes');

/**
 * Film-level cues out of src/Video.tsx. The bottom timeline is rendered there,
 * not in a scene, but its beats are anchored to scenes - so a pin arriving is
 * motion belonging to whichever scene owns the beat.
 */
const filmCues = () => {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'Video.tsx'), 'utf8');
  // Lengths may be written as a named constant (PIN_IN), so resolve those first.
  const consts = {};
  for (const m of src.matchAll(/^const ([A-Z][A-Z0-9_]*) = ([0-9.]+);$/gm)) {
    consts[m[1]] = Number(m[2]);
  }
  const cues = [];
  for (const m of src.matchAll(/scene: '([^']+)', beat: '([^']+)', len: ([A-Za-z0-9_.]+)/g)) {
    const len = /^[0-9.]+$/.test(m[3]) ? Number(m[3]) : consts[m[3]];
    if (len === undefined) throw new Error(`Cannot resolve cue length "${m[3]}" in Video.tsx`);
    cues.push({scene: m[1], beat: m[2], len});
  }
  return cues;
};

const FILM_CUES = filmCues();

const componentFor = (sceneId) => {
  const want = sceneId.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());
  const file = fs
    .readdirSync(SCENES_DIR)
    .find((f) => f.replace(/^Scene\d+/, '').replace(/\.tsx$/, '').toLowerCase() === want.toLowerCase());
  if (!file) throw new Error(`No component found for scene "${sceneId}" (looked for ${want})`);
  return fs.readFileSync(path.join(SCENES_DIR, file), 'utf8');
};

const durations = {};
for (const l of lines) {
  const f = path.join(ROOT, 'assets', 'audio', 'lines', `${l.id}.wav`);
  durations[l.id] = fs.existsSync(f) ? readWavInfo(f).duration : 0;
}

let failures = 0;
const rows = [];

for (const scene of cfg.scenes) {
  const src = componentFor(scene.id);

  // When does the last thing on screen stop moving?
  let motionEnds = 0;
  let motionBeat = '-';
  const consider = (end, label) => {
    if (end > motionEnds) {
      motionEnds = end;
      motionBeat = label;
    }
  };
  for (const m of src.matchAll(/useProgress\('([^']+)',\s*([0-9.]+)/g)) {
    const at = scene.beats[m[1]];
    if (at !== undefined) consider(at + Number(m[2]), m[1]);
  }
  for (const m of src.matchAll(/usePulse\('([^']+)',\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+)/g)) {
    const at = scene.beats[m[1]];
    if (at !== undefined) consider(at + Number(m[2]) + Number(m[3]) + Number(m[4]), m[1]);
  }
  // useSpan(from, to) animates between two scene-relative marks.
  for (const m of src.matchAll(/useSpan\(\s*([0-9.]+),\s*([0-9.]+)/g)) consider(Number(m[2]), 'useSpan');
  // useIdle never stops - the scene drifts for its whole length.
  const idles = src.includes('useIdle(');
  if (idles) consider(scene.duration, 'useIdle (continuous)');
  // The bottom timeline, whose cues are anchored to this scene's beats.
  for (const c of FILM_CUES.filter((c) => c.scene === scene.id)) {
    const at = scene.beats[c.beat];
    if (at === undefined) throw new Error(`Video.tsx cues scene "${c.scene}" beat "${c.beat}", which does not exist`);
    consider(at + c.len, `${c.beat} (timeline)`);
  }

  const own = lines.filter((l) => l.sceneId === scene.id);
  const wordsEnd = own.length ? Math.max(...own.map((l) => l.start + durations[l.id])) : 0;

  const problems = [];
  if (wordsEnd > scene.duration + 0.01) {
    problems.push(`phrase runs ${(wordsEnd - scene.duration).toFixed(2)}s past the scene`);
  }
  const stillUnder = +(wordsEnd - motionEnds).toFixed(2);
  if (stillUnder > STILL_UNDER_SPEECH) {
    problems.push(`still for ${stillUnder.toFixed(1)}s while the narrator is still speaking`);
  }
  const stillAfter = +(scene.duration - Math.max(wordsEnd, motionEnds)).toFixed(2);
  if (stillAfter > STILL_AT_END) {
    problems.push(`holds a finished frame for ${stillAfter.toFixed(1)}s`);
  }
  if (problems.length) failures++;

  rows.push({
    id: scene.id,
    duration: scene.duration,
    wordsEnd,
    motionEnds,
    motionBeat,
    stillUnder,
    stillAfter,
    problems,
  });
}

console.log('scene         dur   last word   last motion                    verdict');
for (const r of rows) {
  console.log(
    `${r.id.padEnd(12)} ${r.duration.toFixed(2).padStart(5)} ` +
      `${r.wordsEnd.toFixed(2).padStart(11)} ` +
      `${r.motionEnds.toFixed(2).padStart(8)}  ${r.motionBeat.padEnd(22)} ` +
      (r.problems.length ? `FAIL - ${r.problems.join('; ')}` : 'ok'),
  );
}

const gaps = [];
for (let i = 0; i < lines.length - 1; i++) {
  gaps.push(lines[i + 1].absoluteStart - (lines[i].absoluteStart + durations[lines[i].id]));
}
gaps.sort((a, b) => a - b);
const median = gaps[Math.floor(gaps.length / 2)];
console.log(
  `\nphrase gaps: median ${median.toFixed(2)}s, longest ${gaps[gaps.length - 1].toFixed(2)}s ` +
    `(configured; real silence is ~0.2s more, see voiceover.pacing.ts)`,
);
console.log(`total ${cfg.totalDuration.toFixed(2)}s across ${cfg.scenes.length} scenes`);

if (failures) {
  console.error(`\n${failures} scene(s) failed the sync audit.`);
  process.exit(1);
}
console.log('\nAll scenes pass: nothing runs ahead of the voice, nothing waits for it.');
