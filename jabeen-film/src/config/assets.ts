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
  | {
      kind: 'image';
      src: string;
      /** 'contain' shows the whole image (e.g. a portrait site plan) on `bg`. Default 'cover'. */
      fit?: 'cover' | 'contain';
      bg?: string;
    };

/*
 * Animatic stand-ins from the Sumou Communities brochure (pages 29-37,
 * supplied 15 Oct 2026). The pages are 1080 px wide, so each 16:9 crop is
 * upscaled about 2x and looks soft at 1080p. Replace with the original
 * full-resolution renders before release. Crops avoid the brochure's text
 * panels and logos - see render/brochure-crops.py.
 */
const B = 'project/brochure/crops/';
const PAPER = '#ecebe8';

export const ASSETS: Record<string, Asset> = {
  '1C': {kind: 'image', src: B + 'aziziyah-map.jpg'}, // location map: stand-in until the Earth Studio descent
  '2A': {kind: 'image', src: B + 'aziziyah-aerial.jpg'},
  '3A': {kind: 'image', src: B + 'nakheel-aerial.jpg'},
  '3B': {kind: 'image', src: B + 'street.jpg'},
  '3C': {kind: 'image', src: B + 'aziziyah-cluster.jpg'},
  '4A@A': {kind: 'image', src: B + 'facade-left.jpg'},
  '4B@A': {kind: 'image', src: B + 'facade-gate.jpg'},
  '5A@A': {kind: 'image', src: B + 'living.jpg'},
  '5B@A': {kind: 'image', src: B + 'dining.jpg'},
  '5D@A': {kind: 'image', src: B + 'bedroom.jpg'},
  '7A': {kind: 'image', src: B + 'aziziyah-siteplan.jpg', fit: 'contain', bg: PAPER},
  '7C': {kind: 'image', src: B + 'nakheel-siteplan.jpg', fit: 'contain', bg: PAPER},
  '8A': {kind: 'image', src: B + 'aziziyah-aerial.jpg'},
};
