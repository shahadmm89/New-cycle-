/**
 * A worked example, written as a formula and built one term at a time:
 *
 *   10,000  ×  60%  ÷ 12  × 3  =  SAR 1,500
 *   BASIC      ALLOWANCE %       MONTHS
 *
 * Terms can carry a small caption underneath, so each number says what it is
 * without a sentence of explanation. The result is the only coloured term.
 */
import React from 'react';
import {colors, fonts} from '../lib/theme';

const clamp = (n: number) => Math.min(1, Math.max(0, n));

export type FormulaTerm = {
  text: string;
  caption?: string;
  /** The answer: coloured and slightly larger. */
  result?: boolean;
  /** An operator: quieter than the numbers. */
  op?: boolean;
};

export const Formula: React.FC<{
  terms: FormulaTerm[];
  /** 0 -> 1: terms arrive left to right. */
  progress: number;
  size?: number;
  resultColor?: string;
}> = ({terms, progress, size = 48, resultColor = colors.accent}) => {
  const p = clamp(progress);
  const n = terms.length;
  return (
    <div style={{display: 'flex', alignItems: 'flex-start', gap: size * 0.38}}>
      {terms.map((term, i) => {
        const local = clamp(p * (n + 1.5) - i);
        return (
          <div
            key={`${term.text}-${i}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: local,
              transform: `translate3d(0, ${(1 - local) * 14}px, 0)`,
            }}
          >
            <div
              style={{
                fontFamily: fonts.display,
                fontWeight: 800,
                fontSize: term.result ? size * 1.12 : term.op ? size * 0.82 : size,
                lineHeight: `${size * 1.15}px`,
                letterSpacing: -size * 0.01,
                color: term.result ? resultColor : term.op ? colors.textSoft : colors.text,
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {term.text}
            </div>
            {term.caption ? (
              <div
                style={{
                  marginTop: 6,
                  fontFamily: fonts.body,
                  fontWeight: 700,
                  fontSize: Math.max(14, size * 0.3),
                  letterSpacing: 1.6,
                  color: term.result ? resultColor : colors.muted,
                  whiteSpace: 'nowrap',
                }}
              >
                {term.caption}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
