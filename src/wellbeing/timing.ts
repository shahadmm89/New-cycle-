/**
 * Timing helpers for the well-being film.
 *
 * Every scene is rendered inside its own <Sequence>, so useCurrentFrame() is
 * already scene-relative. Scenes therefore never contain absolute times or
 * frame numbers: they ask for the second a *phrase* is spoken, via
 * sayIn(sceneId, phraseId), and animate around that.
 *
 * That indirection is the whole point. Re-record one line and every visual in
 * the film moves with the voice, because nothing is pinned to a number that a
 * human typed.
 */
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';

export const EASE = {
  /** The default. Slow out, no bounce - nothing in this film should feel eager. */
  soft: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.inOut(Easing.cubic),
  out: Easing.out(Easing.cubic),
  linear: (t: number) => t,
} as const;

/** Current time in seconds, relative to the start of this scene. */
export const useT = (): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

/**
 * 0 -> 1 over `duration` seconds starting at `at`. Clamped at both ends, so it
 * is safe to read on any frame.
 */
export const useReveal = (
  at: number,
  duration = 0.85,
  easing: (t: number) => number = EASE.soft,
): number => {
  const t = useT();
  return interpolate(t, [at, at + Math.max(0.001, duration)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
};

/**
 * Rises, holds, falls. For something that appears, is read, and leaves while
 * the scene carries on around it.
 */
export const useWindow = (
  at: number,
  rise: number,
  hold: number,
  fall: number,
  easing: (t: number) => number = EASE.inOut,
): number => {
  const t = useT();
  return interpolate(t, [at, at + rise, at + rise + hold, at + rise + hold + fall], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
};

/** Raw eased progress between two scene-relative second marks. */
export const useSpan = (
  from: number,
  to: number,
  easing: (t: number) => number = EASE.soft,
): number => {
  const t = useT();
  return interpolate(t, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
};

/**
 * Very slow sine drift. Used to keep the stage and the type breathing, so a
 * held frame never looks like a frozen slide.
 */
export const useDrift = (speed = 0.08, amplitude = 1, phase = 0): number => {
  const t = useT();
  return Math.sin((t * speed + phase) * Math.PI * 2) * amplitude;
};
