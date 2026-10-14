import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {TIMELINE, FPS, timecode} from './lib/timeline';
import {loadFonts, UI_FONT} from './lib/fonts';
import {GOLD} from './lib/theme';
import {Shot} from './components/Shot';
import {LowerLabel, TextLayer} from './components/Titles';

loadFonts();

/** Animatic-only stand-ins until the room names are read off the plan. */
const ROOM_PLACEHOLDER: Record<string, string> = {
  living: 'الصالة',
  kitchen: 'المطبخ',
  circulation: 'الدرج / الممر',
  masterBedroom: 'غرفة النوم الرئيسية',
  bedroom: 'غرفة النوم',
  bathroom: 'دورة المياه',
};

export type FilmProps = {
  /** Burns in the slate (timecode, shot, slot) and allows placeholders. */
  animatic: boolean;
  /** Path under public/. The temp score is a timing guide, not for release. */
  music: string | null;
};

const Slate: React.FC = () => {
  const frame = useCurrentFrame();
  const shot = [...TIMELINE.shots].reverse().find((s) => frame >= s.from) ?? TIMELINE.shots[0];
  return (
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 44, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', fontFamily: UI_FONT, fontSize: 17, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.85)'}}>
      <span><span style={{color: GOLD}}>JABEEN</span> · ANIMATIC · TEMP SCORE · NOT FOR RELEASE</span>
      <span>{shot.sceneId} {shot.sceneTitle.toUpperCase()} · SHOT {shot.slot}</span>
      <span style={{fontVariantNumeric: 'tabular-nums'}}>{timecode(frame)}</span>
    </div>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)'}} />
);

const MusicTrack: React.FC<{src: string}> = ({src}) => {
  const total = TIMELINE.totalFrames;
  return (
    <Audio
      src={staticFile(src)}
      volume={(f) => interpolate(f, [0, FPS * 0.5, total - FPS * 1.5, total], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
    />
  );
};

export const Film: React.FC<FilmProps> = ({animatic, music}) => {
  const {shots, text} = TIMELINE;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots.map((shot, i) => {
        const nextOverlap = shots[i + 1]?.overlap ?? 0;
        const start = i === 0 ? 0 : shot.from - shot.overlap;
        const life = shot.duration + (i === 0 ? 0 : shot.overlap) + nextOverlap;
        const roomLabel = shot.room && shot.villa ? shot.villa.roomLabels?.[shot.room as keyof NonNullable<typeof shot.villa.roomLabels>] : undefined;
        const showRoom = shot.room && (roomLabel || animatic);
        const isGraphic = shot.move === 'floorPlan' || shot.move === 'endFrame';
        return (
          <Sequence key={shot.slot} from={start} durationInFrames={life} name={`${shot.slot} ${shot.move}`}>
            <Shot shot={shot} life={life} animatic={animatic} />
            {!isGraphic && <Vignette />}
            {showRoom && (
              <Sequence from={(i === 0 ? 0 : shot.overlap) + Math.round(FPS * 0.6)} durationInFrames={shot.duration - Math.round(FPS * 1.2)}>
                <LowerLabel title={roomLabel ?? `[${ROOM_PLACEHOLDER[shot.room ?? ""] ?? shot.room}]`} duration={shot.duration - Math.round(FPS * 1.2)} small />
              </Sequence>
            )}
          </Sequence>
        );
      })}
      {text.map((cue, i) => (
        <Sequence key={`t${i}`} from={cue.from} durationInFrames={cue.duration} name={`text ${cue.kind}`}>
          <TextLayer cue={cue} />
        </Sequence>
      ))}
      {music && <MusicTrack src={music} />}
      {animatic && <Slate />}
    </AbsoluteFill>
  );
};
