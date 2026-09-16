import React from 'react';
import {Composition} from 'remotion';
import {SalaryCycleVideo} from './Video';
import {FPS, WIDTH, HEIGHT, totalFrames} from './config/scenes';
import {elementSpecs} from './elements.config';
import * as El from './Elements';

/**
 * Composition id -> component, for the reusable elements exported on
 * transparent backgrounds. See src/Elements.tsx.
 */
const ELEMENTS: Record<string, React.FC> = {
  'el-timeline-old': El.ElTimelineOld,
  'el-timeline-morph': El.ElTimelineMorph,
  'el-timeline-new': El.ElTimelineNew,
  'el-monthrail-old': El.ElMonthRailOld,
  'el-monthrail-new': El.ElMonthRailNew,
  'el-rail-reorder': El.ElRailReorder,
  'el-yearring-spin': El.ElYearRingSpin,
  'el-yearring-static': El.ElYearRingStatic,
  'el-range-old': El.ElRangeOld,
  'el-range-new': El.ElRangeNew,
  'el-icon-merit': El.ElIconMerit,
  'el-icon-promotion': El.ElIconPromotion,
  'el-icon-bonus': El.ElIconBonus,
  'el-icon-performance': El.ElIconPerformance,
  'el-icon-tick': El.ElIconTick,
  'el-icons-kpi': El.ElIconsKpi,
  'el-forecast-chart': El.ElForecastChart,
  'el-fifteen-months': El.ElFifteenMonths,
  'el-five-to-625': El.ElFiveToSixTwentyFive,
  'el-timing-compare': El.ElTimingCompare,
};

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

    {/* Reusable elements, each on a transparent background, for editing
        elsewhere. Nothing here paints a background - see src/Elements.tsx. */}
    {elementSpecs.map((spec) => {
      const Component = ELEMENTS[spec.id];
      if (!Component) throw new Error(`No component registered for element "${spec.id}"`);
      return (
        <Composition
          key={spec.id}
          id={spec.id}
          component={Component}
          durationInFrames={Math.round(spec.duration * FPS)}
          fps={FPS}
          width={spec.width}
          height={spec.height}
        />
      );
    })}
  </>
);
