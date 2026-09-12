/**
 * Persistent furniture: a thin progress line, and nothing else.
 *
 * There was a logo slot in the top-right corner too. It is gone: the closing
 * scene presents the logo properly, and a second one sitting in the corner for
 * the whole film competed with the message rather than supporting it.
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../lib/theme';

export const Chrome: React.FC<{hidden?: boolean}> = ({hidden = false}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = Math.min(1, frame / (durationInFrames - 1));
  if (hidden) return null;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 5}}>
        {/* The gradient is sized to the full stage so the bar reveals it
            left-to-right, rather than squashing it into the filled width. */}
        <div
          style={{
            width: `${p * 100}%`,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 1920,
              height: '100%',
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
              boxShadow: `0 0 18px ${colors.accent}66`,
            }}
          />
        </div>
      </div>

    </AbsoluteFill>
  );
};
