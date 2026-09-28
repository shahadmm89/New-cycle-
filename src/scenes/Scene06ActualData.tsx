/**
 * SCENE 6 - WHAT THE NEW TIMING GIVES US (JANUARY, FEBRUARY)
 *
 * The counterpart to scene 4. There, November's work rested on an ESTIMATE.
 * Here the bottom timeline picks up JANUARY (the new cycle takes effect) and
 * FEBRUARY, when the same information arrives ACTUAL: inflation and market
 * movement, and company performance.
 *
 * Highly visual on purpose: the pins say what each month is, so the narration
 * only makes the point - actual results rather than estimates - and this frame
 * lets the forecast line resolve from a projection into a measurement.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ForecastChart, Tick} from '../components/Icons';
import {Display, Label, Rise} from '../components/Type';
import {Card3D, Plinth} from '../components/Card3D';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {colors, fonts} from '../lib/theme';

/**
 * The old timing against the new one, in one strip.
 *
 * Deliberately small. The scene above already says what the new timing gives
 * us; this only has to make the SHIFT legible at a glance - the same
 * inputs, later, and therefore actual rather than estimated. It
 * arrives after the point has been made, so it recaps rather than
 * reveals.
 */
const CompareRow: React.FC<{
  progress: number;
  label: string;
  months: readonly string[];
  tag: string;
  tone: string;
  strong?: boolean;
}> = ({progress, label, months, tag, tone, strong = false}) => (
  <Rise progress={progress} distance={18}>
    <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
      <div style={{width: 168, textAlign: 'right'}}>
        <Label size={20} color={strong ? tone : colors.muted}>{label}</Label>
      </div>
      <div style={{display: 'flex', gap: 10}}>
        {months.map((m) => (
          <div
            key={m}
            style={{
              minWidth: 74,
              padding: '7px 14px',
              borderRadius: 9,
              textAlign: 'center',
              background: strong ? `${tone}1c` : 'transparent',
              border: `1.5px ${strong ? 'solid' : 'dashed'} ${tone}${strong ? 'cc' : '66'}`,
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: 1.6,
              color: tone,
            }}
          >
            {m}
          </div>
        ))}
      </div>
      <Label size={20} color={strong ? colors.text : colors.muted}>{tag}</Label>
    </div>
  </Rise>
);

const Claim: React.FC<{progress: number; text: string}> = ({progress, text}) => (
  <Rise progress={progress} distance={30}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <Tick progress={progress} size={46} />
      <Display size={44} color={colors.text}>{text}</Display>
    </div>
  </Rise>
);

export const Scene06ActualData: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pChart = useProgress('chartIn', 0.6);
  const pData = useProgress('dataIn', 1.2);
  const pAlign = useProgress('alignIn', 2.6);
  const pLabel = useProgress('labelIn', 0.5);
  const p1 = useProgress('line1', 0.7);
  const p2 = useProgress('line2', 0.7);
  const pWas = useProgress('compareIn', 0.6);
  const pNow = useProgress('compareIn', 0.7);
  const drift = useIdle(0.13, 4);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 96}}>
        <Rise progress={pLabel} distance={22}>
          <Label size={30} color={colors.primary}>{t.label}</Label>
        </Rise>
      </div>

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', marginTop: -70}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 72,
            transform: `translate3d(0, ${drift}px, 0)`,
          }}
        >
          <Card3D progress={pChart} width={520} height={290} rotateY={9} accent={colors.primary} padding={34}>
            <ForecastChart progress={pData} forecast={pAlign} width={452} height={222} forecastColor={colors.accent} />
          </Card3D>

          <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
            <Claim progress={p1} text={t.line1} />
            <Plinth progress={p1} width={820} color={colors.primary} />
            <Claim progress={p2} text={t.line2} />
          </div>
        </div>
      </AbsoluteFill>

      {/* The shift itself: the same inputs, later, and now actual. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 668,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <CompareRow
          progress={pWas}
          label={t.wasLabel as string}
          months={t.wasMonths as unknown as string[]}
          tag={t.wasTag as string}
          tone={colors.primary}
        />
        <CompareRow
          progress={pNow}
          label={t.nowLabel as string}
          months={t.nowMonths as unknown as string[]}
          tag={t.nowTag as string}
          tone={colors.accent}
          strong
        />
      </div>
    </AbsoluteFill>
  );
};
