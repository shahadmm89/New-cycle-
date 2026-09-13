/**
 * EMPLOYEE WELL-BEING PROGRAMME - MASTER TIMELINE
 * ------------------------------------------------
 * Everything the film is timed against lives here: the narration, the measured
 * length of every recorded phrase, the silence that follows it, and which
 * scene owns it.
 *
 * The film is built the other way round from a normal edit. The voice was
 * recorded first, phrase by phrase, and every phrase's REAL measured duration
 * is recorded below. Scene lengths are then derived from the narration rather
 * than chosen - so a visual can never run ahead of the voice, and no phrase is
 * ever cut off by a scene boundary.
 *
 * The brief asks for a read that is slightly slower than a normal corporate
 * announcement, with deliberate pauses. The words are NOT slowed down: the
 * narrator speaks at his own natural pace (~147 wpm) and the calm comes from
 * `pauseAfter` - the silence around the phrases. A quarter of the film's
 * running time is silence, which brings it to about 108 words per minute
 * overall.
 *
 * Five moments are asked to land harder than the rest. They are marked
 * `emphasis: true` below and are given the longest pauses in the film, so the
 * line has room to sit before the next one starts:
 *
 *   "We started by listening."
 *   "What we heard was clear."
 *   "...mental health and financial well-being."
 *   "Starting in Q4 2026,"
 *   "Because your well-being matters."
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Cross-fade between consecutive scenes. Long, because nothing here cuts. */
export const TRANSITION = 0.9;
/** Fade to black at the very end. */
export const OUTRO_FADE = 1.1;

/**
 * Silence before the first word. The opening image needs a moment to be a
 * place before anyone starts talking over it.
 */
export const LEAD_IN = 2.2;

export interface Phrase {
  id: string;
  /** The file in /assets/audio/wellbeing, without extension. */
  file: string;
  /** Exactly what is spoken. Also the subtitle source. */
  text: string;
  /**
   * Measured length of the rendered audio, in seconds, as reported by the
   * synthesiser. Not an estimate - if the narration is re-recorded these must
   * be re-measured (npm run wellbeing:measure).
   */
  duration: number;
  /** Silence after this phrase, before the next one starts. */
  pauseAfter: number;
  /** One of the five lines the brief asks to land harder. */
  emphasis?: boolean;
  /** Subtitle chunks. One line each, short enough to read at a glance. */
  captions: string[];
}

export interface WellbeingScene {
  id: string;
  title: string;
  /** Phrase ids this scene carries, in order. */
  phrases: string[];
}

/**
 * THE NARRATION.
 *
 * Long sentences are split into separate recorded phrases where the brief asks
 * for a pause inside them ("Starting in Q4 2026," / "we will begin turning
 * these recommendations into action."). Splitting at the recording stage, not
 * at playback, is what makes the pause sound intended rather than edited.
 */
