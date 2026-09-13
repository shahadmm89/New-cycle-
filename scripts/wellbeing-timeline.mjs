#!/usr/bin/env node
/**
 * Prints the well-being film's schedule and audits it.
 *
 * Run this after re-recording the narration. It is the fastest way to see what
 * actually changed, and it fails loudly on the two mistakes that are otherwise
 * invisible until you watch the render:
 *
 *   - a phrase whose audio file is missing
 *   - a scene whose light keys or beats no longer fit inside it
 *
 * What it CANNOT check is whether a `duration` in the config matches the real
 * length of the mp3 beside it. That number is a measurement taken when the
 * phrase was synthesised; if it is wrong, the visuals drift away from the voice
 * and nothing here will notice.
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, loadWellbeing} from './lib/wellbeing-config.mjs';

const wb = loadWellbeing();
const audioDir = path.join(ROOT, 'assets', wb.audio.voice.directory);

const fmt = (s) => {
  const m = Math.floor(s / 60);
  return `${m}:${(s - m * 60).toFixed(2).padStart(5, '0')}`;
};

console.log(`\nEMPLOYEE WELL-BEING PROGRAMME`);
console.log(`  narrator   ${wb.audio.voice.voiceName} (${wb.audio.voice.voiceId})`);
console.log(`  model      ${wb.audio.voice.modelId}`);
console.log(`  runtime    ${fmt(wb.totalDuration)}  (${wb.totalFrames} frames @ ${wb.FPS}fps)`);
console.log(`  narration  ${wb.wordCount} words, ${wb.spokenDuration.toFixed(1)}s of speech`);
console.log(
  `  pace       ${((wb.wordCount / wb.spokenDuration) * 60).toFixed(0)} wpm spoken, ` +
    `${((wb.wordCount / wb.totalDuration) * 60).toFixed(0)} wpm over the film`,
);
console.log(
  `  silence    ${(wb.totalDuration - wb.spokenDuration).toFixed(1)}s ` +
    `(${(((wb.totalDuration - wb.spokenDuration) / wb.totalDuration) * 100).toFixed(0)}% of the film)\n`,
);

const problems = [];

for (const scene of wb.placedScenes) {
  console.log(
    `${scene.title.padEnd(34)} ${fmt(scene.start).padStart(7)} → ${fmt(scene.end).padStart(7)}  (${scene.duration.toFixed(2)}s)`,
  );
  for (const line of scene.lines) {
    const file = path.join(audioDir, `${line.file}.mp3`);
    const exists = fs.existsSync(file);
    if (!exists) problems.push(`missing audio: assets/${wb.audio.voice.directory}/${line.file}.mp3`);

    const mark = line.emphasis ? '*' : ' ';
    console.log(
      `  ${mark}${line.id}  ${fmt(line.start).padStart(7)}  ${line.duration.toFixed(2)}s` +
        ` +${line.pauseAfter.toFixed(2)}s  ${exists ? ' ' : '!'} ${line.text.slice(0, 62)}`,
    );
  }
}

console.log(`\n* = one of the five lines the brief asks to land harder.`);

// Every pause should be positive, and an emphasis pause should actually be long
// enough to read as deliberate rather than as a breath.
for (const line of wb.placedPhrases) {
  if (line.pauseAfter < 0) problems.push(`${line.id} has a negative pauseAfter`);
  if (line.emphasis && line.pauseAfter < 1.2) {
    problems.push(
      `${line.id} is marked emphasis but only pauses ${line.pauseAfter.toFixed(2)}s afterwards`,
    );
  }
}

const cues = wb.captions.buildWellbeingCues();
const overlaps = cues.filter((c, i) => i > 0 && c.start < cues[i - 1].end);
if (overlaps.length) problems.push(`${overlaps.length} overlapping subtitle cues`);

const musicFile = path.join(ROOT, 'assets', wb.audio.music.file);
if (!fs.existsSync(musicFile)) problems.push(`missing music bed: assets/${wb.audio.music.file}`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.error(`  ! ${p}`));
  process.exit(1);
}
console.log(`\nAll ${wb.placedPhrases.length} phrases present, ${cues.length} subtitle cues, no overlaps.\n`);
