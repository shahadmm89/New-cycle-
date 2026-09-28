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
chk "flow: purpose > timing only > current > new > 2026 > leave > HR" "fact \"process.exit(c.scenes.map((s) => s.id).join(',') === 'hook,timing-only,old-cycle,today,the-change,actual-data,march,april,example,leave,close' ? 0 : 1)\""
chk "does NOT open with a 'Do you know' question"        "! grep -qi 'do you know' src/config/scenes.ts"
chk "opens on YASREF changing its salary cycle"          "grep -q \"text: 'YASREF is changing its salary cycle,'\" src/config/scenes.ts"
chk "why: best practice, timing and relevance"           "grep -q 'to align with best practice, and make it more timely and relevant.' src/config/scenes.ts"
chk "the change is in TIMING only"                       "grep -q 'Only the timing changes: when your benefits are received and reflected.' src/config/scenes.ts"
chk "benefits and Total Reward Package do not change"    "grep -q 'Your benefits, and your Total Reward Package, stay exactly the same.' src/config/scenes.ts"
chk "benefits shown as bonus, merit, promotion"          "grep -q \"benefits: \['BONUS', 'MERIT', 'PROMOTION'\]\" src/config/scenes.ts"
chk "current cycle says 'One cycle.'"                    "grep -q \"text: 'One cycle.'\" src/config/scenes.ts && grep -q \"banner: 'ONE CYCLE'\" src/config/scenes.ts"
chk "'12 months, one cycle' is gone"                     "! grep -qiE '12 months, one cycle|twelve months, one cycle|12 MONTHS  ·  ONE CYCLE' src/config/scenes.ts"
chk "November: two activities in parallel"               "grep -q 'two things happen in parallel' src/config/scenes.ts"
chk "November: merit & salary movement card"             "grep -q \"meritTitle: 'MERIT & SALARY MOVEMENT'\" src/config/scenes.ts && grep -q \"meritValue: 'Expected salary inflation & market movement for the next year'\" src/config/scenes.ts"
chk "November: year-end estimate card"                   "grep -q \"bonusTitle: 'YEAR-END ESTIMATE'\" src/config/scenes.ts"
chk "both November cards stay up together"               "! grep -q 'meritFade' src/scenes/Scene04Today.tsx"
chk "December finalizes, January reflects (said)"        "grep -q 'Decisions are finalized in December, and reflected in January.' src/config/scenes.ts"
chk "new cycle kept visual: one line per month scene"    "fact \"process.exit(['the-change','actual-data','march','april'].every((id) => c.scenes.find((s) => s.id === id).voice.length === 1) ? 0 : 1)\""
chk "March: YIB & bonus paid"                            "grep -q \"text: 'In March, YIB and bonus are paid.'\" src/config/scenes.ts && grep -q \"bonus: 'YIB & BONUS'\" src/config/scenes.ts"
chk "April: merit & promotion adjustments reflected"     "grep -q \"text: 'And in April, merit increases and promotion adjustments are reflected.'\" src/config/scenes.ts"
chk "no 'month to remember' / 'one to remember'"         "! grep -qi 'to remember' src/config/scenes.ts src/scenes/*.tsx"
chk "no extra April explanation"                         "! grep -qiE \"where the cycle now begins|START OF THE NEW SALARY CYCLE|last month of the cycle|CLOSES THE CYCLE\" src/config/scenes.ts src/scenes/*.tsx"
chk "2026 implementation year only (said)"               "grep -q 'This transition applies to the 2026 implementation year only.' src/config/scenes.ts"
chk "2026 implementation year only (on screen)"          "grep -q \"label: '2026 IMPLEMENTATION YEAR ONLY'\" src/config/copy.ts"
chk "the working is not read aloud"                      "! grep -qiE \"(text|spoken): '[^']*(divided by|0.4167|point four|6.25|six point)\" src/config/scenes.ts"
chk "leave balance: same transition (said)"              "grep -q \"text: 'The same transition applies to your leave balance.'\" src/config/scenes.ts"
chk "leave figures are never spoken"                     "! grep -qiE \"(text|spoken): '[^']*(22|30|twenty-two|thirty|days)\" src/config/scenes.ts"
chk "closing line exact"                                 "grep -q \"text: 'For further clarification, contact HR personnel.'\" src/config/scenes.ts"
chk "no 'your HR' anywhere"                              "! grep -qi 'your HR' src/config/scenes.ts src/scenes/*.tsx"
chk "HSE/Finance never spoken"                           "! grep -qE \"text: '[^']*(HSE|Finance|Operational)\" src/config/scenes.ts"
chk "narration is short: <= 160 words in total"          "fact \"process.exit(lines.map((l) => l.text).join(' ').split(/\\\\s+/).length <= 160 ? 0 : 1)\""
chk "no narration line repeated"                         "fact \"process.exit(new Set(lines.map((l) => l.text.toLowerCase())).size === lines.length ? 0 : 1)\""

