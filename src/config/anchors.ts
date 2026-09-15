/**
 * BEATS THAT ARE PINNED TO A WORD
 * -------------------------------
 * Most beats only need to move with the phrase they belong to, which
 * `npm run voiceover:plan -- --write` does on its own. A few have to land on a
 * PARTICULAR WORD inside that phrase, and those cannot be derived from a phrase
 * start - they have to be measured against the recording.
 *
 *   npm run voiceover:anchor          what the current audio implies
 *   npm run voiceover:anchor -- --write   apply it to scenes.ts
 *
 * Run it AFTER voiceover:plan, because plan moves phrases and this places beats
 * inside them.
 *
 * These times do not survive a voice change. Two narrators saying the same
 * sentence reach "November" at different moments, and a marker that arrives
 * before or after the word it names is the most visible sync error this film
 * can have - it is the thing a viewer notices without being able to say why.
 * So the numbers in scenes.ts are provisional by nature, and this file is what
 * makes them re-derivable rather than re-guessable.
 */

export interface Anchor {
  /** Scene that owns the beat. */
  scene: string;
  /** The beat to place. */
  beat: string;
  /** The phrase the word is spoken in. */
  line: string;
  /**
   * The word, as it appears in that line's spoken text. Matched on the first
   * occurrence, case-insensitively, ignoring punctuation.
   */
  word: string;
  /**
   * Seconds BEFORE the word's onset to fire the beat, so the animation is
   * landing as the word is said rather than starting there. A pin takes ~0.7s
   * to arrive, so 0.2 puts it about a third in when the word lands.
   */
  lead: number;
  /** Why this one matters, for whoever reads a diff of scenes.ts. */
  note: string;
}

export const anchors: Anchor[] = [
  // The bottom timeline. These five are the markers the film is judged on.
  {
    scene: 'today', beat: 'timelineNov', line: 's3-l3', word: 'November', lead: 0.2,
    note: 'NOVEMBER marker - merit, expected market movement',
  },
  {
    scene: 'today', beat: 'timelineDec', line: 's3-l5', word: 'December', lead: 0.2,
    note: 'DECEMBER marker - bonus, estimated Company Performance KPIs',
  },
  {
    scene: 'actual-data', beat: 'timelineJan', line: 's5-l2', word: 'January', lead: 0.2,
    note: 'JANUARY marker - actual Company Performance',
  },
  {
    scene: 'actual-data', beat: 'timelineFeb', line: 's5-l3', word: 'February', lead: 0.2,
    note: 'FEBRUARY marker - actual market movement',
  },
  {
    scene: 'april', beat: 'timelineApr', line: 's6-l1', word: 'April', lead: 0.2,
    note: 'APRIL marker - merit and promotion take effect on April 1',
  },
  {
    scene: 'march', beat: 'timelineMar', line: 's7-l1', word: 'March', lead: 0.2,
    note: 'MARCH marker - bonus paid in the March payroll',
  },

  // The two biggest visual landings in the film.
  {
    scene: 'the-change', beat: 'bigReveal', line: 's4-l2', word: 'April', lead: 0.15,
    note: 'APR -> MAR lands on "From April, to March"',
  },
  {
    scene: 'example', beat: 'resultIn', line: 's9-l6', word: 'six', lead: 0.15,
    note: '6.25% appears as the number is said',
  },
  {
    scene: 'example', beat: 'settle', line: 's9-l7', word: 'changed', lead: 0.2,
    note: 'the "merit percentage has not changed" note lands on the word itself',
  },
];
