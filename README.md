# Salary Cycle Change - employee announcement video

A self-contained pipeline that renders a **~1 min 44 s, 1920×1080, 30 fps MP4**
announcing that YASREF's **salary cycle is changing its timing** - and only its
timing: the benefits and the Total Reward Package stay the same.

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

> **YASREF is changing its salary cycle** - to align with best practice, and make
> it more timely and relevant.
>
> **Only the timing changes**: when benefits (bonus, merit, promotion) are
> received and reflected. The benefits and the Total Reward Package do not.
>
> | Today | |
> |---|---|
> | **NOVEMBER** | Merit & salary movement (expected inflation & market movement for next year) and the year-end estimate, in parallel |
> | **DECEMBER** | Finalization / decisions - reflected in January |
>
> | New proposed cycle | |
> |---|---|
> | **JANUARY** | New cycle takes effect |
> | **FEBRUARY** | Actual inflation & market movement, and actual Company Performance |
> | **MARCH** | YIB & bonus paid |
> | **APRIL** | Merit increases & promotion adjustments reflected |
>
> **2026 implementation year only:** the calculation covers 15 months, so a 5%
> increase is worth **6.25%** over that period. The same transition applies to
> leave balance: January 2027 credits the first 3 months only (Grade 9 & below
> 22 ÷ 12 × 3 ≈ 6 days; Grade 10 & above 30 ÷ 12 × 3 ≈ 8 days), and April 2027
> starts the new annual balance, based on the April grade code.
>
> *For further clarification, contact HR personnel.*

The film carries a thin month timeline along the bottom of scenes 3-8. It
answers the question the whole film is about - *when* does each thing happen? -
and it is the same twelve months throughout: they re-align from JAN→DEC into
APR→MAR during the hero scene rather than cutting to a second rail.

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

## The eleven scenes

| # | Scene | In | Length | What it shows |
|---|---|---|---|---|
| 1 | Purpose | 0:00 | 8.7s | **YASREF** is changing its **SALARY CYCLE** - to align with best practice |
| 2 | Timing only | 0:08 | 11.7s | WHAT CHANGES: **TIMING** / WHAT DOES NOT CHANGE: **BENEFITS** (bonus, merit, promotion), Total Reward Package ✓ |
| 3 | The current cycle | 0:20 | 6.1s | Year ring + month rail, JAN → DEC, ONE CYCLE. The bottom timeline draws in |
| 4 | How it works today | 0:26 | 18.6s | Two cards side by side - MERIT & SALARY MOVEMENT and YEAR-END ESTIMATE. The timeline picks up NOVEMBER and DECEMBER |
| 5 | **THE CHANGE** | 0:45 | 6.7s | The ring **spins** to April while the twelve months **re-align** underneath into APR…MAR |
| 6 | January & February | 0:51 | 7.5s | The forecast resolves into a measurement; JANUARY (new cycle takes effect) and FEBRUARY (actual figures) |
| 7 | March | 0:59 | 4.5s | Playhead runs the new salary year and lands on **MARCH**: YIB & bonus paid |
| 8 | April | 1:03 | 6.5s | **APRIL**, merit + promotion rising, EFFECTIVE APRIL 1 |
| 9 | **2026 implementation year** | 1:10 | 15.6s | Twelve solid month tiles plus three ghosted ones, and the ILLUSTRATIVE EXAMPLE built term by term: 5% ÷ 12 × 15 = **6.25%** |
| 10 | Leave balance | 1:25 | 12.2s | JANUARY 2027 (first 3 months: ≈ 6 / ≈ 8 days) → APRIL 2027 new annual leave balance |
| 11 | Final message | 1:38 | 5.6s | For further clarification, contact HR personnel. Logo |

Scenes overlap by 0.55s, so the next visual is always building while the
previous phrase finishes.

### Pacing

The narration is 19 short phrases in the local Kokoro voice **am_michael**
(free, generated on this machine). The script is deliberately short: where a
picture already says something - the new cycle's four months, the worked
calculation, the leave figures - the narrator does not read it out. The words are
never slowed; the unhurried feel comes from the silence around them. Those
silences are authored in `src/config/voiceover.pacing.ts`, including the few
deliberate holds while a visual explains itself. See "Pace from the pauses" in
docs/VOICEOVER.md.

Visuals **follow** the narration rather than leading it. The word-pinned beats
in `src/config/anchors.ts` are placed on the measured onset of their word inside
each recorded phrase, so NOVEMBER lands on *"November"*, the pillars on
*"merit"* and *"promotion"*, and NO CHANGE on *"stay exactly the same"*.

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
