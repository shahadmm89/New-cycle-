/**
 * WORDING & DATE CONFIGURATION
 * ----------------------------
 * Every date, month name and reusable phrase used anywhere in the video.
 * Change a value here and it updates the animation, the voice-over script
 * and the subtitle file together.
 *
 * See docs/EDITING-TEXT-AND-DATES.md
 */

export const cycle = {
  /**
   * THE CENTRAL IDEA OF THE VIDEO.
   * The salary cycle YEAR moves. It used to run January -> December.
   * From now on it runs April -> March.
   */
  oldCycleFrom: 'JAN',
  oldCycleTo: 'DEC',
  oldCycleFromLong: 'JANUARY',
  oldCycleToLong: 'DECEMBER',
  oldCycleLabel: 'JAN → DEC',
  oldCycleSpoken: 'January to December',

  newCycleFrom: 'APR',
  newCycleTo: 'MAR',
  newCycleFromLong: 'APRIL',
  newCycleToLong: 'MARCH',
  newCycleLabel: 'APR → MAR',
  newCycleSpoken: 'April to March',

  /** What happens in April: merit and promotion take effect. */
  meritEffectiveDate: 'APRIL 1',
  meritEffectiveSpoken: 'April first',

  /** What happens in March: the bonus is paid. */
  bonusPayrollLabel: 'MARCH PAYROLL',

  /** What does NOT change: the performance appraisal year. */
  performanceClose: 'DECEMBER',
  performanceWindowLabel: 'JAN → DEC',
} as const;

/** Month order of the OLD salary cycle: January first. */
export const monthsCalendar = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
] as const;

/** Month order of the NEW salary cycle: April first, March last. */
export const monthsSalaryYear = [
  'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP',
  'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR',
] as const;

/**
 * The key company KPIs the bonus is measured against. Named, not explained -
 * the narration mentions them once and the visual carries the rest.
 */
export const kpis = ['HSE', 'FINANCE', 'PERFORMANCE'] as const;

/**
 * THE AGREED TERM for what the bonus is measured against. Written out in full
 * every time, on screen and in the script: "KPIs" on its own says nothing.
 *
 * Spelled KPIs. No apostrophe, anywhere the viewer can see it - not on a slide,
 * not in a caption, not in output/voiceover-script.md.
 */
export const kpiTerm = 'Company Performance KPIs';

/**
 * HOW IT MUST SOUND: the three letters, K-P-I, with a plural /z/ on the end.
 * "Kay pee eyes", never "kay pee is", and never one word.
 */
export const kpiSaidAs = 'K-P-Is';

/**
 * WHAT THE ENGINE IS GIVEN to produce that sound. Never displayed: this string
 * exists only inside the `spoken` field of a voice line, and no viewer-facing
 * surface reads it.
 *
 * It needs to exist because speech engines get this wrong in a specific way. A
 * bare "KPIs" tends to come out as "K-P-is" - the last two letters collapse
 * into the word "is" - which is what the first cut of this film said.
 *
 * UNVERIFIED FOR THE CURRENT VOICE. Every measurement below was taken on
 * Alexander; the narrator is now Dan, and a spelling that works on one voice is
 * not evidence about another. The first take of s3-l4 has to be measured before
 * anything is rendered:
 *
 *   npm run check:pronunciation
 *
 * If it fails, change the string below to the next candidate and re-generate
 * THAT ONE LINE - about 54 credits, not another run of the whole script. Keep a
 * small reserve for exactly this.
 *
 *   candidate                      evidence
 *   Company Performance K-P-Is     in use. Matches the declared reading above
 *                                  literally, and has no apostrophe.
 *   Company Performance kay-pee-eyes
 *                                  the phonetic fallback. Crude, but the
 *                                  reference take of "kay pee eyes" measured
 *                                  882 Hz, unambiguously the letter I.
 *
 * Measured on Alexander, for reference - peak F1 at the end of the phrase, the
 * open /ai/ nucleus of the letter I against the close /I/ of the word "is":
 *
 *   written      peak F1   came out as
 *   KPIs           518     the word "is"        wrong
 *   K.P.I.s        572     the word "is"        wrong
 *   KPI's          832     K-P-I-s              right, but spells an apostrophe
 *
 * Do NOT measure this by taking the last voiced stretch of the clip: that lands
 * on the diphthong's offglide, which is close and front, and reports a correct
 * take as wrong. scripts/check-pronunciation.py does it the right way.
 */
