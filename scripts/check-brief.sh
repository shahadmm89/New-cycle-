#!/usr/bin/env bash
#
# THE BRIEF, AS A TEST
# --------------------
#     npm run check:brief
#
# Every line the client asked for, checked against what is actually in the repo.
# It exists because this film has been revised many times, and each revision
# carried a list of specific requirements - an exact closing line, a
# terminology correction, a label that must appear, a line that must NOT.
# Re-reading every brief by hand before each change is how one of them
# silently gets dropped. This version holds the latest brief: purpose first,
# timing only / benefits unchanged, the current and new cycles, the 2026
# transition, leave balance, and the HR contact line.
#
# A failure here is not a style opinion. It means a stated requirement is no
# longer met.
#
# Run it before any render, and after any edit to the script or the copy.
#
set -u
cd /home/user/New-cycle-
ok(){ printf '  PASS  %s\n' "$1"; }
no(){ printf '  FAIL  %s\n' "$1"; FAILED=1; }
FAILED=0
chk(){ if eval "$2" >/dev/null 2>&1; then ok "$1"; else no "$1"; fi; }

# Facts that live in compiled config rather than in greppable text.
fact(){ node --input-type=module -e "import {loadConfig} from './scripts/lib/config.mjs'; const c = loadConfig(); const lines = c.scenes.flatMap((s) => s.voice); $1" ; }

echo "STORY AND NARRATION"
chk "flow: opening > cycle > March > April > 2027 > leave > allowance > merit > HR" "fact \"process.exit(c.scenes.map((s) => s.id).join(',') === 'hook,cycle,march,april,transition,leave,allowance,merit,close' ? 0 : 1)\""
chk "narration is EXACTLY the supplied text, in order"   "node scripts/lib/check-narration.mjs"
chk "closing line exact"                                 "grep -q \"text: 'For further clarification, contact HR personnel.'\" src/config/scenes.ts"
chk "no narration line repeated"                         "fact \"process.exit(new Set(lines.map((l) => l.text.toLowerCase())).size === lines.length ? 0 : 1)\""

echo; echo "OPENING"
chk "opening: title, subtitle, supporting line only"    "fact \"const t = c.scenes[0].text; process.exit(t.headlinePre === '' && t.headlineKey === 'SALARY MERIT & PROMOTION\\\\nEFFECTIVENESS UPDATE' && t.headlinePost === 'January \\u2192 April' && t.sub === 'Aligned with market best practices' ? 0 : 1)\""
chk "opening is a title slide before the narration"      "fact \"const h = c.scenes[0]; process.exit(Math.max(h.beats.highlightPhrase, h.beats.postIn, h.beats.subIn) < h.voice[0].start ? 0 : 1)\""
chk "no bonus / leave / 15 months on the opening"        "fact \"process.exit(/BONUS|LEAVE|15|MONTHS/i.test(JSON.stringify(c.scenes[0].text)) ? 1 : 0)\""

