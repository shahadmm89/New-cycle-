/**
 * SCENE 1 - PURPOSE
 * Starts on frame one. A year ring sweeping behind an oversized statement, with
 * SALARY CYCLE lit in the accent so a passer-by reads the subject in a glance,
 * and the reason for the change arriving as it is said.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {YearRing} from '../components/YearRing';
import {Display, Label, Rise, Punch} from '../components/Type';
import {Plinth} from '../components/Card3D';
import {useProgress, useScene, useIdle} from '../lib/timing';
import {colors, fonts} from '../lib/theme';
import {monthsCalendar} from '../config/copy';

export const Scene01Hook: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pRing = useProgress('ringIn', 1.1);
  const pSweep = useProgress('monthsSweep', 2.6);
  const pHead = useProgress('headlineIn', 0.6);
  const pPost = useProgress('postIn', 0.6);
  const pKey = useProgress('highlightPhrase', 0.5);
  const pSub = useProgress('subIn', 0.6);
  const pPush = useProgress('pushIn', 2.4);
  const drift = useIdle(0.09, 3);

  return (
    <AbsoluteFill>
      {/* Ring sits behind the type, oversized and cropped - it is texture, not information yet. */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.42,
          transform: `translate3d(0, ${-40 + drift}px, 0) scale(${1.42 + pPush * 0.1})`,
        }}
      >
        <YearRing
          months={monthsCalendar}
          progress={pRing}
          rotationMonths={pSweep * 1.6}
          arcProgress={pSweep}
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
        {t.headlinePre ? (
          <Rise progress={pHead} distance={54}>
            <Display size={92} weight={700} color={colors.textSoft} style={{textAlign: 'center'}}>
              {t.headlinePre}
            </Display>
          </Rise>
        ) : null}

        {/* A title too long for one line is written with a line break and set
            smaller, so it still reads as one statement. */}
        <Punch progress={pKey} from={0.78}>
          <div style={{position: 'relative', padding: '0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
        </Punch>
        <Plinth progress={pKey} width={760} color={colors.accent} style={{marginTop: -6}} />

        <Rise progress={pPost} distance={40} style={{marginTop: 6}}>
          <Display size={84} weight={700} color={colors.text} style={{textAlign: 'center'}}>
            {t.headlinePost}
          </Display>
        </Rise>

        <Rise progress={pSub} distance={30} style={{marginTop: 22}}>
          <Label size={34} color={colors.primary} style={{fontFamily: fonts.body}}>
            {t.sub}
          </Label>
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
