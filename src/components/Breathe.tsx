/**
 * A soft glow that slowly brightens and dims behind a block of content.
 *
 * It keeps a frame alive while the narrator finishes a thought WITHOUT moving
 * any text: moving type by fractions of a pixel every frame makes letter
 * edges shimmer, which reads as shaking on a large screen. Only this glow's
 * opacity changes, so everything readable stays perfectly still.
 */
import React from 'react';

export const Breathe: React.FC<{
  /** Centre of the glow, frame space. */
  x: number;
  y: number;
  /** -1 -> 1, from useIdle in the scene. */
  phase: number;
  color: string;
  size?: number;
}> = ({x, y, phase, color, size = 900}) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}26 0%, ${color}0d 45%, transparent 70%)`,
      opacity: 0.55 + 0.45 * phase,
      pointerEvents: 'none',
    }}
  />
);
