/**
 * EMPLOYEE WELL-BEING PROGRAMME - the whole film.
 *
 * The audio is not one pre-mixed track. Every phrase is mounted as its own
 * <Audio> at the second the timeline places it, and the music bed runs
 * underneath as a separate track. Remotion mixes them at render time.
 *
 * That is worth doing for one reason: the pauses. The brief asks for specific,
 * deliberate silences after five particular lines, and mounting phrases
 * individually means those pauses are a number in the config rather than
 * something baked into a .wav that nobody can adjust later. Change one
 * `pauseAfter` and the narration, the visuals, the subtitles and the film's
 * length all move together.
 *
 * The music is ducked under every phrase, automatically, from the same
 * timeline - so it can never creep up over a word.
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
  placedScenes,
  placedPhrases,
  FPS,
  TRANSITION,
  OUTRO_FADE,
  totalDuration,
} from '../config/wellbeing';
import {music} from '../config/wellbeing.audio';
import {WellbeingStage} from './components/Stage';
import {WellbeingCaptions} from './components/Captions';
import {loadProjectFonts} from '../lib/fonts';
import {colors, fonts} from '../lib/theme';
import {SceneContext} from './sceneContext';

import {Scene1Opening} from './scenes/Scene1Opening';
import {Scene2Listening} from './scenes/Scene2Listening';
import {Scene3Voices} from './scenes/Scene3Voices';
import {Scene4Heard} from './scenes/Scene4Heard';
import {Scene5Action} from './scenes/Scene5Action';
import {Scene6Next} from './scenes/Scene6Next';
import {Scene7Closing} from './scenes/Scene7Closing';

loadProjectFonts();

const SCENE_COMPONENTS: Record<string, React.FC> = {
  opening: Scene1Opening,
  listening: Scene2Listening,
  voices: Scene3Voices,
  heard: Scene4Heard,
  action: Scene5Action,
  next: Scene6Next,
  closing: Scene7Closing,
};

/**
 * Where the stage light sits, and how strong it is.
 *
 * Keys are anchored to scene ids rather than absolute seconds, so re-timing
 * the narration moves the lighting with it. The light swells only on the two
 * moments that are the film's structural peaks - the priority areas, and the
 * date - and stays low everywhere a photograph is carrying the frame.
 */
const LIGHT: {scene: string; at: number; x: number; y: number; v: number}[] = [
  {scene: 'opening', at: 0, x: 960, y: 500, v: 0.1},
  {scene: 'listening', at: 0, x: 860, y: 480, v: 0.1},
  {scene: 'voices', at: 0, x: 700, y: 520, v: 0.1},
  {scene: 'heard', at: 0.4, x: 960, y: 430, v: 0.3},
  {scene: 'heard', at: 6.5, x: 960, y: 560, v: 0.5},
  {scene: 'action', at: 1.0, x: 960, y: 520, v: 0.34},
  {scene: 'action', at: 7.6, x: 960, y: 500, v: 0.78},
  {scene: 'next', at: 0, x: 760, y: 520, v: 0.12},
  {scene: 'closing', at: 0, x: 860, y: 500, v: 0.12},
  {scene: 'closing', at: 8.4, x: 960, y: 520, v: 0.42},
];

const sceneStartOf = (id: string): number => {
  const s = placedScenes.find((x) => x.id === id);
  if (!s) throw new Error(`LIGHT references scene "${id}", which is not in the timeline.`);
  return s.start;
};

const LitStage: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const times = LIGHT.map((k) => sceneStartOf(k.scene) + k.at);

  // interpolate() reports a non-monotonic input as an opaque error. Say which
  // key actually went backwards, because the usual cause is a scene that got
  // shorter than one of its own light keys when the narration was re-recorded.
  const bad = times.findIndex((v, i) => i > 0 && v <= times[i - 1]);
  if (bad > 0) {
    const k = LIGHT[bad];
    throw new Error(
      `LIGHT is out of order at scene "${k.scene}" +${k.at}s (absolute ${times[bad].toFixed(2)}s), ` +
        `which is not after the previous key at ${times[bad - 1].toFixed(2)}s. ` +
        `A scene is probably now shorter than that key.`,
    );
  }

  const at = (values: number[]) =>
    interpolate(t, times, values, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <WellbeingStage
      glow={at(LIGHT.map((k) => k.v))}
      glowX={at(LIGHT.map((k) => k.x))}
      glowY={at(LIGHT.map((k) => k.y))}
    />
  );
};

