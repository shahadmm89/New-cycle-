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
import {useProgress, useScene, useIdle} from '../lib/timing';
import {Breathe} from '../components/Breathe';
import {colors} from '../lib/theme';
import {WHEEL_AT, lerpPlace} from '../lib/wheel';

const APRIL = 3;

export const Scene08Merit: React.FC = () => {
  const t = useScene().text as Record<string, string>;
  // A slow breathing glow behind the content keeps the frame alive to the
  // end of the line. Only its brightness changes - the text never moves, so
  // letter edges stay perfectly still.
  const breath = useIdle(0.12, 1);

  const pBack = useProgress('wheelBack', 1.1);
  const pLabel = useProgress('labelIn', 0.5);
  const s12 = useProgress('sweep12', 1.2);
  const s3 = useProgress('sweep3', 0.9);
  const pFifteen = useProgress('fifteenIn', 0.6);
  const pNote = useProgress('noteIn', 0.8);

  const months = Math.round(12 * s12 + 3 * s3);

  return (
    <AbsoluteFill>
      <Breathe x={460} y={480} phase={breath} color={colors.accent} />
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

      <div style={{position: 'absolute', left: 120, top: 300, width: 820}}>
        <Rise progress={pLabel} distance={22}>
          <Label size={30} color={colors.accent}>{t.label}</Label>
        </Rise>
        <div style={{marginTop: 18}}>
          <Punch progress={pFifteen} from={0.8}>
            <Display size={120} color={colors.transition}>{t.fifteen}</Display>
          </Punch>
        </div>
        <Rise progress={pNote} distance={18} style={{marginTop: 34}}>
          <Body size={38} weight={700} color={colors.text} style={{maxWidth: 760}}>{t.note}</Body>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
