/**
 * BRANDING CONFIGURATION
 * ----------------------
 * Everything visual that a company would want to swap lives here.
 * Replace the hex values with your corporate palette and the placeholder
 * strings with your real HR details - nothing else in the project needs to change.
 *
 * See docs/BRANDING.md for a step-by-step guide.
 */

export const colors = {
  /** Main brand colour. Used for headings, key strokes, primary highlights. */
  primary: '#2F5FE0',
  /** Supporting colour. Used for secondary shapes, the "new" side of comparisons. */
  secondary: '#12B5A5',
  /** Attention colour. Used sparingly to spotlight the three key dates. */
  accent: '#F5A524',
  /** Positive confirmation colour. Checkmarks, "no change" badges. */
  success: '#1F9D63',
  /** Page background ("paper"). */
  background: '#FBFAF6',
  /** Cards / panels drawn on top of the background. */
  surface: '#FFFFFF',
  /** Primary text + the "pen" colour used for hand-drawn strokes. */
  text: '#1F2933',
  /** De-emphasised text: captions of labels, secondary annotation. */
  textSoft: '#5C6B7A',
  /** Very light lines: the notebook grid, dividers, inactive months. */
  line: '#DFE3E8',
  /** Neutral used for the "current state" side. Deliberately calm, not negative. */
  neutral: '#8C9AA8',
  /** Caption bar background (semi-transparent over the video). */
  captionBg: 'rgba(31, 41, 51, 0.88)',
  /** Caption text. */
  captionText: '#FFFFFF',
} as const;

export const fonts = {
  /** Clean, friendly UI/body typeface. */
  body: "'Nunito', 'Trebuchet MS', system-ui, sans-serif",
  /** Handwritten typeface for annotations and sketch labels. */
  hand: "'Caveat', 'Comic Sans MS', cursive",
} as const;

/**
 * Placeholders that HR replaces before publishing.
 * `logoSrc` accepts a path inside /assets (e.g. 'logo/acme.svg') or a data URI.
 * Leave it null to keep showing the [COMPANY LOGO] placeholder box.
 */
export const brand = {
  companyName: '[COMPANY NAME]',
  logoSrc: null as string | null,
  logoPlaceholderLabel: '[COMPANY LOGO]',
  hrContactName: '[HR CONTACT]',
  hrEmail: '[HR EMAIL]',
  hrPortal: '[HR PORTAL]',
} as const;

/**
 * Hand-drawn look. Increase `roughness` for a scruffier sketch,
 * decrease towards 0 for clean vector lines.
 */
export const sketch = {
  roughness: 1.05,
  bowing: 1.2,
  strokeWidth: 3,
  /** Global seed - change it to reshuffle every hand-drawn wobble in the video. */
  seed: 20260401,
} as const;

export type Colors = typeof colors;