/**
 * Scene wrapper. Long cross-fades with a barely-perceptible push, so one image
 * is always arriving while the last one leaves and the film never cuts.
 */
const SceneHost: React.FC<{id: string; children: React.ReactNode}> = ({id, children}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const fade = Math.max(1, Math.round(TRANSITION * fps));

  const inP = interpolate(frame, [0, fade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const outP = interpolate(frame, [durationInFrames - fade, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  return (
    <SceneContext.Provider value={id}>
      <AbsoluteFill
        style={{
          opacity: Math.min(inP, 1 - outP),
          transform: `scale(${0.994 + inP * 0.006 + outP * 0.01})`,
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </AbsoluteFill>
    </SceneContext.Provider>
  );
};

/** Fades the finished frame to the deep navy over the closing hold. */
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
  return (
    <AbsoluteFill
      style={{backgroundColor: colors.backgroundDeep, opacity, pointerEvents: 'none'}}
    />
  );
};

/**
 * The music bed: quiet, and quieter still under every spoken phrase.
 *
 * The duck windows are read from the timeline, so a re-recorded line ducks the
 * bed over its new length without anyone editing this file.
 */
const MusicBed: React.FC = () => {
  const {fps} = useVideoConfig();

  const volumeAt = (frame: number): number => {
    const t = frame / fps;

    // Fade the bed up at the head and down over the closing hold.
    const envelope = Math.min(
      interpolate(t, [0, music.fadeIn], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
      interpolate(t, [totalDuration - music.fadeOut, totalDuration], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    );

    // Duck under speech, with a short ramp either side so the bed breathes
    // rather than steps.
    const speaking = placedPhrases.some(
      (p) => t >= p.start - music.duckRamp && t <= p.end + music.duckRamp,
    );
    const target = speaking ? music.duckedGain : music.bedGain;

    return envelope * target;
  };

  return <Audio src={staticFile(music.file)} volume={volumeAt} />;
};

export const WellbeingVideo: React.FC<{showCaptions?: boolean}> = ({showCaptions = true}) => (
  <AbsoluteFill style={{backgroundColor: colors.background, fontFamily: fonts.body}}>
    <LitStage />

    {placedScenes.map((scene, i) => {
      const Component = SCENE_COMPONENTS[scene.id];
      if (!Component) throw new Error(`No component registered for scene "${scene.id}".`);
      // Extra frames so a scene can fade out underneath the next one.
      const overlap = i === placedScenes.length - 1 ? 0 : Math.round(TRANSITION * FPS);
      return (
        <Sequence
          key={scene.id}
          from={Math.round(scene.start * FPS)}
          durationInFrames={Math.round(scene.duration * FPS) + overlap}
          name={scene.title}
          layout="none"
        >
          <SceneHost id={scene.id}>
            <Component />
          </SceneHost>
        </Sequence>
      );
    })}

    {showCaptions ? <WellbeingCaptions /> : null}
    <Outro />

    {/* The narration, phrase by phrase, at the times the timeline places them. */}
    {placedPhrases.map((phrase) => (
      <Sequence
        key={phrase.id}
        from={Math.round(phrase.start * FPS)}
        durationInFrames={Math.ceil(phrase.duration * FPS) + 2}
        name={`VO ${phrase.id}`}
        layout="none"
      >
        <Audio src={staticFile(`audio/wellbeing/${phrase.file}.mp3`)} />
      </Sequence>
    ))}

    <MusicBed />
  </AbsoluteFill>
);
