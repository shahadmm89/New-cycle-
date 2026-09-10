/**
 * Finds a Chromium for Remotion to render with.
 *
 * Remotion normally downloads its own Chrome Headless Shell. On machines where
 * that download is blocked (locked-down CI, corporate proxies) we fall back to
 * any Chromium already on the box - including the one Playwright installs.
 *
 * Override explicitly with REMOTION_BROWSER_EXECUTABLE=/path/to/chrome
 */
import fs from 'node:fs';
import path from 'node:path';

const CANDIDATES = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  process.env.PLAYWRIGHT_BROWSERS_PATH &&
    path.join(process.env.PLAYWRIGHT_BROWSERS_PATH, 'chromium', 'chrome-linux', 'headless_shell'),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

const globPlaywright = () => {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base)
    .filter((d) => d.startsWith('chromium'))
    // Prefer the headless shell, it is what Remotion expects.
    .sort((a, b) => (b.includes('headless') ? 1 : 0) - (a.includes('headless') ? 1 : 0))
    .flatMap((d) => [
      path.join(base, d, 'chrome-linux', 'headless_shell'),
      path.join(base, d, 'chrome-linux', 'chrome'),
    ]);
};

export const findBrowser = () => {
  for (const candidate of [...CANDIDATES, ...globPlaywright()]) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }
  // Let Remotion handle it (it will download one).
  return null;
};
