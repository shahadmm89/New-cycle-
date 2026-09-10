/**
 * Remotion Studio / CLI defaults.
 * The production render is driven by render/render.mjs, which sets its own
 * codec and quality settings - this file mainly configures the preview.
 */
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
Config.setPublicDir('assets');

// Use a Chromium that is already on this machine when Remotion's own download
// is unavailable (see render/browser.mjs for the same logic on the CLI path).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
