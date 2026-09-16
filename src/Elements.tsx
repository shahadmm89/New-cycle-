/**
 * REUSABLE ELEMENTS, ON TRANSPARENT BACKGROUNDS
 * ---------------------------------------------
 * The film renders as one flattened video, which is the right deliverable but
 * the wrong thing to hand an editor. These compositions render the moving parts
 * on their own, over nothing, so each can be dropped onto a different
 * background, retimed, or reused in another piece.
 *
 *   npm run export:elements
 *
 * They are the SAME components the film uses, driven by the same props, so an
 * element exported here is the element in the video rather than a lookalike.
 *
 * Nothing here paints a background. Anything that did would come out as a black
 * box in the alpha channel, which is the one mistake that makes a transparent
 * export useless.
 */
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {Timeline, TimelinePin} from './components/Timeline';
import {MonthRail, RangePlate, ReorderingRail} from './components/MonthRail';
import {YearRing} from './components/YearRing';
import {
  MeritIcon, PromotionIcon, BonusIcon, PerformanceIcon, Tick, ForecastChart,
  HseIcon, FinanceIcon, PerformanceKpiIcon,
} from './components/Icons';
import {Display, Label} from './components/Type';
import {colors, fonts} from './lib/theme';
import {monthsCalendar, monthsSalaryYear, cycle, implementation} from './config/copy';

/**
 * 0 -> 1 across `seconds`, starting at `delay`, given the time in seconds.
 *
 * A plain function rather than a hook, deliberately: several of these elements
 * need a ramp inside a loop or behind a condition, and a hook cannot go in
 * either without changing hook order between frames.
 */
const ramp = (t: number, delay: number, seconds: number, easing = Easing.out(Easing.cubic)) =>
  interpolate(t, [delay, delay + seconds], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Seconds elapsed in this composition. */
const useSeconds = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

/** The common case: one ramp at the top of a component. */
const useRamp = (delay: number, seconds: number, easing = Easing.out(Easing.cubic)) =>
  ramp(useSeconds(), delay, seconds, easing);

/** Centres an element and gives it room, without painting anything. */
const Hold: React.FC<{children: React.ReactNode; pad?: number}> = ({children, pad = 0}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: pad, fontFamily: fonts.body}}>
    {children}
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- timeline */

const pins = (defs: Array<[string, string, string, string, 'estimate' | 'actual', 0 | 1, number]>, t: number)
  : TimelinePin[] =>
  defs.map(([month, label, kind, sub, tone, tier, at]) => ({
    month, label, kind, sub, tone, tier,
    progress: interpolate(t, [at, at + 0.7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  }));

/** JAN -> DEC drawing in, then today's two markers arriving. */
export const ElTimelineOld: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <Hold>
      <div style={{width: 1600}}>
        <Timeline
          months={monthsCalendar}
          progress={useRamp(0.2, 1.5)}
          width={1600}
          edge={140}
          pins={pins([
            ['NOV', 'NOVEMBER', 'Merit', 'Expected Market\nMovement', 'estimate', 1, 2.2],
            ['DEC', 'DECEMBER', 'Bonus', 'Estimated Company\nPerformance KPIs', 'estimate', 0, 3.6],
          ], t)}
        />
      </div>
    </Hold>
  );
};

/** The twelve months re-aligning from JAN -> DEC into APR -> MAR. */
export const ElTimelineMorph: React.FC = () => (
  <Hold>
    <div style={{width: 1600}}>
      <Timeline
        months={monthsCalendar}
        into={monthsSalaryYear}
        progress={1}
        morph={useRamp(0.6, 2.0, Easing.bezier(0.5, 0, 0.25, 1))}
        width={1600}
        edge={140}
      />
    </div>
  </Hold>
);

/** APR -> MAR with the new cycle's four markers. */
export const ElTimelineNew: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <Hold>
      <div style={{width: 1600}}>
        <Timeline
          months={monthsCalendar}
          into={monthsSalaryYear}
          progress={1}
          morph={1}
          width={1600}
          edge={140}
          pins={pins([
            ['JAN', 'JANUARY', 'Merit', 'Actual Company\nPerformance', 'actual', 1, 0.3],
            ['FEB', 'FEBRUARY', 'Bonus', 'Actual Market\nMovement', 'actual', 0, 1.5],
            ['APR', 'APRIL', 'Merit', 'Merit & Promotion\ntake effect', 'actual', 0, 2.7],
            ['MAR', 'MARCH', 'Bonus', 'Bonus paid in the\nMarch payroll', 'actual', 1, 3.9],
          ], t)}
        />
      </div>
    </Hold>
  );
};

/* ------------------------------------------------------------- rails, ring */

export const ElMonthRailOld: React.FC = () => {
  const p = useRamp(0.1, 1.2);
  const flow = useRamp(0.5, 2.4);
  return (
    <Hold>
      <MonthRail months={monthsCalendar} progress={p} width={1500} playhead={flow > 0.01 ? flow * 11 : null}
        color={colors.primary} tilt={10} tileHeight={108} fontSize={32} />
    </Hold>
  );
};

