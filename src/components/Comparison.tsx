/**
 * Scene 7's split-screen: a calm "BEFORE" column and a confident "NOW" column.
 * Origin is the top-left of the panel.
 */
import React from 'react';
import {colors, fonts, sketch} from '../lib/theme';
import {roughRect, roughLine} from '../lib/rough';
import {DrawPath} from './Draw';
import {CheckMark} from './SalaryIcon';

export interface CompRow {
  label: string;
  value: string;
  /** Show a tick next to the value (used on the NOW side). */
  tick?: boolean;
}

export const ComparisonPanel: React.FC<{
  title: string;
  rows: CompRow[];
  width: number;
  height: number;
  panelProgress: number;
  rowProgress: number[];
  accent: string;
  emphasised?: boolean;
  seed?: number;
}> = ({title, rows, width, height, panelProgress, rowProgress, accent, emphasised = false, seed = 700}) => {
  const headH = 78;
  // The muted column still needs a header dark enough for white text.
  const headerFill = emphasised ? accent : colors.textSoft;
  const rowH = (height - headH - 34) / rows.length;

  return (
    <g>
      <rect
        width={width}
        height={height}
        rx={16}
        fill={emphasised ? accent : colors.neutral}
        opacity={panelProgress * (emphasised ? 0.08 : 0.05)}
      />
      <rect width={width} height={height} rx={16} fill={colors.surface} opacity={panelProgress * 0.55} />
      <DrawPath
        d={roughRect(0, 0, width, height, seed)}
        progress={panelProgress}
        stroke={emphasised ? accent : colors.neutral}
        strokeWidth={emphasised ? sketch.strokeWidth + 0.6 : sketch.strokeWidth - 0.4}
      />
      <g opacity={panelProgress}>
        <rect x={0} y={0} width={width} height={headH} rx={16} fill={headerFill} opacity={0.95} />
        <rect x={0} y={headH - 18} width={width} height={18} fill={headerFill} opacity={0.95} />
        <text
          x={width / 2}
          y={headH / 2 + 16}
          textAnchor="middle"
          fill="#FFFFFF"
          style={{fontFamily: fonts.body, fontWeight: 900, fontSize: 44, letterSpacing: 5}}
        >
          {title}
        </text>
      </g>

      {rows.map((row, i) => {
        const p = Math.min(1, Math.max(0, rowProgress[i] ?? 0));
        const y = headH + 22 + i * rowH;
        return (
          <g key={row.label} opacity={p}>
            {i > 0 && (
              <DrawPath
                d={roughLine(30, y - 4, width - 30, y - 4, seed + 5 + i)}
                progress={p}
                stroke={colors.line}
                strokeWidth={2}
              />
            )}
            <text
              x={34}
              y={y + 36}
              fill={colors.textSoft}
              style={{fontFamily: fonts.body, fontWeight: 700, fontSize: 26, letterSpacing: 1.6}}
            >
              {row.label.toUpperCase()}
            </text>
            <text
              x={34}
              y={y + 82}
              fill={emphasised ? colors.text : colors.textSoft}
              style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 36}}
            >
              {row.value}
            </text>
            {row.tick && (
              <g transform={`translate(${width - 62} ${y + 58}) scale(0.34)`}>
                <CheckMark progress={Math.min(1, Math.max(0, p * 2 - 0.7))} size={120} color={colors.success} ring={false} seed={seed + 30 + i} />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};
