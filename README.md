# Salary & Bonus Cycle - animated employee explainer

A complete, self-contained pipeline that renders a **90-second, 1920×1080, 30 fps
MP4** explaining the company's new Salary & Bonus Cycle to all employees.

Hand-drawn whiteboard animation crossed with clean corporate illustration:
friendly, plain-English, and readable **with the sound off**.

```
output/salary-cycle-update.mp4            1920×1080  H.264 + AAC   ← the deliverable
output/salary-cycle-update-preview.mp4     960×540   low-res review copy
output/salary-cycle-update.srt / .vtt      subtitle sidecars
output/voiceover-script.md                 the narration script, for a human read
```

---

## The message

> Your **performance cycle stays the same**. What changes is the **timing**.
>
> | | |
> |---|---|
> | **Bonus** | → paid in the **March payroll** |
> | **Merit** | → effective **April 1** |
> | **New salary** | → shows in the **April payroll** |
> | **Performance appraisal** | → still closes in **December** (no change) |

---

## Quick start

```bash
npm install
npm run render              # 1920×1080 production MP4 → output/salary-cycle-update.mp4
```

That is the whole build. The narration track is committed
(`assets/audio/voiceover.wav`), so a fresh clone renders the finished film
without any extra tooling.

```bash
npm run preview             # Remotion Studio - scrub and jump between scenes
npm run captions            # rewrite the .srt / .vtt sidecars
npm run voiceover:build     # re-generate the narration (needs `pip install piper-tts`)
```

| Command | What it does |
|---|---|
| `npm run render` | Full HD production render → `output/salary-cycle-update.mp4` |
| `npm run render:preview` | Fast 960×540 review copy |
| `npm run render:all` | Both, preview first |
| `npm run render -- --no-captions` | Render without burned-in subtitles (ship the `.srt` instead) |
| `npm run preview` / `npm run studio` | Remotion Studio - scrub, jump between scenes, live-edit |
| `npm run still -- 1400` | Render single frames to `output/stills/` for a close look |
| `npm run voiceover:build` | Synthesise + assemble the narration, and re-sync the captions |
| `npm run voiceover:script` | Write the human-readable script to `output/voiceover-script.md` |
| `npm run captions` | Write `.srt` and `.vtt` from the same cues the video burns in |
| `npm run typecheck` | Type-check the project |

The finished MP4 is `yuv420p` H.264 with an AAC track, which plays without
transcoding in Microsoft Teams, SharePoint, Outlook, PowerPoint, and every
browser.

---

## How it is put together

Everything the video knows - timing, wording, dates, narration, branding - lives
in **`src/config/`**. Nothing is hard-coded in the scenes, and the animation
contains no arbitrary frame delays: each scene declares *named beats* in seconds,
and components ask for a beat by name.

```
src/
  config/
    scenes.ts             ← MASTER TIMELINE: durations, beats, narration, on-screen copy
    copy.ts               ← every date, month and reusable phrase
    branding.ts           ← colours, fonts, logo + HR placeholders
    voiceover.ts          ← how the narration is produced and mounted
    voiceover.timing.ts   ← measured line durations (auto-generated)
  components/             ← Calendar, Employee, Timeline, MarketChart, KPIChart,
                            SalaryIcon, Comparison, Chain, Captions, SceneTransition …
  scenes/                 ← Scene01Opening … Scene09Closing
  lib/                    ← rough-sketch geometry, timing hooks, caption cues, fonts
  Video.tsx               ← assembles the scenes from the config
  Root.tsx                ← composition registration
render/                   ← render.mjs (MP4), still.mjs (PNG frames)
scripts/                  ← voice-over pipeline, caption + script writers
assets/                   ← fonts, audio, logo (Remotion's public dir)
output/                   ← rendered MP4s, subtitles, script
```

Because the scene *start* times are derived from the durations above them,
changing one scene's length simply shifts everything after it - no other edits.

### The nine scenes

| # | Scene | In | Length | What it shows |
|---|---|---|---|---|
| 1 | Opening | 0:00 | 8s | Colleague + calendar: "Do you know how our salary cycle currently works?" |
| 2 | Current merit | 0:08 | 11s | Jan→Dec timeline, market chart, dotted **PROJECTED** forecast, FORECAST → ESTIMATED MARKET MOVEMENT → MERIT |
| 3 | Current bonus | 0:19 | 8s | KPI dashboard + ESTIMATE badge, BONUS → ESTIMATED COMPANY PERFORMANCE |
| 4 | Why change | 0:27 | 9s | Old calendar leaves, magnifier on market data, PROJECTED → MORE RELEVANT |
| 5 | **The new timing** | 0:36 | 17s | JAN→APR rail; **MARCH** lights up → BONUS → MARCH PAYROLL; **APRIL 1** lights up → MERIT → EFFECTIVE APRIL 1 → REFLECTED IN APRIL PAYROLL |
| 6 | What does *not* change | 0:53 | 13s | December calendar, appraisal chain, big **NO CHANGE** stamp + tick |
| 7 | Before vs now | 1:06 | 10s | Split screen, then "SAME PERFORMANCE CYCLE. NEW TIMING." |
| 8 | Why this helps | 1:16 | 9s | Two before→after rows, alignment icon, two takeaways |
| 9 | HR closing | 1:25 | 5s | Colleagues + HR, "Have questions? HR is ready to help.", contact placeholders |

---

## Customising it

Three short guides, one per job:

- **[docs/BRANDING.md](docs/BRANDING.md)** - colours, logo, fonts, HR contact details
- **[docs/EDITING-TEXT-AND-DATES.md](docs/EDITING-TEXT-AND-DATES.md)** - months, dates, wording, scene lengths
- **[docs/VOICEOVER.md](docs/VOICEOVER.md)** - re-record or replace the narration
- **[docs/RENDERING.md](docs/RENDERING.md)** - render settings, troubleshooting, distribution

---

## Requirements

- **Node.js 18+** (developed on Node 22)
- **Python 3.9+** with `piper-tts` - only needed to *generate* narration
  (`pip install piper-tts`). Not needed to render if `assets/audio/voiceover.wav`
  already exists, or if you supply your own recording.
- Remotion downloads a Chrome Headless Shell on first render. On a locked-down
  machine, point `REMOTION_BROWSER_EXECUTABLE` at any local Chromium instead -
  `render/browser.mjs` also finds a Playwright-installed one automatically.

No cloud services are used. The narration is synthesised locally, so no script
text or employee-facing copy leaves the machine.
