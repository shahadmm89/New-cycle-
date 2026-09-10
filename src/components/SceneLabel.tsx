/** Small uppercase chip in the top-left that names the current section. */
import React from 'react';
import {colors, fonts} from '../lib/theme';
import {WriteOn} from './Draw';

export const SceneLabel: React.FC<{text: string; progress: number; color?: string}> = ({
  text,
  progress,
  color = colors.primary,
}) => (
  <div style={{position: 'absolute', left: 130, top: 62}}>
    <WriteOn progress={progress}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: 3.2,
          color,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{width: 34, height: 5, background: color, borderRadius: 3, display: 'block'}} />
        {text}
      </div>
    </WriteOn>
  </div>
);
