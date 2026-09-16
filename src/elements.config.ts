/**
 * The element compositions, and how big and how long each one is.
 *
 * Kept as data rather than JSX so the exporter can walk the same list the
 * registry builds from - one place to add an element, and it appears in both
 * Remotion Studio and the asset package.
 */
export interface ElementSpec {
  /** Composition id, and the filename it exports as. */
  id: string;
  /** What it is, for the asset package's README. */
  title: string;
  width: number;
  height: number;
  /** Seconds. */
  duration: number;
}

export const elementSpecs: ElementSpec[] = [
  {id: 'el-timeline-old',      title: 'Bottom timeline, JAN to DEC, with the November and December markers', width: 1920, height: 420, duration: 5.5},
  {id: 'el-timeline-morph',    title: 'Bottom timeline re-aligning from JAN-DEC into APR-MAR',              width: 1920, height: 300, duration: 3.5},
  {id: 'el-timeline-new',      title: 'Bottom timeline, APR to MAR, with all four new-cycle markers',       width: 1920, height: 420, duration: 6.0},
  {id: 'el-monthrail-old',     title: 'Month rail, JAN to DEC, with the playhead walking the year',         width: 1700, height: 320, duration: 4.0},
  {id: 'el-monthrail-new',     title: 'Month rail, APR to MAR, landing on March',                           width: 1700, height: 320, duration: 4.0},
  {id: 'el-rail-reorder',      title: 'Month rail physically re-ordering into the new cycle',               width: 1920, height: 320, duration: 4.0},
  {id: 'el-yearring-spin',     title: 'Year ring spinning from January to April - the hero mechanism',      width: 1000, height: 1000, duration: 5.5},
  {id: 'el-yearring-static',   title: 'Year ring, twelve months, arc sweeping once',                        width: 1000, height: 1000, duration: 3.5},
  {id: 'el-range-old',         title: 'Range plate, JAN to DEC (quiet treatment)',                          width: 1200, height: 340, duration: 2.0},
  {id: 'el-range-new',         title: 'Range plate, APR to MAR (accent treatment)',                         width: 1200, height: 360, duration: 2.0},
  {id: 'el-icon-merit',        title: 'Merit icon',                                                         width: 520, height: 520, duration: 1.8},
  {id: 'el-icon-promotion',    title: 'Promotion icon',                                                     width: 520, height: 520, duration: 1.8},
  {id: 'el-icon-bonus',        title: 'Bonus icon',                                                         width: 520, height: 520, duration: 1.8},
  {id: 'el-icon-performance',  title: 'Performance icon',                                                   width: 520, height: 520, duration: 1.8},
  {id: 'el-icon-tick',         title: 'Affirmation tick',                                                   width: 420, height: 420, duration: 1.8},
  {id: 'el-icons-kpi',         title: 'The three KPI glyphs: HSE, Finance, Performance',                    width: 1400, height: 400, duration: 2.6},
  {id: 'el-forecast-chart',    title: 'Forecast line resolving from a projection into a measurement',       width: 1300, height: 700, duration: 5.0},
  {id: 'el-fifteen-months',    title: '12 solid month tiles plus the 3 that only exist in the changeover',  width: 1800, height: 300, duration: 3.5},
  {id: 'el-five-to-625',       title: '5% struck through, resolving into 6.25%, both periods labelled',     width: 1400, height: 400, duration: 2.6},
  {id: 'el-timing-compare',    title: 'TODAY / NOV DEC / ESTIMATED against NEW CYCLE / JAN FEB / ACTUAL',   width: 1200, height: 320, duration: 2.4},
];
