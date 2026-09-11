# Salary Cycle Change - employee announcement video

A self-contained pipeline that renders a **~60-second, 1920×1080, 30 fps MP4**
announcing that the company's **salary cycle year is moving from January–December
to April–March**.

Built as **digital signage**, not a presentation: oversized type, high contrast,
fast cuts, no static holds, and a message that still lands with the sound off.

```
output/salary-cycle-update.mp4            1920×1080  H.264 + AAC   ← the deliverable
output/salary-cycle-update-preview.mp4     960×540   low-res review copy
output/salary-cycle-update.srt / .vtt      subtitle sidecars
output/voiceover-script.md                 the narration script, for a human read
```

---

## The message

> **The salary cycle year is changing.**
>
> | | |
> |---|---|
> | Old salary cycle | **JAN → DEC** |
> | New salary cycle | **APR → MAR** |
>
> | Month | What happens |
> |---|---|
> | **APRIL** | Merit + promotion take effect (April 1) |
> | **MARCH** | Bonus paid in the March payroll |
> | **DECEMBER** | Performance appraisal cycle closes — **no change** |

The performance appraisal cycle does **not** move. Scene 7 exists solely to make
that distinction structural: two identical rows, same rail, different months,
different colour.

---

## Quick start

```bash
npm install
npm run render              # 1920×1080 production MP4 → output/salary-cycle-update.mp4
```

That is the whole build. The finished audio mix is committed
(`assets/audio/mix.wav`), so a fresh clone renders the film with no extra tooling.

```bash
npm run preview             # Remotion Studio - scrub and jump between scenes
npm run captions            # rewrite the .srt / .vtt sidecars
npm run voiceover:build     # re-generate narration + music (needs `pip install piper-tts`)
```

| Command | What it does |
|---|---|
| `npm run render` | Full HD production render |
| `npm run render:preview` | Fast 960×540 review copy |
| `npm run render:all` | Both, preview first |
| `npm run render -- --no-captions` | No burned-in subtitles; ship the `.srt` |
| `npm run still -- 1020` | Render single frames to `output/stills/` |
| `npm run voiceover:build` | Synthesise narration, build the music bed, duck and mix |
| `npm run voiceover:script` | Write the narration script to `output/voiceover-script.md` |
| `npm run typecheck` | Type-check the project |

---

## The ten scenes

| # | Scene | In | Length | What it shows |
|---|---|---|---|---|
| 1 | Did you know? | 0:00 | 3.7s | Oversized question, **SALARY CYCLE** lit in the accent |
| 2 | The current cycle | 0:03 | 4.5s | Year ring + month rail, JAN → DEC |
| 3 | How it works today | 0:08 | 12.8s | Merit's forecast line; then HSE, Finance and Performance rolling up into one company-performance figure |
| 4 | **THE CHANGE** | 0:21 | 5.6s | The ring **spins** to April while the rail **re-orders itself** into APR…MAR |
| 5 | April | 0:26 | 6.0s | **APRIL** at 190px, merit + promotion rising, EFFECTIVE APRIL 1 |
| 6 | March | 0:32 | 3.6s | Playhead runs the new salary year and lands on **MARCH**, bonus |
| 7 | What does NOT change | 0:36 | 6.2s | Two parallel rows: PERFORMANCE APPRAISAL JAN → DEC ✓ NO CHANGE / SALARY CYCLE APR → MAR NEW |
| 8 | **The summary** | 0:42 | 3.4s | Silent. APRIL → MARCH over three markers. The frame to remember |
| 9 | Why the change | 0:45 | 9.3s | Market alignment, more relevant information |
| 10 | Final message | 0:55 | 5.0s | Have questions? HR is ready to help, contact, logo |

Scenes overlap by 0.55s, so the next visual is always building while the
previous phrase finishes.

### Pacing

The narration is 42 seconds of speech across 15 phrases. Every gap between
phrases is between 0.2s and 1.3s, which is what the film's length is set by -
holding longer would simply reinsert silence. The one exception is scene 8,
which is deliberately silent so the summary can be read rather than talked over.

`npm run voiceover:build` prints the measured length of every phrase against the
room it has and warns by name if one no longer fits.

---

## How it is put together

Everything the film knows - timing, wording, dates, narration, branding - lives in
**`src/config/`**. Scenes contain no frame numbers: each declares *named beats* in
seconds, and components ask for a beat by name.

```
src/
  config/
    scenes.ts             ← MASTER TIMELINE: durations, beats, narration, on-screen copy
    copy.ts               ← the cycle definition, month orders, the three anchors
    branding.ts           ← palette, fonts, depth tokens, logo + HR placeholders
    voiceover.ts          ← voice, delivery, music bed and ducking
    voiceover.timing.ts   ← measured phrase durations (auto-generated)
  components/
    Stage.tsx             ← navy stage, perspective floor, moving accent glow
    YearRing.tsx          ← the year counter - the mechanism the film turns on
    MonthRail.tsx         ← months in perspective + the FROM → TO range plate
    Card3D.tsx  Type.tsx  Icons.tsx  Captions.tsx  Chrome.tsx  SceneTransition.tsx
  scenes/                 ← Scene01Hook … Scene10Close
  lib/                    ← timing hooks, caption cues, fonts, theme
render/                   ← render.mjs (MP4), still.mjs (PNG frames)
scripts/                  ← voice-over + music pipeline, caption and script writers
assets/                   ← fonts, audio, logo (Remotion's public dir)
```

Scene *start* times are derived from the durations above them, so changing one
scene's length shifts everything after it - including its lighting, because the
glow keyframes are anchored to scene ids rather than absolute times.

---

## Customising it

- **[docs/BRANDING.md](docs/BRANDING.md)** - palette, logo, fonts, HR details
- **[docs/EDITING-TEXT-AND-DATES.md](docs/EDITING-TEXT-AND-DATES.md)** - months, dates, wording, scene lengths
- **[docs/VOICEOVER.md](docs/VOICEOVER.md)** - re-record or replace the narration and music
- **[docs/RENDERING.md](docs/RENDERING.md)** - render settings, troubleshooting, distribution

---

## Requirements

- **Node.js 18+** (developed on Node 22)
- **Python 3.9+** with `piper-tts` and `numpy` - only needed to *regenerate* audio
- Remotion downloads a Chrome Headless Shell on first render. Where that is
  blocked, point `REMOTION_BROWSER_EXECUTABLE` at any local Chromium;
  `render/browser.mjs` also finds a Playwright-installed one automatically.

No cloud services are used. Narration and music are generated locally, so no
script text leaves the machine.
