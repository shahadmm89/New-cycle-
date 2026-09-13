#!/usr/bin/env node
/**
 * Writes the well-being film's subtitle sidecars from the same cue list the
 * burned-in captions use, so the two can never disagree:
 *
 *   output/wellbeing-programme.srt   (Teams, SharePoint, most players)
 *   output/wellbeing-programme.vtt   (web players, HTML5 <track>)
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, loadWellbeing} from './lib/wellbeing-config.mjs';

const wb = loadWellbeing();
const cues = wb.captions.buildWellbeingCues();

const outDir = path.join(ROOT, 'output');
fs.mkdirSync(outDir, {recursive: true});

const srt = path.join(outDir, 'wellbeing-programme.srt');
const vtt = path.join(outDir, 'wellbeing-programme.vtt');
fs.writeFileSync(srt, wb.captions.toSrt(cues));
fs.writeFileSync(vtt, wb.captions.toVtt(cues));

console.log(`${cues.length} cues over ${wb.totalDuration.toFixed(2)}s`);
console.log(`  ${path.relative(ROOT, srt)}`);
console.log(`  ${path.relative(ROOT, vtt)}`);

const longest = cues.reduce((a, c) => (c.text.length > a.text.length ? c : a));
console.log(`  longest line: ${longest.text.length} chars - "${longest.text}"`);

const overlaps = cues.filter((c, i) => i > 0 && c.start < cues[i - 1].end);
if (overlaps.length) {
  console.error(`! ${overlaps.length} overlapping cues`);
  process.exit(1);
}
