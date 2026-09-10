/**
 * SCENE 7 - BEFORE vs NOW
 * The left column builds first, then the right column answers it, then both
 * lift to make room for the one-line takeaway.
 */
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Stage} from '../components/SceneTransition';
import {SceneLabel} from '../components/SceneLabel';
import {ComparisonPanel} from '../components/Comparison';
import {DrawPath, WriteOnG} from '../components/Draw';
import {dashedPolyline} from '../lib/geometry';
import {useProgress, useScene, EASE} from '../lib/timing';
import {colors, fonts} from '../lib/theme';
import {cycle} from '../config/copy';

const PANEL_W = 720;
const PANEL_H = 512;
const PANEL_Y = 226;

export const Scene07Comparison: React.FC = () => {
  const scene = useScene();
  const text = scene.text as Record<string, string>;

  const pLabel = useProgress('label', 0.6);
  const pLeft = useProgress('leftPanel', 0.6);
  const l1 = useProgress('leftRow1', 0.5);
  const l2 = useProgress('leftRow2', 0.5);
  const l3 = useProgress('leftRow3', 0.5);
  const pDivider = useProgress('divider', 0.6);
  const pRight = useProgress('rightPanel', 0.6);
  const r1 = useProgress('rightRow1', 0.5);
  const r2 = useProgress('rightRow2', 0.5);
  const r3 = useProgress('rightRow3', 0.5);
  const pLift = useProgress('lift', 0.9, EASE.soft);
  const pBanner1 = useProgress('banner1', 0.7);
  const pBanner2 = useProgress('banner2', 0.7);

  const scale = interpolate(pLift, [0, 1], [1, 0.855]);
  const shiftY = interpolate(pLift, [0, 1], [0, -66]);

  const leftRows = [
    {label: 'Performance cycle', value: `Closes in ${cycle.performanceClose}`},
    {label: 'Merit', value: 'Projected market movement'},
    {label: 'Bonus', value: 'Estimated company performance'},
  ];
  const rightRows = [
    {label: 'Performance cycle', value: `Still closes in ${cycle.performanceClose}`, tick: true},
    {label: 'Bonus', value: `${cycle.bonusMonth} payroll`, tick: true},
    {label: 'Merit', value: `Effective ${cycle.meritEffectiveDate}`, tick: true},
  ];

  return (
    <AbsoluteFill>
      <Stage>
        <g transform={`translate(960 ${PANEL_Y + PANEL_H / 2 + shiftY}) scale(${scale}) translate(-960 ${-(PANEL_Y + PANEL_H / 2)})`}>
          <g transform={`translate(160 ${PANEL_Y})`}>
            <ComparisonPanel
              title={text.leftTitle}
              rows={leftRows}
              width={PANEL_W}
              height={PANEL_H}
              panelProgress={pLeft}
              rowProgress={[l1, l2, l3]}
              accent={colors.neutral}
              seed={710}
            />
          </g>

          <DrawPath
            d={dashedPolyline([[960, PANEL_Y + 10], [960, PANEL_Y + PANEL_H - 10]], 14, 14)}
            progress={pDivider}
            stroke={colors.line}
            strokeWidth={3}
          />

          <g transform={`translate(1040 ${PANEL_Y})`}>
            <ComparisonPanel
              title={text.rightTitle}
              rows={rightRows}
              width={PANEL_W}
              height={PANEL_H}
              panelProgress={pRight}
              rowProgress={[r1, r2, r3]}
              accent={colors.primary}
              emphasised
              seed={760}
            />
          </g>
        </g>

        {/* Takeaway banner */}
        <WriteOnG progress={pBanner1} x={280} y={716} width={1360} height={86}>
          <text
            x={960}
            y={782}
            textAnchor="middle"
            fill={colors.text}
            style={{fontFamily: fonts.body, fontWeight: 900, fontSize: 60, letterSpacing: 1}}
          >
            {text.banner1}
          </text>
        </WriteOnG>
        <WriteOnG progress={pBanner2} x={280} y={800} width={1360} height={90}>
          <text
            x={960}
            y={868}
            textAnchor="middle"
            fill={colors.primary}
            style={{fontFamily: fonts.body, fontWeight: 900, fontSize: 60, letterSpacing: 1}}
          >
            {text.banner2}
          </text>
        </WriteOnG>
      </Stage>
      <SceneLabel text={text.label} progress={pLabel} />
    </AbsoluteFill>
  );
};
