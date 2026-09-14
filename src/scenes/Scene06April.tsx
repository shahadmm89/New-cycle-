/**
 * SCENE 6 - WHAT HAPPENS IN APRIL
 * APRIL is the largest word in the film. Merit and promotion rise into it -
 * upward motion, because that is what the month now means.
 */
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {MeritIcon, PromotionIcon} from '../components/Icons';
import {Display, Label, Rise, Punch, Chip} from '../components/Type';
import {Plinth} from '../components/Card3D';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {colors, type as scale} from '../lib/theme';

const Pillar: React.FC<{
  progress: number;
  icon: React.ReactNode;
  label: string;
  lift: number;
}> = ({progress, icon, label, lift}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22,
      opacity: progress,
      transform: `translate3d(0, ${(1 - progress) * 64 - lift}px, 0)`,
      willChange: 'transform, opacity',
    }}
  >
    {icon}
    <Display size={56} color={colors.accent}>{label}</Display>
  </div>
);

export const Scene06April: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pMonth = useProgress('monthIn', 0.8);
  const pSettle = useProgress('monthSettle', 1.0);
  const pMerit = useProgress('meritIn', 0.7);
  const pPromo = useProgress('promotionIn', 0.7);
  const pLift = useProgress('liftOff', 1.6);
  const pEffective = useProgress('effectiveIn', 0.6);
  const pRestate = useProgress('restate', 0.7);
  const float = useIdle(0.22, 5);

  // Everything drifts gently upward once it has landed - progression, made literal.
  const lift = interpolate(pLift, [0, 1], [0, 26]);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: -40}}>
        <Rise progress={pSettle} distance={20}>
          <Label size={30} color={colors.primary}>{t.note}</Label>
        </Rise>

        <Punch progress={pMonth} from={0.68}>
          <Display size={scale.hero} color={colors.accent} glow style={{transform: `translateY(${-lift + float}px)`}}>
            {t.month}
          </Display>
        </Punch>

        <Plinth progress={pMonth} width={860} color={colors.accent} style={{marginTop: -4}} />

        <div style={{display: 'flex', gap: 150, marginTop: 46}}>
          <Pillar
            progress={pMerit}
            lift={lift}
            label={t.merit}
            icon={<MeritIcon progress={pMerit} size={144} color={colors.accent} />}
          />
          <Pillar
            progress={pPromo}
            lift={lift}
            label={t.promotion}
            icon={<PromotionIcon progress={pPromo} size={144} color={colors.accent} />}
          />
        </div>

        <div style={{marginTop: 54, transform: `scale(${1 + pRestate * 0.03})`}}>
          <Rise progress={pEffective} distance={30}>
            <Chip color={colors.accent} size={40}>
              {t.effective}
            </Chip>
          </Rise>
        </div>
      </div>
    </AbsoluteFill>
  );
};
