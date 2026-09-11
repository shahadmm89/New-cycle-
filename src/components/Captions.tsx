/**
 * Burned-in subtitles, sized for a screen across the room.
 *
 * They sit in a band no scene draws into, and a matching .srt/.vtt is written
 * from exactly the same cue list, so the two can never disagree.
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
    interpolate(t, [cue.start, cue.start + 0.1], [0, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}),
    interpolate(t, [cue.end - 0.1, cue.end], [1, 0], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'}),
  );
  const rise = interpolate(t, [cue.start, cue.start + 0.18], [10, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 46,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1560,
          background: colors.captionBg,
          color: colors.captionText,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: 1.22,
          letterSpacing: 0.3,
          padding: '14px 38px',
          borderRadius: 12,
          border: `1px solid ${colors.line}`,
          textAlign: 'center',
          opacity: fade,
          transform: `translateY(${rise}px)`,
          textWrap: 'balance',
          backdropFilter: 'blur(6px)',
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};
