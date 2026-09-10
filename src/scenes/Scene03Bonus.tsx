/**
 * SCENE 3 - HOW BONUS IS DECIDED TODAY
 * KPI dashboard + an "estimate" badge. Neutral in tone: this is simply the
 * current state, not a problem to be fixed.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage} from '../components/SceneTransition';
import {SceneLabel} from '../components/SceneLabel';
import {KPIBoard, EstimateBadge} from '../components/KPIChart';
import {Chain} from '../components/Chain';
import {DrawPath, WriteOnG} from '../components/Draw';
import {dashedPolyline} from '../lib/geometry';
import {useProgress, useScene} from '../lib/timing';
import {colors, fonts} from '../lib/theme';

export const Scene03Bonus: React.FC = () => {
  const scene = useScene();
  const text = scene.text as Record<string, string | string[]>;
  const chain = text.chain as string[];

  const pLabel = useProgress('label', 0.6);
  const pBoard = useProgress('boardDraw', 0.9);
  const k1 = useProgress('kpi1', 0.45);
  const k2 = useProgress('kpi2', 0.45);
  const k3 = useProgress('kpi3', 0.45);
  const k4 = useProgress('kpi4', 0.45);
  const pBadge = useProgress('estimateTag', 0.6);
  const pChain1 = useProgress('chainIn', 0.5);
  const pChain2 = useProgress('chainStep2', 0.5);
  const pNote = useProgress('currentStateNote', 1.1);

  return (
    <AbsoluteFill>
      <Stage>
        <g transform="translate(230 250)">
          <KPIBoard
            title={text.boardTitle as string}
            kpis={text.kpis as string[]}
            width={840}
            height={500}
            boardProgress={pBoard}
            tileProgress={[k1, k2, k3, k4]}
            seed={210}
          />
        </g>

        {/* ESTIMATE badge, tied back to the dashboard it describes */}
        <DrawPath
          d={dashedPolyline([[1078, 430], [1210, 372], [1336, 330]], 13, 11)}
          progress={pBadge}
          stroke={colors.accent}
          strokeWidth={2.6}
        />
        <g transform="translate(1444 320)">
          <EstimateBadge progress={pBadge} label={text.estimate as string} seed={262} />
        </g>

        {/* BONUS -> ESTIMATED COMPANY PERFORMANCE */}
        <g transform="translate(1444 420)">
          <Chain
            steps={[
              {label: chain[0], color: colors.secondary, solid: true},
              {label: chain[1], color: colors.accent},
            ]}
            progress={[pChain1, pChain2]}
            width={620}
            boxHeight={82}
            arrowGap={46}
            fontSize={27}
            seed={560}
          />
        </g>

        {/* Neutral framing note */}
        <WriteOnG progress={pNote} x={430} y={808} width={1060} height={70}>
          <text
            x={960}
            y={856}
            textAnchor="middle"
            fill={colors.textSoft}
            style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 44}}
          >
            {text.note as string}
          </text>
        </WriteOnG>
      </Stage>
      <SceneLabel text={text.label as string} progress={pLabel} />
    </AbsoluteFill>
  );
};
