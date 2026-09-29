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
import {cycle, implementation, leave, monthsCalendar, monthsSalaryYear} from './copy';

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
    title: '1 - The change, and why',
    duration: 11.43,
    beats: {
      ringIn: 0,
      monthsSweep: 0.04,
      headlineIn: 0.24,
      pushIn: 2.14,
      // A title slide first: title, subtitle and supporting line are all up
      // before the narrator starts (see the hook's leadIn in
      // voiceover.pacing.ts), so the slide reads on its own.
      highlightPhrase: 0.25,
      postIn: 0.9,
      subIn: 1.4,
    },
    voice: [
      {
        id: 's1-l1',
        start: 2.25,
        text: 'YASREF will change the salary merit effectiveness from January to April,',
        // Said as a name, not spelled out letter by letter.
        spoken: 'Yasref will change the salary merit effectiveness from January to April,',
        rate: 1.0,
        captions: ['YASREF will change the salary', 'merit effectiveness', 'from JANUARY to APRIL,'],
      },
      {
        id: 's1-l2',
        start: 6.68,
        text: 'changing only the timing in alignment with market best practices.',
        rate: 1.0,
        captions: ['changing only the TIMING,', 'in alignment with market best practices'],
      },
    ],
    text: {
      // The opening slide stays deliberately simple: title, subtitle, one
      // supporting line. Everything else is introduced in the scenes after it.
      headlinePre: '',
      headlineKey: 'SALARY MERIT\nEFFECTIVENESS UPDATE',
      headlinePost: 'Effective from January to April',
      sub: 'Aligned with market best practices.',
    },
  },
  {
    id: 'the-change',
    title: '2 - THE NEW PROPOSED CYCLE (hero)',
    duration: 6.18,
    beats: {
      oldRingIn: 0,
      oldLabel: 0,
      spinUp: 1.17,
      handover: 3.5,
      newRingIn: 3.7,
      newLabelIn: 3.8,
      bigReveal: 3.77,
      lockIn: 4.8,
      // The bottom timeline draws in with the scene, then its twelve months
      // re-align so the run lands on APR -> MAR with the ring.
      timelineIn: 0.15,
      timelineMorph: 2.17,
    },
    voice: [
      {
        id: 's2-l1',
        start: 0.35,
        text: "Here's the new proposed cycle.",
        rate: 1.0,
        captions: ["Here's the", 'NEW PROPOSED CYCLE'],
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
    id: 'march',
    title: '3 - March',
    duration: 3.67,
    beats: {
      railIn: 0.05,
      travel: 0.25,
      landMarch: 2.25,
      bonusIn: 0.17,
      // On the word - see anchors.ts.
      monthIn: 1.52,
      timelineMar: 1.52,
      payrollIn: 1.22,
    },
    voice: [
      {
        id: 's3-l1',
        start: 0.35,
        text: 'The bonus will be paid in March.',
        rate: 1.0,
        captions: ['The BONUS will be paid', 'in MARCH'],
      },
    ],
    text: {
      month: 'MARCH',
      bonus: 'BONUS',
      payroll: 'PAID  ·  MARCH PAYROLL',
    },
  },
  {
    id: 'april',
    title: '4 - April',
    duration: 5.7,
    beats: {
      liftOff: 3.43,
      effectiveIn: 3.93,
      restate: 4.83,
      // The rail has said everything it has to say; it retires with this scene.
      timelineOut: 5.33,
      // On the word - see anchors.ts.
      monthIn: 0.28,
      timelineApr: 0.28,
      meritIn: 0.78,
      promotionIn: 2,
    },
    voice: [
      {
        id: 's4-l1',
        start: 0.34,
        text: 'In April, merit increases and promotion adjustments will be reflected.',
        rate: 1.0,
        captions: ['In APRIL, merit increases and', 'promotion adjustments will be reflected'],
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
    title: '5 - The 2027 implementation year',
    duration: 17.06,
    beats: {
      labelIn: 0.4,
      // The working runs on its own, one term at a time: no narration reads it.
      cardIn: 5.44,
      meritValue: 6.14,
      divide: 6.94,
      perMonth: 7.64,
      multiply: 8.54,
      strike: 9.34,
      resultIn: 9.74,
      // On the word - see anchors.ts.
      railIn: 2.03,
      extraIn: 2.84,
      settle: 13.98,
    },
    voice: [
      {
        id: 's5-l1',
        start: 0.4,
        text: 'This transition applies to the 2027 implementation year only.',
        spoken: 'This transition applies to the twenty twenty-seven implementation year only.',
        rate: 1.0,
        captions: ['This transition applies to the', '2027 IMPLEMENTATION YEAR ONLY'],
      },
      {
        id: 's5-l2',
        start: 9.06,
        text: 'During the transition year, the bonus will cover 15 months, while the percentage itself does not change \u2014 only the months it covers.',
        spoken: 'During the transition year, the bonus will cover fifteen months, while the percentage itself does not change, only the months it covers.',
        rate: 1.0,
        captions: ['During the transition year,', 'the bonus will cover 15 months,', 'while the percentage itself does not change', '- only the months it covers'],
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
      meritLabel: implementation.meritLabel,
      dividedBy: implementation.dividedBy,
      perMonth: implementation.perMonth,
      perMonthLabel: implementation.perMonthLabel,
      multipliedBy: implementation.multipliedBy,
      equivalent: implementation.equivalent,
    },
  },
  {
    id: 'leave',
    title: '6 - Leave balance',
    duration: 13.62,
    beats: {
      labelIn: 0.24,
      janCard: 0.8,
      // The arithmetic is read off the card, not said.
      row1: 2.56,
      row1Result: 3.3,
      row2: 3.9,
      row2Result: 4.6,
      arrow: 5.9,
      // On the word - see anchors.ts.
      aprCard: 7.15,
      basisIn: 10.72,
    },
    voice: [
      {
        id: 's6-l1',
        start: 0.4,
        text: 'For your leave balance, you will receive a three-month balance in January.',
        rate: 1.0,
        captions: ['For your LEAVE BALANCE,', 'you will receive a three-month', 'balance in JANUARY'],
      },
      {
        id: 's6-l2',
        start: 7.22,
        text: 'From April 2027, a new annual balance begins, based on the updated grades.',
        spoken: 'From April twenty twenty-seven, a new annual balance begins, based on the updated grades.',
        rate: 1.0,
        captions: ['From APRIL 2027, a new annual balance', 'begins, based on the updated grades'],
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
    title: '7 - Final message',
    duration: 5.15,
    beats: {
      questionsIn: 0.34,
      logoIn: 3.44,
      // On the word - see anchors.ts.
      contactIn: 1.59,
    },
    voice: [
      {
        id: 's7-l1',
        start: 0.45,
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
