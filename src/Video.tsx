/**
 * The whole 90-second film.
 *
 * Scenes are laid out from the durations in src/config/scenes.ts, so the only
 * place timing lives is that config file. Each scene overlaps the next by
 * TRANSITION seconds' worth of cross-fade, handled inside <SceneHost>.
 */
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {scenes, sceneStarts, FPS, TRANSITION, OUTRO_FADE} from './config/scenes';
import {voiceover} from './config/voiceover';
import {SceneHost} from './components/SceneTransition';
import {Paper} from './components/Paper';
import {Chrome} from './components/Chrome';
import {Captions} from './components/Captions';
import {loadProjectFonts} from './lib/fonts';
import {colors} from './lib/theme';

import {Scene01Opening} from './scenes/Scene01Opening';
import {Scene02Merit} from './scenes/Scene02Merit';
import {Scene03Bonus} from './scenes/Scene03Bonus';
import {Scene04WhyChange} from './scenes/Scene04WhyChange';
import {Scene05NewCycle} from './scenes/Scene05NewCycle';
import {Scene06NoChange} from './scenes/Scene06NoChange';
import {Scene07Comparison} from './scenes/Scene07Comparison';
import {Scene08Benefits} from './scenes/Scene08Benefits';
import {Scene09Closing} from './scenes/Scene09Closing';

loadProjectFonts();

const SCENE_COMPONENTS: Record<string, React.FC> = {
  opening: Scene01Opening,
  merit: Scene02Merit,
  bonus: Scene03Bonus,
  'why-change': Scene04WhyChange,
  'new-cycle': Scene05NewCycle,
  'no-change': Scene06NoChange,
  comparison: Scene07Comparison,
  benefits: Scene08Benefits,
  closing: Scene09Closing,
};

/** Fades the finished frame - scenes, logo, progress line and all - to clean paper. */
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const len = Math.round(OUTRO_FADE * fps);
  const opacity = interpolate(frame, [durationInFrames - len, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  if (opacity <= 0) return null;
  return <AbsoluteFill style={{backgroundColor: colors.background, opacity, pointerEvents: 'none'}} />;
};

export const SalaryCycleVideo: React.FC<{showCaptions?: boolean}> = ({showCaptions = true}) => (
  <AbsoluteFill style={{backgroundColor: colors.background}}>
    <Paper />

    {scenes.map((scene, i) => {
      const Component = SCENE_COMPONENTS[scene.id];
      if (!Component) throw new Error(`No component registered for scene "${scene.id}"`);
      const from = Math.round(sceneStarts[i] * FPS);
      // The extra frames let a scene fade out underneath the next one.
      const overlap = i === scenes.length - 1 ? 0 : Math.round(TRANSITION * FPS);
      return (
        <Sequence
          key={scene.id}
          from={from}
          durationInFrames={Math.round(scene.duration * FPS) + overlap}
          name={scene.title}
          layout="none"
        >
          <SceneHost scene={scene}>
            <Component />
          </SceneHost>
        </Sequence>
      );
    })}

    <Chrome />
    {showCaptions ? <Captions /> : null}
    <Outro />

    {voiceover.audioFile ? (
      <Audio src={staticFile(voiceover.audioFile)} volume={voiceover.volume} />
    ) : null}
  </AbsoluteFill>
);
