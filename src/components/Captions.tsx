/**
 * Burned-in subtitles.
 *
 * They sit in a reserved band at the bottom of the frame that no scene draws
 * into, so they can never cover a graphic. A matching .srt/.vtt file is written
 * by `npm run captions` from exactly the same cue list.
 */
import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {buildCues} from '../lib/captions';
import {colors, fonts} from '../lib/theme';

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cues = useMemo(() => buildCues(), []);
  const t = frame / fps;

  const cue = cues.find((c) => t >= c.start && t < c.end);
  if (!cue) return null;

  const fade = Math.min(
    interpolate(t, [cue.start, cue.start + 0.12], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}),
    interpolate(t, [cue.end - 0.12, cue.end], [1, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}),
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 52,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1520,
          background: colors.captionBg,
          color: colors.captionText,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.28,
          letterSpacing: 0.2,
          padding: '16px 34px',
          borderRadius: 14,
          textAlign: 'center',
          opacity: fade,
          textWrap: 'balance',
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