echo; echo "TERMINOLOGY AND PRONUNCIATION"
chk "kpiTerm has no apostrophe"                          "grep -q \"kpiTerm = 'Company Performance KPIs'\" src/config/copy.ts"
chk "pronunciation target declared as K-P-Is"            "grep -q \"kpiSaidAs = 'K-P-Is'\" src/config/copy.ts"
chk "engine alias has no apostrophe"                     "grep \"kpiTermSpoken =\" src/config/copy.ts | grep -qv \"'\\''\""
chk "no KPI's in the written script"                     "! grep -q \"KPI's\" output/voiceover-script.md"
chk "no KPI's in the captions"                           "! grep -q \"KPI's\" output/salary-cycle-update.vtt src/config/scenes.ts"
chk "no KPI's in any on-screen copy"                     "! grep -rq \"KPI's\" src/scenes/ src/components/ src/Video.tsx"
chk "YASREF said as a name, not spelled out"             "grep -q \"spoken: 'Yasref is changing its salary cycle,'\" src/config/scenes.ts"
chk "YIB said as letters"                                "grep -q \"spoken: 'In March, Y I B, and bonus are paid.'\" src/config/scenes.ts"
chk "HR said as letters"                                 "grep -q \"spoken: 'For further clarification, contact H R personnel.'\" src/config/scenes.ts"

