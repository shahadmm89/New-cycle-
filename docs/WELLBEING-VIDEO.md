# Employee Well-being Programme — announcement film

A **1 min 45 s, 1920×1080, 30 fps** internal film announcing the company's new
Employee Well-being Programme.

```
output/wellbeing-programme.mp4          1920×1080  H.264 + AAC   ← the deliverable
output/wellbeing-programme.srt / .vtt   subtitle sidecars
```

```bash
npm run wellbeing              # render the 1920×1080 MP4
npm run wellbeing:preview      # fast 960×540 review copy
npm run wellbeing:captions     # rewrite the .srt / .vtt sidecars
npm run wellbeing:timeline     # print the schedule and audit the assets
npm run preview                # Remotion Studio - scrub both films
```

It lives in the same project as the salary-cycle film and shares its stage,
palette, typefaces and narrator on purpose: it should read as the same company
speaking, not as a separate campaign.

---

## What the film says

| # | Scene | In | Length | On screen |
|---|---|---|---|---|
| 1 | People first | 0:00 | 11.7s | Office morning → plant walkway. **PEOPLE FIRST.** |
| 2 | We started by listening | 0:11 | 16.2s | A real one-to-one. **We started by listening.** → *Employee well-being assessment* |
| 3 | Everyone's voice | 0:27 | 17.0s | Professional groups / nationalities / genders / areas of the business → **and our leaders** |
| 4 | What we heard | 0:44 | 21.2s | **What we heard was clear.** → two equal pillars: **mental well-being**, **financial well-being** |
| 5 | From insight to action | 1:06 | 15.4s | LISTEN → UNDERSTAND → ACT, then **Q4 2026** at 240px |
| 6 | What's next | 1:21 | 9.3s | **More details shortly** — the action plan, the support available |
| 7 | Your well-being matters | 1:30 | 14.0s | **YOUR WELL-BEING MATTERS.** → the closing line → the logo, alone |

Scenes cross-fade over 0.9s, so the next image is always arriving while the
last phrase finishes. Nothing in the film cuts.

### What the film deliberately does not say

These are constraints from the brief, and they are worth keeping if the copy is
ever edited:

- **No diagnosis.** The film says people need *greater support for* mental
  health. It never suggests anyone has been found to have a condition.
- **No promises.** No benefit, service, provider or entitlement is named
  anywhere, because none has been announced yet.
- **No recommendations.** The assessment's findings are referred to but not
  listed — they belong to the detailed action plan.
- **No stereotyping.** Scene 3 names professional groups, nationalities and
  genders as words in a list. It never illustrates any of them, which is the
  only reliable way to avoid casting a category of person as a type.
- **No medical imagery**, and no icon on either pillar. Every obvious icon for
  mental health is a head, a brain or a heartbeat line.

---

## Pacing, and where it comes from

The narration is **189 words across 20 phrases**, in the ElevenLabs voice
**Alexander** — the same narrator as the salary-cycle film.

He speaks at his own natural pace, about **147 wpm**. The words are never
slowed down. The unhurried feel the brief asks for comes entirely from the
silence around them: 77.4s of speech inside a 104.8s film — 26% of the running
time is silence — so the film as a whole runs at about **108 words per
minute**.

`npm run wellbeing:timeline` prints all of this, and is the quickest way to see
what a re-recording actually changed.

Every pause is declared, per phrase, as `pauseAfter` in
`src/config/wellbeing.ts`. Five of them are long on purpose — these are the
moments the brief asks to land:

| After | Pause |
|---|---|
| "That's why we started by listening." | 1.45s |
| "What we heard was clear." | 1.50s |
| "…mental health and financial well-being." | 1.55s |
| "Starting in Q4 2026," | 1.40s |
| "Because your well-being matters." | 1.50s |

