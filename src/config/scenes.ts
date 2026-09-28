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
 * RE-ANCHORING AFTER A SCRIPT OR VOICE CHANGE
 * -------------------------------------------
 * Every absolute number in this file - scene durations, phrase starts, beats -
 * describes a particular recorded read. After the script or the voice changes:
 *
 *   npm run voiceover:build -- --no-fit  record every phrase at natural pace
 *   npm run voiceover:plan -- --write    re-derive durations, starts and beats
 *                                        from the clips and the pacing intent
 *                                        in voiceover.pacing.ts
 *   npm run voiceover:anchor -- --write  land the word-pinned beats (the
 *                                        timeline pins) on the word itself
 *   npm run voiceover:build -- --assemble-only
 *   npm run check:sync                   prove nothing is cut off or stranded
 *
 * plan moves each beat with the phrase it belongs to; anchor then measures the
 * onset of the named word inside its clip - see src/config/anchors.ts.
 */
import {cycle, implementation, kpiTerm, kpis, leave, monthsCalendar, monthsSalaryYear} from './copy';

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
    title: '1 - Why the cycle is changing',
    duration: 8.67,
    beats: {
      ringIn: 0,
      monthsSweep: 0.04,
      headlineIn: 0.24,
      pushIn: 2.14,
      // On the word - see anchors.ts.
      highlightPhrase: 2.37,
      postIn: 3.35,
      subIn: 6.01,
    },
    voice: [
      {
        id: 's1-l1',
        start: 0.36,
        text: 'YASREF is changing its salary cycle,',
        // Said as a name, not spelled out letter by letter.
        spoken: 'Yasref is changing its salary cycle,',
        rate: 1.0,
        captions: ['YASREF is changing', 'its SALARY CYCLE'],
      },
      {
        id: 's1-l2',
        start: 3.46,
        text: 'to align with best practice, and make it more timely and relevant.',
        rate: 1.0,
        captions: ['to align with best practice,', 'and make it more timely and relevant'],
      },
    ],
    text: {
      headlinePre: 'YASREF is changing its',
      headlineKey: 'SALARY CYCLE',
      headlinePost: 'to align with best practice',
      sub: 'Better timing  ·  More relevant decisions',
    },
  },
  {
    id: 'timing-only',
    title: '2 - Timing only, benefits unchanged',
    duration: 11.7,
    beats: {
      changeRowIn: 0.3,
      contrast: 5.6,
      keepRowIn: 5.8,
      // On the word - see anchors.ts.
      changeBadge: 1.2,
      changeDetail: 1.97,
      benefitsIn: 5.98,
      keepDetailIn: 7.21,
      keepBadge: 9.92,
    },
    voice: [
      {
        id: 's2-l1',
        start: 0.35,
        text: 'Only the timing changes: when your benefits are received and reflected.',
        rate: 1.0,
        captions: ['Only the TIMING changes:', 'when your benefits are received'],
      },
      {
        id: 's2-l2',
        start: 5.99,
        text: 'Your benefits, and your Total Reward Package, stay exactly the same.',
        rate: 1.0,
        captions: ['Your benefits and Total Reward Package', 'stay exactly the same'],
      },
    ],
    text: {
      changeTitle: 'WHAT CHANGES',
      changeRange: 'TIMING',
      changeDetail: 'When benefits are received & reflected',
      changeBadge: 'CHANGES',
      keepTitle: 'WHAT DOES NOT CHANGE',
      keepRange: 'BENEFITS',
      benefits: ['BONUS', 'MERIT', 'PROMOTION'],
      keepDetail: 'Total Reward Package',
      keepBadge: 'NO CHANGE',
    },
  },
  {
    id: 'old-cycle',
    title: '3 - The current cycle',
    duration: 6.08,
    beats: {
      label: 0.06,
      ringIn: 0.16,
      railIn: 0.71,
      monthsFlow: 1.61,
      endpointsIn: 1.71,
      settle: 4.6,
      // The bottom timeline draws in here and then runs to the April scene.
      timelineIn: 0.36,
      // On the word - see anchors.ts.
      bannerIn: 4.59,
    },
    voice: [
      {
        id: 's3-l1',
        start: 0.31,
        text: 'Today, our cycle runs from January to December.',
        rate: 1.0,
        captions: ['Today, our cycle runs', 'from JANUARY to DECEMBER'],
      },
      {
        id: 's3-l2',
        start: 4.09,
        text: 'One cycle.',
        rate: 1.0,
        captions: ['One cycle.'],
      },
    ],
    text: {
      label: 'CURRENT SALARY CYCLE',
      from: cycle.oldCycleFromLong,
      to: cycle.oldCycleToLong,
      banner: 'ONE CYCLE',
    },
  },
  {
    id: 'today',
    title: '4 - November, December, January today',
    duration: 18.65,
    beats: {
      label: 0.11,
      bonusCard: 10.3,
      kpi1: 10.9,
      kpi2: 11.3,
      kpi3: 11.7,
      // On the word - see anchors.ts. The two cards stay up together: that is
      // the "in parallel". The KPIs roll up as the decisions are finalized.
      meritCard: 3.58,
      meritChart: 5.6,
      meritForecast: 6.93,
      meritLabel: 7.64,
      kpiCombine: 13.8,
      settle: 16.18,
      timelineNov: 0.29,
      timelineDec: 14.84,
    },
    voice: [
      {
        id: 's4-l1',
        start: 0.36,
        text: 'In November, two things happen in parallel.',
        rate: 1.0,
        captions: ['In NOVEMBER, two things', 'happen in parallel'],
      },
      {
        id: 's4-l2',
        start: 3.72,
        text: "Merit and salary movement, based on next year's expected inflation and market trends,",
        rate: 1.0,
        captions: ['MERIT & SALARY MOVEMENT,', "based on next year's expected", 'inflation and market trends'],
      },
      {
        id: 's4-l3',
        start: 10.26,
        text: 'and the year-end estimate.',
        rate: 1.0,
        captions: ['and the YEAR-END ESTIMATE'],
      },
      {
        id: 's4-l4',
        start: 12.92,
        text: 'Decisions are finalized in December, and reflected in January.',
        rate: 1.0,
        captions: ['Finalized in DECEMBER,', 'reflected in JANUARY'],
      },
    ],
    text: {
      label: 'HOW IT WORKS TODAY',
      when: 'NOVEMBER  ·  IN PARALLEL',
      meritTitle: 'MERIT & SALARY MOVEMENT',
      meritValue: 'Expected salary inflation & market movement for the next year',
      bonusTitle: 'YEAR-END ESTIMATE',
      bonusValue: `Estimated ${kpiTerm}`,
      kpis: [...kpis],
      combined: 'COMPANY PERFORMANCE KPIs',
    },
  },
  {
    id: 'the-change',
    title: '5 - THE CHANGE (hero)',
    duration: 6.66,
    beats: {
      oldRingIn: 0,
      oldLabel: 0.02,
      spinUp: 1.22,
      handover: 3.55,
      newRingIn: 3.75,
      newLabelIn: 3.85,
      bigReveal: 3.82,
      lockIn: 4.85,
      // The bottom timeline: today's pins clear, then the months re-align so
      // the run lands on APR -> MAR with the ring.
      timelinePinsOut: 1.02,
      timelineMorph: 2.22,
    },
    voice: [
      {
        id: 's5-l1',
        start: 0.31,
        text: "Now, here's the new proposed cycle.",
        rate: 1.0,
        captions: ["Now, here's the", 'NEW PROPOSED CYCLE'],
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
    title: '6 - January and February in the new cycle',
    duration: 7.54,
    beats: {
      labelIn: 0.11,
      chartIn: 0.41,
      dataIn: 1.01,
      // JANUARY lands on its own, before the narrator starts: the pin says it.
      timelineJan: 0.25,
      // On the word - see anchors.ts.
      timelineFeb: 0.99,
      line1: 3.22,
      line2: 3.82,
      alignIn: 3.81,
      // The small old-vs-new timing comparison, as "estimates" is said.
      compareIn: 4.83,
    },
    voice: [
      {
        id: 's6-l1',
        start: 0.91,
        text: 'From February, decisions rely on actual results, not estimates.',
        rate: 1.0,
        captions: ['From FEBRUARY, decisions rely on', 'ACTUAL results, not estimates'],
      },
    ],
    text: {
      label: 'WHAT THE NEW TIMING GIVES US',
      line1: 'ACTUAL INFLATION & MARKET MOVEMENT',
      line2: 'ACTUAL COMPANY PERFORMANCE',
      wasLabel: 'TODAY',
      wasMonths: ['NOV'],
      wasTag: 'ESTIMATED',
      nowLabel: 'NEW CYCLE',
      nowMonths: ['FEB'],
      nowTag: 'ACTUAL',
    },
  },
  {
    id: 'march',
    title: '7 - March',
    duration: 4.53,
    beats: {
      railIn: 0,
      travel: 0.2,
      landMarch: 2.2,
      bonusIn: 1.1,
      // On the word - see anchors.ts. JANUARY and FEBRUARY make way for MARCH.
      monthIn: 0.27,
      timelineMar: 0.24,
      payrollIn: 2.43,
    },
    voice: [
      {
        id: 's7-l1',
        start: 0.3,
        text: 'In March, YIB and bonus are paid.',
        spoken: 'In March, Y I B, and bonus are paid.',
        rate: 1.0,
        captions: ['In MARCH,', 'YIB & bonus are paid'],
      },
    ],
    text: {
      month: 'MARCH',
      bonus: 'YIB & BONUS',
      payroll: 'PAID  ·  MARCH PAYROLL',
    },
  },
  {
    id: 'april',
    title: '8 - April',
    duration: 6.51,
    beats: {
      liftOff: 3.4,
      effectiveIn: 3.9,
      restate: 4.8,
      // The rail has said everything it has to say; it retires with this scene.
      timelineOut: 5.3,
      // On the word - see anchors.ts.
      monthIn: 0.51,
      timelineApr: 0.51,
      meritIn: 1.14,
      promotionIn: 2.66,
    },
    voice: [
      {
        id: 's8-l1',
        start: 0.31,
        text: 'And in April, merit increases and promotion adjustments are reflected.',
        rate: 1.0,
        captions: ['And in APRIL, merit increases and', 'promotion adjustments are reflected'],
      },
    ],
    text: {
      month: 'APRIL',
      merit: 'MERIT',
      promotion: 'PROMOTION',
      effective: 'EFFECTIVE APRIL 1',
    },
  },
  {
    id: 'example',
    title: '9 - The 2026 implementation year',
    duration: 15.56,
    beats: {
      labelIn: 0.36,
      // The working runs on its own, one term at a time: no narration reads it.
      cardIn: 5.4,
      meritValue: 6.1,
      divide: 6.9,
      perMonth: 7.6,
      multiply: 8.5,
      strike: 9.3,
      resultIn: 9.7,
      // On the word - see anchors.ts.
      railIn: 1.85,
      extraIn: 3.56,
      settle: 12.23,
    },
    voice: [
      {
        id: 's9-l1',
        start: 0.36,
        text: 'This transition applies to the 2026 implementation year only.',
        spoken: 'This transition applies to the twenty twenty-six implementation year only.',
        rate: 1.0,
        captions: ['This transition applies to the', '2026 IMPLEMENTATION YEAR ONLY'],
      },
      {
        id: 's9-l2',
        start: 10.06,
        text: "The percentage itself doesn't change - only the months it covers.",
        spoken: "The percentage itself doesn't change, only the months it covers.",
        rate: 1.0,
        captions: ["The percentage doesn't change -", 'only the months it covers'],
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
    id: 'leave',
    title: '10 - Leave balance',
    duration: 12.21,
    beats: {
      labelIn: 0.2,
      janCard: 0.8,
      // The arithmetic is read off the card, not said.
      row1: 2.0,
      row1Result: 2.8,
      row2: 3.4,
      row2Result: 4.2,
      arrow: 5.4,
      // On the word - see anchors.ts.
      aprCard: 6.69,
      basisIn: 9.09,
    },
    voice: [
      {
        id: 's10-l1',
        start: 0.36,
        text: 'The same transition applies to your leave balance.',
        rate: 1.0,
        captions: ['The same transition applies', 'to your LEAVE BALANCE'],
      },
      {
        id: 's10-l2',
        start: 6.67,
        text: 'From April 2027, a new annual balance begins.',
        spoken: 'From April twenty twenty-seven, a new annual balance begins.',
        rate: 1.0,
        captions: ['From APRIL 2027,', 'a new annual balance begins'],
      },
    ],
    text: {
      label: leave.label,
      janWhen: leave.janWhen,
      janWhat: leave.janWhat,
      aprWhen: leave.aprWhen,
      aprWhat: leave.aprWhat,
      aprBasis: leave.aprBasis,
    },
  },
  {
    id: 'close',
    title: '11 - Final message',
    duration: 5.6,
    beats: {
      questionsIn: 0.3,
      logoIn: 3.4,
      // On the word - see anchors.ts.
      contactIn: 1.84,
    },
    voice: [
      {
        id: 's11-l1',
        start: 0.41,
        text: 'For further clarification, contact HR personnel.',
        spoken: 'For further clarification, contact H R personnel.',
        rate: 1.0,
        captions: ['For further clarification,', 'contact HR personnel.'],
      },
    ],
    text: {questions: 'FOR FURTHER CLARIFICATION', sub: 'CONTACT HR PERSONNEL'},
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
