/**
 * A simple, friendly line-drawn person.
 *
 * Drawn around the origin: feet at (0,0), head top at about y = -320.
 * Place it with a <g transform="translate(x,y) scale(s)"> in the scene.
 * Deliberately plain - a recognisable colleague, not a cartoon mascot.
 */
import React from 'react';
import {colors, sketch} from '../lib/theme';
import {roughCircle, roughPath, roughEllipse} from '../lib/rough';
import {DrawPath} from './Draw';

export type Pose = 'neutral' | 'curious' | 'happy' | 'wave' | 'present';

export interface EmployeeProps {
  /** 0 -> 1: how much of the figure has been drawn. */
  progress: number;
  /** Shirt colour - use the palette so a re-brand carries through. */
  shirt?: string;
  pose?: Pose;
  /** Changes the wobble and the hairstyle so a crowd does not look cloned. */
  seed?: number;
  /** Subtle vertical breathing offset, in px. */
  bob?: number;
  hair?: 'short' | 'bun' | 'bob' | 'curly';
  skin?: string;
}

const SKINS = ['#F0C9A4', '#D9A375', '#B37C4F', '#8B5E3C', '#F6D9BE'];

export const Employee: React.FC<EmployeeProps> = ({
  progress,
  shirt = colors.primary,
  pose = 'neutral',
  seed = 3,
  bob = 0,
  hair = 'short',
  skin,
}) => {
  const p = Math.min(1, Math.max(0, progress));
  const skinColor = skin ?? SKINS[seed % SKINS.length];
  const pen = colors.text;
  const sw = sketch.strokeWidth;

  // Stagger: body first, then head, then face - like a real sketch.
  const pBody = Math.min(1, p / 0.45);
  const pHead = Math.min(1, Math.max(0, (p - 0.3) / 0.4));
  const pFace = Math.min(1, Math.max(0, (p - 0.62) / 0.38));

  const tilt = pose === 'curious' ? -9 : 0;

  const leftArm =
    pose === 'wave'
      ? 'M -56 -196 C -92 -206, -104 -238, -96 -268'
      : pose === 'present'
        ? 'M -56 -196 C -86 -190, -104 -172, -112 -150'
        : 'M -56 -194 C -74 -168, -78 -138, -74 -108';
  const rightArm =
    pose === 'curious'
      ? 'M 56 -194 C 82 -170, 86 -140, 78 -110'
      : pose === 'present'
        ? 'M 56 -196 C 90 -190, 112 -176, 124 -156'
        : 'M 56 -194 C 74 -168, 78 -138, 74 -108';

  const leftHand: [number, number] =
    pose === 'wave' ? [-96, -268] : pose === 'present' ? [-112, -150] : [-74, -108];
  const rightHand: [number, number] =
    pose === 'present' ? [124, -156] : pose === 'curious' ? [78, -110] : [74, -108];

  const mouth =
    pose === 'happy' || pose === 'wave'
      ? 'M -20 -296 C -10 -280, 10 -280, 20 -296'
      : pose === 'curious'
        ? 'M -16 -290 C -6 -284, 8 -288, 18 -292'
        : 'M -17 -292 C -7 -284, 9 -284, 19 -292';

  return (
    <g transform={`translate(0 ${bob})`}>
      {/* torso */}
      <g opacity={pBody}>
        <path
          d="M -56 -196 C -60 -150, -58 -118, -52 -86 L 52 -86 C 58 -118, 60 -150, 56 -196 C 30 -216, -30 -216, -56 -196 Z"
          fill={shirt}
          opacity={pBody * 0.95}
        />
      </g>
      <DrawPath
        d={roughPath(
          'M -56 -196 C -60 -150, -58 -118, -52 -86 L 52 -86 C 58 -118, 60 -150, 56 -196',
          seed,
        )}
        progress={pBody}
        stroke={pen}
        strokeWidth={sw}
      />
      {/* legs */}
      <DrawPath d={roughPath('M -34 -86 L -38 0', seed + 5)} progress={pBody} stroke={pen} strokeWidth={sw} />
      <DrawPath d={roughPath('M 34 -86 L 38 0', seed + 6)} progress={pBody} stroke={pen} strokeWidth={sw} />
      {/* feet */}
      <DrawPath d={roughPath('M -50 0 L -30 0', seed + 15)} progress={pBody} stroke={pen} strokeWidth={sw} />
      <DrawPath d={roughPath('M 30 0 L 50 0', seed + 16)} progress={pBody} stroke={pen} strokeWidth={sw} />
      {/* arms */}
      <DrawPath d={roughPath(leftArm, seed + 7)} progress={pBody} stroke={pen} strokeWidth={sw} />
      <DrawPath d={roughPath(rightArm, seed + 8)} progress={pBody} stroke={pen} strokeWidth={sw} />
      {/* hands */}
      <circle cx={leftHand[0]} cy={leftHand[1]} r={11} fill={skinColor} opacity={pBody} />
      <circle cx={rightHand[0]} cy={rightHand[1]} r={11} fill={skinColor} opacity={pBody} />
      {/* neck - outside the head group so it does not swing with a head tilt */}
      <DrawPath d={roughPath('M 0 -244 L 0 -216', seed + 10)} progress={pHead} stroke={pen} strokeWidth={sw - 0.5} />

      {/* head */}
      <g transform={`rotate(${tilt * pHead} 0 -300)`}>
        <circle cx={0} cy={-300} r={52} fill={skinColor} opacity={pHead} />
        <DrawPath d={roughCircle(0, -300, 104, seed + 9)} progress={pHead} stroke={pen} strokeWidth={sw} />

        {/* hair */}
        {hair === 'short' && (
          <DrawPath
            d={roughPath('M -50 -318 C -44 -364, 44 -364, 50 -318', seed + 11)}
            progress={pHead}
            stroke={pen}
            strokeWidth={sw + 1}
          />
        )}
        {hair === 'bun' && (
          <>
            <DrawPath
              d={roughPath('M -50 -314 C -42 -366, 42 -366, 50 -314', seed + 11)}
              progress={pHead}
              stroke={pen}
              strokeWidth={sw + 1}
            />
            <DrawPath d={roughCircle(0, -372, 40, seed + 12)} progress={pHead} stroke={pen} strokeWidth={sw} />
          </>
        )}
        {hair === 'bob' && (
          <DrawPath
            d={roughPath('M -56 -282 C -66 -352, 66 -352, 56 -282', seed + 11)}
            progress={pHead}
            stroke={pen}
            strokeWidth={sw + 1}
          />
        )}
        {hair === 'curly' && (
          <>
            <DrawPath d={roughEllipse(-28, -338, 52, 44, seed + 11)} progress={pHead} stroke={pen} strokeWidth={sw} />
            <DrawPath d={roughEllipse(8, -348, 56, 46, seed + 12)} progress={pHead} stroke={pen} strokeWidth={sw} />
            <DrawPath d={roughEllipse(38, -330, 46, 40, seed + 13)} progress={pHead} stroke={pen} strokeWidth={sw} />
          </>
        )}

        {/* face */}
        <g opacity={pFace}>
          <circle cx={-19} cy={-312} r={4.6} fill={pen} />
          <circle cx={19} cy={-312} r={4.6} fill={pen} />
          <path d={mouth} fill="none" stroke={pen} strokeWidth={sw - 0.6} strokeLinecap="round" />
          {pose === 'curious' && (
            <path
              d="M -30 -334 C -22 -342, -10 -342, -6 -336"
              fill="none"
              stroke={pen}
              strokeWidth={sw - 1}
              strokeLinecap="round"
            />
          )}
        </g>
      </g>
    </g>
  );
};

