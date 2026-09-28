/**
 * SCENE 7 - WHAT HAPPENS IN MARCH
 * The playhead travels the whole new salary year - APR through to MAR - and
 * stops hard on March: YIB and bonus are paid in the March payroll.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MonthRail} from '../components/MonthRail';
import {BonusIcon} from '../components/Icons';
import {Display, Rise, Punch, Chip} from '../components/Type';
import {Plinth} from '../components/Card3D';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';
import {monthsSalaryYear} from '../config/copy';

export const Scene07March: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pRail = useProgress('railIn', 0.8);
  const pTravel = useProgress('travel', 2.2);
  const pLand = useProgress('landMarch', 0.5);
  const pMonth = useProgress('monthIn', 0.7);
  const pBonus = useProgress('bonusIn', 0.7);
  const pPayroll = useProgress('payrollIn', 0.6);

  const last = monthsSalaryYear.length - 1;
  const playhead = pTravel * last;

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 142, top: 196, width: 1636}}>
        <MonthRail
          months={monthsSalaryYear}
          progress={pRail}
          width={1636}
          playhead={playhead}
          highlight={pLand > 0.4 ? [last] : []}
          color={colors.accent}
          tilt={12}
          tileHeight={112}
          fontSize={34}
        />
      </div>

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', marginTop: 152}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 70}}>
          <BonusIcon progress={pBonus} size={168} color={colors.accent} />
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {/* MARCH arrives on the word, so its height is reserved - without
                this the BONUS row below shifts upward for the first two seconds. */}
            <div style={{height: 149}}>
              <Punch progress={pMonth} from={0.74}>
                <Display size={152} color={colors.accent} glow>{t.month}</Display>
              </Punch>
            </div>
            <Plinth progress={pMonth} width={560} color={colors.accent} />
            <div style={{marginTop: 26, display: 'flex', gap: 22, alignItems: 'center'}}>
              <Rise progress={pBonus} distance={24}>
                <Display size={58} color={colors.text}>{t.bonus}</Display>
              </Rise>
              <Rise progress={pPayroll} distance={24}>
                <Chip color={colors.accent} size={34}>{t.payroll}</Chip>
              </Rise>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
