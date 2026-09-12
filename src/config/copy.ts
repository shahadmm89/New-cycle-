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
  label: 'IMPLEMENTATION YEAR',
  /** Jan of the changeover year through to Mar of the next. Fifteen tiles. */
  months: [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
    'JAN', 'FEB', 'MAR',
  ] as const,
  meritLabel: 'YOUR MERIT INCREASE',
  merit: `${MERIT_EXAMPLE_PCT}%`,
  dividedBy: '\u00F7 12',
  perMonth: `${(MERIT_EXAMPLE_PCT / 12).toFixed(3)}%`,
  perMonthLabel: 'PER MONTH',
  multipliedBy: `\u00D7 ${IMPLEMENTATION_MONTHS}`,
  equivalent: `${((MERIT_EXAMPLE_PCT / 12) * IMPLEMENTATION_MONTHS).toFixed(2)}%`,
  equivalentLabel: 'EQUIVALENT INCREASE',
  monthsChip: `${IMPLEMENTATION_MONTHS} MONTHS`,
  insteadOf: 'INSTEAD OF 12',
  note: 'ONE YEAR ONLY \u00B7 THE CHANGEOVER PERIOD',
} as const;

export const videoTitle = 'Our Salary Cycle Is Changing';
