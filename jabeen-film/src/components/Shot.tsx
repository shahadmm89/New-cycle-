import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {ASSETS} from '../config/assets';
import {FPS} from '../lib/timeline';
import type {Move, Shot as ShotT} from '../lib/timeline';
import {Placeholder} from './Placeholder';
import {FloorPlanReveal} from './FloorPlanReveal';
import {EndFrame} from './EndFrame';

const ease = Easing.bezier(0.33, 0, 0.2, 1);

/** Virtual camera for stills and placeholders. Video footage carries its own move. */
export const cameraTransform = (move: Move, p: number): string => {
  const t = ease(Math.min(1, Math.max(0, p)));
  const lerp = (a: number, b: number) => a + (b - a) * t;
  switch (move) {
    case 'push':
      return `scale(${lerp(1.02, 1.12)})`;
    case 'descend':
      return `scale(${lerp(1.0, 1.32)}) translateY(${lerp(0, 1.5)}%)`;
    case 'glide':
      return `scale(1.12) translateX(${lerp(3.5, -3.5)}%)`;
    case 'orbit':
      return `scale(1.16) rotate(${lerp(-2.2, 2.2)}deg) translateX(${lerp(1.5, -1.5)}%)`;
    case 'crane':
      return `scale(1.12) translateY(${lerp(3, -3)}%)`;
    case 'craneUp':
      return `scale(${lerp(1.28, 1.0)})`;
    default:
      return 'none';
  }
};

type Props = {shot: ShotT; /** frames this layer lives for, incl. both overlaps */ life: number; animatic: boolean};

export const Shot: React.FC<Props> = ({shot, life, animatic}) => {
  const frame = useCurrentFrame();
  const {overlap, transitionIn} = shot;
  // 0..1 across the whole time the shot is visible, for the camera move.
  const p = frame / Math.max(1, life);
  const fadeIn = overlap > 0 ? interpolate(frame, [0, overlap], [0, 1], {extrapolateRight: 'clamp', easing: ease}) : 1;

  let body: React.ReactNode;
  if (shot.move === 'floorPlan') {
    body = <FloorPlanReveal shot={shot} />;
  } else if (shot.move === 'endFrame') {
    body = <EndFrame animatic={animatic} />;
  } else {
    const asset = ASSETS[shot.slot];
    if (asset?.kind === 'video') {
      body = (
        <OffthreadVideo
          src={staticFile(asset.src)}
          startFrom={Math.round((asset.trimStart ?? 0) * FPS)}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      );
    } else if (asset?.kind === 'image') {
      body = (
        <AbsoluteFill style={{transform: cameraTransform(shot.move, p)}}>
          <Img src={staticFile(asset.src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      );
    } else {
      body = <Placeholder shot={shot} progress={p} />;
    }
  }

  // Transition treatments laid over the incoming shot while it fades in.
  const mid = overlap > 0 ? interpolate(frame, [0, overlap / 2, overlap], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const bloom = transitionIn === 'threshold' ? `brightness(${1 + mid * 0.9})` : undefined;

  return (
    <AbsoluteFill style={{opacity: transitionIn === 'fadeFromBlack' ? 1 : fadeIn, filter: bloom}}>
      {body}
      {transitionIn === 'fadeFromBlack' && <AbsoluteFill style={{background: '#000', opacity: 1 - fadeIn}} />}
      {transitionIn === 'cloudWipe' && mid > 0 && (
        <AbsoluteFill
          style={{
            background: 'radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.95) 0%, rgba(240,244,248,0.85) 45%, rgba(220,228,236,0.0) 85%)',
            opacity: mid,
            transform: `scale(${1 + mid * 0.4})`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
