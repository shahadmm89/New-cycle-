import {continueRender, delayRender, staticFile} from 'remotion';

let started = false;

/** Blocks rendering until the typeface is loaded, so no frame uses a fallback. */
export const loadFonts = (): void => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading fonts');
  const face = new FontFace('Inter', `url(${staticFile('fonts/Inter-Variable.woff2')}) format('woff2')`, {
    weight: '100 900',
    display: 'block',
  });
  face
    .load()
    .then((ff) => document.fonts.add(ff))
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};

export const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";
