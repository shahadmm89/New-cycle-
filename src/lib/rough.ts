/**
 * Deterministic hand-drawn geometry.
 *
 * Wraps roughjs' generator so we can produce SVG path data on the server and in
 * the browser without a canvas. Every helper takes an explicit `seed` so the
 * wobble is identical on every frame - otherwise the sketch would boil.
 */
import rough from 'roughjs';
import type {Options} from 'roughjs/bin/core';
import {sketch} from '../config/branding';

const generator = rough.generator();

const baseOptions = (seed: number, extra?: Options): Options => ({
  roughness: sketch.roughness,
  bowing: sketch.bowing,
  strokeWidth: sketch.strokeWidth,
  seed: Math.round(sketch.seed + seed) % 2147483647,
  ...extra,
});

const cache = new Map<string, string>();

const toD = (key: string, build: () => string): string => {
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const d = build();
  cache.set(key, d);
  return d;
};

const paths = (drawable: ReturnType<typeof generator.line>): string =>
  generator
    .toPaths(drawable)
    .map((p) => p.d)
    .join(' ');

export const roughLine = (
  x1: number, y1: number, x2: number, y2: number, seed = 1, o?: Options,
): string =>
  toD(`l${x1},${y1},${x2},${y2},${seed},${JSON.stringify(o ?? {})}`, () =>
    paths(generator.line(x1, y1, x2, y2, baseOptions(seed, o))),
  );

export const roughRect = (
  x: number, y: number, w: number, h: number, seed = 1, o?: Options,
): string =>
  toD(`r${x},${y},${w},${h},${seed},${JSON.stringify(o ?? {})}`, () =>
    paths(generator.rectangle(x, y, w, h, baseOptions(seed, o))),
  );

export const roughEllipse = (
  cx: number, cy: number, w: number, h: number, seed = 1, o?: Options,
): string =>
  toD(`e${cx},${cy},${w},${h},${seed},${JSON.stringify(o ?? {})}`, () =>
    paths(generator.ellipse(cx, cy, w, h, baseOptions(seed, o))),
  );

export const roughCircle = (cx: number, cy: number, d: number, seed = 1, o?: Options): string =>
  roughEllipse(cx, cy, d, d, seed, o);

export const roughPath = (d: string, seed = 1, o?: Options): string =>
  toD(`p${d}|${seed}|${JSON.stringify(o ?? {})}`, () =>
    paths(generator.path(d, baseOptions(seed, o))),
  );

export const roughPolygon = (pts: [number, number][], seed = 1, o?: Options): string =>
  toD(`g${JSON.stringify(pts)},${seed},${JSON.stringify(o ?? {})}`, () =>
    paths(generator.polygon(pts, baseOptions(seed, o))),
  );

export const roughCurve = (pts: [number, number][], seed = 1, o?: Options): string =>
  toD(`c${JSON.stringify(pts)},${seed},${JSON.stringify(o ?? {})}`, () =>
    paths(generator.curve(pts, baseOptions(seed, o))),
  );

/** A tick / checkmark sized to fit a `size` x `size` box centred on (cx, cy). */
export const roughCheck = (cx: number, cy: number, size: number, seed = 1, o?: Options): string => {
  const s = size / 2;
  return roughPath(
    `M ${cx - s} ${cy + s * 0.05} L ${cx - s * 0.2} ${cy + s * 0.72} L ${cx + s} ${cy - s * 0.7}`,
    seed,
    o,
  );
};

/** Straight arrow from (x1,y1) to (x2,y2) including its head, as one path. */
export const roughArrow = (
  x1: number, y1: number, x2: number, y2: number, seed = 1,
  o?: Options & {head?: number},
): string => {
  const head = o?.head ?? 26;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const wing = 0.42;
  const shaft = roughLine(x1, y1, x2, y2, seed, o);
  const a = roughLine(
    x2, y2,
    x2 - head * Math.cos(ang - wing), y2 - head * Math.sin(ang - wing),
    seed + 11, o,
  );
  const b = roughLine(
    x2, y2,
    x2 - head * Math.cos(ang + wing), y2 - head * Math.sin(ang + wing),
    seed + 23, o,
  );
  return `${shaft} ${a} ${b}`;
};

/** Downward arrow of `len` px starting at (x, y). */
export const roughArrowDown = (x: number, y: number, len: number, seed = 1, o?: Options): string =>
  roughArrow(x, y, x, y + len, seed, {...o, head: 22});
