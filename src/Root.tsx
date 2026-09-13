import React from 'react';
import {Composition} from 'remotion';
import {SalaryCycleVideo} from './Video';
import {FPS, WIDTH, HEIGHT, totalFrames} from './config/scenes';
import {WellbeingVideo} from './wellbeing/WellbeingVideo';
import {
  FPS as WB_FPS,
  WIDTH as WB_WIDTH,
  HEIGHT as WB_HEIGHT,
  totalFrames as wellbeingFrames,
} from './config/wellbeing';

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

    {/* The Employee Well-being Programme announcement. */}
    <Composition
      id="WellbeingProgramme"
      component={WellbeingVideo}
      durationInFrames={wellbeingFrames}
      fps={WB_FPS}
      width={WB_WIDTH}
      height={WB_HEIGHT}
      defaultProps={{showCaptions: true}}
    />
    <Composition
      id="WellbeingProgramme-NoCaptions"
      component={WellbeingVideo}
      durationInFrames={wellbeingFrames}
      fps={WB_FPS}
      width={WB_WIDTH}
      height={WB_HEIGHT}
      defaultProps={{showCaptions: false}}
    />
  </>
);
