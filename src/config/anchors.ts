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
  // Scenes 3 and 4 - the wheel points at the month as it is named.
  {
    scene: 'march', beat: 'monthIn', line: 's3-l1', word: 'bonus', lead: 0.3,
    note: 'MARCH label as the line starts',
  },
  {
    scene: 'march', beat: 'bonusIn', line: 's3-l1', word: 'paid', lead: 0.2,
    note: 'BONUS PAID on "paid"',
  },
  {
    scene: 'april', beat: 'aprLit', line: 's4-l1', word: 'April', lead: 0.3,
    note: 'the APRIL segment lights on the word',
  },
  {
    scene: 'april', beat: 'monthIn', line: 's4-l1', word: 'April', lead: 0.15,
    note: 'APRIL label on the word',
  },
  {
    scene: 'april', beat: 'meritIn', line: 's4-l1', word: 'merit', lead: 0.2,
    note: 'MERIT INCREASES on "merit increases"',
  },
  {
    scene: 'april', beat: 'promotionIn', line: 's4-l1', word: 'promotion', lead: 0.2,
    note: 'PROMOTION ACTION on "promotion action"',
  },

  // Scene 5 - the 2027 implementation year.
  {
    scene: 'transition', beat: 'bandIn', line: 's5-l1', word: 'applies', lead: 0.5,
    note: 'the coral transition band on "this transition applies", once the rail has drawn',
  },
  {
    scene: 'transition', beat: 'aprilIn', line: 's5-l1', word: 'twenty', lead: 0.2,
    note: 'APRIL 2027 lights on "2027"',
  },

  // Scene 6 - leave balance.
  {
    scene: 'leave', beat: 'janFocus', line: 's6-l1', word: 'three-month', lead: 0.3,
    note: 'JANUARY comes forward on "a three-month balance"',
  },
  {
    scene: 'leave', beat: 'janCallout', line: 's6-l1', word: 'three-month', lead: 0.1,
    note: '3-MONTH LEAVE BALANCE on the words',
  },
  {
    scene: 'leave', beat: 'travel', line: 's6-l2', word: 'April', lead: 0.8,
    note: 'the light runs to APRIL 2027 just before it is named',
  },
  {
    scene: 'leave', beat: 'aprCallout', line: 's6-l2', word: 'April', lead: 0.1,
    note: 'NEW ANNUAL LEAVE BALANCE on "April 2027"',
  },
  {
    scene: 'leave', beat: 'basisIn', line: 's6-l2', word: 'updated', lead: 0.4,
    note: '"Based on the updated grades" on the words',
  },

  // Scene 7 - vacation allowance.
  {
    scene: 'allowance', beat: 'titleIn', line: 's7-l1', word: 'vacation', lead: 0.3,
    note: 'VACATION ALLOWANCE on "vacation"',
  },
  {
    scene: 'allowance', beat: 'bandFocus', line: 's7-l1', word: 'basic', lead: 0.3,
    note: 'the January-March band comes forward on "basic salary"',
  },
  {
    scene: 'allowance', beat: 'bandCallout', line: 's7-l1', word: 'basic', lead: 0.1,
    note: '"Current basic salary" on the words',
  },
  {
    scene: 'allowance', beat: 'travel', line: 's7-l1', word: 'April', lead: 0.8,
    note: 'the light runs to APRIL 2027 just before it is named',
  },
  {
    scene: 'allowance', beat: 'aprCallout', line: 's7-l1', word: 'April', lead: 0.1,
    note: '"New basic salary reflected" on "from April"',
  },

  // Scene 8 - merit, 15 months.
  {
    scene: 'merit', beat: 'labelIn', line: 's8-l1', word: 'merit', lead: 0.2,
    note: 'MERIT on "the merit"',
  },
  {
    scene: 'merit', beat: 'sweep3', line: 's8-l1', word: 'fifteen', lead: 0.1,
    note: 'the three extra months run as "15 months" is said',
  },
  {
    scene: 'merit', beat: 'fifteenIn', line: 's8-l1', word: 'fifteen', lead: -0.6,
    note: '15 MONTHS once the three extra months have landed',
  },
  {
    scene: 'merit', beat: 'noteIn', line: 's8-l1', word: 'percentage', lead: 0.0,
    note: 'the percentage note on "the percentage itself"',
  },

  // Scene 9 - HR contact.
  {
    scene: 'close', beat: 'contactIn', line: 's9-l1', word: 'contact', lead: 0.2,
    note: 'CONTACT HR PERSONNEL on "contact"',
  },
];
