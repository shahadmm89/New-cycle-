/**
 * SCENE 8 - WHY THIS HELPS
 * Two simple before -> after rows and one alignment icon. Nothing else.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage} from '../components/SceneTransition';
import {SceneLabel} from '../components/SceneLabel';
import {MorphRow} from '../components/Chain';
import {AlignIcon} from '../components/SalaryIcon';
import {WriteOnG} from '../components/Draw';
import {useProgress, useScene} from '../lib/timing';
import {colors, fonts} from '../lib/theme';

export const Scene08Benefits: React.FC = () => {
  const scene = useScene();
  const text = scene.text as Record<string, string | string[]>;

  const pLabel = useProgress('label', 0.6);
  const a1 = useProgress('row1From', 0.55);
  const a2 = useProgress('row1Arrow', 0.6);
  const a3 = useProgress('row1To', 0.55);
  const b1 = useProgress('row2From', 0.55);
  const b2 = useProgress('row2Arrow', 0.6);
  const b3 = useProgress('row2To', 0.55);
  const pAlign = useProgress('alignIcon', 0.9);
  const t1 = useProgress('takeaway1', 0.7);
  const t2 = useProgress('takeaway2', 0.7);

  return (
    <AbsoluteFill>
      <Stage>
        <g transform="translate(250 222)">
          <MorphRow
            from={text.row1From}
            to={text.row1To}
            fromProgress={a1}
            arrowProgress={a2}
            toProgress={a3}
            width={1420}
            cardWidth={520}
            height={138}
            fromColor={colors.neutral}
            toColor={colors.primary}
            fontSize={32}
            seed={630}
          />
        </g>

        <g transform="translate(250 412)">
          <MorphRow
            from={text.row2From}
            to={text.row2To}
            fromProgress={b1}
            arrowProgress={b2}
            toProgress={b3}
            width={1420}
            cardWidth={520}
            height={138}
            fromColor={colors.neutral}
            toColor={colors.secondary}
            fontSize={32}
            seed={670}
          />
        </g>

        <g transform="translate(668 716) scale(1.02)">
          <AlignIcon progress={pAlign} seed={404} />
        </g>

        <WriteOnG progress={t1} x={790} y={636} width={660} height={82}>
          <text
            x={790}
            y={704}
            fill={colors.text}
            style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 48}}
          >
            {text.takeaway1 as string}
          </text>
        </WriteOnG>
        <WriteOnG progress={t2} x={790} y={722} width={700} height={82}>
          <text
            x={790}
            y={790}
            fill={colors.primary}
            style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 48}}
          >
            {text.takeaway2 as string}
          </text>
        </WriteOnG>
      </Stage>
      <SceneLabel text={text.label as string} progress={pLabel} />
    </AbsoluteFill>
  );
};
