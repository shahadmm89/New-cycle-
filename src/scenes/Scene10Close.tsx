/**
 * SCENE 10 - FINAL MESSAGE
 * The range, the three anchors, the offer of help, the logo. Quick.
 */
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {RangePlate} from '../components/MonthRail';
import {Label, Display, Rise, Body} from '../components/Type';
import {Plinth} from '../components/Card3D';
import {useProgress, useScene} from '../lib/timing';
import {colors, brand} from '../lib/theme';
import {anchors} from '../config/copy';

export const Scene10Close: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pCycle = useProgress('cycleIn', 0.7);
  const pAnchors = useProgress('anchorsIn', 1.1);
  const pQ = useProgress('questionsIn', 0.6);
  const pContact = useProgress('contactIn', 0.6);
  const pLogo = useProgress('logoIn', 0.6);

  return (
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 92}}>
      <Rise progress={pCycle} distance={30}>
        <Label size={28} color={colors.textSoft}>{t.cycleLabel}</Label>
      </Rise>
      <div style={{marginTop: 22}}>
        <RangePlate progress={pCycle} from="APR" to="MAR" size={140} />
      </div>
      <Plinth progress={pCycle} width={760} color={colors.accent} style={{marginTop: 22}} />

      {/* The three anchors, one line each. */}
      <div style={{display: 'flex', gap: 30, marginTop: 54}}>
        {anchors.map((a, i) => {
          const p = Math.min(1, Math.max(0, pAnchors * 3.4 - i));
          const tone = a.tone === 'steady' ? colors.steady : colors.accent;
          return (
            <div
              key={a.month}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                opacity: p,
                transform: `translate3d(0, ${(1 - p) * 30}px, 0)`,
                width: 420,
              }}
            >
              <Display size={54} color={tone}>{a.month}</Display>
              <div style={{width: 68, height: 4, borderRadius: 2, background: tone, opacity: 0.75}} />
              <Body size={28} weight={700} color={colors.text} style={{textAlign: 'center', letterSpacing: 1.4}}>
                {a.what}
              </Body>
            </div>
          );
        })}
      </div>

      <div style={{marginTop: 58, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        <Rise progress={pQ} distance={26}>
          <Display size={68} color={colors.text}>{t.questions}</Display>
        </Rise>
        <Rise progress={pContact} distance={22}>
          <Label size={34} color={colors.primary}>{t.sub}</Label>
        </Rise>
        <Rise progress={pContact} distance={18} style={{marginTop: 12}}>
          <Body size={28} color={colors.textSoft} style={{letterSpacing: 2}}>
            {brand.hrContact} &nbsp;·&nbsp; {brand.hrPortal}
          </Body>
        </Rise>
      </div>

      {/* Logo lands last, in the flow so it can never collide with the
          contact line above it. */}
      <div
        style={{
          marginTop: 42,
          opacity: pLogo,
          transform: `translate3d(0, ${(1 - pLogo) * 18}px, 0)`,
        }}
      >
        {brand.logoSrc ? (
          <Img src={staticFile(brand.logoSrc)} style={{height: 72, objectFit: 'contain'}} />
        ) : (
          <div
            style={{
              border: `2px dashed ${colors.line}`,
              borderRadius: 12,
              padding: '16px 30px',
              color: colors.muted,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 2,
            }}
          >
            {brand.logoPlaceholderLabel}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
