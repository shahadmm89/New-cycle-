/**
 * The whole film.
 *
 * Scenes are laid out from the durations in src/config/scenes.ts, so the only
 * place timing lives is that config file. Consecutive scenes overlap by
 * TRANSITION seconds, which is what keeps the film continuous - the next
 * visual is already building while the previous line finishes.
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
import {
  scenes,
  sceneStarts,
  sceneStart,
  FPS,
  TRANSITION,
  OUTRO_FADE,
} from './config/scenes';
import {voiceover} from './config/voiceover';
import {SceneHost} from './components/SceneTransition';
import {Stage} from './components/Stage';
import {Chrome} from './components/Chrome';
import {Captions} from './components/Captions';
import {loadProjectFonts} from './lib/fonts';
import {colors, fonts} from './lib/theme';

import {Scene01Hook} from './scenes/Scene01Hook';
import {Scene02Cycle} from './scenes/Scene02Cycle';
import {Scene03March} from './scenes/Scene03March';
import {Scene04April} from './scenes/Scene04April';
import {Scene05Transition} from './scenes/Scene05Transition';
import {Scene06Leave} from './scenes/Scene06Leave';
import {Scene07Allowance} from './scenes/Scene07Allowance';
import {Scene08Merit} from './scenes/Scene08Merit';
import {Scene09Close} from './scenes/Scene09Close';

loadProjectFonts();

const SCENE_COMPONENTS: Record<string, React.FC> = {
  hook: Scene01Hook,
  cycle: Scene02Cycle,
  march: Scene03March,
  april: Scene04April,
  transition: Scene05Transition,
  leave: Scene06Leave,
  allowance: Scene07Allowance,
  merit: Scene08Merit,
  close: Scene09Close,
};

/**
 * Where the accent glow sits, and how strong it is, over the whole film.
 * It swells on the hero moment and on each anchor month, which is what makes
 * the stage feel lit rather than flat.
 */
type GlowKey = {
  /** Scene id the key belongs to, so it moves when that scene moves. */
  scene: string;
  /** Seconds from the start of that scene. */
  at: number;
  x: number;
  y: number;
  /** 0 -> 1 intensity. */
  v: number;
};

/**
 * Where the accent glow sits over the course of the film, and how strong it is.
 * It swells on the hero moment and on each anchor month, which is what makes
 * the stage feel lit rather than flat.
 *
 * Keys are anchored to scenes rather than absolute times, so re-timing a scene
 * in scenes.ts moves its lighting with it.
 */
const GLOW_KEYS: GlowKey[] = [
  {scene: 'hook', at: 0, x: 960, y: 470, v: 0.4},
  // The wheel sits right of centre in scenes 2-4 and 8; the glow sits behind it.
  {scene: 'cycle', at: 0, x: 1300, y: 486, v: 0.25},
  {scene: 'cycle', at: 4.3, x: 1300, y: 300, v: 0.8}, // APRIL arrives at the marker
  {scene: 'march', at: 0.5, x: 1100, y: 330, v: 0.7},
  {scene: 'april', at: 0.5, x: 900, y: 360, v: 0.8},
  // Scenes 5-7: the timeline is the subject.
  {scene: 'transition', at: 1.0, x: 960, y: 560, v: 0.35},
  {scene: 'leave', at: 6.6, x: 1500, y: 600, v: 0.5},
  {scene: 'allowance', at: 7.0, x: 1500, y: 600, v: 0.5},
  {scene: 'merit', at: 1.2, x: 1300, y: 486, v: 0.45},
  {scene: 'merit', at: 4.0, x: 1000, y: 460, v: 0.75}, // 15 MONTHS lands
  {scene: 'close', at: 0.4, x: 960, y: 330, v: 0.75},
];


const StageWithGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const ts = GLOW_KEYS.map((k) => sceneStart(k.scene) + k.at);
  // Re-timing a scene can push a key past the next scene's, which interpolate()
  // reports as an opaque monotonicity error. Say what actually went wrong.
  const outOfOrder = ts.findIndex((v, i) => i > 0 && v <= ts[i - 1]);
  if (outOfOrder > 0) {
    const k = GLOW_KEYS[outOfOrder];
    throw new Error(
      `GLOW_KEYS is out of order at scene "${k.scene}" +${k.at}s (absolute ${ts[outOfOrder]}s, ` +
        `which is not after the previous key at ${ts[outOfOrder - 1]}s). ` +
        `A scene duration in scenes.ts probably shrank below one of its own glow keys.`,
    );
  }
  return (
    <Stage
      glowX={interpolate(t, ts, GLOW_KEYS.map((k) => k.x), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      glowY={interpolate(t, ts, GLOW_KEYS.map((k) => k.y), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      glow={interpolate(t, ts, GLOW_KEYS.map((k) => k.v), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
    />
  );
};

/** Fades the finished frame - scenes, chrome and all - to the navy stage. */
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
  return <AbsoluteFill style={{backgroundColor: colors.backgroundDeep, opacity, pointerEvents: 'none'}} />;
};

/** The closing scene presents its own logo, so the corner slot steps aside. */
const ChromeGate: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const closeStart = sceneStarts[scenes.length - 1] * fps;
  return <Chrome hidden={frame >= closeStart - 8} />;
};

export const SalaryCycleVideo: React.FC<{showCaptions?: boolean}> = ({showCaptions = true}) => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.background,
      // A default so nothing anywhere can fall back to the browser serif.
      fontFamily: fonts.body,
    }}
  >
    <StageWithGlow />

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

    <ChromeGate />
    {showCaptions ? <Captions /> : null}
    <Outro />

    {voiceover.audioFile ? (
      <Audio src={staticFile(voiceover.audioFile)} volume={voiceover.volume} />
    ) : null}
  </AbsoluteFill>
);
