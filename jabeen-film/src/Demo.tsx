import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import demo from '../demo/shots.json';
import {FPS} from './lib/timeline';
import {loadFonts} from './lib/fonts';
import {EndFrame} from './components/EndFrame';
import {LowerLabel, TextLayer} from './components/Titles';
import type {TextCue} from './lib/timeline';

loadFonts();

/*
 * Free in-Claude demo: the depth-parallax clips from render/parallax.py
 * (demo/shots.json), joined with 1 s dissolves, a light-bloom "threshold"
 * from the gate into the living room, Arabic labels and the end frame.
 * Only confirmed wording is shown (no company name until it is approved).
 */

const XF = FPS; // 1 s dissolve between shots
const END = 7 * FPS;

type Label = {title: string; sub?: string};
const LABELS: Record<string, Label> = {
  'd03-location-map': {title: 'مدينة ينبع الصناعية', sub: 'الهيئة الملكية بينبع'},
  'd04-plaza': {title: 'حي العزيزية  ·  حي النخيل', sub: 'مجتمعات سمو'},
  'd08-living-enter': {title: 'الصالة'},
  'd11-dining': {title: 'غرفة الطعام'},
  'd12-bedroom': {title: 'غرفة النوم الرئيسية'},
  'd13-plan-aziziyah': {title: 'العزيزية'},
  'd14-plan-nakheel': {title: 'النخيل'},
};
const TITLES: Record<string, TextCue> = {
  'd02-aerial-glide': {kind: 'subtitleHero', from: 0, duration: 0},
  'd17-nakheel-dusk-rise': {kind: 'closing', from: 0, duration: 0},
};

export const DEMO_SHOTS = demo.shots.map((s, i) => {
  const dur = Math.round(s.dur * FPS);
  return {id: s.id, dur, from: 0, index: i};
});
let cursor = 0;
for (const s of DEMO_SHOTS) {
  s.from = cursor;
  cursor += s.dur - XF;
}
export const DEMO_TOTAL = cursor + XF + END - XF;

const GRAPHICS = new Set(['d03-location-map', 'd13-plan-aziziyah', 'd14-plan-nakheel']);

const Clip: React.FC<{id: string; dur: number; first: boolean; threshold: boolean}> = ({id, dur, first, threshold}) => {
  const f = useCurrentFrame();
  const fadeIn = first ? interpolate(f, [0, 1.5 * FPS], [0, 1], {extrapolateRight: 'clamp'}) : interpolate(f, [0, XF], [0, 1], {extrapolateRight: 'clamp', easing: Easing.bezier(0.33, 0, 0.2, 1)});
  const bloom = threshold ? interpolate(f, [0, XF / 2, XF], [1.0, 1.9, 1.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return (
    <AbsoluteFill style={{opacity: first ? 1 : fadeIn, filter: bloom !== 1 ? `brightness(${bloom})` : undefined}}>
      <OffthreadVideo src={staticFile(`demo/clips/${id}.mp4`)} muted style={{width: '100%', height: '100%'}} />
      {first && <AbsoluteFill style={{background: '#000', opacity: 1 - fadeIn}} />}
      {!GRAPHICS.has(id) && <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.28) 100%)'}} />}
      {void dur}
    </AbsoluteFill>
  );
};

export const Demo: React.FC<{music: string | null}> = ({music}) => {
  const last = DEMO_SHOTS[DEMO_SHOTS.length - 1];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {DEMO_SHOTS.map((s, i) => {
        const label = LABELS[s.id];
        const title = TITLES[s.id];
        const textDur = s.dur - 2 * XF;
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
            <Clip id={s.id} dur={s.dur} first={i === 0} threshold={s.id === 'd08-living-enter'} />
            {label && (
              <Sequence from={Math.round(1.2 * FPS)} durationInFrames={textDur}>
                <LowerLabel title={label.title} sub={label.sub} duration={textDur} small={!label.sub} dark={GRAPHICS.has(s.id)} />
              </Sequence>
            )}
            {title && (
              <Sequence from={Math.round(2 * FPS)} durationInFrames={s.dur - Math.round(4 * FPS)}>
                <TextLayer cue={{...title, duration: s.dur - Math.round(4 * FPS)}} />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      <Sequence from={last.from + last.dur - XF} durationInFrames={END} name="end frame">
        <EndFrameFade />
      </Sequence>
      {music && (
        <Audio
          src={staticFile(music)}
          volume={(f) => 0.55 * interpolate(f, [0, FPS, DEMO_TOTAL - 3 * FPS, DEMO_TOTAL], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
        />
      )}
    </AbsoluteFill>
  );
};

const EndFrameFade: React.FC = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, XF], [0, 1], {extrapolateRight: 'clamp'});
  const out = interpolate(f, [END - 1.2 * FPS, END], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: a}}>
      <EndFrame animatic={false} logoOnly />
      <AbsoluteFill style={{background: '#000', opacity: 1 - out}} />
    </AbsoluteFill>
  );
};
