/**
 * SCENE 3 - MARCH: BONUS PAID
 *
 * The wheel stays exactly where scene 2 left it (APRIL at the start marker), so
 * MARCH is visibly the last month of the new cycle. Its segment lights and
 * lifts out of the ring as the label arrives - the wheel itself shows where.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CycleWheel} from '../components/CycleWheel';
import {Display, Label, Rise, Punch} from '../components/Type';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';
import {WHEEL_AT} from '../lib/wheel';

const APRIL = 3;
const MARCH = 2;

export const Scene03March: React.FC = () => {
  const t = useScene().text as Record<string, string>;

  const pMar = useProgress('marLit', 0.5);
  const pMonth = useProgress('monthIn', 0.6);
  const pBonus = useProgress('bonusIn', 0.6);


  return (
    <AbsoluteFill>
      <CycleWheel
        place={WHEEL_AT.hero}
        progress={1}
        rotation={APRIL}
        startColor={colors.accent}
        tones={[
          {index: APRIL, color: colors.accent, amount: 1 - pMar * 0.7},
          {index: MARCH, color: colors.accent, amount: pMar},
        ]}
        lift={[{index: MARCH, amount: pMar, color: colors.accent}]}
      />

      <div style={{position: 'absolute', left: 120, top: 330}}>
        <Label size={30} color={colors.accent}>{t.label}</Label>
      </div>

      <div style={{position: 'absolute', left: 120, top: 420}}>
        <Punch progress={pMonth} from={0.8}>
          <Display size={132} color={colors.accent} glow>{t.month}</Display>
        </Punch>
        <Rise progress={pBonus} distance={20} style={{marginTop: 18}}>
          <Display size={60} color={colors.text}>{t.what}</Display>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
