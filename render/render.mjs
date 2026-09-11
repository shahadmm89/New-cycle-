#!/usr/bin/env node
/**
 * Renders the film to MP4.
 *
 *   node render/render.mjs production   -> 1920x1080, H.264 high quality (default)
 *   node render/render.mjs preview      -> 960x540, fast, for review
 *   node render/render.mjs all          -> both
 *
 * Extra flags:
 *   --no-captions   render the composition without burned-in subtitles
 *   --concurrency=N override the worker count
 */
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {findBrowser} from './browser.mjs';

const browserExecutable = findBrowser();
if (browserExecutable) console.log(`> using browser: ${browserExecutable}`);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'output');

const args = process.argv.slice(2);
const mode = args.find((a) => !a.startsWith('--')) ?? 'production';
const noCaptions = args.includes('--no-captions');
const concurrencyArg = args.find((a) => a.startsWith('--concurrency='));

const PROFILES = {
  production: {
    name: 'production',
    scale: 1,
    crf: 17,
    jpegQuality: 95,
    file: 'salary-cycle-update.mp4',
    // Lossless frames: large flat type on a dark field is exactly the sort of
    // high-contrast edge that JPEG's chroma subsampling smears.
    imageFormat: 'png',
  },
  preview: {
    name: 'preview',
    scale: 0.5,
    crf: 26,
    jpegQuality: 80,
    file: 'salary-cycle-update-preview.mp4',
    imageFormat: 'jpeg',
  },
};

const compositionId = noCaptions ? 'SalaryCycleUpdate-NoCaptions' : 'SalaryCycleUpdate';

const run = async () => {
  fs.mkdirSync(outDir, {recursive: true});

  const profiles =
    mode === 'all' ? [PROFILES.preview, PROFILES.production] : [PROFILES[mode] ?? PROFILES.production];

  console.log('> bundling…');
  const serveUrl = await bundle({
    entryPoint: path.join(root, 'src', 'index.ts'),
    publicDir: path.join(root, 'assets'),
    onProgress: (p) => {
      if (p % 25 === 0) process.stdout.write(`  bundle ${p}%\r`);
    },
  });

  for (const profile of profiles) {
    const composition = await selectComposition({serveUrl, id: compositionId, inputProps: {}, browserExecutable});
    const outputLocation = path.join(
      outDir,
      noCaptions ? profile.file.replace('.mp4', '-no-captions.mp4') : profile.file,
    );

    console.log(
      `\n> rendering ${profile.name}: ${Math.round(composition.width * profile.scale)}x${Math.round(
        composition.height * profile.scale,
      )} @ ${composition.fps}fps, ${composition.durationInFrames} frames`,
    );

    const started = Date.now();
    let last = -1;
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      // yuv420p + Rec.709 is what Teams, Outlook, SharePoint and browsers expect.
      // Without the explicit colour space the encoder tags the file as
      // full-range yuvj420p/bt470bg, which some players shift the colours of.
      pixelFormat: 'yuv420p',
      colorSpace: 'bt709',
      x264Preset: profile.name === 'preview' ? 'veryfast' : 'slow',
      crf: profile.crf,
      jpegQuality: profile.jpegQuality,
      imageFormat: profile.imageFormat,
      scale: profile.scale,
      audioCodec: 'aac',
      audioBitrate: '192k',
      enforceAudioTrack: true,
      outputLocation,
      concurrency: concurrencyArg ? Number(concurrencyArg.split('=')[1]) : undefined,
      chromiumOptions: {gl: 'angle'},
      browserExecutable,
      onProgress: ({progress}) => {
        const pct = Math.floor(progress * 100);
        if (pct !== last) {
          last = pct;
          process.stdout.write(`  ${pct}%\r`);
        }
      },
    });
    const size = (fs.statSync(outputLocation).size / 1_000_000).toFixed(1);
    console.log(`  done in ${((Date.now() - started) / 1000).toFixed(0)}s -> ${outputLocation} (${size} MB)`);
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
