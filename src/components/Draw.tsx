/**
 * Drawing primitives shared by every scene.
 *
 * `DrawPath` is the workhorse: it animates an SVG path as if a marker were
 * drawing it, using pathLength="1" so progress is length-independent.
 */
import React from 'react';
import {colors, sketch} from '../lib/theme';

export const DrawPath: React.FC<{
  d: string;
  progress: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fill?: string;
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeDasharray?: string;
}> = ({
  d,
  progress,
  stroke = colors.text,
  strokeWidth = sketch.strokeWidth,
  opacity = 1,
  fill = 'none',
  strokeLinecap = 'round',
  strokeDasharray,
}) => {
  if (progress <= 0) return null;
  const drawn = Math.min(1, Math.max(0, progress));
  return (
    <path
      d={d}
      pathLength={1}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin="round"
      opacity={opacity}
      strokeDasharray={strokeDasharray ?? '1 1'}
      strokeDashoffset={strokeDasharray ? undefined : 1 - drawn}
    />
  );
};

/** A shape that fades + scales in gently rather than being drawn. */
export const PopIn: React.FC<{
  progress: number;
  children: React.ReactNode;
  origin?: string;
  from?: number;
  travel?: number;
}> = ({progress, children, origin = 'center', from = 0.86, travel = 14}) => {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * travel}px) scale(${from + (1 - from) * p})`,
        transformOrigin: origin,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

/** SVG equivalent of PopIn. */
export const PopInG: React.FC<{
  progress: number;
  cx: number;
  cy: number;
  children: React.ReactNode;
  from?: number;
}> = ({progress, cx, cy, children, from = 0.8}) => {
  const p = Math.min(1, Math.max(0, progress));
  if (p <= 0) return null;
  const s = from + (1 - from) * p;
  return (
    <g opacity={p} transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>
      {children}
    </g>
  );
};

/**
 * Text that appears as if it were being written: a left-to-right reveal.
 * Used with the handwriting font for annotations, and with the body font for
 * on-screen headlines (where it reads as a clean wipe).
 */
export const WriteOn: React.FC<{
  progress: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  /** Extra right padding so descenders/italics are not clipped. */
  bleed?: number;
}> = ({progress, children, style, bleed = 16}) => {
  const p = Math.min(1, Math.max(0, progress));
  if (p <= 0) return null;
  return (
    <div
      style={{
        display: 'inline-block',
        clipPath: `inset(-0.35em ${(1 - p) * 100}% -0.35em -${bleed}px)`,
        WebkitClipPath: `inset(-0.35em ${(1 - p) * 100}% -0.35em -${bleed}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Soft highlighter swipe behind a word or phrase. */
export const Highlighter: React.FC<{
  progress: number;
  color?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({progress, color = colors.accent, children, style}) => {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <span style={{position: 'relative', display: 'inline-block', ...style}}>
      <span
        style={{
          position: 'absolute',
          left: '-0.18em',
          right: '-0.18em',
          top: '0.12em',
          bottom: '0.06em',
          background: color,
          opacity: 0.28,
          borderRadius: 8,
          transform: `scaleX(${p})`,
          transformOrigin: 'left center',
        }}
      />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

/**
 * SVG version of WriteOn: reveals its children left-to-right through a clip
 * rectangle, which reads as a marker writing the text.
 */
export const WriteOnG: React.FC<{
  progress: number;
  x: number;
  y: number;
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({progress, x, y, width, height, children}) => {
  const rawId = React.useId();
  const id = `wo-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const p = Math.min(1, Math.max(0, progress));
  if (p <= 0) return null;
  return (
    <>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={Math.max(0.001, width * p)} height={height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>{children}</g>
    </>
  );
};
