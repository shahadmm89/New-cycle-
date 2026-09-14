# Salary Cycle Change - employee announcement video

A self-contained pipeline that renders a **~2 min 15 s, 1920×1080, 30 fps MP4**
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
| Bonus is measured against | **Company Performance KPIs** — HSE, Finance, Performance |
| **The implementation year** | The changeover period runs 15 months, so a 5% merit increase is worth **6.25%** over it |

The performance appraisal cycle does **not** move. Scene 8 exists solely to make
that distinction structural: two identical rows, same rail, different months,
different colour.

The film also carries a thin month timeline along the bottom of scenes 2-5. It
answers the question the narration keeps raising - *when* does each piece of
information actually arrive? - and it is the same twelve months throughout: they
re-align from JAN→DEC into APR→MAR during the hero scene rather than cutting
to a second rail.

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
npm run voiceover:build     # re-generate narration + music (see docs/VOICEOVER.md)
```

| Command | What it does |
|---|---|
| `npm run render` | Full HD production render |
| `npm run render:preview` | Fast 960×540 review copy |
| `npm run render:all` | Both, preview first |
| `npm run render -- --no-captions` | No burned-in subtitles; ship the `.srt` |
| `npm run still -- 1020` | Render single frames to `output/stills/` |
| `npm run voiceover:build` | Synthesise the narration, normalise and limit the mix |
| `npm run voiceover:script` | Write the narration script to `output/voiceover-script.md` |
| `npm run voiceover:plan` | Re-time every scene around a new read (after a voice change) |
| `npm run check:sync` | Audit narration against animation - fails if either runs ahead |
| `npm run typecheck` | Type-check the project |

---

## The eleven scenes

| # | Scene | In | Length | What it shows |
|---|---|---|---|---|
| 1 | How do we run it today? | 0:00 | 6.2s | *Do you know how we run our* **SALARY CYCLE** *today?* |
| 2 | The current cycle | 0:06 | 7.6s | Year ring + month rail, JAN → DEC. The bottom timeline draws in |
| 3 | How merit & bonus are set today | 0:13 | 22.4s | Merit's forecast line; HSE, Finance and Performance rolling up into COMPANY PERFORMANCE KPIs. The timeline picks up NOVEMBER and DECEMBER |
| 4 | **THE CHANGE** | 0:36 | 7.4s | The ring **spins** to April while the twelve months **re-align** underneath into APR…MAR |
| 5 | What the new timing gives us | 0:43 | 20.6s | The forecast resolves into a measurement; the timeline picks up JANUARY and FEBRUARY, now *actual* |
| 6 | April | 1:04 | 8.5s | **APRIL** at 190px, merit + promotion rising, EFFECTIVE APRIL 1 |
| 7 | March | 1:12 | 8.0s | Playhead runs the new salary year and lands on **MARCH**, bonus |
| 8 | What does NOT change | 1:20 | 10.0s | Two parallel rows: PERFORMANCE APPRAISAL JAN → DEC ✓ NO CHANGE / SALARY CYCLE APR → MAR NEW |
| 9 | **The implementation year** | 1:30 | 30.0s | IMPLEMENTATION YEAR ONLY. Twelve solid month tiles plus three ghosted ones, and an ILLUSTRATIVE EXAMPLE built term by term: 5% ÷ 12 × 15 = **6.25%** |
| 10 | **The summary** | 2:00 | 5.6s | APRIL → MARCH over three markers. The frame to remember |
| 11 | Final message | 2:06 | 7.0s | Have questions? Contact your HR personnel, logo |

Scenes overlap by 0.55s, so the next visual is always building while the
previous phrase finishes.

### Pacing

The narration is 34 phrases in the ElevenLabs voice **Alexander**. He speaks at
his own natural pace - the words are never slowed - and the unhurried feel comes
from the silence around them instead, tuned by measuring the assembled track
rather than by arithmetic. See "Pace from the pauses" in docs/VOICEOVER.md.

> **Twenty of the thirty-four phrases are recorded.** The ElevenLabs account ran
> out of credits partway through the run, so scene 2, the last line of scene 8,
> and scenes 9-11 have no audio yet, and the film has not been scored or
> rendered against the refined script. docs/VOICEOVER.md names the missing
> phrases and the three commands that finish it.

Visuals **follow** the narration rather than leading it. The beat times in
`src/config/scenes.ts` were set from the measured onsets inside each recorded
phrase, so the range plate lands on *"January to December"*, the dial lands on
*"April"*, the KPI tiles arrive one per name, and **6.25%** appears as it is
said.

Nothing runs ahead of the voice and nothing waits for it either: no phrase is
cut by a scene boundary, and no scene stops moving while the narrator is still
talking. `scripts/plan-timing.mjs` and the audit behind it are what keep that
true when the read changes.

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
    voiceover.ts          ← which engine, which voice, delivery, music and ducking
    voiceover.timing.ts   ← measured phrase durations (auto-generated)
    voiceover.pacing.ts   ← the approved pauses, so a voice swap can be re-timed
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
