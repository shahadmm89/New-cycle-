// Renders the one-page guide to a print-ready PDF (A3, vector) plus PNG/JPG images.
//   node guide/render-guide.mjs
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, 'employee-transition-guide.html');
const outDir = path.join(here, '..', 'output', 'employee-guide');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
// A3 at 96 dpi = 1123 x 1588 CSS px
const page = await browser.newPage({ viewport: { width: 1123, height: 1588 }, deviceScaleFactor: 3 });
await page.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.emulateMedia({ media: 'print' });

await page.pdf({
  path: path.join(outDir, 'employee-transition-guide-A3.pdf'),
  preferCSSPageSize: true,
  printBackground: true,
});
// A4 copy: same page, scaled to fit A4 paper
await page.pdf({
  path: path.join(outDir, 'employee-transition-guide-A4.pdf'),
  format: 'A4',
  scale: 297 / 420 * (420 / 297) * (210 / 297),
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  printBackground: true,
});

const el = await page.$('.page');
await el.screenshot({ path: path.join(outDir, 'employee-transition-guide.png') });
await page.setViewportSize({ width: 1123, height: 1588 });
const p2 = await browser.newPage({ viewport: { width: 1123, height: 1588 }, deviceScaleFactor: 1.6 });
await p2.goto(pathToFileURL(src).href, { waitUntil: 'networkidle' });
await p2.evaluate(() => document.fonts.ready);
await p2.emulateMedia({ media: 'print' });
await (await p2.$('.page')).screenshot({ path: path.join(outDir, 'employee-transition-guide-whatsapp.jpg'), type: 'jpeg', quality: 90 });

await browser.close();
for (const f of fs.readdirSync(outDir)) {
  console.log(f, (fs.statSync(path.join(outDir, f)).size / 1024 / 1024).toFixed(2), 'MB');
}
