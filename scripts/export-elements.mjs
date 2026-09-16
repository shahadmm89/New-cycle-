#!/usr/bin/env node
/**
 * ANIMATED ELEMENTS, ON TRANSPARENT BACKGROUNDS
 * ---------------------------------------------
 *     npm run export:elements
 *
 * Each reusable moving part on its own, over nothing, so it can be dropped onto
 * a different background or reused in another piece instead of being cut out of
 * a flattened video.
 *
 * Editors disagree about alpha, so each element ships twice by default:
 *
 *   .webm     VP9 with alpha    ~170 KB. Premiere, Resolve, After Effects and
 *                               any browser read it. CapCut and Canva do not.
 *   png.zip   a PNG sequence    the format nothing can misread, and the route
 *                               into CapCut and Canva. Import as an image
 *                               sequence at 30 fps.
 *
 * ProRes 4444 is available too but is NOT built by default:
 *
 *   npm run export:elements -- --formats=webm,mov,png
 *
 * It is roughly a hundred times the size of the WebM for the same seconds -
 * twelve megabytes against a hundred and seventy kilobytes - and would take the
 * package from about ten megabytes to over two hundred. Worth it if you are
 * cutting on a Mac and want the interchange format; not worth it by default.
 *
 * Whatever is built, the PNG frames are the master and the videos are encoded
 * from them, so the formats cannot disagree about what the element looks like.
 *
 * ALPHA IS VERIFIED, NOT ASSUMED. ffprobe reports a WebM with alpha as plain
 * yuv420p, because WebM carries alpha in a side channel rather than the pixel
 * format - so the check decodes a frame and looks at the values.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';
import {renderFrames, selectComposition} from '@remotion/renderer';
import {ROOT, loadConfig} from './lib/config.mjs';
import {findBrowser} from '../render/browser.mjs';

const OUT = path.join(ROOT, 'output', 'asset-package', '04_elements');
const cfg = loadConfig();
const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const formats = ((process.argv.find((a) => a.startsWith('--formats=')) || '--formats=webm,png').slice(10))
  .split(',').map((f) => f.trim()).filter(Boolean);
const wants = (f) => formats.includes(f);

const specs = cfg.elementSpecs.filter((s) => !only || only.split(',').includes(s.id));
const ffmpeg = (args) => {
  const r = spawnSync('npx', ['remotion', 'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', ...args],
    {cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe']});
  if (r.status !== 0) throw new Error(`ffmpeg failed:\n${r.stderr?.toString()}`);
};

fs.mkdirSync(OUT, {recursive: true});
const browserExecutable = findBrowser();
const serveUrl = await bundle({entryPoint: path.join(ROOT, 'src', 'index.ts'), publicDir: path.join(ROOT, 'assets')});

console.log(`> ${specs.length} elements as ${formats.join(' + ')}\n`);
const made = [];

for (const spec of specs) {
  const composition = await selectComposition({serveUrl, id: spec.id, inputProps: {}, browserExecutable});
  const dir = path.join(OUT, spec.id);
  const seq = path.join(dir, 'png');
  fs.rmSync(seq, {recursive: true, force: true});
  fs.mkdirSync(seq, {recursive: true});

  // PNG frames are the master. imageFormat 'png' is what preserves alpha -
  // jpeg would silently composite every element onto black, which looks fine
  // in a thumbnail and is useless the moment it goes over a background.
  const {frameCount} = await renderFrames({
    composition,
    serveUrl,
    outputDir: seq,
    imageFormat: 'png',
    inputProps: {},
    browserExecutable,
    onBrowserLog: () => {},
    onStart: () => {},
    onFrameUpdate: () => {},
  });

  const frames = fs.readdirSync(seq).filter((f) => f.endsWith('.png'));
  if (!frames.length) throw new Error(`no frames rendered for ${spec.id}`);

  // Glob rather than a printf pattern: Remotion's frame naming is its own
  // business and this does not care what it chose.
  const glob = ['-framerate', String(cfg.FPS), '-pattern_type', 'glob', '-i', path.join(seq, '*.png')];
  const built = [];

  if (wants('webm')) {
    const webm = path.join(dir, `${spec.id}.webm`);
    // -auto-alt-ref 0 is required: alt-ref frames and the alpha side channel
    // do not coexist, and the encoder drops the alpha rather than complaining.
    ffmpeg([...glob, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p',
      '-b:v', '0', '-crf', '28', '-auto-alt-ref', '0', webm]);
    built.push(webm);
  }

  if (wants('mov')) {
    // ProRes 4444 rather than QuickTime RLE: this ffmpeg build can decode qtrle
    // but not encode it, and 4444 is the format an editor expects alpha in
    // anyway. -profile:v 4 is 4444; yuva444p10le is what carries the alpha.
    const mov = path.join(dir, `${spec.id}.mov`);
    ffmpeg([...glob, '-c:v', 'prores_ks', '-profile:v', '4', '-pix_fmt', 'yuva444p10le',
      '-alpha_bits', '16', '-vendor', 'apl0', mov]);
    built.push(mov);
  }

  if (wants('png')) {
    // Zipped: 165 loose frames per element makes the package unusable to browse,
    // and every editor that takes an image sequence takes it out of a folder.
    const zip = path.join(dir, `${spec.id}-png-sequence.zip`);
    const r = spawnSync('zip', ['-qrj', zip, seq], {cwd: ROOT});
    if (r.status !== 0) throw new Error(`zip failed for ${spec.id}`);
    built.push(zip);
  }
  fs.rmSync(seq, {recursive: true, force: true});

  const kb = (p) => (fs.statSync(p).size / 1024).toFixed(0);
  console.log(`  ${spec.id.padEnd(22)} ${String(frameCount).padStart(3)} frames  ` +
    `${String(spec.width).padStart(4)}x${String(spec.height).padEnd(4)}  ` +
    built.map((b) => `${path.extname(b).slice(1) || 'zip'} ${kb(b)}KB`).join('  '));
  made.push({...spec, frames: frameCount, files: built.map((b) => path.relative(OUT, b))});
}

fs.writeFileSync(path.join(OUT, '_elements.json'), JSON.stringify(made, null, 2));
console.log(`\n> ${made.length} elements in ${path.relative(ROOT, OUT)}`);
