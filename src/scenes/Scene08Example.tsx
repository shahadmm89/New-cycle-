/**
 * SCENE 8 - THE IMPLEMENTATION YEAR (worked example)
 *
 * The one piece of arithmetic in the film, so it is built as a single equation
 * that assembles left to right exactly as the narrator says it:
 *
 *   5%   ÷ 12   = 0.417% per month   × 15   = 6.25%
 *
 * Above it, the changeover period drawn as the same month rail used everywhere
 * else in the film - fifteen tiles instead of twelve, which is the whole reason
 * the arithmetic is different that year.
 *
 * Nothing here is a new visual language: the rail, the card, the chips and the
 * type scale are the film's existing vocabulary.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {MonthRail} from '../components/MonthRail';
import {Card3D} from '../components/Card3D';
import {Display, Label, Rise, Chip} from '../components/Type';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';
import {implementation} from '../config/copy';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * One term of the equation. Unlike <Rise>, this never unmounts - the terms sit
 * in a flex row, so a term that disappeared would shuffle the whole equation
 * sideways every time the next one arrived.
 */
const Term: React.FC<{
  progress: number;
  value: string;
  size: number;
  color: string;
  glow?: boolean;
  caption?: string;
}> = ({progress, value, size, color, glow = false, caption}) => {
  const p = clamp(progress);
  return (
    <div
      style={{
        position: 'relative',
        opacity: p,
        transform: `translate3d(0, ${(1 - p) * 24}px, 0)`,
        filter: p < 1 ? `blur(${(1 - p) * 7}px)` : undefined,
        willChange: 'transform, opacity, filter',
      }}
    >
      <Display size={size} color={color} glow={glow}>
        {value}
      </Display>
      {caption ? (
        <div style={{position: 'absolute', top: '100%', left: 2, marginTop: 18, opacity: p}}>
          <Label size={22} color={colors.textSoft}>
            {caption}
          </Label>
        </div>
      ) : null}
    </div>
  );
};

export const Scene08Example: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pLabel = useProgress('labelIn', 0.5);
  const pRail = useProgress('railIn', 1.4);
  const pCount = useProgress('railCount', 0.7);
  const pInstead = useProgress('insteadOf', 0.5);
  const pCard = useProgress('meritIn', 0.6);
  const pMerit = useProgress('meritValue', 0.6);
  const pDivide = useProgress('divide', 0.5);
  const pPerMonth = useProgress('perMonth', 0.6);
  const pMultiply = useProgress('multiply', 0.5);
  const pEquivalent = useProgress('equivalent', 0.7);
  const pNote = useProgress('settle', 0.7);

  // Once the narrator has said "fifteen months", every tile lights - the rail
  // stops being a timeline and becomes a count.
  const allLit = pCount > 0.35 ? implementation.months.map((_, i) => i) : [];

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 92}}>
        <Rise progress={pLabel} distance={22}>
          <Label size={30} color={colors.primary}>{t.label}</Label>
        </Rise>
      </div>

      {/* The changeover period: the same rail as everywhere else, fifteen long. */}
      <div style={{position: 'absolute', left: 120, top: 182, width: 1680}}>
        <MonthRail
          months={implementation.months}
          progress={pRail}
          width={1680}
          highlight={allLit}
          color={colors.primary}
          tilt={8}
          tileHeight={78}
          fontSize={25}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 300,
          width: 1680,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <Rise progress={pCount} distance={18}>
          <Chip color={colors.primary} size={30}>{t.monthsChip}</Chip>
        </Rise>
        <Rise progress={pInstead} distance={18}>
          <Label size={26} color={colors.muted}>{t.insteadOf}</Label>
        </Rise>
      </div>

      {/* The arithmetic. */}
      <div style={{position: 'absolute', left: 120, top: 404}}>
        <Card3D progress={pCard} width={1680} height={340} rotateY={2} accent={colors.primary} padding={44}>
          <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Rise progress={pCard} distance={16}>
              <Label size={28} color={colors.primary}>{t.meritLabel}</Label>
            </Rise>

            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 40,
                paddingBottom: 46,
              }}
            >
              <Term progress={pMerit} value={t.merit} size={112} color={colors.accent} glow />
              <Term progress={pDivide} value={t.dividedBy} size={62} color={colors.textSoft} />
              <Term
                progress={pPerMonth}
                value={`= ${t.perMonth}`}
                size={86}
                color={colors.text}
                caption={t.perMonthLabel}
              />
              <Term progress={pMultiply} value={t.multipliedBy} size={62} color={colors.textSoft} />
              <Term
                progress={pEquivalent}
                value={`= ${t.equivalent}`}
                size={124}
                color={colors.accent}
                glow
                caption={t.equivalentLabel}
              />
            </div>
          </div>
        </Card3D>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 818, display: 'flex', justifyContent: 'center'}}>
        <Rise progress={pNote} distance={20}>
          <Label size={28} color={colors.textSoft}>{t.note}</Label>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
