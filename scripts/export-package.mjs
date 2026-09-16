#!/usr/bin/env node
/**
 * THE EDITABLE ASSET PACKAGE
 * --------------------------
 *     npm run export:package
 *
 * Takes the finished film apart into the pieces an editor actually needs, so
 * the video can be rebuilt or altered in CapCut, Premiere, Resolve or Canva
 * without this repository.
 *
 * Everything is derived from the same config the film renders from, so the
 * package cannot describe a video different from the one that exists. Nothing
 * here regenerates audio: the narration is sliced out of the approved take.
 *
 * Writes output/asset-package/.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';
import {ROOT, loadConfig, flatVoiceLines} from './lib/config.mjs';
import {readWavInfo} from './lib/wav.mjs';
import {writeDocx} from './lib/docx.mjs';

const OUT = path.join(ROOT, 'output', 'asset-package');
const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const want = (part) => !only || only.split(',').includes(part);

const cfg = loadConfig();
const lines = flatVoiceLines(cfg);
const scenes = cfg.scenes;

/** 00:01:23.456 - what an NLE expects to see. */
const tc = (s) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${sec.toFixed(3).padStart(6, '0')}`;
};
const pad2 = (n) => String(n).padStart(2, '0');
const mkdir = (p) => fs.mkdirSync(p, {recursive: true});
const ffmpeg = (args) => {
  const r = spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', ...args],
    {cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe']});
  if (r.status !== 0) throw new Error(`ffmpeg failed:\n${r.stderr?.toString()}`);
};

/** Every on-screen string a scene declares, flattened for the guide. */
const screenText = (scene) => {
  const t = scene.text ?? {};
  const out = [];
  for (const v of Object.values(t)) {
    if (Array.isArray(v)) out.push(...v.map(String));
    else if (v != null) out.push(String(v));
  }
  return out;
};

/**
 * What each scene shows, in words. Written once here rather than inferred,
 * because "what is on screen" is the one thing the config cannot describe.
 */
const VISUALS = {
  hook: 'Oversized question over a faint year ring. SALARY CYCLE lit in the accent, on a plinth, with the sub-line beneath.',
  'old-cycle': 'Year ring on the left counting twelve months, range plate and month rail on the right, JAN to DEC, playhead walking the year. The bottom timeline draws in here and runs for the next four scenes.',
  today: 'MERIT card with the forecast line, then the BONUS heading and the three KPI tiles (HSE, Finance, Performance) rolling up into COMPANY PERFORMANCE KPIs. The bottom timeline picks up the NOVEMBER and DECEMBER markers.',
  'the-change': 'The hero moment. The ring spins three turns and lands on April while OLD drops away and NEW rises. Underneath, the same twelve months re-align from JAN-DEC into APR-MAR - months with far to travel lift over the ones that barely move.',
  'actual-data': 'Forecast chart resolving from a projection into a measurement, two ticked claims beside it, and the small old-against-new timing comparison. The bottom timeline picks up JANUARY and FEBRUARY, now actual rather than estimated.',
  april: 'APRIL at full size with MERIT and PROMOTION icons rising, and the EFFECTIVE APRIL 1 pill. The bottom timeline picks up the APRIL marker.',
  march: 'Month rail running the new salary year and landing on MARCH, with the bonus icon and the MARCH PAYROLL chip. The bottom timeline picks up the MARCH marker, then retires.',
  'no-change': 'Two parallel rows: PERFORMANCE APPRAISAL JAN-DEC with a tick and NO CHANGE, against SALARY CYCLE APR-MAR marked NEW.',
  example: 'IMPLEMENTATION YEAR ONLY with the happens-once chip. Twelve solid month tiles plus three dashed ones numbered MONTH 13/14/15. Below, the ILLUSTRATIVE EXAMPLE card builds 5% divided by 12 times 15 term by term, then strikes the 5% through and resolves it into 6.25%, each labelled with the period it covers.',
  summary: 'APRIL to MARCH over three markers - the frame to remember.',
  close: 'HAVE QUESTIONS? over the contact line, the HR placeholders and the company logo slot.',
};

mkdir(OUT);
const manifest = {film: {}, scenes: [], lines: [], elements: []};

/* -------------------------------------------------------------- 1. script */
if (want('script')) {
  const dir = path.join(OUT, '01_script');
  mkdir(dir);

  fs.writeFileSync(path.join(dir, 'FULL_SCRIPT.txt'),
    `SALARY CYCLE UPDATE - NARRATION SCRIPT\n` +
    `${lines.length} phrases across ${scenes.length} scenes. Running time ${tc(cfg.totalDuration)}.\n` +
    `Narrated by ${cfg.voiceover.tts.speakerName} (local Kokoro).\n\n` +
    `The wording below is what is SPOKEN and what is WRITTEN - they are the same\n` +
    `except where a line carries a pronunciation note, which is marked.\n\n` +
    '='.repeat(72) + '\n\n' +
    scenes.map((s, i) => {
      const own = lines.filter((l) => l.sceneId === s.id);
      return `SCENE ${pad2(i + 1)} - ${s.title.replace(/^\d+ - /, '')}\n` +
        `${tc(cfg.sceneStarts[i])} - ${tc(cfg.sceneStarts[i] + s.duration)}\n\n` +
        own.map((l) => `  ${l.text}` + (l.spoken && l.spoken !== l.text ? `\n    [said as: ${l.spoken}]` : '')).join('\n\n');
    }).join('\n\n' + '-'.repeat(72) + '\n\n') +
    `\n\n${'='.repeat(72)}\n\nCONTINUOUS READ\n\n` +
    lines.map((l) => l.text).join(' ') + '\n');

  // Scene-by-scene, as a spreadsheet and as plain text.
  const rows = [['Scene', 'Title', 'Start', 'End', 'Duration', 'Narration', 'On-screen text', 'Visual / animation']];
  scenes.forEach((s, i) => {
    const own = lines.filter((l) => l.sceneId === s.id);
    rows.push([
      pad2(i + 1), s.title.replace(/^\d+ - /, ''),
      tc(cfg.sceneStarts[i]), tc(cfg.sceneStarts[i] + s.duration), s.duration.toFixed(2) + 's',
      own.map((l) => l.text).join(' '),
      screenText(s).join(' | '),
      VISUALS[s.id] ?? '',
    ]);
  });
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  fs.writeFileSync(path.join(dir, 'SCENE_BY_SCENE.csv'), csv + '\n');
  fs.writeFileSync(path.join(dir, 'SCENE_BY_SCENE.txt'),
    rows.slice(1).map((r) =>
      `SCENE ${r[0]} - ${r[1]}\n` +
      `  TIME      ${r[2]} -> ${r[3]}  (${r[4]})\n` +
      `  NARRATION ${r[5]}\n` +
      `  ON SCREEN ${r[6]}\n` +
      `  VISUAL    ${r[7]}\n`).join('\n'));
  // The same script as a Word document, for circulating to people who will
  // never open a .txt.
  const blocks = [
    {style: 'Title', text: 'Salary Cycle Update - Narration Script'},
    {style: 'Caption', text: `${lines.length} phrases across ${scenes.length} scenes  |  running time ${tc(cfg.totalDuration)}  |  narrated by ${cfg.voiceover.tts.speakerName}`},
    {style: 'Normal', text: 'The wording below is both what is spoken and what is written. Where a line carries a pronunciation note for the speech engine, it is shown underneath and is never seen on screen.'},
  ];
  scenes.forEach((s, i) => {
    blocks.push({style: 'Heading1', text: `Scene ${pad2(i + 1)} - ${s.title.replace(/^\d+ - /, '')}`});
    blocks.push({style: 'Caption', text: `${tc(cfg.sceneStarts[i])} - ${tc(cfg.sceneStarts[i] + s.duration)}   (${s.duration.toFixed(2)}s)`});
    for (const l of lines.filter((l) => l.sceneId === s.id)) {
      blocks.push({style: 'Quote', text: l.text});
      if (l.spoken && l.spoken !== l.text) blocks.push({style: 'Caption', text: `said as: ${l.spoken}`});
    }
    const on = screenText(s);
    if (on.length) blocks.push({style: 'Caption', text: `On screen: ${on.join(' | ')}`});
    if (VISUALS[s.id]) blocks.push({style: 'Normal', text: VISUALS[s.id]});
  });
  blocks.push({style: 'Heading1', text: 'Continuous read'});
  blocks.push({style: 'Normal', text: lines.map((l) => l.text).join(' ')});
  writeDocx(path.join(dir, 'FULL_SCRIPT.docx'), blocks);

  console.log(`  01_script/  FULL_SCRIPT.txt, FULL_SCRIPT.docx, SCENE_BY_SCENE.csv, SCENE_BY_SCENE.txt`);
}

/* --------------------------------------------------------------- 2. audio */
if (want('audio')) {
  const dir = path.join(OUT, '02_audio');
  mkdir(path.join(dir, 'per-scene'));
  mkdir(path.join(dir, 'per-line'));

  const full = path.join(ROOT, 'assets', 'audio', cfg.voiceover.audioFile.replace(/^audio\//, ''));
  fs.copyFileSync(full, path.join(dir, 'narration_full.wav'));

  // Sliced out of the assembled track, so each scene's audio keeps the exact
  // silence around it that the film uses. Concatenating the raw takes instead
  // would lose the pacing, which is most of the edit.
  scenes.forEach((s, i) => {
    const out = path.join(dir, 'per-scene', `${pad2(i + 1)}_scene_${s.id}.wav`);
    ffmpeg(['-ss', String(cfg.sceneStarts[i]), '-t', String(s.duration), '-i', full,
      '-ac', '1', '-ar', '48000', '-c:a', 'pcm_s16le', out]);
  });

  lines.forEach((l) => {
    const sceneNo = scenes.findIndex((s) => s.id === l.sceneId) + 1;
    const n = lines.filter((x) => x.sceneId === l.sceneId).indexOf(l) + 1;
    const src = path.join(ROOT, 'assets', 'audio', 'lines', `${l.id}.wav`);
    const out = path.join(dir, 'per-line', `${pad2(sceneNo)}_scene_line${n}_${l.id}.wav`);
    fs.copyFileSync(src, out);
    manifest.lines.push({
      id: l.id, scene: sceneNo, file: path.relative(OUT, out),
      start: +l.absoluteStart.toFixed(3), duration: +readWavInfo(src).duration.toFixed(3), text: l.text,
    });
  });
  console.log(`  02_audio/   narration_full.wav + ${scenes.length} scene WAVs + ${lines.length} line WAVs`);
}

fs.writeFileSync(path.join(OUT, '_manifest.partial.json'), JSON.stringify(manifest, null, 2));
console.log('\nScript and audio done. Stills and elements render separately.');

/* ------------------------------------------------------------ 5. captions */
if (want('captions')) {
  const dir = path.join(OUT, '05_captions');
  mkdir(dir);
  for (const ext of ['srt', 'vtt']) {
    const src = path.join(ROOT, 'output', `salary-cycle-update.${ext}`);
    if (!fs.existsSync(src)) throw new Error(`No ${ext} yet. Run: npm run captions`);
    const body = fs.readFileSync(src, 'utf8');
    // The one wording mistake this project has had to correct twice.
    if (/KPI['’]s/.test(body)) throw new Error(`${ext} contains "KPI's" - fix the source before packaging`);
    fs.copyFileSync(src, path.join(dir, `salary-cycle-update.${ext}`));
  }
  console.log(`  05_captions/ SRT + VTT, checked for the "KPI's" spelling`);
}

/* ---------------------------------------------------------- 6. edit guide */
if (want('guide')) {
  const header = ['Scene', 'Start', 'End', 'Duration', 'Narration file', 'Visual file', 'On-screen text', 'Narration', 'Notes'];
  const rows = [header];
  scenes.forEach((s, i) => {
    const no = pad2(i + 1);
    const own = lines.filter((l) => l.sceneId === s.id);
    rows.push([
      no,
      tc(cfg.sceneStarts[i]),
      tc(cfg.sceneStarts[i] + s.duration),
      s.duration.toFixed(2) + 's',
      `02_audio/per-scene/${no}_scene_${s.id}.wav`,
      `03_scenes/${no}_scene_${s.id}.png`,
      screenText(s).join(' | '),
      own.map((l) => l.text).join(' '),
      VISUALS[s.id] ?? '',
    ]);
  });
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  fs.writeFileSync(path.join(OUT, 'EDIT_GUIDE.csv'), csv + '\n');

  const w = [7, 13, 13, 10];
  fs.writeFileSync(path.join(OUT, 'EDIT_GUIDE.txt'),
    `REBUILDING THE FILM FROM THESE PARTS\n` +
    `${'='.repeat(72)}\n\n` +
    `Timeline: ${cfg.WIDTH}x${cfg.HEIGHT}, ${cfg.FPS} fps, total ${tc(cfg.totalDuration)}.\n\n` +
    `The quickest route back to the original: drop 02_audio/narration_full.wav on\n` +
    `the timeline at 00:00:00.000 and lay each scene's visual against the start\n` +
    `times below. That track already carries the pacing - the silence between\n` +
    `phrases is part of the edit, not dead air to trim.\n\n` +
    `To change one scene instead, use its own WAV from 02_audio/per-scene/, which\n` +
    `is cut from the same track and starts where the scene starts.\n\n` +
    `Captions in 05_captions/ are timed against the full track, so they line up as\n` +
    `long as the narration starts at zero.\n\n` +
    `${'='.repeat(72)}\n\n` +
    rows.slice(1).map((r) =>
      `SCENE ${r[0]}   ${r[1]} -> ${r[2]}   (${r[3]})\n` +
      `  audio   ${r[4]}\n` +
      `  visual  ${r[5]}\n` +
      `  screen  ${r[6]}\n` +
      `  says    ${r[7]}\n` +
      `  shows   ${r[8]}\n`).join('\n'));

  // The per-line guide, for anyone retiming a single phrase.
  const lrows = [['Scene', 'Line', 'Start', 'End', 'Duration', 'Audio file', 'Still', 'Narration']];
  lines.forEach((l) => {
    const sceneNo = scenes.findIndex((s) => s.id === l.sceneId) + 1;
    const k = lines.filter((x) => x.sceneId === l.sceneId).indexOf(l) + 1;
    const dur = readWavInfo(path.join(ROOT, 'assets', 'audio', 'lines', `${l.id}.wav`)).duration;
    lrows.push([
      pad2(sceneNo), String(k), tc(l.absoluteStart), tc(l.absoluteStart + dur), dur.toFixed(2) + 's',
      `02_audio/per-line/${pad2(sceneNo)}_scene_line${k}_${l.id}.wav`,
      `03_scenes/states/${pad2(sceneNo)}_scene_state${k}_${l.id}.png`,
      l.text,
    ]);
  });
  fs.writeFileSync(path.join(OUT, 'EDIT_GUIDE_BY_LINE.csv'),
    lrows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n') + '\n');
  console.log(`  EDIT_GUIDE.csv, EDIT_GUIDE.txt, EDIT_GUIDE_BY_LINE.csv`);
}

