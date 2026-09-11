/**
 * The year counter: twelve months around a ring, with the cycle's start month
 * locked to the top and a highlighted arc running all the way round.
 *
 * This is the mechanism the whole film turns on. Rotating the ring so a
 * different month sits at twelve o'clock IS the change being announced.
 */
import React from 'react';
import {colors, fonts} from '../lib/theme';

const R_OUTER = 292;
const R_TICK = 258;
const R_LABEL = 216;

export const YearRing: React.FC<{
  /** Month labels, in calendar order starting at January. */
  months: readonly string[];
  /** 0 -> 1 entrance of the ring itself. */
  progress: number;
  /**
   * How far the ring has rotated, in months. 0 puts JAN at the top;
   * 3 puts APR at the top. Fractional values are mid-rotation.
   */
  rotationMonths: number;
  /** 0 -> 1 sweep of the highlighted arc, from the start month clockwise. */
  arcProgress?: number;
  /** Colour of the arc and the start marker. */
  color?: string;
  /** Index (0-11) of the month that is the cycle start. */
  startIndex?: number;
  /** Label drawn in the middle of the ring. */
  centreTop?: string;
  centreMain?: string;
  centreColor?: string;
  /** Motion blur while spinning fast. */
  spin?: number;
  /** Off when the ring is pure background texture, as in the opening. */
  showLabels?: boolean;
}> = ({
  months,
  progress,
  rotationMonths,
  arcProgress = 0,
  color = colors.primary,
  startIndex = 0,
  centreTop,
  centreMain,
  centreColor,
  spin = 0,
  showLabels = true,
}) => {
  const p = Math.min(1, Math.max(0, progress));
  if (p <= 0) return null;

  const step = 360 / months.length;
  // Rotate the whole dial so the start month sits at twelve o'clock.
  const dial = -rotationMonths * step;

  const arcLen = 2 * Math.PI * R_TICK;
  const gap = 6; // a visible break at twelve o'clock, so the cycle reads as a loop with a start

  return (
    <svg width={R_OUTER * 2 + 80} height={R_OUTER * 2 + 80} viewBox={`0 0 ${R_OUTER * 2 + 80} ${R_OUTER * 2 + 80}`}>
      <defs>
        <filter id="ring-spin" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={spin * 3.2} />
        </filter>
        <radialGradient id="ring-core">
          <stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <stop offset="70%" stopColor={color} stopOpacity="0.03" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={`translate(${R_OUTER + 40} ${R_OUTER + 40}) scale(${0.9 + 0.1 * p})`} opacity={p}>
        <circle r={R_OUTER - 10} fill="url(#ring-core)" />

        {/* base track */}
        <circle
          r={R_TICK}
          fill="none"
          stroke={colors.line}
          strokeWidth={14}
          opacity={0.85}
        />

        {/* highlighted arc: the cycle itself */}
        {arcProgress > 0 && (
          <circle
            r={R_TICK}
            fill="none"
            stroke={color}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={`${Math.max(0, arcLen * arcProgress - gap)} ${arcLen}`}
            transform="rotate(-90)"
            style={{filter: `drop-shadow(0 0 22px ${color}aa)`}}
          />
        )}

        {/* the dial */}
        <g transform={`rotate(${dial})`} filter={spin > 0.02 ? 'url(#ring-spin)' : undefined}>
          {months.map((m, i) => {
            const angle = i * step - 90;
            const rad = (angle * Math.PI) / 180;
            const isStart = i === startIndex;
            const tx = Math.cos(rad) * R_LABEL;
            const ty = Math.sin(rad) * R_LABEL;
            const mx = Math.cos(rad) * (R_TICK + 26);
            const my = Math.sin(rad) * (R_TICK + 26);
            return (
              <g key={m}>
                <circle cx={mx} cy={my} r={isStart ? 7 : 3.5} fill={isStart ? color : colors.muted} />
                {/* counter-rotate so labels stay upright however far the dial turns */}
                <g transform={`translate(${tx} ${ty}) rotate(${-dial})`} opacity={showLabels ? 1 : 0}>
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isStart ? colors.text : colors.textSoft}
                    opacity={isStart ? 1 : 0.72}
                    style={{
                      fontFamily: fonts.body,
                      fontWeight: isStart ? 800 : 600,
                      fontSize: isStart ? 40 : 32,
                      letterSpacing: 1.6,
                    }}
                  >
                    {m}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* fixed marker at twelve o'clock - the start of the cycle */}
        <g transform={`translate(0 ${-R_TICK - 54})`}>
          <path d="M 0 22 L -17 -10 L 17 -10 Z" fill={color} style={{filter: `drop-shadow(0 0 14px ${color})`}} />
        </g>

        {/* centre readout */}
        {centreTop && (
          <text
            y={-26}
            textAnchor="middle"
            fill={colors.textSoft}
            style={{fontFamily: fonts.body, fontWeight: 700, fontSize: 24, letterSpacing: 5}}
          >
            {centreTop}
          </text>
        )}
        {centreMain && (
          <text
            y={40}
            textAnchor="middle"
            fill={centreColor ?? colors.text}
            style={{fontFamily: fonts.display, fontWeight: 800, fontSize: 76, letterSpacing: -1}}
          >
            {centreMain}
          </text>
        )}
      </g>
    </svg>
  );
};
