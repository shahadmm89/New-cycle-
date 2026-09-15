#!/usr/bin/env bash
#
# THE BRIEF, AS A TEST
# --------------------
#     npm run check:brief
#
# Every line the client asked for, checked against what is actually in the repo.
# It exists because this film has been revised five times, and each revision
# carried a list of specific requirements - an exact closing line, a
# terminology correction, a label that must appear, a label that must NOT.
# Re-reading five briefs by hand before every change is how one of them
# silently gets dropped.
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

echo "SCRIPT AND NARRATION"
chk "opening asks how we CURRENTLY run the cycle"      "grep -q \"Do you know how we currently run our salary cycle?\" src/config/scenes.ts"
chk "merit: expected market movement + projected trends" "grep -q 'based on projected market and inflation trends' src/config/scenes.ts"
chk "merit: November timing stated"                     "grep -q 'available around November' src/config/scenes.ts"
chk "bonus: estimated Company Performance KPIs"         "grep -q 'For bonus, we use estimated Company Performance KPIs,' src/config/scenes.ts"
chk "bonus: December timing stated"                     "grep -q 'available by December' src/config/scenes.ts"
chk "HSE/Finance never spoken"                          "! grep -qE \"text: '[^']*(HSE|Finance|Operational)\" src/config/scenes.ts"
chk "best practice is narration"                        "grep -q 'closer to market best practice' src/config/scenes.ts"
chk "best practice is NOT a slide title"                "! grep -qi 'BEST PRACTICE' src/config/copy.ts src/scenes/*.tsx"
chk "implementation year ONLY, 15 instead of 12"        "grep -q 'During the implementation year only, the merit calculation will cover 15 months instead of 12.' src/config/scenes.ts"
chk "illustrative example named in narration"           "grep -q 'As an illustrative example' src/config/scenes.ts"
chk "closing line exact"                                "grep -q 'Please contact your HR personnel for support.' src/config/scenes.ts"

echo; echo "TERMINOLOGY"
chk "kpiTerm has no apostrophe"                         "grep -q \"kpiTerm = 'Company Performance KPIs'\" src/config/copy.ts"
chk "pronunciation target declared as K-P-Is"           "grep -q \"kpiSaidAs = 'K-P-Is'\" src/config/copy.ts"
chk "engine alias has no apostrophe"                    "grep -q \"kpiTermSpoken = 'Company Performance K-P-Is'\" src/config/copy.ts"
chk "no KPI's in the written script"                    "! grep -q \"KPI's\" output/voiceover-script.md"
chk "no KPI's in the captions"                          "! grep -q \"KPI's\" output/salary-cycle-update.vtt src/config/scenes.ts"
chk "no KPI's in any on-screen copy"                    "! grep -rq \"KPI's\" src/scenes/ src/components/"

