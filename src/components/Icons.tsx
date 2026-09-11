/**
 * The small vocabulary of icons the film uses. Flat geometry with a single
 * gradient and a soft glow - enough dimension to feel designed, not so much
 * that it competes with the type.
 */
import React from 'react';
import {colors, fonts, depth} from '../lib/theme';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

const Glyph: React.FC<{
  progress: number;
  size: number;
  color: string;
  children: React.ReactNode;
  /** Lift on entrance, in px. Merit and promotion rise; bonus settles. */
  lift?: number;
}> = ({progress, size, color, children, lift = 30}) => {
  const p = clamp(progress);
  if (p <= 0) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        opacity: p,
        transform: `translate3d(0, ${(1 - p) * lift}px, 0) scale(${0.76 + 0.24 * p})`,
        borderRadius: size * 0.28,
        display: 'grid',
        placeItems: 'center',
        background: `linear-gradient(150deg, ${color}2e, ${color}10)`,
        border: `2px solid ${color}66`,
        boxShadow: `0 18px 44px rgba(0,0,0,0.45), inset 0 2px 0 ${color}55, 0 0 44px ${color}33`,
        willChange: 'transform, opacity',
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 48 48" fill="none">
        {children}
      </svg>
    </div>
  );
};

/** Merit: an upward step chart. */
export const MeritIcon: React.FC<{progress: number; size?: number; color?: string}> = ({
  progress,
  size = 132,
  color = colors.accent,
}) => (
  <Glyph progress={progress} size={size} color={color}>
    <path d="M 6 38 L 18 26 L 27 33 L 42 12" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 30 12 L 42 12 L 42 24" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </Glyph>
);

/** Promotion: a star / step up. */
export const PromotionIcon: React.FC<{progress: number; size?: number; color?: string}> = ({
  progress,
  size = 132,
  color = colors.accent,
}) => (
  <Glyph progress={progress} size={size} color={color}>
    <path
      d="M 24 5 L 29.6 18.4 L 44 19.6 L 33 29.1 L 36.3 43 L 24 35.6 L 11.7 43 L 15 29.1 L 4 19.6 L 18.4 18.4 Z"
      fill={`${color}33`}
      stroke={color}
      strokeWidth={4}
      strokeLinejoin="round"
    />
  </Glyph>
);

/** Bonus: stacked coins. */
export const BonusIcon: React.FC<{progress: number; size?: number; color?: string}> = ({
  progress,
  size = 132,
  color = colors.accent,
}) => (
  <Glyph progress={progress} size={size} color={color} lift={-22}>
    <ellipse cx="24" cy="14" rx="16" ry="6.5" fill={`${color}3a`} stroke={color} strokeWidth={3.5} />
    <path d="M 8 14 V 24 C 8 27.6 15.2 30.5 24 30.5 S 40 27.6 40 24 V 14" stroke={color} strokeWidth={3.5} fill="none" />
    <path d="M 8 24 V 34 C 8 37.6 15.2 40.5 24 40.5 S 40 37.6 40 34 V 24" stroke={color} strokeWidth={3.5} fill="none" />
  </Glyph>
);

/** Performance: a document with a tick. */
export const PerformanceIcon: React.FC<{progress: number; size?: number; color?: string}> = ({
  progress,
  size = 132,
  color = colors.steady,
}) => (
  <Glyph progress={progress} size={size} color={color}>
    <rect x="9" y="5" width="30" height="38" rx="4" stroke={color} strokeWidth={3.5} fill={`${color}22`} />
    <path d="M 16 22 L 22 28 L 33 16" stroke={color} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
  </Glyph>
);

/** A standalone tick that draws itself. Used only for "NO CHANGE". */
export const Tick: React.FC<{progress: number; size?: number; color?: string}> = ({
  progress,
  size = 76,
  color = colors.steady,
}) => {
  const p = clamp(progress);
  const ring = clamp(p * 1.8);
  const draw = clamp((p - 0.3) / 0.7);
  return (
    <svg width={size} height={size} viewBox="0 0 76 76" style={{overflow: 'visible'}}>
      <circle
        cx={38}
        cy={38}
        r={34}
        fill={`${color}1e`}
        stroke={color}
        strokeWidth={4}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - ring}
        transform="rotate(-90 38 38)"
        style={{filter: `drop-shadow(0 0 16px ${color}88)`}}
      />
      <path
        d="M 21 39 L 32.5 51 L 55 26"
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - draw}
      />
    </svg>
  );
};

/** The market forecast line used in scene 3 and scene 9. */
export const ForecastChart: React.FC<{
  progress: number;
  forecast: number;
  width: number;
  height: number;
  color?: string;
  forecastColor?: string;
}> = ({progress, forecast, width, height, color = colors.primary, forecastColor = colors.accent}) => {
  const p = clamp(progress);
  const f = clamp(forecast);
  const hist = 'M 0 96 C 30 92, 52 74, 78 68 S 120 44, 150 38';
  const fore = 'M 150 38 C 178 32, 200 22, 228 8';
  return (
    <svg width={width} height={height} viewBox="0 0 232 104" style={{overflow: 'visible'}}>
      {[26, 60, 94].map((y) => (
        <line key={y} x1={0} y1={y} x2={232} y2={y} stroke={colors.line} strokeWidth={1.5} opacity={p} />
      ))}
      <path
        d={hist}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
      />
      <path
        d={fore}
        fill="none"
        stroke={forecastColor}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray="9 9"
        opacity={f}
        style={{filter: `drop-shadow(0 0 12px ${forecastColor}aa)`}}
      />
      <circle cx={228} cy={8} r={7} fill={forecastColor} opacity={clamp(f * 2 - 1)} />
    </svg>
  );
};

