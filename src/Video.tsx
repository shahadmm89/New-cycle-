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
  sceneBeat,
  monthsCalendar,
  monthsSalaryYear,
  FPS,
  TRANSITION,
  OUTRO_FADE,
} from './config/scenes';
import {voiceover} from './config/voiceover';
import {SceneHost} from './components/SceneTransition';
import {Stage} from './components/Stage';
import {Chrome} from './components/Chrome';
import {Captions} from './components/Captions';
import {Timeline, TimelinePin} from './components/Timeline';
import {loadProjectFonts} from './lib/fonts';
import {colors, fonts} from './lib/theme';

import {Scene01Hook} from './scenes/Scene01Hook';
import {Scene02OldCycle} from './scenes/Scene02OldCycle';
import {Scene03Today} from './scenes/Scene03Today';
import {Scene04TheChange} from './scenes/Scene04TheChange';
import {Scene05ActualData} from './scenes/Scene05ActualData';
import {Scene06April} from './scenes/Scene06April';
import {Scene07March} from './scenes/Scene07March';
import {Scene08NoChange} from './scenes/Scene08NoChange';
import {Scene09Example} from './scenes/Scene09Example';
import {Scene10Summary} from './scenes/Scene10Summary';
import {Scene11Close} from './scenes/Scene11Close';

loadProjectFonts();

const SCENE_COMPONENTS: Record<string, React.FC> = {
  hook: Scene01Hook,
  'old-cycle': Scene02OldCycle,
  today: Scene03Today,
  'the-change': Scene04TheChange,
  'actual-data': Scene05ActualData,
  april: Scene06April,
  march: Scene07March,
  'no-change': Scene08NoChange,
  example: Scene09Example,
  summary: Scene10Summary,
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
  {scene: 'today', at: 13.6, x: 960, y: 560, v: 0.35},  // the KPIs roll up
  {scene: 'the-change', at: 0, x: 480, y: 520, v: 0.18},
  {scene: 'the-change', at: 2.2, x: 480, y: 520, v: 0.55}, // ring spins up
  {scene: 'the-change', at: 4.25, x: 1250, y: 470, v: 0.95}, // APR -> MAR lands
  {scene: 'the-change', at: 5.6, x: 1250, y: 470, v: 0.85},
  // The bottom timeline is deliberately unlit - the glow stays on the scene.
  {scene: 'actual-data', at: 0.4, x: 700, y: 470, v: 0.3},
  {scene: 'actual-data', at: 6.0, x: 1150, y: 470, v: 0.42},
  {scene: 'actual-data', at: 13.0, x: 900, y: 470, v: 0.3},
  {scene: 'april', at: 0.4, x: 960, y: 420, v: 0.9},
  {scene: 'march', at: 3.05, x: 960, y: 600, v: 0.7},
  {scene: 'march', at: 4.3, x: 960, y: 600, v: 0.85},
  {scene: 'no-change', at: 0, x: 960, y: 500, v: 0.3},
  {scene: 'example', at: 0, x: 760, y: 560, v: 0.16},
  {scene: 'example', at: 25.5, x: 1470, y: 600, v: 0.8},  // 6.25% lands
  {scene: 'summary', at: 0.6, x: 960, y: 420, v: 0.75},
  {scene: 'close', at: 0.4, x: 960, y: 330, v: 0.75},
];


/* ------------------------------------------------------------------------- *
 * THE BOTTOM TIMELINE
 *
 * One hairline rail of twelve months, running from scene 2 to scene 5. It
 * answers a single question the narration keeps raising: WHEN does each piece
 * of information actually arrive?
 *
 *   scenes 2-3   JAN -> DEC, and today's two pins: the market data that lands
 *                around November, the company figures estimated by December.
 *   scene 4      the same twelve months re-align into APR -> MAR. They travel;
 *                nothing cuts.
 *   scene 5      two new pins, late in the new cycle, where the same two pieces
 *                of information are ACTUAL rather than estimated.
 *
 * It renders here rather than inside the scenes so it can cross all four of
 * them - a per-scene rail would have to be re-introduced each time, which is
 * exactly the cut we are avoiding.
 * ------------------------------------------------------------------------- */