/** Rounded speech / thought bubble with hand-drawn edges. */
export const Bubble: React.FC<{
  progress: number;
  width: number;
  height: number;
  /** Which side the tail points to. */
  tail?: 'left' | 'right' | 'bottom' | 'none';
  fill?: string;
  stroke?: string;
  seed?: number;
  children?: React.ReactNode;
}> = ({progress, width, height, tail = 'left', fill = colors.surface, stroke = colors.text, seed = 2, children}) => {
  const p = Math.min(1, Math.max(0, progress));
  const r = 26;
  const w = width;
  const h = height;
  const body = `M ${r} 0 L ${w - r} 0 Q ${w} 0 ${w} ${r} L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h} L ${r} ${h} Q 0 ${h} 0 ${h - r} L 0 ${r} Q 0 0 ${r} 0 Z`;
  // Tail geometry scales with the bubble so small bubbles do not grow spikes.
  const tw = Math.min(34, w * 0.34);
  const tl = Math.min(38, h * 0.55);
  const tailPath =
    tail === 'left'
      ? `M ${tw} ${h} L 4 ${h + tl} L ${tw * 2.1} ${h}`
      : tail === 'right'
        ? `M ${w - tw} ${h} L ${w - 4} ${h + tl} L ${w - tw * 2.1} ${h}`
        : tail === 'bottom'
          ? `M ${w / 2 - tw * 0.7} ${h} L ${w / 2 - tw * 0.15} ${h + tl} L ${w / 2 + tw * 0.8} ${h}`
          : '';
  return (
    <g opacity={p} transform={`scale(${0.9 + 0.1 * p})`}>
      <path d={body} fill={fill} opacity={0.97} />
      {tail !== 'none' && <path d={tailPath} fill={fill} />}
      <DrawPath d={roughPath(body, seed)} progress={p} stroke={stroke} strokeWidth={sketch.strokeWidth - 0.4} />
      {tail !== 'none' && (
        <DrawPath d={roughPath(tailPath, seed + 3)} progress={p} stroke={stroke} strokeWidth={sketch.strokeWidth - 0.4} />
      )}
      {children}
    </g>
  );
};