/* --------------------------------------------------------------- manifest */
if (want('guide')) {
  manifest.film = {
    width: cfg.WIDTH, height: cfg.HEIGHT, fps: cfg.FPS,
    duration: +cfg.totalDuration.toFixed(3),
    scenes: scenes.length, lines: lines.length,
    narrator: `${cfg.voiceover.tts.speakerName} (local Kokoro, speaker ${cfg.voiceover.tts.speakerId})`,
  };
  manifest.scenes = scenes.map((s, i) => ({
    number: i + 1, id: s.id, title: s.title.replace(/^\d+ - /, ''),
    start: +cfg.sceneStarts[i].toFixed(3), duration: s.duration,
    screenText: screenText(s), visual: VISUALS[s.id] ?? '',
    narration: lines.filter((l) => l.sceneId === s.id).map((l) => l.text),
  }));
  const el = path.join(OUT, '04_elements', '_elements.json');
  if (fs.existsSync(el)) manifest.elements = JSON.parse(fs.readFileSync(el, 'utf8'));
  fs.writeFileSync(path.join(OUT, 'MANIFEST.json'), JSON.stringify(manifest, null, 2));
  fs.rmSync(path.join(OUT, '_manifest.partial.json'), {force: true});
  console.log(`  MANIFEST.json`);
}

