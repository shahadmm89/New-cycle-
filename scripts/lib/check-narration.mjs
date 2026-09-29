#!/usr/bin/env node
/**
 * The narration must be the client's text VERBATIM - wording under separate
 * review, so nothing is "fixed" here except the two spellings the client asked
 * to be corrected for pronunciation, and the current-cycle line they added. This compares every voice line's
 * `text`, in order, against the supplied script. (`spoken` may differ only to
 * steer pronunciation: YASREF, 2027, 15, HR.)
 */
import {loadConfig, flatVoiceLines} from './config.mjs';

const SUPPLIED = [
  'YASREF will change the salary merit and promotion effectiveness update from January to April, changing only the timing in alignment with market best practices.',
  // Added at the client's request: the current cycle is said on the wheel.
  'The current cycle runs from January to December.',
  "Here's the new proposed cycle.",
  'The bonus will be paid in March.',
  'In April, merit increases and promotion action will be reflected.',
  'During the transition year, this transition applies to the 2027 implementation year only.',
  'For leave balance, you will receive a three-month balance in January.',
  'And from April 2027, a new annual balance begins, based on the updated grades.',
  // Two spellings corrected at the client's request so they are pronounced
  // naturally: allawance -> allowance, whete -> where.
  'And the same will applied on the vacation allowance where the basic salary paid for 3 months and from April will reflect the new basic salary.',
  'Comes to the merit, it will cover 15 months, while the percentage itself does not change \u2014 only the months.',
  'For further clarification, contact HR personnel.',
];

// Phrases may be split for pacing (the opening is said as four), so compare
// the whole script as one text rather than line by line.
const norm = (a) => a.join(' ').replace(/\s+/g, ' ').trim();
const have = norm(flatVoiceLines(loadConfig()).map((l) => l.text));
const want = norm(SUPPLIED);
if (have !== want) {
  const at = [...want].findIndex((ch, i) => have[i] !== ch);
  console.log(`narration differs at character ${at}:\n  want: ...${want.slice(Math.max(0, at - 40), at + 60)}\n  have: ...${have.slice(Math.max(0, at - 40), at + 60)}`);
  process.exit(1);
}
process.exit(0);
