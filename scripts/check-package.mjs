#!/usr/bin/env node
/**
 * DOES THE ASSET PACKAGE ACTUALLY HOLD TOGETHER?
 * ----------------------------------------------
 *     npm run check:package
 *
 * The package is a hand-off: once it leaves here nobody can tell a silent
 * failure from a deliberate choice. A WAV of pure silence, a still rendered a
 * frame past its scene, an element whose alpha was flattened to black - all of
 * those look fine in a listing and are useless in an edit.
 *
 * So this opens the files rather than counting them.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT, loadConfig, flatVoiceLines} from './lib/config.mjs';
import {readWavInfo} from './lib/wav.mjs';

const OUT = path.join(ROOT, 'output', 'asset-package');
const cfg = loadConfig();
const lines = flatVoiceLines(cfg);
const pad2 = (n) => String(n).padStart(2, '0');

let failed = 0;
const ok = (m) => console.log(`  PASS  ${m}`);
const no = (m) => { console.log(`  FAIL  ${m}`); failed++; };
const check = (m, cond) => (cond ? ok(m) : no(m));

const exists = (rel) => fs.existsSync(path.join(OUT, rel));

/** Peak sample of a WAV, so silence cannot pass for audio. */
const peak = (file) => {
  const buf = fs.readFileSync(file);
  const data = buf.subarray(buf.indexOf('data') + 8);
  let max = 0;
  for (let i = 0; i + 1 < data.length; i += 2) {
    const v = Math.abs(data.readInt16LE(i));
    if (v > max) max = v;
  }
  return max / 32768;
};

