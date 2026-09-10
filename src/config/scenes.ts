/**
 * MASTER TIMELINE
 * ---------------
 * One file describes the whole video: how long every scene runs, what the
 * narrator says and when, what appears on screen, and at which moment each
 * animation fires ("beats").
 *
 * Rules that keep this maintainable:
 *   - Scene START times are DERIVED from the durations above them. Change one
 *     duration and everything after it shifts automatically.
 *   - Components never contain frame numbers. They ask for a named beat.
 *   - Voice-over, captions and animation all read from this file, so they can
 *     never drift apart.
 *
 * All times in this file are SECONDS.
 * Beat times are relative to the start of their own scene.
 */
import {cycle, kpis, months} from './copy';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** A single spoken sentence. */
export interface VoiceLine {
  id: string;
  /** Seconds from the start of the scene at which this line starts. */
  start: number;
  /** What the narrator says (also used for the written script). */
  text: string;
  /**
   * Optional override for the text-to-speech engine only, used to fix the
   * pronunciation of acronyms and dates. Never shown on screen.
   */
  spoken?: string;
  /** Subtitle lines. Kept short so they read comfortably on any screen. */
  captions: string[];
}

export interface SceneConfig {
  id: string;
  /** Human-readable name, shown in the Remotion sidebar. */
  title: string;
  duration: number;
  /** Named animation cues, in seconds from the start of this scene. */
  beats: Record<string, number>;
  voice: VoiceLine[];
  /** Free-form per-scene on-screen copy. */
  text?: Record<string, string | string[]>;
}

/**
 * Cross-fade length between scenes, in seconds. Scenes overlap by this much so
 * transitions are smooth; it does not change the overall duration.
 */
export const TRANSITION = 0.5;

/**
 * Length of the fade to a clean frame at the very end of the film, in seconds.
 * It covers everything - scenes, logo and progress line - so the film does not
 * end with furniture still sitting on an empty stage.
 */
export const OUTRO_FADE = 0.85;

