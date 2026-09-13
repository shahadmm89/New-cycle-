/**
 * SCENE 2 - LISTENING
 *
 * "That's why we started by listening. We began an employee well-being
 *  assessment, looking beyond numbers, and taking the time to understand the
 *  real experiences, needs, and challenges of our people."
 *
 * One photograph, held for the whole scene: two colleagues in a real
 * conversation, one of them listening. It is the most important image in the
 * film, so it is the only one that gets a scene to itself.
 *
 * The on-screen line is set in sentence case, exactly as the brief writes it.
 * Everything else in the film is uppercase, which is what makes this one line
 * read as something said rather than something labelled.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Photo} from '../components/Photo';
import {Enter, Statement, Eyebrow, Supporting, Rule} from '../components/Type';
import {stills, copy, wb} from '../../config/wellbeing.design';
import {sayIn} from '../../config/wellbeing';
import {useReveal, useWindow} from '../timing';

const P03 = sayIn('listening', 'p03');
const P04 = sayIn('listening', 'p04');
const P05 = sayIn('listening', 'p05');

export const Scene2Listening: React.FC = () => {
  // The statement holds through its own long emphasis pause, then steps aside
  // for the assessment plate rather than sharing the frame with it. These two
  // sit at the same anchor point, so the handover has to be clean: the
  // statement is gone at 4.60s and the plate does not begin until 4.84s.
  const statement = useWindow(P03 + 0.25, 1.05, 2.7, 0.6);
  const rule = useWindow(P03 + 1.15, 0.85, 2.6, 0.5);

  const plate = useReveal(P04 + 1.3, 1.0);
  const supporting = useReveal(P05 + 0.35, 1.0);

  return (
    <AbsoluteFill>
      <Photo still={stills.listening} at={0} fadeIn={1.4} push={0.075} from={1.05} />

      <AbsoluteFill>
        <div style={{position: 'absolute', left: 140, bottom: 200}}>
          <Enter p={statement} distance={38}>
            <Statement size={112} style={{maxWidth: 1560}}>
              {copy.listening.statement}
            </Statement>
          </Enter>
          <Rule p={rule} width={200} color={wb.accent} style={{marginTop: 34}} />
        </div>

        {/* The assessment, named plainly. No claim about what it found - that
            is scene 4's job, and the recommendations themselves are not this
            film's to reveal. */}
        <div style={{position: 'absolute', left: 140, bottom: 200, maxWidth: 1380}}>
          <Enter p={plate} distance={34}>
            <Eyebrow color={wb.accent} size={28}>
              {copy.listening.programme}
            </Eyebrow>
          </Enter>
          <Enter p={supporting} distance={28} style={{marginTop: 30}}>
            <Supporting size={46} color={wb.text} style={{fontWeight: 600, maxWidth: 1300}}>
              {copy.listening.supporting}
            </Supporting>
          </Enter>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
