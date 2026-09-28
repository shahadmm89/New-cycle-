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
  // Scene 1 - the purpose, as it is said.
  {
    scene: 'hook', beat: 'highlightPhrase', line: 's1-l1', word: 'salary', lead: 0.15,
    note: 'SALARY CYCLE lights up on "salary cycle"',
  },
  {
    scene: 'hook', beat: 'postIn', line: 's1-l2', word: 'align', lead: 0.3,
    note: '"to align with best practice" appears as it is said',
  },
  {
    scene: 'hook', beat: 'subIn', line: 's1-l2', word: 'timely', lead: 0.3,
    note: 'the timing / relevance line lands on "timely and relevant"',
  },

  // Scene 2 - timing only, benefits unchanged. The key message of the film.
  {
    scene: 'timing-only', beat: 'changeBadge', line: 's2-l1', word: 'changes', lead: 0.2,
    note: 'CHANGES chip on "the timing changes"',
  },
  {
    scene: 'timing-only', beat: 'changeDetail', line: 's2-l1', word: 'when', lead: 0.3,
    note: '"when benefits are received" on "when"',
  },
  {
    scene: 'timing-only', beat: 'benefitsIn', line: 's2-l2', word: 'benefits', lead: 0.2,
    note: 'BONUS / MERIT / PROMOTION chips on "your benefits"',
  },
  {
    scene: 'timing-only', beat: 'keepDetailIn', line: 's2-l2', word: 'Total', lead: 0.2,
    note: 'Total Reward Package on the words',
  },
  {
    scene: 'timing-only', beat: 'keepBadge', line: 's2-l2', word: 'stay', lead: 0.2,
    note: 'NO CHANGE tick on "stay exactly the same"',
  },

  // Scene 3 - the current cycle.
  {
    scene: 'old-cycle', beat: 'bannerIn', line: 's3-l2', word: 'One', lead: 0.2,
    note: 'ONE CYCLE banner on "One cycle"',
  },

  // Scene 4 - today. The two timeline pins are the ones this part is judged on.
  {
    scene: 'today', beat: 'timelineNov', line: 's4-l1', word: 'November', lead: 0.2,
    note: 'NOVEMBER marker - merit & salary movement, year-end estimate',
  },
  {
    scene: 'today', beat: 'meritCard', line: 's4-l2', word: 'Merit', lead: 0.2,
    note: 'MERIT & SALARY MOVEMENT card on "Merit"',
  },
  {
    scene: 'today', beat: 'meritChart', line: 's4-l2', word: 'based', lead: 0.1,
    note: 'forecast line draws on "based on"',
  },
  {
    scene: 'today', beat: 'meritForecast', line: 's4-l2', word: 'expected', lead: 0.2,
    note: 'the projected part of the line on "expected"',
  },
  {
    scene: 'today', beat: 'meritLabel', line: 's4-l2', word: 'inflation', lead: 0.2,
    note: 'the card caption on "inflation"',
  },
  {
    scene: 'today', beat: 'timelineDec', line: 's4-l4', word: 'December', lead: 0.2,
    note: 'DECEMBER marker - finalization / decisions',
  },
  {
    scene: 'today', beat: 'kpiCombine', line: 's4-l4', word: 'finalized', lead: 0.2,
    note: 'the three KPIs roll up into one as decisions are finalized',
  },
  {
    scene: 'today', beat: 'settle', line: 's4-l4', word: 'January', lead: 0.6,
    note: 'both cards settle as "reflected in January" is said',
  },

  // Scene 6 - the new cycle: January lands on its own, then February.
  {
    scene: 'actual-data', beat: 'timelineFeb', line: 's6-l1', word: 'February', lead: 0.2,
    note: 'FEBRUARY marker - actual inflation & market movement, actual company performance',
  },
  {
    scene: 'actual-data', beat: 'line1', line: 's6-l1', word: 'actual', lead: 0.2,
    note: 'the first ACTUAL claim on "actual results"',
  },
  {
    scene: 'actual-data', beat: 'line2', line: 's6-l1', word: 'results', lead: 0.1,
    note: 'the second ACTUAL claim',
  },
  {
    scene: 'actual-data', beat: 'alignIn', line: 's6-l1', word: 'not', lead: 0.3,
    note: 'the forecast resolves into a measurement on "not estimates"',
  },
  {
    scene: 'actual-data', beat: 'compareIn', line: 's6-l1', word: 'estimates', lead: 0.2,
    note: 'NOV ESTIMATED vs FEB ACTUAL strip',
  },

  // Scenes 7 and 8 - the months the new cycle pays out on.
  {
    scene: 'march', beat: 'timelineMar', line: 's7-l1', word: 'March', lead: 0.2,
    note: 'MARCH marker - YIB & bonus paid',
  },
  {
    scene: 'march', beat: 'monthIn', line: 's7-l1', word: 'March', lead: 0.2,
    note: 'MARCH lands on the word',
  },
  {
    scene: 'march', beat: 'payrollIn', line: 's7-l1', word: 'paid', lead: 0.2,
    note: 'the payroll chip on "paid"',
  },
  {
    scene: 'april', beat: 'timelineApr', line: 's8-l1', word: 'April', lead: 0.2,
    note: 'APRIL marker - merit & promotion adjustments reflected',
  },
  {
    scene: 'april', beat: 'monthIn', line: 's8-l1', word: 'April', lead: 0.2,
    note: 'APRIL lands on the word',
  },
  {
    scene: 'april', beat: 'meritIn', line: 's8-l1', word: 'merit', lead: 0.2,
    note: 'MERIT pillar on "merit increases"',
  },
  {
    scene: 'april', beat: 'promotionIn', line: 's8-l1', word: 'promotion', lead: 0.2,
    note: 'PROMOTION pillar on "promotion adjustments"',
  },

  // Scene 9 - the 2026 implementation year. The working itself is silent.
  {
    scene: 'example', beat: 'railIn', line: 's9-l1', word: 'twenty', lead: 0.1,
    note: 'the twelve months count in on "2026"',
  },
  {
    scene: 'example', beat: 'extraIn', line: 's9-l1', word: 'implementation', lead: 0.1,
    note: 'the three extra months on "implementation year"',
  },
  {
    scene: 'example', beat: 'settle', line: 's9-l2', word: 'change', lead: 0.2,
    note: '"the percentage has not changed" note lands on the word itself',
  },

  // Scene 10 - leave balance. The figures are read off the card, not said.
  {
    scene: 'leave', beat: 'aprCard', line: 's10-l2', word: 'April', lead: 0.2,
    note: 'APRIL 2027 card on "From April"',
  },
  {
    scene: 'leave', beat: 'basisIn', line: 's10-l2', word: 'annual', lead: 0.2,
    note: '"based on April grade code" on "new annual balance"',
  },

  // Scene 11 - HR contact.
  {
    scene: 'close', beat: 'contactIn', line: 's11-l1', word: 'contact', lead: 0.2,
    note: 'CONTACT HR PERSONNEL on "contact"',
  },
];
