/**
 * A horizontal run of months in perspective, with a travelling playhead.
 *
 * Used twice, deliberately: once in calendar order (JAN..DEC, the cycle we are
 * leaving) and once in salary-year order (APR..MAR, the cycle we are moving
 * to). Seeing the same object with a different first month is what makes the
 * change concrete.
 */
import React from 'react';
import {colors, fonts, depth} from '../lib/theme';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

export const MonthRail: React.FC<{
  months: readonly string[];
  /** 0 -> 1: tiles arriving, staggered left to right. */
  progress: number;
  width: number;
  /** Which month the playhead sits on, as a float index. Null hides it. */
  playhead?: number | null;
  /** Indices to keep lit even when the playhead has moved past. */
  highlight?: number[];
  color?: string;
  /** Tilt for depth. */
  tilt?: number;
  tileHeight?: number;
  fontSize?: number;
  /** Dim months that are not the endpoints, so the range reads instantly. */
  emphasiseEnds?: boolean;
}> = ({
  months,
  progress,
  width,
  playhead = null,
  highlight = [],
  color = colors.primary,
  tilt = 8,
  tileHeight = 118,
  fontSize = 38,
  emphasiseEnds = false,
}) => {
  const n = months.length;
  const gap = 12;
  const tileW = (width - gap * (n - 1)) / n;

  return (
    <div
      style={{
        width,
        transformStyle: 'preserve-3d',
        transform: `perspective(${depth.perspective}px) rotateX(${tilt}deg)`,
        display: 'flex',
        gap,
      }}
    >
      {months.map((m, i) => {
        const local = clamp(progress * (n + 6) - i);
        const isEnd = i === 0 || i === n - 1;
        const lit =
          highlight.includes(i) ||
          (playhead !== null && Math.abs(playhead - i) < 0.55);
        const near = playhead !== null ? clamp(1 - Math.abs(playhead - i) / 1.6) : 0;

        const active = lit ? 1 : near * 0.5;
        const dim = emphasiseEnds && !isEnd && !lit ? 0.45 : 1;

        return (
          <div
            key={m}
            style={{
              width: tileW,
              height: tileHeight,
              opacity: local * dim,
              transform: `translate3d(0, ${(1 - local) * 44}px, ${active * 46}px) scale(${1 + active * 0.06})`,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: lit
                ? `linear-gradient(160deg, ${color}, ${color}bb)`
                : `linear-gradient(160deg, ${colors.surfaceLit}aa, ${colors.surface}dd)`,
              border: `1.5px solid ${lit ? color : colors.line}`,
              boxShadow: lit
                ? `0 22px 60px ${color}55, inset 0 2px 0 rgba(255,255,255,0.35)`
                : `0 14px 34px rgba(0,0,0,0.42), inset 0 1.5px 0 ${colors.surfaceLit}`,
              fontFamily: fonts.body,
              fontWeight: lit ? 800 : 700,
              fontSize,
              letterSpacing: 2,
              color: lit ? colors.background : colors.textSoft,
              willChange: 'transform, opacity',
            }}
          >
            {m}
          </div>
        );
      })}
    </div>
  );
};

/**
 * A compact "FROM → TO" range plate. The single most repeated object in the
 * film, so it is deliberately one component with one look.
 */
export const RangePlate: React.FC<{
  progress: number;
  from: string;
  to: string;
  color?: string;
  size?: number;
  /** Muted styling for the cycle being left behind. */
  quiet?: boolean;
}> = ({progress, from, to, color = colors.accent, size = 96, quiet = false}) => {
  const p = clamp(progress);
  const tone = quiet ? colors.muted : color;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.34,
        opacity: p,
        transform: `translate3d(0, ${(1 - p) * 26}px, 0)`,
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: -size * 0.01,
        color: quiet ? colors.muted : colors.text,
        textShadow: quiet ? 'none' : `0 0 ${size * 0.5}px ${colors.accentGlow}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span>{from}</span>
      <svg width={size * 0.86} height={size * 0.42} viewBox="0 0 86 42" style={{overflow: 'visible'}}>
        <path
          d="M 2 21 L 74 21"
          stroke={tone}
          strokeWidth={7}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - p}
        />
        <path
          d="M 58 6 L 78 21 L 58 36"
          fill="none"
          stroke={tone}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={clamp(p * 3 - 2)}
        />
      </svg>
      <span>{to}</span>
    </div>
  );
};
