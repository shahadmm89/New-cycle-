/**
 * SCENE 9 - HR CLOSING
 * Colleagues with questions, an HR colleague ready to answer, and the
 * placeholders HR replaces before publishing.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage} from '../components/SceneTransition';
import {Employee, Bubble} from '../components/Employee';
import {DrawPath, WriteOnG} from '../components/Draw';
import {roughRect} from '../lib/rough';
import {useProgress, useIdle, useScene} from '../lib/timing';
import {colors, fonts, brand} from '../lib/theme';

export const Scene09Closing: React.FC = () => {
  const scene = useScene();
  const text = scene.text as Record<string, string>;

  const pPeople = useProgress('peopleIn', 0.9);
  const pBubbles = useProgress('bubbles', 0.6);
  const pHr = useProgress('hrIn', 0.8);
  const pHrBubble = useProgress('hrBubble', 0.5);
  const pHeadline = useProgress('headline', 0.9);
  const pContact = useProgress('contact', 0.8);

  const bob1 = useIdle(0.3, 4, 0);
  const bob2 = useIdle(0.27, 4, 0.35);
  const bob3 = useIdle(0.33, 4, 0.7);
  const bobHr = useIdle(0.24, 5, 0.2);

  const crowd = [
    {x: 268, scale: 0.6, shirt: colors.secondary, hair: 'bun' as const, seed: 11, bob: bob1},
    {x: 434, scale: 0.66, shirt: colors.primary, hair: 'curly' as const, seed: 6, bob: bob2},
    {x: 604, scale: 0.62, shirt: colors.accent, hair: 'bob' as const, seed: 14, bob: bob3},
  ];

  return (
    <AbsoluteFill>
      <Stage>
        {/* Colleagues with questions */}
        {crowd.map((c, i) => (
          <g key={c.x}>
            <g transform={`translate(${c.x} 812) scale(${c.scale})`}>
              <Employee progress={pPeople} pose="neutral" shirt={c.shirt} hair={c.hair} seed={c.seed} bob={c.bob} />
            </g>
            {/* centred over the head, whatever the figure's scale */}
            <g transform={`translate(${c.x - 42} ${812 - c.scale * 352 - 124 + c.bob})`} opacity={pBubbles}>
              <Bubble progress={pBubbles} width={84} height={70} tail="bottom" seed={20 + i}>
                <text
                  x={42}
                  y={52}
                  textAnchor="middle"
                  fill={colors.primary}
                  style={{fontFamily: fonts.hand, fontWeight: 700, fontSize: 46}}
                >
                  ?
                </text>
              </Bubble>
            </g>
          </g>
        ))}

        {/* HR colleague */}
        <g transform={`translate(852 838) scale(0.86)`}>
          <Employee progress={pHr} pose="wave" shirt={colors.primary} hair="short" seed={2} bob={bobHr} />
        </g>
        <g transform={`translate(674 ${296 + bobHr})`} opacity={pHrBubble}>
          <Bubble progress={pHrBubble} width={356} height={104} tail="bottom" seed={31}>
            <text
              x={178}
              y={68}
              textAnchor="middle"
              fill={colors.text}
              style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 36}}
            >
              {text.hrBubble}
            </text>
          </Bubble>
        </g>

        {/* Message */}
        <WriteOnG progress={pHeadline} x={1090} y={264} width={720} height={110}>
          <text
            x={1096}
            y={352}
            fill={colors.text}
            style={{fontFamily: fonts.body, fontWeight: 900, fontSize: 74}}
          >
            {text.headline}
          </text>
        </WriteOnG>
        <WriteOnG progress={pHeadline} x={1090} y={378} width={720} height={80}>
          <text
            x={1096}
            y={438}
            fill={colors.primary}
            style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 50}}
          >
            {text.sub}
          </text>
        </WriteOnG>

        {/* HR contact placeholders */}
        <g opacity={pContact}>
          <rect x={1090} y={506} width={700} height={272} rx={16} fill={colors.surface} opacity={0.9} />
          <DrawPath d={roughRect(1090, 506, 700, 272, 810)} progress={pContact} stroke={colors.line} strokeWidth={2.6} />
          {[
            {k: 'Contact', v: brand.hrContactName},
            {k: 'Email', v: brand.hrEmail},
            {k: 'Portal', v: brand.hrPortal},
          ].map((row, i) => (
            <g key={row.k}>
              <text
                x={1132}
                y={578 + i * 78}
                fill={colors.textSoft}
                style={{fontFamily: fonts.body, fontWeight: 700, fontSize: 26, letterSpacing: 2}}
              >
                {row.k.toUpperCase()}
              </text>
              <text
                x={1330}
                y={578 + i * 78}
                fill={colors.text}
                style={{fontFamily: fonts.body, fontWeight: 800, fontSize: 32}}
              >
                {row.v}
              </text>
            </g>
          ))}
        </g>
      </Stage>
    </AbsoluteFill>
  );
};
