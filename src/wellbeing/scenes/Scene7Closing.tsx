/**
 * SCENE 7 - CLOSING
 *
 * "Because your well-being matters. And taking care of our people isn't just a
 *  program. It's part of who we are."
 *
 * The brief asks the closing composition to simplify gradually, and this scene
 * does exactly that, in three steps: a photograph with a line over it, then the
 * photograph dissolves and only the words are left on the navy, then the words
 * go too and the logo holds alone in silence.
 *
 * By the last four seconds there is one element on screen. That emptiness is
 * the point - it is what stops the film ending on a sales note.
 */
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Photo} from '../components/Photo';
import {Enter, Statement, Supporting, Rule} from '../components/Type';
import {stills, copy, wb} from '../../config/wellbeing.design';
import {sayIn} from '../../config/wellbeing';
import {brand, fonts} from '../../lib/theme';
import {useReveal, useWindow, useT} from '../timing';

const P18 = sayIn('closing', 'p18');
const P19 = sayIn('closing', 'p19');
const P20 = sayIn('closing', 'p20');

export const Scene7Closing: React.FC = () => {
  const t = useT();

  // The whole bottom-left block - statement, rule and sign-off - clears
  // together, and is gone before the centred closing line arrives at 7.60s.
  const statement = useWindow(P18 + 0.3, 1.1, 4.6, 0.9);
  const rule = useWindow(P18 + 1.2, 0.9, 3.8, 0.7);
  const signOff = useWindow(P19 + 0.45, 1.0, 1.6, 0.7);

  // The last line arrives on the clean stage and is fully gone before the logo
  // starts to arrive. These two must not overlap: they occupy the same centre
  // of frame, and crossing them puts the logo on top of readable type.
  const lastLine = useWindow(P20 + 0.15, 0.9, 1.1, 0.7);
  const logo = useReveal(P20 + 3.05, 1.1);

  // The photograph dissolves during the second line, so the frame is already
  // empty by the time the final sentence is spoken.
  const photoDarken = interpolate(t, [P19, P19 + 2.4], [0.06, 0.42], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <Photo
        still={stills.listening}
        at={0}
        fadeIn={1.4}
        until={P19 + 1.6}
        fadeOut={1.9}
        push={0.07}
        from={1.08}
        darken={photoDarken}
      />

      <AbsoluteFill>
        <div style={{position: 'absolute', left: 140, bottom: 215}}>
          <Enter p={statement} distance={40}>
            <Statement size={116}>
              {copy.closing.statement.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </Statement>
          </Enter>
          <Rule p={rule} width={230} color={wb.accent} style={{marginTop: 36}} />
          <Enter p={signOff} distance={24} style={{marginTop: 34}}>
            <Supporting size={42} color={wb.text} style={{fontWeight: 500}}>
              {copy.closing.signOff}
            </Supporting>
          </Enter>
        </div>
      </AbsoluteFill>

      {/* "It's part of who we are." - centred, alone. */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Enter p={lastLine} distance={30}>
          <Statement size={96} style={{textAlign: 'center'}}>
            {copy.closing.signOffTwo}
          </Statement>
        </Enter>
      </AbsoluteFill>

      {/* The closing frame: the logo, and nothing else. */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Enter p={logo} distance={22} blur={6}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {brand.logoSrc ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img src={brand.logoSrc} style={{height: 132, objectFit: 'contain'}} />
            ) : (
              <div
                style={{
                  fontFamily: fonts.body,
                  fontWeight: 800,
                  fontSize: 40,
                  letterSpacing: 10,
                  color: wb.textSoft,
                  border: `2px dashed ${wb.primaryDim}`,
                  borderRadius: 14,
                  padding: '40px 76px',
                }}
              >
                {brand.logoPlaceholderLabel}
              </div>
            )}
          </div>
        </Enter>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
