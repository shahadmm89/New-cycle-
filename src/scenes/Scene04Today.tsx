/**
 * SCENE 4 - HOW IT WORKS TODAY: NOVEMBER, DECEMBER, JANUARY
 *
 * Two cards, side by side, because in November they happen side by side:
 *
 *   MERIT & SALARY MOVEMENT              YEAR-END ESTIMATE
 *   a forecast line: next year's         the three company KPIs rolling up
 *   expected inflation & market          into one estimated figure
 *
 * Neither card leaves - that is the "in parallel". The bottom timeline carries
 * the months: NOVEMBER for both, then DECEMBER for the decisions. January,
 * when those decisions are reflected, is said rather than pinned.
 *
 * Neutral in tone - this is the current state, not a problem being fixed.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Card3D} from '../components/Card3D';
import {MeritIcon, BonusIcon, ForecastChart, KpiTrio} from '../components/Icons';
import {Display, Label, Body, Rise, Chip} from '../components/Type';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';

export const Scene04Today: React.FC = () => {
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
  // A slow settle under "...and reflected in January", so the frame is still
  // alive while the last clause is said.
  const pSettle = useProgress('settle', 1.8);
  const settle = `translate3d(0, ${pSettle * -10}px, 0) scale(${1 - pSettle * 0.02})`;

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 90, display: 'flex', alignItems: 'center', gap: 26}}>
        <Rise progress={pLabel} distance={20}>
          <Label size={30} color={colors.primary}>{t.label as string}</Label>
        </Rise>
        <Rise progress={pLabel} distance={16}>
          <Chip color={colors.primary} filled={false} size={22}>{t.when as string}</Chip>
        </Rise>
      </div>

      {/* MERIT & SALARY MOVEMENT */}
      <div style={{position: 'absolute', left: 120, top: 180, transform: settle, transformOrigin: 'center'}}>
        <Card3D progress={pMerit} width={820} height={500} rotateY={4} accent={colors.primary} padding={42}>
          <div style={{display: 'flex', flexDirection: 'column', height: '100%', gap: 18}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <MeritIcon progress={pMerit} size={84} color={colors.accent} />
              <Display size={44} color={colors.text}>{t.meritTitle as string}</Display>
            </div>
            <div style={{marginTop: 6}}>
              <ForecastChart progress={pChart} forecast={pForecast} width={736} height={196} />
            </div>
            <Rise progress={pMeritLabel} distance={20} style={{marginTop: 'auto'}}>
              <Body size={30} weight={700} color={colors.textSoft}>{t.meritValue as string}</Body>
            </Rise>
          </div>
        </Card3D>
      </div>

      {/* YEAR-END ESTIMATE - the three KPIs rolling up into one figure */}
      <div style={{position: 'absolute', left: 980, top: 180, transform: settle, transformOrigin: 'center'}}>
        <Card3D progress={pBonus} width={820} height={500} rotateY={-4} accent={colors.primary} padding={42}>
          <div style={{display: 'flex', flexDirection: 'column', height: '100%', gap: 12}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
              <BonusIcon progress={pBonus} size={84} color={colors.accent} />
              <Display size={44} color={colors.text}>{t.bonusTitle as string}</Display>
            </div>
            <Body size={30} weight={700} color={colors.textSoft} style={{letterSpacing: 1}}>
              {t.bonusValue as string}
            </Body>
            {/* The trio is drawn for a full frame; here it sits in half of one. */}
            <div style={{position: 'relative', height: 236, marginTop: 'auto'}}>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  transform: 'translateX(-50%) scale(0.64)',
                  transformOrigin: 'top center',
                }}
              >
                <KpiTrio
                  labels={t.kpis as string[]}
                  cards={[k1, k2, k3]}
                  combine={pCombine}
                  combinedLabel={t.combined as string}
                />
              </div>
            </div>
          </div>
        </Card3D>
      </div>
    </AbsoluteFill>
  );
};
