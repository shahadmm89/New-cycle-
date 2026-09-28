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
 * not evidence about another. The first take of any line ending on the term
 * has to be measured before anything is rendered (the current script only
 * shows the term on screen, so there is nothing to measure right now):
 *
 *   npm run check:pronunciation
 *
 * If it fails, change the string below to the next candidate and re-generate
 * THAT ONE LINE - about 54 credits, not another run of the whole script. Keep a
 * small reserve for exactly this.
 *
 * THE SPELLING IS PER-ENGINE. What fixes this on one model breaks it on
 * another, so the alias belongs to whichever voice is configured and has to be
 * re-measured whenever that changes.
 *
 *   spelling     Kokoro am_michael   ElevenLabs Alexander
 *   KPIs              437 Hz  right         518 Hz  wrong
 *   K.P.I.s             -                   572 Hz  wrong
 *   KPI's               -                   832 Hz  right, but spells an
 *                                                   apostrophe, which the
 *                                                   brief forbids
 *   K-P-Is            437 Hz  WRONG           -
 *
 * Kokoro reads the plain form as the three letters and the hyphenated form as
 * the word "is" - the exact opposite of ElevenLabs, which is why the alias was
 * hyphenated until the engine changed. Both numbers above are peak F1 at the
 * end of the phrase: the open /ai/ nucleus of the letter I sits near 800 Hz,
 * the close /I/ of "is" near 450.
 *
 * Fallback if a future voice fails the plain form and an apostrophe is still
 * unacceptable: "Company Performance kay-pee-eyes". Crude, but the reference
 * take of "kay pee eyes" measured 882 Hz, unambiguously the letter I.
 *
 * Do NOT measure this by taking the last voiced stretch of the clip: that lands
 * on the diphthong's offglide, which is close and front, and reports a correct
 * take as wrong. And do not trust an F1 above about 1100 Hz - that is F2
 * mistaken for F1, and it once turned this exact failure into a pass.
 * scripts/check-pronunciation.py does both properly.
 */
export const kpiTermSpoken = 'Company Performance KPIs';

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
  label: '2027 IMPLEMENTATION YEAR ONLY',
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
  unchanged: 'THE PERCENTAGE ITSELF DOES NOT CHANGE \u2014 ONLY THE MONTHS IT COVERS',
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

/**
 * LEAVE BALANCE IN THE TRANSITION.
 *
 * The same changeover applies to annual leave: January 2027 credits only the
 * first three months (Jan-Mar), and April 2027 starts the new annual balance.
 * The two worked figures are derived below so the arithmetic on screen always
 * agrees with itself - change the annual entitlements, not the results.
 */
const LEAVE_MONTHS = 3;
const leaveRow = (grade: string, annual: number) => ({
  grade,
  working: `${annual} \u00F7 12 \u00D7 ${LEAVE_MONTHS}`,
  result: `\u2248 ${Math.round((annual / 12) * LEAVE_MONTHS)} DAYS`,
});

export const leave = {
  label: 'LEAVE BALANCE',
  janWhen: 'JANUARY 2027',
  janWhat: 'FIRST 3 MONTHS ONLY',
  rows: [leaveRow('GRADE 9 & BELOW', 22), leaveRow('GRADE 10 & ABOVE', 30)],
  aprWhen: 'APRIL 2027',
  aprWhat: 'NEW ANNUAL LEAVE BALANCE',
  aprBasis: 'BASED ON THE UPDATED GRADES',
} as const;

export const videoTitle = 'Our Salary Cycle Is Changing';
