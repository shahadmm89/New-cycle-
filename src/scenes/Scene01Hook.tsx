/**
 * SCENE 1 - PURPOSE
 * Starts on frame one. A year ring sweeping behind an oversized statement, with
 * SALARY CYCLE lit in the accent so a passer-by reads the subject in a glance,
 * and the reason for the change arriving as it is said.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {YearRing} from '../components/YearRing';
import {Display, Label} from '../components/Type';
import {Plinth} from '../components/Card3D';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {colors, fonts} from '../lib/theme';
import {Breathe} from '../components/Breathe';
import {monthsCalendar} from '../config/copy';

/**
 * Opacity only - no transform, no filter - so the type never moves.
 *
 * It is ALWAYS in the layout, even before it appears (at opacity 0). The title
 * slide is a centred stack: a line that only joined the layout when it began
 * to fade in would re-centre everything above and below it, which is exactly
 * the jump that read as the words shaking.
 */
const Fade: React.FC<{progress: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  progress,
  children,
  style,
}) => {
  const p = Math.min(1, Math.max(0, progress));
  return <div style={{opacity: p, ...style}}>{children}</div>;
};

export const Scene01Hook: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pRing = useProgress('ringIn', 1.1);
  const pHead = useProgress('headlineIn', 0.6);
  const pPost = useProgress('postIn', 0.6);
  const pKey = useProgress('highlightPhrase', 0.5);
  const pSub = useProgress('subIn', 0.6);
  // Nothing behind the title moves: the ring's outline crosses "January" and
  // "April", and a moving line through letters reads as the letters shaking.
  // The frame stays alive with a glow that only brightens and dims.
  const breath = useIdle(0.09, 1);

  return (
    <AbsoluteFill>
      <Breathe x={960} y={440} phase={breath} color={colors.accent} size={1300} />

      {/* Ring sits behind the type, oversized and cropped - still texture. */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          // Fades in only - no scaling behind the type.
          opacity: 0.3 * pRing,
          transform: 'translate3d(0, -40px, 0) scale(1.47)',
        }}
      >
        <YearRing
          months={monthsCalendar}
          progress={1}
          rotationMonths={0}
          arcProgress={1}
          color={colors.primary}
          spin={0}
          showLabels={false}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 26,
          // No zoom on the type: a slowly scaling title shimmers. Only the
          // ring behind it (no text) pushes in.
        }}
      >
        {/* Every line on the title slide simply FADES in: no slide, no blur,
            no bounce. Anything that moves or rescales type on its way in reads
            as shaking on a big screen. */}
        {t.headlinePre ? (
          <Fade progress={pHead}>
            <Display size={92} weight={700} color={colors.textSoft} style={{textAlign: 'center'}}>
              {t.headlinePre}
            </Display>
          </Fade>
        ) : null}

        {/* A title too long for one line is written with a line break and set
            smaller, so it still reads as one statement. */}
        <Fade progress={pKey}>
          <div style={{padding: '0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {t.headlineKey.split('\n').map((line) => (
              <Display
                key={line}
                size={t.headlineKey.includes('\n') ? 118 : 176}
                color={colors.accent}
                glow
                style={{textAlign: 'center'}}
              >
                {line}
              </Display>
            ))}
          </div>
        </Fade>
        <Plinth progress={pKey} width={760} color={colors.accent} style={{marginTop: -6}} />

        {/* "January -> April": set a size down, fades in, never moves. */}
        <Fade progress={pPost} style={{marginTop: 10}}>
          <Display size={64} weight={700} color={colors.text} style={{textAlign: 'center'}}>
            {t.headlinePost}
          </Display>
        </Fade>

        <Fade progress={pSub} style={{marginTop: 20}}>
          <Label size={30} color={colors.primary} style={{fontFamily: fonts.body}}>
            {t.sub}
          </Label>
        </Fade>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
