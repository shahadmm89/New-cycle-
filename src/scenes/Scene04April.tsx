/**
 * SCENE 4 - APRIL: MERIT INCREASES, PROMOTION ACTION
 *
 * Focus moves one segment clockwise, from MARCH to APRIL - the start of the
 * new cycle: March settles back into the ring as April lifts out of it. March keeps a quieter light and steps up into a small note above,
 * so the MARCH -> APRIL order is read off the frame.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CycleWheel} from '../components/CycleWheel';
import {Display, Label, Rise, Punch} from '../components/Type';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {colors} from '../lib/theme';
import {WHEEL_AT} from '../lib/wheel';

const APRIL = 3;
const MARCH = 2;

export const Scene04April: React.FC = () => {
  const t = useScene().text as Record<string, string>;
  // A slow idle drift on the text, so the frame stays alive while the
  // narrator finishes the thought. The wheel and timeline stay put so they
  // line up exactly across the cut.
  const drift = useIdle(0.12, 5);

  const pStep = useProgress('marStep', 0.7);
  const pApr = useProgress('aprLit', 0.5);
  const pMonth = useProgress('monthIn', 0.6);
  const pMerit = useProgress('meritIn', 0.6);
  const pPromo = useProgress('promotionIn', 0.6);


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
        // March settles back into the ring as April lifts out of it.
        lift={[
          {index: MARCH, amount: 1 - pStep, color: colors.accent},
          {index: APRIL, amount: pApr, color: colors.accent},
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

      <div style={{position: 'absolute', left: 120, top: 460, transform: `translate3d(0, ${drift}px, 0)`}}>
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
