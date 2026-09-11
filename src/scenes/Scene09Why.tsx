/**
 * SCENE 9 - WHY THE CHANGE
 * Short by design. Two claims, one chart, then out.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ForecastChart} from '../components/Icons';
import {Display, Rise} from '../components/Type';
import {Card3D, Plinth} from '../components/Card3D';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';

export const Scene09Why: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pChart = useProgress('chartIn', 0.6);
  const pData = useProgress('dataIn', 1.2);
  const pAlign = useProgress('alignIn', 0.8);
  const p1 = useProgress('line1', 0.6);
  const p2 = useProgress('line2', 0.6);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 72, marginTop: -24}}>
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
