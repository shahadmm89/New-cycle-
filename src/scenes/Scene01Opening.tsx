/**
 * SCENE 1 - OPENING
 * A colleague, a calendar and the question the video answers.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage} from '../components/SceneTransition';
import {Employee, Bubble} from '../components/Employee';
import {WallCalendar, MonthStrip} from '../components/Calendar';
import {WriteOnG} from '../components/Draw';
import {useProgress, useIdle, useScene} from '../lib/timing';
import {colors, fonts} from '../lib/theme';
import {videoTitle} from '../config/copy';

/** JAN -> FEB -> MAR -> APR -> ... -> DEC, exactly as the storyboard asks. */
const STRIP = ['JAN', 'FEB', 'MAR', 'APR', '···', 'DEC'];

export const Scene01Opening: React.FC = () => {
  const scene = useScene();
  const text = scene.text as Record<string, string>;

  const pEmployee = useProgress('employeeDraw', 1.1);
  const pCalendar = useProgress('calendarDraw', 1.2);
  const pMonths = useProgress('monthsIn', 1.4);
  const pHeadline = useProgress('headline', 1.5);
  const pBubble = useProgress('thoughtBubble', 0.5);
  const pTitle = useProgress('titleCard', 0.8);
  const bob = useIdle(0.28, 5);

  return (
    <AbsoluteFill>
      <Stage>
        {/* Headline */}
        <WriteOnG progress={pHeadline} x={120} y={150} width={1690} height={140}>
          <text
            x={960}
            y={232}
            textAnchor="middle"
            fill={colors.text}
            style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 62, letterSpacing: -0.5}}
          >
            {text.headline}
          </text>
        </WriteOnG>
        <g opacity={pTitle}>
          <text
            x={960}
            y={300}
            textAnchor="middle"
            fill={colors.primary}
            style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 46}}
          >
            {text.kicker}
          </text>
        </g>

        {/* Calendar */}
        <g transform="translate(1090 400)">
          <WallCalendar progress={pCalendar} month="JAN" width={400} height={330} accent={colors.primary} seed={41} />
        </g>

        {/* Month strip under the calendar */}
        <g transform="translate(1010 810)">
          <MonthStrip months={STRIP} reveal={pMonths} width={560} fontSize={30} seed={64} />
        </g>

        {/* Employee */}
        <g transform="translate(430 840) scale(0.95)">
          <Employee progress={pEmployee} pose="curious" shirt={colors.secondary} hair="short" seed={4} bob={bob} />
        </g>

        {/* Thought bubble */}
        <g transform="translate(520 372)">
          <Bubble progress={pBubble} width={190} height={124} tail="left" seed={9}>
            <text
              x={95}
              y={90}
              textAnchor="middle"
              fill={colors.primary}
              style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 84}}
            >
              ?
            </text>
          </Bubble>
        </g>

        {/* Programme title, small and quiet */}
        <g opacity={pTitle * 0.9}>
          <text
            x={130}
            y={110}
            fill={colors.textSoft}
            style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: 3}}
          >
            {videoTitle.toUpperCase()}
          </text>
        </g>
      </Stage>
    </AbsoluteFill>
  );
};
