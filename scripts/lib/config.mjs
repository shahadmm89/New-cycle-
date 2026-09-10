/**
 * Lets plain Node scripts read the project's TypeScript configuration.
 *
 * src/config/*.ts is the single source of truth for timing, wording and the
 * voice-over script. Rather than duplicating any of it, the scripts compile
 * those files with the project's own TypeScript and require the result, so a
 * change to the config is picked up by the video, the captions and the
 * narration at the same time.
 */
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CACHE = path.join(ROOT, '.cache', 'config');

const SOURCES = [
  'src/config/copy.ts',
  'src/config/scenes.ts',
  'src/config/voiceover.ts',
  'src/config/branding.ts',
  'src/config/voiceover.timing.ts',
  // The subtitle cue logic the video itself uses, so the .srt cannot drift
  // from the burned-in captions.
  'src/lib/captions.ts',
];

let compiled = false;

const compile = () => {
  if (compiled) return;
  fs.rmSync(CACHE, {recursive: true, force: true});
  fs.mkdirSync(CACHE, {recursive: true});
  execFileSync(
    process.execPath,
    [
      path.join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc'),
      ...SOURCES.map((s) => path.join(ROOT, s)),
      '--outDir', CACHE,
      '--rootDir', path.join(ROOT, 'src'),
      '--module', 'commonjs',
      '--target', 'es2020',
      '--skipLibCheck',
      '--esModuleInterop',
    ],
    {cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe']},
  );
  compiled = true;
};

export const loadConfig = () => {
  compile();
  const require = createRequire(import.meta.url);
  const flush = (p) => delete require.cache[require.resolve(p)];
  const scenesPath = path.join(CACHE, 'config', 'scenes.js');
  const copyPath = path.join(CACHE, 'config', 'copy.js');
  const voPath = path.join(CACHE, 'config', 'voiceover.js');
  const brandPath = path.join(CACHE, 'config', 'branding.js');
  const captionsPath = path.join(CACHE, 'lib', 'captions.js');
  [scenesPath, copyPath, voPath, brandPath, captionsPath].forEach(flush);

  const scenes = require(scenesPath);
  return {
    ...scenes,
    copy: require(copyPath),
    voiceover: require(voPath).voiceover,
    branding: require(brandPath),
    captions: require(captionsPath),
  };
};

/** Every voice line in the film, in order, with absolute start times. */
export const flatVoiceLines = (config) => {
  const flat = [];
  config.scenes.forEach((scene, i) => {
    scene.voice.forEach((line) => {
      flat.push({
        ...line,
        sceneId: scene.id,
        sceneTitle: scene.title,
        absoluteStart: config.sceneStarts[i] + line.start,
      });
    });
  });
  flat.sort((a, b) => a.absoluteStart - b.absoluteStart);
  flat.forEach((line, i) => {
    const next = flat[i + 1]?.absoluteStart ?? config.totalDuration;
    // Leave a small breath before the next line starts.
    line.window = Math.max(0.5, next - line.absoluteStart - 0.18);
  });
  return flat;
};
