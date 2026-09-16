SALARY CYCLE UPDATE - EDITABLE ASSET PACKAGE
========================================================================

The finished film, taken apart. 1920x1080, 30 fps, 00:02:28.350 long,
11 scenes, 34 narration phrases.

Everything here is generated from the project the film renders from, so it
cannot describe a different video from the one that exists. Re-run it any time
with: npm run export:package && npm run export:stills && npm run export:elements

START HERE
  EDIT_GUIDE.txt          how to put it back together, scene by scene
  EDIT_GUIDE.csv          the same thing for a spreadsheet
  EDIT_GUIDE_BY_LINE.csv  per phrase, for retiming a single line
  MANIFEST.json           all of it as data, if you are scripting against it

01_script/                23 KB
  FULL_SCRIPT.txt / .docx     the narration, whole
  SCENE_BY_SCENE.txt / .csv   scene, timing, narration, on-screen text, visual

02_audio/                 34 MB
  narration_full.wav          the entire track. Drop this at 00:00:00 and the
                              film reassembles around it
  per-scene/                  one WAV per scene, cut from that same track, so
                              each starts exactly where its scene starts
  per-line/                   one WAV per phrase, as recorded

  All 48 kHz mono, -16 LUFS. The silence between phrases is part of the edit -
  trimming it is what makes a narration sound rushed.

03_scenes/                86 MB
  NN_scene_<id>.png           each scene once everything in it has arrived
  states/                     one frame per narration phrase, because several
                              scenes say three or four different things

  Rendered without burned-in captions. Use the .srt if you want them back.

04_elements/              311 MB
  20 reusable moving parts, each on a TRANSPARENT background:
    el-timeline-old        Bottom timeline, JAN to DEC, with the November and December markers
    el-timeline-morph      Bottom timeline re-aligning from JAN-DEC into APR-MAR
    el-timeline-new        Bottom timeline, APR to MAR, with all four new-cycle markers
    el-monthrail-old       Month rail, JAN to DEC, with the playhead walking the year
    el-monthrail-new       Month rail, APR to MAR, landing on March
    el-rail-reorder        Month rail physically re-ordering into the new cycle
    el-yearring-spin       Year ring spinning from January to April - the hero mechanism
    el-yearring-static     Year ring, twelve months, arc sweeping once
    el-range-old           Range plate, JAN to DEC (quiet treatment)
    el-range-new           Range plate, APR to MAR (accent treatment)
    el-icon-merit          Merit icon
    el-icon-promotion      Promotion icon
    el-icon-bonus          Bonus icon
    el-icon-performance    Performance icon
    el-icon-tick           Affirmation tick
    el-icons-kpi           The three KPI glyphs: HSE, Finance, Performance
    el-forecast-chart      Forecast line resolving from a projection into a measurement
    el-fifteen-months      12 solid month tiles plus the 3 that only exist in the changeover
    el-five-to-625         5% struck through, resolving into 6.25%, both periods labelled
    el-timing-compare      TODAY / NOV DEC / ESTIMATED against NEW CYCLE / JAN FEB / ACTUAL

  Each comes as:
    .webm                     VP9 with alpha. Small. Premiere, Resolve, After
                              Effects and browsers read it. CapCut and Canva
                              do not.
    -png-sequence.zip         30 fps PNG frames with alpha. Import as an
                              image sequence. This is the route into CapCut
                              and Canva.

  ProRes 4444 MOVs are available but not built by default - they are about a
  hundred times the size of the WebM. To add them:
    npm run export:elements -- --formats=webm,mov,png

05_captions/              6 KB
  SRT and VTT, timed against narration_full.wav starting at 00:00:00.

06_project_source/        196 KB
  The project itself. See its README - changing wording or timing is a text
  edit and a re-render, not a rebuild.

========================================================================
WORDING THAT MUST NOT DRIFT

  "Company Performance KPIs"      correct, everywhere a viewer can see it
  "KPI's"                         never. The packaging step fails if this
                                  appears in the captions.

  The narrator is given a different spelling internally so the letters are
  read out rather than turned into the word "is". That spelling is never shown
  and is per-engine - see src/config/copy.ts if you change voices.

  6.25% is an ILLUSTRATIVE EXAMPLE for the IMPLEMENTATION YEAR ONLY. Both
  labels are on screen with it, along with OVER 12 MONTHS and OVER 15 MONTHS
  under the two figures. If you re-cut that scene, keep them: without them the
  strike-through reads as the merit rate changing, which is the one thing it
  must not say.
