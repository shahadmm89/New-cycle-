/**
 * SCENE 8 - MERIT: 15 MONTHS
 *
 * Back to the wheel. A blue track runs one full lap from JANUARY - twelve
 * months - then a coral track carries on for JANUARY, FEBRUARY and MARCH again,
 * ending exactly where the new cycle starts (APRIL, at the marker). Twelve plus
 * three: the fifteen months are read off the circle, not calculated.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CycleWheel} from '../components/CycleWheel';
import {Body, Display, Label, Rise, Punch} from '../components/Type';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';
import {WHEEL_AT, lerpPlace} from '../lib/wheel';

const APRIL = 3;

export const Scene08Merit: React.FC = () => {
  const t = useScene().text as Record<string, string>;

  const pBack = useProgress('wheelBack', 1.1);
  const pLabel = useProgress('labelIn', 0.5);
  const s12 = useProgress('sweep12', 1.8);
  const s3 = useProgress('sweep3', 1.0);
  const pFifteen = useProgress('fifteenIn', 0.6);
  const pNote = useProgress('noteIn', 0.8);

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

      <div style={{position: 'absolute', left: 120, top: 330}}>
        <Rise progress={pLabel} distance={22}>
          <Label size={30} color={colors.accent}>{t.label}</Label>
        </Rise>
      </div>
      <div style={{position: 'absolute', left: 120, top: 400, width: 820}}>
        <Punch progress={pFifteen} from={0.8}>
          <Display size={120} color={colors.transition}>{t.fifteen}</Display>
        </Punch>
        <Rise progress={pNote} distance={18} style={{marginTop: 28}}>
          <Body size={40} weight={700} color={colors.text} style={{maxWidth: 760}}>{t.note}</Body>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
