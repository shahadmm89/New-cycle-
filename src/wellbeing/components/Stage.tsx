/**
 * The navy stage, in its calm form.
 *
 * This is the company's existing stage - same navy, same soft wash - with the
 * perspective floor grid removed. That grid made the salary-cycle film feel
 * mechanical, which was right for a film about a mechanism. This film is about
 * people, so the stage is just light: a slow warm drift, and nothing else to
 * look at.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {wb} from '../../config/wellbeing.design';
import {useDrift} from '../timing';

export const WellbeingStage: React.FC<{
  /** 0 -> 1. Scenes raise this on their hero moment. */
  glow?: number;
  glowX?: number;
  glowY?: number;
}> = ({glow = 0.22, glowX = 960, glowY = 470}) => {
  // The whole stage breathes, very slowly. Nothing in this film is ever still.
  const driftX = useDrift(0.035, 26);
  const driftY = useDrift(0.028, 16, 0.25);

  return (
    <AbsoluteFill style={{backgroundColor: wb.bg}}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{position: 'absolute'}}
      >
        <defs>
          <radialGradient id="wb-wash" cx="50%" cy="38%" r="82%">
            <stop offset="0%" stopColor="#13315F" stopOpacity="0.78" />
            <stop offset="58%" stopColor="#081A36" stopOpacity="0.38" />
            <stop offset="100%" stopColor={wb.bgDeep} stopOpacity="0.96" />
          </radialGradient>
          <radialGradient id="wb-glow">
            <stop offset="0%" stopColor={wb.accent} stopOpacity="0.26" />
            <stop offset="52%" stopColor={wb.accent} stopOpacity="0.07" />
            <stop offset="100%" stopColor={wb.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1920" height="1080" fill="url(#wb-wash)" />

        {glow > 0 ? (
          <circle
            cx={glowX + driftX}
            cy={glowY + driftY}
            r={700}
            fill="url(#wb-glow)"
            opacity={glow}
          />
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
