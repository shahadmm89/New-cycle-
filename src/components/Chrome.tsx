/**
 * Persistent on-screen furniture: the logo placeholder and the progress line.
 * Deliberately quiet so it never competes with the story.
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, Img, staticFile} from 'remotion';
import {colors, fonts, brand} from '../lib/theme';

export const LogoSlot: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 46,
      right: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: 68,
      minWidth: 210,
    }}
  >
    {brand.logoSrc ? (
      <Img src={staticFile(brand.logoSrc)} style={{height: 60, objectFit: 'contain'}} />
    ) : (
      <div
        style={{
          border: `2px dashed ${colors.line}`,
          borderRadius: 10,
          padding: '12px 22px',
          color: colors.neutral,
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: 1.2,
        }}
      >
        {brand.logoPlaceholderLabel}
      </div>
    )}
  </div>
);

export const ProgressLine: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = Math.min(1, frame / (durationInFrames - 1));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: 6}}>
      <div
        style={{
          width: `${p * 100}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          opacity: 0.75,
        }}
      />
    </div>
  );
};

export const Chrome: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <ProgressLine />
    <LogoSlot />
  </AbsoluteFill>
);
