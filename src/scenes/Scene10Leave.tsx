/**
 * SCENE 10 - LEAVE BALANCE IN THE TRANSITION
 *
 * The same changeover, applied to annual leave, shown rather than said:
 *
 *   JANUARY 2027 - first 3 months only        ->   APRIL 2027
 *     GRADE 9 & BELOW    22 ÷ 12 × 3  ≈ 6 DAYS      NEW ANNUAL LEAVE BALANCE
 *     GRADE 10 & ABOVE   30 ÷ 12 × 3  ≈ 8 DAYS      based on April grade code
 *
 * The narration only names the subject and the April start; the arithmetic is
 * read off the card, one term at a time, in the same language as the
 * implementation-year working in scene 9.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Card3D} from '../components/Card3D';
import {Display, Label, Rise, Chip} from '../components/Type';
import {useProgress, useScene} from '../lib/timing';
import {colors} from '../lib/theme';
import {leave} from '../config/copy';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** One grade's working. The result arrives a beat after the sum, as in scene 9. */
const LeaveRow: React.FC<{grade: string; working: string; result: string; progress: number; resultProgress: number}> = ({
  grade,
  working,
  result,
  progress,
  resultProgress,
}) => {
  const p = clamp(progress);
  const r = clamp(resultProgress);
  return (
    <div style={{opacity: p, transform: `translate3d(0, ${(1 - p) * 18}px, 0)`}}>
      <Label size={23} color={colors.textSoft}>{grade}</Label>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 30, marginTop: 8}}>
        <Display size={60} color={colors.text}>{working}</Display>
        <div style={{opacity: r, transform: `translate3d(${(1 - r) * -16}px, 0, 0)`}}>
          <Display size={60} color={colors.primary}>{result}</Display>
        </div>
      </div>
    </div>
  );
};

export const Scene10Leave: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pLabel = useProgress('labelIn', 0.5);
  const pJan = useProgress('janCard', 0.7);
  const pRow1 = useProgress('row1', 0.6);
  const pRow1Result = useProgress('row1Result', 0.5);
  const pRow2 = useProgress('row2', 0.6);
  const pRow2Result = useProgress('row2Result', 0.5);
  const pArrow = useProgress('arrow', 0.5);
  const pApr = useProgress('aprCard', 0.8);
  const pBasis = useProgress('basisIn', 0.6);

  const [row1, row2] = leave.rows;

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 120, top: 96}}>
        <Rise progress={pLabel} distance={22}>
          <Label size={30} color={colors.primary}>{t.label}</Label>
        </Rise>
      </div>

      {/* January 2027: only the first three months */}
      <div style={{position: 'absolute', left: 120, top: 196}}>
        <Card3D progress={pJan} width={820} height={520} rotateY={4} accent={colors.primary} padding={46}>
          <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Display size={72} color={colors.text}>{t.janWhen}</Display>
            <div style={{marginTop: 18}}>
              <Chip color={colors.primary} filled={false} size={24}>{t.janWhat}</Chip>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 30, marginTop: 'auto'}}>
              <LeaveRow {...row1} progress={pRow1} resultProgress={pRow1Result} />
              <LeaveRow {...row2} progress={pRow2} resultProgress={pRow2Result} />
            </div>
          </div>
        </Card3D>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 986,
          top: 400,
          opacity: pArrow,
          transform: `translate3d(${(1 - pArrow) * -20}px, 0, 0)`,
        }}
      >
        <Display size={80} color={colors.accent}>&rarr;</Display>
      </div>

      {/* April 2027: the new annual balance */}
      <div style={{position: 'absolute', left: 1100, top: 236}}>
        <Card3D progress={pApr} width={700} height={440} rotateY={-5} accent={colors.accent} padding={46}>
          <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Display size={80} color={colors.accent} glow>{t.aprWhen}</Display>
            <Display size={54} color={colors.text} style={{marginTop: 22, whiteSpace: 'normal', lineHeight: 1.05}}>
              {t.aprWhat}
            </Display>
            <Rise progress={pBasis} distance={16} style={{marginTop: 'auto'}}>
              <Label size={24} color={colors.textSoft}>{t.aprBasis}</Label>
            </Rise>
          </div>
        </Card3D>
      </div>
    </AbsoluteFill>
  );
};
