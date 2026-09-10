/**
 * "Market salary movement" chart: axes, a solid history line and a dotted
 * forecast that extends into the future. Origin is the chart's bottom-left.
 */
import React from 'react';
import {colors, fonts, sketch} from '../lib/theme';
import {roughLine, roughCurve} from '../lib/rough';
import {dashedPolyline, smoothPoints} from '../lib/geometry';
import {DrawPath} from './Draw';

const HISTORY: [number, number][] = [
  [0.0, 0.16], [0.12, 0.22], [0.24, 0.2], [0.36, 0.34], [0.46, 0.42],
];
const FORECAST: [number, number][] = [
  [0.46, 0.42], [0.6, 0.52], [0.74, 0.6], [0.88, 0.72], [1.0, 0.8],
];
/** Where the market actually ended up - close to, but not the same as, the forecast. */
const ACTUAL: [number, number][] = [
  [0.46, 0.42], [0.6, 0.46], [0.74, 0.49], [0.88, 0.58], [1.0, 0.62],
];

export const MarketChart: React.FC<{
  width: number;
  height: number;
  axesProgress: number;
  historyProgress: number;
  forecastProgress: number;
  /** Draws the "what actually happened" line for the estimate-vs-actual beat. */
  actualProgress?: number;
  /** Axis captions. Turn them off when the chart is used as a small motif. */
  showAxisLabels?: boolean;
  yLabel?: string;
  xLabel?: string;
  seed?: number;
}> = ({
  width,
  height,
  axesProgress,
  historyProgress,
  forecastProgress,
  actualProgress = 0,
  showAxisLabels = true,
  yLabel = 'Market salary level',
  xLabel = 'Time',
  seed = 120,
}) => {
  const px = (t: number) => t * width;
  const py = (v: number) => -v * height;
  const map = (pts: [number, number][]): [number, number][] =>
    pts.map(([t, v]) => [px(t), py(v)] as [number, number]);

  return (
    <g>
      {/* axes */}
      <DrawPath d={roughLine(0, 0, width + 18, 0, seed)} progress={axesProgress} stroke={colors.neutral} strokeWidth={2.6} />
      <DrawPath d={roughLine(0, 0, 0, -height - 18, seed + 1)} progress={axesProgress} stroke={colors.neutral} strokeWidth={2.6} />
      {[0.33, 0.66, 1].map((g, i) => (
        <DrawPath
          key={g}
          d={roughLine(0, py(g * 0.9), width, py(g * 0.9), seed + 5 + i)}
          progress={axesProgress}
          stroke={colors.line}
          strokeWidth={1.8}
        />
      ))}

      {/* history */}
      <DrawPath
        d={roughCurve(map(HISTORY), seed + 20)}
        progress={historyProgress}
        stroke={colors.primary}
        strokeWidth={sketch.strokeWidth + 1}
      />

      {/* dotted forecast - real dashes so the marker can draw them one by one */}
      <DrawPath
        d={dashedPolyline(smoothPoints(map(FORECAST)), 16, 14)}
        progress={forecastProgress}
        stroke={colors.accent}
        strokeWidth={sketch.strokeWidth + 1}
      />

      {/* what actually happened */}
      <DrawPath
        d={roughCurve(map(ACTUAL), seed + 30)}
        progress={actualProgress}
        stroke={colors.secondary}
        strokeWidth={sketch.strokeWidth}
      />

      {showAxisLabels && (
        <>
      <text
        x={-14}
        y={-height - 26}
        fill={colors.textSoft}
        style={{fontFamily: fonts.body, fontWeight: 700, fontSize: 24, letterSpacing: 1.2}}
      >
        {yLabel}
      </text>
      <text
        x={width + 26}
        y={10}
        fill={colors.textSoft}
        style={{fontFamily: fonts.body, fontWeight: 700, fontSize: 24}}
      >
        {xLabel}
      </text>
        </>
      )}
    </g>
  );
};
