import React from 'react';
import {Composition} from 'remotion';
import {Film, FilmProps} from './Film';
import {FPS, WIDTH, HEIGHT, TIMELINE} from './lib/timeline';
import {Demo, DEMO_TOTAL} from './Demo';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Timing and review cut: slate burned in, placeholders for missing assets, temp score. */}
    <Composition<any, FilmProps>
      id="JabeenAnimatic"
      component={Film}
      durationInFrames={TIMELINE.totalFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{animatic: true, music: 'audio/temp-score.mp3'}}
    />
    {/* Release film. render/render.mjs refuses to render it while any asset,
        fact or the licensed music is missing. */}
    <Composition<any, FilmProps>
      id="JabeenFilm"
      component={Film}
      durationInFrames={TIMELINE.totalFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{animatic: false, music: 'audio/score.wav'}}
    />
    {/* Free in-Claude demo built from depth-parallax clips (demo/shots.json). */}
    <Composition
      id="JabeenDemo"
      component={Demo}
      durationInFrames={DEMO_TOTAL}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{music: 'audio/demo-score.mp3'}}
    />
  </>
);
