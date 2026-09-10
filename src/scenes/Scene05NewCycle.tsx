/**
 * SCENE 5 - THE NEW TIMING (the heart of the video)
 *
 * A big JAN -> FEB -> MAR -> APR rail runs across the top and stays put.
 * March lights up and the BONUS card builds; April lights up and the MERIT
 * card builds beside it, so both key dates end the scene on screen together.
 */
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Stage} from '../components/SceneTransition';
import {SceneLabel} from '../components/SceneLabel';
import {Timeline} from '../components/Timeline';
import {CoinStack, MeritArrow} from '../components/SalaryIcon';
import {DrawPath, WriteOnG} from '../components/Draw';
import {roughRect, roughArrowDown} from '../lib/rough';
import {useProgress, useScene, EASE} from '../lib/timing';
import {colors, fonts, sketch} from '../lib/theme';
import {months, cycle} from '../config/copy';

const CARD_W = 700;
const CARD_H = 348;
const CARD_Y = 452;

/** One of the two big "what changes" cards. */
const KeyCard: React.FC<{
  x: number;
  panel: number;
  title: string;
  titleColor: string;
  icon: React.ReactNode;
  arrow1: number;
  line1: string;
  line1Progress: number;
  arrow2?: number;
  line2?: string;
  line2Progress?: number;
  seed: number;
}> = ({x, panel, title, titleColor, icon, arrow1, line1, line1Progress, arrow2 = 0, line2, line2Progress = 0, seed}) => {
  // A one-line card centres its stack; a two-line card starts higher to fit both.
  const top = line2 ? 74 : 118;
  const L = {
    title: top,
    arrowFrom: top + 34,
    arrowLen: 44,
    box: top + 96,
    boxH: 74,
    arrow2From: top + 184,
    arrow2Len: 34,
    line2: top + 262,
  };
  return (
  <g transform={`translate(${x} ${CARD_Y})`} opacity={panel}>
    <rect width={CARD_W} height={CARD_H} rx={18} fill={colors.surface} opacity={0.92} />
    <rect width={CARD_W} height={CARD_H} rx={18} fill={titleColor} opacity={0.06} />
    <DrawPath d={roughRect(0, 0, CARD_W, CARD_H, seed)} progress={panel} stroke={titleColor} strokeWidth={sketch.strokeWidth} />

    <g transform={`translate(${CARD_W / 2 - 146} ${L.title - 12})`}>{icon}</g>
    <text
      x={CARD_W / 2 + 80}
      y={L.title + 2}
      textAnchor="middle"
      fill={titleColor}
      opacity={panel}
      style={{fontFamily: fonts.body, fontWeight: 900, fontSize: 52, letterSpacing: 4}}
    >
      {title}
    </text>

    <DrawPath
      d={roughArrowDown(CARD_W / 2, L.arrowFrom, L.arrowLen, seed + 5)}
      progress={arrow1}
      stroke={colors.textSoft}
      strokeWidth={3.4}
    />

    <g opacity={line1Progress}>
      <rect
        x={CARD_W / 2 - 300}
        y={L.box}
        width={600}
        height={L.boxH}
        rx={10}
        fill={titleColor}
        opacity={0.14}
      />
      <text
        x={CARD_W / 2}
        y={L.box + 52}
        textAnchor="middle"
        fill={titleColor}
        style={{fontFamily: fonts.body, fontWeight: 900, fontSize: 44, letterSpacing: 2}}
      >
        {line1}
      </text>
    </g>

    {line2 && (
      <>
        <DrawPath
          d={roughArrowDown(CARD_W / 2, L.arrow2From, L.arrow2Len, seed + 9)}
          progress={arrow2}
          stroke={colors.textSoft}
          strokeWidth={3}
        />
        <g opacity={line2Progress}>
          <text
            x={CARD_W / 2}
            y={L.line2}
            textAnchor="middle"
            fill={colors.text}
            style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 33, letterSpacing: 1.4}}
          >
            {line2}
          </text>
        </g>
      </>
    )}
  </g>
  );
};

export const Scene05NewCycle: React.FC = () => {
  const scene = useScene();
  const text = scene.text as Record<string, string>;

  const pLabel = useProgress('label', 0.6);
  const pRail = useProgress('railDraw', 1.1);
  const pStops = useProgress('monthsIn', 1.0);
  const pShift = useProgress('shiftNote', 0.9);

  const pMarch = useProgress('marchHighlight', 0.7);
  const pBonusCard = useProgress('bonusCard', 0.6);
  const pBonusArrow = useProgress('bonusArrow', 0.45);
  const pBonusPayroll = useProgress('bonusPayroll', 0.5);

  const pApril = useProgress('aprilHighlight', 0.7);
  const pMeritCard = useProgress('meritCard', 0.6);
  const pMeritArrow = useProgress('meritArrow', 0.45);
  const pMeritEff = useProgress('meritEffective', 0.5);
  const pPayrollArrow = useProgress('payrollArrow', 0.45);
  const pPayrollCard = useProgress('payrollCard', 0.5);

  // The bonus card starts centred and slides left to make room for merit.
  const spread = useProgress('meritCard', 0.9, EASE.soft);
  const bonusX = interpolate(spread, [0, 1], [(1920 - CARD_W) / 2, 190]);
  const meritX = 1920 - 190 - CARD_W;

  const stops = [
    {label: months[0]},
    {label: months[1]},
    {label: months[2]},
    {label: months[3], sub: cycle.meritEffectiveDate},
  ];

  return (
    <AbsoluteFill>
      <Stage>
        {/* old -> new window note */}
        <WriteOnG progress={pShift} x={320} y={140} width={1280} height={72}>
          <text
            x={960}
            y={192}
            textAnchor="middle"
            fill={colors.textSoft}
            style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 33, letterSpacing: 1.4}}
          >
            {text.shiftNote}
          </text>
        </WriteOnG>

        {/* The rail */}
        <g transform="translate(420 320)">
          <Timeline
            stops={stops}
            width={1080}
            railProgress={pRail}
            stopsProgress={pStops}
            highlights={[
              {index: 2, progress: pMarch},
              {index: 3, progress: pApril},
            ]}
            highlightColor={colors.accent}
            overshoot={92}
            labelSize={52}
            seed={95}
          />
        </g>

        <KeyCard
          x={bonusX}
          panel={pBonusCard}
          title={text.bonus}
          titleColor={colors.accent}
          icon={
            <g transform="translate(0 -8) scale(0.72)">
              <CoinStack progress={pBonusCard} seed={306} />
            </g>
          }
          arrow1={pBonusArrow}
          line1={text.bonusTarget}
          line1Progress={pBonusPayroll}
          seed={640}
        />

        <KeyCard
          x={meritX}
          panel={pMeritCard}
          title={text.merit}
          titleColor={colors.success}
          icon={
            <g transform="translate(0 6) scale(0.78)">
              <MeritArrow progress={pMeritCard} seed={346} />
            </g>
          }
          arrow1={pMeritArrow}
          line1={text.meritTarget}
          line1Progress={pMeritEff}
          arrow2={pPayrollArrow}
          line2={`REFLECTED IN ${text.salaryTarget}`}
          line2Progress={pPayrollCard}
          seed={660}
        />
      </Stage>
      <SceneLabel text={text.label} progress={pLabel} color={colors.accent} />
    </AbsoluteFill>
  );
};
