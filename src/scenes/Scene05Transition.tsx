/**
 * SCENE 5 - THE 2027 IMPLEMENTATION YEAR
 *
 * The wheel steps back to the corner - still there, still APRIL -> MARCH - and
 * a timeline takes the frame: 2026, DECEMBER, then JANUARY-MARCH in the coral
 * transition colour, then APRIL 2027 in amber. The coral band IS the
 * implementation-year transition; nothing else needs saying on screen.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CycleWheel} from '../components/CycleWheel';
import {TransitionTimeline} from '../components/TransitionTimeline';
import {Display, Rise} from '../components/Type';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {Breathe} from '../components/Breathe';
import {colors} from '../lib/theme';
import {WHEEL_AT, lerpPlace} from '../lib/wheel';

const APRIL = 3;

/** The months the coral band covers, lit on the wheel too, so the two visuals agree. */
export const transitionTones = (amount: number) => [
  {index: APRIL, color: colors.accent, amount: 0.8},
  ...[0, 1, 2].map((index) => ({index, color: colors.transition, amount})),
];

export const Scene05Transition: React.FC = () => {
  const t = useScene().text as Record<string, string>;
  // A slow breathing glow behind the content keeps the frame alive to the
  // end of the line. Only its brightness changes - the text never moves, so
  // letter edges stay perfectly still.
  const breath = useIdle(0.12, 1);

  const pAway = useProgress('wheelAway', 1.1);
  const pTitle = useProgress('titleIn', 0.6);
  const pRail = useProgress('railIn', 1.6);
  const pBand = useProgress('bandIn', 0.9);
  const pApril = useProgress('aprilIn', 0.7);

  return (
    <AbsoluteFill>
      <Breathe x={560} y={200} phase={breath} color={colors.transition} />
      <CycleWheel
        place={lerpPlace(WHEEL_AT.hero, WHEEL_AT.corner, pAway)}
        progress={1}
        rotation={APRIL}
        startColor={colors.accent}
        tones={transitionTones(pBand)}
      />

      <div style={{position: 'absolute', left: 120, top: 130}}>
        <Rise progress={pTitle} distance={24}>
          <Display size={76} color={colors.text}>{t.title}</Display>
        </Rise>
      </div>

      <TransitionTimeline progress={pRail} band={pBand} april={pApril} bandLabel={t.band} />
    </AbsoluteFill>
  );
};
