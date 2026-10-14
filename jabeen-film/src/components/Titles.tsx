import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {PROJECT} from '../config/project';
import type {TextCue} from '../lib/timeline';
import {FPS} from '../lib/timeline';
import {FONT} from '../lib/fonts';
import {GOLD, SHADOW} from '../lib/theme';

/*
 * All copy is Arabic, set right to left. Letter-spacing is never used on
 * Arabic: it breaks the joins between letters. Text arrives by clearing
 * blur and rising a few pixels instead.
 */

const ease = Easing.bezier(0.33, 0, 0.2, 1);

/** In over 1.2 s, out over 0.9 s. */
const useReveal = (duration: number) => {
  const frame = useCurrentFrame();
  const inn = interpolate(frame, [0, FPS * 1.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const out = interpolate(frame, [duration - FPS * 0.9, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return {a: Math.min(inn, out), inn};
};

const missing = (v: string | null | undefined, label: string) => v ?? `[${label}]`;

const base: React.CSSProperties = {fontFamily: FONT, direction: 'rtl', color: '#fff', textShadow: SHADOW, whiteSpace: 'nowrap'};

const Lockup: React.FC<{cue: TextCue}> = ({cue}) => {
  const {a, inn} = useReveal(cue.duration);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 100}}>
      <div style={{...base, fontWeight: 300, fontSize: 76, opacity: a, filter: `blur(${(1 - inn) * 8}px)`, transform: `translateY(${(1 - inn) * 10}px)`}}>
        {missing(PROJECT.companyName, 'اسم الشركة')}
        <span style={{color: GOLD, margin: '0 0.55em', fontWeight: 200}}>×</span>
        {missing(PROJECT.jabeenName, 'جبين – بانتظار الإملاء المعتمد')}
      </div>
    </AbsoluteFill>
  );
};

const Centered: React.FC<{cue: TextCue; copy: string; size: number; y: number; weight: number}> = ({cue, copy, size, y, weight}) => {
  const {a, inn} = useReveal(cue.duration);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: y}}>
      <div style={{...base, fontWeight: weight, fontSize: size, opacity: a, filter: `blur(${(1 - inn) * 5}px)`, transform: `translateY(${(1 - inn) * 12}px)`}}>{copy}</div>
    </AbsoluteFill>
  );
};

/** Lower-right label (where an Arabic reader starts): thin gold rule, name, optional sub-line. */
export const LowerLabel: React.FC<{title: string; sub?: string | null; duration: number; small?: boolean}> = ({title, sub, duration, small}) => {
  const {a, inn} = useReveal(duration);
  return (
    <AbsoluteFill>
      <div style={{...base, position: 'absolute', right: 120, bottom: 104, textAlign: 'right', opacity: a}}>
        <div style={{width: 64 * inn, height: 1.5, background: GOLD, marginBottom: 16, marginLeft: 'auto'}} />
        <div style={{fontSize: small ? 36 : 48, fontWeight: 300}}>{title}</div>
        {sub && <div style={{fontSize: small ? 22 : 26, fontWeight: 300, color: 'rgba(255,255,255,0.78)', marginTop: 6}}>{sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

export const TextLayer: React.FC<{cue: TextCue}> = ({cue}) => {
  switch (cue.kind) {
    case 'lockup':
      return <Lockup cue={cue} />;
    case 'subtitle':
      return <Centered cue={cue} copy={PROJECT.copy.subtitle} size={38} y={90} weight={300} />;
    case 'closing':
      return <Centered cue={cue} copy={PROJECT.copy.closing} size={84} y={0} weight={200} />;
    case 'place':
      return <LowerLabel title={missing(PROJECT.placeLabel, 'اسم الحيّين – بانتظار التأكيد')} sub={PROJECT.placeSub} duration={cue.duration} />;
    case 'villaName':
      return <LowerLabel title={cue.villa?.name ? `فيلا ${cue.villa.name}` : '[اسم نموذج الفيلا]'} duration={cue.duration} />;
    default:
      return null;
  }
};
