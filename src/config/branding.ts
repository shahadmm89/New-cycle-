/**
 * BRANDING CONFIGURATION
 * ----------------------
 * Everything visual that a company would want to swap lives here.
 * Replace the hex values with your corporate palette and the placeholder
 * strings with your real HR details - nothing else needs to change.
 *
 * The palette is deliberately disciplined: a deep navy stage, white type,
 * one soft blue for structure, and ONE energetic accent that is reserved for
 * the new cycle and the key dates. Restraint is what makes it read as premium
 * on a large screen.
 *
 * See docs/BRANDING.md
 */

export const colors = {
  /** Deep navy stage. Everything is drawn on this. */
  background: '#061024',
  /** Darker navy for vignette edges and depth. */
  backgroundDeep: '#030913',
  /** Raised card surfaces. */
  surface: '#0E2044',
  /** The lit top edge / highlight of a raised surface. */
  surfaceLit: '#1B3A72',

  /** Structural soft blue. Rails, frames, secondary labels. */
  primary: '#5B8DEF',
  primaryDim: '#2C4C86',

  /**
   * THE energetic accent. Reserved for the NEW cycle, April, March, and the
   * key dates. Used sparingly so it always means "this is the change".
   */
  accent: '#FFC24B',
  accentDeep: '#E8A01F',
  accentGlow: 'rgba(255, 194, 75, 0.30)',

  /** Affirmation only - the "NO CHANGE" tick. Nothing else. */
  steady: '#3DDC97',

  /** The OLD cycle. Present, legible, but deliberately quieter. */
  muted: '#5E77A3',
  mutedDim: '#33486C',

  text: '#FFFFFF',
  textSoft: '#A9BEDE',
  line: '#1A3160',

  captionBg: 'rgba(3, 9, 19, 0.82)',
  captionText: '#FFFFFF',
} as const;

export const fonts = {
  /** Big display type: months, dates, headlines. */
  display: "'Manrope', 'Inter', 'Segoe UI', system-ui, sans-serif",
  /** Everything else. */
  body: "'Inter', 'Segoe UI', system-ui, sans-serif",
} as const;

/**
 * Depth. The video uses subtle, consistent 3D: a shared light source from the
 * top-left, one perspective distance, and two shadow strengths.
 */
export const depth = {
  /** CSS perspective used by every 3D transform, so they share a vanishing point. */
  perspective: 2000,
  shadowSoft: '0 18px 50px rgba(0, 0, 0, 0.45)',
  shadowStrong: '0 30px 90px rgba(0, 0, 0, 0.60)',
  /** Accent glow behind hero elements. */
  glow: '0 0 90px rgba(255, 194, 75, 0.22)',
} as const;

/**
 * Placeholders that HR replaces before publishing.
 * `logoSrc` accepts a path inside /assets (e.g. 'logo/acme.svg') or null to
 * keep the [COMPANY LOGO] placeholder visible.
 */
export const brand = {
  companyName: '[COMPANY NAME]',
  logoSrc: null as string | null,
  logoPlaceholderLabel: '[COMPANY LOGO]',
  hrContact: '[HR CONTACT]',
  hrPortal: '[HR PORTAL]',
} as const;

export type Colors = typeof colors;
