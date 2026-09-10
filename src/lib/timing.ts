/**
 * Timing helpers.
 *
 * Scenes never contain magic frame numbers. They ask for a *named beat* that is
 * declared in src/config/scenes.ts, in seconds, relative to the start of the
 * scene. Swapping the voice-over therefore means editing the config only.
 */
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {createContext, useContext} from 'react';
import type {SceneConfig} from '../config/scenes';

export const SceneContext = createContext<SceneConfig | null>(null);

export const useScene = (): SceneConfig => {
  const scene = useContext(SceneContext);
  if (!scene) throw new Error('useScene() must be used inside a <SceneHost>');
  return scene;
};

/** Seconds -> frames, using the composition frame rate. */
export const useSeconds = () => {
  const {fps} = useVideoConfig();
  return (seconds: number) => Math.round(seconds * fps);
};

/** Frame at which a named beat of the current scene fires. */
export const useBeat = (name: string): number => {
  const scene = useScene();
  const {fps} = useVideoConfig();
  const seconds = scene.beats[name];
  if (seconds === undefined) {
    throw new Error(`Scene "${scene.id}" has no beat named "${name}". Add it to src/config/scenes.ts`);
  }
  return Math.round(seconds * fps);
};

export const EASE = {
  out: Easing.out(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  soft: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

/**
 * 0 -> 1 progress for an animation that starts at a named beat and lasts
 * `duration` seconds. Clamped at both ends so it is safe to read any frame.
 */
export const useProgress = (
  beatName: string,
  durationSeconds = 0.6,
  easing: (t: number) => number = EASE.soft,
): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = useBeat(beatName);
  const len = Math.max(1, Math.round(durationSeconds * fps));
  return interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
};

/** Progress that rises, holds, then falls - handy for temporary highlights. */
export const usePulse = (beatName: string, riseS = 0.4, holdS = 1.2, fallS = 0.5): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useBeat(beatName);
  const r = Math.round(riseS * fps);
  const h = Math.round(holdS * fps);
  const f = Math.round(fallS * fps);
  return interpolate(frame, [s, s + r, s + r + h, s + r + h + f], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.inOut,
  });
};

/** Raw progress between two absolute (scene-relative) second marks. */
export const useSpan = (
  fromSeconds: number,
  toSeconds: number,
  easing: (t: number) => number = EASE.soft,
): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return interpolate(frame, [fromSeconds * fps, toSeconds * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
};

/** Gentle, non-distracting idle motion (breathing / drifting). */
export const useIdle = (speed = 1, amplitude = 1, phase = 0): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return Math.sin(((frame / fps) * speed + phase) * Math.PI * 2) * amplitude;
};
