# Salary Cycle Change - employee announcement video

A self-contained pipeline that renders an **~89-second, 1920×1080, 30 fps MP4**
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
| 1 | Did you know? | 0:00 | 7.0s | Oversized question, **SALARY CYCLE** lit in the accent |
| 2 | The current cycle | 0:07 | 8.9s | Year ring + month rail, JAN → DEC, a playhead walking the year |
| 3 | How it works today | 0:16 | 10.7s | Merit (forecast line) and Bonus (KPI bars), both "based on estimates" |
| 4 | **THE CHANGE** | 0:27 | 12.7s | The year ring **spins** and lands on APRIL; APR → MAR revealed |
| 5 | April | 0:39 | 10.4s | **APRIL** at 190px, merit + promotion rising, EFFECTIVE APRIL 1 |
| 6 | March | 0:50 | 9.0s | Playhead travels the new salary year APR…MAR, lands on **MARCH**, bonus |
| 7 | What does NOT change | 0:59 | 9.2s | Two parallel rows: PERFORMANCE JAN → DEC ✓ NO CHANGE / SALARY APR → MAR NEW |
| 8 | Before becomes after | 1:08 | 10.8s | The BEFORE plate rotates away and NOW rotates in; three anchors stack |
| 9 | Why the change | 1:19 | 6.0s | Market alignment, more relevant information |
| 10 | Final message | 1:25 | 4.6s | APR → MAR, the three anchors, HR contact, logo |

Scenes overlap by 0.55s, so the next visual is always building while the previous
line finishes. Nothing cuts to an empty stage.

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
