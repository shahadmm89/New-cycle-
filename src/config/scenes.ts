/**
 * MASTER TIMELINE
 * ---------------
 * One file describes the whole film: how long every scene runs, what the
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
 * PACING: this is digital signage, not a presentation. Scenes overlap, visuals
 * start while the previous line is still finishing, and no scene ends on a
 * static hold. Every beat below was chosen so something is always moving.
 *
 * All times are SECONDS. Beat times are relative to the start of their scene.
 */
import {cycle, kpis, monthsCalendar, monthsSalaryYear} from './copy';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** A single spoken phrase. Short phrases are what create natural emphasis. */
export interface VoiceLine {
  id: string;
  /** Seconds from the start of the scene at which this phrase starts. */
  start: number;
  /** What the narrator says (also used for the written script). */
  text: string;
  /**
   * Optional override for the speech engine only - fixes acronyms and dates.
   * Never shown on screen.
   */
  spoken?: string;
  /**
   * Delivery speed for this phrase, relative to the narrator's base pace.
   * >1 is slower and heavier - use it to land the lines that matter.
   * <1 is brisker - use it on connective phrases so the film keeps moving.
   */
  rate?: number;
  /** Subtitle lines. Kept short and punchy so they read at a glance. */
  captions: string[];
}

export interface SceneConfig {
  id: string;
  title: string;
  duration: number;
  /** Named animation cues, in seconds from the start of this scene. */
  beats: Record<string, number>;
  voice: VoiceLine[];
  /** Free-form per-scene on-screen copy. */
  text?: Record<string, string | string[]>;
}

/**
 * How long one scene cross-fades into the next. Scenes overlap by this much,
 * so the next visual is already building while the previous line finishes.
 * It does not change the overall duration.
 */
export const TRANSITION = 0.55;

/** Fade to black at the very end. Short - the film should not linger. */
export const OUTRO_FADE = 0.6;

