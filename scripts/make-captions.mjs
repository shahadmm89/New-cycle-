#!/usr/bin/env node
/**
 * Writes the subtitle sidecars from the same cue list the burned-in captions
 * use, so the two can never disagree:
 *
 *   output/salary-cycle-update.srt   (Teams, SharePoint, most players)
 *   output/salary-cycle-update.vtt   (web players, HTML5 <track>)
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, loadConfig} from './lib/config.mjs';

const config = loadConfig();
const {buildCues, toSrt, toVtt} = config.captions;
const cues = buildCues();

const outDir = path.join(ROOT, 'output');
fs.mkdirSync(outDir, {recursive: true});

const srt = path.join(outDir, 'salary-cycle-update.srt');
const vtt = path.join(outDir, 'salary-cycle-update.vtt');
fs.writeFileSync(srt, toSrt(cues));
fs.writeFileSync(vtt, toVtt(cues));

console.log(`${cues.length} cues`);
console.log(`  ${path.relative(ROOT, srt)}`);
console.log(`  ${path.relative(ROOT, vtt)}`);

const longest = cues.reduce((a, c) => (c.text.length > a.text.length ? c : a));
console.log(`  longest line: ${longest.text.length} chars - "${longest.text}"`);
const overlaps = cues.filter((c, i) => i > 0 && c.start < cues[i - 1].end);
if (overlaps.length) console.log(`! ${overlaps.length} overlapping cues`);
