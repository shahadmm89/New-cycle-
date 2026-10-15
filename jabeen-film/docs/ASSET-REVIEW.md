# Step 1: Asset review

## Update, 15 Oct 2026: Sumou Communities brochure (pages 29–37)

Eleven brochure pages were received and saved unaltered in `public/project/brochure/pages/`.
The clean picture areas, clear of the brochure's text panels and logos, are cropped into
`public/project/brochure/crops/` by `render/brochure-crops.py` and placed in the animatic.

| Page | Content | Used for |
|---|---|---|
| 29 | Al-Aziziyah "Royal" site plan · land 200,918 m² | 7A (site plan) |
| 29 | Al-Nakhil "Elite" site plan · land 152,011 m² | 7C |
| 30 | Al-Aziziyah location map · 239 villas (B1 101 · B2 88 · C 50) | 1C (stand-in) |
| 30 | Al-Nakhil location map · 267 villas (A 119 · B1 66 · B2 74 · C 8) | reference |
| 31 | Al-Aziziyah aerial render, golden hour | 2A, 3C, 8A |
| 31 | Al-Nakhil aerial render, dusk | 3A |
| 33 | Street at dusk, villas with timber screens | 3B |
| 34 | Dining area with planted courtyard | 5B (replaces kitchen) |
| 35 | Facades at dusk, Hejazi-inspired lattice screens | 4A, 4B |
| 36 | Master bedroom | 5D |
| 37 | Living area | 5A |

### What this settles
- **Neighbourhoods:** **Al-Aziziyah and Al-Nakhil**, both within **Sumou Communities (مجتمعات سمو)** in Yanbu.
  This matches the Royal Commission announcement. "Aljabriah" from the original brief does not
  appear anywhere, so the film's place label is now set to حي العزيزية · حي النخيل.
- **Location:** the maps place Al-Aziziyah north of the Royal Commission Hospital, beside Yanbu
  Industrial College and south of Danat Mall. Al-Nakhil is south-west of the hospital. That is
  enough to plan the Earth Studio camera; exact coordinates are still welcome.

### Issues found
1. **Resolution.** The pages are 1080 px wide, so each 16:9 crop is upscaled about 2× and is
   soft at 1080p. This is fine for the animatic but **not for release**. We need the original renders,
   or the print PDF of the brochure.
2. **Model counts contradict the text.** The Al-Aziziyah page says "two models" but lists three
   (B1, B2, C). The Al-Nakhil page says "three models" but lists four (A, B1, B2, C).
3. **Which villas are for employees?** The brochure totals 506 villas (239 + 267). Press reports
   describe 200 villas for Yasref. The film states no counts until this is clarified.
4. **Which model, and which renders show it?** The film presents one model, but the brochure
   doesn't say which model each exterior or interior render shows. We need confirmation that
   the chosen model's renders are the ones used.
5. **Still missing:** floor plans and room schedule for the chosen model, so S6 stays a placeholder.
   Also missing: kitchen, bathroom, second-bedroom and entrance renders, a ground-level
   landscaping view, and the company logo.

## Update, 14 Oct 2026: client answers

| Question | Answer | Effect on the film |
|---|---|---|
| Language | **Arabic only** | All on-screen text is now Arabic, right to left, in IBM Plex Sans Arabic (SIL OFL). Labels sit lower-right; the floor-plan layout is mirrored. Letter-spacing is never applied to Arabic. |
| Neighbourhoods | **One project across two neighbourhoods** (resolved 15 Oct: Al-Aziziyah and Al-Nakhil, see above) | One label names both. **Conflict:** the brief says Alaziziah and Aljabriah. The [Royal Commission announcement](https://amlak.net.sa/en/107155/) says Al-Aziziyah and Al-Nakhil, and [TradeArabia](https://www.tradearabia.com/News/464968/Jabeen-in-deal-to-build-200-residential-villas-in-Saudi-industrial-city) says Al Nakheel and Al Murjan. No name is shown until JABEEN confirms. |
| Villa models | **One model** | S4–S6 run once (the 2:30 cut as storyboarded). |
| Location | A Google Maps short link (`maps.app.goo.gl/np5SR5m5NTtdeL5f6`) | The link can't be opened from this environment, because the network proxy blocks that host. **Please send the coordinates instead:** in Google Maps, long-press or right-click the pin and copy the two numbers. |
| Company | "Jabeen" | Public sources ([Saudi Gulf Projects](https://www.saudigulfprojects.com/2026/07/jabeen-signs-81-8-million-agreement-with-yasref-to-develop-200-residential-villas-in-yanbu-industrial-city/), TradeArabia) describe the project as JABEEN building 200 villas for **Yasref** employees, with the Royal Commission as partner. The lockup options are on the choices page. Nothing is shown until you confirm. |

Open decisions (titles, typeface, digits, production route, music, look, length) are
collected on the **choices page** artifact. The film uses its recommended options as
defaults in `src/config/project.ts`.

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
