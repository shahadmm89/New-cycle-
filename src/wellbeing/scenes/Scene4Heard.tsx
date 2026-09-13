/**
 * SCENE 4 - WHAT WE HEARD
 *
 * "What we heard was clear. Our people need greater support for their mental
 *  health and financial well-being. And we believe well-being is not a
 *  one-size-fits-all solution. It's about creating the right support, for
 *  different people, in different situations."
 *
 * The only scene with no photograph. After three scenes of faces, the film
 * stops and states the finding on a clean stage - the change of texture is
 * what makes this land as the centre of the film.
 *
 * The two pillars arrive one at a time, each exactly as it is named, and then
 * both hold together for the rest of the scene. Equal size, equal weight: the
 * brief needs these read as two priority areas, not a headline and a footnote.
 *
 * Note what is NOT said here. "Our people need greater support" is a statement
 * about support, not a diagnosis - nowhere does the film suggest employees have
 * been found to have a mental-health condition.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Enter, Statement, Eyebrow, Supporting} from '../components/Type';
import {Pillar} from '../components/Pillars';
import {copy, wb} from '../../config/wellbeing.design';
import {sayIn} from '../../config/wellbeing';
import {useReveal, useWindow} from '../timing';

const P09 = sayIn('heard', 'p09');
const P10 = sayIn('heard', 'p10');
const P11 = sayIn('heard', 'p11');
const P12 = sayIn('heard', 'p12');

/** Where each priority area is named inside the 4.92s line. */
const MENTAL_AT = P10 + 2.6;
const FINANCIAL_AT = P10 + 3.95;

export const Scene4Heard: React.FC = () => {
  // The statement owns the frame alone, through its emphasis pause, and is
  // gone before the first pillar arrives. Nothing here shares a moment.
  const statement = useWindow(P09 + 0.2, 1.0, 2.5, 0.75);
  const eyebrow = useReveal(P10 + 1.2, 0.9);

  const pillarOne = useReveal(MENTAL_AT, 0.95);
  const pillarTwo = useReveal(FINANCIAL_AT, 0.95);

  const notOneSize = useReveal(P11 + 0.5, 0.95);
  const supporting = useReveal(P12 + 0.6, 1.0);

  return (
    <AbsoluteFill>
      {/* The finding, alone on the stage. */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Enter p={statement} distance={40}>
          <Statement size={122} style={{textAlign: 'center'}}>
            {copy.heard.statement}
          </Statement>
        </Enter>
      </AbsoluteFill>

      {/* Then the two priority areas. */}
      <AbsoluteFill style={{alignItems: 'center'}}>
        <Enter p={eyebrow} distance={16} style={{marginTop: 186}}>
          <Eyebrow color={wb.textSoft} size={27}>
            WHAT WE HEARD
          </Eyebrow>
        </Enter>

        <div style={{display: 'flex', gap: 60, marginTop: 64}}>
          <Pillar
            p={pillarOne}
            label={copy.heard.pillarOne.label}
            title={copy.heard.pillarOne.title}
            title2={copy.heard.pillarOne.title2}
            color={wb.accent}
          />
          <Pillar
            p={pillarTwo}
            label={copy.heard.pillarTwo.label}
            title={copy.heard.pillarTwo.title}
            title2={copy.heard.pillarTwo.title2}
            color={wb.steady}
          />
        </div>

        <div style={{marginTop: 58, textAlign: 'center'}}>
          <Enter p={notOneSize} distance={22}>
            <Eyebrow color={wb.accent} size={26}>
              {copy.heard.notOneSize}
            </Eyebrow>
          </Enter>
          <Enter p={supporting} distance={20} style={{marginTop: 24}}>
            <Supporting size={38}>{copy.heard.supporting}</Supporting>
          </Enter>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