export const scenes: SceneConfig[] = [
  {
    id: 'hook',
    title: '1 - Did you know?',
    duration: 3.7,
    beats: {
      ringIn: 0,
      monthsSweep: 0.15,
      headlineIn: 0.4,
      highlightPhrase: 0.9,
      subIn: 2.0,
      pushIn: 2.4,
    },
    voice: [
      {
        id: 's1-l1',
        start: 0.3,
        text: 'Did you know our Salary Cycle is changing?',
        rate: 1.04,
        captions: ['Did you know our', 'SALARY CYCLE is changing?'],
      },
    ],
    text: {
      headlinePre: 'Did you know our',
      headlineKey: 'SALARY CYCLE',
      headlinePost: 'is changing?',
      sub: "Here's what it means for you",
    },
  },
  {
    id: 'old-cycle',
    title: '2 - The current cycle',
    duration: 4.5,
    beats: {
      label: 0.05,
      ringIn: 0.1,
      monthsFlow: 0.3,
      railIn: 0.6,
      endpointsIn: 1.2,
      bannerIn: 2.6,
      settle: 3.6,
    },
    voice: [
      {
        id: 's2-l1',
        start: 0.4,
        text: 'Until now, it has followed a January-to-December cycle.',
        spoken: 'Until now, it has followed a January to December cycle.',
        rate: 1.02,
        captions: ['Until now, it has followed', 'a JANUARY-to-DECEMBER cycle'],
      },
    ],
    text: {
      label: 'CURRENT SALARY CYCLE',
      from: cycle.oldCycleFromLong,
      to: cycle.oldCycleToLong,
      banner: '12 MONTHS  ·  ONE CYCLE',
    },
  },
  {
    id: 'today',
    title: '3 - How merit & bonus are set today',
    duration: 12.8,
    beats: {
      label: 0.05,
      meritCard: 0.2,
      meritChart: 0.7,
      meritForecast: 1.5,
      meritLabel: 2.2,
      bonusCard: 4.4,
      kpi1: 9.15,
      kpi2: 9.65,
      kpi3: 10.15,
      kpiCombine: 10.9,
    },
    voice: [
      {
        id: 's3-l1',
        start: 0.4,
        text: 'For merit, recommendations are based on projected market salary movement.',
        rate: 1.0,
        captions: ['MERIT', 'Projected market salary movement'],
      },
      {
        id: 's3-l2',
        start: 4.7,
        text: 'Bonus is based on estimated company performance across key KPIs -',
        spoken: 'Bonus is based on estimated company performance, across key K P Is,',
        rate: 1.0,
        captions: ['BONUS', 'Estimated company performance'],
      },
      {
        id: 's3-l3',
        start: 9.35,
        text: 'HSE, Finance, and Performance.',
        spoken: 'H-S-E, Finance, and Performance.',
        rate: 1.06,
        captions: ['HSE  ·  FINANCE  ·  PERFORMANCE'],
      },
    ],
    text: {
      label: 'HOW IT WORKS TODAY',
      meritTitle: 'MERIT',
      meritValue: 'Projected Market Movement',
      bonusTitle: 'BONUS',
      bonusValue: 'Estimated Company Performance',
      kpis: [...kpis],
      combined: 'COMPANY PERFORMANCE',
    },
  },
  {
    id: 'the-change',
    title: '4 - THE CHANGE (hero)',
    duration: 5.6,
    beats: {
      oldRingIn: 0,
      oldLabel: 0.1,
      railIn: 0.25,
      spinUp: 0.9,
      railScatter: 1.2,
      handover: 2.7,
      newRingIn: 2.9,
      railReorder: 2.9,
      newLabelIn: 3.05,
      bigReveal: 3.2,
      lockIn: 4.6,
    },
    voice: [
      {
        id: 's4-l1',
        start: 0.35,
        text: "Now, we're moving to a new cycle.",
        rate: 1.02,
        captions: ["Now, we're moving to a new cycle."],
      },
      {
        id: 's4-l2',
        start: 3.15,
        text: 'From April to March.',
        spoken: 'From April. To March.',
        rate: 1.18,
        captions: ['From APRIL to MARCH'],
      },
    ],
    text: {
      oldLabel: 'OLD SALARY CYCLE',
      newLabel: 'NEW SALARY CYCLE',
      oldRange: cycle.oldCycleLabel,
      newRange: cycle.newCycleLabel,
    },
  },
  {
    id: 'april',
    title: '5 - April',
    duration: 6.0,
    beats: {
      monthIn: 0,
      monthSettle: 0.4,
      meritIn: 1.3,
      promotionIn: 1.8,
      liftOff: 2.6,
      effectiveIn: 3.6,
      restate: 4.9,
    },
    voice: [
      {
        id: 's5-l1',
        start: 0.3,
        text: 'Under the new cycle, merit increases and promotions take effect on April 1.',
        spoken: 'Under the new cycle, merit increases and promotions take effect on April first.',
        rate: 1.02,
        captions: ['Merit increases and promotions', 'take effect on APRIL 1'],
      },
    ],
    text: {
      month: 'APRIL',
      merit: 'MERIT',
      promotion: 'PROMOTION',
      effective: 'EFFECTIVE APRIL 1',
      note: 'START OF THE NEW SALARY CYCLE',
    },
  },
  {
    id: 'march',
    title: '6 - March',
    duration: 3.6,
    beats: {
      railIn: 0,
      travel: 0.1,
      landMarch: 1.25,
      monthIn: 1.35,
      bonusIn: 1.95,
      payrollIn: 2.45,
      closesNote: 3.0,
    },
    voice: [
      {
        id: 's6-l1',
        start: 0.55,
        text: 'Bonus will be paid in the March payroll.',
        rate: 1.04,
        captions: ['BONUS', 'paid in the MARCH payroll'],
      },
    ],
    text: {
      month: 'MARCH',
      bonus: 'BONUS',
      payroll: 'MARCH PAYROLL',
      note: 'END OF THE NEW SALARY CYCLE',
    },
  },
  {
    id: 'no-change',
    title: '7 - What does NOT change',
    duration: 6.2,
    beats: {
      perfRowIn: 0.05,
      perfRailIn: 0.25,
      decLand: 1.0,
      tickIn: 1.6,
      salaryRowIn: 3.3,
      salaryRailIn: 3.55,
      newBadge: 4.3,
      contrast: 4.9,
    },
    voice: [
      {
        id: 's7-l1',
        start: 0.25,
        text: 'Your performance appraisal remains on the same schedule,',
        rate: 1.04,
        captions: ['Your PERFORMANCE APPRAISAL', 'remains on the same schedule'],
      },
      {
        id: 's7-l2',
        start: 3.35,
        text: 'and will continue to close in December.',
        rate: 1.04,
        captions: ['and will continue to close', 'in DECEMBER'],
      },
    ],
    text: {
      perfTitle: 'PERFORMANCE APPRAISAL',
      perfRange: cycle.performanceWindowLabel,
      perfBadge: 'NO CHANGE',
      salaryTitle: 'SALARY CYCLE',
      salaryRange: cycle.newCycleLabel,
      salaryBadge: 'NEW',
    },
  },
  {
    id: 'summary',
    title: '8 - The visual summary',
    duration: 4.6,
    beats: {
      labelIn: 0,
      rangeIn: 0.25,
      ruleIn: 0.75,
      anchor1: 1.05,
      anchor2: 1.6,
      anchor3: 2.15,
      settle: 2.8,
    },
    // No narration. This is the frame employees are meant to remember, and it
    // is stronger read in silence than talked over.
    voice: [],
    text: {
      label: 'NEW SALARY CYCLE',
      from: cycle.newCycleFromLong,
      to: cycle.newCycleToLong,
    },
  },
  {
    id: 'why',
    title: '9 - Why the change',
    duration: 9.3,
    beats: {
      chartIn: 0,
      dataIn: 0.3,
      alignIn: 1.4,
      line1: 0.8,
      line2: 4.4,
    },
    voice: [
      {
        id: 's9-l1',
        start: 0.35,
        text: 'This change brings our cycle closer to market best practices,',
        rate: 1.0,
        captions: ['Closer to market best practices'],
      },
      {
        id: 's9-l2',
        start: 4.45,
        text: 'and gives us more relevant information when making salary decisions.',
        rate: 1.0,
        captions: ['More relevant information', 'when making salary decisions'],
      },
    ],
    text: {
      line1: 'BETTER MARKET ALIGNMENT',
      line2: 'MORE RELEVANT INFORMATION',
    },
  },
  {
    id: 'close',
    title: '10 - Final message',
    duration: 4.4,
    beats: {
      questionsIn: 0.15,
      contactIn: 1.5,
      logoIn: 2.2,
    },
    voice: [
      {
        id: 's10-l1',
        start: 0.55,
        text: 'Have questions?',
        rate: 1.06,
        captions: ['Have questions?'],
      },
      {
        id: 's10-l2',
        start: 2.35,
        text: 'HR is ready to help.',
        spoken: 'H R is ready to help.',
        rate: 1.04,
        captions: ['HR is ready to help.'],
      },
    ],
    text: {
      questions: 'HAVE QUESTIONS?',
      sub: 'HR IS READY TO HELP',
    },
  },
];

/** Absolute start time of every scene, derived from the durations above. */
export const sceneStarts: number[] = scenes.reduce<number[]>((acc, _scene, i) => {
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

/** Every voice line in the film, with absolute start times. */
export interface FlatVoiceLine extends VoiceLine {
  sceneId: string;
  sceneTitle: string;
  absoluteStart: number;
  /** Room before the next phrase starts. */
  window: number;
}

export const flatVoiceLines = (): FlatVoiceLine[] => {
  const flat: FlatVoiceLine[] = [];
  scenes.forEach((scene, i) => {
    scene.voice.forEach((line) => {
      flat.push({
        ...line,
        sceneId: scene.id,
        sceneTitle: scene.title,
        absoluteStart: sceneStarts[i] + line.start,
        window: 0,
      });
    });
  });
  flat.sort((a, b) => a.absoluteStart - b.absoluteStart);
  flat.forEach((line, i) => {
    const next = flat[i + 1]?.absoluteStart ?? totalDuration;
    // Only a breath between phrases - this film should never feel like it is waiting.
    line.window = Math.max(0.4, next - line.absoluteStart - 0.1);
  });
  return flat;
};

export {monthsCalendar, monthsSalaryYear, cycle};
