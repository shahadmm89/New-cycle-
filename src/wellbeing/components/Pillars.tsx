/**
 * The two priority areas, as two pillars.
 *
 * This is the one moment in the film where a graphic is the right answer: the
 * brief needs mental well-being and financial well-being to read as two equal,
 * parallel commitments, and two identical columns say that in a way a sentence
 * cannot.
 *
 * Equal is the whole design. Same width, same height, same type, same weight -
 * only the accent colour differs, and each one arrives exactly as the narrator
 * names it. Neither is the "main" one.
 *
 * There is deliberately no icon. Every obvious icon for mental health is a
 * head, a brain or a heart-rate line, and the brief rules out anything that
 * reads as medical or suggests employees have been diagnosed with something.
 * A calm empty column with a name on it makes no such claim.
 */
import React from 'react';
import {fonts} from '../../lib/theme';
import {wb} from '../../config/wellbeing.design';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const Pillar: React.FC<{
  /** 0 -> 1 arrival progress. */
  p: number;
  label: string;
  title: string;
  title2: string;
  color: string;
}> = ({p, label, title, title2, color}) => {
  // Always occupies its column, even before it is visible. The two pillars sit
  // in a flex row: if the second one only appeared when it was due, the first
  // would be centred alone and then jump sideways to make room for it.
  const v = clamp01(p);

  return (
    <div
      style={{
        position: 'relative',
        width: 620,
        height: 360,
        opacity: v,
        transform: `translate3d(0, ${(1 - v) * 46}px, 0)`,
        filter: v < 0.99 ? `blur(${(1 - v) * 8}px)` : undefined,
        willChange: 'transform, opacity, filter',
        borderRadius: 26,
        background: 'linear-gradient(170deg, rgba(21,45,88,0.94) 0%, rgba(11,26,54,0.92) 100%)',
        border: `1px solid ${wb.line}`,
        boxShadow: '0 34px 90px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 54px 52px',
        boxSizing: 'border-box',
      }}
    >
      {/* The accent edge grows down the left side as the pillar lands. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 8,
          height: `${v * 100}%`,
          background: color,
          boxShadow: `0 0 34px ${color}88`,
        }}
      />

      {/* A soft wash of the accent in the upper body, so the two columns read
          as different without being differently designed. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(90% 70% at 12% 0%, ${color}22 0%, transparent 62%)`,
        }}
      />

      <div
        style={{
          position: 'relative',
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 22 * 0.3,
          textTransform: 'uppercase',
          color,
          marginBottom: 26,
        }}
      >
        {label}
      </div>

      <div
        style={{
          position: 'relative',
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 68,
          lineHeight: 1.04,
          letterSpacing: -1.2,
          color: wb.text,
        }}
      >
        {title}
        <br />
        {title2}
      </div>
    </div>
  );
};
