/**
 * The big month rail used in scene 5 (and a slimmer version in scene 2).
 * Origin is the left end of the rail; the rail runs along y = 0.
 */
import React from 'react';
import {colors, fonts, sketch} from '../lib/theme';
import {roughLine, roughCircle} from '../lib/rough';
import {DrawPath} from './Draw';

export interface Stop {
  label: string;
  /** Sub-label under the month, e.g. "1". */
  sub?: string;
}

export const Timeline: React.FC<{
  stops: Stop[];
  width: number;
  /** 0 -> 1: the rail drawing itself left to right. */
  railProgress: number;
  /** 0 -> 1: the stop labels appearing, staggered. */
  stopsProgress: number;
  /** Stops to spotlight, each with its own 0 -> 1 progress. */
  highlights?: {index: number; progress: number}[];
  highlightColor?: string;
  /** Extra rail drawn past the last stop, so the arrow head stays clear of it. */
  overshoot?: number;
  labelSize?: number;
  seed?: number;
}> = ({
  stops,
  width,
  railProgress,
  stopsProgress,
  highlights = [],
  highlightColor = colors.accent,
  overshoot = 0,
  labelSize = 46,
  seed = 90,
}) => {
  const n = stops.length;
  const step = width / (n - 1 || 1);
  const railEnd = width + overshoot;

  return (
    <g>
      <DrawPath
        d={roughLine(0, 0, railEnd, 0, seed)}
        progress={railProgress}
        stroke={colors.text}
        strokeWidth={sketch.strokeWidth + 1}
      />
      {/* arrow head at the end of the rail */}
      <DrawPath
        d={`${roughLine(railEnd, 0, railEnd - 22, -13, seed + 1)} ${roughLine(railEnd, 0, railEnd - 22, 13, seed + 2)}`}
        progress={Math.min(1, Math.max(0, (railProgress - 0.9) * 10))}
        stroke={colors.text}
        strokeWidth={sketch.strokeWidth + 1}
      />

      {stops.map((stop, i) => {
        const local = Math.min(1, Math.max(0, stopsProgress * n - i));
        const hp = highlights.find((h) => h.index === i)?.progress ?? 0;
        const x = step * i;
        const color = hp > 0.35 ? highlightColor : colors.textSoft;
        return (
          <g key={stop.label} opacity={local}>
            {hp > 0 && (
              <circle cx={x} cy={0} r={30 + hp * 16} fill={highlightColor} opacity={0.16 * hp} />
            )}
            <DrawPath d={roughLine(x, -14, x, 14, seed + 10 + i)} progress={local} stroke={colors.text} strokeWidth={3} />
            {hp > 0 && (
              <DrawPath
                d={roughCircle(x, 0, 58, seed + 40 + i)}
                progress={hp}
                stroke={highlightColor}
                strokeWidth={sketch.strokeWidth + 1}
              />
            )}
            <text
              x={x}
              y={-46}
              textAnchor="middle"
              fill={color}
              style={{
                fontFamily: fonts.body,
                fontWeight: 800,
                fontSize: labelSize,
                letterSpacing: 2.4,
              }}
            >
              {stop.label}
            </text>
            {stop.sub && (
              <text
                x={x}
                y={62}
                textAnchor="middle"
                fill={color}
                opacity={0.9}
                style={{fontFamily: fonts.body, fontWeight: 700, fontSize: labelSize * 0.5}}
              >
                {stop.sub}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};
