/**
 * THE ANNUAL CYCLE WHEEL
 *
 * Twelve month segments around an ANNUAL SALARY PROGRAM hub - the circular
 * 12-month programme from the old HR slide, redrawn for the film: flat
 * segments, upright labels, one marker at twelve o'clock for "the cycle starts
 * here", and a thin inner arrow for the direction the year runs. No hands, no
 * numbers, no ticks: it is a year, not a clock.
 *
 * Turning it is the whole story. `rotation` 0 has JANUARY at the start marker;
 * 3 brings APRIL there, and the same twelve months now run APRIL -> MARCH.
 *
 * Scenes point at it (MARCH, APRIL) using the geometry in src/lib/wheel.ts, so
 * the arrow always lands on the segment it names.
 */
import React from 'react';
import {colors, fonts} from '../lib/theme';
import {WHEEL, WheelPlace, monthAngle} from '../lib/wheel';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** A point on a circle, angle in degrees clockwise from twelve o'clock. */
const pt = (deg: number, radius: number) => {
  const a = (deg * Math.PI) / 180;
  return [Math.sin(a) * radius, -Math.cos(a) * radius] as const;
};

/** An annular sector from a1 to a2 (degrees clockwise from the top). */
const sector = (a1: number, a2: number, rOuter: number, rInner: number) => {
  const [ox1, oy1] = pt(a1, rOuter);
  const [ox2, oy2] = pt(a2, rOuter);
  const [ix2, iy2] = pt(a2, rInner);
  const [ix1, iy1] = pt(a1, rInner);
  const large = a2 - a1 > 180 ? 1 : 0;
  return (
    `M ${ox1} ${oy1} A ${rOuter} ${rOuter} 0 ${large} 1 ${ox2} ${oy2} ` +
    `L ${ix2} ${iy2} A ${rInner} ${rInner} 0 ${large} 0 ${ix1} ${iy1} Z`
  );
};

/** An open arc from a1 to a2 at `radius`, for strokes. */
const arc = (a1: number, a2: number, radius: number) => {
  if (a2 - a1 <= 0.01) return '';
  const [x1, y1] = pt(a1, radius);
  const [x2, y2] = pt(a2, radius);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
};

export type MonthTone = {
  /** Month index, 0 = JAN. */
  index: number;
  color: string;
  /** 0 -> 1 how strongly the segment is filled. */
  amount: number;
};

export const CycleWheel: React.FC<{
  place: WheelPlace;
  /** 0 -> 1 entrance. */
  progress: number;
  /** In months: 0 = JAN at the start marker, 3 = APR. */
  rotation: number;
  tones?: MonthTone[];
  /** Colour of the start marker and the direction arrow. */
  startColor?: string;
  /** Lines in the hub. */
  centre?: string[];
  centreColor?: string;
  /** Optional big figure above the hub lines (e.g. the month count). */
  centreFigure?: string;
  /**
   * The 12 + 3 sweep. Both start at the start edge of `sweepFrom` and run
   * clockwise: `sweep12` is one full lap (0 -> 1), `sweep3` the three extra
   * months on a second, outer track (0 -> 1 of those three).
   */
  sweepFrom?: number;
  sweep12?: number;
  sweep3?: number;
}> = ({
  place,
  progress,
  rotation,
  tones = [],
  startColor = colors.accent,
  centre = ['ANNUAL', 'SALARY', 'PROGRAM'],
  centreColor = colors.textSoft,
  centreFigure,
  sweepFrom = 0,
  sweep12 = 0,
  sweep3 = 0,
}) => {
  const p = clamp(progress);
  if (p <= 0) return null;

  const {R, r, gapDeg, track1, track2} = WHEEL;
  const size = (track2 + 40) * 2;
  const toneOf = (i: number) => tones.filter((t) => t.index === i && t.amount > 0);

  const sweepStart = monthAngle(sweepFrom, rotation) - 15;
  const s12 = clamp(sweep12);
  const s3 = clamp(sweep3);

  return (
    <div
      style={{
        position: 'absolute',
        left: place.cx,
        top: place.cy,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) scale(${place.scale * (0.92 + 0.08 * p)})`,
        opacity: p,
        willChange: 'transform, opacity',
      }}
    >
      <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} style={{overflow: 'visible'}}>
        <defs>
          <radialGradient id="wheel-hub">
            <stop offset="0%" stopColor={colors.surfaceLit} stopOpacity="0.55" />
            <stop offset="100%" stopColor={colors.surface} stopOpacity="0.15" />
          </radialGradient>
        </defs>

        {/* month segments */}
        {MONTHS.map((m, i) => {
          const c = monthAngle(i, rotation);
          const a1 = c - 15 + gapDeg / 2;
          const a2 = c + 15 - gapDeg / 2;
          const lit = toneOf(i);
          const strongest = lit.reduce((a, t) => Math.max(a, t.amount), 0);
          const [lx, ly] = pt(c, (R + r) / 2);
          return (
            <g key={m}>
              <path d={sector(a1, a2, R, r)} fill={colors.surface} stroke={colors.line} strokeWidth={1.5} />
              {lit.map((t) => (
                <path key={t.color} d={sector(a1, a2, R, r)} fill={t.color} opacity={clamp(t.amount) * 0.9} />
              ))}
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={fonts.body}
                fontWeight={800}
                fontSize={27}
                letterSpacing={1.5}
                fill={strongest > 0.5 ? colors.background : colors.textSoft}
              >
                {m}
              </text>
            </g>
          );
        })}

        {/* the direction the year runs: a thin arc just inside the ring */}
        <path d={arc(8, 340, r - 20)} fill="none" stroke={startColor} strokeOpacity={0.55} strokeWidth={2.5} strokeLinecap="round" />
        {(() => {
          const [x, y] = pt(340, r - 20);
          const [bx, by] = pt(331, r - 12);
          const [cx2, cy2] = pt(331, r - 28);
          return <path d={`M ${bx} ${by} L ${x} ${y} L ${cx2} ${cy2}`} fill="none" stroke={startColor} strokeOpacity={0.75} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />;
        })()}

        {/* hub */}
        <circle r={r - 34} fill="url(#wheel-hub)" stroke={colors.line} strokeWidth={1.5} />

        {/* start marker at twelve o'clock: where the cycle begins */}
        <path d={`M -15 ${-R - 30} L 15 ${-R - 30} L 0 ${-R - 8} Z`} fill={startColor} style={{filter: `drop-shadow(0 0 10px ${startColor})`}} />

        {/* the 12 + 3 sweep */}
        {s12 > 0 && (
          <path d={arc(sweepStart, sweepStart + 360 * Math.min(s12, 0.9995), track1)} fill="none" stroke={colors.primary} strokeWidth={12} strokeLinecap="round" />
        )}
        {s3 > 0 && (
          <path
            d={arc(sweepStart, sweepStart + 90 * s3, track2)}
            fill="none"
            stroke={colors.transition}
            strokeWidth={12}
            strokeLinecap="round"
            style={{filter: `drop-shadow(0 0 10px ${colors.transition})`}}
          />
        )}
      </svg>

      {/* hub text, in HTML so it sets in the film's own type */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          pointerEvents: 'none',
        }}
      >
        {centreFigure ? (
          <div style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 96, lineHeight: 1, color: colors.text, letterSpacing: -2}}>
            {centreFigure}
          </div>
        ) : null}
        {centre.map((line) => (
          <div
            key={line}
            style={{
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: centreFigure ? 24 : 28,
              letterSpacing: 5,
              lineHeight: 1.25,
              color: centreColor,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};
