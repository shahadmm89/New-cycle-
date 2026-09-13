/**
 * SCENE 3 - EVERYONE'S VOICE
 *
 * "We listened to employees across different professional groups,
 *  nationalities, genders, and areas of the business. We also listened to our
 *  leaders. To understand the challenges they see, and where we can make the
 *  greatest difference."
 *
 * The four groups appear one at a time, each as the narrator names it. They are
 * set as a plain list, in the same size and the same colour, with no icons and
 * no illustrations of any of them - the brief is explicit that no nationality,
 * gender or profession should be stereotyped, and the surest way to avoid that
 * is to not draw a picture of a category of person at all.
 *
 * Underneath, the photograph is a plant walkway: the list is abstract, the
 * image is not.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Photo} from '../components/Photo';
import {Enter, Eyebrow, Statement, Supporting} from '../components/Type';
import {stills, copy, wb} from '../../config/wellbeing.design';
import {sayIn} from '../../config/wellbeing';
import {fonts} from '../../lib/theme';
import {useReveal, useWindow} from '../timing';

const P06 = sayIn('voices', 'p06');
const P07 = sayIn('voices', 'p07');
const P08 = sayIn('voices', 'p08');

/**
 * Where each group is named inside the first line, measured against the
 * recorded phrase rather than guessed from the sentence: the line runs 6.83s
 * and the four terms fall in its second half, roughly evenly.
 */
const GROUP_BEATS = [2.70, 3.75, 4.55, 5.35].map((s) => P06 + s);

const GroupRow: React.FC<{p: number; label: string}> = ({p, label}) => (
  <Enter p={p} distance={26} blur={5}>
    <div
      style={{
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: 62,
        lineHeight: 1.28,
        letterSpacing: -0.5,
        color: wb.text,
        textShadow: '0 10px 34px rgba(0,0,0,0.55)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  </Enter>
);

export const Scene3Voices: React.FC = () => {
  // The holds are staggered so that all four groups, and the heading above
  // them, finish clearing at the same moment (8.0s) - they arrived one at a
  // time, but they leave together, as one block, before the leaders line
  // arrives at the same anchor point at 8.33s.
  const eyebrow = useWindow(P06 + 0.3, 0.9, 6.2, 0.6);
  const groups = [
    useWindow(GROUP_BEATS[0], 0.75, 3.95, 0.6),
    useWindow(GROUP_BEATS[1], 0.75, 2.90, 0.6),
    useWindow(GROUP_BEATS[2], 0.75, 2.10, 0.6),
    useWindow(GROUP_BEATS[3], 0.75, 1.30, 0.6),
  ];

  const leaders = useReveal(P07 + 0.6, 1.0);
  const leadersSupporting = useReveal(P08 + 0.4, 1.0);

  return (
    <AbsoluteFill>
      {/* Operations first, then the office, as the line moves from employees
          to leaders. */}
      <Photo
        still={stills.openingPlant}
        at={0}
        fadeIn={1.3}
        until={P07 - 0.9}
        fadeOut={1.4}
        push={0.08}
        darken={0.14}
      />
      <Photo
        still={stills.openingOffice}
        at={P07 - 1.1}
        fadeIn={1.4}
        push={0.07}
        from={1.05}
        darken={0.16}
      />

      <AbsoluteFill>
        <div style={{position: 'absolute', left: 140, bottom: 190}}>
          <Enter p={eyebrow} distance={18}>
            <Eyebrow color={wb.accent} size={27} style={{marginBottom: 34}}>
              {copy.voices.eyebrow}
            </Eyebrow>
          </Enter>
          {copy.voices.groups.map((label, i) => (
            <GroupRow key={label} p={groups[i]} label={label} />
          ))}
        </div>

        <div style={{position: 'absolute', left: 140, bottom: 210, maxWidth: 1380}}>
          <Enter p={leaders} distance={34}>
            <Statement size={92}>{copy.voices.leaders}</Statement>
          </Enter>
          <Enter p={leadersSupporting} distance={26} style={{marginTop: 30}}>
            <Supporting size={42} style={{maxWidth: 1240}}>
              {copy.voices.leadersSupporting}
            </Supporting>
          </Enter>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
