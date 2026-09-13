/**
 * Burned-in subtitles.
 *
 * Same band, same treatment as the company's previous film, so the two look
 * like a pair. The cue list comes from the shared timeline, and the .srt/.vtt
 * sidecars are written from that same list - they cannot disagree.
 */
import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {buildWellbeingCues} from '../captions';
import {colors, fonts} from '../../lib/theme';

export const WellbeingCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cues = useMemo(() => buildWellbeingCues(), []);
  const t = frame / fps;

  const cue = cues.find((c) => t >= c.start && t < c.end);
  if (!cue) return null;

  const fade = Math.min(
    interpolate(t, [cue.start, cue.start + 0.12], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    interpolate(t, [cue.end - 0.12, cue.end], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const rise = interpolate(t, [cue.start, cue.start + 0.2], [8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 44,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1540,
          background: colors.captionBg,
          color: colors.captionText,
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 40,
          lineHeight: 1.24,
          letterSpacing: 0.2,
          padding: '13px 36px',
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
