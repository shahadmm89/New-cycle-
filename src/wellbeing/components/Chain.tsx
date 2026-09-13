/**
 * LISTEN -> UNDERSTAND -> ACT.
 *
 * The one diagram in the film, and it exists to make a single promise legible:
 * that the listening already happened, and the acting is what comes next.
 *
 * Each step lights in turn and the connector draws between them, so the
 * sequence is shown rather than stated. The steps already taken stay lit -
 * this is a record of what the company has done, not a progress bar.
 */
import React from 'react';
import {fonts} from '../../lib/theme';
import {wb} from '../../config/wellbeing.design';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const Step: React.FC<{p: number; label: string; active: boolean}> = ({p, label, active}) => {
  const v = clamp01(p);
  return (
    <div
      style={{
        opacity: 0.18 + v * 0.82,
        transform: `translate3d(0, ${(1 - v) * 18}px, 0)`,
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: 54,
        letterSpacing: 2,
        color: active ? wb.accent : wb.text,
        textShadow: active ? `0 0 40px ${wb.accent}55` : '0 10px 30px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
        willChange: 'transform, opacity',
      }}
    >
      {label}
    </div>
  );
};

const Connector: React.FC<{p: number}> = ({p}) => {
  const v = clamp01(p);
  return (
    <div
      style={{
        width: 128,
        height: 3,
        margin: '0 42px',
        position: 'relative',
        background: wb.primaryDim,
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: `${v * 100}%`,
          background: `linear-gradient(90deg, ${wb.primary}, ${wb.accent})`,
        }}
      />
    </div>
  );
};

export const Chain: React.FC<{
  steps: readonly string[];
  /** 0 -> 1 per step, in order. Same length as `steps`. */
  progress: number[];
  /** Index of the step the narration is currently on; it is the lit one. */
  activeIndex: number;
}> = ({steps, progress, activeIndex}) => (
  <div style={{display: 'flex', alignItems: 'center'}}>
    {steps.map((label, i) => (
      <React.Fragment key={label}>
        {i > 0 ? <Connector p={progress[i]} /> : null}
        <Step p={progress[i]} label={label} active={i === activeIndex} />
      </React.Fragment>
    ))}
  </div>
);
