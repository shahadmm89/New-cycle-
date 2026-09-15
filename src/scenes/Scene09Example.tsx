/**
 * SCENE 9 - THE IMPLEMENTATION YEAR
 *
 * The one piece of arithmetic in the film, and the one place it could be
 * misread, so the frame is built around two guards:
 *
 *   IMPLEMENTATION YEAR ONLY   - this happens once, not every year
 *   ILLUSTRATIVE EXAMPLE       - 6.25% is a worked figure, not a promise
 *
 * The months are drawn as twelve solid tiles plus three ghosted ones, so
 * "12 + 3 = 15" is read off the picture rather than taken on trust. The working
 * runs underneath it, and the result row strikes the 5% and resolves it into
 * 6.25% - the same increase, measured across a longer year.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Card3D} from '../components/Card3D';
import {Display, Label, Rise, Chip} from '../components/Type';
import {useProgress, useScene} from '../lib/timing';
import {colors, fonts} from '../lib/theme';
import {implementation} from '../config/copy';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * A run of month tiles. `ghost` draws the three that only exist this one year.
 *
 * `numbers` writes MONTH 13/14/15 under the ghosted run. Without it the three
 * extra tiles read as "next January" - the numbers are what make them the
 * thirteenth, fourteenth and fifteenth month of a single calculation.
 */
