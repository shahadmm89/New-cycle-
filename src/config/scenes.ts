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
import {cycle, implementation, kpis, monthsCalendar, monthsSalaryYear} from './copy';

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
    duration: 6.78,
    beats: {
      ringIn: 0,
      monthsSweep: 0.1,
      headlineIn: 0.3,
      highlightPhrase: 1.3,
      subIn: 3.9,
      pushIn: 2.2,
    },
    voice: [
      {
        id: 's1-l1',
        start: 0.3,
        text: 'Did you know our salary cycle is changing?',
        rate: 1.02,
        captions: ['Did you know our', 'SALARY CYCLE is changing?'],
      },
      {
        id: 's1-l2',
        start: 3.94,
        text: "Here's what it means for you.",
        rate: 1.04,
        captions: ["Here's what it means for you."],
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
    duration: 8.06,
    beats: {
      label: 0.05,
      ringIn: 0.15,
      railIn: 0.7,
      // The sweep runs while he names the two endpoints, and the range plate
      // lands on the words "January to December".
      monthsFlow: 1.95,
      endpointsIn: 2.1,
      bannerIn: 5.0,
      settle: 5.6,
    },
    voice: [
      {
        id: 's2-l1',
        start: 0.28,
        text: "Up to now, it's followed a January to December cycle.",
        rate: 1.02,
        captions: ['Up to now, it has followed', 'a JANUARY-to-DECEMBER cycle'],
      },
      {
        id: 's2-l2',
        start: 4.85,
        text: '12 months, one cycle.',
        spoken: 'Twelve months, one cycle.',
        rate: 1.08,
        captions: ['12 months, one cycle.'],
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
    duration: 15.5,
    beats: {
      label: 0.05,
      meritCard: 0.3,
      meritChart: 1.1,
      meritForecast: 3.35,
      meritLabel: 3.9,
      bonusCard: 5.6,
      // One KPI per name, as he says it.
      kpi1: 11.25,
      kpi2: 12.6,
      kpi3: 13.85,
      kpiCombine: 14.5,
    },
    voice: [
      {
        id: 's3-l1',
        start: 0.32,
        text: 'Merit recommendations have been based on projected market salary movement.',
        rate: 1.0,
        captions: ['MERIT', 'Projected market salary movement'],
      },
      {
        id: 's3-l2',
        start: 5.59,
        text: 'And bonus, on estimated company performance across our key KPIs -',
        spoken: 'And bonus, on estimated company performance across our key K P Is,',
        rate: 1.0,
        captions: ['BONUS', 'Estimated company performance'],
      },
      {
        id: 's3-l3',
        start: 11.17,
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
    duration: 7.09,
    beats: {
      oldRingIn: 0,
      oldLabel: 0.1,
      railIn: 0.3,
      // The dial starts turning on "we're moving", and lands on APRIL exactly
      // as he says the word.
      spinUp: 1.3,
      railScatter: 1.7,
      handover: 3.7,
      newRingIn: 3.9,
      railReorder: 3.9,
      newLabelIn: 4.0,
      bigReveal: 4.15,
      lockIn: 5.1,
    },
    voice: [
      {
        id: 's4-l1',
        start: 0.28,
        text: "Now, we're moving to a new cycle.",
        rate: 1.04,
        captions: ["Now, we're moving to a new cycle."],
      },
      {
        id: 's4-l2',
        start: 3.63,
        text: 'From April to March.',
        spoken: 'From April, to March.',
        rate: 1.12,
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
    duration: 9.01,
    beats: {
      monthIn: 0.15,
      meritIn: 0.4,
      promotionIn: 2.05,
      liftOff: 3.0,
      // The date chip lands on "April first".
      effectiveIn: 4.45,
      monthSettle: 5.95,
      restate: 6.1,
    },
    voice: [
      {
        id: 's5-l1',
        start: 0.28,
        text: 'Merit increases and promotions will take effect on April 1.',
        spoken: 'Merit increases and promotions will take effect on April first.',
        rate: 1.04,
        captions: ['Merit increases and promotions', 'take effect on APRIL 1'],
      },
      {
        id: 's5-l2',
        start: 5.86,
        text: "That's where the cycle now begins.",
        rate: 1.02,
        captions: ["That's where the cycle now begins."],
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
    duration: 8.13,
    beats: {
      railIn: 0,
      // The playhead reaches MARCH on the words "March payroll".
      travel: 0.8,
      bonusIn: 0.95,
      landMarch: 3.0,
      monthIn: 3.05,
      payrollIn: 3.45,
      noteIn: 4.6,
      closesNote: 4.7,
    },
    voice: [
      {
        id: 's6-l1',
        start: 0.45,
        text: 'And your bonus will be paid in the March payroll.',
        rate: 1.04,
        captions: ['BONUS', 'paid in the MARCH payroll'],
      },
      {
        id: 's6-l2',
        start: 4.55,
        text: 'March is the last month of the cycle.',
        rate: 1.02,
        captions: ['MARCH is the last month', 'of the cycle'],
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
    duration: 11.44,
    beats: {
      // Nothing appears until he says "your performance appraisal".
      perfRowIn: 3.6,
      perfRailIn: 3.9,
      tickIn: 5.4,
      // The salary row arrives last, as the comparison.
      salaryRowIn: 8.6,
      salaryRailIn: 8.9,
      contrast: 9.3,
      newBadge: 9.8,
    },
    voice: [
      {
        id: 's7-l1',
        start: 0.28,
        text: "Now, one thing that isn't changing.",
        rate: 1.02,
        captions: ["One thing that isn't changing"],
      },
      {
        id: 's7-l2',
        start: 3.42,
        text: 'Your performance appraisal stays on the same schedule,',
        rate: 1.02,
        captions: ['Your PERFORMANCE APPRAISAL', 'stays on the same schedule'],
      },
      {
        id: 's7-l3',
        start: 7.45,
        text: "and it'll still close in December.",
        rate: 1.06,
        captions: ['and it will still close', 'in DECEMBER'],
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
    id: 'example',
    title: '8 - The implementation year',
    duration: 27.9,
    beats: {
      labelIn: 0.4,
      // Each term of the equation arrives on the words that describe it.
      meritIn: 3.4,
      meritValue: 5.6,
      railIn: 7.3,
      railCount: 10.8,
      insteadOf: 11.7,
      divide: 14.0,
      perMonth: 15.5,
      multiply: 19.1,
      equivalent: 25.4,
      settle: 27.0,
    },
    voice: [
      {
        id: 's8-l1',
        start: 0.35,
        text: "There's one more thing worth knowing.",
        rate: 1.02,
        captions: ['One more thing worth knowing'],
      },
      {
        id: 's8-l2',
        start: 3.26,
        text: 'Say your merit increase is 5%.',
        spoken: 'Say your merit increase is five percent.',
        rate: 1.04,
        captions: ['Say your merit increase is 5%'],
      },
      {
        id: 's8-l3',
        start: 7.11,
        text: 'During the implementation year, the calculation covers 15 months, instead of 12.',
        spoken:
          'During the implementation year, the calculation covers fifteen months, instead of twelve.',
        rate: 1.02,
        captions: ['The implementation year covers', '15 MONTHS instead of 12'],
      },
      {
        id: 's8-l4',
        start: 13.12,
        text: '5% divided by 12 is about 0.417% a month.',
        spoken: 'Five percent divided by twelve is about zero point four one seven percent a month.',
        rate: 1.0,
        captions: ['5% ÷ 12 = about 0.417%', 'per month'],
      },
      {
        id: 's8-l5',
        start: 18.97,
        text: 'Multiply that by 15 months,',
        spoken: 'Multiply that by fifteen months,',
        rate: 1.04,
        captions: ['Multiply that by 15 months'],
      },
      {
        id: 's8-l6',
        start: 22.61,
        text: 'and the equivalent becomes 6.25%.',
        spoken: 'and the equivalent becomes six point two five percent.',
        rate: 1.1,
        captions: ['and the equivalent becomes', '6.25%'],
      },
    ],
    text: {
      label: implementation.label,
      meritLabel: implementation.meritLabel,
      merit: implementation.merit,
      dividedBy: implementation.dividedBy,
      perMonth: implementation.perMonth,
      perMonthLabel: implementation.perMonthLabel,
      multipliedBy: implementation.multipliedBy,
      equivalent: implementation.equivalent,
      equivalentLabel: implementation.equivalentLabel,
      monthsChip: implementation.monthsChip,
      insteadOf: implementation.insteadOf,
      note: implementation.note,
    },
  },
  {
    id: 'summary',
    title: '9 - The visual summary',
    duration: 6.41,
    beats: {
      labelIn: 0.45,
      rangeIn: 1.15,
      ruleIn: 1.9,
      anchor1: 3.4,
      anchor2: 4.0,
      anchor3: 4.6,
      settle: 5.0,
    },
    voice: [
      {
        id: 's9-l1',
        start: 0.4,
        text: 'So - April to March.',
        spoken: 'So, April to March.',
        rate: 1.1,
        captions: ['APRIL to MARCH'],
      },
      {
        id: 's9-l2',
        start: 3.3,
        text: "That's the one to remember.",
        rate: 1.04,
        captions: ["That's the one to remember."],
      },
    ],
    text: {
      label: 'NEW SALARY CYCLE',
      from: cycle.newCycleFromLong,
      to: cycle.newCycleToLong,
    },
  },
  {
    id: 'why',
    title: '10 - Why the change',
    duration: 10.23,
    beats: {
      chartIn: 0.35,
      dataIn: 0.9,
      line1: 2.5,
      line2: 5.9,
      // The forecast line draws slowly underneath the closing sentence.
      alignIn: 6.2,
    },
    voice: [
      {
        id: 's10-l1',
        start: 0.3,
        text: 'Why the change?',
        rate: 1.06,
        captions: ['Why the change?'],
      },
      {
        id: 's10-l2',
        start: 2.41,
        text: 'It brings us closer to market best practice,',
        rate: 1.0,
        captions: ['Closer to market best practice'],
      },
      {
        id: 's10-l3',
        start: 5.78,
        text: 'and it gives us more relevant information when we set salaries.',
        rate: 1.0,
        captions: ['More relevant information', 'when we set salaries'],
      },
    ],
    text: {
      line1: 'BETTER MARKET ALIGNMENT',
      line2: 'MORE RELEVANT INFORMATION',
    },
  },
  {
    id: 'close',
    title: '11 - Final message',
    duration: 6.19,
    beats: {
      questionsIn: 0.5,
      contactIn: 2.7,
      logoIn: 4.8,
    },
    voice: [
      {
        id: 's11-l1',
        start: 0.45,
        text: 'If you have questions,',
        rate: 1.02,
        captions: ['If you have questions,'],
      },
      {
        id: 's11-l2',
        start: 2.62,
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
