# Step 1: Asset review

Reviewed 13 Oct 2026. **One file has been supplied: the JABEEN logo.** Nothing
else listed in the brief has arrived yet: no location, master plan, 3D models,
renders, interiors, floor plans, dimensions or landscaping.

## Received

| File | What it is | Notes |
|---|---|---|
| `public/brand/jabeen-logo.png` | Official JABEEN logo: calligraphic mark above the spaced **J A B E E N** wordmark | PNG, 1497×1109, transparent background. Two colours sampled from the file: gold `#B38916` (mark) and near-black `#11110E` (wordmark). Used unaltered in the end frame. |

### Logo issues to resolve

1. **The wordmark is black, so it can't sit on dark footage.** Recoloring it
   would break the brief's "preserve colours" rule, so for now the logo
   appears only on the light ivory end frame (`#F6F1E7`). If the logo should
   also appear over aerial footage, we need JABEEN's approved reversed
   (white/gold) version.
2. **The logo is a raster file.** At 1080p, 1497 px is enough. For a 4K master,
   or for animating the mark (for example drawing on the calligraphy), please
   send the vector file (SVG, AI or EPS).
3. **No brand guidelines yet.** We need clear-space rules, minimum size,
   allowed backgrounds and the official typeface. The film uses Inter Light
   with wide tracking to echo the spaced wordmark until we hear otherwise.

## Missing (needed before production)

### Branding and copy
- [ ] **Company name** exactly as it should read in the "[Company] × JABEEN" lockup.
      This repository also holds an earlier YASREF film, but nothing here
      confirms the employer for this project, so the name is still a placeholder.
- [ ] **Company logo**: vector file plus brand guidelines.
- [ ] **Language**: English only, or bilingual English/Arabic? Arabic text needs an
      approved Arabic typeface. None is installed or supplied yet.
- [ ] Approval of the on-screen lines: "A New Home Ownership Opportunity" and
      "Your Future Home Begins Here".

### Location and master plan
- [ ] **Exact site location**: KML/KMZ, a coordinate or a site boundary drawing within
      Yanbu (Royal Commission). This drives the Earth-to-Yanbu descent and the aerial reveal.
- [ ] **Neighbourhood name(s).** The brief says "Alaziziah, Aljabriah". Please confirm:
      (a) is this one project across two districts, or two separate phases?
      (b) the official English spelling (e.g. *Al Aziziyah* / *Al Jabriyah*) and the Arabic names;
      (c) which district the featured villas are in.
- [ ] **Master plan / site plan** (PDF or DWG) showing roads, plots, open spaces and amenities.
- [ ] **Landscape plan** listing the planting, parks and outdoor areas that are actually in scope.
- [ ] **Construction status.** Is the site built, under construction, or still empty land?
      This decides whether the reveal uses real drone footage or a 3D model composited onto terrain.

### Villas (per type)
- [ ] The list of **villa types** to feature, with official model names.
- [ ] **3D models** (Revit / SketchUp / 3ds Max / FBX) or existing **render animations** from the architect.
- [ ] **Exterior renders** (front, rear, aerial) and **interior renders** of each room that will be shown.
- [ ] **Floor plans** for every level, exported as black lines on white (PDF/SVG/PNG ≥ 4000 px).
- [ ] **Room schedule**: room names and dimensions exactly as printed.
- [ ] **Built-up area, plot size, and bedroom and bathroom counts.** These are shown only if you confirm them.
- [ ] Number of floors, and whether there is a stair, roof terrace, majlis, maid's room or driver's room.
      Shot 5C (stair/hallway) is cut if the design has none.

### Music
- [ ] The **licensed orchestral track** (or a budget/library choice) for the release cut.
      The animatic uses a synthesized **temp score** that sketches the cue
      structure only. It is not for release.

### Delivery
- [ ] Where will the film be shown: intranet, email, event screen, social? Is a 4K master needed?
      Is a silent-autoplay version needed (the film already works without sound, since it has no narration)?
- [ ] Deadline and approval chain (company HR/comms, JABEEN marketing, Royal Commission?).

## What I have not done, and why

- **I have not created imagery of the site, villas or interiors.** The brief makes the
  supplied materials the source of truth and forbids inventing architecture,
  layouts or amenities. Every shot is a clearly labelled placeholder until its
  footage or render arrives.
- **I have not stated any area, dimension, room count, price, eligibility or benefit.** All
  of these are empty fields in `src/config/project.ts`, and the release render
  refuses to start while any required fact is missing.
