/**
 * Typography for a screen you might be standing six metres from.
 *
 * Every text element here enters with motion - a rise, a wipe or a scale -
 * because on signage a static word is a word nobody notices.
 */
import React from 'react';
import {colors, fonts, type as scale} from '../lib/theme';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** Rises and fades in. The default entrance for almost everything. */
export const Rise: React.FC<{
  progress: number;
  children: React.ReactNode;
  distance?: number;
  blur?: boolean;
  style?: React.CSSProperties;
}> = ({progress, children, distance = 42, blur = true, style}) => {
  const p = clamp(progress);
  if (p <= 0) return null;
  return (
    <div
      style={{
        opacity: p,
        transform: `translate3d(0, ${(1 - p) * distance}px, 0)`,
        filter: blur && p < 1 ? `blur(${(1 - p) * 9}px)` : undefined,
        willChange: 'transform, opacity, filter',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Scales up from slightly small, with an accent glow. Used for hero numbers. */
export const Punch: React.FC<{
  progress: number;
  children: React.ReactNode;
  from?: number;
  style?: React.CSSProperties;
}> = ({progress, children, from = 0.72, style}) => {
  const p = clamp(progress);
  if (p <= 0) return null;
  // Slight overshoot so it lands rather than arrives.
  const eased = p < 1 ? 1 - Math.pow(1 - p, 3) : 1;
  const s = from + (1 - from) * eased + Math.sin(Math.PI * eased) * 0.045;
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.6),
        transform: `scale(${s})`,
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Left-to-right reveal through a mask. Reads as the line being "drawn on". */
export const Wipe: React.FC<{
  progress: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({progress, children, style}) => {
  const p = clamp(progress);
  if (p <= 0) return null;
  return (
    <div
      style={{
        display: 'inline-block',
        clipPath: `inset(-0.4em ${(1 - p) * 100}% -0.4em -0.12em)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Small uppercase eyebrow label. */
export const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({children, color = colors.textSoft, size = scale.label, style}) => (
  <div
    style={{
      fontFamily: fonts.body,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: size * 0.19,
      textTransform: 'uppercase',
      color,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Big display type: months, dates, ranges. */
export const Display: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({children, size = scale.display, color = colors.text, weight = 800, glow = false, style}) => (
  <div
    style={{
      fontFamily: fonts.display,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 0.98,
      letterSpacing: -size * 0.018,
      color,
      whiteSpace: 'nowrap',
      textShadow: glow ? `0 0 ${size * 0.4}px ${colors.accentGlow}, 0 10px 34px rgba(0,0,0,0.5)` : '0 10px 34px rgba(0,0,0,0.45)',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Sentence-level text. Kept rare - the voice-over carries the detail. */
export const Body: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({children, size = scale.body, color = colors.textSoft, weight = 600, style}) => (
  <div
    style={{
      fontFamily: fonts.body,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.24,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Pill badge: NO CHANGE / NEW / EFFECTIVE APRIL 1. */
export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  filled?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({children, color = colors.accent, filled = true, size = 34, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.4,
      fontFamily: fonts.body,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: size * 0.14,
      textTransform: 'uppercase',
      color: filled ? colors.background : color,
      background: filled ? color : 'transparent',
      border: `3px solid ${color}`,
      borderRadius: 999,
      padding: `${size * 0.38}px ${size * 0.86}px`,
      whiteSpace: 'nowrap',
      boxShadow: filled ? `0 12px 40px ${color}44` : 'none',
      ...style,
    }}
  >
    {children}
  </div>
);
