# Step 5: Quality review checklist

Run this on every cut before sending it for approval.

## Automated
- [ ] `npm run typecheck` passes
- [ ] `npm run check:assets` reports every slot filled and every clip long enough (lengths include transition handles)
- [ ] `npm run render:film` completes. It refuses to start while anything is missing.

## Accuracy (against the supplied documents, not memory)
- [ ] Site location in Earth/aerial shots matches the supplied coordinates/KML
- [ ] Streets, plots, open spaces and amenities match the master plan, with nothing added or removed
- [ ] Villa facade, openings and materials match the supplied renders and models in every shot (4A → 4C → 6A)
- [ ] Each interior shot shows a room that exists in that villa type; room labels match the plan wording
- [ ] Floor plan is the architect's drawing, unaltered, and not stretched (`planAspect` is correct)
- [ ] Every dimension, area and count on screen matches the drawings/schedule character for character
- [ ] Landscaping shown is in the landscape plan
- [ ] No prices, financing, eligibility or benefit claims anywhere
- [ ] Any AI-assisted clip has been compared frame by frame against its source render

## Continuity
- [ ] Time of day/lighting is consistent within a scene; golden hour only in S8
- [ ] Camera direction carries across cuts (no screen-direction flips between 3B/3C, 4A/4B)
- [ ] The cloud break (1C) and doorway threshold (4C → 5A) read as one continuous move
- [ ] The cutaway render in 6B lines up with the plan when it crossfades

## Text and branding
- [ ] Each line is readable at 1080p on a laptop and on a phone (check `npm run still`)
- [ ] Each title is on screen for at least 3 s; no two text cues overlap
- [ ] JABEEN logo is unaltered: proportions, colours, clear space; the black wordmark is only on a light ground
- [ ] Company name and logo match the approved spelling and version
- [ ] Neighbourhood spelling is confirmed (English and, if used, Arabic)

## Sound
- [ ] Licensed track only; licence covers internal and online distribution
- [ ] Reveal hit lands on the 2A cut (0:20) and the finale on 8A (2:16), within ±2 frames
- [ ] No voice, narration or dialogue anywhere in the mix
- [ ] Loudness about −16 LUFS integrated for online; no clipping; clean 1.5 s fade at the end

## Picture
- [ ] 16:9, 1920×1080 (or 3840×2160 master), 24 fps, H.264 yuv420p Rec.709
- [ ] Grade is consistent across Earth Studio, drone and CG shots
- [ ] No banding in skies or the ivory end frame; no flicker in thin plan lines
- [ ] Final frame holds cleanly on the logos