export const ElMonthRailNew: React.FC = () => {
  const p = useRamp(0.1, 1.2);
  const travel = useRamp(0.6, 2.2);
  return (
    <Hold>
      <MonthRail months={monthsSalaryYear} progress={p} width={1500} playhead={travel * 11}
        highlight={travel > 0.95 ? [11] : []} color={colors.accent} tilt={12} tileHeight={112} fontSize={34} />
    </Hold>
  );
};

export const ElRailReorder: React.FC = () => (
  <Hold>
    <div style={{width: 1600}}>
      <ReorderingRail from={monthsCalendar} to={monthsSalaryYear}
        progress={useRamp(0.1, 0.8)} morph={useRamp(1.0, 1.7, Easing.bezier(0.55, 0, 0.25, 1))} width={1600} />
    </div>
  </Hold>
);

/** The dial turning from January to April - the film's hero mechanism. */
export const ElYearRingSpin: React.FC = () => {
  const t = useSeconds();
  const spin = ramp(t, 1.0, 2.2, Easing.bezier(0.68, 0, 0.24, 1));
  const landed = spin > 0.96;
  return (
    <Hold>
      <YearRing
        months={monthsCalendar}
        progress={ramp(t, 0, 0.9)}
        rotationMonths={spin * (2 * 12 + 3)}
        arcProgress={landed ? ramp(t, 3.2, 1.5) : 1}
        color={spin > 0.82 ? colors.accent : colors.primary}
        startIndex={landed ? 3 : 0}
        centreTop={spin > 0.04 && !landed ? undefined : 'STARTS IN'}
        centreMain={spin > 0.04 && !landed ? undefined : landed ? cycle.newCycleFromLong : cycle.oldCycleFromLong}
        centreColor={landed ? colors.accent : colors.textSoft}
        spin={Math.sin(Math.PI * spin) * (spin < 0.92 ? 1 : 0)}
      />
    </Hold>
  );
};

export const ElYearRingStatic: React.FC = () => (
  <Hold>
    <YearRing months={monthsCalendar} progress={useRamp(0, 0.9)} rotationMonths={0}
      arcProgress={useRamp(0.3, 2.4)} color={colors.primary}
      centreTop="SALARY CYCLE" centreMain="12" centreColor={colors.text} />
  </Hold>
);

/* ------------------------------------------------------- plates and icons */

export const ElRangeOld: React.FC = () => (
  <Hold><RangePlate progress={useRamp(0.1, 0.8)} from={cycle.oldCycleFrom} to={cycle.oldCycleTo} quiet size={140} /></Hold>
);
export const ElRangeNew: React.FC = () => (
  <Hold><RangePlate progress={useRamp(0.1, 0.8)} from={cycle.newCycleFrom} to={cycle.newCycleTo} size={160} /></Hold>
);

const IconStage: React.FC<{children: React.ReactNode}> = ({children}) => <Hold>{children}</Hold>;

export const ElIconMerit: React.FC = () => <IconStage><MeritIcon progress={useRamp(0.1, 0.8)} size={300} /></IconStage>;
export const ElIconPromotion: React.FC = () => <IconStage><PromotionIcon progress={useRamp(0.1, 0.8)} size={300} /></IconStage>;
export const ElIconBonus: React.FC = () => <IconStage><BonusIcon progress={useRamp(0.1, 0.8)} size={300} /></IconStage>;
export const ElIconPerformance: React.FC = () => <IconStage><PerformanceIcon progress={useRamp(0.1, 0.8)} size={300} /></IconStage>;
export const ElIconTick: React.FC = () => <IconStage><Tick progress={useRamp(0.1, 0.9)} size={260} /></IconStage>;

/** The three KPI glyphs, static SVGs, side by side. */
export const ElIconsKpi: React.FC = () => {
  const t = useSeconds();
  const cards: Array<[string, React.ReactNode]> = [
    ['HSE', <HseIcon key="h" color={colors.accent} />],
    ['FINANCE', <FinanceIcon key="f" color={colors.accent} />],
    ['PERFORMANCE', <PerformanceKpiIcon key="p" color={colors.accent} />],
  ];
  return (
    <Hold>
      <div style={{display: 'flex', gap: 80, alignItems: 'center'}}>
        {cards.map(([label, glyph], i) => (
          <div key={label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
            opacity: ramp(t, 0.1 + i * 0.35, 0.7)}}>
            <div style={{width: 200, height: 200}}>{glyph}</div>
            <Label size={30} color={colors.accent}>{label}</Label>
          </div>
        ))}
      </div>
    </Hold>
  );
};

export const ElForecastChart: React.FC = () => (
  <Hold>
    <ForecastChart progress={useRamp(0.1, 1.2)} forecast={useRamp(1.4, 2.6)} width={1100} height={520}
      forecastColor={colors.accent} />
  </Hold>
);

/* ---------------------------------------------- the implementation-year set */

