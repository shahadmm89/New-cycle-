#!/usr/bin/env node
/**
 * The narration must be the client's text VERBATIM - wording under separate
 * review, so not even a typo is "fixed" here. This compares every voice line's
 * `text`, in order, against the supplied script. (`spoken` may differ only to
 * steer pronunciation: YASREF, 2027, 15, HR.)
 */
import {loadConfig, flatVoiceLines} from './config.mjs';

const SUPPLIED = [
  'YASREF will change the salary merit and promotion effectiveness update from January to April, changing only the timing in alignment with market best practices.',
  "Here's the new proposed cycle.",
  'The bonus will be paid in March.',
  'In April, merit increases and promotion action will be reflected.',
  'During the transition year, this transition applies to the 2027 implementation year only.',
  'For leave balance, you will receive a three-month balance in January.',
  'And from April 2027, a new annual balance begins, based on the updated grades.',
  'And the same will applied on the vacation allawance whete the basic salary paid for 3 months and from April will reflect the new basic salary.',
  'Comes to the merit, it will cover 15 months, while the percentage itself does not change \u2014 only the months.',
  'For further clarification, contact HR personnel.',
];

const got = flatVoiceLines(loadConfig()).map((l) => l.text);
let ok = got.length === SUPPLIED.length;
SUPPLIED.forEach((want, i) => {
  if (got[i] !== want) {
    ok = false;
    console.log(`line ${i + 1} differs:\n  want: ${want}\n  have: ${got[i]}`);
  }
});
process.exit(ok ? 0 : 1);