/** Left edge and width of the rail. Inset from the frame so end pins fit. */
const TL_LEFT = 160;
const TL_WIDTH = 1600;
/** Top of the rail's box. The rule lands at 874, clear of the subtitles. */
const TL_TOP = 812;
/** How long a pin takes to arrive. */
const PIN_IN = 0.7;

type Cue = {scene: string; beat: string; len: number};

/** The rail's own four moments. */
const TL_IN: Cue = {scene: 'old-cycle', beat: 'timelineIn', len: 1.5};
const TL_PINS_OUT: Cue = {scene: 'the-change', beat: 'timelinePinsOut', len: 0.7};
const TL_MORPH: Cue = {scene: 'the-change', beat: 'timelineMorph', len: 2.0};
const TL_OUT: Cue = {scene: 'actual-data', beat: 'timelineOut', len: 1.3};

/**
 * A pin, and the beat it arrives on. Each pair sits on adjacent months, so the
 * tiers alternate - the first rides above the rule, the second sits on it.
 */
type PinCue = TimelinePin & Cue & {tone: 'estimate' | 'actual'};

const TL_PINS: PinCue[] = [
  // Today: both of these are an estimate at the moment the decision is made.
  {month: 'NOV', label: 'NOVEMBER', sub: 'Expected market\nmovement', tone: 'estimate', tier: 1, progress: 0, scene: 'today', beat: 'timelineNov', len: PIN_IN},
  {month: 'DEC', label: 'DECEMBER', sub: 'Estimated Company\nPerformance KPIs', tone: 'estimate', tier: 0, progress: 0, scene: 'today', beat: 'timelineDec', len: PIN_IN},
  // The new cycle: the same two things, now actual.
  {month: 'JAN', label: 'JANUARY', sub: 'Actual Company\nPerformance', tone: 'actual', tier: 1, progress: 0, scene: 'actual-data', beat: 'timelineJan', len: PIN_IN},
  {month: 'FEB', label: 'FEBRUARY', sub: 'Actual market\nmovement', tone: 'actual', tier: 0, progress: 0, scene: 'actual-data', beat: 'timelineFeb', len: PIN_IN},
];

const BottomTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  /** 0 -> 1 of a cue, eased, at the current time. */
  const cue = (c: Cue, easing = Easing.out(Easing.cubic)) => {
    const at = sceneBeat(c.scene, c.beat);
    return interpolate(t, [at, at + c.len], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing,
    });
  };

  const drawn = cue(TL_IN);
  const retired = cue(TL_OUT);
  if (drawn <= 0 || retired >= 1) return null;

  // The re-alignment: slow away, quick through the middle, settling hard - the
  // months should feel carried rather than swapped.
  const morph = cue(TL_MORPH, Easing.bezier(0.5, 0, 0.25, 1));
  const pinsOut = cue(TL_PINS_OUT);

  const pins: TimelinePin[] = TL_PINS.map((pin) => {
    const arrive = cue(pin);
    // Today's pins clear as the cycle starts to move; the new cycle's stay.
    const leave = pin.tone === 'estimate' ? pinsOut : 0;
    return {...pin, progress: arrive * (1 - leave)};
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: TL_LEFT,
        top: TL_TOP,
        width: TL_WIDTH,
        opacity: 1 - retired,
      }}
    >
      <Timeline
        months={monthsCalendar}
        into={monthsSalaryYear}
        progress={drawn}
        morph={morph}
        width={TL_WIDTH}
        pins={pins}
        edge={TL_LEFT - 20}
      />
    </div>
  );
};


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

    <BottomTimeline />
    <ChromeGate />
    {showCaptions ? <Captions /> : null}
    <Outro />

    {voiceover.audioFile ? (
      <Audio src={staticFile(voiceover.audioFile)} volume={voiceover.volume} />
    ) : null}
  </AbsoluteFill>
);