/** HSE: a shield with a check. Safety, said without words. */
export const HseIcon: React.FC<{color?: string}> = ({color = colors.primary}) => (
  <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
    <path
      d="M 24 4 L 41 11 V 24 C 41 34 33.5 41 24 44 C 14.5 41 7 34 7 24 V 11 Z"
      fill={`${color}22`}
      stroke={color}
      strokeWidth={3.2}
      strokeLinejoin="round"
    />
    <path d="M 16 24 L 21.5 30 L 32 18" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Finance: a coin over a rising column. */
export const FinanceIcon: React.FC<{color?: string}> = ({color = colors.primary}) => (
  <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="17" r="12" fill={`${color}22`} stroke={color} strokeWidth={3.2} />
    <path d="M 24 11 V 23 M 20.5 13.8 h 6 a 3 3 0 0 1 0 6 h -5 a 3 3 0 0 0 0 6 h 6"
      stroke={color} strokeWidth={2.6} strokeLinecap="round" fill="none" />
    <rect x="9" y="35" width="9" height="9" rx="2" fill={`${color}33`} stroke={color} strokeWidth={2.6} />
    <rect x="19.5" y="31" width="9" height="13" rx="2" fill={`${color}44`} stroke={color} strokeWidth={2.6} />
    <rect x="30" y="27" width="9" height="17" rx="2" fill={`${color}55`} stroke={color} strokeWidth={2.6} />
  </svg>
);

/** Performance: a gauge reading high. */
export const PerformanceKpiIcon: React.FC<{color?: string}> = ({color = colors.primary}) => (
  <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
    <path d="M 6 35 A 18 18 0 1 1 42 35" fill={`${color}18`} stroke={color} strokeWidth={3.2} strokeLinecap="round" />
    <path d="M 24 35 L 35 19" stroke={color} strokeWidth={4} strokeLinecap="round" />
    <circle cx="24" cy="35" r="4" fill={color} />
    <path d="M 11 28 l 3 1.5 M 24 15 v 3.4 M 37 28 l -3 1.5" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
  </svg>
);

/**
 * The three key company KPIs the bonus is measured against, as floating cards
 * that converge into one plate. The convergence is the point: three separate
 * measures becoming a single company-performance figure.
 */
export const KpiTrio: React.FC<{
  labels: readonly string[];
  /** One 0 -> 1 entrance per card. */
  cards: number[];
  /** 0 -> 1: the three cards sliding together under a single heading. */
  combine: number;
  combinedLabel: string;
  color?: string;
  accent?: string;
}> = ({labels, cards, combine, combinedLabel, color = colors.primary, accent = colors.accent}) => {
  const c = clamp(combine);
  const glyphs = [HseIcon, FinanceIcon, PerformanceKpiIcon];
  // The cards do NOT converge horizontally - at these label widths they would
  // collide. The roll-up is carried by the bracket beneath them instead.
  const spread = 330;
  const tone = c > 0.4 ? accent : color;

  return (
    <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: 244}}>
        {labels.map((l, i) => {
          const p = clamp(cards[i] ?? 0);
          const Glyph = glyphs[i % glyphs.length];
          const offset = (i - 1) * spread;
          return (
            <div
              key={l}
              style={{
                position: 'absolute',
                transform:
                  `perspective(${depth.perspective}px) ` +
                  `translate3d(${offset}px, ${(1 - p) * 40 - c * 14}px, ${c * 34}px) ` +
                  `rotateY(${(i - 1) * -7 * (1 - c)}deg) scale(${0.9 + 0.1 * p + c * 0.04})`,
                opacity: p,
                width: 244,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 18,
                willChange: 'transform, opacity',
              }}
            >
              <div
                style={{
                  width: 132,
                  height: 132,
                  padding: 30,
                  borderRadius: 26,
                  background: `linear-gradient(155deg, ${colors.surfaceLit}, ${colors.surface})`,
                  border: `2px solid ${tone}55`,
                  boxShadow: `0 20px 48px rgba(0,0,0,0.5), inset 0 2px 0 ${tone}44, 0 0 44px ${tone}22`,
                  boxSizing: 'border-box',
                }}
              >
                <Glyph color={tone} />
              </div>
              <div
                style={{
                  fontFamily: fonts.body,
                  fontWeight: 800,
                  fontSize: 27,
                  letterSpacing: 2,
                  color: c > 0.4 ? accent : colors.text,
                  whiteSpace: 'nowrap',
                }}
              >
                {l}
              </div>
            </div>
          );
        })}
      </div>

      {/* A bracket gathers the three into one figure. This is the roll-up:
          three separate measures becoming the number the bonus is set from. */}
      <div style={{marginTop: 18, opacity: c, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <svg width={760} height={54} viewBox="0 0 760 54" style={{overflow: 'visible'}}>
          <path
            d="M 40 4 V 22 Q 40 32 50 32 H 370 M 720 4 V 22 Q 720 32 710 32 H 390 M 380 32 V 50"
            fill="none"
            stroke={accent}
            strokeWidth={3}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - c}
            style={{filter: `drop-shadow(0 0 12px ${accent}88)`}}
          />
        </svg>
        <div
          style={{
            marginTop: 8,
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 4,
            color: colors.text,
            whiteSpace: 'nowrap',
            transform: `translate3d(0, ${(1 - c) * 16}px, 0)`,
          }}
        >
          {combinedLabel}
        </div>
      </div>
    </div>
  );
};
