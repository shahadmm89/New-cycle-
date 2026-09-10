#!/usr/bin/env node
/**
 * Writes the human-readable voice-over script that a narrator (or a voice
 * agency) can record from: output/voiceover-script.md
 *
 * It is generated from src/config/scenes.ts, so it always matches the video.
 */
import fs from 'node:fs';
import path from 'node:path';
import {ROOT, loadConfig, flatVoiceLines} from './lib/config.mjs';

const config = loadConfig();
const lines = flatVoiceLines(config);

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(2).padStart(5, '0')}`;

let out = `# Voice-over script - ${config.copy.videoTitle}

Total running time: **${config.totalDuration} seconds** (${config.scenes.length} scenes, ${config.FPS} fps).

Tone: warm, confident, conversational - a friendly HR colleague explaining a
change, not a policy announcement. Moderate pace, with a clear pause between
scenes. Nothing needs to be rushed: every line has been timed with room to breathe.

Record each line as its own take and name the file after the LINE ID below
(\`s5-l2.wav\` and so on), or record one continuous take - see docs/VOICEOVER.md.

| Line ID | In | Slot | Scene | Words |
|---|---|---|---|---|
`;

for (const line of lines) {
  out += `| \`${line.id}\` | ${mmss(line.absoluteStart)} | ${line.window.toFixed(1)}s | ${line.sceneTitle} | ${line.text.trim().split(/\s+/).length} |\n`;
}

out += '\n---\n\n';

config.scenes.forEach((scene, i) => {
  const start = config.sceneStarts[i];
  out += `## ${scene.title}\n\n`;
  out += `**${mmss(start)} - ${mmss(start + scene.duration)}** (${scene.duration}s)\n\n`;
  if (!scene.voice.length) {
    out += '_No narration in this scene._\n\n';
  }
  scene.voice.forEach((line) => {
    out += `**\`${line.id}\`** - in at ${mmss(start + line.start)}\n\n`;
    out += `> ${line.text}\n\n`;
    if (line.spoken && line.spoken !== line.text) {
      out += `_Say it as:_ ${line.spoken}\n\n`;
    }
  });
});

out += `---

## Full script, uninterrupted

${lines.map((l) => l.text).join(' ')}
`;

const outDir = path.join(ROOT, 'output');
fs.mkdirSync(outDir, {recursive: true});
const file = path.join(outDir, 'voiceover-script.md');
fs.writeFileSync(file, out);
console.log(path.relative(ROOT, file));
console.log(`  ${lines.length} lines, ${lines.reduce((n, l) => n + l.text.split(/\s+/).length, 0)} words`);