echo; echo "VISUALS"
chk "bottom timeline exists"                            "test -f src/components/Timeline.tsx"
chk "timeline rendered at film level"                   "grep -q 'BottomTimeline' src/Video.tsx"
chk "JAN-DEC re-aligns into APR-MAR (no cut)"           "grep -q 'into={monthsSalaryYear}' src/Video.tsx"
chk "NOVEMBER = merit / expected market movement"       "grep -q \"label: 'NOVEMBER', kind: 'Merit', sub: 'Expected Market\" src/Video.tsx"
chk "DECEMBER = bonus / estimated Company Performance KPIs" "grep -q \"label: 'DECEMBER', kind: 'Bonus', sub: 'Estimated Company\" src/Video.tsx"
chk "JANUARY = actual Company Performance"              "grep -q \"label: 'JANUARY', kind: 'Merit', sub: 'Actual Company\" src/Video.tsx"
chk "FEBRUARY = actual Market Movement"                 "grep -q \"label: 'FEBRUARY', kind: 'Bonus', sub: 'Actual Market\" src/Video.tsx"
chk "MARCH = bonus paid in the March payroll"           "grep -q \"label: 'MARCH', kind: 'Bonus', sub: 'Bonus paid in the\" src/Video.tsx"
chk "APRIL = merit and promotion take effect"           "grep -q \"label: 'APRIL', kind: 'Merit', sub: 'Merit & Promotion\" src/Video.tsx"
chk "old vs new timing shown as a comparison"           "grep -q 'CompareRow' src/scenes/Scene05ActualData.tsx"
chk "the comparison names estimated and actual"         "grep -q \"wasTag: 'ESTIMATED'\" src/config/scenes.ts && grep -q \"nowTag: 'ACTUAL'\" src/config/scenes.ts"
chk "estimate and actual are different colours"         "grep -q \"pin.tone === 'actual' ? colors.accent : colors.primary\" src/components/Timeline.tsx"
chk "IMPLEMENTATION YEAR ONLY label"                    "grep -q \"label: 'IMPLEMENTATION YEAR ONLY'\" src/config/copy.ts"
chk "happens once, not every year"                      "grep -q 'HAPPENS ONCE' src/config/copy.ts"
chk "months 13, 14, 15 labelled"                        "grep -q \"extraMonthNumbers: \\['MONTH 13', 'MONTH 14', 'MONTH 15'\\]\" src/config/copy.ts"
chk "ILLUSTRATIVE EXAMPLE label"                        "grep -q \"illustrative: 'ILLUSTRATIVE EXAMPLE'\" src/config/copy.ts"
chk "5% shown over 12 months, 6.25% over 15"            "grep -q 'over12' src/scenes/Scene09Example.tsx && grep -q 'over15' src/scenes/Scene09Example.tsx"
chk "the rate is 0.4167%"                               "grep -q 'toFixed(4)' src/config/copy.ts"
chk "merit rate unchanged is stated on screen"          "grep -q 'THE MERIT PERCENTAGE HAS NOT CHANGED' src/config/copy.ts"
chk "closing card matches the line"                     "grep -q 'PLEASE CONTACT YOUR HR PERSONNEL FOR SUPPORT' src/config/scenes.ts"

echo; echo "TIMING STRUCTURE"
chk "pacing intent exists for all 11 scenes"            "test \$(grep -c '\"id\":' src/config/voiceover.pacing.ts) -eq 11"
chk "word-pinned beats are declared"                    "test -f src/config/anchors.ts"
chk "all six month markers are anchored"                "test \$(grep -c \"beat: 'timeline\" src/config/anchors.ts) -eq 6"
chk "re-measure tool exists"                            "test -f scripts/anchor-beats.mjs"
chk "pronunciation test exists"                         "test -f scripts/check-pronunciation.py"
chk "generation order tool exists"                      "test -f scripts/print-prompts.mjs"
chk "scenes.ts says its times are provisional"          "grep -q 'RE-ANCHORING AFTER A VOICE CHANGE' src/config/scenes.ts"
chk "markers not claimed as final measurements"         "! grep -q 'from the measured onsets' src/config/scenes.ts"

echo; echo "NOTHING WAS SPENT OR SHIPPED"
chk "no takes in the current voice"                     "test \$(ls assets/audio/lines/ 2>/dev/null | wc -l) -eq 0"
chk "Alexander takes preserved, not deleted"            "test \$(ls assets/audio/takes/alexander/*.wav | wc -l) -eq 20"
chk "no MP4 rendered from the new cut"                  "! find output -name '*.mp4' -newer src/config/scenes.ts | grep -q ."
chk "narrator is Evan"                                  "grep -q \"voiceId: 'TWutjvRaJqAX89preB4e'\" src/config/voiceover.ts"
chk "typecheck clean"                                   "npx tsc --noEmit"

echo
if [ "$FAILED" = "1" ]; then echo "SOMETHING FAILED"; exit 1; fi
echo "All checks passed."
