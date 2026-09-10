/** Small geometry helpers used to build hand-drawn shapes. */

export type Pt = [number, number];

/**
 * Turns a polyline into a dashed path made of many short sub-paths.
 * Because it is real geometry (not strokeDasharray) it can be animated with
 * DrawPath, so the dotted forecast line "dots" its way forward like a marker.
 */
export const dashedPolyline = (points: Pt[], dash = 15, gap = 13): string => {
  const segs: string[] = [];
  let carry = 0;
  let drawing = true;

  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len === 0) continue;
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;

    let pos = 0;
    while (pos < len) {
      const want = (drawing ? dash : gap) - carry;
      const take = Math.min(want, len - pos);
      if (drawing) {
        segs.push(
          `M ${(x1 + ux * pos).toFixed(2)} ${(y1 + uy * pos).toFixed(2)} L ${(x1 + ux * (pos + take)).toFixed(2)} ${(
            y1 + uy * (pos + take)
          ).toFixed(2)}`,
        );
      }
      pos += take;
      if (take === want) {
        drawing = !drawing;
        carry = 0;
      } else {
        carry += take;
      }
    }
  }
  return segs.join(' ');
};

/** Samples a Catmull-Rom spline through `points` so curves can be dashed too. */
export const smoothPoints = (points: Pt[], perSegment = 12): Pt[] => {
  if (points.length < 3) return points;
  const out: Pt[] = [];
  const p = [points[0], ...points, points[points.length - 1]];
  for (let i = 1; i < p.length - 2; i++) {
    for (let s = 0; s < perSegment; s++) {
      const t = s / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 *
        (2 * p[i][0] +
          (-p[i - 1][0] + p[i + 1][0]) * t +
          (2 * p[i - 1][0] - 5 * p[i][0] + 4 * p[i + 1][0] - p[i + 2][0]) * t2 +
          (-p[i - 1][0] + 3 * p[i][0] - 3 * p[i + 1][0] + p[i + 2][0]) * t3);
      const y =
        0.5 *
        (2 * p[i][1] +
          (-p[i - 1][1] + p[i + 1][1]) * t +
          (2 * p[i - 1][1] - 5 * p[i][1] + 4 * p[i + 1][1] - p[i + 2][1]) * t2 +
          (-p[i - 1][1] + 3 * p[i][1] - 3 * p[i + 1][1] + p[i + 2][1]) * t3);
      out.push([x, y]);
    }
  }
  out.push(p[p.length - 1]);
  return out;
};

export const polylinePath = (points: Pt[]): string =>
  `M ${points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')}`;
