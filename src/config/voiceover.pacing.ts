/**
 * THE APPROVED PACING, in seconds of real silence.
 *
 * These are the numbers that should survive a voice change: how long the
 * narrator waits before starting a scene, between thoughts inside it, and
 * before the scene ends. They are speech-to-speech - each clip's own leading
 * and trailing silence is excluded - so they mean the same thing whichever
 * engine produced the audio.
 *
 * `npm run voiceover:plan -- --write` turns them into absolute times in
 * scenes.ts, and `--snapshot` captures them back out of an approved cut.
 *
 * WRITTEN BY HAND, not captured. The previous snapshot described the previous
 * script; the refined cut has a scene the old one did not and phrases split
 * differently, so there was nothing to measure against. The values below are
 * the INTENT for this read:
 *
 *   ~0.45-0.55   a clause continuing the same sentence - barely a breath
 *   ~0.85-0.95   one thought to the next inside a scene
 *   ~1.05-1.15   a turn: merit to bonus, the setup to the example
 *   ~1.3         the final hold before the film ends
 *
 * They are authored at their FINAL length, so `--pause-scale` should stay at 1
 * unless the whole film is being re-paced. Re-snapshot once all 34 phrases are
 * recorded and the cut is approved; from then on this file is a measurement
 * again.
 *
 * A scene marked `silent` has no narration; its duration is kept as-is.
 */
export interface ScenePacing {
  id: string;
  /** Scene start -> first word. */
  leadIn?: number;
  /** Silence between consecutive phrases, in order. */
  pauses?: number[];
  /** Last word -> scene end. */
  tail?: number;
  silent?: boolean;
  duration?: number;
}

export const pacing: ScenePacing[] = [
  {
    "id": "hook",
    "leadIn": 0.45,
    "pauses": [1.0],
    "tail": 0.85
  },
  {
    "id": "old-cycle",
    "leadIn": 0.4,
    "pauses": [0.95],
    "tail": 0.9
  },
  {
    "id": "today",
    "leadIn": 0.45,
    "pauses": [0.45, 1.05, 1.15, 0.5],
    "tail": 1.0
  },
  {
    "id": "the-change",
    "leadIn": 0.4,
    "pauses": [1.15],
    "tail": 0.95
  },
  {
    "id": "actual-data",
    "leadIn": 0.4,
    "pauses": [0.95, 0.85, 1.05, 0.5],
    "tail": 0.95
  },
  {
    "id": "april",
    "leadIn": 0.4,
    "pauses": [0.95],
    "tail": 0.95
  },
  {
    "id": "march",
    "leadIn": 0.45,
    "pauses": [0.95],
    "tail": 0.9
  },
  {
    "id": "no-change",
    "leadIn": 0.4,
    "pauses": [0.85, 0.55],
    "tail": 0.95
  },
  {
    "id": "example",
    "leadIn": 0.45,
    "pauses": [0.9, 1.05, 0.55, 0.55, 0.5, 1.05],
    "tail": 1.0
  },
  {
    "id": "summary",
    "leadIn": 0.5,
    "pauses": [0.95],
    "tail": 0.85
  },
  {
    "id": "close",
    "leadIn": 0.55,
    "pauses": [0.9],
    "tail": 1.3
  }
];
