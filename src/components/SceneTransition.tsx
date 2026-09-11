/**
 * Scene wrapper: supplies the scene's config to the timing hooks and handles
 * the seam between scenes.
 *
 * Scenes cross-fade with a small push, so one visual is always arriving as
 * another leaves. Nothing ever cuts to an empty stage.
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

  const inP = interpolate(frame, [0, fade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const outP = interpolate(frame, [durationInFrames - fade, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  const opacity = Math.min(inP, 1 - outP);
  // A small push through Z on the way in and out: the scenes feel like they
  // occupy space rather than stack like slides.
  const scale = 0.985 + inP * 0.015 + outP * 0.022;
  const blur = (1 - inP) * 7 + outP * 7;

  return (
    <SceneContext.Provider value={scene}>
      <AbsoluteFill
        style={{
          opacity,
          transform: `scale(${scale})`,
          filter: blur > 0.25 ? `blur(${blur}px)` : undefined,
          willChange: 'transform, opacity, filter',
        }}
      >
        {children}
      </AbsoluteFill>
    </SceneContext.Provider>
  );
};