console.log('SCRIPT');
for (const f of ['01_script/FULL_SCRIPT.txt', '01_script/FULL_SCRIPT.docx',
                 '01_script/SCENE_BY_SCENE.csv', '01_script/SCENE_BY_SCENE.txt']) {
  check(f, exists(f) && fs.statSync(path.join(OUT, f)).size > 500);
}
{
  const txt = fs.readFileSync(path.join(OUT, '01_script/FULL_SCRIPT.txt'), 'utf8');
  check('every phrase appears in the script', lines.every((l) => txt.includes(l.text)));
  check('no apostrophe form anywhere in the script', !/KPI['’]s/.test(txt));
}

console.log('\nAUDIO');
{
  const full = path.join(OUT, '02_audio/narration_full.wav');
  check('narration_full.wav exists', fs.existsSync(full));
  if (fs.existsSync(full)) {
    const info = readWavInfo(full);
    check(`full track is ${cfg.totalDuration.toFixed(2)}s (got ${info.duration.toFixed(2)}s)`,
      Math.abs(info.duration - cfg.totalDuration) < 0.05);
    check('full track is not silent', peak(full) > 0.05);
  }
  let quiet = 0, missing = 0, wrong = 0;
  cfg.scenes.forEach((s, i) => {
    const f = path.join(OUT, '02_audio/per-scene', `${pad2(i + 1)}_scene_${s.id}.wav`);
    if (!fs.existsSync(f)) return missing++;
    if (Math.abs(readWavInfo(f).duration - s.duration) > 0.05) wrong++;
    if (peak(f) < 0.02) quiet++;
  });
  check(`all ${cfg.scenes.length} scene WAVs present`, missing === 0);
  check('every scene WAV matches its scene length', wrong === 0);
  check('no scene WAV is silent', quiet === 0);

  let lm = 0, lq = 0;
  lines.forEach((l) => {
    const sceneNo = cfg.scenes.findIndex((s) => s.id === l.sceneId) + 1;
    const k = lines.filter((x) => x.sceneId === l.sceneId).indexOf(l) + 1;
    const f = path.join(OUT, '02_audio/per-line', `${pad2(sceneNo)}_scene_line${k}_${l.id}.wav`);
    if (!fs.existsSync(f)) return lm++;
    if (peak(f) < 0.02) lq++;
  });
  check(`all ${lines.length} line WAVs present`, lm === 0);
  check('no line WAV is silent', lq === 0);
}

console.log('\nSTILLS');
{
  let missing = 0, tiny = 0, notPng = 0;
  const seen = [];
  cfg.scenes.forEach((s, i) => seen.push(`03_scenes/${pad2(i + 1)}_scene_${s.id}.png`));
  lines.forEach((l) => {
    const sceneNo = cfg.scenes.findIndex((s) => s.id === l.sceneId) + 1;
    const k = lines.filter((x) => x.sceneId === l.sceneId).indexOf(l) + 1;
    seen.push(`03_scenes/states/${pad2(sceneNo)}_scene_state${k}_${l.id}.png`);
  });
  for (const rel of seen) {
    const f = path.join(OUT, rel);
    if (!fs.existsSync(f)) { missing++; continue; }
    if (fs.statSync(f).size < 20000) tiny++;
    const b = fs.readFileSync(f).subarray(0, 24);
    if (b.readUInt32BE(16) !== cfg.WIDTH || b.readUInt32BE(20) !== cfg.HEIGHT) notPng++;
  }
  check(`all ${seen.length} stills present`, missing === 0);
  check('no still is a blank or near-empty frame', tiny === 0);
  check(`every still is ${cfg.WIDTH}x${cfg.HEIGHT}`, notPng === 0);
}

console.log('\nELEMENTS');
{
  const specs = cfg.elementSpecs;
  let missing = 0, flat = 0, checked = 0;
  for (const spec of specs) {
    const webm = path.join(OUT, '04_elements', spec.id, `${spec.id}.webm`);
    if (!fs.existsSync(webm)) { missing++; continue; }
    // Decode a frame from the middle and look at the alpha channel. ffprobe
    // reports a WebM with alpha as yuv420p, so the pixel format proves nothing.
    const tmp = path.join(OUT, '04_elements', spec.id, '_alpha.png');
    const r = spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
      '-vcodec', 'libvpx-vp9', '-ss', String(spec.duration * 0.6), '-i', webm,
      '-frames:v', '1', '-pix_fmt', 'rgba', tmp], {cwd: ROOT});
    if (r.status !== 0 || !fs.existsSync(tmp)) { flat++; continue; }
    const colourType = fs.readFileSync(tmp).readUInt8(25);
    if (colourType !== 6) flat++;            // 6 = RGBA
    fs.rmSync(tmp, {force: true});
    checked++;
  }
  check(`all ${specs.length} element WebMs present`, missing === 0);
  check(`every element decodes with an alpha channel (${checked} checked)`, flat === 0);

  let seqMissing = 0;
  for (const spec of specs) {
    if (!exists(`04_elements/${spec.id}/${spec.id}-png-sequence.zip`)) seqMissing++;
  }
  check('every element has its PNG sequence', seqMissing === 0);
}

console.log('\nCAPTIONS AND GUIDES');
for (const f of ['05_captions/salary-cycle-update.srt', '05_captions/salary-cycle-update.vtt',
                 'EDIT_GUIDE.csv', 'EDIT_GUIDE.txt', 'EDIT_GUIDE_BY_LINE.csv',
                 'MANIFEST.json', 'README.txt', '06_project_source/remotion-project-source.zip']) {
  check(f, exists(f) && fs.statSync(path.join(OUT, f)).size > 200);
}
{
  const srt = fs.readFileSync(path.join(OUT, '05_captions/salary-cycle-update.srt'), 'utf8');
  check('captions say "Company Performance KPIs"', srt.includes('Company Performance KPIs'));
  check('captions never use the apostrophe form', !/KPI['’]s/.test(srt));

  const guide = fs.readFileSync(path.join(OUT, 'EDIT_GUIDE.csv'), 'utf8');
  check(`edit guide lists all ${cfg.scenes.length} scenes`, guide.trim().split('\n').length === cfg.scenes.length + 1);

  const m = JSON.parse(fs.readFileSync(path.join(OUT, 'MANIFEST.json'), 'utf8'));
  check('manifest duration matches the film', Math.abs(m.film.duration - cfg.totalDuration) < 0.01);
  check('manifest lists every line', m.lines.length === lines.length);
  check('every file the manifest names exists', m.lines.every((l) => exists(l.file)));
}

console.log();
if (failed) { console.log(`${failed} check(s) failed.`); process.exit(1); }
console.log('Package is complete and internally consistent.');
