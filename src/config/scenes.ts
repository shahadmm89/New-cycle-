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
    duration: 7,
    beats: {
      ringIn: 0,
      monthsSweep: 0.25,
      headlineIn: 0.9,
      highlightPhrase: 1.7,
      subIn: 3.3,
      pushIn: 4.4,
    },
    voice: [
      {
        id: 's1-l1',
        start: 0.35,
        text: 'Did you know our Salary Cycle is changing?',
        rate: 1.04,
        captions: ['Did you know our', 'SALARY CYCLE is changing?'],
      },
      {
        id: 's1-l2',
        start: 3.5,
        text: "Here's what it means for you.",
        rate: 0.98,
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
    duration: 8.9,
    beats: {
      label: 0.1,
      ringIn: 0.3,
      monthsFlow: 0.7,
      railIn: 1.4,
      endpointsIn: 2.6,
      bannerIn: 4.3,
      settle: 6.6,
    },
    voice: [
      {
        id: 's2-l1',
        start: 0.2,
        text: 'Until now, our salary cycle has followed January to December.',
        rate: 1.0,
        captions: ['Until now, our salary cycle has followed', 'JANUARY to DECEMBER'],
      },
      {
        id: 's2-l2',
        start: 4.1,
        text: 'Twelve months. One cycle. Starting in January.',
        rate: 1.06,
        captions: ['Twelve months. One cycle.', 'Starting in January.'],
      },
      {
        id: 's2-l3',
        start: 7.3,
        text: "That's the cycle you know today.",
        rate: 0.97,
        captions: ["That's the cycle you know today."],
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
    title: '3 - How merit & bonus work today',
    duration: 10.7,
    beats: {
      label: 0.1,
      meritCard: 0.3,
      meritChart: 1.0,
      meritForecast: 1.9,
      meritLabel: 2.6,
      bonusCard: 4.6,
      bonusTiles: 4.9,
      bonusLabel: 6.6,
      estimateStamp: 8.7,
    },
    voice: [
      {
        id: 's3-l1',
        start: 0.25,
        text: 'Merit recommendations have been based on projected market salary movement.',
        rate: 1.0,
        captions: ['MERIT', 'Projected market movement'],
      },
      {
        id: 's3-l2',
        start: 4.5,
        text: 'And bonus, on estimated company performance against KPIs.',
        spoken: 'And bonus, on estimated company performance against K P Is.',
        rate: 1.0,
        captions: ['BONUS', 'Estimated company performance'],
      },
      {
        id: 's3-l3',
        start: 8.8,
        text: 'Both built on estimates.',
        rate: 1.08,
        captions: ['Both built on estimates.'],
      },
    ],
    text: {
      label: 'HOW IT WORKS TODAY',
      meritTitle: 'MERIT',
      meritValue: 'Projected Market Movement',
      bonusTitle: 'BONUS',
      bonusValue: 'Estimated Company Performance',
      kpis: [...kpis],
      stamp: 'BASED ON ESTIMATES',
    },
  },
  {
    id: 'the-change',
    title: '4 - THE CHANGE (hero)',
    duration: 12.7,
    beats: {
      oldRingIn: 0,
      oldLabel: 0.3,
      spinUp: 2.6,
      flipMonths: 3.4,
      handover: 5.0,
      newRingIn: 5.4,
      newLabelIn: 6.0,
      bigReveal: 6.4,
      yesBeat: 8.5,
      lockIn: 10.9,
    },
    voice: [
      {
        id: 's4-l1',
        start: 0.2,
        text: "Going forward, we're changing the Salary Cycle.",
        rate: 1.0,
        captions: ["We're changing the SALARY CYCLE"],
      },
      {
        id: 's4-l2',
        start: 3.1,
        text: 'From January to December...',
        rate: 1.14,
        captions: ['From JANUARY to DECEMBER…'],
      },
      {
        id: 's4-l3',
        start: 5.5,
        text: '...to April to March.',
        spoken: 'to April, to March.',
        rate: 1.16,
        captions: ['…to APRIL to MARCH'],
      },
      {
        id: 's4-l4',
        start: 8.5,
        text: 'Yes - April to March.',
        spoken: 'Yes. April to March.',
        rate: 1.12,
        captions: ['Yes — APRIL to MARCH.'],
      },
      {
        id: 's4-l5',
        start: 10.9,
        text: "That's our new salary cycle.",
        rate: 1.02,
        captions: ["That's our new salary cycle."],
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
    title: '5 - What happens in April',
    duration: 10.4,
    beats: {
      monthIn: 0,
      monthSettle: 0.7,
      meritIn: 1.9,
      promotionIn: 2.6,
      liftOff: 3.9,
      effectiveIn: 5.2,
      restate: 7.8,
    },
    voice: [
      {
        id: 's5-l1',
        start: 0.3,
        text: 'Starting April first, new merit increases and promotions take effect.',
        spoken: 'Starting April first, new merit increases and promotions take effect.',
        rate: 1.02,
        captions: ['MERIT + PROMOTION', 'take effect APRIL 1'],
      },
      {
        id: 's5-l2',
        start: 4.6,
        text: 'April is where your new salary year begins.',
        rate: 1.04,
        captions: ['April is where your', 'new salary year begins.'],
      },
      {
        id: 's5-l3',
        start: 7.8,
        text: 'Merit. Promotion. Effective April first.',
        rate: 1.1,
        captions: ['Merit. Promotion.', 'Effective APRIL 1.'],
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
    title: '6 - What happens in March',
    duration: 9,
    beats: {
      railIn: 0,
      travel: 0.5,
      landMarch: 2.5,
      monthIn: 3.0,
      bonusIn: 3.9,
      payrollIn: 4.8,
      closesNote: 6.4,
    },
    voice: [
      {
        id: 's6-l1',
        start: 0.3,
        text: 'And your bonus will be paid in the March payroll.',
        rate: 1.02,
        captions: ['BONUS', 'paid in the MARCH payroll'],
      },
      {
        id: 's6-l2',
        start: 4.1,
        text: 'March closes the new salary cycle.',
        rate: 1.04,
        captions: ['March closes the', 'new salary cycle.'],
      },
      {
        id: 's6-l3',
        start: 6.9,
        text: 'Bonus. March payroll.',
        rate: 1.12,
        captions: ['Bonus. MARCH PAYROLL.'],
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
    duration: 9.2,
    beats: {
      perfRowIn: 0.1,
      perfRailIn: 0.4,
      decLand: 1.4,
      tickIn: 2.0,
      salaryRowIn: 3.4,
      salaryRailIn: 3.7,
      newBadge: 4.6,
      contrast: 5.4,
    },
    voice: [
      {
        id: 's7-l1',
        start: 0.25,
        text: 'Your performance appraisal cycle does not change.',
        rate: 1.06,
        captions: ['Your PERFORMANCE cycle', 'does NOT change'],
      },
      {
        id: 's7-l2',
        start: 3.3,
        text: 'It continues as usual, and still closes in December.',
        rate: 1.0,
        captions: ['It continues as usual,', 'and still closes in DECEMBER.'],
      },
      {
        id: 's7-l3',
        start: 7.0,
        text: 'Only the salary cycle moves.',
        rate: 1.08,
        captions: ['Only the SALARY cycle moves.'],
      },
    ],
    text: {
      perfTitle: 'PERFORMANCE CYCLE',
      perfRange: cycle.performanceWindowLabel,
      perfBadge: 'NO CHANGE',
      salaryTitle: 'SALARY CYCLE',
      salaryRange: cycle.newCycleLabel,
      salaryBadge: 'NEW',
    },
  },
  {
    id: 'before-after',
    title: '8 - Before becomes after',
    duration: 10.8,
    beats: {
      beforeIn: 0,
      beforeRows: 0.4,
      transform: 1.5,
      afterIn: 2.1,
      anchor1: 4.5,
      anchor2: 7.0,
      anchor3: 8.3,
      settle: 9.6,
    },
    voice: [
      {
        id: 's8-l1',
        start: 0.2,
        text: "Here's the whole picture.",
        rate: 1.0,
        captions: ["Here's the whole picture."],
      },
      {
        id: 's8-l2',
        start: 2.0,
        text: 'Salary cycle: April to March.',
        rate: 1.1,
        captions: ['SALARY CYCLE:  APR → MAR'],
      },
      {
        id: 's8-l3',
        start: 4.6,
        text: 'April - merit and promotion.',
        spoken: 'April: merit, and promotion.',
        rate: 1.06,
        captions: ['APRIL — merit + promotion'],
      },
      {
        id: 's8-l4',
        start: 7.1,
        text: 'March - bonus.',
        spoken: 'March: bonus.',
        rate: 1.1,
        captions: ['MARCH — bonus'],
      },
      {
        id: 's8-l5',
        start: 8.4,
        text: 'December - performance closes.',
        spoken: 'December: performance closes.',
        rate: 1.06,
        captions: ['DECEMBER — performance closes'],
      },
    ],
    text: {
      beforeLabel: 'BEFORE',
      afterLabel: 'NOW',
      beforeRange: cycle.oldCycleLabel,
      afterRange: cycle.newCycleLabel,
      beforeRows: ['Merit — projected market movement', 'Bonus — estimated company performance'],
    },
  },
  {
    id: 'why',
    title: '9 - Why the change',
    duration: 6.0,
    beats: {
      chartIn: 0,
      dataIn: 0.4,
      alignIn: 1.6,
      line1: 0.9,
      line2: 2.8,
    },
    voice: [
      {
        id: 's9-l1',
        start: 0.15,
        text: 'This brings us closer to market best practice,',
        rate: 0.99,
        captions: ['Closer to market best practice'],
      },
      {
        id: 's9-l2',
        start: 2.8,
        text: 'with more relevant information behind salary decisions.',
        rate: 0.99,
        captions: ['More relevant information', 'behind salary decisions'],
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
    duration: 4.6,
    beats: {
      cycleIn: 0,
      anchorsIn: 0.5,
      questionsIn: 1.4,
      contactIn: 2.0,
      logoIn: 2.5,
    },
    voice: [
      {
        id: 's10-l1',
        start: 1.6,
        text: 'Have questions? HR is ready to help.',
        spoken: 'Have questions? H R is ready to help.',
        rate: 1.0,
        captions: ['Have questions?', 'HR is ready to help.'],
      },
    ],
    text: {
      cycle: cycle.newCycleLabel,
      cycleLabel: 'SALARY CYCLE',
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
