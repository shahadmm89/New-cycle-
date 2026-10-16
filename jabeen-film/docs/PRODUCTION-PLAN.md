# Step 3: Production plan

## The short version

The film has three kinds of material. Each one has a most practical source:

| Material | Shots | Best source | Fallback |
|---|---|---|---|
| **Real geography**: Earth to Yanbu to the site | 1A–1C, 2A (plate) | **Google Earth Studio** (free, keyframed camera, exports image sequences at 4K) | NASA public-domain Earth imagery for 1A, plus licensed stock aerials of Yanbu |
| **The project itself**: neighbourhood, villas, interiors, cutaway | 2A (model), 3A–7C, 8A | **The architect's own 3D models rendered as camera animations** (Twinmotion, Lumion, D5 Render, Unreal Engine 5 or Blender) | Existing JABEEN render animations, or **stills animated with gentle virtual-camera moves** (already built into this project) |
| **Graphics**: titles, labels, floor-plan reveal, end frame | all | **This Remotion project**: already built and tested | — |

Music is licensed rather than generated (see below). Final assembly and the
render happen here with `npm run render:film`.

## Why not generate the whole film with AI video?

Current text-to-video and image-to-video tools (Veo, Sora, Kling, Runway and
others) can produce attractive real-estate footage, but **they invent
architecture**. Facades drift between frames, rooms change shape, and windows
and doors appear or disappear. The brief requires that house designs, layouts,
dimensions and landscaping must not be altered, so AI generation can't be the
backbone of this film.

**Where AI can safely help:** short (≤ 5 s) image-to-video moves made from
**supplied renders**, with a gentle push or slow pan. Each clip must be checked
frame by frame against the source render before it is used. Never use it for
floor plans, text, logos, the site layout or anything with dimensions.
ElevenLabs' video tools are connected to this session and could do this once
renders arrive. That spends credits, so I'll ask before running anything.

## Shot-by-shot sourcing

### S1 (Earth to Yanbu) and S2 (reveal plate)
1. In **Google Earth Studio** (earth.google.com/studio, free Google account), build one
   continuous camera: orbit altitude over the Arabian Peninsula → Red Sea coast →
   Yanbu → the site coordinates. Export 3840×2160 at 24 fps.
2. Split the export at the cut points in the storyboard: 1A, 1B, 1C, 2A.
   The cloud-break transition (1C) is built in Remotion, so no cloud plates are needed.
3. **Attribution:** Google's terms require the on-screen credit "Google Earth" (plus the data
   providers Earth Studio lists) on those shots. It can be small, lower-right.
   **This needs your approval**, because it adds text the brief didn't ask for.
   If that isn't acceptable, use NASA public-domain imagery for 1A and licensed
   drone/stock aerials for 1B–2A.
4. **If the site is still empty land**, the 2A reveal is a composite: the Earth Studio
   (or drone) plate of the real terrain, plus the 3D neighbourhood rendered with
   a matching camera, plus the master-plan linework drawn on in between.
   Earth Studio exports camera data (JSON/AE) for exactly this.
5. **Drone footage** of the real site is an option for 2A, 3A and 8A, but flying in Yanbu
   Industrial City needs GACA registration and Royal Commission permission.
   Plan two to four weeks for that.

### S3–S8 (the project)
Ask JABEEN's architect or visualisation studio for:
- the native 3D models (Revit, SketchUp, 3ds Max or FBX) of the neighbourhood and each villa type, **or**
- render animations they already have (developers often hold walkthroughs made for sales).

Then render each shot as a camera animation following the storyboard's moves, at
3840×2160 and 24 fps, with the lengths printed by `npm run check:assets`
(these include transition handles). Twinmotion or Lumion is the fastest route
from Revit/SketchUp. Unreal Engine 5 gives the best lighting if time allows.

**Shot 6B needs one special render:** a single **orthographic top-down render** of
the villa with the roof removed, framed to the exact extent of the floor-plan
drawing. That is what makes the 3D-to-2D transformation line up.

### Floor plans
Export each level from the CAD/PDF drawings as **black linework on white**
(PNG ≥ 4000 px or SVG). Enter the room names and dimensions exactly as printed in
`src/config/project.ts`, with x/y label anchors. The plan geometry itself is never
redrawn, so the architect's layout is what appears on screen.

### Music
License a 2:30–3:00 orchestral track with a quiet open, a build, a reveal hit,
a flowing middle and an uplifting finale. Good libraries for this are Musicbed,
Artlist, Epidemic Sound and PremiumBeat. Search for "cinematic orchestral
inspiring build". Pick one whose structure fits the cue sheet in
`docs/STORYBOARD.md`, then nudge the shot lengths in `storyboard.json` so the
reveal cut (0:20) and finale (2:16) land on its hits. A commissioned score is
the premium option. Save the final mix as `public/audio/score.wav`.

## Schedule (once materials arrive)

| Stage | Duration |
|---|---|
| Materials received; facts confirmed in `project.ts` | Day 0 |
| Earth Studio shots and animatic v2 with real plates | 1–2 days |
| 3D camera animations (from existing models) | 5–10 working days, depending on the studio |
| Music selection and edit to picture | 1–2 days, in parallel |
| Assembly, grade, review round 1 | 1 day |
| Revisions and final master | 1–3 days |

## Technical limitations

- This session can't run Google Earth Studio, Twinmotion, Lumion or Unreal. Those
  renders have to be produced on a workstation (yours, or the architect's/studio's).
  Everything downstream of them (assembly, titles, plan reveal, final encode) runs here.
- No project imagery exists in the repo yet, so the current deliverable is an
  **animatic** with exact timing, final typography and the floor-plan engine,
  plus placeholders. It is not the finished film.
