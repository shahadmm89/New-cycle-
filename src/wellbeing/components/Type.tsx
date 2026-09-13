/**
 * Typography for the well-being film.
 *
 * The salary-cycle film shouted, because it was signage. This one talks. The
 * type is still large - it has to survive a canteen screen - but it enters
 * gently, holds still while it is read, and leaves without a flourish.
 *
 * Every entrance here is a rise-and-fade of a few dozen pixels over the best
 * part of a second. There are no slides, spins, letter-by-letter typewriters or
 * bounces anywhere in this film, and that is deliberate: the brief asks for
 * something sincere, and motion is the fastest way to sound insincere.
 */
import React from 'react';
import {fonts} from '../../lib/theme';
import {wb} from '../../config/wellbeing.design';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * The default entrance: rise, fade, and a touch of blur clearing.
 * `p` is a 0 -> 1 progress from one of the timing hooks.
 *
 * It always occupies its space, even at zero opacity, and that is the whole
 * point of the component. An earlier version returned null until it had
 * something to show, which meant every list in the film re-flowed the instant
 * a new line began to appear - the four groups in scene 3 shunted the heading
 * upward four times, once per line. Reserving the space means the lines simply
 * fade up into a layout that was already settled.
 */
export const Enter: React.FC<{
  p: number;
  children: React.ReactNode;
  distance?: number;
  blur?: number;
  style?: React.CSSProperties;
}> = ({p, children, distance = 34, blur = 7, style}) => {
  const v = clamp01(p);
  return (
    <div
      style={{
        opacity: v,
        transform: `translate3d(0, ${(1 - v) * distance}px, 0)`,
        filter: v > 0.001 && v < 0.995 && blur > 0 ? `blur(${(1 - v) * blur}px)` : undefined,
        willChange: 'transform, opacity, filter',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * The film's principal statement type: one short sentence, very large, with a
 * lot of air around it. Used for the five moments the brief asks to land.
 */
export const Statement: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({children, size = 104, color = wb.text, weight = 800, style}) => (
  <div
    style={{
      fontFamily: fonts.display,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.07,
      letterSpacing: -size * 0.02,
      color,
      textShadow: '0 14px 46px rgba(0,0,0,0.55)',
      textWrap: 'balance',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small uppercase label. The quiet voice in the layout. */
export const Eyebrow: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({children, color = wb.textSoft, size = 26, style}) => (
  <div
    style={{
      fontFamily: fonts.body,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: size * 0.28,
      textTransform: 'uppercase',
      color,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

/** A supporting sentence. Never more than two lines anywhere in the film. */
export const Supporting: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, size = 38, color = wb.textSoft, style}) => (
  <div
    style={{
      fontFamily: fonts.body,
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.42,
      color,
      textShadow: '0 6px 24px rgba(0,0,0,0.45)',
      textWrap: 'balance',
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * A rule that draws itself left to right.
 *
 * It is the only decorative element in the film, and it earns its place by
 * doing one job: marking that a statement has finished arriving.
 */
export const Rule: React.FC<{
  p: number;
  width?: number;
  color?: string;
  thickness?: number;
  style?: React.CSSProperties;
}> = ({p, width = 210, color = wb.accent, thickness = 6, style}) => {
  const v = clamp01(p);
  return (
    <div
      style={{
        width: width * v,
        height: thickness,
        background: color,
        borderRadius: thickness,
        boxShadow: `0 0 26px ${color}66`,
        ...style,
      }}
    />
  );
};
