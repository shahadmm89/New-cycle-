/**
 * SCENE 6 - WHAT DOES NOT CHANGE
 * The reassurance scene. December comes back, the appraisal chain is spelled
 * out, and a large NO CHANGE stamp lands with a tick.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage} from '../components/SceneTransition';
import {SceneLabel} from '../components/SceneLabel';
import {WallCalendar} from '../components/Calendar';
import {Chain} from '../components/Chain';
import {CheckMark} from '../components/SalaryIcon';
import {DrawPath, WriteOnG} from '../components/Draw';
import {roughRect} from '../lib/rough';
import {useProgress, useScene, EASE} from '../lib/timing';
import {colors, fonts, sketch} from '../lib/theme';
import {cycle} from '../config/copy';

export const Scene06NoChange: React.FC = () => {
  const scene = useScene();
  const text = scene.text as Record<string, string | string[]>;
  const chain = text.chain as string[];

  const pLabel = useProgress('label', 0.6);
  const pCalendar = useProgress('calendarIn', 1.0);
  const pDec = useProgress('decHighlight', 0.8);
  const c1 = useProgress('chain1', 0.5);
  const c2 = useProgress('chain2', 0.5);
  const c3 = useProgress('chain3', 0.5);
  const pStamp = useProgress('stampIn', 0.55, EASE.soft);
  const pCheck = useProgress('checkDraw', 0.9);
  const pReassure = useProgress('reassure', 1.2);

  const stampScale = 0.86 + 0.14 * pStamp;

  return (
    <AbsoluteFill>
      <Stage>
        {/* December is still December */}
        <g transform="translate(210 250)">
          <WallCalendar
            progress={pCalendar}
            month={cycle.performanceCloseShort}
            width={380}
            height={330}
            accent={colors.success}
            seed={47}
            markDay={25}
            markProgress={pDec}
            markColor={colors.success}
          />
        </g>

        <WriteOnG progress={pReassure} x={110} y={636} width={580} height={84}>
          <text
            x={400}
            y={696}
            textAnchor="middle"
            fill={colors.textSoft}
            style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 42}}
          >
            {text.reassure as string}
          </text>
        </WriteOnG>

        {/* PERFORMANCE APPRAISAL -> DECEMBER -> CYCLE CLOSES */}
        <g transform="translate(1250 236)">
          <Chain
            steps={[
              {label: chain[0], color: colors.primary},
              {label: chain[1], color: colors.success, solid: true},
              {label: chain[2], color: colors.primary},
            ]}
            progress={[c1, c2, c3]}
            width={640}
            boxHeight={80}
            arrowGap={42}
            fontSize={30}
            seed={580}
          />
        </g>

        {/* NO CHANGE stamp */}
        <g transform={`translate(1108 758) rotate(-5) scale(${stampScale})`} opacity={pStamp}>
          <rect x={-410} y={-92} width={820} height={184} rx={16} fill={colors.success} opacity={0.1} />
          <DrawPath
            d={roughRect(-410, -92, 820, 184, 690)}
            progress={pStamp}
            stroke={colors.success}
            strokeWidth={sketch.strokeWidth + 2}
          />
          <g transform="translate(-306 4) scale(0.62)">
            <CheckMark progress={pCheck} size={120} color={colors.success} ring={false} seed={396} />
          </g>
          <text
            x={64}
            y={-24}
            textAnchor="middle"
            fill={colors.textSoft}
            style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 30, letterSpacing: 3}}
          >
            {text.stampSub as string}
          </text>
          <text
            x={64}
            y={52}
            textAnchor="middle"
            fill={colors.success}
            style={{fontFamily: fonts.body, fontWeight: 900, fontSize: 76, letterSpacing: 5}}
          >
            {text.stamp as string}
          </text>
        </g>
      </Stage>
      <SceneLabel text={text.label as string} progress={pLabel} color={colors.success} />
    </AbsoluteFill>
  );
};