echo; echo "VISUALS"
chk "bottom timeline exists"                             "test -f src/components/Timeline.tsx"
chk "timeline rendered at film level"                    "grep -q 'BottomTimeline' src/Video.tsx"
chk "JAN-DEC re-aligns into APR-MAR (no cut)"            "grep -q 'into={monthsSalaryYear}' src/Video.tsx"
chk "NOVEMBER = merit & salary movement + year-end estimate" "grep -q \"label: 'NOVEMBER', sub: 'Merit & Salary Movement.nYear-End Estimate'\" src/Video.tsx"
chk "DECEMBER = finalization / decisions"                "grep -q \"label: 'DECEMBER', sub: 'Finalization /.nDecisions'\" src/Video.tsx"
chk "no JANUARY marker in today's cycle"                 "! grep -q \"month: 'JAN'.*scene: 'today'\" src/Video.tsx"
chk "JANUARY = new cycle takes effect"                   "grep -q \"label: 'JANUARY', sub: 'New cycle.ntakes effect'\" src/Video.tsx"
chk "FEBRUARY = actual inflation/market + company performance" "grep -q \"label: 'FEBRUARY', sub: 'Actual Inflation & Market Movement.nActual Company Performance'\" src/Video.tsx"
chk "MARCH = YIB & bonus paid"                           "grep -q \"label: 'MARCH', sub: 'YIB & Bonus.npaid'\" src/Video.tsx"
chk "APRIL = merit & promotion adjustments reflected"    "grep -q \"label: 'APRIL', sub: 'Merit & Promotion.nadjustments reflected'\" src/Video.tsx"
chk "old vs new timing shown as a comparison"            "grep -q 'CompareRow' src/scenes/Scene06ActualData.tsx"
chk "the comparison names estimated and actual"          "grep -q \"wasTag: 'ESTIMATED'\" src/config/scenes.ts && grep -q \"nowTag: 'ACTUAL'\" src/config/scenes.ts"
chk "estimate and actual are different colours"          "grep -q \"pin.tone === 'actual' ? colors.accent : colors.primary\" src/components/Timeline.tsx"
chk "happens once, not every year"                       "grep -q 'HAPPENS ONCE' src/config/copy.ts"
chk "months 13, 14, 15 labelled"                         "grep -q \"extraMonthNumbers: \\['MONTH 13', 'MONTH 14', 'MONTH 15'\\]\" src/config/copy.ts"
chk "ILLUSTRATIVE EXAMPLE label"                         "grep -q \"illustrative: 'ILLUSTRATIVE EXAMPLE'\" src/config/copy.ts"
chk "5% shown over 12 months, 6.25% over 15"             "grep -q 'over12' src/scenes/Scene09Example.tsx && grep -q 'over15' src/scenes/Scene09Example.tsx"
chk "the rate is 0.4167% and the result 6.25%"           "fact \"process.exit(c.copy.implementation.perMonth === '0.4167%' && c.copy.implementation.equivalent === '6.25%' ? 0 : 1)\""
chk "merit rate unchanged is stated on screen"           "grep -q 'THE MERIT PERCENTAGE HAS NOT CHANGED' src/config/copy.ts"
chk "leave: January 2027, first 3 months only"           "fact \"process.exit(c.copy.leave.janWhen === 'JANUARY 2027' && c.copy.leave.janWhat === 'FIRST 3 MONTHS ONLY' ? 0 : 1)\""
chk "leave: Grade 9 & below 22 / 12 x 3 = 6 days"        "fact \"const r = c.copy.leave.rows[0]; process.exit(r.grade === 'GRADE 9 & BELOW' && r.working === '22 \\u00F7 12 \\u00D7 3' && r.result === '\\u2248 6 DAYS' ? 0 : 1)\""
chk "leave: Grade 10 & above 30 / 12 x 3 = 8 days"       "fact \"const r = c.copy.leave.rows[1]; process.exit(r.grade === 'GRADE 10 & ABOVE' && r.working === '30 \\u00F7 12 \\u00D7 3' && r.result === '\\u2248 8 DAYS' ? 0 : 1)\""
chk "leave: April 2027 new balance on April grade code"  "fact \"const l = c.copy.leave; process.exit(l.aprWhen === 'APRIL 2027' && l.aprWhat === 'NEW ANNUAL LEAVE BALANCE' && l.aprBasis === 'BASED ON APRIL GRADE CODE' ? 0 : 1)\""
chk "closing card matches the line"                      "grep -q \"questions: 'FOR FURTHER CLARIFICATION', sub: 'CONTACT HR PERSONNEL'\" src/config/scenes.ts"

echo; echo "TIMING STRUCTURE"
chk "pacing intent exists for all 11 scenes"             "test \$(grep -c '\"id\":' src/config/voiceover.pacing.ts) -eq 11"
chk "word-pinned beats are declared"                     "test -f src/config/anchors.ts"
chk "every spoken month marker is anchored to its word"  "test \$(grep -c \"beat: 'timeline\" src/config/anchors.ts) -eq 5"
chk "re-measure tool exists"                             "test -f scripts/anchor-beats.mjs"
chk "pronunciation test exists"                          "test -f scripts/check-pronunciation.py"
chk "scenes.ts says its times are provisional"           "grep -q 'RE-ANCHORING AFTER A SCRIPT OR VOICE CHANGE' src/config/scenes.ts"
chk "markers not claimed as final measurements"          "! grep -q 'from the measured onsets' src/config/scenes.ts"

echo; echo "THE READ"
chk "every phrase recorded, and nothing stale"           "fact \"import('node:fs').then((fs) => { const have = fs.readdirSync('assets/audio/lines').filter((f) => f.endsWith('.wav')).sort().join(','); const want = lines.map((l) => l.id + '.wav').sort().join(','); process.exit(have === want ? 0 : 1); })\""
chk "narration track matches the film's length"          "node scripts/check-length.mjs"
chk "narrator is the local Kokoro voice"                 "grep -q \"engine: 'kokoro'\" src/config/voiceover.ts"
chk "voice is am_michael"                                "grep -q \"speakerName: 'am_michael'\" src/config/voiceover.ts"
chk "retired takes preserved, not deleted"               "test \$(ls assets/audio/takes/alexander/*.wav | wc -l) -eq 20"
chk "typecheck clean"                                    "npx tsc --noEmit"

echo
if [ "$FAILED" = "1" ]; then echo "SOMETHING FAILED"; exit 1; fi
echo "All checks passed."
