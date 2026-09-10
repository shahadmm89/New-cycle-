/** Money / payslip / merit icons, drawn around their own centre. */
import React from 'react';
import {colors, fonts, sketch} from '../lib/theme';
import {roughCircle, roughRect, roughPath, roughLine} from '../lib/rough';
import {DrawPath} from './Draw';

export const CoinStack: React.FC<{progress: number; color?: string; seed?: number}> = ({
  progress,
  color = colors.accent,
  seed = 300,
}) => {
  const coins = [0, 1, 2];
  return (
    <g>
      {coins.map((i) => {
        const p = Math.min(1, Math.max(0, progress * 3 - i));
        const y = 26 - i * 26;
        return (
          <g key={i} opacity={p}>
            <ellipse cx={0} cy={y} rx={46} ry={17} fill={color} opacity={0.9} />
            <DrawPath d={roughPath(`M -46 ${y} A 46 17 0 1 0 46 ${y} A 46 17 0 1 0 -46 ${y}`, seed + i)} progress={p} stroke={colors.text} strokeWidth={2.6} />
          </g>
        );
      })}
      <g opacity={Math.min(1, Math.max(0, progress * 3 - 2))}>
        <text
          x={0}
          y={-19}
          textAnchor="middle"
          fill={colors.text}
          style={{fontFamily: fonts.body, fontWeight: 900, fontSize: 27}}
        >
          $
        </text>
      </g>
    </g>
  );
};

/** A payslip / payroll document. */
export const Payslip: React.FC<{
  progress: number;
  label?: string;
  accent?: string;
  seed?: number;
  width?: number;
  height?: number;
}> = ({progress, label, accent = colors.secondary, seed = 320, width = 150, height = 186}) => {
  const w = width;
  const h = height;
  return (
    <g transform={`translate(${-w / 2} ${-h / 2})`}>
      <rect width={w} height={h} rx={8} fill={colors.surface} opacity={progress} />
      <DrawPath d={roughRect(0, 0, w, h, seed)} progress={progress} stroke={colors.text} strokeWidth={2.8} />
      <rect x={0} y={0} width={w} height={34} rx={8} fill={accent} opacity={progress * 0.9} />
      {[0, 1, 2].map((i) => (
        <DrawPath
          key={i}
          d={roughLine(20, 66 + i * 26, w - 20 - i * 22, 66 + i * 26, seed + 3 + i)}
          progress={Math.min(1, Math.max(0, progress * 2 - 0.4 - i * 0.2))}
          stroke={colors.line}
          strokeWidth={4}
        />
      ))}
      <text
        x={w / 2}
        y={h - 26}
        textAnchor="middle"
        fill={accent}
        opacity={progress}
        style={{fontFamily: fonts.body, fontWeight: 900, fontSize: 34}}
      >
        {label ?? '$'}
      </text>
    </g>
  );
};

/** Upward "merit" arrow inside a circle. */
export const MeritArrow: React.FC<{progress: number; color?: string; seed?: number}> = ({
  progress,
  color = colors.success,
  seed = 340,
}) => (
  <g>
    <circle cx={0} cy={0} r={54} fill={color} opacity={progress * 0.12} />
    <DrawPath d={roughCircle(0, 0, 110, seed)} progress={progress} stroke={color} strokeWidth={3} />
    <DrawPath
      d={roughPath('M -30 22 L -6 -8 L 10 8 L 32 -24', seed + 1)}
      progress={Math.min(1, Math.max(0, progress * 1.8 - 0.4))}
      stroke={color}
      strokeWidth={sketch.strokeWidth + 1}
    />
    <DrawPath
      d={roughPath('M 14 -24 L 32 -24 L 32 -6', seed + 2)}
      progress={Math.min(1, Math.max(0, progress * 2.4 - 1.1))}
      stroke={color}
      strokeWidth={sketch.strokeWidth + 1}
    />
  </g>
);

/** Big hand-drawn tick in a circle. */
export const CheckMark: React.FC<{
  progress: number;
  size?: number;
  color?: string;
  ring?: boolean;
  seed?: number;
}> = ({progress, size = 120, color = colors.success, ring = true, seed = 360}) => {
  const pRing = Math.min(1, progress * 1.6);
  const pTick = Math.min(1, Math.max(0, (progress - 0.35) / 0.65));
  const s = size / 2;
  return (
    <g>
      {ring && (
        <>
          <circle cx={0} cy={0} r={s * 1.12} fill={color} opacity={pRing * 0.12} />
          <DrawPath d={roughCircle(0, 0, size * 2.24, seed)} progress={pRing} stroke={color} strokeWidth={4} />
        </>
      )}
      <DrawPath
        d={roughPath(`M ${-s * 0.86} ${s * 0.04} L ${-s * 0.18} ${s * 0.72} L ${s * 0.9} ${-s * 0.74}`, seed + 1)}
        progress={pTick}
        stroke={color}
        strokeWidth={size * 0.11}
      />
    </g>
  );
};

export const MagnifyingGlass: React.FC<{progress: number; color?: string; seed?: number}> = ({
  progress,
  color = colors.primary,
  seed = 380,
}) => (
  <g>
    <circle cx={0} cy={0} r={62} fill={colors.surface} opacity={progress * 0.55} />
    <DrawPath d={roughCircle(0, 0, 128, seed)} progress={progress} stroke={color} strokeWidth={5} />
    <DrawPath
      d={roughLine(46, 46, 96, 96, seed + 1)}
      progress={Math.min(1, Math.max(0, progress * 2 - 1))}
      stroke={color}
      strokeWidth={9}
    />
  </g>
);

/** Two half-circles clicking into alignment - used for "market alignment". */
export const AlignIcon: React.FC<{progress: number; seed?: number}> = ({progress, seed = 400}) => {
  const gap = (1 - Math.min(1, progress)) * 60;
  return (
    <g>
      <g transform={`translate(${-gap} 0)`}>
        <DrawPath d={roughPath('M 0 -52 A 52 52 0 0 0 0 52 Z', seed)} progress={Math.min(1, progress * 2)} stroke={colors.primary} strokeWidth={4} fill="none" />
        <path d="M 0 -52 A 52 52 0 0 0 0 52 Z" fill={colors.primary} opacity={0.16 * progress} />
      </g>
      <g transform={`translate(${gap} 0)`}>
        <DrawPath d={roughPath('M 0 -52 A 52 52 0 0 1 0 52 Z', seed + 1)} progress={Math.min(1, progress * 2)} stroke={colors.secondary} strokeWidth={4} fill="none" />
        <path d="M 0 -52 A 52 52 0 0 1 0 52 Z" fill={colors.secondary} opacity={0.16 * progress} />
      </g>
    </g>
  );
};
