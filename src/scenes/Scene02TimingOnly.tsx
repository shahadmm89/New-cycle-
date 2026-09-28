/**
 * SCENE 2 - TIMING ONLY, BENEFITS UNCHANGED
 *
 * The key message of the film, stated before any detail: two rows, stacked and
 * deliberately parallel, so the distinction is structural rather than something
 * the viewer has to be told twice.
 *
 *   WHAT CHANGES          TIMING     when benefits are received    [CHANGES]
 *   WHAT DOES NOT CHANGE  BENEFITS   bonus · merit · promotion     [tick] NO CHANGE
 *                                    Total Reward Package
 *
 * Same shape, different colour: amber for the one thing that moves, the steady
 * tone for everything that does not.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MonthRail} from '../components/MonthRail';
import {Tick} from '../components/Icons';
import {Body, Display, Label, Rise, Chip} from '../components/Type';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';
import {monthsCalendar} from '../config/copy';

const Row: React.FC<{
  title: string;
  range: string;
  color: string;
  rowProgress: number;
  children: React.ReactNode;
  badge: React.ReactNode;
  dim?: boolean;
}> = ({title, range, color, rowProgress, children, badge, dim = false}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 44,
      opacity: rowProgress,
      transform: `translate3d(${(1 - rowProgress) * -50}px, 0, 0)`,
    }}
  >
    <div style={{width: 470, flexShrink: 0}}>
      <Label size={26} color={dim ? colors.textSoft : color}>{title}</Label>
      <Display size={76} color={color} style={{marginTop: 10}}>
        {range}
      </Display>
    </div>
    <div style={{width: 800, flexShrink: 0}}>{children}</div>
    <div style={{flexShrink: 0}}>{badge}</div>
  </div>
);

export const Scene02TimingOnly: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string | string[]>;

  const pChangeRow = useProgress('changeRowIn', 0.6);
  const pChangeDetail = useProgress('changeDetail', 1.0);
  const pChangeBadge = useProgress('changeBadge', 0.6);
  const pContrast = useProgress('contrast', 0.8);
  const pKeepRow = useProgress('keepRowIn', 0.6);
  const pBenefits = useProgress('benefitsIn', 1.2);
  const pKeepDetail = useProgress('keepDetailIn', 0.6);
  const pKeepBadge = useProgress('keepBadge', 0.9);

  const benefits = t.benefits as string[];

  return (
    <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 120}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 58, marginTop: 16}}>
        <Row
          title={t.changeTitle as string}
          range={t.changeRange as string}
          color={colors.accent}
          rowProgress={pChangeRow}
          badge={
            <Rise progress={pChangeBadge} distance={18}>
              <Chip color={colors.accent} size={34}>{t.changeBadge as string}</Chip>
            </Rise>
          }
        >
          {/* The same twelve months. What moves is WHEN things land in them. */}
          <MonthRail
            months={monthsCalendar}
            progress={pChangeDetail}
            width={800}
            color={colors.accent}
            tilt={7}
            tileHeight={58}
            fontSize={19}
          />
          <Rise progress={pChangeDetail} distance={14} style={{marginTop: 18}}>
            <Body size={32} weight={700} color={colors.text}>{t.changeDetail as string}</Body>
          </Rise>
        </Row>

        {/* The divider only appears once both rows are present - it is the comparison. */}
        <div
          style={{
            height: 2,
            width: 1680 * pContrast,
            background: `linear-gradient(90deg, ${colors.line}, ${colors.primary}88, transparent)`,
          }}
        />

        <Row
          title={t.keepTitle as string}
          range={t.keepRange as string}
          color={colors.steady}
          rowProgress={pKeepRow}
          dim
          badge={
            <div style={{display: 'flex', alignItems: 'center', gap: 20, opacity: pKeepBadge}}>
              <Tick progress={pKeepBadge} size={72} />
              <Display size={40} color={colors.steady}>{t.keepBadge as string}</Display>
            </div>
          }
        >
          <div style={{display: 'flex', gap: 18}}>
            {benefits.map((b, i) => (
              <Rise key={b} progress={pBenefits * 1.6 - i * 0.3} distance={18}>
                <Chip color={colors.steady} filled={false} size={30}>{b}</Chip>
              </Rise>
            ))}
          </div>
          <Rise progress={pKeepDetail} distance={14} style={{marginTop: 22}}>
            <Body size={32} weight={700} color={colors.text}>{t.keepDetail as string}</Body>
          </Rise>
        </Row>
      </div>
    </AbsoluteFill>
  );
};
