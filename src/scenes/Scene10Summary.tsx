/**
 * SCENE 10 - THE VISUAL SUMMARY
 *
 * The frame employees are meant to remember, and the only one with no
 * narration - it is stronger read in silence than talked over.
 *
 * Hierarchy is deliberate and unequal: the range is the headline, the three
 * markers are subordinate to it, and December is toned differently because it
 * is a clarification rather than a change.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {RangePlate} from '../components/MonthRail';
import {Label, Display, Body, Rise} from '../components/Type';
import {Plinth} from '../components/Card3D';
import {useProgress, useScene} from '../lib/timing';
import {colors, depth} from '../lib/theme';
import {anchors} from '../config/copy';

const Marker: React.FC<{progress: number; month: string; what: string; steady: boolean}> = ({
  progress,
  month,
  what,
  steady,
}) => {
  const p = Math.min(1, Math.max(0, progress));
  const tone = steady ? colors.steady : colors.accent;
  return (
    <div
      style={{
        width: 470,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        opacity: p,
        transform:
          `perspective(${depth.perspective}px) translate3d(0, ${(1 - p) * 34}px, ${(1 - p) * -90}px)`,
        willChange: 'transform, opacity',
      }}
    >
      <Display size={64} color={tone}>{month}</Display>
      <div style={{width: 78, height: 4, borderRadius: 2, background: tone, opacity: 0.8}} />
      <Body size={32} weight={700} color={colors.text} style={{textAlign: 'center', letterSpacing: 1.2}}>
        {what}
      </Body>
    </div>
  );
};

export const Scene10Summary: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pLabel = useProgress('labelIn', 0.5);
  const pRange = useProgress('rangeIn', 0.7);
  const pRule = useProgress('ruleIn', 0.6);
  const a1 = useProgress('anchor1', 0.5);
  const a2 = useProgress('anchor2', 0.5);
  const a3 = useProgress('anchor3', 0.5);
  const pSettle = useProgress('settle', 0.8);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translate3d(0, ${-pSettle * 12}px, 0)`,
        }}
      >
        <Rise progress={pLabel} distance={22}>
          <Label size={32} color={colors.accent}>{t.label}</Label>
        </Rise>

        {/* PRIMARY */}
        <div style={{marginTop: 26}}>
          <RangePlate progress={pRange} from={t.from} to={t.to} size={148} />
        </div>
        <Plinth progress={pRule} width={1080} color={colors.accent} style={{marginTop: 30}} />

        {/* SECONDARY */}
        <div style={{display: 'flex', marginTop: 62}}>
          <Marker progress={a1} month={anchors[0].month} what={anchors[0].what} steady={anchors[0].tone === 'steady'} />
          <Marker progress={a2} month={anchors[1].month} what={anchors[1].what} steady={anchors[1].tone === 'steady'} />
          <Marker progress={a3} month={anchors[2].month} what={anchors[2].what} steady={anchors[2].tone === 'steady'} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
