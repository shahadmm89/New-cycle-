/**
 * SCENE 6 - LEAVE BALANCE
 *
 * The same timeline, untouched, so the cut from scene 5 does not register.
 * JANUARY comes forward with its 3-month balance; a light travels along the
 * rail to APRIL 2027, where the new annual balance begins.
 *
 * Above the rail, the worked example: the three transition months' share of
 * the annual entitlement, per grade band - about 6 or 8 days.
 */
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {CycleWheel} from '../components/CycleWheel';
import {TransitionTimeline, TT, nodeX} from '../components/TransitionTimeline';
import {Body, Display, Label, Rise} from '../components/Type';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {colors} from '../lib/theme';
import {WHEEL_AT} from '../lib/wheel';
import {Formula} from '../components/Formula';
import {examples} from '../config/copy';
import {transitionTones} from './Scene05Transition';

const APRIL = 3;

/** A glow that runs along the rail between two nodes - "and then, from here". */
export const Traveller: React.FC<{from: number; to: number; progress: number; color: string}> = ({from, to, progress, color}) => {
  if (progress <= 0 || progress >= 1) return null;
  const x = interpolate(progress, [0, 1], [from, to]);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 11,
        top: TT.y - 11,
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 24px ${color}, 0 0 48px ${color}88`,
        opacity: Math.sin(Math.PI * progress) * 0.9 + 0.1,
      }}
    />
  );
};

/** A callout under a node. `align` keeps the April one inside the frame. */
export const Callout: React.FC<{x: number; width: number; align?: 'center' | 'right'; progress: number; children: React.ReactNode}> = ({
  x,
  width,
  align = 'center',
  progress,
  children,
}) => (
  <div
    style={{
      position: 'absolute',
      left: align === 'right' ? x + 70 - width : x - width / 2,
      width,
      top: TT.y + 110,
      textAlign: align,
      opacity: progress,
      transform: `translate3d(0, ${(1 - progress) * 18}px, 0)`,
    }}
  >
    {children}
  </div>
);

export const Scene06Leave: React.FC = () => {
  const t = useScene().text as Record<string, string>;
  // A slow idle drift on the text, so the frame stays alive while the
  // example is read. The wheel and timeline stay put across the cut.
  const drift = useIdle(0.12, 5);

  const pTitle = useProgress('titleIn', 0.6);
  const pJan = useProgress('janFocus', 0.6);
  const pJanCallout = useProgress('janCallout', 0.6);
  const pTravel = useProgress('travel', 1.0);
  const pApr = useProgress('aprCallout', 0.6);
  const pBasis = useProgress('basisIn', 0.6);
  const pExample = useProgress('exampleIn', 1.8);

  return (
    <AbsoluteFill>
      <CycleWheel place={WHEEL_AT.corner} progress={1} rotation={APRIL} startColor={colors.accent} tones={transitionTones(1)} />

      <div style={{position: 'absolute', left: 120, top: 96}}>
        <Label size={26} color={colors.transition}>{t.eyebrow}</Label>
      </div>
      <div style={{position: 'absolute', left: 120, top: 142}}>
        <Rise progress={pTitle} distance={24}>
          <Display size={76} color={colors.text}>{t.title}</Display>
        </Rise>
      </div>

      {/* the worked example: 22 or 30 days a year, three months of it */}
      <div style={{position: 'absolute', left: 120, top: 258, opacity: Math.min(1, pExample * 3), transform: `translate3d(0, ${drift}px, 0)`}}>
        <Label size={22} color={colors.transition}>{examples.label}</Label>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12}}>
          {examples.leave.map((row, i) => (
            <div key={row.grade} style={{display: 'flex', alignItems: 'flex-start', gap: 28}}>
              <div style={{width: 300, paddingTop: 12}}>
                <Label size={22} color={colors.textSoft}>{row.grade}</Label>
              </div>
              <Formula
                terms={i === 0 ? row.terms : row.terms.map((t) => ({...t, caption: undefined}))}
                progress={pExample * 1.6 - i * 0.6}
                size={40}
                resultColor={colors.transition}
              />
            </div>
          ))}
        </div>
      </div>

      <TransitionTimeline progress={1} band={1} april={1} focus={{jan: pJan * (1 - pTravel), apr: pApr}} />
      <Traveller from={nodeX('jan')} to={nodeX('apr')} progress={pTravel} color={colors.accent} />

      <Callout x={nodeX('jan')} width={440} progress={pJanCallout}>
        <Display size={38} color={colors.transition}>{t.janWhat}</Display>
      </Callout>

      <Callout x={nodeX('apr')} width={560} align="right" progress={pApr}>
        <Display size={38} color={colors.accent}>{t.aprWhat}</Display>
        <Rise progress={pBasis} distance={12} style={{marginTop: 10}}>
          <Body size={30} weight={600} color={colors.textSoft}>{t.aprBasis}</Body>
        </Rise>
      </Callout>
    </AbsoluteFill>
  );
};
