/**
 * SCENE 7 - VACATION ALLOWANCE / BASIC SALARY
 *
 * Same timeline again. This time the whole coral band is the subject: January
 * to March runs on the current basic salary, and from APRIL 2027 the new basic
 * salary is reflected.
 *
 * Above the rail, the worked example for the first quarter: basic salary x the
 * vacation allowance percentage / 12 x 3 months.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CycleWheel} from '../components/CycleWheel';
import {TransitionTimeline, nodeX} from '../components/TransitionTimeline';
import {Display, Label, Rise} from '../components/Type';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {Breathe} from '../components/Breathe';
import {colors} from '../lib/theme';
import {WHEEL_AT} from '../lib/wheel';
import {Formula} from '../components/Formula';
import {examples} from '../config/copy';
import {transitionTones} from './Scene05Transition';
import {Callout, Traveller} from './Scene06Leave';

const APRIL = 3;

export const Scene07Allowance: React.FC = () => {
  const t = useScene().text as Record<string, string>;
  // A slow breathing glow behind the content keeps the frame alive to the
  // end of the line. Only its brightness changes - the text never moves, so
  // letter edges stay perfectly still.
  const breath = useIdle(0.12, 1);

  const pTitle = useProgress('titleIn', 0.6);
  const pBand = useProgress('bandFocus', 0.6);
  const pBandCallout = useProgress('bandCallout', 0.6);
  const pTravel = useProgress('travel', 1.0);
  const pApr = useProgress('aprCallout', 0.6);
  const pExample = useProgress('exampleIn', 1.8);

  return (
    <AbsoluteFill>
      <Breathe x={700} y={280} phase={breath} color={colors.transition} />
      <CycleWheel place={WHEEL_AT.corner} progress={1} rotation={APRIL} startColor={colors.accent} tones={transitionTones(1)} />

      <div style={{position: 'absolute', left: 120, top: 96}}>
        <Label size={26} color={colors.transition}>{t.eyebrow}</Label>
      </div>
      <div style={{position: 'absolute', left: 120, top: 142}}>
        <Rise progress={pTitle} distance={24}>
          <Display size={76} color={colors.text}>{t.title}</Display>
        </Rise>
      </div>

      {/* the worked example: the first quarter, on the current basic salary */}
      <div style={{position: 'absolute', left: 120, top: 258, opacity: Math.min(1, pExample * 3)}}>
        <Label size={22} color={colors.transition}>{`${examples.label}  \u00B7  ${examples.allowance.caption}`}</Label>
        <div style={{marginTop: 14}}>
          <Formula terms={examples.allowance.terms} progress={pExample} size={44} resultColor={colors.transition} />
        </div>
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
