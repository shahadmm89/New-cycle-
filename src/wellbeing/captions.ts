/**
 * Subtitles for the well-being film.
 *
 * Cues are derived from the same timeline the audio is mounted from, so they
 * cannot drift: a cue starts when its phrase starts, and the phrase's measured
 * duration is shared across its caption chunks in proportion to how much text
 * each one carries.
 *
 * The last chunk of a line is allowed to run a little way into the pause that
 * follows it. Those pauses are long in this film by design, and a viewer
 * reading rather than listening should not have the words snatched away the
 * instant the narrator stops.
 */
import {placedPhrases, totalDuration} from '../config/wellbeing';

export interface Cue {
  id: string;
  start: number;
  end: number;
  text: string;
}

/** Shortest a cue may be, however little text it carries. */
const MIN_CUE = 0.9;
/** How far a line's last cue may hang into the silence after it. */
const LINGER = 0.55;

export const buildWellbeingCues = (): Cue[] => {
  const cues: Cue[] = [];

  placedPhrases.forEach((line, i) => {
    const next = placedPhrases[i + 1]?.start ?? totalDuration;
    const chunks = line.captions.length ? line.captions : [line.text];
    const weights = chunks.map((c) => Math.max(8, c.replace(/\s+/g, ' ').length));
    const total = weights.reduce((a, b) => a + b, 0);

    let cursor = line.start;
    chunks.forEach((chunk, j) => {
      const isLast = j === chunks.length - 1;
      const share = (line.duration * weights[j]) / total;
      const start = cursor;
      const end = isLast
        ? Math.min(next - 0.1, line.end + LINGER)
        : start + share;
      cues.push({
        id: `${line.id}-${j}`,
        start,
        end: Math.max(end, start + MIN_CUE),
        text: chunk,
      });
      cursor = end;
    });
  });

  // A cue must never outlive the start of the one after it.
  for (let i = 0; i < cues.length - 1; i++) {
    cues[i].end = Math.min(cues[i].end, cues[i + 1].start - 0.02);
  }
  return cues.filter((c) => c.end > c.start);
};

const pad = (n: number, len = 2) => String(Math.floor(n)).padStart(len, '0');

/**
 * Milliseconds are rounded BEFORE the value is split into h/m/s, because
 * rounding afterwards can produce ",1000", which is not a legal timestamp and
 * which some players reject outright.
 */
export const formatTimestamp = (seconds: number, msSeparator = ','): string => {
  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const ms = totalMs % 1000;
  const whole = (totalMs - ms) / 1000;
  return `${pad(Math.floor(whole / 3600))}:${pad(Math.floor(whole / 60) % 60)}:${pad(whole % 60)}${msSeparator}${pad(ms, 3)}`;
};

export const toSrt = (cues: Cue[]): string =>
  cues
    .map((c, i) => `${i + 1}\n${formatTimestamp(c.start)} --> ${formatTimestamp(c.end)}\n${c.text}\n`)
    .join('\n');

export const toVtt = (cues: Cue[]): string =>
  `WEBVTT\n\n${cues
    .map((c) => `${formatTimestamp(c.start, '.')} --> ${formatTimestamp(c.end, '.')}\n${c.text}\n`)
    .join('\n')}`;