export const phrases: Phrase[] = [
  // ---- SCENE 1 - OPENING ---------------------------------------------------
  {
    id: 'p01',
    file: 'p01',
    text: 'Every organization is made of people.',
    duration: 2.693514739229025,
    pauseAfter: 0.85,
    captions: ['Every organization is made of people.'],
  },
  {
    id: 'p02',
    file: 'p02',
    text: 'And when we take care of our people, we strengthen everything around them.',
    duration: 4.73687074829932,
    pauseAfter: 1.25,
    captions: ['And when we take care of our people,', 'we strengthen everything around them.'],
  },

  // ---- SCENE 2 - LISTENING -------------------------------------------------
  {
    id: 'p03',
    file: 'p03',
    text: "That's why we started by listening.",
    duration: 2.089795918367347,
    pauseAfter: 1.45,
    emphasis: true,
    captions: ["That's why we started by listening."],
  },
  {
    id: 'p04',
    file: 'p04',
    text: 'We began an employee well-being assessment, looking beyond numbers,',
    duration: 4.783310657596372,
    pauseAfter: 0.45,
    captions: ['We began an employee well-being assessment,', 'looking beyond numbers,'],
  },
  {
    id: 'p05',
    file: 'p05',
    text: 'and taking the time to understand the real experiences, needs, and challenges of our people.',
    duration: 6.2693877551020405,
    pauseAfter: 1.15,
    captions: ['and taking the time to understand the real', 'experiences, needs, and challenges of our people.'],
  },

  // ---- SCENE 3 - EVERYONE'S VOICE -----------------------------------------
  {
    id: 'p06',
    file: 'p06',
    text: 'We listened to employees across different professional groups, nationalities, genders, and areas of the business.',
    duration: 6.826666666666667,
    pauseAfter: 0.9,
    captions: [
      'We listened to employees across different',
      'professional groups, nationalities, genders,',
      'and areas of the business.',
    ],
  },
  {
    id: 'p07',
    file: 'p07',
    text: 'We also listened to our leaders.',
    duration: 2.2291156462585033,
    pauseAfter: 0.5,
    captions: ['We also listened to our leaders.'],
  },
  {
    id: 'p08',
    file: 'p08',
    text: 'To understand the challenges they see, and where we can make the greatest difference.',
    duration: 5.294149659863946,
    pauseAfter: 1.2,
    captions: ['To understand the challenges they see,', 'and where we can make the greatest difference.'],
  },

  // ---- SCENE 4 - WHAT WE HEARD --------------------------------------------
  {
    id: 'p09',
    file: 'p09',
    text: 'What we heard was clear.',
    duration: 1.8575963718820863,
    pauseAfter: 1.5,
    emphasis: true,
    captions: ['What we heard was clear.'],
  },
  {
    id: 'p10',
    file: 'p10',
    text: 'Our people need greater support for their mental health and financial well-being.',
    duration: 4.922630385487528,
    pauseAfter: 1.55,
    emphasis: true,
    captions: ['Our people need greater support for their', 'mental health and financial well-being.'],
  },
  {
    id: 'p11',
    file: 'p11',
    text: 'And we believe well-being is not a one-size-fits-all solution.',
    duration: 4.08671201814059,
    pauseAfter: 0.8,
    captions: ['And we believe well-being is not', 'a one-size-fits-all solution.'],
  },
  {
    id: 'p12',
    file: 'p12',
    text: "It's about creating the right support, for different people, in different situations.",
    duration: 5.294149659863946,
    pauseAfter: 1.2,
    captions: ["It's about creating the right support,", 'for different people, in different situations.'],
  },

  // ---- SCENE 5 - FROM INSIGHT TO ACTION -----------------------------------
  {
    id: 'p13',
    file: 'p13',
    text: 'Based on the assessment, we have developed recommendations focused on the areas that matter most.',
    duration: 5.433469387755102,
    pauseAfter: 1.0,
    captions: ['Based on the assessment, we have developed', 'recommendations focused on the areas that matter most.'],
  },
  {
    id: 'p14',
    file: 'p14',
    text: 'Starting in Q4 2026,',
    duration: 2.8328344671201813,
    pauseAfter: 1.4,
    emphasis: true,
    captions: ['Starting in Q4 2026,'],
  },
  {
    id: 'p15',
    file: 'p15',
    text: 'we will begin turning these recommendations into action.',
    duration: 3.5294331065759637,
    pauseAfter: 1.25,
    captions: ['we will begin turning these recommendations into action.'],
  },

  // ---- SCENE 6 - WHAT'S NEXT ----------------------------------------------
  {
    id: 'p16',
    file: 'p16',
    text: 'More details will be shared with you shortly,',
    duration: 2.647074829931973,
    pauseAfter: 0.5,
    captions: ['More details will be shared with you shortly,'],
  },
  {
    id: 'p17',
    file: 'p17',
    text: 'including our detailed action plan and the support available to our people.',
    duration: 4.876190476190477,
    pauseAfter: 1.25,
    captions: ['including our detailed action plan', 'and the support available to our people.'],
  },

  // ---- SCENE 7 - CLOSING ---------------------------------------------------
  {
    id: 'p18',
    file: 'p18',
    text: 'Because your well-being matters.',
    duration: 2.182675736961451,
    pauseAfter: 1.5,
    emphasis: true,
    captions: ['Because your well-being matters.'],
  },
  {
    id: 'p19',
    file: 'p19',
    text: "And taking care of our people isn't just a program.",
    duration: 3.01859410430839,
    pauseAfter: 0.75,
    captions: ["And taking care of our people isn't just a program."],
  },
  {
    id: 'p20',
    file: 'p20',
    text: "It's part of who we are.",
    duration: 1.7647165532879818,
    /**
     * The closing hold. Long, because three things have to happen after the
     * last word and none of them should be hurried: the line clears, the logo
     * arrives, and the logo sits alone before the film fades.
     */
    pauseAfter: 4.8,
    captions: ["It's part of who we are."],
  },
];

