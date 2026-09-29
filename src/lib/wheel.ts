/**
 * THE ANNUAL CYCLE WHEEL - shared geometry.
 *
 * The wheel is the film's recurring visual: twelve month segments around an
 * ANNUAL SALARY PROGRAM hub. Several scenes point AT it (an arrow from the
 * MARCH segment to its label, for example), so where it sits and how it is
 * turned has to be known outside the component that draws it. That is this
 * file: one place for the layout, one function for "where is month X".
 *
 * Angles are degrees clockwise from twelve o'clock. `rotation` is in months:
 * 0 puts JANUARY at the top, 3 puts APRIL there.
 */

/** Ring geometry at scale 1, in px. */
export const WHEEL = {
  /** Outer edge of the month segments. */
  R: 300,
  /** Inner edge of the month segments - the hub sits inside this. */
  r: 182,
  /** The progress tracks used for the 12 / 15-month sweep sit outside the ring. */
  track1: 322,
  track2: 346,
  /** Degrees of empty space between neighbouring segments. */
  gapDeg: 1.6,
} as const;

/** Where the wheel sits in each layout, as a frame-space centre and a scale. */
export const WHEEL_AT = {
  /** Scenes 2-4 and 8: the wheel is the subject, on the right. */
  hero: {cx: 1300, cy: 486, scale: 1},
  /** Scenes 5-7: the timeline is the subject; the wheel keeps its place, small. */
  corner: {cx: 1628, cy: 236, scale: 0.4},
} as const;

export type WheelPlace = {cx: number; cy: number; scale: number};

export const lerpPlace = (a: WheelPlace, b: WheelPlace, t: number): WheelPlace => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  scale: a.scale + (b.scale - a.scale) * t,
});

/** Month index (0 = JAN) -> the angle of its segment's centre. */
export const monthAngle = (index: number, rotation: number) => (index - rotation) * 30;

/** A point at `radius` from the centre, on the centre line of month `index`, in frame space. */
export const monthPoint = (place: WheelPlace, index: number, rotation: number, radius: number) => {
  const a = (monthAngle(index, rotation) * Math.PI) / 180;
  return {
    x: place.cx + Math.sin(a) * radius * place.scale,
    y: place.cy - Math.cos(a) * radius * place.scale,
  };
};