Two sentences are **recorded as two phrases** so the pause inside them is real
rather than edited in: *"Starting in Q4 2026," / "we will begin turning these
recommendations into action."* and *"More details will be shared with you
shortly," / "including our detailed action plan…"*.

---

## How it is put together

The film is assembled backwards from the voice. Each phrase was synthesised
separately, its **real measured duration** recorded in the config, and every
scene length derived from that. Nothing is pinned to a frame number a human
typed, which is why re-recording a line re-times the whole film correctly.

```
src/
  config/
    wellbeing.ts           ← MASTER TIMELINE: phrases, measured durations, pauses, scenes
    wellbeing.design.ts    ← palette, photography slots, every word of on-screen copy
    wellbeing.audio.ts     ← which voice, and how the music bed is levelled and ducked
  wellbeing/
    WellbeingVideo.tsx     ← mounts the scenes, the narration and the music
    timing.ts              ← useReveal / useWindow / useSpan, all scene-relative
    captions.ts            ← cue list, shared by the burned-in captions and the sidecars
    components/            ← Photo (graded Ken Burns), Stage, Type, Pillars, Chain, Captions
    scenes/                ← Scene1Opening … Scene7Closing
assets/
  audio/wellbeing/         ← p01…p20.mp3 (narration), music-bed.mp3
  stills/                  ← the photographs
```

Scenes never contain absolute times. They ask the timeline when a *phrase* is
spoken:

```tsx
const P10 = sayIn('heard', 'p10');          // scene-relative seconds
const MENTAL_AT = P10 + 2.6;                // where the words are said inside it
const pillarOne = useReveal(MENTAL_AT, 0.95);
```

### The audio is mixed at render time

There is no pre-mixed voice track. Every phrase is mounted as its own `<Audio>`
at the second the timeline places it, and Remotion mixes them with the music
bed during the render.

That is what makes the pauses editable: change one `pauseAfter` and the
narration, the visuals, the subtitles and the film's length all move together.

The music bed is quiet (about −18 dB) and **ducks a further 8 dB under every
spoken phrase**, automatically, from the same timeline — so it can never creep
up over a word. The duck windows are derived, not hand-drawn.

---

## Changing it

**Wording, dates, on-screen copy** → `src/config/wellbeing.design.ts`. Nothing
is hard-coded in a scene.

**Re-recording the narration.** Synthesise each phrase with voice
`hIru3zkEJ3dBYHTbMy2V` (Alexander) and model `eleven_multilingual_v2`, drop the
files in `assets/audio/wellbeing/` as `p01.mp3` … `p20.mp3`, and update each
phrase's `duration` in `src/config/wellbeing.ts` to the new measured length.
Then:

```bash
npm run wellbeing:timeline     # confirms every file exists and prints the new schedule
npm run wellbeing:captions
npm run wellbeing
```

The `duration` values are **measurements, not estimates**. If they are wrong the
visuals drift away from the voice, which is the one failure mode this structure
cannot catch for you — `wellbeing:timeline` warns when a file is missing, but it
cannot tell that a number is 0.4s optimistic.

**Adding photography.** `stills` in `wellbeing.design.ts` is a list of slots.
Drop images into `assets/stills`, point a slot at one, set its `focusX`/`focusY`
so the slow push ends on a face. A slot set to `null` falls back to the
typographic treatment on the clean navy stage — the film still reads, it is
just quieter.

**The logo.** Set `brand.logoSrc` in `src/config/branding.ts` to a file inside
`/assets`. Until then the closing frame shows the `[COMPANY LOGO]` placeholder.

---

## About the imagery

The photographs are **AI-generated**, not photographs of real employees, and
they should be treated as placeholders for the company's own people photography.
They were made to the brief's description — candid, unposed, diverse across
environment, gender and ethnicity, no exaggerated smiles — and graded to the
brand.

Swap them for real photographs of real colleagues before publishing if you can.
A film about listening to your people is better served by pictures of them, and
the slots make it a one-line change per image.