export const wellbeingScenes: WellbeingScene[] = [
  {id: 'opening', title: '1 - People first', phrases: ['p01', 'p02']},
  {id: 'listening', title: '2 - We started by listening', phrases: ['p03', 'p04', 'p05']},
  {id: 'voices', title: "3 - Everyone's voice", phrases: ['p06', 'p07', 'p08']},
  {id: 'heard', title: '4 - What we heard', phrases: ['p09', 'p10', 'p11', 'p12']},
  {id: 'action', title: '5 - From insight to action', phrases: ['p13', 'p14', 'p15']},
  {id: 'next', title: "6 - What's next", phrases: ['p16', 'p17']},
  {id: 'closing', title: '7 - Your well-being matters', phrases: ['p18', 'p19', 'p20']},
];

// ---------------------------------------------------------------------------
// Derived timing. Nothing below is authored by hand.
// ---------------------------------------------------------------------------

export interface PlacedPhrase extends Phrase {
  /** Absolute seconds from the start of the film to the first word. */
  start: number;
  /** Absolute seconds to the last word. */
  end: number;
  /** Absolute seconds to the end of the silence that follows. */
  endOfPause: number;
  /** Scene that owns this phrase. */
  sceneId: string;
}

const byId = new Map<string, Phrase>(phrases.map((p) => [p.id, p]));

const place = (): PlacedPhrase[] => {
  const placed: PlacedPhrase[] = [];
  let cursor = LEAD_IN;

  wellbeingScenes.forEach((scene) => {
    scene.phrases.forEach((id) => {
      const phrase = byId.get(id);
      if (!phrase) {
        throw new Error(
          `Scene "${scene.id}" lists phrase "${id}", which is not in the phrases array above.`,
        );
      }
      const start = cursor;
      const end = start + phrase.duration;
      const endOfPause = end + phrase.pauseAfter;
      placed.push({...phrase, start, end, endOfPause, sceneId: scene.id});
      cursor = endOfPause;
    });
  });

  const orphans = phrases.filter((p) => !placed.some((q) => q.id === p.id));
  if (orphans.length) {
    throw new Error(
      `These phrases are recorded but no scene carries them: ${orphans.map((p) => p.id).join(', ')}. ` +
        `Add them to a scene in wellbeingScenes, or delete them.`,
    );
  }
  return placed;
};

export const placedPhrases: PlacedPhrase[] = place();

const placedById = new Map<string, PlacedPhrase>(placedPhrases.map((p) => [p.id, p]));

/** Absolute timing for one phrase. Throws rather than silently mistiming. */
export const phraseAt = (id: string): PlacedPhrase => {
  const p = placedById.get(id);
  if (!p) throw new Error(`No phrase "${id}" in the timeline.`);
  return p;
};

/** Absolute second at which a phrase's first word is spoken. */
export const say = (id: string): number => phraseAt(id).start;

export interface PlacedScene extends WellbeingScene {
  start: number;
  duration: number;
  end: number;
  /** The phrases this scene carries, already placed. */
  lines: PlacedPhrase[];
}

export const placedScenes: PlacedScene[] = wellbeingScenes.map((scene, i) => {
  const lines = placedPhrases.filter((p) => p.sceneId === scene.id);
  // The first scene owns the lead-in silence; every other scene starts where
  // the previous one's last pause ended, so the cut always lands in silence.
  const start = i === 0 ? 0 : lines[0].start;
  const end = lines[lines.length - 1].endOfPause;
  return {...scene, lines, start, duration: end - start, end};
});

export const totalDuration = placedScenes[placedScenes.length - 1].end;
export const totalFrames = Math.round(totalDuration * FPS);

/** Seconds from the start of the named scene to an absolute time. */
export const sceneStart = (id: string): number => {
  const s = placedScenes.find((x) => x.id === id);
  if (!s) throw new Error(`No scene "${id}".`);
  return s.start;
};

/**
 * A phrase's start, expressed relative to the scene that carries it - which is
 * what a scene component needs, because it is rendered inside its own Sequence.
 */
export const sayIn = (sceneId: string, phraseId: string): number =>
  say(phraseId) - sceneStart(sceneId);

/** Total words spoken, for the pacing note in the README. */
export const wordCount = phrases.reduce((n, p) => n + p.text.trim().split(/\s+/).length, 0);
/** Spoken seconds, excluding every pause. */
export const spokenDuration = phrases.reduce((n, p) => n + p.duration, 0);
