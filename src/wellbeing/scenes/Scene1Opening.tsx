/**
 * SCENE 1 - OPENING
 *
 * "Every organization is made of people. And when we take care of our people,
 *  we strengthen everything around them."
 *
 * Two real workplaces, one after the other, while the narrator says "people":
 * an office floor and a plant walkway. Showing two environments in the first
 * eleven seconds is the film's first promise that this is addressed to
 * everyone, not only to the people with desks.
 *
 * PEOPLE FIRST. lands on the word "people", not on the start of the sentence.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Photo} from '../components/Photo';
import {Enter, Statement, Rule} from '../components/Type';
import {stills, copy, wb} from '../../config/wellbeing.design';
import {sayIn} from '../../config/wellbeing';
import {useReveal} from '../timing';

const P01 = sayIn('opening', 'p01');
const P02 = sayIn('opening', 'p02');

/** The word "people" is the last word of the first line. */
const ON_THE_WORD_PEOPLE = P01 + 1.8;

export const Scene1Opening: React.FC = () => {
  const statement = useReveal(ON_THE_WORD_PEOPLE, 1.0);
  const rule = useReveal(ON_THE_WORD_PEOPLE + 0.75, 0.9);

  return (
    <AbsoluteFill>
      {/* The office floor opens the film, and hands over to the plant as the
          second line begins - so the two images are one continuous morning. */}
      <Photo still={stills.openingOffice} at={0} fadeIn={1.4} until={P02 - 0.5} fadeOut={1.5} push={0.09} />
      <Photo still={stills.openingPlant} at={P02 - 0.7} fadeIn={1.5} push={0.08} from={1.05} />

      <AbsoluteFill>
        <div style={{position: 'absolute', left: 140, bottom: 210}}>
          <Enter p={statement} distance={40}>
            <Statement size={128} style={{letterSpacing: -2.6}}>
              {copy.opening.statement}
            </Statement>
          </Enter>
          <Rule p={rule} width={230} color={wb.accent} style={{marginTop: 38}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