echo; echo "VISUALS"
chk "the cycle wheel exists, with the programme hub"     "test -f src/components/CycleWheel.tsx && grep -q \"centre = \\['ANNUAL', 'SALARY', 'PROGRAM'\\]\" src/components/CycleWheel.tsx"
chk "the wheel recurs: scenes 2-8 all draw it"           "for f in Scene02Cycle Scene03March Scene04April Scene05Transition Scene06Leave Scene07Allowance Scene08Merit; do grep -q '<CycleWheel' src/scenes/\$f.tsx || exit 1; done"
chk "JAN lit at the start, turning to APR (3 months)"    "grep -q 'rotation={spin \* APRIL}' src/scenes/Scene02Cycle.tsx && grep -q 'const APRIL = 3;' src/scenes/Scene02Cycle.tsx"
chk "no arrows: the month lifts out of the wheel instead" "! grep -q '<Pointer' src/scenes/*.tsx && grep -q 'lift={' src/scenes/Scene03March.tsx && grep -q 'lift={' src/scenes/Scene04April.tsx"
chk "MARCH = BONUS PAID"                                 "grep -q \"month: 'MARCH', what: 'BONUS PAID'\" src/config/scenes.ts"
chk "APRIL = MERIT INCREASES + PROMOTION ACTION"         "grep -q \"merit: 'MERIT INCREASES',\" src/config/scenes.ts && grep -q \"promotion: 'PROMOTION ACTION',\" src/config/scenes.ts"
chk "transition timeline in scenes 5-7"                  "for f in Scene05Transition Scene06Leave Scene07Allowance; do grep -q '<TransitionTimeline' src/scenes/\$f.tsx || exit 1; done"
chk "timeline: 2026 > DECEMBER > JAN-MAR > APRIL 2027"   "grep -q \"label: '2026'\" src/components/TransitionTimeline.tsx && grep -q \"label: 'DECEMBER'\" src/components/TransitionTimeline.tsx && grep -q \"label: 'APRIL 2027'\" src/components/TransitionTimeline.tsx"
chk "a dedicated contrasting colour for the transition"  "grep -q \"transition: '#\" src/config/branding.ts && grep -q 'colors.transition' src/components/TransitionTimeline.tsx"
chk "2027 IMPLEMENTATION YEAR label"                     "grep -q \"title: '2027 IMPLEMENTATION YEAR'\" src/config/scenes.ts"
chk "leave: JANUARY 3-month, APRIL 2027 new annual"      "grep -q \"janWhat: '3-MONTH LEAVE BALANCE'\" src/config/scenes.ts && grep -q \"aprWhat: 'NEW ANNUAL LEAVE BALANCE'\" src/config/scenes.ts && grep -q \"aprBasis: 'Based on the updated grades'\" src/config/scenes.ts"
chk "allowance: Jan-Mar current, April new basic salary" "grep -q \"bandWhat: 'Current basic salary'\" src/config/scenes.ts && grep -q \"aprWhat: 'New basic salary reflected'\" src/config/scenes.ts"
chk "merit: 12 + 3 on the wheel, 15 MONTHS, note"        "grep -q 'sweep3={s3}' src/scenes/Scene08Merit.tsx && grep -q \"fifteen: '15 MONTHS'\" src/config/scenes.ts && grep -q 'The percentage itself does not change' src/config/scenes.ts"
chk "leave example: 22/12x3 = 6 days, 30/12x3 = 8 days"  "fact \"const r = c.copy.examples.leave.map((x) => x.terms.map((t) => t.text).join(' ')); process.exit(r[0] === '22 \u00F7 12 \u00D7 3 \u2248 6 DAYS' && r[1] === '30 \u00F7 12 \u00D7 3 \u2248 8 DAYS' ? 0 : 1)\""
chk "allowance example: 10,000 x 60% / 12 x 3 = 1,500"   "fact \"process.exit(c.copy.examples.allowance.terms.map((t) => t.text).join(' ') === 'SAR 10,000 \u00D7 60% \u00F7 12 \u00D7 3 = SAR 1,500' ? 0 : 1)\""
chk "merit example: 5% / 12 x 15 = 6.25% over 15 months" "fact \"const m = c.copy.examples.merit.terms; process.exit(m.map((t) => t.text).join(' ') === '5% \u00F7 12 \u00D7 15 = 6.25%' && m[3].caption === 'OVER 15 MONTHS' ? 0 : 1)\""
chk "each example is on screen in its scene"            "grep -q 'examples.leave' src/scenes/Scene06Leave.tsx && grep -q 'examples.allowance' src/scenes/Scene07Allowance.tsx && grep -q 'examples.merit' src/scenes/Scene08Merit.tsx"
chk "no YIB / grade code on screen"                      "! grep -rqiE 'GRADE CODE|YIB' src/config/scenes.ts src/scenes/"
chk "closing slide: no logo, HR contact or HR portal"    "! grep -qE 'logoSrc|logoPlaceholderLabel|logoIn|hrContact|hrPortal' src/scenes/Scene09Close.tsx src/config/scenes.ts"
chk "closing card matches the line"                      "grep -q \"questions: 'FOR FURTHER CLARIFICATION', sub: 'CONTACT HR PERSONNEL'\" src/config/scenes.ts"

echo; echo "TIMING STRUCTURE"
chk "pacing intent exists for all 9 scenes"              "test \$(grep -c '\"id\":' src/config/voiceover.pacing.ts) -eq 9"
chk "word-pinned beats are declared"                     "test -f src/config/anchors.ts"
chk "re-measure tool exists"                             "test -f scripts/anchor-beats.mjs"
chk "pronunciation test exists"                          "test -f scripts/check-pronunciation.py"
chk "scenes.ts says its times are provisional"           "grep -q 'RE-ANCHORING AFTER A SCRIPT OR VOICE CHANGE' src/config/scenes.ts"
chk "markers not claimed as final measurements"          "! grep -q 'from the measured onsets' src/config/scenes.ts"

echo; echo "THE READ"
chk "every phrase recorded, and nothing stale"           "fact \"import('node:fs').then((fs) => { const have = fs.readdirSync('assets/audio/lines').filter((f) => f.endsWith('.wav')).sort().join(','); const want = lines.map((l) => l.id + '.wav').sort().join(','); process.exit(have === want ? 0 : 1); })\""
chk "narration track matches the film's length"          "node scripts/check-length.mjs"
chk "narrator is the local Kokoro voice"                 "grep -q \"engine: 'kokoro'\" src/config/voiceover.ts"
chk "voice is am_liam at 0.88"                          "grep -q \"speakerName: 'am_liam'\" src/config/voiceover.ts && grep -q 'speakerId: 15,' src/config/voiceover.ts && grep -q 'speed: 0.88,' src/config/voiceover.ts"
chk "retired takes preserved, not deleted"               "test \$(ls assets/audio/takes/alexander/*.wav | wc -l) -eq 20"
chk "typecheck clean"                                    "npx tsc --noEmit"

echo
if [ "$FAILED" = "1" ]; then echo "SOMETHING FAILED"; exit 1; fi
echo "All checks passed."
