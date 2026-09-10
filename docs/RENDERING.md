# Rendering

## The commands

```bash
npm run render            # 1920×1080 production MP4 → output/salary-cycle-update.mp4
npm run render:preview    #  960×540  fast review copy
npm run render:all        # both (preview first, so you can start watching sooner)
```

Flags pass through after `--`:

```bash
npm run render -- --no-captions          # no burned-in subtitles; ship the .srt
npm run render -- --concurrency=4        # cap the worker count on a small machine
```

## What comes out

| | Production | Preview |
|---|---|---|
| Resolution | 1920×1080 | 960×540 |
| Frame rate | 30 fps | 30 fps |
| Duration | 90.0s (2700 frames) | same |
| Video | H.264, `yuv420p` Rec.709, CRF 17, `slow` preset, PNG source frames | H.264, CRF 26, `veryfast`, JPEG frames |
| Audio | AAC 192 kbps, 48 kHz stereo | same |

`yuv420p` with an explicit Rec.709 tag, plus the AAC track and a front-loaded
`moov` atom, are what make the file play natively - and start instantly - in
**Microsoft Teams, SharePoint, Outlook, PowerPoint** and every browser, with no
transcoding step, no colour shift, and no "this file can't be played" surprises.

The production profile renders frames as PNG rather than JPEG: hand-drawn line
art is exactly the sort of high-contrast edge that JPEG chroma subsampling
smears. It costs a little render time and nothing else.

## Subtitles

The captions are **burned in by default**, so the film works in an email preview,
on a town-hall screen, and with the sound off.

`npm run captions` also writes sidecars:

```
output/salary-cycle-update.srt   ← upload alongside the MP4 in Teams/SharePoint
output/salary-cycle-update.vtt   ← for a web player's <track> element
```

Both are generated from the same cue list the video burns in, so they cannot
drift apart. If you would rather use the sidecar only, render with
`--no-captions` - you get `output/salary-cycle-update-no-captions.mp4`.

## Reviewing before you render

```bash
npm run preview                  # Remotion Studio: scrub, jump between scenes
npm run still -- 240 1400 1900   # PNG frames → output/stills/
```

Studio is the fastest way to check a timing change; stills are the fastest way to
check that text is not colliding with a graphic.

## Troubleshooting

**"Received a status code of 403 while downloading … chromium-headless-shell"**
Remotion could not fetch its own browser. Point it at any local Chromium:

```bash
REMOTION_BROWSER_EXECUTABLE=/usr/bin/chromium npm run render
```

`render/browser.mjs` also finds a Playwright-installed Chromium by itself, so on
a machine that has run `npx playwright install chromium` this usually just works.

**The render is slow.** The production profile uses x264 `slow` for quality. For
a quick look use `npm run render:preview`. `--concurrency=N` trades speed for RAM.

**Fonts look wrong.** `src/lib/fonts.ts` blocks rendering until both typefaces
load, so a wrong-looking font means the file in `assets/fonts/` did not load -
check the path and that it is `.woff2`.

**A scene feels rushed / a line is cut off.** Lengthen that scene's `duration` in
`src/config/scenes.ts`; everything after it shifts automatically. Then re-run
`npm run voiceover:build`.

## Distributing it

- **Teams / Stream**: upload the MP4; add the `.srt` as a caption track if you
  rendered with `--no-captions`.
- **Email**: link to the portal copy rather than attaching - the file is a few MB
  but many mail systems strip video attachments.
- **Town hall**: the burned-in captions and the high-contrast palette are legible
  from the back of a room; the film needs no audio to make sense.
- **Intranet**: serve the MP4 with `.vtt` on an HTML5 `<track kind="captions">`.
