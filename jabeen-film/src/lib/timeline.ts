/**
 * Turns storyboard.json + the villa types into a flat, frame-accurate list
 * of shots and text cues. Nothing else in the film computes frame numbers.
 */
import board from '../config/storyboard.json';
import {villasForFilm, VillaType} from '../config/project';

export const FPS: number = board.fps;
export const WIDTH: number = board.width;
export const HEIGHT: number = board.height;

export type Move = 'push' | 'descend' | 'glide' | 'orbit' | 'crane' | 'craneUp' | 'floorPlan' | 'endFrame';
export type TransitionIn = 'fadeFromBlack' | 'dissolve' | 'cloudWipe' | 'threshold' | 'cut';

type RawShot = {
  id: string;
  dur: number;
  move: string;
  transitionIn: string;
  transitionDur: number;
  visual: string;
  room?: string;
  inCondensed?: boolean;
  condensedDur?: number;
};
type RawText = {kind: string; at: number; until: number; copy?: string};
type RawScene = {
  id: string;
  title: string;
  music: string;
  perVilla?: boolean;
  shots: RawShot[];
  text?: RawText[];
};

export type Shot = {
  /** Asset slot id: shot id, plus @villa for per-villa scenes. */
  slot: string;
  shotId: string;
  sceneId: string;
  sceneTitle: string;
  music: string;
  visual: string;
  move: Move;
  transitionIn: TransitionIn;
  /** Absolute frame where the shot is fully on screen (the cut point). */
  from: number;
  /** Frames from the cut point to the next cut point. */
  duration: number;
  /** Frames the shot starts early, fading in over the previous one. */
  overlap: number;
  room?: string;
  villa?: VillaType;
};

export type TextCue = {
  kind: string;
  copy?: string;
  from: number;
  duration: number;
  villa?: VillaType;
};

const f = (s: number) => Math.round(s * FPS);

const build = () => {
  const shots: Shot[] = [];
  const text: TextCue[] = [];
  let cursor = 0;

  for (const scene of board.scenes as RawScene[]) {
    const passes: (VillaType | undefined)[] = scene.perVilla ? villasForFilm() : [undefined];
    passes.forEach((villa, passIndex) => {
      const condensed = passIndex > 0;
      const sceneStart = cursor;
      for (const raw of scene.shots) {
        if (condensed && !raw.inCondensed) continue;
        const dur = condensed && raw.condensedDur ? raw.condensedDur : raw.dur;
        shots.push({
          slot: villa ? `${raw.id}@${villa.id}` : raw.id,
          shotId: raw.id,
          sceneId: scene.id,
          sceneTitle: scene.title,
          music: scene.music,
          visual: raw.visual,
          move: raw.move as Move,
          transitionIn: raw.transitionIn as TransitionIn,
          from: cursor,
          duration: f(dur),
          overlap: f(raw.transitionDur),
          room: raw.room,
          villa,
        });
        cursor += f(dur);
      }
      for (const t of scene.text ?? []) {
        text.push({kind: t.kind, copy: t.copy, from: sceneStart + f(t.at), duration: f(t.until - t.at), villa});
      }
    });
  }
  return {shots, text, totalFrames: cursor};
};

export const TIMELINE = build();

export const timecode = (frame: number) => {
  const s = Math.floor(frame / FPS);
  const ff = frame % FPS;
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}:${String(ff).padStart(2, '0')}`;
};
