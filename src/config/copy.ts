/**
 * WORDING & DATE CONFIGURATION
 * ----------------------------
 * Every date, month name and reusable phrase used anywhere in the video.
 * Change a value here and it updates the animation, the voice-over script
 * and the subtitle file together. Nothing is hard-coded in the scenes.
 *
 * See docs/EDITING-TEXT-AND-DATES.md
 */

export const cycle = {
  /** Month in which the performance appraisal cycle closes (unchanged). */
  performanceClose: 'December',
  performanceCloseShort: 'DEC',

  /** Payroll month in which the bonus is paid under the new cycle. */
  bonusMonth: 'March',
  bonusMonthShort: 'MAR',
  bonusPayrollLabel: 'MARCH PAYROLL',

  /** Date on which new merit increases become effective. */
  meritEffectiveDate: 'April 1',
  meritEffectiveLabel: 'EFFECTIVE APRIL 1',

  /** Payroll month in which the new salary first appears. */
  meritPayroll: 'April',
  meritPayrollShort: 'APR',
  meritPayrollLabel: 'APRIL PAYROLL',

  /** How the old and new cycle windows are described. */
  oldCycleWindow: 'January–December',
  newCycleWindow: 'March–April',
} as const;

export const months = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
] as const;

export const kpis = [
  'Sales',
  'Production',
  'Financial',
  'Business Performance',
] as const;

/** The three points the video must leave behind. */
export const keyPoints = [
  { label: 'BONUS', arrow: '→', value: cycle.bonusPayrollLabel },
  { label: 'MERIT', arrow: '→', value: cycle.meritEffectiveLabel },
  { label: 'NEW SALARY', arrow: '→', value: cycle.meritPayrollLabel },
] as const;

export const videoTitle = 'Our New Salary & Bonus Cycle';
