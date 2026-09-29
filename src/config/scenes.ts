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
    duration: 16.1,
    beats: {
      ringIn: 0,
      monthsSweep: 0,
      headlineIn: 0.19,
      pushIn: 2.09,
      // A title slide first: everything is up before the narrator starts.
      highlightPhrase: 0.2,
      postIn: 0.85,
      subIn: 1.35,
    },
    voice: [
      // The approved sentence, word for word, said as four phrases with a
      // pause between each. rate 1.08 is a touch slower than the rest of the
      // film - the opening sets the pace.
      {
        id: 's1-l1',
        start: 2.25,
        text: 'The company will change the salary merit and promotion effectiveness update',
        rate: 1.08,
        captions: ['The company will change the salary merit', 'and promotion effectiveness update'],
      },
      {
        id: 's1-l2',
        start: 7.33,
        text: 'from January to April,',
        rate: 1.08,
        captions: ['from JANUARY to APRIL,'],
      },
      {
        id: 's1-l3',
        start: 9.8,
        text: 'changing only the timing',
        rate: 1.08,
        captions: ['changing only the timing'],
      },
      {
        id: 's1-l4',
        start: 12.41,
        text: 'in alignment with market best practices.',
        rate: 1.08,
        captions: ['in alignment with market best practices.'],
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
    duration: 9.26,
    beats: {
      wheelIn: 0,
      janLit: 0.45,
      oldRangeIn: 0.72,
      // The wheel holds on JANUARY - DECEMBER for a beat after it is said,
      // then turns; "Here is the new cycle" lands with APRIL.
      spin: 4.2,
      newRangeIn: 6.1,
      aprLit: 6.0,
    },
    voice: [
      {
        id: 's2-l1',
        start: 0.35,
        text: 'The current cycle runs from January to December.',
        rate: 1.0,
        captions: ['The current cycle runs', 'from JANUARY to DECEMBER.'],
      },
      {
        id: 's2-l2',
        start: 6,
        text: 'Here is the new cycle.',
        rate: 1.0,
        captions: ['Here is the new cycle.'],
      },
    ],
    text: {
      oldLabel: 'CURRENT CYCLE',
      oldFrom: cycle.oldCycleFromLong,
      oldTo: cycle.oldCycleToLong,
      newLabel: 'NEW CYCLE',
      newFrom: cycle.newCycleFromLong,
      newTo: cycle.newCycleToLong,
    },
  },
  {
    id: 'march',
    title: '3 - March: bonus',
    duration: 3.72,
    beats: {marLit: 0.25, monthIn: 0.02, bonusIn: 1.17},
    voice: [
      {
        id: 's3-l1',
        start: 0.3,
        text: 'The bonus will be paid in March.',
        rate: 1.0,
        captions: ['The bonus will be paid in MARCH.'],
      },
    ],
    text: {label: 'NEW CYCLE', month: 'MARCH', what: 'BONUS PAID'},
  },
  {
    id: 'april',
    title: '4 - April: merit and promotion',
    duration: 5.4,
    beats: {marStep: 0.04, aprLit: 0.12, monthIn: 0.27, meritIn: 0.73, promotionIn: 1.95},
    voice: [
      {
        id: 's4-l1',
        start: 0.29,
        text: 'In April, merit increases and promotion action will be reflected.',
        rate: 1.0,
        captions: ['In APRIL, merit increases and', 'promotion action will be reflected.'],
      },
    ],
    text: {
      label: 'NEW CYCLE',
      month: 'APRIL',
      merit: 'MERIT INCREASES',
      promotion: 'PROMOTION ACTION',
    },
  },
  {
    id: 'transition',
    title: '5 - The 2027 implementation year',
    duration: 7.19,
    beats: {wheelAway: 0, titleIn: 0.45, railIn: 0.3, bandIn: 1.95, aprilIn: 3.03},
    voice: [
      {
        id: 's5-l1',
        start: 0.35,
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
    duration: 12.17,
    beats: {titleIn: 0.15, janFocus: 2.16, janCallout: 2.36, travel: 4.21, aprCallout: 4.91, basisIn: 8.39, exampleIn: 3.16},
    voice: [
      {
        id: 's6-l1',
        start: 0.35,
        text: 'For leave balance, you will receive a three-month balance in January.',
        rate: 1.0,
        captions: ['For leave balance, you will receive', 'a three-month balance in JANUARY.'],
      },
      {
        id: 's6-l2',
        start: 4.73,
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
    duration: 10.73,
    beats: {titleIn: 1.36, bandFocus: 2.23, bandCallout: 2.43, travel: 4.77, aprCallout: 5.47, exampleIn: 4.58},
    voice: [
      {
        id: 's7-l1',
        start: 0.35,
        // As supplied, with two spellings corrected so the voice reads them from
        // its dictionary ("allawance" -> allowance, "whete" -> where). The
        // commas in `spoken` only set the rhythm, so "vacation allowance" is
        // said lightly, as part of the sentence, not pressed.
        text: 'And the same will applied on the vacation allowance where the basic salary paid for 3 months and from April will reflect the new basic salary.',
        spoken: 'And the same will applied on the vacation allowance, where the basic salary paid for three months, and from April will reflect the new basic salary.',
        rate: 1.0,
        captions: ['And the same will applied on the', 'vacation allowance where the basic salary', 'paid for 3 months and from April', 'will reflect the new basic salary.'],
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
    duration: 9.1,
    beats: {wheelBack: 0, labelIn: 0.51, sweep12: 0.5, sweep3: 1.7, fifteenIn: 2.4, noteIn: 4.68, exampleIn: 3.59},
    voice: [
      {
        id: 's8-l1',
        start: 0.34,
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
    duration: 5.2,
    beats: {questionsIn: 0.25, contactIn: 1.54},
    voice: [
      {
        id: 's9-l1',
        start: 0.4,
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
