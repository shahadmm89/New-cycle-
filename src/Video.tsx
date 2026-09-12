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
import {scenes, sceneStarts, sceneStart, FPS, TRANSITION, OUTRO_FADE} from './config/scenes';
import {voiceover} from './config/voiceover';
import {SceneHost} from './components/SceneTransition';
import {Stage} from './components/Stage';
import {Chrome} from './components/Chrome';
import {Captions} from './components/Captions';
import {loadProjectFonts} from './lib/fonts';
import {colors, fonts} from './lib/theme';

import {Scene01Hook} from './scenes/Scene01Hook';
import {Scene02OldCycle} from './scenes/Scene02OldCycle';
import {Scene03Today} from './scenes/Scene03Today';
import {Scene04TheChange} from './scenes/Scene04TheChange';
import {Scene05April} from './scenes/Scene05April';
import {Scene06March} from './scenes/Scene06March';
import {Scene07NoChange} from './scenes/Scene07NoChange';
import {Scene08Example} from './scenes/Scene08Example';
import {Scene09Summary} from './scenes/Scene09Summary';
import {Scene10Why} from './scenes/Scene10Why';
import {Scene11Close} from './scenes/Scene11Close';

loadProjectFonts();

const SCENE_COMPONENTS: Record<string, React.FC> = {
  hook: Scene01Hook,
  'old-cycle': Scene02OldCycle,
  today: Scene03Today,
  'the-change': Scene04TheChange,
  april: Scene05April,
  march: Scene06March,
  'no-change': Scene07NoChange,
  example: Scene08Example,
  summary: Scene09Summary,
  why: Scene10Why,
  close: Scene11Close,
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
  {scene: 'old-cycle', at: 0, x: 500, y: 520, v: 0.14},
  {scene: 'today', at: 0, x: 960, y: 430, v: 0.12},
  {scene: 'today', at: 14.5, x: 960, y: 560, v: 0.35},  // the KPIs roll up
  {scene: 'the-change', at: 0, x: 480, y: 520, v: 0.18},
  {scene: 'the-change', at: 2.2, x: 480, y: 520, v: 0.55}, // ring spins up
  {scene: 'the-change', at: 4.25, x: 1250, y: 470, v: 0.95}, // APR -> MAR lands
  {scene: 'the-change', at: 5.6, x: 1250, y: 470, v: 0.85},
  {scene: 'april', at: 0.4, x: 960, y: 420, v: 0.9},
  {scene: 'march', at: 3.05, x: 960, y: 600, v: 0.7},
  {scene: 'march', at: 4.3, x: 960, y: 600, v: 0.85},
  {scene: 'no-change', at: 0, x: 960, y: 500, v: 0.3},
  {scene: 'example', at: 0, x: 760, y: 560, v: 0.16},
  {scene: 'example', at: 25.5, x: 1470, y: 600, v: 0.8},  // 6.25% lands
  {scene: 'summary', at: 0.6, x: 960, y: 420, v: 0.75},
  {scene: 'why', at: 0, x: 700, y: 520, v: 0.35},
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
