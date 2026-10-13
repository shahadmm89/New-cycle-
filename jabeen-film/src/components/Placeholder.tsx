import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Shot} from '../lib/timeline';
import {cameraTransform} from './Shot';
import {FONT} from '../lib/fonts';
import {GOLD} from '../lib/theme';

/**
 * Stand-in for a shot whose footage or render has not been supplied.
 * A moving ground grid shows the intended camera move; the card says what
 * belongs here and which slot to fill.
 */
export const Placeholder: React.FC<{shot: Shot; progress: number}> = ({shot, progress}) => {
  const sky = shot.sceneId === 'S1';
  return (
    <AbsoluteFill style={{background: sky ? 'radial-gradient(circle at 50% 120%, #1d3b5c 0%, #0a1422 55%, #03060b 100%)' : 'linear-gradient(180deg, #2a2620 0%, #1a1814 60%, #12110e 100%)'}}>
      <AbsoluteFill style={{transform: cameraTransform(shot.move, progress), perspective: 900}}>
        {sky ? (
          <div
            style={{
              position: 'absolute', left: '50%', top: '62%', width: 1500, height: 1500, marginLeft: -750,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 30%, #3f6f8f 0%, #1f4462 40%, #0b1a2a 75%)',
              boxShadow: '0 0 120px 30px rgba(110,170,230,0.35)',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute', left: '-50%', right: '-50%', top: '45%', height: '120%',
              transform: 'rotateX(68deg)', transformOrigin: 'top',
              backgroundImage: `linear-gradient(rgba(179,137,22,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(179,137,22,0.22) 1px, transparent 1px)`,
              backgroundSize: '90px 90px',
              backgroundPosition: `0 ${progress * 360}px`,
            }}
          />
        )}
      </AbsoluteFill>
      {/* Corner card, so the centre stays free for titles and labels. */}
      <div style={{position: 'absolute', left: 60, top: 80, width: 760, fontFamily: FONT, color: 'rgba(255,255,255,0.88)'}}>
        <div style={{fontSize: 17, letterSpacing: '0.32em', color: GOLD, fontWeight: 500}}>
          {shot.sceneId} · SHOT {shot.shotId}{shot.villa ? ` · VILLA ${shot.villa.id}` : ''} · {shot.move.toUpperCase()}
        </div>
        <div style={{fontSize: 30, fontWeight: 300, marginTop: 10}}>{shot.sceneTitle}</div>
        <div style={{fontSize: 19, fontWeight: 300, lineHeight: 1.45, marginTop: 10, color: 'rgba(255,255,255,0.68)'}}>{shot.visual}</div>
        <div style={{display: 'inline-block', marginTop: 16, padding: '6px 14px', border: '1px dashed rgba(255,255,255,0.35)', fontSize: 15, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)'}}>
          AWAITING ASSET · slot “{shot.slot}” in src/config/assets.ts
        </div>
      </div>
    </AbsoluteFill>
  );
};