/* ------------------------------------------------------- 7. project source */
if (want('source')) {
  const dir = path.join(OUT, '06_project_source');
  mkdir(dir);

  // The whole editable project, minus what is installed or regenerated. This
  // is the only artefact in the package that can produce a NEW render rather
  // than a rearrangement of this one.
  const zip = path.join(dir, 'remotion-project-source.zip');
  fs.rmSync(zip, {force: true});
  const r = spawnSync('zip', ['-qr', zip,
    'src', 'scripts', 'render', 'docs', 'package.json', 'package-lock.json',
    'tsconfig.json', 'remotion.config.ts', 'README.md',
    '-x', '*/node_modules/*', '-x', '*.wav', '-x', '*.mp4', '-x', '*/__pycache__/*',
  ], {cwd: ROOT});
  if (r.status !== 0) throw new Error('source zip failed');

  fs.writeFileSync(path.join(dir, 'README.txt'),
`EDITABLE PROJECT SOURCE
${'='.repeat(72)}

remotion-project-source.zip is the project this video is rendered from. It is
a Remotion project: the film is React and TypeScript, rendered to MP4 by a
headless browser. There is no .aep, .prproj or .fcpxml, because none was used -
the "source" is code.

WHAT THAT MEANS FOR EDITING

  Changing wording, timing or colour is a text edit and a re-render. Nothing
  has to be traced or rebuilt. Everything below is one file.

  src/config/scenes.ts      the master timeline: every scene's length, every
                            phrase, when it is said, what is on screen, and the
                            named moment each animation fires on
  src/config/copy.ts        the wording that appears in more than one place -
                            month names, the cycle labels, the worked example
  src/config/branding.ts    colours, fonts, the logo placeholder
  src/config/voiceover.ts   which voice reads it, and how the audio is mixed
  src/scenes/               one file per scene, in order
  src/components/           the parts scenes are built from - the timeline, the
                            year ring, the month rail, the cards, the icons

TO RUN IT

  npm install
  npm run preview     opens Remotion Studio - scrub, jump between scenes, and
                      see edits live
  npm run render      writes output/salary-cycle-update.mp4

  The narration needs the local Kokoro model, which npm run voiceover:build
  fetches on first use. No API key, no paid service.

IF YOU ONLY WANT TO CHANGE THE WORDS

  Edit the phrase in src/config/scenes.ts, then:

    npm run voiceover:build      re-record (locally, free)
    npm run voiceover:plan -- --write    re-time the scenes around the new read
    npm run voiceover:anchor -- --write  put the month markers back on their word
    npm run check:sync && npm run check:brief
    npm run captions && npm run render

  Those are the same commands that produced the film in this package.

WHAT IS NOT IN THE ZIP

  node_modules (npm install restores it), the audio and video files (they are
  already in this package), and the Kokoro model (~325 MB, fetched on demand).
`);
  console.log(`  06_project_source/ remotion-project-source.zip + README`);
}

