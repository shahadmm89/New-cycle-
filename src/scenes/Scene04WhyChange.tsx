/**
 * SCENE 4 - WHY ARE WE CHANGING?
 * The old calendar leaves, a magnifying glass looks at better market data,
 * and the answer lands. Positive in tone throughout.
 */
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {Stage} from '../components/SceneTransition';
import {WallCalendar} from '../components/Calendar';
import {MorphRow} from '../components/Chain';
import {MagnifyingGlass, CheckMark} from '../components/SalaryIcon';
import {MarketChart} from '../components/MarketChart';
import {WriteOnG} from '../components/Draw';
import {useProgress, useBeat, useScene} from '../lib/timing';
import {colors, fonts} from '../lib/theme';

export const Scene04WhyChange: React.FC = () => {
  const scene = useScene();
  const text = scene.text as Record<string, string | string[]>;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slideStart = useBeat('slideOut');
  const slide = interpolate(frame, [slideStart, slideStart + Math.round(1.1 * fps)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  const pQuestion = useProgress('question', 0.9);
  const pGlass = useProgress('glassIn', 0.6);
  const pSweep = useProgress('glassSweep', 1.6, Easing.inOut(Easing.cubic));
  const pMorphFrom = useProgress('morphOut', 0.5);
  const pMorphArrow = useProgress('morphOut', 0.9);
  const pMorphTo = useProgress('morphIn', 0.6);
  const pResults = useProgress('resultsIn', 0.7);
  const pAnswer = useProgress('answer', 1.0);

  return (
    <AbsoluteFill>
      <Stage>
        {/* The old calendar leaves the frame */}
        <g transform={`translate(${760 - slide * 1500} 300)`} opacity={1 - slide}>
          <WallCalendar progress={1} month="DEC" width={400} height={330} accent={colors.neutral} seed={45} />
        </g>

        {/* "So, what's changing?" */}
        <WriteOnG progress={pQuestion} x={300} y={150} width={1320} height={110}>
          <text
            x={960}
            y={232}
            textAnchor="middle"
            fill={colors.text}
            style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 64}}
          >
            {text.question as string}
          </text>
        </WriteOnG>

        {/* Magnifying glass sweeping across market data */}
        <g opacity={pGlass}>
          <g transform="translate(662 512) scale(0.95)">
            <MarketChart
              width={620}
              height={224}
              axesProgress={pGlass}
              historyProgress={pGlass}
              forecastProgress={0}
              actualProgress={pGlass}
              showAxisLabels={false}
              seed={140}
            />
          </g>
          <g transform={`translate(${740 + pSweep * 460} ${446 - pSweep * 66}) scale(0.86)`}>
            <MagnifyingGlass progress={pGlass} seed={382} />
          </g>
        </g>

        {/* PROJECTED DATA -> MORE RELEVANT MARKET DATA */}
        <g transform="translate(300 572)">
          <MorphRow
            from={text.before}
            to={text.after}
            fromProgress={pMorphFrom}
            arrowProgress={pMorphArrow}
            toProgress={pMorphTo}
            width={1320}
            cardWidth={470}
            height={126}
            fromColor={colors.neutral}
            toColor={colors.primary}
            fontSize={31}
            seed={620}
          />
        </g>

        {/* Company KPI results are available */}
        <g opacity={pResults} transform="translate(654 754)">
          <g transform="scale(0.3)">
            <CheckMark progress={pResults} size={120} color={colors.success} ring={false} seed={392} />
          </g>
          <text
            x={44}
            y={12}
            fill={colors.textSoft}
            style={{fontFamily: fonts.body, fontWeight: 700, fontSize: 32}}
          >
            {text.results as string}
          </text>
        </g>

        {/* The answer */}
        <WriteOnG progress={pAnswer} x={320} y={790} width={1280} height={90}>
          <text
            x={960}
            y={856}
            textAnchor="middle"
            fill={colors.primary}
            style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 48}}
          >
            {text.answer as string}
          </text>
        </WriteOnG>
      </Stage>
    </AbsoluteFill>
  );
};
