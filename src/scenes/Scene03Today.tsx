/**
 * SCENE 3 - HOW MERIT AND BONUS ARE SET TODAY
 *
 * Two halves. Merit gets a forecast line; bonus gets the three key company
 * KPIs, which then converge into a single company-performance figure. That
 * convergence is the whole idea of the section: three separate measures rolling
 * up into one number the bonus is estimated from.
 *
 * Neutral in tone - this is the current state, not a problem being fixed.
 */
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Card3D} from '../components/Card3D';
import {MeritIcon, BonusIcon, ForecastChart, KpiTrio} from '../components/Icons';
import {Display, Label, Body, Rise} from '../components/Type';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';

export const Scene03Today: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string | string[]>;

  const pLabel = useProgress('label', 0.45);
  const pMerit = useProgress('meritCard', 0.6);
  const pChart = useProgress('meritChart', 1.1);
  const pForecast = useProgress('meritForecast', 0.8);
  const pMeritLabel = useProgress('meritLabel', 0.5);
  const pBonus = useProgress('bonusCard', 0.6);
  const k1 = useProgress('kpi1', 0.5);
  const k2 = useProgress('kpi2', 0.5);
  const k3 = useProgress('kpi3', 0.5);
  const pCombine = useProgress('kpiCombine', 0.9);

  // The merit half steps aside rather than vanishing - the bonus half is the
  // second point of the same section, not a new subject.
  const shift = interpolate(pBonus, [0, 1], [0, -720], {extrapolateRight: 'clamp'});
  const meritFade = interpolate(pBonus, [0.15, 0.8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 90}}>
        <Rise progress={pLabel} distance={20}>
          <Label size={30} color={colors.primary}>{t.label as string}</Label>
        </Rise>
      </div>

      {/* MERIT */}
      <div
        style={{
          position: 'absolute',
          left: 460,
          top: 220,
          opacity: meritFade,
          transform: `translate3d(${shift}px, 0, 0)`,
          willChange: 'transform, opacity',
        }}
      >
        <Card3D progress={pMerit} width={1000} height={560} rotateY={4} accent={colors.primary}>
          <div style={{display: 'flex', flexDirection: 'column', height: '100%', gap: 26}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
              <MeritIcon progress={pMerit} size={124} color={colors.accent} />
              <Display size={88} color={colors.text}>{t.meritTitle as string}</Display>
            </div>
            <div style={{marginTop: 10}}>
              <ForecastChart progress={pChart} forecast={pForecast} width={880} height={228} />
            </div>
            <Rise progress={pMeritLabel} distance={20} style={{marginTop: 'auto'}}>
              <Body size={40} weight={700} color={colors.textSoft}>{t.meritValue as string}</Body>
            </Rise>
          </div>
        </Card3D>
      </div>

      {/* BONUS - the heading, then the three KPIs rolling up */}
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 158, opacity: pBonus}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <BonusIcon progress={pBonus} size={104} color={colors.accent} />
          <Display size={84} color={colors.text}>{t.bonusTitle as string}</Display>
        </div>
        <Body size={34} weight={700} color={colors.textSoft} style={{marginTop: 16, letterSpacing: 1.5}}>
          {t.bonusValue as string}
        </Body>

        <div style={{marginTop: 54}}>
          <KpiTrio
            labels={t.kpis as string[]}
            cards={[k1, k2, k3]}
            combine={pCombine}
            combinedLabel={t.combined as string}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
