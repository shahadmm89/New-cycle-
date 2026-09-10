#!/usr/bin/env node
/**
 * VOICE-OVER PIPELINE
 * -------------------
 * Turns the script in src/config/scenes.ts into assets/audio/voiceover.wav,
 * a single 90-second track in which every line already sits at the exact
 * moment the animation expects it.
 *
 * Steps:
 *   1. synthesise each line on its own (local neural TTS - no data leaves the machine)
 *   2. measure it, and if it would run past its slot, re-say it slightly faster
 *      (never below `minLengthScale`, so it can't turn into a rushed mumble)
 *   3. lay the lines onto one silent 90-second bed at their configured times
 *   4. normalise loudness and write the track
 *   5. write the measured durations back to src/config/voiceover.timing.ts so
 *      the subtitles land on the narration
 *
 * Usage:
 *   npm run voiceover:build              synthesise + assemble
 *   npm run voiceover:build -- --assemble-only   re-assemble existing line WAVs
 *
 * If you would rather use a different voice, see docs/VOICEOVER.md - you can
 * drop your own per-line recordings into assets/audio/lines/ and run
 * --assemble-only, or replace assets/audio/voiceover.wav wholesale.
 */
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import {ROOT, loadConfig, flatVoiceLines} from './lib/config.mjs';
import {readWavInfo} from './lib/wav.mjs';

const LINES_DIR = path.join(ROOT, 'assets', 'audio', 'lines');
const OUT_WAV = path.join(ROOT, 'assets', 'audio', 'voiceover.wav');
const VOICES_DIR = path.join(ROOT, 'assets', 'tts', 'voices');
const TIMING_TS = path.join(ROOT, 'src', 'config', 'voiceover.timing.ts');

const assembleOnly = process.argv.includes('--assemble-only');

const config = loadConfig();
const tts = config.voiceover.tts;
const lines = flatVoiceLines(config);

const ffmpeg = (args) => {
  const res = spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-loglevel', 'error', ...args], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (res.status !== 0) {
    throw new Error(`ffmpeg failed:\n${res.stderr?.toString()}`);
  }
};

/**
 * Piper voice models are ~63 MB, too large to keep in git. Fetch on demand.
 * Mirrored by the sherpa-onnx project, which republishes the Piper voices.
 */
const MIRROR = 'https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models';

