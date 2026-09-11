import {colors, fonts, depth, brand} from '../config/branding';

export {colors, fonts, depth, brand};

/** Layout constants for the 1920x1080 stage. */
export const stage = {
  width: 1920,
  height: 1080,
  /** Nothing important sits outside this margin. */
  pad: 120,
  /** Content must stay above this line so captions never cover a graphic. */
  captionSafeY: 900,
} as const;

/**
 * Type scale, tuned for a screen several metres away.
 * Nothing in this film is smaller than `label`.
 */
export const type = {
  hero: 190,
  display: 132,
  title: 84,
  headline: 64,
  subhead: 46,
  body: 34,
  label: 28,
} as const;
