/**
 * SCENE 10 - WHY THE CHANGE
 * Short by design. Two claims, one chart, then out.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ForecastChart} from '../components/Icons';
import {Display, Rise} from '../components/Type';
import {Card3D, Plinth} from '../components/Card3D';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {colors} from '../lib/theme';

export const Scene10Why: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pChart = useProgress('chartIn', 0.6);
  const pData = useProgress('dataIn', 1.2);
  const pAlign = useProgress('alignIn', 2.6);
  const p1 = useProgress('line1', 0.6);
  const p2 = useProgress('line2', 0.7);
  // Nothing in this scene moves after the last claim lands, and the narrator
  // is still talking. A drift, as in scenes 1 and 5, keeps it breathing.
  const drift = useIdle(0.13, 4);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 72,
          marginTop: -24,
          transform: `translate3d(0, ${drift}px, 0)`,
        }}
      >
        <Card3D progress={pChart} width={560} height={310} rotateY={9} accent={colors.primary} padding={36}>
          <ForecastChart progress={pData} forecast={pAlign} width={486} height={236} forecastColor={colors.accent} />
        </Card3D>

        <div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
          <Rise progress={p1} distance={34}>
            <Display size={56} color={colors.text}>{t.line1}</Display>
          </Rise>
          <Plinth progress={p1} width={700} color={colors.primary} />
          <Rise progress={p2} distance={34}>
            <Display size={56} color={colors.accent}>{t.line2}</Display>
          </Rise>
        </div>
      </div>
    </AbsoluteFill>
  );
};
