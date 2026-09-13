/**
 * SCENE 5 - FROM INSIGHT TO ACTION
 *
 * "Based on the assessment, we have developed recommendations focused on the
 *  areas that matter most. Starting in Q4 2026, we will begin turning these
 *  recommendations into action."
 *
 * LISTEN -> UNDERSTAND -> ACT builds while the first line runs, and then gets
 * out of the way: the date is the single most operationally important fact in
 * the film, so it gets the frame to itself, at 240px, in the accent colour.
 *
 * The recommendations themselves are deliberately not shown. The brief is
 * explicit that they belong to the detailed action plan, not to this film.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Enter, Eyebrow} from '../components/Type';
import {Chain} from '../components/Chain';
import {copy, wb} from '../../config/wellbeing.design';
import {sayIn} from '../../config/wellbeing';
import {fonts} from '../../lib/theme';
import {useReveal, useWindow} from '../timing';

const P13 = sayIn('action', 'p13');
const P14 = sayIn('action', 'p14');
const P15 = sayIn('action', 'p15');

/** "Q4 2026" is the tail of its phrase, not the head. */
const DATE_AT = P14 + 1.05;

export const Scene5Action: React.FC = () => {
  const eyebrow = useWindow(P13 + 0.3, 0.85, 5.0, 0.7);

  // The chain lights step by step, then clears for the date.
  const chainOut = useWindow(P13 + 0.9, 0.9, 4.6, 0.9);
  const steps = [
    useReveal(P13 + 1.0, 0.7),
    useReveal(P13 + 2.2, 0.7),
    useReveal(P13 + 3.5, 0.7),
  ];
  const activeIndex = steps[2] > 0.5 ? 2 : steps[1] > 0.5 ? 1 : 0;

  const date = useReveal(DATE_AT, 1.0);
  const dateLabel = useReveal(DATE_AT + 0.85, 0.9);
  const dateRule = useReveal(P15 + 0.2, 1.1);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{opacity: chainOut, transform: `translate3d(0, ${(1 - chainOut) * -18}px, 0)`}}>
          <Enter p={eyebrow} distance={16}>
            <Eyebrow color={wb.textSoft} size={27} style={{textAlign: 'center', marginBottom: 58}}>
              {copy.action.eyebrow}
            </Eyebrow>
          </Enter>
          <Chain steps={copy.action.steps} progress={steps} activeIndex={activeIndex} />
        </div>
      </AbsoluteFill>

      {/* The date. Nothing else is on screen while it is. */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Enter p={date} distance={30} blur={9}>
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 240,
              lineHeight: 1,
              letterSpacing: -6,
              color: wb.accent,
              textShadow: `0 0 120px ${wb.accent}44, 0 20px 60px rgba(0,0,0,0.6)`,
            }}
          >
            {copy.action.date}
          </div>
        </Enter>

        <div
          style={{
            width: 320 * dateRule,
            height: 5,
            background: wb.accent,
            borderRadius: 5,
            marginTop: 46,
            opacity: date,
            boxShadow: `0 0 28px ${wb.accent}66`,
          }}
        />

        <Enter p={dateLabel} distance={20} style={{marginTop: 40}}>
          <Eyebrow color={wb.text} size={30}>
            {copy.action.dateLabel}
          </Eyebrow>
        </Enter>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
