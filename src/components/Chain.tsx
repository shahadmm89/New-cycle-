/**
 * A vertical "A -> B -> C" chain of hand-drawn boxes joined by arrows.
 * This is the pattern the storyboard uses to spell out cause and effect,
 * e.g. FORECAST -> ESTIMATED MARKET MOVEMENT -> MERIT.
 * Origin is the top-centre of the first box.
 */
import React from 'react';
import {colors, fonts, sketch} from '../lib/theme';
import {roughRect, roughArrowDown, roughArrow} from '../lib/rough';
import {DrawPath} from './Draw';

export interface ChainStep {
  label: string;
  color?: string;
  /** Optional emphasis: solid tinted box instead of an outline. */
  solid?: boolean;
}

export const Chain: React.FC<{
  steps: ChainStep[];
  /** One 0 -> 1 value per step. */
  progress: number[];
  width: number;
  boxHeight?: number;
  arrowGap?: number;
  fontSize?: number;
  seed?: number;
}> = ({steps, progress, width, boxHeight = 78, arrowGap = 44, fontSize = 30, seed = 500}) => (
  <g>
    {steps.map((step, i) => {
      const p = Math.min(1, Math.max(0, progress[i] ?? 0));
      const y = i * (boxHeight + arrowGap);
      const color = step.color ?? colors.primary;
      return (
        <g key={step.label}>
          {i > 0 && (
            <DrawPath
              d={roughArrowDown(0, y - arrowGap + 6, arrowGap - 14, seed + 50 + i)}
              progress={p}
              stroke={colors.textSoft}
              strokeWidth={3}
            />
          )}
          <g opacity={p} transform={`translate(${-width / 2} ${y})`}>
            <rect
              width={width}
              height={boxHeight}
              rx={10}
              fill={color}
              opacity={step.solid ? 0.95 : 0.09}
            />
            <DrawPath
              d={roughRect(0, 0, width, boxHeight, seed + i)}
              progress={p}
              stroke={color}
              strokeWidth={sketch.strokeWidth}
            />
            <text
              x={width / 2}
              y={boxHeight / 2 + fontSize * 0.36}
              textAnchor="middle"
              fill={step.solid ? '#FFFFFF' : color}
              style={{fontFamily: fonts.body, fontWeight: 800, fontSize, letterSpacing: 1.8}}
            >
              {step.label}
            </text>
          </g>
        </g>
      );
    })}
  </g>
);

/** One side of a MorphRow: a labelled card that can carry several lines. */
const MorphCard: React.FC<{
  label: string | string[];
  progress: number;
  color: string;
  x: number;
  width: number;
  height: number;
  fontSize: number;
  seed: number;
  emphasised?: boolean;
}> = ({label, progress, color, x, width, height, fontSize, seed, emphasised = false}) => {
  const lines = Array.isArray(label) ? label : [label];
  return (
    <g opacity={progress} transform={`translate(${x} 0)`}>
      <rect width={width} height={height} rx={12} fill={color} opacity={emphasised ? 0.14 : 0.07} />
      <DrawPath
        d={roughRect(0, 0, width, height, seed)}
        progress={progress}
        stroke={color}
        strokeWidth={emphasised ? sketch.strokeWidth : 2.6}
      />
      {lines.map((line, i) => (
        <text
          key={`${line}-${i}`}
          x={width / 2}
          y={height / 2 + fontSize * 0.36 + (i - (lines.length - 1) / 2) * (fontSize * 1.2)}
          textAnchor="middle"
          fill={color}
          style={{fontFamily: fonts.body, fontWeight: 800, fontSize, letterSpacing: 1.2}}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

/** Horizontal A -> B card pair, used in scene 8. */
export const MorphRow: React.FC<{
  from: string | string[];
  to: string | string[];
  fromProgress: number;
  arrowProgress: number;
  toProgress: number;
  width: number;
  cardWidth: number;
  height?: number;
  fromColor?: string;
  toColor?: string;
  fontSize?: number;
  seed?: number;
}> = ({
  from,
  to,
  fromProgress,
  arrowProgress,
  toProgress,
  width,
  cardWidth,
  height = 108,
  fromColor = colors.neutral,
  toColor = colors.secondary,
  fontSize = 30,
  seed = 600,
}) => {
  const arrowStart = cardWidth + 26;
  const arrowEnd = width - cardWidth - 26;

  return (
    <g>
      <MorphCard
        label={from}
        progress={fromProgress}
        color={fromColor}
        x={0}
        width={cardWidth}
        height={height}
        fontSize={fontSize}
        seed={seed}
      />
      <DrawPath
        d={roughArrow(arrowStart, height / 2, arrowEnd, height / 2, seed + 40, {head: 22})}
        progress={arrowProgress}
        stroke={toColor}
        strokeWidth={4}
      />
      <MorphCard
        label={to}
        progress={toProgress}
        color={toColor}
        x={width - cardWidth}
        width={cardWidth}
        height={height}
        fontSize={fontSize}
        seed={seed + 20}
        emphasised
      />
    </g>
  );
};
