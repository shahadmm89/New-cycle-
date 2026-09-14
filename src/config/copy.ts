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
 * every time, in the narration and on screen: "KPIs" on its own says nothing.
 *
 * The narrator is given this spelling verbatim. "KPIs" is phonemised as the
 * three letters K-P-I with a plural /z/ - the natural American reading.
 * Do NOT respell it as "K P Is": that makes the engine read the last two
 * letters as the word "is", which is what the first cut of this film said.
 */
export const kpiTerm = 'Company Performance KPIs';

/**
 * The same term, spelled for the speech engine only - never shown.
 *
 * A bare "KPIs" is read as "K-P-is" - the last two letters become the word
 * "is". The apostrophe form is the one spelling that comes out as the three
 * letters plus a plural /z/.
 *
 * How that was checked: the letter I is the diphthong /ai/, whose nucleus is a
 * wide-open vowel; "is" has no open vowel in it at all. So scan the end of the
 * phrase for the highest F1 and see whether an open nucleus is there. Measured
 * against reference takes of "kay pee eyes" (882 Hz) and "kay pee is" (497 Hz):
 *
 *   written      peak F1   reading
 *   KPIs           518     the word "is"
 *   K.P.I.s        572     the word "is"
 *   KPI's          832     K-P-I-s          <- in use
 *
 * Do NOT measure this by taking the last voiced stretch of the clip: that lands
 * on the diphthong's offglide, which is close and front, and reports a correct
 * take as wrong.
 */
export const kpiTermSpoken = "Company Performance KPI's";

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
