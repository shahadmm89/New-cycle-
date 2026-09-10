/**
 * Builds subtitle cues from the master timeline.
 *
 * Each voice line declares its own short caption chunks. The measured duration
 * of the spoken line is shared out across those chunks in proportion to how
 * much text each one carries, which tracks natural speech closely enough to
 * feel locked to the voice.
 */
import {flatVoiceLines, totalDuration} from '../config/scenes';
import {measuredDurations} from '../config/voiceover.timing';

/** Speaking rate used when no rendered audio has been measured yet. */
const WORDS_PER_SECOND = 155 / 60;
const MIN_CUE = 0.85;

export interface Cue {
  id: string;
  start: number;
  end: number;
  text: string;
}

export const estimateLineDuration = (text: string): number => {
  const words = text.trim().split(/\s+/).length;
  // Punctuation buys a small pause, which the narrator will take too.
  const pauses = (text.match(/[,;:]/g)?.length ?? 0) * 0.16 + (text.match(/[.!?]/g)?.length ?? 0) * 0.28;
  return words / WORDS_PER_SECOND + pauses;
};

export const buildCues = (): Cue[] => {
  const lines = flatVoiceLines();
  const cues: Cue[] = [];

  lines.forEach((line, lineIndex) => {
    const measured = measuredDurations[line.id];
    const duration = measured ?? estimateLineDuration(line.spoken ?? line.text);
    const nextStart = lines[lineIndex + 1]?.absoluteStart ?? totalDuration;

    const chunks = line.captions.length ? line.captions : [line.text];
    const weights = chunks.map((c) => Math.max(8, c.replace(/\s+/g, ' ').length));
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    let cursor = line.absoluteStart;
    chunks.forEach((chunk, i) => {
      const isLast = i === chunks.length - 1;
      const share = (duration * weights[i]) / totalWeight;
      const start = cursor;
      // The last chunk lingers a little into the gap before the next line, so
      // viewers reading rather than listening are never rushed.
      const end = isLast
        ? Math.min(nextStart - 0.08, start + Math.max(share, MIN_CUE) + 0.45)
        : start + share;
      cues.push({id: `${line.id}-${i}`, start, end: Math.max(end, start + MIN_CUE), text: chunk});
      cursor = end;
    });
  });

  // Never let one cue run into the next.
  for (let i = 0; i < cues.length - 1; i++) {
    cues[i].end = Math.min(cues[i].end, cues[i + 1].start - 0.02);
  }
  return cues.filter((c) => c.end > c.start);
};

const pad = (n: number, len = 2) => String(Math.floor(n)).padStart(len, '0');

export const formatTimestamp = (seconds: number, msSeparator = ','): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}${msSeparator}${pad(ms, 3)}`;
};

export const toSrt = (cues: Cue[]): string =>
  cues
    .map((c, i) => `${i + 1}\n${formatTimestamp(c.start)} --> ${formatTimestamp(c.end)}\n${c.text}\n`)
    .join('\n');

export const toVtt = (cues: Cue[]): string =>
  `WEBVTT\n\n${cues
    .map((c) => `${formatTimestamp(c.start, '.')} --> ${formatTimestamp(c.end, '.')}\n${c.text}\n`)
    .join('\n')}`;
