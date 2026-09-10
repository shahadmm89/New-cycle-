/** The notebook-paper stage every scene is drawn on. */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {colors} from '../lib/theme';

export const Paper: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: colors.background}}>
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
      <defs>
        <pattern id="paper-dots" width="46" height="46" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.6" fill={colors.line} opacity="0.55" />
        </pattern>
        <radialGradient id="paper-vignette" cx="50%" cy="44%" r="78%">
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#B9A98C" stopOpacity="0.13" />
        </radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#paper-dots)" />
      <rect width="1920" height="1080" fill="url(#paper-vignette)" />
    </svg>
  </AbsoluteFill>
);
