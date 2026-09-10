/**
 * Scene wrapper: supplies the scene's config to the timing hooks and applies a
 * short cross-fade + drift at the seams so cuts never feel abrupt.
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {SceneContext} from '../lib/timing';
import type {SceneConfig} from '../config/scenes';
import {TRANSITION} from '../config/scenes';

export const SceneHost: React.FC<{scene: SceneConfig; children: React.ReactNode}> = ({
  scene,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const fade = Math.max(1, Math.round(TRANSITION * fps));

  const opacity = Math.min(
    interpolate(frame, [0, fade], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)}),
    interpolate(frame, [durationInFrames - fade, durationInFrames], [1, 0], {
      extrapolateLeft: 'clamp',
      easing: Easing.in(Easing.quad),
    }),
  );

  // A few pixels of drift keeps consecutive scenes from feeling like slides.
  const drift = interpolate(frame, [0, fade], [16, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <SceneContext.Provider value={scene}>
      <AbsoluteFill style={{opacity, transform: `translateX(${drift}px)`}}>{children}</AbsoluteFill>
    </SceneContext.Provider>
  );
};

/** Full-frame stage with the standard safe-area padding. */
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute', overflow: 'visible'}}>
      {children}
    </svg>
  </AbsoluteFill>
);
