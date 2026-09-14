/**
 * The thin month timeline that runs along the bottom of the screen.
 *
 * It is deliberately secondary: a hairline rule, small ticks, and pins that
 * arrive one at a time as the narrator names them. The scene above it carries
 * the message; this only answers "when".
 *
 * It also re-orders. Given `into`, each month slides from its position in
 * `months` to its position in the new order, which is how January-December
 * becomes April-March without a cut - the same twelve months, re-aligned.
 *
 * Rendered once at film level (see Video.tsx) rather than per scene, so it can
 * stay continuous - and re-align mid-sentence - across four scenes.
 *
 * Lives in the band between the scene content and the subtitles: the rule sits
 * at y 874 and pins grow upward from it.
 */
import React from 'react';
import {colors, fonts} from '../lib/theme';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** Where the rule sits inside the component box. */
const RULE_Y = 62;
/** Height of the stem between a pin's text and the rule. */
const STEM = 16;
/** Pin text is centred in a box this wide, so long labels cannot collide. */
const PIN_BOX = 300;
/**
 * Neighbouring months are only ~145px apart, which is narrower than a pin, so
 * pins alternate between two heights. `tier: 1` sits this far above `tier: 0`.
 */
const TIER_RISE = 78;
/** How high a month lifts as it travels to its new place in the cycle. */
const TRAVEL_LIFT = 3.4;

export interface TimelinePin {
  /** Which month it points at, by label. */
  month: string;
  /** The headline on the pin - usually the month spelled out. */
  label: string;
  /** What this date feeds: "Merit", "Bonus". Optional. */
  kind?: string;
  /** The detail underneath it. Newlines are honoured, so wrapping is decided here. */
  sub: string;
  /** 0 -> 1 entrance. */
  progress: number;
  /** `actual` is the new cycle's better information; `estimate` is today's. */
  tone?: 'estimate' | 'actual';
  /** 0 sits on the rule, 1 rides above it. Alternate these on adjacent months. */
  tier?: 0 | 1;
}

export const Timeline: React.FC<{
  months: readonly string[];
  /** 0 -> 1: the rule draws left to right and the ticks arrive behind it. */
  progress: number;
  width: number;
  pins?: TimelinePin[];
  /** Optional re-order target. Months travel from `months` into this order. */
  into?: readonly string[];
  /** 0 -> 1 of that re-order. */
  morph?: number;
  color?: string;
  /** Colour the months take once they have re-ordered. */
  morphColor?: string;
  /** How far a pin's text box may hang past either end of the rule. */
  edge?: number;
}> = ({
  months,
  progress,
  width,
  pins = [],
  into,
  morph = 0,
  color = colors.primary,
  morphColor = colors.accent,
  edge = 150,
}) => {
  const p = clamp(progress);
  const m = clamp(morph);
  const n = months.length;
  const step = width / (n - 1);
  const tone = m > 0.55 ? morphColor : color;

  /** Where a month sits horizontally, accounting for any re-order in flight. */
  const xOf = (month: string) => {
    const from = months.indexOf(month);
    const to = into ? into.indexOf(month) : from;
    return (from + (to - from) * m) * step;
  };

  /**
   * Months that have a long way to go lift over the ones that barely move, so
   * the re-alignment reads as twelve months being carried into a new order
   * rather than a row of labels jumbling together in passing.
   */
  const liftOf = (month: string) => {
    if (!into || m <= 0 || m >= 1) return 0;
    const distance = Math.abs(into.indexOf(month) - months.indexOf(month));
    return -Math.sin(Math.PI * m) * distance * TRAVEL_LIFT;
  };

  return (
    <div style={{position: 'relative', width, height: RULE_Y + 26}}>
      {/* the rule */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: RULE_Y,
          width: width * p,
          height: 1.5,
          background: `linear-gradient(90deg, ${tone}22, ${tone}aa 12%, ${tone}aa 88%, ${tone}22)`,
        }}
      />

      {months.map((month, i) => {
        // Ticks arrive just behind the drawing rule.
        const local = clamp(p * (n + 3) - i);
        const x = xOf(month);
        const isEnd = i === 0 || i === n - 1;
        // After a re-order the new first and last months are the ones that matter.
        const newEnd = into ? into.indexOf(month) === 0 || into.indexOf(month) === n - 1 : false;
        const lit = m > 0.55 ? newEnd : isEnd;

        return (
          <div
            key={`${month}-${i}`}
            style={{
              position: 'absolute',
              left: x,
              top: RULE_Y - 6,
              opacity: local,
              transform: `translate(-50%, ${liftOf(month)}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              willChange: 'transform, opacity',
            }}
          >
            <div
              style={{
                width: lit ? 3 : 1.5,
                height: lit ? 13 : 8,
                borderRadius: 1,
                background: lit ? tone : `${tone}88`,
                boxShadow: lit ? `0 0 10px ${tone}88` : undefined,
              }}
            />
            <div
              style={{
                fontFamily: fonts.body,
                fontWeight: lit ? 800 : 600,
                fontSize: 15,
                letterSpacing: 1.4,
                color: lit ? tone : colors.muted,
                whiteSpace: 'nowrap',
              }}
            >
              {month}
            </div>
          </div>
        );
      })}

      {/* pins - these are the whole point of the timeline */}
      {pins.map((pin) => {
        const pp = clamp(pin.progress);
        if (pp <= 0) return null;
        // Blue is today's estimate, amber is the new cycle's actual figure -
        // the same colour language the scenes above use.
        const accent = pin.tone === 'actual' ? colors.accent : colors.primary;
        const x = xOf(pin.month);
        const rise = (pin.tier ?? 0) * TIER_RISE;
        // The text is centred on the month but never allowed off the frame; the
        // stem still drops from the tick itself, so nothing points at the wrong
        // month even when the label has been nudged inward.
        const boxLeft = Math.min(Math.max(x - PIN_BOX / 2, -edge), width + edge - PIN_BOX);
        return (
          <React.Fragment key={pin.month + pin.label}>
            <div
              style={{
                position: 'absolute',
                left: boxLeft,
                bottom: 26 + STEM + rise,
                width: PIN_BOX,
                opacity: pp,
                transform: `translateY(${(1 - pp) * 8}px)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                willChange: 'transform, opacity',
              }}
            >
              <div
                style={{
                  fontFamily: fonts.body,
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: 2,
                  color: accent,
                  whiteSpace: 'nowrap',
                }}
              >
                {pin.label}
              </div>
              {pin.kind ? (
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: 1.8,
                    color: colors.muted,
                    whiteSpace: 'nowrap',
                    marginTop: 3,
                  }}
                >
                  {pin.kind.toUpperCase()}
                </div>
              ) : null}
              <div
                style={{
                  fontFamily: fonts.body,
                  fontWeight: 600,
                  fontSize: 18,
                  lineHeight: 1.2,
                  letterSpacing: 0.2,
                  color: colors.text,
                  whiteSpace: 'pre-line',
                  marginTop: 3,
                }}
              >
                {pin.sub}
              </div>
            </div>

            {/* the stem down to the rule, and the dot on it */}
            <div
              style={{
                position: 'absolute',
                left: x,
                bottom: 26,
                width: 1.5,
                height: (STEM + rise) * pp,
                transform: 'translateX(-50%)',
                background: `linear-gradient(180deg, ${accent}00, ${accent})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: x,
                bottom: 26 - 4.5,
                width: 9,
                height: 9,
                borderRadius: '50%',
                opacity: pp,
                transform: 'translateX(-50%)',
                background: accent,
                boxShadow: `0 0 14px ${accent}`,
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
