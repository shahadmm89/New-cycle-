/**
 * An arrow that draws itself from one point in the frame to another along a
 * gentle curve - used to carry the eye from a month on the cycle wheel to the
 * label that says what happens in it. Full-frame and transparent, so scenes
 * give it frame-space coordinates (see monthPoint in src/lib/wheel.ts).
 */
import React from 'react';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

export const Pointer: React.FC<{
  from: {x: number; y: number};
  to: {x: number; y: number};
  /** The curve's control point. */
  via: {x: number; y: number};
  /** 0 -> 1: the line draws from `from` to `to`; the head lands at the end. */
  progress: number;
  color: string;
  width?: number;
}> = ({from, to, via, progress, color, width = 4}) => {
  const p = clamp(progress);
  if (p <= 0) return null;
  const d = `M ${from.x} ${from.y} Q ${via.x} ${via.y} ${to.x} ${to.y}`;
  // Direction of travel at the end of a quadratic curve is (to - via).
  const ang = Math.atan2(to.y - via.y, to.x - via.x);
  const head = 20;
  const hx1 = to.x - Math.cos(ang - 0.45) * head;
  const hy1 = to.y - Math.sin(ang - 0.45) * head;
  const hx2 = to.x - Math.cos(ang + 0.45) * head;
  const hy2 = to.y - Math.sin(ang + 0.45) * head;
  const headIn = clamp((p - 0.85) / 0.15);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <circle cx={from.x} cy={from.y} r={7} fill={color} opacity={Math.min(1, p * 4)} />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
        style={{filter: `drop-shadow(0 0 8px ${color}88)`}}
      />
      <path
        d={`M ${hx1} ${hy1} L ${to.x} ${to.y} L ${hx2} ${hy2}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={headIn}
      />
    </svg>
  );
};
