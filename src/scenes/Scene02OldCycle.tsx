/**
 * SCENE 2 - THE CURRENT CYCLE
 * Establishes the object the film is about to change: twelve months, one
 * cycle, starting in January.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {YearRing} from '../components/YearRing';
import {MonthRail, RangePlate} from '../components/MonthRail';
import {Label, Rise, Body} from '../components/Type';
import {useProgress, useScene, useSpan} from '../lib/timing';
import {colors} from '../lib/theme';
import {monthsCalendar} from '../config/copy';

export const Scene02OldCycle: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pLabel = useProgress('label', 0.5);
  const pRing = useProgress('ringIn', 0.9);
  const pFlow = useProgress('monthsFlow', 3.4);
  const pRail = useProgress('railIn', 1.2);
  const pEnds = useProgress('endpointsIn', 0.8);
  const pBanner = useProgress('bannerIn', 0.7);
  const settle = useSpan(6.6, 9);

  // The playhead walks the whole year while the narrator describes it.
  const playhead = pFlow * 11;

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 96}}>
        <Rise progress={pLabel} distance={22}>
          <Label size={30} color={colors.primary}>{t.label}</Label>
        </Rise>
      </div>

      {/* Ring on the left, rail and range on the right. */}
      <div style={{position: 'absolute', left: 74, top: 222, transform: 'scale(0.92)', transformOrigin: 'top left'}}>
        <YearRing
          months={monthsCalendar}
          progress={pRing}
          rotationMonths={0}
          arcProgress={pFlow}
          color={colors.primary}
          centreTop="SALARY CYCLE"
          centreMain="12"
          centreColor={colors.text}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 760,
          top: 288,
          width: 1040,
          display: 'flex',
          flexDirection: 'column',
          gap: 46,
        }}
      >
        <Rise progress={pEnds} distance={30}>
          <RangePlate progress={pEnds} from={t.from} to={t.to} quiet size={84} />
        </Rise>

        <div style={{transform: `translateY(${(1 - settle) * 6}px)`}}>
          <MonthRail
            months={monthsCalendar}
            progress={pRail}
            width={1040}
            playhead={pFlow > 0.01 ? playhead : null}
            color={colors.primary}
            tilt={10}
            tileHeight={108}
            fontSize={32}
          />
        </div>

        <Rise progress={pBanner} distance={26} style={{marginTop: 14}}>
          <Body size={38} weight={700} color={colors.textSoft} style={{letterSpacing: 3}}>
            {t.banner}
          </Body>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
