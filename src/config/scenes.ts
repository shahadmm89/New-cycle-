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
import {cycle, monthsCalendar, monthsSalaryYear} from './copy';

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
    title: '1 - Opening',
    duration: 12.3,
    beats: {
      ringIn: 0,
      monthsSweep: 0.04,
      headlineIn: 0.24,
      pushIn: 2.14,
      // A title slide first: everything is up before the narrator starts.
      highlightPhrase: 0.25,
      postIn: 0.9,
      subIn: 1.4,
    },
    voice: [
      {
        id: 's1-l1',
        start: 2.3,
        text: 'YASREF will change the salary merit and promotion effectiveness update from January to April, changing only the timing in alignment with market best practices.',
        // Pronunciation only: said as a name, not spelled out.
        spoken: 'Yasref will change the salary merit and promotion effectiveness update from January to April, changing only the timing in alignment with market best practices.',
        rate: 1.0,
        captions: ['YASREF will change the salary merit and', 'promotion effectiveness update', 'from JANUARY to APRIL,', 'changing only the timing', 'in alignment with market best practices.'],
      },
    ],
    text: {
      headlinePre: '',
      headlineKey: 'SALARY MERIT & PROMOTION\nEFFECTIVENESS UPDATE',
      headlinePost: 'January → April',
      sub: 'Aligned with market best practices',
    },
  },
  {
    id: 'cycle',
    title: '2 - The cycle shifts',
    duration: 6.2,
    beats: {
      wheelIn: 0.05,
      janLit: 0.5,
      oldRangeIn: 0.6,
      spin: 2.4,
      newRangeIn: 4.3,
      aprLit: 4.2,
    },
    voice: [
      {
        id: 's2-l1',
        start: 0.4,
        text: "Here's the new proposed cycle.",
        rate: 1.0,
        captions: ["Here's the new proposed cycle."],
      },
    ],
    text: {
      oldLabel: 'CURRENT CYCLE',
      oldFrom: cycle.oldCycleFromLong,
      oldTo: cycle.oldCycleToLong,
      newLabel: 'NEW PROPOSED CYCLE',
      newFrom: cycle.newCycleFromLong,
      newTo: cycle.newCycleToLong,
    },
  },
  {
    id: 'march',
    title: '3 - March: bonus',
    duration: 4.2,
    beats: {marLit: 0.3, pointer: 0.5, monthIn: 1.1, bonusIn: 1.8},
    voice: [
      {
        id: 's3-l1',
        start: 0.35,
        text: 'The bonus will be paid in March.',
        rate: 1.0,
        captions: ['The bonus will be paid in MARCH.'],
      },
    ],
    text: {label: 'NEW PROPOSED CYCLE', month: 'MARCH', what: 'BONUS PAID'},
  },
  {
    id: 'april',
    title: '4 - April: merit and promotion',
    duration: 5.9,
    beats: {marStep: 0.1, aprLit: 0.45, pointer: 0.6, monthIn: 0.9, meritIn: 1.7, promotionIn: 2.9},
    voice: [
      {
        id: 's4-l1',
        start: 0.35,
        text: 'In April, merit increases and promotion action will be reflected.',
        rate: 1.0,
        captions: ['In APRIL, merit increases and', 'promotion action will be reflected.'],
      },
    ],
    text: {
      label: 'NEW PROPOSED CYCLE',
      month: 'APRIL',
      merit: 'MERIT INCREASES',
      promotion: 'PROMOTION ACTION',
    },
  },
  {
    id: 'transition',
    title: '5 - The 2027 implementation year',
    duration: 7.2,
    beats: {wheelAway: 0, titleIn: 0.5, railIn: 1.1, bandIn: 1.2, aprilIn: 3.6},
    voice: [
      {
        id: 's5-l1',
        start: 0.4,
        text: 'During the transition year, this transition applies to the 2027 implementation year only.',
        spoken: 'During the transition year, this transition applies to the twenty twenty-seven implementation year only.',
        rate: 1.0,
        captions: ['During the transition year,', 'this transition applies to the', '2027 IMPLEMENTATION YEAR only.'],
      },
    ],
    text: {title: '2027 IMPLEMENTATION YEAR', band: 'TRANSITION'},
  },
  {
    id: 'leave',
    title: '6 - Leave balance',
    duration: 12.4,
    beats: {titleIn: 0.2, janFocus: 3.0, janCallout: 3.2, travel: 6.2, aprCallout: 6.6, basisIn: 9.6},
    voice: [
      {
        id: 's6-l1',
        start: 0.4,
        text: 'For leave balance, you will receive a three-month balance in January.',
        rate: 1.0,
        captions: ['For leave balance, you will receive', 'a three-month balance in JANUARY.'],
      },
      {
        id: 's6-l2',
        start: 6.0,
        text: 'And from April 2027, a new annual balance begins, based on the updated grades.',
        spoken: 'And from April twenty twenty-seven, a new annual balance begins, based on the updated grades.',
        rate: 1.0,
        captions: ['And from APRIL 2027,', 'a new annual balance begins,', 'based on the updated grades.'],
      },
    ],
    text: {
      eyebrow: '2027 IMPLEMENTATION YEAR',
      title: 'LEAVE BALANCE',
      janWhen: 'JANUARY',
      janWhat: '3-MONTH LEAVE BALANCE',
      aprWhat: 'NEW ANNUAL LEAVE BALANCE',
      aprBasis: 'Based on the updated grades',
    },
  },
  {
    id: 'allowance',
    title: '7 - Vacation allowance',
    duration: 10.8,
    beats: {titleIn: 0.2, bandFocus: 3.6, bandCallout: 3.8, travel: 6.6, aprCallout: 7.0},
    voice: [
      {
        id: 's7-l1',
        start: 0.4,
        // Exactly as supplied. The wording is under separate review.
        text: 'And the same will applied on the vacation allawance whete the basic salary paid for 3 months and from April will reflect the new basic salary.',
        rate: 1.0,
        captions: ['And the same will applied on the', 'vacation allawance whete the basic salary', 'paid for 3 months and from April', 'will reflect the new basic salary.'],
      },
    ],
    text: {
      eyebrow: '2027 IMPLEMENTATION YEAR',
      title: 'VACATION ALLOWANCE',
      bandWhen: 'JANUARY – MARCH',
      bandWhat: 'Current basic salary',
      aprWhen: 'APRIL 2027',
      aprWhat: 'New basic salary reflected',
    },
  },
  {
    id: 'merit',
    title: '8 - Merit: 15 months',
    duration: 9.0,
    beats: {wheelBack: 0, labelIn: 0.6, sweep12: 1.1, sweep3: 2.9, fifteenIn: 3.9, noteIn: 4.9},
    voice: [
      {
        id: 's8-l1',
        start: 0.4,
        text: 'Comes to the merit, it will cover 15 months, while the percentage itself does not change — only the months.',
        spoken: 'Comes to the merit, it will cover fifteen months, while the percentage itself does not change, only the months.',
        rate: 1.0,
        captions: ['Comes to the merit, it will cover 15 months,', 'while the percentage itself does not change', '— only the months.'],
      },
    ],
    text: {
      label: 'MERIT',
      fifteen: '15 MONTHS',
      note: 'The percentage itself does not change — only the months.',
    },
  },
  {
    id: 'close',
    title: '9 - Final message',
    duration: 5.3,
    beats: {questionsIn: 0.3, contactIn: 1.6, logoIn: 3.2},
    voice: [
      {
        id: 's9-l1',
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
