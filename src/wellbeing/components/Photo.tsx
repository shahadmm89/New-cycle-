/**
 * A photograph, treated so it belongs to the film.
 *
 * Three things happen to every image here, and they are the difference between
 * "a stock photo on a slide" and a frame of a film:
 *
 *   1. It never stops moving. A slow push toward the subject's face, running
 *      for the whole time the image is on screen. The move is small - a few
 *      percent - because a fast Ken Burns is its own kind of cheap.
 *   2. It is graded toward the navy stage, so cutting between a photograph and
 *      a typographic frame is not a jolt.
 *   3. It is scrimmed at the bottom, so type always has something to sit on and
 *      never needs a box drawn behind it.
 *
 * Images cross-fade rather than cut, and the fade is long. The brief asks for
 * no fast cutting, and for transitions that stay with the narration.
 */
import React from 'react';
import {AbsoluteFill, Img, staticFile, interpolate} from 'remotion';
import type {Still} from '../../config/wellbeing.design';
import {grade} from '../../config/wellbeing.design';
import {useT} from '../timing';

export const Photo: React.FC<{
  still: Still | null;
  /** Scene-relative second the image starts fading in. */
  at: number;
  /** How long the fade in takes. */
  fadeIn?: number;
  /** Scene-relative second it starts fading out. Omit to hold to the end. */
  until?: number;
  fadeOut?: number;
  /** Push-in over the whole visible life of the image, as a scale delta. */
  push?: number;
  /** Starting scale. Above 1 so the push never reveals an edge. */
  from?: number;
  /** Overall opacity ceiling - used to sink an image behind heavy type. */
  maxOpacity?: number;
  /** Extra darkening on top of the standard grade, 0 -> 1. */
  darken?: number;
}> = ({
  still,
  at,
  fadeIn = 1.1,
  until,
  fadeOut = 1.1,
  push = 0.07,
  from = 1.06,
  maxOpacity = 1,
  darken = 0,
}) => {
  const t = useT();

  if (!still) return null;

  const inP = interpolate(t, [at, at + fadeIn], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outP =
    until === undefined
      ? 0
      : interpolate(t, [until, until + fadeOut], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const opacity = Math.max(0, Math.min(inP, 1 - outP)) * maxOpacity;
  if (opacity <= 0.001) return null;

  // The push runs on wall-clock time from the moment the image appears, so it
  // is continuous across the cross-fade rather than restarting.
  const scale = from + Math.max(0, t - at) * (push / 12);

  // Move the frame toward the focal point as it scales, so the subject drifts
  // toward centre rather than out of shot.
  const dx = (0.5 - still.focusX) * (scale - 1) * 1920 * 0.5;
  const dy = (0.5 - still.focusY) * (scale - 1) * 1080 * 0.5;

  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img
          src={staticFile(still.src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale}) translate(${dx}px, ${dy}px)`,
            filter: grade.filter,
            willChange: 'transform',
          }}
        />
      </AbsoluteFill>

      {/* Navy tint: ties the image to the stage. */}
      <AbsoluteFill style={{backgroundColor: grade.tint}} />

      {/* Bottom scrim: what type sits on. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${grade.scrimFrom} 0%, rgba(4,11,26,0.34) 46%, ${grade.scrimTo} 100%)`,
        }}
      />

      {/* Vignette: keeps the eye centre-frame. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 88% at 50% 44%, rgba(0,0,0,0) 42%, ${grade.vignette} 100%)`,
        }}
      />

      {darken > 0 ? (
        <AbsoluteFill style={{backgroundColor: '#040B1A', opacity: darken}} />
      ) : null}
    </AbsoluteFill>
  );
};
