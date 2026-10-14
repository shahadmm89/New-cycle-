import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * On-screen text is Arabic only, set in IBM Plex Sans Arabic (SIL OFL, licence
 * in public/fonts). Each weight ships as an Arabic and a Latin subset, joined
 * under one family by unicode-range. Inter is used only for the animatic slate.
 * Rendering waits until every face is loaded, so no frame uses a fallback.
 */
const ARABIC = 'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC';
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

let started = false;

export const loadFonts = (): void => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Loading fonts');
  const faces: FontFace[] = [
    new FontFace('Inter', `url(${staticFile('fonts/Inter-Variable.woff2')}) format('woff2')`, {weight: '100 900', display: 'block'}),
  ];
  for (const w of [200, 300, 400, 500]) {
    for (const [subset, range] of [['arabic', ARABIC], ['latin', LATIN]] as const) {
      faces.push(
        new FontFace('Plex Arabic', `url(${staticFile(`fonts/ibm-plex-sans-arabic-${subset}-${w}-normal.woff2`)}) format('woff2')`, {
          weight: String(w),
          unicodeRange: range,
          display: 'block',
        }),
      );
    }
  }
  Promise.all(faces.map((f) => f.load().then((ff) => document.fonts.add(ff))))
    .then(() => document.fonts.ready)
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
};

/** Every word the audience reads. */
export const FONT = "'Plex Arabic', Tahoma, sans-serif";
/** Production slate and placeholder cards only (never in the release film). */
export const UI_FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";
