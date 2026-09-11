/**
 * SCENE 8 - BEFORE BECOMES AFTER
 *
 * Not a comparison table. The BEFORE plate physically rotates away on its Y
 * axis and the NOW plate rotates into the same spot, so the old cycle turns
 * into the new one rather than sitting beside it. The three anchors then stack
 * underneath - this is the summary the film is built to leave behind.
 */
import React from 'react';
import {AbsoluteFill, interpolate, Easing} from 'remotion';
import {RangePlate} from '../components/MonthRail';
import {Label, Display, Body} from '../components/Type';
import {Card3D, Plinth} from '../components/Card3D';
import {useProgress, useScene} from '../lib/timing';
import {colors, depth} from '../lib/theme';
import {anchors} from '../config/copy';

const Anchor: React.FC<{progress: number; month: string; what: string; steady?: boolean}> = ({
  progress,
  month,
  what,
  steady = false,
}) => {
  const tone = steady ? colors.steady : colors.accent;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 28,
        opacity: progress,
        transform: `translate3d(${(1 - progress) * 46}px, 0, 0)`,
      }}
    >
      <div style={{width: 330, flexShrink: 0, textAlign: 'right'}}>
        <Display size={62} color={tone}>{month}</Display>
      </div>
      <div style={{width: 5, height: 44, background: tone, borderRadius: 3, opacity: 0.7}} />
      <Body size={42} weight={700} color={colors.text}>{what}</Body>
    </div>
  );
};

export const Scene08BeforeAfter: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string | string[]>;

  const pBefore = useProgress('beforeIn', 0.6);
  const pRows = useProgress('beforeRows', 0.8);
  const pTransform = useProgress('transform', 1.0, Easing.bezier(0.6, 0, 0.3, 1));
  const pAfter = useProgress('afterIn', 0.7);
  const a1 = useProgress('anchor1', 0.5);
  const a2 = useProgress('anchor2', 0.5);
  const a3 = useProgress('anchor3', 0.5);
  const pSettle = useProgress('settle', 0.8);

  // One plate, two faces: BEFORE turns away as NOW turns in.
  const flip = interpolate(pTransform, [0, 1], [0, 180]);
  const showBack = pTransform > 0.5;

  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 140}}>
      {/* The transforming plate */}
      <div
        style={{
          width: 1160,
          height: 268,
          transformStyle: 'preserve-3d',
          transform: `perspective(${depth.perspective}px) rotateY(${flip}deg)`,
          position: 'relative',
        }}
      >
        {/* BEFORE face */}
        <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', opacity: showBack ? 0 : 1}}>
          <Card3D progress={pBefore} width={1160} height={268} accent={colors.muted} padding={38}>
            <div style={{display: 'flex', alignItems: 'center', gap: 56}}>
              <div>
                <Label size={28} color={colors.muted}>{t.beforeLabel as string}</Label>
                <div style={{marginTop: 16}}>
                  <RangePlate progress={pBefore} from="JAN" to="DEC" quiet size={84} />
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 10, opacity: pRows}}>
                {(t.beforeRows as string[]).map((r) => (
                  <Body key={r} size={28} color={colors.muted}>{r}</Body>
                ))}
              </div>
            </div>
          </Card3D>
        </div>

        {/* NOW face */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            opacity: showBack ? 1 : 0,
          }}
        >
          <Card3D progress={pAfter} width={1160} height={268} accent={colors.accent} padding={38} from={{y: 0}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <Label size={30} color={colors.accent}>{t.afterLabel as string}</Label>
                <div style={{marginTop: 16}}>
                  <RangePlate progress={pAfter} from="APR" to="MAR" size={116} />
                </div>
              </div>
              <Label size={26} color={colors.textSoft} style={{writingMode: 'horizontal-tb'}}>
                SALARY CYCLE
              </Label>
            </div>
          </Card3D>
        </div>
      </div>

      <Plinth progress={pAfter} width={900} color={colors.accent} style={{marginTop: 34}} />

      {/* The three things to remember */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
          marginTop: 54,
          transform: `translate3d(0, ${-pSettle * 10}px, 0)`,
        }}
      >
        <Anchor progress={a1} month={anchors[0].month} what={anchors[0].what} />
        <Anchor progress={a2} month={anchors[1].month} what={anchors[1].what} />
        <Anchor progress={a3} month={anchors[2].month} what={anchors[2].what} steady />
      </div>

    </AbsoluteFill>
  );
};
