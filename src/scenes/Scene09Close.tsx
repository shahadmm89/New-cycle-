/**
 * SCENE 9 - FINAL MESSAGE
 *
 * Just where to go for clarification - no logo and no contact placeholders,
 * at the client's request. Nothing about the cycle is repeated here; it would only dilute the frame people are meant
 * to hold on to.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Label, Display, Rise} from '../components/Type';
import {Plinth} from '../components/Card3D';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {Breathe} from '../components/Breathe';
import {colors} from '../lib/theme';

export const Scene09Close: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pQ = useProgress('questionsIn', 0.7);
  const pContact = useProgress('contactIn', 0.6);
  // A slow breathing glow behind the content keeps the frame alive to the
  // end of the line. Only its brightness changes - the text never moves, so
  // letter edges stay perfectly still.
  const breath = useIdle(0.12, 1);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <Breathe x={960} y={500} phase={breath} color={colors.accent} />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, marginTop: -40}}>
        <Rise progress={pQ} distance={34}>
          <Display size={96} color={colors.text}>{t.questions}</Display>
        </Rise>

        <Plinth progress={pQ} width={900} color={colors.accent} style={{marginTop: 4}} />

        <Rise progress={pContact} distance={26} style={{marginTop: 10}}>
          <Label size={48} color={colors.accent}>{t.sub}</Label>
        </Rise>


      </div>
    </AbsoluteFill>
  );
};
