/**
 * Hand-drawn wall calendar and month strips.
 * Origin is the top-left corner of the calendar body.
 */
import React from 'react';
import {colors, fonts, sketch} from '../lib/theme';
import {roughRect, roughLine, roughCircle} from '../lib/rough';
import {DrawPath} from './Draw';

export const WallCalendar: React.FC<{
  progress: number;
  width?: number;
  height?: number;
  /** Month name shown on the page. */
  month: string;
  /** 0 -> 1 page-turn, used to peel the top page away. */
  turn?: number;
  accent?: string;
  seed?: number;
  /** Circle a "day" on the grid to mark a key date. */
  markDay?: number | null;
  markProgress?: number;
  markColor?: string;
}> = ({
  progress,
  width = 380,
  height = 330,
  month,
  turn = 0,
  accent = colors.primary,
  seed = 40,
  markDay = null,
  markProgress = 0,
  markColor = colors.accent,
}) => {
  const p = Math.min(1, Math.max(0, progress));
  const headH = 74;
  const cols = 7;
  const rows = 4;
  const gridTop = headH + 26;
  const cellW = (width - 44) / cols;
  const cellH = (height - gridTop - 26) / rows;

  const pFrame = Math.min(1, p / 0.5);
  const pGrid = Math.min(1, Math.max(0, (p - 0.35) / 0.5));

  const markIndex = markDay === null ? -1 : markDay - 1;
  const mr = markIndex >= 0 ? Math.floor(markIndex / cols) : 0;
  const mc = markIndex >= 0 ? markIndex % cols : 0;

  return (
    <g>
      {/* rings */}
      <g opacity={pFrame}>
        {[0.24, 0.5, 0.76].map((f, i) => (
          <DrawPath
            key={i}
            d={roughLine(width * f, -22, width * f, 16, seed + i)}
            progress={pFrame}
            stroke={colors.neutral}
            strokeWidth={sketch.strokeWidth}
          />
        ))}
      </g>

      <g transform={`rotate(${-turn * 7} 0 0)`} opacity={1 - turn * 0.15}>
        <rect x={0} y={0} width={width} height={height} rx={10} fill={colors.surface} opacity={pFrame} />
        <rect x={0} y={0} width={width} height={headH} rx={10} fill={accent} opacity={pFrame * 0.92} />
        <DrawPath d={roughRect(0, 0, width, height, seed)} progress={pFrame} stroke={colors.text} />
        <DrawPath d={roughLine(0, headH, width, headH, seed + 4)} progress={pFrame} stroke={colors.text} />

        <text
          x={width / 2}
          y={headH / 2 + 15}
          textAnchor="middle"
          fill="#FFFFFF"
          opacity={pFrame}
          style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 40, letterSpacing: 3}}
        >
          {month}
        </text>

        {/* day grid */}
        <g opacity={pGrid}>
          {Array.from({length: rows}).map((_, r) =>
            Array.from({length: cols}).map((__, c) => (
              <rect
                key={`${r}-${c}`}
                x={22 + c * cellW + 5}
                y={gridTop + r * cellH + 5}
                width={cellW - 12}
                height={cellH - 12}
                rx={4}
                fill={colors.line}
                opacity={0.55}
              />
            )),
          )}
        </g>

        {markIndex >= 0 && markProgress > 0 && (
          <>
            <rect
              x={22 + mc * cellW + 5}
              y={gridTop + mr * cellH + 5}
              width={cellW - 12}
              height={cellH - 12}
              rx={4}
              fill={markColor}
              opacity={0.35 * markProgress}
            />
            <DrawPath
              d={roughCircle(22 + mc * cellW + cellW / 2 - 1, gridTop + mr * cellH + cellH / 2 - 1, cellH + 6, seed + 21)}
              progress={markProgress}
              stroke={markColor}
              strokeWidth={sketch.strokeWidth + 1}
            />
          </>
        )}
      </g>
    </g>
  );
};

/**
 * Horizontal strip of months: JAN -> FEB -> ... -> DEC.
 * `reveal` is 0 -> 1 across the whole strip.
 */
export const MonthStrip: React.FC<{
  months: readonly string[];
  reveal: number;
  width: number;
  /** ids (0-based) of months to emphasise. */
  highlight?: number[];
  highlightProgress?: number;
  highlightColor?: string;
  fontSize?: number;
  seed?: number;
  arrows?: boolean;
}> = ({
  months,
  reveal,
  width,
  highlight = [],
  highlightProgress = 1,
  highlightColor = colors.accent,
  fontSize = 30,
  seed = 60,
  arrows = true,
}) => {
  const n = months.length;
  const step = width / n;
  return (
    <g>
      {months.map((m, i) => {
        const local = Math.min(1, Math.max(0, reveal * n - i));
        const on = highlight.includes(i);
        const hp = on ? highlightProgress : 0;
        const cx = step * i + step / 2;
        return (
          <g key={m} opacity={local}>
            {hp > 0 && (
              <rect
                x={cx - step * 0.42}
                y={-fontSize * 0.95}
                width={step * 0.84}
                height={fontSize * 1.62}
                rx={9}
                fill={highlightColor}
                opacity={0.22 * hp}
              />
            )}
            <text
              x={cx}
              y={fontSize * 0.36}
              textAnchor="middle"
              fill={on && hp > 0.4 ? highlightColor : colors.textSoft}
              style={{
                fontFamily: fonts.body,
                fontWeight: on && hp > 0.4 ? 800 : 700,
                fontSize,
                letterSpacing: 1.6,
              }}
            >
              {m}
            </text>
            {arrows && i < n - 1 && (
              <DrawPath
                d={roughLine(cx + step * 0.3, 0, cx + step * 0.68, 0, seed + i)}
                progress={Math.min(1, Math.max(0, reveal * n - i - 0.5) * 2)}
                stroke={colors.line}
                strokeWidth={2.4}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};
