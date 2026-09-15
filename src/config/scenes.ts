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
 *
 * RE-ANCHORING AFTER A VOICE CHANGE
 * --------------------------------
 * Every absolute number in this file - scene durations, phrase starts, beats -
 * describes a particular recorded read. The narrator is now Dan, and the numbers
 * below were derived from the previous voice, so they are a starting point and
 * nothing more. Once all 34 phrases exist in the new voice:
 *
 *   npm run voiceover:plan -- --write    re-derive durations, starts and beats
 *                                        from the new clips and the pacing
 *                                        intent in voiceover.pacing.ts
 *   npm run check:sync                   prove nothing is cut off or stranded
 *
 * That tool moves each beat with the phrase it belongs to, which is close but
 * not exact. The beats tied to a specific WORD - the timeline pins especially -
 * then have to be re-measured against the onset of that word inside its clip.
 * docs/EDITING-TEXT-AND-DATES.md explains how to read the onsets out.
 */
import {cycle, implementation, kpiTerm, kpiTermSpoken, kpis, monthsCalendar, monthsSalaryYear} from './copy';

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
    title: '1 - How do we run it today?',
    duration: 7.16,
    beats: {ringIn: 0, monthsSweep: 0.1, headlineIn: 0.3, highlightPhrase: 1.2, subIn: 3.9, pushIn: 2.2},
    voice: [
      {
        id: 's1-l1',
        start: 0.42,
        text: 'Do you know how we currently run our salary cycle?',
        rate: 1.0,
        captions: ['Do you know how we currently run', 'our SALARY CYCLE?'],
      },
      {
        id: 's1-l2',
        start: 4.4,
        text: "Let's start with how it works today.",
        rate: 1.0,
        captions: ["Let's start with how it works today."],
      },
    ],
    text: {
      headlinePre: 'Do you know how we run our',
      headlineKey: 'SALARY CYCLE',
      headlinePost: 'today?',
      sub: "Let's start with how it works right now",
    },
  },
  {
    id: 'old-cycle',
    title: '2 - The current cycle',
    duration: 7.6,
    beats: {
      label: 0.05,
      ringIn: 0.15,
      railIn: 0.7,
      monthsFlow: 1.6,
      endpointsIn: 1.7,
      bannerIn: 4.9,
      settle: 5.6,
      // The bottom timeline draws in here and then runs for four scenes.
      timelineIn: 0.35,
    },
    voice: [
      {
        id: 's2-l1',
        start: 0.3,
        text: 'Today, our cycle runs from January to December.',
        rate: 1.0,
        captions: ['Today, our cycle runs', 'from JANUARY to DECEMBER'],
      },
      {
        id: 's2-l2',
        start: 4.8,
        text: '12 months, one cycle.',
        spoken: 'Twelve months, one cycle.',
        rate: 1.06,
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
    duration: 21.08,
    beats: {
      label: 0.13,
      meritCard: 0.38,
      meritChart: 1.18,
      meritForecast: 2.68,
      meritLabel: 3.28,
      bonusCard: 12.26,
      kpi1: 13.66,
      kpi2: 14.16,
      kpi3: 14.66,
      kpiCombine: 15.46,
      // Bottom-timeline pins. Each is cued 0.2s before the onset of the word
      // itself, so the pin LANDS on the month rather than starting there.
      // Offsets carried over from the Alexander read ("around NOVEMBER" was
      // s3-l3 + 2.80s, "by DECEMBER" s3-l5 + 1.72s) - a starting point only,
      // to be re-measured against the new voice. See RE-ANCHORING below.
      timelineNov: 10.4,
      timelineDec: 19.0,
    },
    voice: [
      {
        id: 's3-l1',
        start: 0.38,
        text: 'For merit, we rely on expected market movement,',
        rate: 1.0,
        captions: ['MERIT', 'Expected market movement'],
      },
      {
        id: 's3-l2',
        start: 4.03,
        text: 'based on projected market and inflation trends.',
        rate: 1.0,
        captions: ['based on projected market', 'and inflation trends'],
      },
      {
        id: 's3-l3',
        start: 7.83,
        text: 'The salary market data becomes available around November.',
        rate: 1.0,
        captions: ['Salary market data becomes', 'available around NOVEMBER'],
      },
      {
        id: 's3-l4',
        start: 12.26,
        text: 'For bonus, we use estimated Company Performance KPIs,',
        spoken: `For bonus, we use estimated ${kpiTermSpoken},`,
        rate: 1.0,
        captions: ['BONUS', 'Estimated Company Performance KPIs'],
      },
      {
        id: 's3-l5',
        start: 17.45,
        text: 'based on the information available by December.',
        rate: 1.0,
        captions: ['based on the information', 'available by DECEMBER'],
      },
    ],
    text: {
      label: 'HOW IT WORKS TODAY',
      meritTitle: 'MERIT',
      meritValue: 'Expected Market Movement',
      bonusTitle: 'BONUS',
      bonusValue: `Estimated ${kpiTerm}`,
      kpis: [...kpis],
      combined: 'COMPANY PERFORMANCE KPIs',
    },
  },
  {
    id: 'the-change',
    title: '4 - THE CHANGE (hero)',
    duration: 6.3,
    beats: {
      oldRingIn: 0.02,
      oldLabel: 0.12,
      spinUp: 1.32,
      handover: 3.42,
      newRingIn: 3.62,
      newLabelIn: 3.72,
      bigReveal: 3.82,
      lockIn: 4.72,
      // The bottom timeline: today's pins clear, then the months re-align so
      // the run lands on APR -> MAR as "From April, to March" is said.
      timelinePinsOut: 1.12,
      timelineMorph: 2.32,
    },
    voice: [
      {
        id: 's4-l1',
        start: 0.32,
        text: "Now, we're moving to a new cycle.",
        rate: 1.0,
        captions: ["Now, we're moving to a new cycle."],
      },
      {
        id: 's4-l2',
        start: 3.42,
        text: 'From April, to March.',
        rate: 1.1,
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
    id: 'actual-data',
    title: '5 - What the new timing gives us',
    duration: 22.36,
    beats: {
      labelIn: 0.16,
      chartIn: 0.46,
      dataIn: 1.06,
      line1: 4.5,
      line2: 9.16,
      alignIn: 13.61,
      // Bottom-timeline pins. Provisional: placed on the measured onset of
      // the word by `npm run voiceover:anchor` - see RE-ANCHORING above.
      timelineJan: 4.5,
      timelineFeb: 9.4,
      // The small old-vs-new timing comparison, once both months are named.
      compareIn: 13.6,
    },
    voice: [
      {
        id: 's5-l1',
        start: 0.36,
        text: 'That shift also changes when the information arrives.',
        rate: 1.0,
        captions: ['It changes WHEN the', 'information arrives'],
      },
      {
        id: 's5-l2',
        start: 4.5,
        text: 'By January, actual Company Performance is available.',
        rate: 1.0,
        captions: ['By JANUARY', 'actual Company Performance'],
      },
      {
        id: 's5-l3',
        start: 9.16,
        text: 'And by February, actual market movement is available.',
        rate: 1.0,
        captions: ['And by FEBRUARY', 'actual market movement'],
      },
      {
        id: 's5-l4',
        start: 13.61,
        text: 'This brings the salary cycle closer to market best practice,',
        rate: 1.0,
        captions: ['Closer to market best practice'],
      },
      {
        id: 's5-l5',
        start: 17.8,
        text: 'so decisions rest on more relevant, actual information.',
        rate: 1.0,
        captions: ['Decisions rest on more relevant,', 'actual information'],
      },
    ],
    text: {
      label: 'WHAT THE NEW TIMING GIVES US',
      line1: 'ACTUAL COMPANY PERFORMANCE',
      line2: 'ACTUAL MARKET MOVEMENT',
      wasLabel: 'TODAY',
      wasMonths: ['NOV', 'DEC'],
      wasTag: 'ESTIMATED',
      nowLabel: 'NEW CYCLE',
      nowMonths: ['JAN', 'FEB'],
      nowTag: 'ACTUAL',
    },
  },
  {
    id: 'april',
    title: '6 - April',
    duration: 7.71,
    beats: {
      monthIn: 0.15,
      meritIn: 0.4,
      promotionIn: 1.8,
      liftOff: 3.0,
      effectiveIn: 3.5,
      monthSettle: 5.5,
      restate: 5.7,
      // Bottom-timeline pin on "...take effect on APRIL 1". Provisional.
      timelineApr: 2.6,
    },
    voice: [
      {
        id: 's6-l1',
        start: 0.38,
        text: 'Merit increases and promotions will take effect on April 1.',
        spoken: 'Merit increases and promotions will take effect on April first.',
        rate: 1.0,
        captions: ['Merit increases and promotions', 'take effect on APRIL 1'],
      },
      {
        id: 's6-l2',
        start: 4.73,
        text: "That's where the cycle now begins.",
        rate: 1.0,
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
    title: '7 - March',
    duration: 7.86,
    beats: {
      railIn: 0,
      travel: 0.8,
      bonusIn: 0.9,
      landMarch: 2.6,
      monthIn: 2.65,
      payrollIn: 2.9,
      noteIn: 6.1,
      closesNote: 4.6,
      // Bottom-timeline pin on "...paid in the MARCH payroll". Provisional.
      timelineMar: 2.4,
      // Six scenes after it was drawn, the rail retires.
      timelineOut: 6.4,
    },
    voice: [
      {
        id: 's7-l1',
        start: 0.44,
        text: 'And your bonus will be paid in the March payroll.',
        rate: 1.0,
        captions: ['BONUS', 'paid in the MARCH payroll'],
      },
      {
        id: 's7-l2',
        start: 4.52,
        text: 'March is the last month of the cycle.',
        rate: 1.0,
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
    title: '8 - What does NOT change',
    duration: 10,
    beats: {perfRowIn: 3.5, perfRailIn: 3.8, tickIn: 5.0, salaryRowIn: 7.4, salaryRailIn: 7.7, contrast: 8.1, newBadge: 8.5},
    voice: [
      {
        id: 's8-l1',
        start: 0.3,
        text: "Now, one thing that isn't changing.",
        rate: 1.0,
        captions: ["One thing that isn't changing"],
      },
      {
        id: 's8-l2',
        start: 3.2,
        text: 'Your performance appraisal stays on the same schedule,',
        rate: 1.0,
        captions: ['Your PERFORMANCE APPRAISAL', 'stays on the same schedule'],
      },
      {
        id: 's8-l3',
        start: 6.6,
        text: "and it'll still close in December.",
        rate: 1.0,
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
    title: '9 - The implementation year',
    duration: 30,
    beats: {
      labelIn: 0.3,
      railIn: 3.4,
      extraIn: 6.4,
      cardIn: 10.2,
      meritValue: 11.6,
      divide: 15.0,
      perMonth: 16.4,
      multiply: 19.4,
      resultIn: 22.6,
      strike: 23.4,
      settle: 26.0,
    },
    voice: [
      {
        id: 's9-l1',
        start: 0.3,
        text: "There's one more thing, and it happens only once.",
        rate: 1.0,
        captions: ["One more thing -", 'and it happens only once'],
      },
      {
        id: 's9-l2',
        start: 3.4,
        text: 'During the implementation year only, the merit calculation will cover 15 months instead of 12.',
        spoken:
          'During the implementation year only, the merit calculation will cover fifteen months instead of twelve.',
        rate: 1.0,
        captions: ['IMPLEMENTATION YEAR ONLY:', '15 months instead of 12'],
      },
      {
        id: 's9-l3',
        start: 10.2,
        text: 'As an illustrative example, if your merit increase is 5%,',
        spoken: 'As an illustrative example, if your merit increase is five percent,',
        rate: 1.0,
        captions: ['ILLUSTRATIVE EXAMPLE', 'a 5% merit increase'],
      },
      {
        id: 's9-l4',
        start: 14.6,
        text: "that's 5% divided by 12, which is 0.4167% a month.",
        spoken:
          "that's five percent divided by twelve, which is zero point four one six seven percent a month.",
        rate: 1.0,
        captions: ['5% ÷ 12 = 0.4167%', 'per month'],
      },
      {
        id: 's9-l5',
        start: 19.4,
        text: 'Multiply that by 15 months,',
        spoken: 'Multiply that by fifteen months,',
        rate: 1.0,
        captions: ['Multiply that by 15 months'],
      },
      {
        id: 's9-l6',
        start: 22.0,
        text: 'and the equivalent becomes 6.25%.',
        spoken: 'and the equivalent becomes six point two five percent.',
        rate: 1.06,
        captions: ['and the equivalent becomes', '6.25%'],
      },
      {
        id: 's9-l7',
        start: 25.6,
        text: "The merit percentage itself hasn't changed - only the number of months it covers.",
        rate: 1.0,
        captions: ["The merit percentage hasn't changed -", 'only the months it covers'],
      },
    ],
    text: {
      label: implementation.label,
      once: implementation.once,
      twelve: implementation.twelve,
      plusThree: implementation.plusThree,
      extraMonthNumbers: [...implementation.extraMonthNumbers],
      over12: implementation.over12,
      over15: implementation.over15,
      illustrative: implementation.illustrative,
      unchanged: implementation.unchanged,
      merit: implementation.merit,
      dividedBy: implementation.dividedBy,
      perMonth: implementation.perMonth,
      perMonthLabel: implementation.perMonthLabel,
      multipliedBy: implementation.multipliedBy,
      equivalent: implementation.equivalent,
    },
  },
  {
    id: 'summary',
    title: '10 - The visual summary',
    duration: 5.6,
    beats: {labelIn: 0.4, rangeIn: 0.6, ruleIn: 1.3, anchor1: 3.0, anchor2: 3.6, anchor3: 4.2, settle: 4.6},
    voice: [
      {
        id: 's10-l1',
        start: 0.4,
        text: 'So - April to March.',
        spoken: 'So, April to March.',
        rate: 1.06,
        captions: ['APRIL to MARCH'],
      },
      {
        id: 's10-l2',
        start: 2.9,
        text: "That's the one to remember.",
        rate: 1.0,
        captions: ["That's the one to remember."],
      },
    ],
    text: {label: 'NEW SALARY CYCLE', from: cycle.newCycleFromLong, to: cycle.newCycleToLong},
  },
  {
    id: 'close',
    title: '11 - Final message',
    duration: 7,
    beats: {questionsIn: 0.5, contactIn: 2.3, logoIn: 4.6},
    voice: [
      {
        id: 's11-l1',
        start: 0.45,
        text: 'Have questions?',
        rate: 1.0,
        captions: ['Have questions?'],
      },
      {
        id: 's11-l2',
        start: 2.3,
        text: 'Please contact your HR personnel for support.',
        spoken: 'Please contact your H R personnel for support.',
        rate: 1.0,
        captions: ['Please contact your HR personnel', 'for support.'],
      },
    ],
    text: {questions: 'HAVE QUESTIONS?', sub: 'PLEASE CONTACT YOUR HR PERSONNEL FOR SUPPORT'},
  },
];

/** Absolute start time of every scene, derived from the durations above. */
export const sceneStarts: number[] = scenes.reduce<number[]>((acc, _scene, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + scenes[i - 1].duration);
  return acc;
}, []);

export const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
export const totalFrames = Math.round(totalDuration * FPS);

/**
 * Absolute time of a named beat. The film-level layers (the bottom timeline,
 * the lighting) sit outside any scene and so cannot use useProgress, but their
 * timing still belongs here rather than in a component.
 */
export const sceneBeat = (id: string, key: string): number => {
  const scene = scenes.find((s) => s.id === id);
  if (!scene) throw new Error(`Unknown scene "${id}"`);
  const at = scene.beats[key];
  if (at === undefined) throw new Error(`Scene "${id}" has no beat "${key}"`);
  return sceneStart(id) + at;
};

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
