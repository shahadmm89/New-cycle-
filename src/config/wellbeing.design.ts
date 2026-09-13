/**
 * EMPLOYEE WELL-BEING PROGRAMME - LOOK AND COPY
 * ----------------------------------------------
 * The film deliberately shares the company's existing video identity - the
 * same deep navy stage, the same two typefaces, the same amber accent - so it
 * reads as the same company speaking, not as a different campaign.
 *
 * What changes is the pace and the weight. Where the salary-cycle film was
 * signage (fast, dense, mechanical), this one is a message: fewer words on
 * screen, much more space around them, and motion slow enough that nothing
 * ever feels like it is selling.
 */
import {colors as base} from './branding';

export const wb = {
  /** Inherited, unchanged, from the company palette. */
  bg: base.background,
  bgDeep: base.backgroundDeep,
  text: base.text,
  textSoft: base.textSoft,
  line: base.line,

  /** The warm accent. Reserved for the two pillars' heading and for Q4 2026. */
  accent: base.accent,
  accentDeep: base.accentDeep,

  /** The second pillar's colour. Already in the palette as the "steady" green. */
  steady: base.steady,

  /** Structural blue, for rules and quiet labels. */
  primary: base.primary,
  primaryDim: base.primaryDim,
} as const;

/**
 * PHOTOGRAPHY
 *
 * Real, candid workplace photographs carry the human weight of this film; the
 * graphics only carry the structure. Each slot below is a moment in the film
 * that wants a face rather than a diagram.
 *
 * `src` is a path inside /assets. Set a slot to null and the scene falls back
 * to its typographic treatment on the clean navy stage - the film still reads
 * correctly, it is simply quieter. That is what makes this list safe to extend:
 * drop more photographs into assets/stills, point the slots at them, re-render.
 *
 * `focus` is the point the slow push-in moves toward, as a fraction of the
 * frame, so the movement always ends on a person rather than on scenery.
 */
export interface Still {
  src: string;
  /** Horizontal focal point, 0 (left) to 1 (right). */
  focusX: number;
  /** Vertical focal point, 0 (top) to 1 (bottom). */
  focusY: number;
  /** What it shows - documentation only, never rendered. */
  note: string;
}

export const stills = {
  /** Scene 1: an office employee starting the day. */
  openingOffice: {
    src: 'stills/s01-office-arrival.png',
    focusX: 0.62,
    focusY: 0.42,
    note: 'Woman arriving at her desk in the morning, colleague passing behind.',
  },
  /** Scene 1 and 6: the same morning, a different working environment. */
  openingPlant: {
    src: 'stills/s02-plant-walkway.png',
    focusX: 0.44,
    focusY: 0.48,
    note: 'Two technicians in hard hats and hi-vis walking a plant walkway.',
  },
  /** Scenes 2 and 7: the listening moment, and the closing warmth. */
  listening: {
    src: 'stills/s03-one-to-one.png',
    focusX: 0.5,
    focusY: 0.44,
    note: 'Two colleagues in a genuine one-to-one conversation, real listening.',
  },
} satisfies Record<string, Still>;

/**
 * ON-SCREEN COPY.
 *
 * Deliberately sparse. The brief asks for enough screen time to read every
 * word comfortably, which is far easier to honour when there are few of them.
 *
 * Nothing here promises a benefit or names a recommendation - those are for
 * the detailed action plan, not for this film.
 */
export const copy = {
  opening: {
    statement: 'PEOPLE FIRST.',
  },
  listening: {
    statement: 'We started by listening.',
    programme: 'EMPLOYEE WELL-BEING ASSESSMENT',
    supporting: 'Beyond the numbers — real experiences, needs and challenges',
  },
  voices: {
    eyebrow: 'WE LISTENED TO',
    groups: ['PROFESSIONAL GROUPS', 'NATIONALITIES', 'GENDERS', 'AREAS OF THE BUSINESS'],
    leaders: 'AND OUR LEADERS',
    leadersSupporting: 'The challenges they see, and where we can make the greatest difference',
  },
  heard: {
    statement: 'What we heard was clear.',
    pillarOne: {label: 'PRIORITY AREA 01', title: 'MENTAL', title2: 'WELL-BEING'},
    pillarTwo: {label: 'PRIORITY AREA 02', title: 'FINANCIAL', title2: 'WELL-BEING'},
    notOneSize: 'WELL-BEING IS NOT ONE-SIZE-FITS-ALL',
    supporting: 'The right support, for different people, in different situations',
  },
  action: {
    eyebrow: 'FROM INSIGHT TO ACTION',
    steps: ['LISTEN', 'UNDERSTAND', 'ACT'],
    date: 'Q4 2026',
    dateLabel: 'IMPLEMENTATION BEGINS',
  },
  next: {
    statement: 'MORE DETAILS SHORTLY',
    items: ['OUR DETAILED ACTION PLAN', 'THE SUPPORT AVAILABLE TO OUR PEOPLE'],
  },
  closing: {
    /**
     * Broken by hand. Left to wrap on its own this line splits as
     * "YOUR WELL-" / "BEING MATTERS.", which tears the hyphenated word in half.
     */
    statement: ['YOUR WELL-BEING', 'MATTERS.'],
    signOff: "Taking care of our people isn't just a program.",
    signOffTwo: "It's part of who we are.",
  },
} as const;

/**
 * How hard the navy grade sits on a photograph.
 *
 * The photographs are real and warm; the stage is deep navy. Left alone they
 * fight. These values pull every image toward the brand without draining the
 * life out of a face - the faces stay warm, the edges go navy.
 */
export const grade = {
  /**
   * Slight desaturation and a lift of contrast, as a CSS filter.
   *
   * Brightness is deliberately close to 1. An earlier pass sat at 0.86, which
   * tied the images to the stage beautifully and buried every face in shadow -
   * exactly the wrong trade for a film whose entire subject is the people in
   * the frame. The navy now comes from the tint and the vignette instead, and
   * the faces keep their light.
   */
  filter: 'saturate(0.88) contrast(1.04) brightness(0.97)',
  /** Navy laid over the image to tie it to the stage. */
  tint: 'rgba(8, 22, 48, 0.20)',
  /** Darkening at the bottom, where type sits. */
  scrimFrom: 'rgba(4, 11, 26, 0.04)',
  scrimTo: 'rgba(4, 11, 26, 0.90)',
  /** Corner darkening, so the eye stays centre-frame. */
  vignette: 'rgba(3, 9, 19, 0.50)',
} as const;
