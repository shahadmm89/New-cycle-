import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {PROJECT} from '../config/project';
import {FPS} from '../lib/timeline';
import {FONT} from '../lib/fonts';
import {INK, IVORY} from '../lib/theme';

const ease = Easing.bezier(0.33, 0, 0.2, 1);

/**
 * Closing lockup on a warm ivory field. The JABEEN logo is used exactly as
 * supplied (gold mark, black wordmark), which needs a light ground.
 */
export const EndFrame: React.FC<{animatic: boolean; logoOnly?: boolean}> = ({animatic, logoOnly}) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [FPS * 1.2, FPS * 2.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const logoH = 300;
  return (
    <AbsoluteFill style={{background: IVORY, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 90, opacity: a, transform: `translateY(${(1 - a) * 10}px)`}}>
        {logoOnly ? null : PROJECT.companyLogo ? (
          <Img src={staticFile(PROJECT.companyLogo)} style={{height: logoH * 0.7, width: 'auto'}} />
        ) : (
          <div style={{width: 380, height: logoH * 0.7, border: `1px dashed ${animatic ? 'rgba(17,17,14,0.4)' : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontSize: 28, fontWeight: 300, color: 'rgba(17,17,14,0.5)'}}>
            [شعار الشركة]
          </div>
        )}
        {!logoOnly && <div style={{width: 1, height: logoH * 0.8, background: INK, opacity: 0.25}} />}
        <Img src={staticFile(PROJECT.jabeenLogo)} style={{height: logoH, width: logoH * PROJECT.jabeenLogoAspect}} />
      </div>
    </AbsoluteFill>
  );
};
