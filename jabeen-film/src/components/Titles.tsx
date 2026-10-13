import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {PROJECT} from '../config/project';
import type {TextCue} from '../lib/timeline';
import {FPS} from '../lib/timeline';
import {FONT} from '../lib/fonts';
import {GOLD, SHADOW} from '../lib/theme';

const ease = Easing.bezier(0.33, 0, 0.2, 1);

/** In over 1.2 s, out over 0.9 s: blur clears, tracking settles, a small rise. */
const useReveal = (duration: number) => {
  const frame = useCurrentFrame();
  const inn = interpolate(frame, [0, FPS * 1.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const out = interpolate(frame, [duration - FPS * 0.9, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return {a: Math.min(inn, out), inn};
};

const missing = (v: string | null | undefined, label: string) => v ?? `[${label}]`;

const Lockup: React.FC<{cue: TextCue}> = ({cue}) => {
  const {a, inn} = useReveal(cue.duration);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 90}}>
      <div style={{fontFamily: FONT, fontWeight: 300, fontSize: 64, color: '#fff', letterSpacing: `${0.42 - inn * 0.1}em`, opacity: a, filter: `blur(${(1 - inn) * 8}px)`, textShadow: SHADOW, whiteSpace: 'nowrap'}}>
        {missing(PROJECT.companyName, 'COMPANY NAME').toUpperCase()}
        <span style={{color: GOLD, margin: '0 0.6em', fontWeight: 200}}>×</span>
        JABEEN
      </div>
    </AbsoluteFill>
  );
};

const Centered: React.FC<{cue: TextCue; size: number; y: number; weight: number}> = ({cue, size, y, weight}) => {
  const {a, inn} = useReveal(cue.duration);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: y}}>
      <div style={{fontFamily: FONT, fontWeight: weight, fontSize: size, color: '#fff', letterSpacing: `${0.16 - inn * 0.04}em`, opacity: a, transform: `translateY(${(1 - inn) * 12}px)`, textShadow: SHADOW, whiteSpace: 'nowrap'}}>
        {cue.copy}
      </div>
    </AbsoluteFill>
  );
};

/** Lower-left label: thin gold rule, name, optional sub-line. */
export const LowerLabel: React.FC<{title: string; sub?: string | null; duration: number; small?: boolean}> = ({title, sub, duration, small}) => {
  const {a, inn} = useReveal(duration);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, bottom: 110, fontFamily: FONT, color: '#fff', opacity: a, textShadow: SHADOW}}>
        <div style={{width: 64 * inn, height: 1.5, background: GOLD, marginBottom: 18}} />
        <div style={{fontSize: small ? 30 : 40, fontWeight: 300, letterSpacing: '0.28em'}}>{title.toUpperCase()}</div>
        {sub && <div style={{fontSize: small ? 18 : 21, fontWeight: 400, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.75)', marginTop: 10}}>{sub.toUpperCase()}</div>}
      </div>
    </AbsoluteFill>
  );
};

export const TextLayer: React.FC<{cue: TextCue}> = ({cue}) => {
  switch (cue.kind) {
    case 'lockup':
      return <Lockup cue={cue} />;
    case 'subtitle':
      return <Centered cue={cue} size={30} y={70} weight={300} />;
    case 'closing':
      return <Centered cue={cue} size={68} y={0} weight={200} />;
    case 'place':
      return <LowerLabel title={missing(PROJECT.placeLabel, 'NEIGHBOURHOOD NAME')} sub={PROJECT.placeSub} duration={cue.duration} />;
    case 'villaName':
      return <LowerLabel title={cue.villa?.name ? `Villa ${cue.villa.name}` : '[VILLA TYPE NAME]'} duration={cue.duration} />;
    default:
      return null;
  }
};
