/**
 * A raised card with real perspective.
 *
 * All cards share one light source (top-left) and one perspective distance, so
 * the whole film feels like a single physical space rather than a set of
 * unrelated effects.
 */
import React from 'react';
import {colors, depth} from '../lib/theme';

export const Card3D: React.FC<{
  /** 0 -> 1 entrance. */
  progress: number;
  width: number;
  height: number;
  /** Degrees. Positive tilts the right edge away from the viewer. */
  rotateY?: number;
  rotateX?: number;
  /** Accent-tinted rather than neutral. Used for the "new" side. */
  accent?: string;
  /** Entrance direction, in px. */
  from?: {x?: number; y?: number};
  children?: React.ReactNode;
  style?: React.CSSProperties;
  padding?: number;
}> = ({
  progress,
  width,
  height,
  rotateY = 0,
  rotateX = 0,
  accent,
  from = {y: 56},
  children,
  style,
  padding = 44,
}) => {
  const p = Math.min(1, Math.max(0, progress));
  if (p <= 0) return null;
  const tint = accent ?? colors.primary;
  const dx = (1 - p) * (from.x ?? 0);
  const dy = (1 - p) * (from.y ?? 0);

  return (
    <div
      style={{
        width,
        height,
        opacity: p,
        transformStyle: 'preserve-3d',
        transform:
          `perspective(${depth.perspective}px) ` +
          `translate3d(${dx}px, ${dy}px, ${(1 - p) * -140}px) ` +
          `rotateX(${rotateX}deg) rotateY(${rotateY * p}deg)`,
        borderRadius: 26,
        padding,
        boxSizing: 'border-box',
        background: `linear-gradient(157deg, ${colors.surfaceLit} 0%, ${colors.surface} 46%, #091A38 100%)`,
        border: `1.5px solid ${tint}44`,
        boxShadow: `${depth.shadowStrong}, inset 0 1.5px 0 ${tint}55, inset 0 -30px 60px rgba(0,0,0,0.28)`,
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * A flat plinth the hero objects sit on. Gives the scene a floor and stops
 * large type from feeling like it is floating in space.
 */
export const Plinth: React.FC<{
  progress: number;
  width: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({progress, width, color = colors.primary, style}) => {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <div
      style={{
        width: width * p,
        height: 5,
        borderRadius: 4,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        boxShadow: `0 0 40px ${color}66`,
        ...style,
      }}
    />
  );
};
