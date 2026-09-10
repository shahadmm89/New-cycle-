import React from 'react';
import {Composition} from 'remotion';
import {SalaryCycleVideo} from './Video';
import {FPS, WIDTH, HEIGHT, totalFrames} from './config/scenes';

export const RemotionRoot: React.FC = () => (
  <>
    {/* The deliverable. */}
    <Composition
      id="SalaryCycleUpdate"
      component={SalaryCycleVideo}
      durationInFrames={totalFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{showCaptions: true}}
    />
    {/* Same film without burned-in subtitles, for anyone who prefers to ship
        the .srt sidecar instead. */}
    <Composition
      id="SalaryCycleUpdate-NoCaptions"
      component={SalaryCycleVideo}
      durationInFrames={totalFrames}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={{showCaptions: false}}
    />
  </>
);