const MonthGroup: React.FC<{
  months: readonly string[];
  progress: number;
  tileW: number;
  ghost?: boolean;
  numbers?: readonly string[];
}> = ({months, progress, tileW, ghost = false, numbers}) => {
  const n = months.length;
  const tone = ghost ? colors.accent : colors.primary;
  return (
    <div style={{display: 'flex', gap: 10}}>
      {months.map((m, i) => {
        const local = clamp(progress * (n + 4) - i);
        return (
          <div
            key={`${m}-${i}`}
            style={{
              opacity: local,
              transform: `translate3d(0, ${(1 - local) * 22}px, 0)`,
              willChange: 'transform, opacity',
            }}
          >
            <div
              style={{
                width: tileW,
                height: 74,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: ghost
                  ? `${tone}14`
                  : `linear-gradient(160deg, ${colors.surfaceLit}aa, ${colors.surface}dd)`,
                border: ghost ? `2px dashed ${tone}aa` : `1.5px solid ${colors.line}`,
                boxShadow: ghost ? `0 0 26px ${tone}22` : '0 12px 30px rgba(0,0,0,0.38)',
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: 23,
                letterSpacing: 1.6,
                color: ghost ? tone : colors.textSoft,
              }}
            >
              {m}
            </div>
            {numbers?.[i] ? (
              <div
                style={{
                  marginTop: 9,
                  textAlign: 'center',
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 1.3,
                  color: tone,
                  whiteSpace: 'nowrap',
                }}
              >
                {numbers[i]}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

/** One term of the working. Never unmounts, so the row cannot shuffle. */
const Term: React.FC<{progress: number; value: string; size: number; color: string; caption?: string}> = ({
  progress,
  value,
  size,
  color,
  caption,
}) => {
  const p = clamp(progress);
  return (
    <div
      style={{
        position: 'relative',
        opacity: p,
        transform: `translate3d(0, ${(1 - p) * 18}px, 0)`,
        willChange: 'transform, opacity',
      }}
    >
      <Display size={size} color={color}>{value}</Display>
      {caption ? (
        <div style={{position: 'absolute', top: '100%', left: 2, marginTop: 12}}>
          <Label size={19} color={colors.textSoft}>{caption}</Label>
        </div>
      ) : null}
    </div>
  );
};

export const Scene09Example: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pLabel = useProgress('labelIn', 0.5);
  const pRail = useProgress('railIn', 1.0);
  const pExtra = useProgress('extraIn', 0.9);
  const pCard = useProgress('cardIn', 0.6);
  const pMerit = useProgress('meritValue', 0.5);
  const pDivide = useProgress('divide', 0.5);
  const pPerMonth = useProgress('perMonth', 0.6);
  const pMultiply = useProgress('multiply', 0.5);
  const pResult = useProgress('resultIn', 0.7);
  const pStrike = useProgress('strike', 0.5);
  // A slow arrival, deliberately: this is the line that stops 6.25% being
  // read as a new merit rate, and it resolves as the narrator says it.
  const pNote = useProgress('settle', 2.4);

  // Twelve solid + three ghosted, on one shared tile width so the groups read
  // as one run of fifteen rather than two unrelated rails.
  const tileW = (1680 - 10 * 14 - 46) / 15;

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 86, display: 'flex', alignItems: 'center', gap: 26}}>
        <Rise progress={pLabel} distance={22}>
          <Label size={31} color={colors.accent}>{t.label}</Label>
        </Rise>
        <Rise progress={pLabel} distance={18}>
          <Chip color={colors.accent} filled={false} size={22}>{t.once}</Chip>
        </Rise>
      </div>

      {/* 12 + 3 */}
      <div style={{position: 'absolute', left: 120, top: 176, display: 'flex', alignItems: 'flex-start', gap: 46}}>
        <div>
          <MonthGroup months={implementation.baseMonths} progress={pRail} tileW={tileW} />
          <div style={{marginTop: 37, opacity: pRail}}>
            <Label size={22} color={colors.textSoft}>{t.twelve}</Label>
          </div>
        </div>
        <div>
          <MonthGroup
            months={implementation.extraMonths}
            progress={pExtra}
            tileW={tileW}
            ghost
            numbers={t.extraMonthNumbers as unknown as string[]}
          />
          <div style={{marginTop: 14, opacity: pExtra}}>
            <Label size={22} color={colors.accent}>{t.plusThree}</Label>
          </div>
        </div>
      </div>

      {/* the working, then the result */}
      <div style={{position: 'absolute', left: 120, top: 344}}>
        <Card3D progress={pCard} width={1680} height={396} rotateY={2} accent={colors.primary} padding={42}>
          <div style={{display: 'flex', flexDirection: 'column', height: '100%', gap: 4}}>
            <Rise progress={pCard} distance={16}>
              <Label size={26} color={colors.primary}>{t.illustrative}</Label>
            </Rise>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 34,
                marginTop: 22,
                paddingBottom: 34,
              }}
            >
              <Term progress={pMerit} value={t.merit} size={72} color={colors.text} />
              <Term progress={pDivide} value={t.dividedBy} size={46} color={colors.textSoft} />
              <Term
                progress={pPerMonth}
                value={`= ${t.perMonth}`}
                size={62}
                color={colors.text}
                caption={t.perMonthLabel}
              />
              <Term progress={pMultiply} value={t.multipliedBy} size={46} color={colors.textSoft} />
            </div>

            {/* the transformation itself */}
            <div
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, marginTop: 'auto'}}
            >
              <div style={{opacity: pResult, textAlign: 'center'}}>
                <div style={{position: 'relative'}}>
                  <Display size={104} color={colors.muted}>{t.merit}</Display>
                  <div
                    style={{
                      position: 'absolute',
                      left: -6,
                      right: -6,
                      top: '52%',
                      height: 5,
                      borderRadius: 3,
                      background: colors.muted,
                      transform: `scaleX(${clamp(pStrike)})`,
                      transformOrigin: 'left center',
                    }}
                  />
                </div>
                <div style={{marginTop: 6}}>
                  <Label size={19} color={colors.muted}>{t.over12}</Label>
                </div>
              </div>
              <Display size={72} color={colors.accent} style={{opacity: pResult}}>&rarr;</Display>
              <div style={{opacity: pResult, textAlign: 'center', transform: `scale(${0.88 + pResult * 0.12})`}}>
                <Display size={128} color={colors.accent} glow>{t.equivalent}</Display>
                <div style={{marginTop: 2}}>
                  <Label size={19} color={colors.accent}>{t.over15}</Label>
                </div>
              </div>
            </div>
          </div>
        </Card3D>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 792, display: 'flex', justifyContent: 'center'}}>
        <Rise progress={pNote} distance={20}>
          <Label size={25} color={colors.textSoft}>{t.unchanged}</Label>
        </Rise>
      </div>
    </AbsoluteFill>
  );
};
