/**
 * SCENE 7 - VACATION ALLOWANCE / BASIC SALARY
 *
 * Same timeline again. This time the whole coral band is the subject: January
 * to March runs on the current basic salary, and from APRIL 2027 the new basic
 * salary is reflected.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CycleWheel} from '../components/CycleWheel';
import {TransitionTimeline, nodeX} from '../components/TransitionTimeline';
import {Display, Label, Rise} from '../components/Type';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {colors} from '../lib/theme';
import {WHEEL_AT} from '../lib/wheel';
import {transitionTones} from './Scene05Transition';
import {Callout, Traveller} from './Scene06Leave';

const APRIL = 3;

export const Scene07Allowance: React.FC = () => {
  const t = useScene().text as Record<string, string>;
  // A slow idle drift on the text, so the frame stays alive while the
  // narrator finishes the thought. The wheel and timeline stay put so they
  // line up exactly across the cut.
  const drift = useIdle(0.12, 5);

  const pTitle = useProgress('titleIn', 0.6);
  const pBand = useProgress('bandFocus', 0.6);
  const pBandCallout = useProgress('bandCallout', 0.6);
  const pTravel = useProgress('travel', 1.0);
  const pApr = useProgress('aprCallout', 0.6);

  return (
    <AbsoluteFill>
      <CycleWheel place={WHEEL_AT.corner} progress={1} rotation={APRIL} startColor={colors.accent} tones={transitionTones(1)} />

      <div style={{position: 'absolute', left: 120, top: 96}}>
        <Label size={26} color={colors.transition}>{t.eyebrow}</Label>
      </div>
      <div style={{position: 'absolute', left: 120, top: 142, transform: `translate3d(0, ${drift}px, 0)`}}>
        <Rise progress={pTitle} distance={24}>
          <Display size={76} color={colors.text}>{t.title}</Display>
        </Rise>
      </div>

      <TransitionTimeline
        progress={1}
        band={1}
        april={1}
        focus={{jan: pBand * (1 - pTravel), feb: pBand * (1 - pTravel), mar: pBand * (1 - pTravel), apr: pApr}}
      />
      <Traveller from={nodeX('mar')} to={nodeX('apr')} progress={pTravel} color={colors.accent} />

      <Callout x={nodeX('feb')} width={480} progress={pBandCallout}>
        <Label size={24} color={colors.transition}>{t.bandWhen}</Label>
        <Display size={38} color={colors.text} style={{marginTop: 8}}>{t.bandWhat}</Display>
      </Callout>

      <Callout x={nodeX('apr')} width={440} align="right" progress={pApr}>
        <Label size={24} color={colors.accent}>{t.aprWhen}</Label>
        <Display size={38} color={colors.text} style={{marginTop: 8}}>{t.aprWhat}</Display>
      </Callout>
    </AbsoluteFill>
  );
};
