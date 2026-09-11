/**
 * The small vocabulary of icons the film uses. Flat geometry with a single
 * gradient and a soft glow - enough dimension to feel designed, not so much
 * that it competes with the type.
 */
import React from 'react';
import {colors, fonts} from '../lib/theme';

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

/** Four KPI bars - the company performance dashboard, reduced to its essence. */
export const KpiTiles: React.FC<{
  labels: readonly string[];
  progress: number;
  width: number;
  color?: string;
}> = ({labels, progress, width, color = colors.primary}) => {
  const heights = [0.55, 0.82, 0.42, 0.68];
  const gap = 16;
  const barArea = 108;
  const w = (width - gap * (labels.length - 1)) / labels.length;
  return (
    <div style={{display: 'flex', gap, alignItems: 'flex-end'}}>
      {labels.map((l, i) => {
        const p = clamp(progress * (labels.length + 2) - i);
        return (
          <div key={l} style={{width: w, display: 'flex', flexDirection: 'column', gap: 12}}>
            {/* fixed-height well, so every bar grows from the same baseline */}
            <div style={{height: barArea, display: 'flex', alignItems: 'flex-end'}}>
              <div
                style={{
                  width: '100%',
                  height: barArea * heights[i % heights.length] * p,
                  borderRadius: 8,
                  background: `linear-gradient(180deg, ${color}, ${color}55)`,
                  boxShadow: `0 0 22px ${color}55`,
                }}
              />
            </div>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 1,
                color: colors.textSoft,
                opacity: p,
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
            >
              {l}
            </div>
          </div>
        );
      })}
    </div>
  );
};
