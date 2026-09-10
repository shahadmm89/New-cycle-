import {colors, fonts, sketch, brand} from '../config/branding';

export {colors, fonts, sketch, brand};

/** Layout constants for the 1920x1080 canvas. */
export const stage = {
  width: 1920,
  height: 1080,
  /** Safe area padding - nothing important should sit outside this. */
  padX: 130,
  padTop: 96,
  /** Everything above this line stays clear of the caption bar. */
  captionSafeY: 900,
} as const;
