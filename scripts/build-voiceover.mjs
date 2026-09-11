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
const OUT_VOICE = path.join(ROOT, 'assets', 'audio', 'voiceover.wav');
const OUT_MUSIC = path.join(ROOT, 'assets', 'audio', 'music.wav');
const OUT_MIX = path.join(ROOT, 'assets', 'audio', 'mix.wav');
const VOICES_DIR = path.join(ROOT, 'assets', 'tts', 'voices');
const TIMING_TS = path.join(ROOT, 'src', 'config', 'voiceover.timing.ts');

const assembleOnly = process.argv.includes('--assemble-only');

const config = loadConfig();
const tts = config.voiceover.tts;
const lines = flatVoiceLines(config);

/** Runs a child process and surfaces its output, failing loudly. */
const exec = (cmd, args) => {
  const res = spawnSync(cmd, args, {cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe']});
  if (res.status !== 0) {
    throw new Error(`${cmd} failed:\n${res.stderr?.toString() || res.stdout?.toString()}`);
  }
  const out = res.stdout?.toString().trim();
  if (out) console.log(`  ${out}`);
  return out;
};

const ffmpeg = (args, {loglevel = 'error'} = {}) => {
  const res = spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-loglevel', loglevel, ...args], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (res.status !== 0) {
    throw new Error(`ffmpeg failed:\n${res.stderr?.toString()}`);
  }
  return `${res.stdout?.toString() ?? ''}${res.stderr?.toString() ?? ''}`;
};

/**
 * Measures EBU R128 loudness. ffmpeg's single-pass `loudnorm` filter is a
 * dynamic normaliser and drifts badly on a track that is a third silence, so
 * we measure first and apply a flat gain instead - which hits the target
 * exactly and leaves the delivery's own dynamics alone.
 */
const measureLoudness = (file) => {
  const out = ffmpeg(['-i', file, '-af', 'loudnorm=print_format=summary', '-f', 'null', '-'], {
    loglevel: 'info',
  });
  const grab = (label) => {
    const m = out.match(new RegExp(`${label}:\\s*(-?[0-9.]+|-inf)`));
    return m ? Number(m[1]) : NaN;
  };
  return {integrated: grab('Input Integrated'), truePeak: grab('Input True Peak')};
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
  fs.mkdirSync(path.dirname(OUT_VOICE), {recursive: true});

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

      // `rate` in scenes.ts is what creates the emphasis: the phrases that
      // carry the message are delivered slower and heavier than the rest.
      let scale = tts.lengthScale * (line.rate ?? 1);
      synthesise(model, text, out, scale);
      let info = readWavInfo(out);

      // If the line would spill into the next one, say it a little faster -
      // but never faster than the configured floor.
      if (info.duration > line.window) {
        const floor = tts.minLengthScale * (line.rate ?? 1);
        const wanted = Math.max(floor, scale * (line.window / info.duration) * 0.98);
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
    `[mix]apad,atrim=0:${config.totalDuration},aresample=${tts.sampleRate}[out]`,
  );

  console.log('> assembling narration track…');
  const rawVoice = path.join(LINES_DIR, '_assembled.wav');
  ffmpeg([
    '-y',
    ...inputs,
    '-filter_complex', filters.join(';'),
    '-map', '[out]',
    '-ac', '1',
    '-c:a', 'pcm_s16le',
    rawVoice,
  ]);

  const measured = measureLoudness(rawVoice);
  const TRUE_PEAK_CEILING = -1.5;
  let gainDb = tts.loudnessTarget - measured.integrated;
  if (measured.truePeak + gainDb > TRUE_PEAK_CEILING) {
    gainDb = TRUE_PEAK_CEILING - measured.truePeak;
  }
  console.log(
    `  measured ${measured.integrated.toFixed(1)} LUFS / ${measured.truePeak.toFixed(1)} dBTP ` +
      `-> applying ${gainDb >= 0 ? '+' : ''}${gainDb.toFixed(1)} dB`,
  );
  ffmpeg(['-y', '-i', rawVoice, '-af', `volume=${gainDb.toFixed(2)}dB`, '-c:a', 'pcm_s16le', OUT_VOICE]);
  fs.rmSync(rawVoice, {force: true});

  const narration = readWavInfo(OUT_VOICE);
  console.log(
    `  ${path.relative(ROOT, OUT_VOICE)}  ${narration.duration.toFixed(2)}s ` +
      `${narration.sampleRate}Hz ${narration.channels}ch`,
  );

  // --- background bed + duck ----------------------------------------------
  const music = config.voiceover.music;
  if (music.enabled) {
    console.log('> generating background bed…');
    exec('python3', [
      path.join(ROOT, 'scripts', 'lib', 'music.py'),
      OUT_MUSIC,
      String(config.totalDuration),
      String(tts.sampleRate),
    ]);
    console.log('> ducking bed under the narration…');
    exec('python3', [
      path.join(ROOT, 'scripts', 'lib', 'mix.py'),
      OUT_VOICE,
      OUT_MUSIC,
      OUT_MIX,
      String(music.bedGainDb),
      String(music.duckDb),
      String(music.fadeIn),
      String(music.fadeOut),
    ]);
  } else {
    fs.copyFileSync(OUT_VOICE, OUT_MIX);
    console.log('  music disabled - mix is narration only');
  }

  const final = readWavInfo(OUT_MIX);
  console.log(
    `  ${path.relative(ROOT, OUT_MIX)}  ${final.duration.toFixed(2)}s ` +
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
