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

export const videoTitle = 'Our Salary Cycle Is Changing';
