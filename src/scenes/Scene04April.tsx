/**
 * SCENE 4 - APRIL: MERIT INCREASES, PROMOTION ACTION
 *
 * Focus moves one segment clockwise, from MARCH to APRIL - the start of the
 * new cycle. March keeps a quieter light and steps up into a small note above,
 * so the MARCH -> APRIL order is read off the frame.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CycleWheel} from '../components/CycleWheel';
import {Pointer} from '../components/Pointer';
import {Display, Label, Rise, Punch} from '../components/Type';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';
import {WHEEL, WHEEL_AT, monthPoint} from '../lib/wheel';

const APRIL = 3;
const MARCH = 2;

export const Scene04April: React.FC = () => {
  const t = useScene().text as Record<string, string>;

  const pStep = useProgress('marStep', 0.7);
  const pApr = useProgress('aprLit', 0.5);
  const pPointer = useProgress('pointer', 0.8);
  const pMonth = useProgress('monthIn', 0.6);
  const pMerit = useProgress('meritIn', 0.6);
  const pPromo = useProgress('promotionIn', 0.6);

  const from = monthPoint(WHEEL_AT.hero, APRIL, APRIL, WHEEL.R + 14);

  return (
    <AbsoluteFill>
      <CycleWheel
        place={WHEEL_AT.hero}
        progress={1}
        rotation={APRIL}
        startColor={colors.accent}
        tones={[
          {index: MARCH, color: colors.accent, amount: 1 - pStep * 0.6},
          {index: APRIL, color: colors.accent, amount: 0.3 + pApr * 0.7},
        ]}
      />

      <div style={{position: 'absolute', left: 120, top: 330 - pStep * 80}}>
        <Label size={30} color={colors.accent}>{t.label}</Label>
      </div>

      {/* March, stepped back into a note: what came just before April */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 420 - pStep * 110,
          opacity: 1 - pStep * 0.45,
          transformOrigin: 'left top',
          transform: `scale(${1 - pStep * 0.62})`,
        }}
      >
        <Display size={132} color={colors.accent}>MARCH</Display>
        <Display size={60} color={colors.text} style={{marginTop: 18}}>BONUS PAID</Display>
      </div>

      <Pointer from={from} via={{x: 800, y: 160}} to={{x: 560, y: 470}} progress={pPointer} color={colors.accent} />

      <div style={{position: 'absolute', left: 120, top: 460}}>
        <Punch progress={pMonth} from={0.8}>
          <Display size={132} color={colors.accent} glow>{t.month}</Display>
        </Punch>
        <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10}}>
          <Rise progress={pMerit} distance={20}>
            <Display size={56} color={colors.text}>{t.merit}</Display>
          </Rise>
          <Rise progress={pPromo} distance={20}>
            <Display size={56} color={colors.text}>{t.promotion}</Display>
          </Rise>
        </div>
      </div>
    </AbsoluteFill>
  );
};
