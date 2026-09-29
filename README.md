# Salary Cycle Change - employee announcement video

A self-contained pipeline that renders a **~71 s, 1920×1080, 30 fps MP4**
announcing that YASREF's **salary merit and promotion effectiveness moves from
January to April** - a change in timing only, in alignment with market best
practices - told around a circular 12-month ANNUAL SALARY PROGRAM wheel.

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

> **SALARY MERIT & PROMOTION EFFECTIVENESS UPDATE** - January → April,
> aligned with market best practices.
>
> The annual cycle turns: **JANUARY – DECEMBER** becomes **APRIL – MARCH**.
>
> | New proposed cycle | |
> |---|---|
> | **MARCH** | Bonus paid |
> | **APRIL** | Merit increases, promotion action |
>
> **2027 implementation year:** January – March 2027 is the transition.
> Leave: a 3-month balance in January, then a new annual balance from April
> 2027 based on the updated grades. Vacation allowance: current basic salary
> for January – March, the new basic salary from April. Merit covers 15
> months; the percentage itself does not change, only the months.
>
> *For further clarification, contact HR personnel.*

The **cycle wheel** (`src/components/CycleWheel.tsx`) is the recurring visual:
twelve month segments around an ANNUAL SALARY PROGRAM hub. A named month is
shown by the wheel itself - it lights and lifts out of the ring - rather than
by an arrow. The **transition timeline** (`src/components/TransitionTimeline.tsx`)
carries scenes 5-7, with January – March in a coral `transition` colour used
for nothing else.

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
| `npm run voiceover:anchor` | Put the word-pinned beats on the word they name |
| `npm run voiceover:prompts` | What still has to be generated, and in what order |
| `npm run check:pronunciation` | Prove the narrator says "KPIs" as three letters |
| `npm run check:brief` | Every stated client requirement, as a test |
| `npm run check:sync` | Audit narration against animation - fails if either runs ahead |
| `npm run typecheck` | Type-check the project |

---

## The nine scenes

| # | Scene | In | Length | What it shows |
|---|---|---|---|---|
| 1 | Opening | 0:00 | 11.8s | **SALARY MERIT & PROMOTION EFFECTIVENESS UPDATE** / January → April / Aligned with market best practices. Held before the narrator starts |
| 2 | The cycle shifts | 0:11 | 6.1s | The wheel, JANUARY lit at the start marker, turns a quarter: JANUARY – DECEMBER → **APRIL – MARCH** |
| 3 | March | 0:17 | 3.7s | MARCH lifts out of the wheel: **MARCH / BONUS PAID** |
| 4 | April | 0:21 | 5.4s | March settles back, APRIL lifts: **APRIL / MERIT INCREASES / PROMOTION ACTION** |
| 5 | 2027 implementation year | 0:27 | 7.2s | Wheel to the corner; timeline 2026 → DECEMBER → JAN–MAR (coral) → APRIL 2027 |
| 6 | Leave balance | 0:34 | 12.2s | JANUARY: 3-MONTH LEAVE BALANCE → APRIL 2027: NEW ANNUAL LEAVE BALANCE, based on the updated grades. Example: 22 ÷ 12 × 3 ≈ 6 days / 30 ÷ 12 × 3 ≈ 8 days |
| 7 | Vacation allowance | 0:46 | 10.7s | JANUARY – MARCH: current basic salary → APRIL 2027: new basic salary reflected. Example: SAR 10,000 × 60% ÷ 12 × 3 = SAR 1,500 for the first quarter |
| 8 | Merit | 0:57 | 9.1s | The wheel returns: a 12-month lap plus 3 coral months = **15 MONTHS**. Example: 5% ÷ 12 × 15 = 6.25% over 15 months; the percentage does not change |
| 9 | Final message | 1:06 | 5.2s | For further clarification, contact HR personnel. Nothing else on the slide |

Scenes overlap by 0.55s, so the next visual is always building while the
previous phrase finishes.

### Pacing

The narration is the client's 10-line script, used verbatim (checked by
`scripts/lib/check-narration.mjs`; only "allawance"/"whete" were corrected, at
the client's request, so they are pronounced naturally), read by the local
Kokoro voice **am_liam** at speed 0.88, chosen from five auditions in
`output/voice-auditions/`. The 10 line WAVs and their durations are in
`output/narration/`. The words are never
slowed; the unhurried feel comes from the silence around them, authored in
`src/config/voiceover.pacing.ts`, including the deliberate holds while a visual
explains itself.

Visuals **follow** the narration rather than leading it. The word-pinned beats
in `src/config/anchors.ts` are placed on the measured onset of their word inside
each recorded phrase, so BONUS PAID lands on *"paid"*, MERIT INCREASES on *"merit"*,
the coral band on *"this transition applies"*, and 15 MONTHS on *"15 months"*.

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
