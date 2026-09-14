/**
 * SCENE 5 - WHAT THE NEW TIMING GIVES US
 *
 * The counterpart to scene 3. There, the timeline picked up two pins for
 * information that is an ESTIMATE when the decision is made. Here it picks up
 * two more, later in the year, for the same information once it is ACTUAL.
 *
 * The comparison is carried by the timeline along the bottom rather than
 * re-stated here, so this frame only has to name the two things and let the
 * forecast line resolve from a projection into a measurement.
 *
 * This is the scene the old "why the change" slide became: the market
 * best-practice point is made in the narration now, not as a headline.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ForecastChart, Tick} from '../components/Icons';
import {Display, Label, Rise} from '../components/Type';
import {Card3D, Plinth} from '../components/Card3D';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {colors} from '../lib/theme';

const Claim: React.FC<{progress: number; text: string}> = ({progress, text}) => (
  <Rise progress={progress} distance={30}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <Tick progress={progress} size={46} />
      <Display size={50} color={colors.text}>{text}</Display>
    </div>
  </Rise>
);

export const Scene05ActualData: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pChart = useProgress('chartIn', 0.6);
  const pData = useProgress('dataIn', 1.2);
  const pAlign = useProgress('alignIn', 2.6);
  const pLabel = useProgress('labelIn', 0.5);
  const p1 = useProgress('line1', 0.7);
  const p2 = useProgress('line2', 0.7);
  const drift = useIdle(0.13, 4);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 96}}>
        <Rise progress={pLabel} distance={22}>
          <Label size={30} color={colors.primary}>{t.label}</Label>
        </Rise>
      </div>

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', marginTop: -70}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 72,
            transform: `translate3d(0, ${drift}px, 0)`,
          }}
        >
          <Card3D progress={pChart} width={520} height={290} rotateY={9} accent={colors.primary} padding={34}>
            <ForecastChart progress={pData} forecast={pAlign} width={452} height={222} forecastColor={colors.accent} />
          </Card3D>

          <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
            <Claim progress={p1} text={t.line1} />
            <Plinth progress={p1} width={660} color={colors.primary} />
            <Claim progress={p2} text={t.line2} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