/* ------------------------------------------------------------- the README */
if (want('guide')) {
  const size = (rel) => {
    const abs = path.join(OUT, rel);
    if (!fs.existsSync(abs)) return '';
    const walk = (d) => fs.statSync(d).isDirectory()
      ? fs.readdirSync(d).reduce((n, f) => n + walk(path.join(d, f)), 0)
      : fs.statSync(d).size;
    const b = walk(abs);
    return b > 1e6 ? `${(b / 1e6).toFixed(0)} MB` : `${(b / 1e3).toFixed(0)} KB`;
  };
  const els = manifest.elements.length ? manifest.elements : [];
  fs.writeFileSync(path.join(OUT, 'README.txt'),
`SALARY CYCLE UPDATE - EDITABLE ASSET PACKAGE
${'='.repeat(72)}

The finished film, taken apart. ${cfg.WIDTH}x${cfg.HEIGHT}, ${cfg.FPS} fps, ${tc(cfg.totalDuration)} long,
${scenes.length} scenes, ${lines.length} narration phrases.

Everything here is generated from the project the film renders from, so it
cannot describe a different video from the one that exists. Re-run it any time
with: npm run export:package && npm run export:stills && npm run export:elements

START HERE
  EDIT_GUIDE.txt          how to put it back together, scene by scene
  EDIT_GUIDE.csv          the same thing for a spreadsheet
  EDIT_GUIDE_BY_LINE.csv  per phrase, for retiming a single line
  MANIFEST.json           all of it as data, if you are scripting against it

01_script/                ${size('01_script')}
  FULL_SCRIPT.txt / .docx     the narration, whole
  SCENE_BY_SCENE.txt / .csv   scene, timing, narration, on-screen text, visual

02_audio/                 ${size('02_audio')}
  narration_full.wav          the entire track. Drop this at 00:00:00 and the
                              film reassembles around it
  per-scene/                  one WAV per scene, cut from that same track, so
                              each starts exactly where its scene starts
  per-line/                   one WAV per phrase, as recorded

  All 48 kHz mono, -16 LUFS. The silence between phrases is part of the edit -
  trimming it is what makes a narration sound rushed.

03_scenes/                ${size('03_scenes')}
  NN_scene_<id>.png           each scene once everything in it has arrived
  states/                     one frame per narration phrase, because several
                              scenes say three or four different things

  Rendered without burned-in captions. Use the .srt if you want them back.

04_elements/              ${size('04_elements')}
  ${els.length} reusable moving parts, each on a TRANSPARENT background:
${els.map((e) => `    ${e.id.padEnd(22)} ${e.title}`).join('\n')}

  Each comes as:
    .webm                     VP9 with alpha. Small. Premiere, Resolve, After
                              Effects and browsers read it. CapCut and Canva
                              do not.
    -png-sequence.zip         ${cfg.FPS} fps PNG frames with alpha. Import as an
                              image sequence. This is the route into CapCut
                              and Canva.

  ProRes 4444 MOVs are available but not built by default - they are about a
  hundred times the size of the WebM. To add them:
    npm run export:elements -- --formats=webm,mov,png

05_captions/              ${size('05_captions')}
  SRT and VTT, timed against narration_full.wav starting at 00:00:00.

06_project_source/        ${size('06_project_source')}
  The project itself. See its README - changing wording or timing is a text
  edit and a re-render, not a rebuild.

${'='.repeat(72)}
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
`);
  console.log(`  README.txt`);
}

