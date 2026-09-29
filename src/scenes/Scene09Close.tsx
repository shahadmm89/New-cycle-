/**
 * SCENE 9 - FINAL MESSAGE
 *
 * Just where to go for clarification, the contact and the logo. Nothing about
 * the cycle is repeated here; it would only dilute the frame people are meant
 * to hold on to.
 */
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Label, Display, Rise, Body} from '../components/Type';
import {Plinth} from '../components/Card3D';
import {useProgress, useScene} from '../lib/timing';
import {colors, brand} from '../lib/theme';

export const Scene09Close: React.FC = () => {
  const scene = useScene();
  const t = scene.text as Record<string, string>;

  const pQ = useProgress('questionsIn', 0.7);
  const pContact = useProgress('contactIn', 0.6);
  const pLogo = useProgress('logoIn', 0.6);

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, marginTop: -40}}>
        <Rise progress={pQ} distance={34}>
          <Display size={96} color={colors.text}>{t.questions}</Display>
        </Rise>

        <Plinth progress={pQ} width={900} color={colors.accent} style={{marginTop: 4}} />

        <Rise progress={pContact} distance={26} style={{marginTop: 10}}>
          <Label size={48} color={colors.accent}>{t.sub}</Label>
        </Rise>

        <Rise progress={pContact} distance={20} style={{marginTop: 16}}>
          <Body size={30} color={colors.textSoft} style={{letterSpacing: 2.4}}>
            {brand.hrContact} &nbsp;·&nbsp; {brand.hrPortal}
          </Body>
        </Rise>

        <div
          style={{
            marginTop: 58,
            opacity: pLogo,
            transform: `translate3d(0, ${(1 - pLogo) * 18}px, 0)`,
          }}
        >
          {brand.logoSrc ? (
            <Img src={staticFile(brand.logoSrc)} style={{height: 76, objectFit: 'contain'}} />
          ) : (
            <div
              style={{
                border: `2px dashed ${colors.line}`,
                borderRadius: 12,
                padding: '18px 34px',
                color: colors.muted,
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: 2.4,
              }}
            >
              {brand.logoPlaceholderLabel}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
