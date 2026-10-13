/**
 * Footage and render slots. One entry per shot in storyboard.json.
 *
 * Slot id = shot id, plus "@<villa id>" for the per-villa scenes (S4-S6):
 *   "2A"        -> aerial reveal of the site
 *   "4A@A"      -> wide exterior of villa type A
 *   "6B-top@A"  -> overhead cutaway render of villa type A, camera-matched to its plan
 *
 * Put the file under public/project/ and add it here. Anything not listed
 * renders as a labelled placeholder in the animatic.
 *
 * Video: ProRes/H.264, 1920x1080 or larger, 24 fps, at least the shot length
 * plus its transition (see `npm run check:assets` for exact lengths).
 * Stills: >= 3840 px wide so the camera move has headroom.
 */
export type Asset =
  | {kind: 'video'; src: string; /** seconds into the clip to start */ trimStart?: number}
  | {kind: 'image'; src: string};

export const ASSETS: Record<string, Asset> = {
  // '1A': {kind: 'video', src: 'project/earth/1A-orbit.mp4'},
  // '2A': {kind: 'video', src: 'project/aerial/2A-site-reveal.mp4'},
  // '4A@A': {kind: 'image', src: 'project/villa-a/exterior-wide.jpg'},
  // '6B-top@A': {kind: 'image', src: 'project/villa-a/topdown-cutaway.png'},
};
