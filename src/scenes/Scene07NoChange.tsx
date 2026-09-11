/**
 * SCENE 7 - WHAT DOES NOT CHANGE
 *
 * Two rows, stacked and deliberately parallel, so the distinction is structural
 * rather than something the viewer has to be told:
 *
 *   PERFORMANCE CYCLE   JAN -> DEC   [tick] NO CHANGE
 *   SALARY CYCLE        APR -> MAR   [NEW]
 *
 * Same shape, same rail, different months, different colour. That is the
 * entire point of the scene.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MonthRail} from '../components/MonthRail';
import {Tick} from '../components/Icons';
import {Display, Label, Rise, Chip} from '../components/Type';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';
import {monthsCalendar, monthsSalaryYear} from '../config/copy';

const Row: React.FC<{
  title: string;
  range: string;
  months: readonly string[];
  color: string;
  rowProgress: number;
  railProgress: number;
  badge: React.ReactNode;
  dim?: boolean;
}> = ({title, range, months, color, rowProgress, railProgress, badge, dim = false}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 44,
      opacity: rowProgress,
      transform: `translate3d(${(1 - rowProgress) * -50}px, 0, 0)`,
    }}
  >
    <div style={{width: 430, flexShrink: 0}}>
      <Label size={26} color={dim ? colors.textSoft : colors.accent}>{title}</Label>
      <Display size={76} color={dim ? colors.text : colors.accent} style={{marginTop: 10}}>
        {range}
      </Display>
    </div>
    <div style={{width: 780, flexShrink: 0}}>
      <MonthRail
        months={months}
        progress={railProgress}
        width={780}
        color={color}
        highlight={dim ? [months.length - 1] : [0, months.length - 1]}
        tilt={7}
        tileHeight={66}
        fontSize={21}
        emphasiseEnds
      />
    </div>
    <div style={{flexShrink: 0}}>{badge}</div>
  </div>
);

export const Scene07NoChange: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pPerfRow = useProgress('perfRowIn', 0.6);
  const pPerfRail = useProgress('perfRailIn', 1.0);
  const pTick = useProgress('tickIn', 0.9);
  const pSalaryRow = useProgress('salaryRowIn', 0.6);
  const pSalaryRail = useProgress('salaryRailIn', 1.0);
  const pBadge = useProgress('newBadge', 0.6);
  const pContrast = useProgress('contrast', 0.8);

  return (
    <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 120}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 58, marginTop: 16}}>
        <Row
          title={t.perfTitle}
          range={t.perfRange}
          months={monthsCalendar}
          color={colors.steady}
          rowProgress={pPerfRow}
          railProgress={pPerfRail}
          dim
          badge={
            <div style={{display: 'flex', alignItems: 'center', gap: 20, opacity: pTick}}>
              <Tick progress={pTick} size={72} />
              <Display size={40} color={colors.steady}>{t.perfBadge}</Display>
            </div>
          }
        />

        {/* The divider only appears once both rows are present - it is the comparison. */}
        <div
          style={{
            height: 2,
            width: 1680 * pContrast,
            background: `linear-gradient(90deg, ${colors.line}, ${colors.primary}88, transparent)`,
          }}
        />

        <Row
          title={t.salaryTitle}
          range={t.salaryRange}
          months={monthsSalaryYear}
          color={colors.accent}
          rowProgress={pSalaryRow}
          railProgress={pSalaryRail}
          badge={
            <Rise progress={pBadge} distance={18}>
              <Chip color={colors.accent} size={38}>{t.salaryBadge}</Chip>
            </Rise>
          }
        />
      </div>
    </AbsoluteFill>
  );
};
