/**
 * SCENE 4 - THE CHANGE (the hero moment)
 *
 * The year ring spins. Three full turns plus three months, so APRIL lands at
 * twelve o'clock where JANUARY used to be. The ring is the year counter, and
 * turning it IS the announcement: the salary cycle now starts in April.
 *
 * Left: the mechanism (the ring). Right: the statement (the range).
 * The right-hand block hands over mid-spin - OLD drops away, NEW rises.
 */
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {YearRing} from '../components/YearRing';
import {RangePlate} from '../components/MonthRail';
import {Label, Display, Rise, Punch} from '../components/Type';
import {Plinth} from '../components/Card3D';
import {useProgress, useBeat, useScene} from '../lib/timing';
import {colors} from '../lib/theme';
import {monthsCalendar, cycle} from '../config/copy';

/** April is the fourth month, so the dial turns three months past January. */
const APRIL_INDEX = 3;
/**
 * Full turns before it lands. Two is enough to read as the year counter
 * resetting; three spins fast enough that the months strobe at 30fps even
 * with motion blur.
 */
const SPINS = 2;

export const Scene04TheChange: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pRing = useProgress('oldRingIn', 0.9);
  const pOldLabel = useProgress('oldLabel', 0.6);

  // The spin: slow to start, fast in the middle, settling hard onto April.
  const spinStart = useBeat('spinUp');
  const spinEnd = useBeat('newRingIn');
  const spinT = interpolate(frame, [spinStart, spinEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.68, 0, 0.24, 1),
  });
  const rotationMonths = spinT * (SPINS * 12 + APRIL_INDEX);

  // Motion blur peaks mid-spin and is gone by the time it lands.
  const spinBlur = Math.sin(Math.PI * spinT) * (spinT < 0.92 ? 1 : 0);

  const pHandover = useProgress('handover', 0.5);
  const pNewArc = useProgress('newRingIn', 1.5);
  const pNewLabel = useProgress('newLabelIn', 0.6);
  const pReveal = useProgress('bigReveal', 0.8);

  // "Yes - April to March": a single emphatic pulse, not a new element.
  const yesBeat = useBeat('yesBeat');
  const pulse = interpolate(
    frame,
    [yesBeat, yesBeat + Math.round(0.22 * fps), yesBeat + Math.round(0.9 * fps)],
    [0, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)},
  );
  const pLock = useProgress('lockIn', 0.7);

  const isNew = pHandover > 0.5;
  // The ring charges to the accent right at the end of the spin, so the colour
  // change and the handover read as one event rather than two.
  const ringColor = spinT > 0.82 ? colors.accent : colors.primary;
  // Mid-spin the old readout is stale and the new one is not true yet, so the
  // centre simply clears until the dial lands.
  const spinning = spinT > 0.04 && pHandover < 0.5;

  return (
    <AbsoluteFill>
      {/* Mechanism */}
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 250,
          transform: `scale(${0.88 + pulse * 0.02})`,
          transformOrigin: 'center',
        }}
      >
        <YearRing
          months={monthsCalendar}
          progress={pRing}
          rotationMonths={rotationMonths}
          arcProgress={isNew ? pNewArc : 1}
          color={ringColor}
          startIndex={isNew ? APRIL_INDEX : 0}
          centreTop={spinning ? undefined : 'STARTS IN'}
          centreMain={spinning ? undefined : isNew ? cycle.newCycleFromLong : cycle.oldCycleFromLong}
          centreColor={isNew ? colors.accent : colors.textSoft}
          spin={spinBlur}
        />
      </div>

      {/* Statement */}
      <div
        style={{
          position: 'absolute',
          left: 756,
          top: 326,
          width: 1060,
          height: 470,
        }}
      >
        {/* OLD - drops away as the ring spins up */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 1 - pHandover,
            transform: `translate3d(0, ${pHandover * -70}px, 0)`,
            filter: pHandover > 0 ? `blur(${pHandover * 10}px)` : undefined,
          }}
        >
          <Rise progress={pOldLabel} distance={26}>
            <Label size={32} color={colors.muted}>{t.oldLabel}</Label>
          </Rise>
          <div style={{marginTop: 34}}>
            <RangePlate progress={pOldLabel} from={cycle.oldCycleFrom} to={cycle.oldCycleTo} quiet size={120} />
          </div>
        </div>

        {/* NEW - rises into its place */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: pNewLabel,
            transform: `translate3d(0, ${(1 - pNewLabel) * 80}px, 0)`,
          }}
        >
          <Label size={34} color={colors.accent}>{t.newLabel}</Label>
          <div style={{marginTop: 30, transform: `scale(${1 + pulse * 0.045})`, transformOrigin: 'left center'}}>
            <Punch progress={pReveal} from={0.8}>
              <RangePlate progress={pReveal} from={cycle.newCycleFrom} to={cycle.newCycleTo} size={172} />
            </Punch>
          </div>
          <Plinth progress={pReveal} width={700} color={colors.accent} style={{marginTop: 26}} />
          <div style={{marginTop: 30, opacity: pLock}}>
            <Display size={40} weight={700} color={colors.textSoft}>
              {cycle.newCycleFromLong} &nbsp;to&nbsp; {cycle.newCycleToLong}
            </Display>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