/* ---------------------------------------------------- bundling for handover */
if (want('bundle')) {
  const dir = path.join(ROOT, 'output', 'parts');
  fs.rmSync(dir, {recursive: true, force: true});
  mkdir(dir);

  /**
   * Split on the way out, because the package does not travel as one file.
   * The whole thing zips to about 110 MB, over both GitHub's 100 MB file limit
   * and the 30 MiB this chat can attach, so it is delivered in pieces.
   *
   * The pieces break on SCENE boundaries rather than on a byte count, so a part
   * is always whole scenes - stills and their per-phrase states together. A
   * split that lands mid-scene makes the recipient hunt for the other half.
   */
  const LIMIT = 27 * 1024 * 1024;
  const zip = (out, args) => {
    const r = spawnSync('zip', ['-qr', out, ...args], {cwd: path.join(OUT)});
    if (r.status !== 0) throw new Error(`zip failed: ${r.stderr}`);
  };
  const mb = (f) => (fs.statSync(f).size / 1048576).toFixed(1);

  // Everything light, and the elements' WebMs - the part to open first.
  const p1 = path.join(dir, '01-docs-script-captions-elements.zip');
  zip(p1, ['README.txt', 'EDIT_GUIDE.txt', 'EDIT_GUIDE.csv', 'EDIT_GUIDE_BY_LINE.csv',
    'MANIFEST.json', '01_script', '05_captions', '06_project_source', '04_elements',
    '-x', '04_elements/*/*-png-sequence.zip']);

  const p2 = path.join(dir, '02-audio.zip');
  zip(p2, ['02_audio']);

  // Stills, grouped by scene until a group would go over the limit.
  const stills = path.join(OUT, '03_scenes');
  const byScene = new Map();
  const add = (f) => {
    const no = path.basename(f).split('_')[0];
    if (!byScene.has(no)) byScene.set(no, []);
    byScene.get(no).push(path.relative(OUT, f));
  };
  fs.readdirSync(stills).filter((f) => f.endsWith('.png')).forEach((f) => add(path.join(stills, f)));
  const statesDir = path.join(stills, 'states');
  if (fs.existsSync(statesDir)) {
    fs.readdirSync(statesDir).filter((f) => f.endsWith('.png')).forEach((f) => add(path.join(statesDir, f)));
  }

  const groups = [];
  let cur = [], size = 0;
  for (const no of [...byScene.keys()].sort()) {
    const files = byScene.get(no);
    const bytes = files.reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
    if (cur.length && size + bytes > LIMIT) { groups.push(cur); cur = []; size = 0; }
    cur.push(...files); size += bytes;
  }
  if (cur.length) groups.push(cur);

  const made = [p1, p2];
  groups.forEach((files, i) => {
    const nos = [...new Set(files.map((f) => path.basename(f).split('_')[0]))].sort();
    const out = path.join(dir, `${pad2(i + 3)}-stills-scenes-${nos[0]}-to-${nos[nos.length - 1]}.zip`);
    zip(out, files);
    made.push(out);
  });

  console.log(`\n  output/parts/  ${made.length} pieces, each under the 30 MiB attachment limit:`);
  for (const f of made) {
    const over = Number(mb(f)) > 30;
    console.log(`    ${path.basename(f).padEnd(46)} ${mb(f).padStart(6)} MB${over ? '   *** OVER THE LIMIT ***' : ''}`);
    if (over) process.exitCode = 1;
  }
  console.log(`\n  The 20 element PNG sequences stay behind - 290 MB, and the WebMs above\n` +
    `  cover every editor that reads alpha video. Send one on request.`);
}
