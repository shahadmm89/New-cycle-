/**
 * SCENE 2 - THE CYCLE SHIFTS
 *
 * The annual cycle wheel arrives with JANUARY lit at the start marker: the
 * cycle as it runs today, JANUARY -> DECEMBER. Then the wheel turns a quarter,
 * three months, and APRIL comes to the marker. Same twelve months, new start:
 * APRIL -> MARCH. Nothing else happens in the frame - the turn is the message.
 */
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {CycleWheel} from '../components/CycleWheel';
import {Label, Rise, Display} from '../components/Type';
import {useProgress, useBeat, useScene} from '../lib/timing';
import {colors} from '../lib/theme';
import {WHEEL_AT} from '../lib/wheel';

/** April is three months past January. */
const APRIL = 3;

export const Scene02Cycle: React.FC = () => {
  const t = useScene().text as Record<string, string>;
  const frame = useCurrentFrame();

  const pWheel = useProgress('wheelIn', 0.9);
  const pJan = useProgress('janLit', 0.6);
  const pOld = useProgress('oldRangeIn', 0.6);
  const pNew = useProgress('newRangeIn', 0.7);
  const pApr = useProgress('aprLit', 0.6);

  // The turn: slow away, settling firmly on April. One quarter, no extra
  // spins - a year shifting, not a dial being wound.
  const spinAt = useBeat('spin');
  const spin = interpolate(frame, [spinAt, spinAt + 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.55, 0, 0.2, 1),
  });

  const showNew = spin > 0.55;

  return (
    <AbsoluteFill>
      <CycleWheel
        place={WHEEL_AT.hero}
        progress={pWheel}
        rotation={spin * APRIL}
        startColor={showNew ? colors.accent : colors.primary}
        tones={[
          {index: 0, color: colors.primary, amount: pJan * (1 - spin)},
          {index: APRIL, color: colors.accent, amount: pApr},
        ]}
      />

      <div style={{position: 'absolute', left: 120, top: 330, width: 820, height: 320}}>
        {/* today */}
        <div style={{position: 'absolute', inset: 0, opacity: 1 - spin, transform: `translate3d(0, ${spin * -40}px, 0)`}}>
          <Rise progress={pOld} distance={22}>
            <Label size={30} color={colors.primary}>{t.oldLabel}</Label>
          </Rise>
          <div style={{marginTop: 22}}>
            <Rise progress={pOld} distance={26}>
              <Display size={66} color={colors.textSoft}>{t.oldFrom} &ndash; {t.oldTo}</Display>
            </Rise>
          </div>
        </div>
        {/* the new proposed cycle */}
        <div style={{position: 'absolute', inset: 0, opacity: pNew, transform: `translate3d(0, ${(1 - pNew) * 40}px, 0)`}}>
          <Label size={30} color={colors.accent}>{t.newLabel}</Label>
          <div style={{marginTop: 22}}>
            <Display size={66} color={colors.accent} glow>{t.newFrom} &ndash; {t.newTo}</Display>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
