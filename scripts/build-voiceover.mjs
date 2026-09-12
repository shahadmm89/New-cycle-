#!/usr/bin/env node
/**
 * VOICE-OVER PIPELINE
 * -------------------
 * Turns the script in src/config/scenes.ts into assets/audio/voiceover.wav,
 * a single track in which every line already sits at the exact
 * moment the animation expects it.
 *
 * Steps:
 *   1. synthesise each line on its own (local neural TTS - no data leaves the machine)
 *   2. measure it, and if it would run past its slot, re-say it slightly faster
 *      (never below `minLengthScale`, so it can't turn into a rushed mumble)
 *   3. lay the lines onto one silent bed at their configured times
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
import {synthesise as elevenLabsSay} from './lib/tts_elevenlabs.mjs';
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
  if (tts.engine === 'elevenlabs') {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error(
        `ELEVENLABS_API_KEY is not set, and engine is "elevenlabs".\n` +
          `  It is needed for the account licensed to use ${tts.elevenlabs.voiceName}.\n` +
          `    export ELEVENLABS_API_KEY=...\n` +
          `  Or set engine: 'kokoro' in src/config/voiceover.ts to use the local voice.`,
      );
    }
    return null;
  }
  if (tts.engine === 'kokoro') {
    const dir = path.join(ROOT, 'assets', 'tts', 'kokoro');
    if (!fs.existsSync(path.join(dir, 'model.onnx'))) {
      throw new Error(
        `Kokoro model not found at ${dir}.\n` +
          `Fetch it with:\n` +
          `  curl -L -o /tmp/kokoro.tar.bz2 ${MIRROR}/kokoro-multi-lang-v1_0.tar.bz2\n` +
          `  mkdir -p ${dir} && tar xjf /tmp/kokoro.tar.bz2 -C ${dir} --strip-components=1`,
      );
    }
    return dir;
  }
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

/**
 * Says one phrase. `pace` is the engine's own speed control, so the phrase is
 * re-synthesised at that rate rather than time-stretched afterwards - which is
 * what keeps a slower delivery sounding natural instead of dragged out.
 */
const synthesise = async (model, text, out, pace) => {
  if (tts.engine === 'elevenlabs') {
    // `pace` arrives in the local engines' convention, where the base is the
    // configured speed. ElevenLabs takes a multiplier of the voice's own pace,
    // so send the ratio rather than the absolute number.
    const {pcm, sampleRate} = await elevenLabsSay(text, {
      cfg: tts.elevenlabs,
      speed: (pace / tts.elevenlabs.speed) * tts.elevenlabs.speed,
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
    writeWav(out, pcm, sampleRate);
    return;
  }
  const args =
    tts.engine === 'kokoro'
      ? [path.join(ROOT, 'scripts', 'lib', 'tts_kokoro.py'), model, out, String(tts.speakerId), String(pace)]
      : [path.join(ROOT, 'scripts', 'lib', 'tts.py'), model, out, String(pace), String(tts.noiseScale), String(tts.noiseW)];
  const res = spawnSync('python3', args, {input: text, cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe']});
  if (res.status !== 0) {
    throw new Error(`Text-to-speech failed:\n${res.stderr?.toString()}`);
  }
};

/** Wraps raw mono 16-bit PCM as a WAV, so every engine hands back the same thing. */
const writeWav = (out, pcm, sampleRate) => {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);          // PCM
  header.writeUInt16LE(1, 22);          // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(out, Buffer.concat([header, pcm]));
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
    console.log(
      `> voice: ${
        tts.engine === 'elevenlabs'
          ? `${tts.elevenlabs.voiceName} (elevenlabs ${tts.elevenlabs.voiceId})`
          : tts.engine === 'kokoro'
            ? `${tts.speakerName} (kokoro #${tts.speakerId})`
            : tts.voice
      }`,
    );
    for (const line of lines) {
      const out = path.join(LINES_DIR, `${line.id}.wav`);
      const text = line.spoken ?? line.text;

      // `rate` in scenes.ts is what creates the emphasis: the phrases that
      // carry the message are delivered slower and heavier than the rest.
      // Kokoro's control is a speed multiplier (lower is slower); Piper's is a
      // length scale (higher is slower), so the direction differs.
      const base =
        tts.engine === 'kokoro' ? tts.speed
        : tts.engine === 'elevenlabs' ? tts.elevenlabs.speed
        : tts.lengthScale;
      // Higher `rate` means a heavier, slower delivery. For the two engines whose
      // control is a speed that means dividing; for Piper's length scale, multiplying.
      let scale =
        tts.engine === 'piper' ? base * (line.rate ?? 1) : base / (line.rate ?? 1);
      await synthesise(model, text, out, scale);
      let info = readWavInfo(out);

      // If the line would spill into the next one, say it a little faster -
      // but never faster than the configured floor.
      if (info.duration > line.window) {
        const speedControlled = tts.engine !== 'piper';
        const ceiling = speedControlled
          ? (tts.engine === 'elevenlabs' ? 1.2 : tts.minSpeed)
          : tts.minLengthScale * (line.rate ?? 1);
        const wanted = speedControlled
          ? Math.min(ceiling, scale * (info.duration / line.window) * 1.02)
          : Math.max(ceiling, scale * (line.window / info.duration) * 0.98);
        if (speedControlled ? wanted > scale : wanted < scale) {
          await synthesise(model, text, out, wanted);
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
          `(pace ${scale.toFixed(3)})`,
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

  // Optional pitch trim: resample to shift pitch, then restore the original
  // duration with atempo so nothing downstream has to be re-timed.
  const semis = tts.pitchShiftSemitones ?? 0;
  if (Math.abs(semis) > 0.01) {
    const ratio = Math.pow(2, semis / 12);
    const shifted = path.join(LINES_DIR, '_pitched.wav');
    console.log(`> pitch trim ${semis > 0 ? '+' : ''}${semis} semitones`);
    ffmpeg([
      '-y', '-i', rawVoice,
      '-af',
      `asetrate=${Math.round(tts.sampleRate * ratio)},aresample=${tts.sampleRate},atempo=${(1 / ratio).toFixed(6)}`,
      '-c:a', 'pcm_s16le', shifted,
    ]);
    fs.renameSync(shifted, rawVoice);
  }

  // Bring the narration to the target. Peaks are left alone here - the mix
  // stage limits them, which is what lets the level actually reach the target
  // instead of being held down by the single loudest consonant.
  const measured = measureLoudness(rawVoice);
  const gainDb = tts.loudnessTarget - measured.integrated;
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
  if (!music.enabled) {
    // Still goes through mix.py: the loudness pass and the limiter live there,
    // and they own the ceiling. A straight copy would be free to clip.
    console.log('> narration only - no background bed');
    exec('python3', [
      path.join(ROOT, 'scripts', 'lib', 'mix.py'),
      OUT_VOICE, 'none', OUT_MIX,
      '-200', String(music.duckDb), String(music.fadeIn), String(music.fadeOut),
      String(tts.loudnessTarget), '-1.5',
    ]);
    fs.rmSync(OUT_MUSIC, {force: true});
  } else {
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
      String(tts.loudnessTarget),
      '-1.5',
    ]);
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
