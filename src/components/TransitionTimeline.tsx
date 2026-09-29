/**
 * THE 2027 TRANSITION TIMELINE
 *
 *   2026 - DECEMBER - [ JANUARY - FEBRUARY - MARCH ] - APRIL 2027
 *                     \______ transition (coral) ____/     new timing (amber)
 *
 * Shared by the implementation-year, leave-balance and vacation-allowance
 * scenes, drawn identically in each so the cut between them is invisible and
 * only the callouts change. The three transition months are the one place the
 * coral `transition` colour is used.
 *
 * Callouts are drawn by the scenes themselves, placed with `nodeX` so they sit
 * exactly under the month they describe.
 */
import React from 'react';
import {colors, fonts} from '../lib/theme';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** Frame-space layout of the rail. */
export const TT = {left: 190, width: 1540, y: 560} as const;

export const NODES = [
  {key: 'y2026', label: '2026', tone: 'old'},
  {key: 'dec', label: 'DECEMBER', tone: 'old'},
  {key: 'jan', label: 'JANUARY', tone: 'transition'},
  {key: 'feb', label: 'FEBRUARY', tone: 'transition'},
  {key: 'mar', label: 'MARCH', tone: 'transition'},
  {key: 'apr', label: 'APRIL 2027', tone: 'new'},
] as const;

export type NodeKey = (typeof NODES)[number]['key'];

/** Frame-space x of a node. */
export const nodeX = (key: NodeKey) => {
  const i = NODES.findIndex((n) => n.key === key);
  return TT.left + (TT.width * i) / (NODES.length - 1);
};

const BAND_PAD = 96;

export const TransitionTimeline: React.FC<{
  /** 0 -> 1: the rail draws left to right and the nodes arrive behind it. */
  progress: number;
  /** 0 -> 1: the coral transition band over JANUARY-MARCH. */
  band: number;
  /** 0 -> 1: APRIL 2027 lights up as the new start. */
  april: number;
  /** Label over the band. */
  bandLabel?: string;
  /** 0 -> 1 per node: extra emphasis on a node a scene is talking about. */
  focus?: Partial<Record<NodeKey, number>>;
}> = ({progress, band, april, bandLabel = 'TRANSITION', focus = {}}) => {
  const p = clamp(progress);
  const b = clamp(band);
  const a = clamp(april);
  if (p <= 0) return null;

  const x0 = nodeX('y2026');
  const xJan = nodeX('jan');
  const xMar = nodeX('mar');
  const xApr = nodeX('apr');
  const drawn = x0 + (xApr - x0) * p;

  const colourOf = (tone: string) =>
    tone === 'transition' ? (b > 0.3 ? colors.transition : colors.textSoft)
    : tone === 'new' ? (a > 0.3 ? colors.accent : colors.textSoft)
    : colors.muted;

  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {/* the transition band */}
      <div
        style={{
          position: 'absolute',
          left: xJan - BAND_PAD,
          top: TT.y - 46,
          width: xMar - xJan + BAND_PAD * 2,
          height: 150,
          borderRadius: 20,
          background: `${colors.transition}1f`,
          border: `2px solid ${colors.transition}aa`,
          boxShadow: `0 0 40px ${colors.transition}33`,
          opacity: b,
          transform: `scaleX(${0.85 + 0.15 * b})`,
          transformOrigin: 'left center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: xJan - BAND_PAD,
          width: xMar - xJan + BAND_PAD * 2,
          top: TT.y - 92,
          textAlign: 'center',
          opacity: b,
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: 5,
          color: colors.transition,
        }}
      >
        {bandLabel}
      </div>

      {/* the rail: old timing, transition, new timing */}
      <div style={{position: 'absolute', left: x0, top: TT.y - 2, width: Math.max(0, Math.min(drawn, xJan) - x0), height: 4, borderRadius: 2, background: colors.muted}} />
      <div
        style={{
          position: 'absolute',
          left: xJan,
          top: TT.y - 2,
          width: Math.max(0, Math.min(drawn, xMar) - xJan),
          height: 4,
          borderRadius: 2,
          background: b > 0.3 ? colors.transition : colors.muted,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: xMar,
          top: TT.y - 2,
          width: Math.max(0, drawn - xMar),
          height: 4,
          borderRadius: 2,
          background: a > 0.3 ? colors.accent : colors.muted,
        }}
      />

      {NODES.map((n, i) => {
        const x = nodeX(n.key);
        const local = clamp(p * (NODES.length + 1) - i);
        const col = colourOf(n.tone);
        const f = clamp(focus[n.key] ?? 0);
        const isApr = n.key === 'apr';
        const dot = (isApr ? 26 : 18) + f * 8;
        return (
          <React.Fragment key={n.key}>
            <div
              style={{
                position: 'absolute',
                left: x - dot / 2,
                top: TT.y - dot / 2,
                width: dot,
                height: dot,
                borderRadius: '50%',
                background: col,
                opacity: local,
                boxShadow: n.tone !== 'old' ? `0 0 ${14 + f * 16}px ${col}` : undefined,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: x - 160,
                width: 320,
                top: TT.y + 30,
                textAlign: 'center',
                opacity: local,
                transform: `translate3d(0, ${(1 - local) * 12}px, 0) scale(${1 + f * 0.08})`,
                fontFamily: isApr ? fonts.display : fonts.body,
                fontWeight: 800,
                fontSize: isApr ? 36 : 27,
                letterSpacing: isApr ? 0 : 2,
                color: col,
                whiteSpace: 'nowrap',
              }}
            >
              {n.label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