export const scenes: SceneConfig[] = [
  {
    id: 'opening',
    title: '1 - Opening',
    duration: 8,
    beats: {
      paperIn: 0,
      calendarDraw: 0.25,
      monthsIn: 0.9,
      employeeDraw: 0.5,
      thoughtBubble: 1.6,
      headline: 1.3,
      titleCard: 4.6,
      curiousLook: 2.6,
    },
    voice: [
      {
        id: 's1-l1',
        start: 1.25,
        text: 'Do you know how our salary cycle currently works?',
        captions: ['Do you know how our salary cycle', 'currently works?'],
      },
    ],
    text: {
      headline: 'Do you know how our salary cycle currently works?',
      kicker: "Let's walk through it - in 90 seconds.",
    },
  },
  {
    id: 'merit',
    title: '2 - Current merit process',
    duration: 11,
    beats: {
      label: 0.1,
      timelineDraw: 0.35,
      timelineTicks: 1.0,
      salaryIcon: 1.6,
      chartAxes: 2.4,
      chartActual: 2.9,
      forecastLine: 3.9,
      projectedTag: 4.6,
      compareIn: 6.1,
      chainIn: 7.3,
      chainStep2: 8.0,
      chainStep3: 8.7,
    },
    voice: [
      {
        id: 's2-l1',
        start: 0.4,
        text: 'Today, merit recommendations are based on projected market salary movement.',
        captions: ['Today, merit recommendations are based on', 'projected market salary movement.'],
      },
      {
        id: 's2-l2',
        start: 5.6,
        text: 'That means we use estimated market movement, rather than the actual movement in market salaries.',
        captions: [
          'That means we use estimated market movement,',
          'rather than the actual movement in market salaries.',
        ],
      },
    ],
    text: {
      label: 'TODAY - HOW MERIT IS DECIDED',
      timelineFrom: 'JANUARY',
      timelineTo: 'DECEMBER',
      chartYAxis: 'Market salary level',
      chartXAxis: 'Time',
      projected: 'PROJECTED',
      chain: ['FORECAST', 'ESTIMATED MARKET MOVEMENT', 'MERIT'],
      estimated: 'Estimated movement',
      actual: 'Actual movement',
    },
  },
  {
    id: 'bonus',
    title: '3 - Current bonus process',
    duration: 8,
    beats: {
      label: 0.1,
      boardDraw: 0.3,
      kpi1: 0.9,
      kpi2: 1.25,
      kpi3: 1.6,
      kpi4: 1.95,
      estimateTag: 3.1,
      chainIn: 4.3,
      chainStep2: 5.0,
      currentStateNote: 6.2,
    },
    voice: [
      {
        id: 's3-l1',
        start: 0.5,
        text: 'And our bonus is based on estimated company performance against KPIs.',
        spoken: 'And our bonus is based on estimated company performance against K P Is.',
        captions: ['And our bonus is based on estimated', 'company performance against KPIs.'],
      },
    ],
    text: {
      label: 'TODAY - HOW BONUS IS DECIDED',
      boardTitle: 'Company KPI dashboard',
      kpis: [...kpis],
      estimate: 'ESTIMATE',
      chain: ['BONUS', 'ESTIMATED COMPANY PERFORMANCE'],
      note: 'This is simply how the cycle works today.',
    },
  },
  {
    id: 'why-change',
    title: '4 - Why are we changing?',
    duration: 9,
    beats: {
      slideOut: 0.15,
      question: 0.7,
      glassIn: 1.6,
      glassSweep: 2.1,
      morphOut: 3.9,
      morphIn: 4.5,
      resultsIn: 5.8,
      answer: 6.7,
    },
    voice: [
      {
        id: 's4-l1',
        start: 0.6,
        text: 'To better align with market best practices, we are shifting the timing of our salary cycle.',
        captions: [
          'To better align with market best practices,',
          'we are shifting the timing of our salary cycle.',
        ],
      },
    ],
    text: {
      question: "So, what's changing?",
      answer: 'A more timely and market-aligned cycle.',
      before: 'PROJECTED DATA',
      after: ['MORE RELEVANT', 'MARKET DATA'],
      results: 'Company KPI results available',
    },
  },
  {
    id: 'new-cycle',
    title: '5 - The new timing',
    duration: 17,
    beats: {
      label: 0.15,
      railDraw: 0.5,
      monthsIn: 1.2,
      shiftNote: 2.6,
      marchHighlight: 5.7,
      bonusCard: 6.4,
      bonusArrow: 7.2,
      bonusPayroll: 7.7,
      aprilHighlight: 10.3,
      meritCard: 10.9,
      meritArrow: 11.7,
      meritEffective: 12.2,
      payrollArrow: 13.3,
      payrollCard: 13.8,
    },
    voice: [
      {
        id: 's5-l1',
        start: 0.4,
        text: `Going forward, our cycle will shift from the ${cycle.oldCycleWindow} timing to ${cycle.newCycleWindow}.`,
        spoken: 'Going forward, our cycle will shift from the January to December timing, to March and April.',
        captions: ['Going forward, our cycle will shift', `from the ${cycle.oldCycleWindow} timing to ${cycle.newCycleWindow}.`],
      },
      {
        id: 's5-l2',
        start: 5.8,
        text: `This means your bonus will be paid in the ${cycle.bonusMonth} payroll.`,
        captions: [`This means your bonus will be paid`, `in the ${cycle.bonusMonth} payroll.`],
      },
      {
        id: 's5-l3',
        start: 10.1,
        text: `And any new merit increase will be effective ${cycle.meritEffectiveDate}, and reflected in the ${cycle.meritPayroll} payroll.`,
        spoken:
          'And any new merit increase will be effective April first, and reflected in the April payroll.',
        captions: [
          `And any new merit increase will be effective ${cycle.meritEffectiveDate},`,
          `and reflected in the ${cycle.meritPayroll} payroll.`,
        ],
      },
    ],
    text: {
      label: 'THE NEW TIMING',
      // Says *which* timing shifts, so this line can never be read as the
      // performance appraisal cycle moving.
      shiftNote: `Bonus & merit timing:   ${cycle.oldCycleWindow}  \u2192  ${cycle.newCycleWindow}`,
      bonus: 'BONUS',
      bonusTarget: cycle.bonusPayrollLabel,
      merit: 'MERIT',
      meritTarget: cycle.meritEffectiveLabel,
      salaryTarget: cycle.meritPayrollLabel,
    },
  },
  {
    id: 'no-change',
    title: '6 - What does NOT change',
    duration: 13,
    beats: {
      wipe: 0,
      label: 0.5,
      calendarIn: 1.1,
      decHighlight: 2.0,
      chain1: 3.0,
      chain2: 3.8,
      chain3: 4.6,
      stampIn: 5.2,
      checkDraw: 5.7,
      reassure: 8.6,
    },
    voice: [
      {
        id: 's6-l1',
        start: 0.6,
        text: 'But here is the important part: your performance appraisal cycle does not change.',
        captions: ['But here is the important part:', 'your performance appraisal cycle does not change.'],
      },
      {
        id: 's6-l2',
        start: 5.9,
        text: `Performance appraisal will continue as usual, and the cycle will still close in ${cycle.performanceClose}.`,
        captions: [
          'Performance appraisal will continue as usual,',
          `and the cycle will still close in ${cycle.performanceClose}.`,
        ],
      },
    ],
    text: {
      label: 'WHAT DOES NOT CHANGE?',
      chain: ['PERFORMANCE APPRAISAL', cycle.performanceClose.toUpperCase(), 'CYCLE CLOSES'],
      stamp: 'NO CHANGE',
      stampSub: 'PERFORMANCE APPRAISAL',
      reassure: 'Same process. Same timing.',
    },
  },
  {
    id: 'comparison',
    title: '7 - Before vs now',
    duration: 10,
    beats: {
      label: 0.1,
      leftPanel: 0.4,
      leftRow1: 0.9,
      leftRow2: 1.5,
      leftRow3: 2.1,
      divider: 2.9,
      rightPanel: 3.3,
      rightRow1: 3.8,
      rightRow2: 4.5,
      rightRow3: 5.2,
      lift: 6.0,
      banner1: 6.3,
      banner2: 6.9,
    },
    voice: [
      {
        id: 's7-l1',
        start: 0.5,
        text: 'So, your performance cycle stays the same.',
        captions: ['So, your performance cycle stays the same.'],
      },
      {
        id: 's7-l2',
        start: 3.6,
        text: 'What changes is the timing of the bonus and the merit increase.',
        captions: ['What changes is the timing', 'of the bonus and the merit increase.'],
      },
    ],
    text: {
      label: 'BEFORE  vs  NOW',
      leftTitle: 'BEFORE',
      rightTitle: 'NOW',
      banner1: 'SAME PERFORMANCE CYCLE.',
      banner2: 'NEW TIMING.',
    },
  },
  {
    id: 'benefits',
    title: '8 - Why this helps',
    duration: 9,
    beats: {
      label: 0.1,
      row1From: 0.5,
      row1Arrow: 1.4,
      row1To: 1.9,
      row2From: 3.4,
      row2Arrow: 4.2,
      row2To: 4.7,
      alignIcon: 5.2,
      takeaway1: 5.7,
      takeaway2: 6.3,
    },
    voice: [
      {
        id: 's8-l1',
        start: 0.4,
        text: 'This shift lets us make salary decisions using more relevant market information,',
        captions: ['This shift lets us make salary decisions', 'using more relevant market information,'],
      },
      {
        id: 's8-l2',
        start: 5.1,
        text: 'and align our cycle more closely with market best practices.',
        captions: ['and align our cycle more closely', 'with market best practices.'],
      },
    ],
    text: {
      label: 'WHY THIS HELPS',
      row1From: ['PROJECTED', 'MARKET DATA'],
      row1To: ['MORE RELEVANT', 'MARKET INFORMATION'],
      row2From: ['ESTIMATED COMPANY', 'PERFORMANCE'],
      row2To: ['ACTUAL / MORE', 'RELEVANT RESULTS'],
      takeaway1: 'More relevant data.',
      takeaway2: 'Better market alignment.',
    },
  },
  {
    id: 'closing',
    title: '9 - HR closing',
    duration: 5,
    beats: {
      peopleIn: 0.1,
      bubbles: 0.5,
      hrIn: 1.1,
      hrBubble: 1.6,
      headline: 2.1,
      contact: 2.7,
    },
    voice: [
      {
        id: 's9-l1',
        start: 0.35,
        text: 'Have questions? HR will be ready to answer them.',
        spoken: 'Have questions? H R will be ready to answer them.',
        captions: ['Have questions?', 'HR will be ready to answer them.'],
      },
    ],
    text: {
      hrBubble: "We're here to help.",
      headline: 'Have questions?',
      sub: 'HR is ready to help.',
    },
  },
];

