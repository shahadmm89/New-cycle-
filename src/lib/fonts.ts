/**
 * Loads the two project typefaces from /assets/fonts and blocks rendering until
 * they are ready, so no frame is ever rendered with a fallback font.
 *
 * To swap a typeface: drop the .woff2 into assets/fonts, update the entries
 * below and the `fonts` block in src/config/branding.ts.
 */
import {continueRender, delayRender, staticFile} from 'remotion';

const FACES = [
  {family: 'Inter', file: 'fonts/Inter-Variable.woff2', weight: '100 900'},
  {family: 'Manrope', file: 'fonts/Manrope-Variable.woff2', weight: '400 800'},
];

let started = false;

export const loadProjectFonts = (): void => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading project fonts');
  Promise.all(
    FACES.map(async (face) => {
      const ff = new FontFace(face.family, `url(${staticFile(face.file)}) format('woff2')`, {
        weight: face.weight,
        display: 'block',
      });
      await ff.load();
      document.fonts.add(ff);
    }),
  )
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch((err) => {
      // Never hard-fail a render because of a font; fall back to the CSS stack.
      // eslint-disable-next-line no-console
      console.warn('Font loading failed, using fallbacks:', err);
      continueRender(handle);
    });
};