export const kpiTermSpoken = 'Company Performance K-P-Is';

/**
 * The three anchors the film exists to plant, in the order they fall within the
 * new salary year: April starts it, December closes the appraisal, March ends
 * the cycle and pays the bonus.
 */
export const anchors = [
  {month: 'APRIL', what: 'Merit + Promotion', tone: 'new' as const},
  {month: 'DECEMBER', what: 'Performance Appraisal Closes', tone: 'steady' as const},
  {month: 'MARCH', what: 'Bonus', tone: 'new' as const},
];

/**
 * THE IMPLEMENTATION YEAR.
 *
 * Moving the start of the cycle from January to April means the changeover
 * period runs January through to March of the following year - fifteen months,
 * not twelve. Merit is therefore calculated across fifteen months in that one
 * year, so a 5% increase is worth 6.25% over the period.
 *
 * All five numbers below are derived from `meritExample` and `months`. If HR
 * wants a different worked example, change those two and the arithmetic on
 * screen stays correct.
 */
const IMPLEMENTATION_MONTHS = 15;
const MERIT_EXAMPLE_PCT = 5;

export const implementation = {
  label: 'IMPLEMENTATION YEAR ONLY',
  /** Said once, plainly, so nobody reads 6.25% as a new merit rate. */
  once: 'HAPPENS ONCE \u00B7 NOT EVERY YEAR',
  /** The three months past the normal twelve. */
  extraMonths: ['JAN', 'FEB', 'MAR'] as const,
  baseMonths: [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
  ] as const,
  twelve: '12 MONTHS',
  plusThree: '+ 3 MONTHS',
  /**
   * Numbered under the three ghosted tiles. Naming them 13, 14 and 15 is what
   * stops the extension reading as "next year's January" - they are the
   * thirteenth, fourteenth and fifteenth month of ONE calculation.
   */
  extraMonthNumbers: ['MONTH 13', 'MONTH 14', 'MONTH 15'] as const,
  /** Guards the example against being read as a promise. */
  illustrative: 'ILLUSTRATIVE EXAMPLE',
  unchanged: 'THE MERIT PERCENTAGE HAS NOT CHANGED \u2014 ONLY THE MONTHS IT COVERS',
  /** Jan of the changeover year through to Mar of the next. Fifteen tiles. */
  months: [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
    'JAN', 'FEB', 'MAR',
  ] as const,
  meritLabel: 'YOUR MERIT INCREASE',
  merit: `${MERIT_EXAMPLE_PCT}%`,
  dividedBy: '\u00F7 12',
  /** Four decimal places: the figure HR circulated, and it is what makes the
   *  x15 land exactly on 6.25 rather than nearly. */
  perMonth: `${(MERIT_EXAMPLE_PCT / 12).toFixed(4)}%`,
  perMonthLabel: 'PER MONTH',
  multipliedBy: `\u00D7 ${IMPLEMENTATION_MONTHS}`,
  equivalent: `${((MERIT_EXAMPLE_PCT / 12) * IMPLEMENTATION_MONTHS).toFixed(2)}%`,
  equivalentLabel: 'EQUIVALENT INCREASE',
  /**
   * Set under each side of the result row. The strike-through only makes sense
   * if both figures are labelled with the period they cover - otherwise it
   * reads as "your 5% became 6.25%", which is the one thing it must not say.
   */
  over12: `OVER 12 MONTHS`,
  over15: `OVER ${IMPLEMENTATION_MONTHS} MONTHS`,
  monthsChip: `${IMPLEMENTATION_MONTHS} MONTHS`,
  insteadOf: 'INSTEAD OF 12',
  note: 'ONE YEAR ONLY \u00B7 THE CHANGEOVER PERIOD',
} as const;

export const videoTitle = 'Our Salary Cycle Is Changing';
