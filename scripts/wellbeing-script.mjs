#!/usr/bin/env node
/**
 * Writes the narration script to output/wellbeing-voiceover-script.md.
 *
 * This is the document to hand a human narrator if the company ever wants to
 * re-record the film with a real voice. It carries what a synthesiser gets for
 * free and a person does not: where every pause goes, how long it should be,
 * and which five lines have to land.
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, loadWellbeing} from './lib/wellbeing-config.mjs';

const wb = loadWellbeing();

const stamp = (s) => {
  const m = Math.floor(s / 60);
  return `${m}:${(s - m * 60).toFixed(1).padStart(4, '0')}`;
};

const lines = [];
lines.push('# Employee Well-being Programme — narration script');
lines.push('');
lines.push(
  `**${wb.wordCount} words · ${wb.placedPhrases.length} phrases · ` +
    `${stamp(wb.totalDuration)} total runtime**`,
);
lines.push('');
lines.push(
  'Read at a natural, unhurried pace — warm, confident, sincere, as if speaking',
  'directly to a colleague rather than reading an announcement. Do not rush',
  'between sentences.',
);
lines.push('');
lines.push('The timings below are from the current recording, for reference.');
lines.push('The **pauses are the direction**: they are what makes the film calm.');
lines.push('');
lines.push('Lines marked **★** must land harder — give them weight, and let the');
lines.push('silence after them sit.');
lines.push('');
lines.push('---');
lines.push('');

for (const scene of wb.placedScenes) {
  lines.push(`## ${scene.title}`);
  lines.push('');
  lines.push(`*${stamp(scene.start)} – ${stamp(scene.end)}*`);
  lines.push('');
  for (const line of scene.lines) {
    lines.push(`${line.emphasis ? '★ ' : ''}> ${line.text}`);
    lines.push('>');
    lines.push(
      `> <sub>${stamp(line.start)} · spoken ${line.duration.toFixed(2)}s · ` +
        `then pause **${line.pauseAfter.toFixed(2)}s**${line.emphasis ? ' — let it sit' : ''}</sub>`,
    );
    lines.push('');
  }
}

lines.push('---');
lines.push('');
lines.push('## Notes for a re-record');
lines.push('');
lines.push(
  '- Two sentences are split into separate phrases on purpose, because the brief',
  '  asks for a pause inside them. Record them as two takes, not one:',
  '  *"Starting in Q4 2026," / "we will begin turning these recommendations into',
  '  action."* and *"More details will be shared with you shortly," / "including',
  '  our detailed action plan…"*',
);
lines.push('- "Q4 2026" is read "Q-four, twenty twenty-six".');
lines.push(
  '- Deliver each phrase as its own take. The film assembles them against the',
  '  timeline and inserts the pauses itself — silence recorded at the end of a',
  '  take is discarded.',
);
lines.push('');

const out = path.join(ROOT, 'output', 'wellbeing-voiceover-script.md');
fs.mkdirSync(path.dirname(out), {recursive: true});
fs.writeFileSync(out, lines.join('\n'));
console.log(`${wb.placedPhrases.length} phrases -> ${path.relative(ROOT, out)}`);
