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
chk "flow: change > new cycle > March > April > 2027 > leave > HR" "fact \"process.exit(c.scenes.map((s) => s.id).join(',') === 'hook,the-change,march,april,example,leave,close' ? 0 : 1)\""
chk "script is exactly the approved text, in order"      "fact \"const want = ['YASREF will change the salary merit effectiveness from January to April,', 'changing only the timing in alignment with market best practices.', 'Here\\u2019s the new proposed cycle.'.replace('\\u2019', String.fromCharCode(39)), 'The bonus will be paid in March.', 'In April, merit increases and promotion adjustments will be reflected.', 'This transition applies to the 2027 implementation year only.', 'During the transition year, the bonus will cover 15 months, while the percentage itself does not change \\u2014 only the months it covers.', 'For your leave balance, you will receive a three-month balance in January.', 'From April 2027, a new annual balance begins, based on the updated grades.', 'For further clarification, contact HR personnel.']; process.exit(JSON.stringify(lines.map((l) => l.text)) === JSON.stringify(want) ? 0 : 1)\""
chk "no old/current-cycle explanation left"              "! grep -qiE \"(text|spoken): '[^']*(November|December|estimate|one cycle|runs from January to December)\" src/config/scenes.ts"
chk "no estimates / November / December on screen"      "! grep -qiE \"NOVEMBER|DECEMBER|ESTIMATE\" src/config/scenes.ts src/scenes/*.tsx && ! grep -qE \"label: '(NOVEMBER|DECEMBER|JANUARY|FEBRUARY)'\" src/Video.tsx"
chk "old-cycle scenes are gone"                          "! test -e src/scenes/Scene03OldCycle.tsx && ! test -e src/scenes/Scene04Today.tsx && ! test -e src/scenes/Scene06ActualData.tsx"
chk "2027 implementation year only (on screen)"          "grep -q \"label: '2027 IMPLEMENTATION YEAR ONLY'\" src/config/copy.ts"
chk "March: bonus paid (screen matches the line)"        "grep -q \"bonus: 'BONUS',\" src/config/scenes.ts && grep -q \"label: 'MARCH', sub: 'Bonus.npaid'\" src/Video.tsx"
chk "the working is not read aloud"                      "! grep -qiE \"(text|spoken): '[^']*(divided by|0.4167|point four|6.25|six point)\" src/config/scenes.ts"
chk "leave figures are never spoken"                     "! grep -qiE \"(text|spoken): '[^']*(22|30|twenty-two|thirty|days)\" src/config/scenes.ts"
chk "closing line exact"                                 "grep -q \"text: 'For further clarification, contact HR personnel.'\" src/config/scenes.ts"
chk "no 'your HR' anywhere"                              "! grep -qi 'your HR' src/config/scenes.ts src/scenes/*.tsx"
chk "no narration line repeated"                         "fact \"process.exit(new Set(lines.map((l) => l.text.toLowerCase())).size === lines.length ? 0 : 1)\""

echo; echo "TERMINOLOGY AND PRONUNCIATION"
chk "kpiTerm has no apostrophe"                          "grep -q \"kpiTerm = 'Company Performance KPIs'\" src/config/copy.ts"
chk "pronunciation target declared as K-P-Is"            "grep -q \"kpiSaidAs = 'K-P-Is'\" src/config/copy.ts"
chk "engine alias has no apostrophe"                     "grep \"kpiTermSpoken =\" src/config/copy.ts | grep -qv \"'\\''\""
chk "no KPI's in the written script"                     "! grep -q \"KPI's\" output/voiceover-script.md"
chk "no KPI's in the captions"                           "! grep -q \"KPI's\" output/salary-cycle-update.vtt src/config/scenes.ts"
chk "no KPI's in any on-screen copy"                     "! grep -rq \"KPI's\" src/scenes/ src/components/ src/Video.tsx"
chk "YASREF said as a name, not spelled out"             "grep -q \"spoken: 'Yasref will change the salary merit effectiveness from January to April,'\" src/config/scenes.ts"
chk "HR said as letters"                                 "grep -q \"spoken: 'For further clarification, contact H R personnel.'\" src/config/scenes.ts"

echo; echo "VISUALS"
chk "bottom timeline rendered at film level"             "grep -q 'BottomTimeline' src/Video.tsx"
chk "JAN-DEC re-aligns into APR-MAR (no cut)"            "grep -q 'into={monthsSalaryYear}' src/Video.tsx"
chk "APRIL = merit & promotion adjustments reflected"    "grep -q \"label: 'APRIL', sub: 'Merit & Promotion.nadjustments reflected'\" src/Video.tsx"
chk "happens once, not every year"                       "grep -q 'HAPPENS ONCE' src/config/copy.ts"
chk "months 13, 14, 15 labelled"                         "grep -q \"extraMonthNumbers: \\['MONTH 13', 'MONTH 14', 'MONTH 15'\\]\" src/config/copy.ts"
chk "ILLUSTRATIVE EXAMPLE label"                         "grep -q \"illustrative: 'ILLUSTRATIVE EXAMPLE'\" src/config/copy.ts"
chk "5% shown over 12 months, 6.25% over 15"             "grep -q 'over12' src/scenes/Scene09Example.tsx && grep -q 'over15' src/scenes/Scene09Example.tsx"
chk "the rate is 0.4167% and the result 6.25%"           "fact \"process.exit(c.copy.implementation.perMonth === '0.4167%' && c.copy.implementation.equivalent === '6.25%' ? 0 : 1)\""
chk "percentage unchanged is stated on screen"           "grep -q 'THE PERCENTAGE ITSELF DOES NOT CHANGE' src/config/copy.ts"
chk "leave: January 2027, first 3 months only"           "fact \"process.exit(c.copy.leave.janWhen === 'JANUARY 2027' && c.copy.leave.janWhat === 'FIRST 3 MONTHS ONLY' ? 0 : 1)\""
chk "leave: Grade 9 & below 22 / 12 x 3 = 6 days"        "fact \"const r = c.copy.leave.rows[0]; process.exit(r.grade === 'GRADE 9 & BELOW' && r.working === '22 \\u00F7 12 \\u00D7 3' && r.result === '\\u2248 6 DAYS' ? 0 : 1)\""
chk "leave: Grade 10 & above 30 / 12 x 3 = 8 days"       "fact \"const r = c.copy.leave.rows[1]; process.exit(r.grade === 'GRADE 10 & ABOVE' && r.working === '30 \\u00F7 12 \\u00D7 3' && r.result === '\\u2248 8 DAYS' ? 0 : 1)\""
chk "leave: April 2027 new balance on the updated grades" "fact \"const l = c.copy.leave; process.exit(l.aprWhen === 'APRIL 2027' && l.aprWhat === 'NEW ANNUAL LEAVE BALANCE' && l.aprBasis === 'BASED ON THE UPDATED GRADES' ? 0 : 1)\""
chk "closing card matches the line"                      "grep -q \"questions: 'FOR FURTHER CLARIFICATION', sub: 'CONTACT HR PERSONNEL'\" src/config/scenes.ts"

echo; echo "TIMING STRUCTURE"
chk "pacing intent exists for all 7 scenes"              "test \$(grep -c '\"id\":' src/config/voiceover.pacing.ts) -eq 7"
chk "word-pinned beats are declared"                     "test -f src/config/anchors.ts"
chk "every spoken month marker is anchored to its word"  "test \$(grep -c \"beat: 'timeline\" src/config/anchors.ts) -eq 2"
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
