/**
 * The navy stage every scene is composed on.
 *
 * A deep navy field, a slow radial wash, a faint perspective grid for depth,
 * and an optional accent glow that scenes move around to point the eye.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {colors} from '../lib/theme';

export const Stage: React.FC<{
  /** Accent glow position, in stage coordinates. */
  glowX?: number;
  glowY?: number;
  /** 0 -> 1. Scenes raise this on their hero moment. */
  glow?: number;
}> = ({glowX = 960, glowY = 470, glow = 0}) => (
  <AbsoluteFill style={{backgroundColor: colors.background}}>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
      <defs>
        <radialGradient id="stage-wash" cx="50%" cy="34%" r="78%">
          <stop offset="0%" stopColor="#123061" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#081832" stopOpacity="0.35" />
          <stop offset="100%" stopColor={colors.backgroundDeep} stopOpacity="0.95" />
        </radialGradient>
        <linearGradient id="stage-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0.16" />
        </linearGradient>
        <radialGradient id="stage-glow">
          <stop offset="0%" stopColor={colors.accent} stopOpacity="0.30" />
          <stop offset="55%" stopColor={colors.accent} stopOpacity="0.08" />
          <stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1920" height="1080" fill="url(#stage-wash)" />

      {/* Perspective floor lines - they read as depth, not as a grid. */}
      <g opacity="0.5">
        {Array.from({length: 9}).map((_, i) => {
          const t = (i + 1) / 10;
          const y = 1080 - (1 - t) * (1 - t) * 560;
          return <line key={i} x1={0} y1={y} x2={1920} y2={y} stroke={colors.line} strokeWidth={1.2} opacity={t * 0.55} />;
        })}
        {Array.from({length: 15}).map((_, i) => {
          const x = (i - 7) * 240;
          return (
            <line
              key={`v${i}`}
              x1={960 + x * 0.12}
              y1={540}
              x2={960 + x}
              y2={1080}
              stroke={colors.line}
              strokeWidth={1.2}
              opacity={0.4}
            />
          );
        })}
      </g>
      <rect y="540" width="1920" height="540" fill="url(#stage-floor)" opacity="0.5" />

      {glow > 0 && (
        <circle cx={glowX} cy={glowY} r={620} fill="url(#stage-glow)" opacity={glow} />
      )}
    </svg>
  </AbsoluteFill>
);
