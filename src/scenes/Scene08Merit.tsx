/**
 * SCENE 8 - MERIT: 15 MONTHS
 *
 * Back to the wheel. A blue track runs one full lap from JANUARY - twelve
 * months - then a coral track carries on for JANUARY, FEBRUARY and MARCH again,
 * ending exactly where the new cycle starts (APRIL, at the marker). Twelve plus
 * three: the fifteen months are read off the circle first.
 *
 * Then the worked example: an illustrative 5% merit, divided by 12 and
 * multiplied by the 15 months it now covers - 6.25%, labelled OVER 15 MONTHS
 * so it cannot be read as a new rate, and followed by the reminder that the
 * percentage itself does not change.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CycleWheel} from '../components/CycleWheel';
import {Body, Display, Label, Rise, Punch} from '../components/Type';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {colors} from '../lib/theme';
import {WHEEL_AT, lerpPlace} from '../lib/wheel';
import {Formula} from '../components/Formula';
import {examples} from '../config/copy';

const APRIL = 3;

export const Scene08Merit: React.FC = () => {
  const t = useScene().text as Record<string, string>;
  // A slow idle drift on the text, so the frame stays alive while the
  // narrator finishes the thought. The wheel and timeline stay put so they
  // line up exactly across the cut.
  const drift = useIdle(0.12, 5);

  const pBack = useProgress('wheelBack', 1.1);
  const pLabel = useProgress('labelIn', 0.5);
  const s12 = useProgress('sweep12', 1.2);
  const s3 = useProgress('sweep3', 0.9);
  const pFifteen = useProgress('fifteenIn', 0.6);
  const pNote = useProgress('noteIn', 0.8);
  const pExample = useProgress('exampleIn', 1.8);

  const months = Math.round(12 * s12 + 3 * s3);

  return (
    <AbsoluteFill>
      <CycleWheel
        place={lerpPlace(WHEEL_AT.corner, WHEEL_AT.hero, pBack)}
        progress={1}
        rotation={APRIL}
        startColor={colors.accent}
        tones={[
          {index: APRIL, color: colors.accent, amount: 0.8 * (1 - pBack) + 0.25},
          ...[0, 1, 2].map((index) => ({index, color: colors.transition, amount: Math.max(1 - pBack, s3)})),
        ]}
        sweepFrom={0}
        sweep12={s12}
        sweep3={s3}
        centreFigure={s12 > 0 ? String(months) : undefined}
        centre={s12 > 0 ? ['MONTHS'] : undefined}
        centreColor={s3 > 0.5 ? colors.transition : colors.textSoft}
      />

      <div style={{position: 'absolute', left: 120, top: 236, width: 820, transform: `translate3d(0, ${drift}px, 0)`}}>
        <Rise progress={pLabel} distance={22}>
          <Label size={30} color={colors.accent}>{t.label}</Label>
        </Rise>
        <div style={{marginTop: 18}}>
          <Punch progress={pFifteen} from={0.8}>
            <Display size={112} color={colors.transition}>{t.fifteen}</Display>
          </Punch>
        </div>
        <div style={{marginTop: 34, opacity: Math.min(1, pExample * 3)}}>
          <Label size={22} color={colors.muted}>{examples.label}</Label>
          <div style={{marginTop: 12}}>
            <Formula terms={examples.merit.terms} progress={pExample} size={52} resultColor={colors.accent} />
          </div>
        </div>
        <Rise progress={pNote} distance={18} style={{marginTop: 34}}>
          <Body size={38} weight={700} color={colors.text} style={{maxWidth: 760}}>{t.note}</Body>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