const ensureVoice = async () => {
  const model = path.join(VOICES_DIR, `${tts.voice}.onnx`);
  if (fs.existsSync(model)) return model;

  fs.mkdirSync(VOICES_DIR, {recursive: true});
  const archive = path.join(VOICES_DIR, `${tts.voice}.tar.bz2`);
  const url = `${MIRROR}/vits-piper-${tts.voice}.tar.bz2`;
  console.log(`> voice model missing, downloading ${tts.voice}…`);

  await new Promise((resolve, reject) => {
    const get = (u, depth = 0) => {
      if (depth > 5) return reject(new Error('too many redirects'));
      https
        .get(u, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            res.resume();
            return get(res.headers.location, depth + 1);
          }
          if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${u}`));
          const file = fs.createWriteStream(archive);
          res.pipe(file);
          file.on('finish', () => file.close(resolve));
        })
        .on('error', reject);
    };
    get(url);
  });

  execFileSync('tar', ['xjf', archive, '-C', VOICES_DIR, '--strip-components=1',
    `vits-piper-${tts.voice}/${tts.voice}.onnx`,
    `vits-piper-${tts.voice}/${tts.voice}.onnx.json`]);
  fs.rmSync(archive, {force: true});
  return model;
};

const synthesise = (model, text, out, lengthScale) => {
  const res = spawnSync(
    'python3',
    [
      path.join(ROOT, 'scripts', 'lib', 'tts.py'),
      model,
      out,
      String(lengthScale),
      String(tts.noiseScale),
      String(tts.noiseW),
    ],
    {input: text, cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe']},
  );
  if (res.status !== 0) {
    throw new Error(`Text-to-speech failed:\n${res.stderr?.toString()}`);
  }
};

const run = async () => {
  fs.mkdirSync(LINES_DIR, {recursive: true});
  fs.mkdirSync(path.dirname(OUT_WAV), {recursive: true});

  const durations = {};
  const warnings = [];

  if (assembleOnly) {
    console.log('> assemble-only: using the WAVs already in assets/audio/lines');
  } else {
    const model = await ensureVoice();
    console.log(`> voice: ${tts.voice}`);
    for (const line of lines) {
      const out = path.join(LINES_DIR, `${line.id}.wav`);
      const text = line.spoken ?? line.text;

      let scale = tts.lengthScale;
      synthesise(model, text, out, scale);
      let info = readWavInfo(out);

      // If the line would spill into the next one, say it a little faster -
      // but never faster than the configured floor.
      if (info.duration > line.window) {
        const wanted = Math.max(tts.minLengthScale, scale * (line.window / info.duration) * 0.98);
        if (wanted < scale) {
          synthesise(model, text, out, wanted);
          info = readWavInfo(out);
          scale = wanted;
        }
      }
      if (info.duration > line.window + 0.05) {
        warnings.push(
          `${line.id} runs ${info.duration.toFixed(2)}s but only has ${line.window.toFixed(2)}s ` +
            `(scene "${line.sceneId}") - shorten the line or lengthen the scene in src/config/scenes.ts`,
        );
      }
      durations[line.id] = Number(info.duration.toFixed(3));
      console.log(
        `  ${line.id.padEnd(7)} ${info.duration.toFixed(2)}s / ${line.window.toFixed(2)}s  ` +
          `(rate ${scale.toFixed(2)})`,
      );
    }
  }

  // Fill in anything we did not synthesise this run.
  for (const line of lines) {
    const file = path.join(LINES_DIR, `${line.id}.wav`);
    if (!fs.existsSync(file)) throw new Error(`Missing audio for line "${line.id}" (${file})`);
    if (durations[line.id] === undefined) {
      durations[line.id] = Number(readWavInfo(file).duration.toFixed(3));
    }
  }

  // --- assemble ------------------------------------------------------------
  const inputs = [];
  const filters = [];
  lines.forEach((line, i) => {
    inputs.push('-i', path.join(LINES_DIR, `${line.id}.wav`));
    const delayMs = Math.round(line.absoluteStart * 1000);
    filters.push(
      `[${i}:a]aresample=${tts.sampleRate},aformat=sample_fmts=fltp:channel_layouts=stereo,` +
        `adelay=${delayMs}|${delayMs}[a${i}]`,
    );
  });
  const mixInputs = lines.map((_, i) => `[a${i}]`).join('');
  filters.push(
    `${mixInputs}amix=inputs=${lines.length}:normalize=0:dropout_transition=0[mix]`,
    `[mix]loudnorm=I=${tts.loudnessTarget}:TP=-1.5:LRA=11,apad,atrim=0:${config.totalDuration},` +
      `aresample=${tts.sampleRate}[out]`,
  );

  console.log('> assembling narration track…');
  ffmpeg([
    '-y',
    ...inputs,
    '-filter_complex', filters.join(';'),
    '-map', '[out]',
    '-c:a', 'pcm_s16le',
    OUT_WAV,
  ]);

  const final = readWavInfo(OUT_WAV);
  console.log(
    `  ${path.relative(ROOT, OUT_WAV)}  ${final.duration.toFixed(2)}s ` +
      `${final.sampleRate}Hz ${final.channels}ch`,
  );

  // --- write measured timings back for the captions ------------------------
  const body = Object.entries(durations)
    .map(([id, d]) => `  '${id}': ${d},`)
    .join('\n');
  fs.writeFileSync(
    TIMING_TS,
    `/**
 * MEASURED VOICE-OVER DURATIONS (seconds), keyed by voice-line id.
 *
 * Auto-generated by \`npm run voiceover:build\` from the rendered audio, so that
 * captions land exactly on the narration. If you supply your own recording,
 * re-run that script (or edit these numbers by hand) to re-sync the subtitles.
 */
export const measuredDurations: Record<string, number> = {
${body}
};
`,
  );
  console.log(`  ${path.relative(ROOT, TIMING_TS)} updated`);

  if (warnings.length) {
    console.log('\n! timing warnings:');
    warnings.forEach((w) => console.log(`  - ${w}`));
  }
};

run().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
