/**
 * SCENE 3 - HOW MERIT AND BONUS WORK TODAY
 * Two raised cards, built one after the other, then a single quiet stamp that
 * names what they have in common. Neutral in tone: this is the current state,
 * not a problem.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Card3D} from '../components/Card3D';
import {MeritIcon, BonusIcon, ForecastChart, KpiTiles} from '../components/Icons';
import {Display, Label, Body, Rise, Chip} from '../components/Type';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';

const CARD_W = 760;
const CARD_H = 486;

export const Scene03Today: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string | string[]>;

  const pLabel = useProgress('label', 0.5);
  const pMerit = useProgress('meritCard', 0.7);
  const pChart = useProgress('meritChart', 1.2);
  const pForecast = useProgress('meritForecast', 0.9);
  const pMeritLabel = useProgress('meritLabel', 0.6);
  const pBonus = useProgress('bonusCard', 0.7);
  const pTiles = useProgress('bonusTiles', 1.1);
  const pBonusLabel = useProgress('bonusLabel', 0.6);
  const pStamp = useProgress('estimateStamp', 0.6);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 96}}>
        <Rise progress={pLabel} distance={22}>
          <Label size={30} color={colors.primary}>{t.label as string}</Label>
        </Rise>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 208,
          width: 1680,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {/* MERIT */}
        <Card3D progress={pMerit} width={CARD_W} height={CARD_H} rotateY={7} accent={colors.primary}>
          <div style={{display: 'flex', flexDirection: 'column', height: '100%', gap: 22}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
              <MeritIcon progress={pMerit} size={116} color={colors.accent} />
              <Display size={76} color={colors.text}>{t.meritTitle as string}</Display>
            </div>
            <div style={{marginTop: 4}}>
              <ForecastChart progress={pChart} forecast={pForecast} width={640} height={162} />
            </div>
            <Rise progress={pMeritLabel} distance={22} style={{marginTop: 'auto'}}>
              <Body size={36} weight={700} color={colors.textSoft}>{t.meritValue as string}</Body>
            </Rise>
          </div>
        </Card3D>

        {/* BONUS */}
        <Card3D progress={pBonus} width={CARD_W} height={CARD_H} rotateY={-7} accent={colors.primary}>
          <div style={{display: 'flex', flexDirection: 'column', height: '100%', gap: 22}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
              <BonusIcon progress={pBonus} size={116} color={colors.accent} />
              <Display size={76} color={colors.text}>{t.bonusTitle as string}</Display>
            </div>
            <div style={{marginTop: 12}}>
              <KpiTiles labels={t.kpis as string[]} progress={pTiles} width={640} />
            </div>
            <Rise progress={pBonusLabel} distance={22} style={{marginTop: 'auto'}}>
              <Body size={36} weight={700} color={colors.textSoft}>{t.bonusValue as string}</Body>
            </Rise>
          </div>
        </Card3D>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 776, display: 'flex', justifyContent: 'center'}}>
        <Rise progress={pStamp} distance={24}>
          <Chip color={colors.muted} filled={false} size={32}>
            {t.stamp as string}
          </Chip>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
