/**
 * Lets plain Node scripts read the well-being film's TypeScript config.
 *
 * Same approach as scripts/lib/config.mjs: compile the config with the
 * project's own TypeScript and require the result, rather than duplicating the
 * timeline in JavaScript where it could drift from the film.
 */
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CACHE = path.join(ROOT, '.cache', 'wellbeing');

const SOURCES = [
  'src/config/wellbeing.ts',
  'src/config/wellbeing.audio.ts',
  'src/wellbeing/captions.ts',
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

export const loadWellbeing = () => {
  compile();
  const require = createRequire(import.meta.url);
  const timeline = require(path.join(CACHE, 'config', 'wellbeing.js'));
  const audio = require(path.join(CACHE, 'config', 'wellbeing.audio.js'));
  const captions = require(path.join(CACHE, 'wellbeing', 'captions.js'));
  return {...timeline, audio, captions};
};
