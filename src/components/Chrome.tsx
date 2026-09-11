/**
 * Persistent furniture: the logo slot and a thin progress line.
 * Both are deliberately quiet - on signage, chrome must never compete with the
 * message. The closing scene hides them so it can present the logo properly.
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, Img, staticFile} from 'remotion';
import {colors, fonts, brand} from '../lib/theme';

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

      <div style={{position: 'absolute', top: 52, right: 96, opacity: 0.9}}>
        {brand.logoSrc ? (
          <Img src={staticFile(brand.logoSrc)} style={{height: 52, objectFit: 'contain'}} />
        ) : (
          <div
            style={{
              border: `1.5px dashed ${colors.line}`,
              borderRadius: 10,
              padding: '10px 20px',
              color: colors.muted,
              fontFamily: fonts.body,
              fontWeight: 700,
              fontSize: 19,
              letterSpacing: 1.6,
            }}
          >
            {brand.logoPlaceholderLabel}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
