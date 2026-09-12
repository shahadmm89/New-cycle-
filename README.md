# Salary Cycle Change - employee announcement video

A self-contained pipeline that renders a **~2-minute, 1920×1080, 30 fps MP4**
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
| **The implementation year** | The changeover period runs 15 months, so a 5% merit increase is worth **6.25%** over it |

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
npm run voiceover:build     # re-generate narration + music (needs `pip install sherpa-onnx`)
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

## The eleven scenes

| # | Scene | In | Length | What it shows |
|---|---|---|---|---|
| 1 | Did you know? | 0:00 | 6.8s | Oversized question, **SALARY CYCLE** lit in the accent |
| 2 | The current cycle | 0:07 | 8.1s | Year ring + month rail, JAN → DEC |
| 3 | How it works today | 0:15 | 15.5s | Merit's forecast line; then HSE, Finance and Performance rolling up into one company-performance figure |
| 4 | **THE CHANGE** | 0:30 | 7.1s | The ring **spins** to April while the rail **re-orders itself** into APR…MAR |
| 5 | April | 0:37 | 9.0s | **APRIL** at 190px, merit + promotion rising, EFFECTIVE APRIL 1 |
| 6 | March | 0:46 | 8.1s | Playhead runs the new salary year and lands on **MARCH**, bonus |
| 7 | What does NOT change | 0:55 | 11.4s | Two parallel rows: PERFORMANCE APPRAISAL JAN → DEC ✓ NO CHANGE / SALARY CYCLE APR → MAR NEW |
| 8 | **The implementation year** | 1:06 | 27.9s | The 15-month changeover rail, and one equation built term by term: 5% ÷ 12 × 15 = **6.25%** |
| 9 | **The summary** | 1:34 | 6.4s | APRIL → MARCH over three markers. The frame to remember |
| 10 | Why the change | 1:41 | 10.2s | Market alignment, more relevant information |
| 11 | Final message | 1:51 | 6.2s | Have questions? HR is ready to help, contact, logo |

Scenes overlap by 0.55s, so the next visual is always building while the
previous phrase finishes.

### Pacing

The narration is 202 words across 29 phrases, delivered at about 132 words per
minute. Every gap between phrases sits between 0.3s and 1.5s (median 0.6s); the
longest three are scene transitions where a reveal is still landing on screen.

Visuals **follow** the narration rather than leading it. The beat times in
`src/config/scenes.ts` were set from the measured onsets inside each recorded
phrase, so the range plate lands on *"January to December"*, the dial lands on
*"April"*, the KPI tiles arrive one per name, and **6.25%** appears as it is
said.

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
    copy.ts               ← the cycle definition, month orders, anchors, the worked example
    branding.ts           ← palette, fonts, depth tokens, logo + HR placeholders
    voiceover.ts          ← voice, delivery, music bed and ducking
    voiceover.timing.ts   ← measured phrase durations (auto-generated)
  components/
    Stage.tsx             ← navy stage, perspective floor, moving accent glow
    YearRing.tsx          ← the year counter - the mechanism the film turns on
    MonthRail.tsx         ← months in perspective + the FROM → TO range plate
    Card3D.tsx  Type.tsx  Icons.tsx  Captions.tsx  Chrome.tsx  SceneTransition.tsx
  scenes/                 ← Scene01Hook … Scene11Close
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
- **Python 3.9+** with `sherpa-onnx` and `numpy` - only needed to *regenerate* audio.
  The Kokoro voice model (384 MB) is git-ignored; `npm run voiceover:build` prints
  the two commands that fetch it
- Remotion downloads a Chrome Headless Shell on first render. Where that is
  blocked, point `REMOTION_BROWSER_EXECUTABLE` at any local Chromium;
  `render/browser.mjs` also finds a Playwright-installed one automatically.

No cloud services are used. Narration and music are generated locally, so no
script text leaves the machine.
