/**
 * SCENE 6 - WHAT'S NEXT
 *
 * "More details will be shared with you shortly, including our detailed action
 *  plan and the support available to our people."
 *
 * Back to a real workplace, and deliberately not an office one: the brief asks
 * that well-being never reads as a desk-worker's benefit, and this is the scene
 * where the film says "you will hear more" - so it needs to be visibly said to
 * everybody.
 *
 * Two items, named, with no detail attached to either. That is the whole point
 * of the scene: it promises a plan, it does not pre-announce its contents.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Photo} from '../components/Photo';
import {Enter, Statement, Rule} from '../components/Type';
import {stills, copy, wb} from '../../config/wellbeing.design';
import {sayIn} from '../../config/wellbeing';
import {fonts} from '../../lib/theme';
import {useReveal} from '../timing';

const P16 = sayIn('next', 'p16');
const P17 = sayIn('next', 'p17');

const Item: React.FC<{p: number; label: string}> = ({p, label}) => (
  <Enter p={p} distance={24} blur={5}>
    <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 26}}>
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 14,
          background: wb.accent,
          boxShadow: `0 0 20px ${wb.accent}88`,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: 1.4,
          color: wb.text,
          textShadow: '0 8px 28px rgba(0,0,0,0.5)',
        }}
      >
        {label}
      </div>
    </div>
  </Enter>
);

export const Scene6Next: React.FC = () => {
  const statement = useReveal(P16 + 0.35, 1.0);
  const rule = useReveal(P16 + 1.1, 0.9);
  const itemOne = useReveal(P17 + 0.5, 0.9);
  const itemTwo = useReveal(P17 + 1.7, 0.9);

  return (
    <AbsoluteFill>
      <Photo still={stills.openingPlant} at={0} fadeIn={1.3} push={0.075} from={1.09} darken={0.2} />

      <AbsoluteFill>
        <div style={{position: 'absolute', left: 140, bottom: 205}}>
          <Enter p={statement} distance={36}>
            <Statement size={96}>{copy.next.statement}</Statement>
          </Enter>
          <Rule p={rule} width={180} color={wb.accent} style={{marginTop: 32, marginBottom: 18}} />
          <Item p={itemOne} label={copy.next.items[0]} />
          <Item p={itemTwo} label={copy.next.items[1]} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