/** Twelve solid month tiles plus the three that only exist once. */
export const ElFifteenMonths: React.FC = () => {
  const pBase = useRamp(0.1, 1.0);
  const pExtra = useRamp(1.3, 0.9);
  const tileW = (1680 - 10 * 14 - 46) / 15;
  const Group = ({months, p, ghost, numbers}: {months: readonly string[]; p: number; ghost?: boolean; numbers?: readonly string[]}) => (
    <div style={{display: 'flex', gap: 10}}>
      {months.map((m, i) => {
        const local = Math.min(1, Math.max(0, p * (months.length + 4) - i));
        const tone = ghost ? colors.accent : colors.primary;
        return (
          <div key={m + i} style={{opacity: local, transform: `translate3d(0,${(1 - local) * 22}px,0)`}}>
            <div style={{
              width: tileW, height: 74, borderRadius: 12, display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              background: ghost ? `${tone}14` : `linear-gradient(160deg, ${colors.surfaceLit}aa, ${colors.surface}dd)`,
              border: ghost ? `2px dashed ${tone}aa` : `1.5px solid ${colors.line}`,
              boxShadow: ghost ? `0 0 26px ${tone}22` : '0 12px 30px rgba(0,0,0,0.38)',
              fontFamily: fonts.body, fontWeight: 700, fontSize: 23, letterSpacing: 1.6,
              color: ghost ? tone : colors.textSoft,
            }}>{m}</div>
            {numbers?.[i] ? (
              <div style={{marginTop: 9, textAlign: 'center', fontFamily: fonts.body, fontWeight: 700,
                fontSize: 14, letterSpacing: 1.3, color: tone, whiteSpace: 'nowrap'}}>{numbers[i]}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
  return (
    <Hold>
      <div style={{display: 'flex', alignItems: 'flex-start', gap: 46}}>
        <div>
          <Group months={implementation.baseMonths} p={pBase} />
          <div style={{marginTop: 37, opacity: pBase}}><Label size={22} color={colors.textSoft}>{implementation.twelve}</Label></div>
        </div>
        <div>
          <Group months={implementation.extraMonths} p={pExtra} ghost numbers={implementation.extraMonthNumbers} />
          <div style={{marginTop: 14, opacity: pExtra}}><Label size={22} color={colors.accent}>{implementation.plusThree}</Label></div>
        </div>
      </div>
    </Hold>
  );
};

/** 5% struck through, resolving into 6.25% - both labelled with their period. */
export const ElFiveToSixTwentyFive: React.FC = () => {
  const pIn = useRamp(0.2, 0.7);
  const pStrike = useRamp(1.1, 0.5);
  return (
    <Hold>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40}}>
        <div style={{opacity: pIn, textAlign: 'center'}}>
          <div style={{position: 'relative'}}>
            <Display size={104} color={colors.muted}>{implementation.merit}</Display>
            <div style={{position: 'absolute', left: -6, right: -6, top: '52%', height: 5, borderRadius: 3,
              background: colors.muted, transform: `scaleX(${pStrike})`, transformOrigin: 'left center'}} />
          </div>
          <div style={{marginTop: 6}}><Label size={19} color={colors.muted}>{implementation.over12}</Label></div>
        </div>
        <Display size={72} color={colors.accent} style={{opacity: pIn}}>&rarr;</Display>
        <div style={{opacity: pIn, textAlign: 'center', transform: `scale(${0.88 + pIn * 0.12})`}}>
          <Display size={128} color={colors.accent} glow>{implementation.equivalent}</Display>
          <div style={{marginTop: 2}}><Label size={19} color={colors.accent}>{implementation.over15}</Label></div>
        </div>
      </div>
    </Hold>
  );
};

/** TODAY / NOV DEC / ESTIMATED against NEW CYCLE / JAN FEB / ACTUAL. */
export const ElTimingCompare: React.FC = () => {
  const pWas = useRamp(0.2, 0.6);
  const pNow = useRamp(0.7, 0.7);
  const Row = ({p, label, months, tag, tone, strong}: {p: number; label: string; months: string[]; tag: string; tone: string; strong?: boolean}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: p,
      transform: `translate3d(0,${(1 - p) * 18}px,0)`}}>
      <div style={{width: 168, textAlign: 'right'}}><Label size={20} color={strong ? tone : colors.muted}>{label}</Label></div>
      <div style={{display: 'flex', gap: 10}}>
        {months.map((m) => (
          <div key={m} style={{minWidth: 74, padding: '7px 14px', borderRadius: 9, textAlign: 'center',
            background: strong ? `${tone}1c` : 'transparent',
            border: `1.5px ${strong ? 'solid' : 'dashed'} ${tone}${strong ? 'cc' : '66'}`,
            fontFamily: fonts.body, fontWeight: 800, fontSize: 22, letterSpacing: 1.6, color: tone}}>{m}</div>
        ))}
      </div>
      <Label size={20} color={strong ? colors.text : colors.muted}>{tag}</Label>
    </div>
  );
  return (
    <Hold>
      <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
        <Row p={pWas} label="TODAY" months={['NOV', 'DEC']} tag="ESTIMATED" tone={colors.primary} />
        <Row p={pNow} label="NEW CYCLE" months={['JAN', 'FEB']} tag="ACTUAL" tone={colors.accent} strong />
      </div>
    </Hold>
  );
};