/** Absolute start time of every scene, derived from the durations above. */
export const sceneStarts: number[] = scenes.reduce<number[]>((acc, scene, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + scenes[i - 1].duration);
  return acc;
}, []);

export const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
export const totalFrames = Math.round(totalDuration * FPS);

export const sceneStart = (id: string): number => {
  const i = scenes.findIndex((s) => s.id === id);
  if (i < 0) throw new Error(`Unknown scene "${id}"`);
  return sceneStarts[i];
};

/** Every voice line in the video, with absolute start times. */
export interface FlatVoiceLine extends VoiceLine {
  sceneId: string;
  absoluteStart: number;
  /** How much room the line has before the next line (or the end of the video). */
  window: number;
}

export const flatVoiceLines = (): FlatVoiceLine[] => {
  const flat: FlatVoiceLine[] = [];
  scenes.forEach((scene, i) => {
    scene.voice.forEach((line) => {
      flat.push({...line, sceneId: scene.id, absoluteStart: sceneStarts[i] + line.start, window: 0});
    });
  });
  flat.sort((a, b) => a.absoluteStart - b.absoluteStart);
  flat.forEach((line, i) => {
    const next = flat[i + 1]?.absoluteStart ?? totalDuration;
    // Leave a small breath between lines.
    line.window = Math.max(0.5, next - line.absoluteStart - 0.18);
  });
  return flat;
};

export {months, cycle};
