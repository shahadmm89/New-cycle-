/**
 * SCENE 2 - HOW MERIT IS DECIDED TODAY
 * Timeline, market chart with a dotted forecast, and the FORECAST ->
 * ESTIMATED MARKET MOVEMENT -> MERIT chain.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage} from '../components/SceneTransition';
import {SceneLabel} from '../components/SceneLabel';
import {Timeline} from '../components/Timeline';
import {MarketChart} from '../components/MarketChart';
import {Chain} from '../components/Chain';
import {CoinStack} from '../components/SalaryIcon';
import {DrawPath} from '../components/Draw';
import {roughLine} from '../lib/rough';
import {dashedPolyline} from '../lib/geometry';
import {useProgress, useScene} from '../lib/timing';
import {colors, fonts} from '../lib/theme';

export const Scene02Merit: React.FC = () => {
  const scene = useScene();
  const text = scene.text as Record<string, string | string[]>;
  const chain = text.chain as string[];

  const pLabel = useProgress('label', 0.6);
  const pRail = useProgress('timelineDraw', 0.9);
  const pTicks = useProgress('timelineTicks', 0.7);
  const pCoins = useProgress('salaryIcon', 0.7);
  const pAxes = useProgress('chartAxes', 0.6);
  const pActualHist = useProgress('chartActual', 0.9);
  const pForecast = useProgress('forecastLine', 1.1);
  const pTag = useProgress('projectedTag', 0.5);
  const pCompare = useProgress('compareIn', 0.9);
  const pChain1 = useProgress('chainIn', 0.5);
  const pChain2 = useProgress('chainStep2', 0.5);
  const pChain3 = useProgress('chainStep3', 0.5);

  return (
    <AbsoluteFill>
      <Stage>
        {/* Timeline: JANUARY -> DECEMBER */}
        <g transform="translate(210 250)">
          <Timeline
            stops={[{label: text.timelineFrom as string}, {label: text.timelineTo as string}]}
            width={560}
            overshoot={54}
            railProgress={pRail}
            stopsProgress={pTicks}
            labelSize={38}
            seed={91}
          />
        </g>

        {/* Salary icon */}
        <g transform="translate(1070 240) scale(0.86)">
          <CoinStack progress={pCoins} seed={301} />
        </g>

        {/* Market chart */}
        <g transform="translate(250 800)">
          <MarketChart
            width={660}
            height={330}
            axesProgress={pAxes}
            historyProgress={pActualHist}
            forecastProgress={pForecast}
            actualProgress={pCompare}
            yLabel={text.chartYAxis as string}
            xLabel={text.chartXAxis as string}
            seed={121}
          />
        </g>

        {/* PROJECTED tag on the dotted line */}
        <g opacity={pTag}>
          <DrawPath
            d={roughLine(916, 492, 950, 456, 133)}
            progress={pTag}
            stroke={colors.accent}
            strokeWidth={2.6}
          />
          <rect x={946} y={418} width={196} height={52} rx={8} fill={colors.accent} opacity={0.16} />
          <text
            x={1044}
            y={454}
            textAnchor="middle"
            fill={colors.accent}
            style={{fontFamily: fonts.body, fontWeight: 900, fontSize: 26, letterSpacing: 2.4}}
          >
            {text.projected as string}
          </text>
        </g>

        {/* Estimated vs actual legend */}
        <g opacity={pCompare} transform="translate(258 880)">
          <path d={dashedPolyline([[0, 0], [64, 0]], 14, 12)} stroke={colors.accent} strokeWidth={5} fill="none" strokeLinecap="round" />
          <text x={78} y={9} fill={colors.textSoft} style={{fontFamily: fonts.body, fontWeight: 700, fontSize: 26}}>
            {text.estimated as string}
          </text>
          <path d="M 400 0 L 464 0" stroke={colors.secondary} strokeWidth={5} strokeLinecap="round" />
          <text x={478} y={9} fill={colors.textSoft} style={{fontFamily: fonts.body, fontWeight: 700, fontSize: 26}}>
            {text.actual as string}
          </text>
        </g>

        {/* FORECAST -> ESTIMATED MARKET MOVEMENT -> MERIT */}
        <g transform="translate(1450 330)">
          <Chain
            steps={[
              {label: chain[0], color: colors.accent},
              {label: chain[1], color: colors.accent},
              {label: chain[2], color: colors.primary, solid: true},
            ]}
            progress={[pChain1, pChain2, pChain3]}
            width={560}
            boxHeight={82}
            arrowGap={46}
            fontSize={27}
            seed={520}
          />
        </g>
      </Stage>
      <SceneLabel text={text.label as string} progress={pLabel} />
    </AbsoluteFill>
  );
};
