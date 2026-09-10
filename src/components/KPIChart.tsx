/**
 * A simple company KPI dashboard - four tiles with small bar/gauge sketches.
 * Origin is the top-left of the board.
 */
import React from 'react';
import {colors, fonts} from '../lib/theme';
import {roughRect, roughLine, roughEllipse} from '../lib/rough';
import {DrawPath} from './Draw';

const ICONS: Record<string, (c: string) => React.ReactNode> = {
  Sales: (c) => (
    <g>
      <rect x={-30} y={-12} width={16} height={30} rx={3} fill={c} opacity={0.75} />
      <rect x={-8} y={-26} width={16} height={44} rx={3} fill={c} opacity={0.85} />
      <rect x={14} y={-38} width={16} height={56} rx={3} fill={c} />
    </g>
  ),
  Production: (c) => (
    <g>
      <rect x={-32} y={-4} width={26} height={22} rx={3} fill={c} opacity={0.8} />
      <rect x={0} y={-20} width={26} height={38} rx={3} fill={c} opacity={0.9} />
      <path d="M -34 20 L 30 20" stroke={c} strokeWidth={4} strokeLinecap="round" />
    </g>
  ),
  Financial: (c) => (
    <g>
      <circle cx={0} cy={0} r={24} fill="none" stroke={c} strokeWidth={7} opacity={0.35} />
      <path d="M 0 -24 A 24 24 0 0 1 21 12" fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" />
    </g>
  ),
  'Business Performance': (c) => (
    <g>
      <path d="M -30 16 L -10 -6 L 6 6 L 30 -22" fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 16 -22 L 30 -22 L 30 -8" fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
};

export const KPIBoard: React.FC<{
  title: string;
  kpis: readonly string[];
  width: number;
  height: number;
  boardProgress: number;
  /** One 0 -> 1 value per tile. */
  tileProgress: number[];
  seed?: number;
}> = ({title, kpis, width, height, boardProgress, tileProgress, seed = 200}) => {
  const headH = 62;
  const cols = 2;
  const gap = 22;
  const padding = 24;
  const tileW = (width - padding * 2 - gap) / cols;
  const rows = Math.ceil(kpis.length / cols);
  const tileH = (height - headH - padding * 2 - gap * (rows - 1)) / rows;
  const tints = [colors.primary, colors.secondary, colors.accent, colors.success];

  return (
    <g>
      <rect x={0} y={0} width={width} height={height} rx={14} fill={colors.surface} opacity={boardProgress} />
      <DrawPath d={roughRect(0, 0, width, height, seed)} progress={boardProgress} stroke={colors.text} />
      <DrawPath d={roughLine(0, headH, width, headH, seed + 2)} progress={boardProgress} stroke={colors.line} strokeWidth={2.4} />
      <text
        x={padding}
        y={headH - 20}
        fill={colors.textSoft}
        opacity={boardProgress}
        style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 27, letterSpacing: 1.6}}
      >
        {title}
      </text>
      <g opacity={boardProgress}>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={width - 30 - i * 26} cy={headH / 2} r={7} fill={colors.line} />
        ))}
      </g>

      {kpis.map((k, i) => {
        const p = Math.min(1, Math.max(0, tileProgress[i] ?? 0));
        const r = Math.floor(i / cols);
        const c = i % cols;
        const x = padding + c * (tileW + gap);
        const y = headH + padding + r * (tileH + gap);
        const tint = tints[i % tints.length];
        return (
          <g key={k} opacity={p} transform={`translate(${x} ${y})`}>
            <rect width={tileW} height={tileH} rx={10} fill={tint} opacity={0.08} />
            <DrawPath d={roughRect(0, 0, tileW, tileH, seed + 10 + i)} progress={p} stroke={tint} strokeWidth={2.6} />
            <g transform={`translate(${tileW / 2} ${tileH * 0.38})`}>{ICONS[k]?.(tint)}</g>
            <text
              x={tileW / 2}
              y={tileH * 0.84}
              textAnchor="middle"
              fill={colors.text}
              style={{
                fontFamily: fonts.body,
                fontWeight: 800,
                // Shrink just enough that the longest KPI name still fits its tile.
                fontSize: Math.min(28, (tileW - 36) / (k.length * 0.56)),
              }}
            >
              {k}
            </text>
          </g>
        );
      })}
    </g>
  );
};

/** Hand-drawn "estimate" badge - a dashed circle with a wavy ~ inside. */
export const EstimateBadge: React.FC<{progress: number; label: string; seed?: number}> = ({
  progress,
  label,
  seed = 260,
}) => (
  <g opacity={progress}>
    <ellipse cx={0} cy={0} rx={104} ry={50} fill={colors.accent} opacity={0.1} />
    <DrawPath d={roughEllipse(0, 0, 208, 100, seed)} progress={progress} stroke={colors.accent} strokeWidth={3} />
    <text
      x={0}
      y={9}
      textAnchor="middle"
      fill={colors.accent}
      style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: 1.4}}
    >
      {label}
    </text>
  </g>
);
