# JABEEN: employee home ownership film

A 2:30 cinematic film taking employees from orbit to Yanbu, into the JABEEN
neighbourhood, through a villa and into its actual floor plan. It uses an
orchestral score only, with no voice-over.

**Status: animatic.** So far only the JABEEN logo has been supplied, so every
footage shot is a labelled placeholder. Timing, typography, the floor-plan
reveal and the end frame are built and tested.

| Doc | |
|---|---|
| [docs/ASSET-REVIEW.md](docs/ASSET-REVIEW.md) | Step 1: what was received, what is missing, and questions to answer |
| [docs/STORYBOARD.md](docs/STORYBOARD.md) | Step 2: timed shot list with camera, text and music cues |
| [docs/PRODUCTION-PLAN.md](docs/PRODUCTION-PLAN.md) | Step 3: where each shot comes from, tools, schedule and limits |
| [docs/QA-CHECKLIST.md](docs/QA-CHECKLIST.md) | Step 5: review checklist for each cut |

## Run it

```bash
cd jabeen-film
npm install
npm run studio            # scrub the film in the browser
npm run check:assets      # what is filled and what is missing, with required clip lengths
npm run render:animatic   # output/jabeen-animatic.mp4 (slate, placeholders, temp score)
npm run render:film       # output/jabeen-film.mp4 (refuses until everything is in place)
npm run still -- 26 110   # PNG frames at those seconds -> output/stills/
```

## Adding the real materials

1. **Footage and renders:** put files under `public/project/` and register each against its
   shot slot in `src/config/assets.ts` (e.g. `'2A'`, `'4A@A'`, `'6B-top@A'`).
   Video replaces the placeholder as-is. Stills get a gentle camera move matching the storyboard.
2. **Facts:** company name/logo, neighbourhood name and villa types (plans, room names,
   dimensions, areas, counts) go in `src/config/project.ts`. Anything left empty is not shown.
3. **Timing:** shot lengths, transitions and text cues live in `src/config/storyboard.json`.
   Adding a second villa type automatically adds a condensed pass of S4–S6.
4. **Music:** licensed mix to `public/audio/score.wav`. The temp score
   (`public/audio/temp-score.mp3`, rebuilt with `python3 -I render/temp-score.py src/config/storyboard.json out.wav`)
   is a timing sketch only.

## Layout

```
src/config/storyboard.json   master timeline (scenes, shots, moves, transitions, text cues, music notes)
src/config/project.ts        every on-screen fact; empty until confirmed
src/config/assets.ts         shot slot -> footage/render file
src/lib/timeline.ts          storyboard -> frame-accurate shots and cues
src/components/Shot.tsx      footage / still with camera move / placeholder, plus transitions
src/components/FloorPlanReveal.tsx   cutaway render -> 2D plan, room labels, spec panel
src/components/Titles.tsx    lockup, subtitle, closing line, lower-left labels
src/components/EndFrame.tsx  logos on ivory
render/                      render.mjs, check-assets.mjs, temp-score.py
```
