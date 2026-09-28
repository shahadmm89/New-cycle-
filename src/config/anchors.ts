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
  // Scene 1 - the change and why, as it is said.
  {
    scene: 'hook', beat: 'highlightPhrase', line: 's1-l1', word: 'January', lead: 0.15,
    note: 'JANUARY -> APRIL lights up on "from January to April"',
  },
  {
    scene: 'hook', beat: 'postIn', line: 's1-l2', word: 'changing', lead: 0.2,
    note: '"Only the timing changes" on "changing only the timing"',
  },
  {
    scene: 'hook', beat: 'subIn', line: 's1-l2', word: 'alignment', lead: 0.3,
    note: 'the best-practice line on "in alignment with"',
  },

  // Scenes 3 and 4 - the months the new cycle pays out on.
  {
    scene: 'march', beat: 'bonusIn', line: 's3-l1', word: 'bonus', lead: 0.2,
    note: 'BONUS on "The bonus"',
  },
  {
    scene: 'march', beat: 'payrollIn', line: 's3-l1', word: 'paid', lead: 0.2,
    note: 'the payroll chip on "paid"',
  },
  {
    scene: 'march', beat: 'timelineMar', line: 's3-l1', word: 'March', lead: 0.2,
    note: 'MARCH marker - bonus paid',
  },
  {
    scene: 'march', beat: 'monthIn', line: 's3-l1', word: 'March', lead: 0.2,
    note: 'MARCH lands on the word',
  },
  {
    scene: 'april', beat: 'timelineApr', line: 's4-l1', word: 'April', lead: 0.2,
    note: 'APRIL marker - merit & promotion adjustments reflected',
  },
  {
    scene: 'april', beat: 'monthIn', line: 's4-l1', word: 'April', lead: 0.2,
    note: 'APRIL lands on the word',
  },
  {
    scene: 'april', beat: 'meritIn', line: 's4-l1', word: 'merit', lead: 0.2,
    note: 'MERIT pillar on "merit increases"',
  },
  {
    scene: 'april', beat: 'promotionIn', line: 's4-l1', word: 'promotion', lead: 0.2,
    note: 'PROMOTION pillar on "promotion adjustments"',
  },

  // Scene 5 - the 2027 implementation year.
  {
    scene: 'example', beat: 'railIn', line: 's5-l1', word: 'twenty', lead: 0.1,
    note: 'the twelve months count in on "2027"',
  },
  {
    scene: 'example', beat: 'extraIn', line: 's5-l1', word: 'implementation', lead: 0.1,
    note: 'the three extra months on "implementation year"',
  },
  {
    scene: 'example', beat: 'settle', line: 's5-l2', word: 'change', lead: 0.2,
    note: '"the percentage itself does not change" note lands on the word',
  },

  // Scene 6 - leave balance.
  {
    scene: 'leave', beat: 'janCard', line: 's6-l1', word: 'three-month', lead: 0.2,
    note: 'JANUARY 2027 card on "a three-month balance"',
  },
  {
    scene: 'leave', beat: 'aprCard', line: 's6-l2', word: 'April', lead: 0.2,
    note: 'APRIL 2027 card on "From April"',
  },
  {
    scene: 'leave', beat: 'basisIn', line: 's6-l2', word: 'based', lead: 0.2,
    note: '"based on the updated grades" on the words',
  },

  // Scene 7 - HR contact.
  {
    scene: 'close', beat: 'contactIn', line: 's7-l1', word: 'contact', lead: 0.2,
    note: 'CONTACT HR PERSONNEL on "contact"',
  },
];
