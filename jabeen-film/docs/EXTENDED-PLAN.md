# Extended film (5–6 min): plan and status (16 Oct 2026)

Machine-readable shot list: `production/extended-shots.json`. There are 34 shots, each with its source page, camera move, allowed motion (people, cars, trees), status, and a ready-to-run image-to-video prompt that forbids any change to the architecture.

## Status

**Blocked: no video generator is available.** Re-checked today, the ElevenLabs connector still returns "Video generation needs a paid plan". No other video service, credential or satellite source is reachable from this environment. Animated people, moving cars, orbits and the entrance-to-interior transition all need generated footage. Depth parallax (`render/parallax.py`) cannot add motion to people or cars, so it is not used to stretch the runtime.

## New material (brochure pages 21–25, received 16 Oct)

| Page | Content | Light | Crop | Shots |
|---|---|---|---|---|
| 21 | Landscaped plaza with residents, street of villas | Day | `plaza-day.jpg` (634×357) | B3, B8, G1 |
| 22 | Street of villas, lattice screens, palms, cars | Day | `street-day.jpg` (580×326) | B4, B5, C2, C4 |
| 23 | Street corner, villas, gates, carports, minaret | Day (late afternoon) | `corner-day.jpg` (600×338) | B6, B7, C1, C3 |
| 25 | Living room, wide view with courtyard window | Day | `living-wide.jpg` (644×362) | E1–E3 |
| 33 | Duplicate of the page already received | Dusk | — | — |

The daytime exteriors on pages 21–23 replace the dusk renders (pages 33 and 35) for the street and villa sequences, so the film can stay in daylight throughout.

## Coverage

| | Seconds |
|---|---|
| Planned film | 298 s (≈ 5:00), rising to ≈ 5:40 with the full room set |
| Supported by current sources once video generation is enabled | 212 s (≈ 3:30) |
| Not supported yet | A1/A3 real Earth→Yanbu imagery, C1 confirmed villa model, D1–D2 entrance and foyer, E6 kitchen, E7 corridor/stairs, E10 other bedrooms, bathrooms, upper floor and roof, F2 floor plan |

To reach 5–6 minutes **faithfully**, we need renders of the entrance, foyer, kitchen, corridor/stairs, other bedrooms, bathrooms and upper floor, plus the floor plans for the chosen model. Without them, those shots would have to be invented, which the brief forbids.

## Quality rules for generated clips
- Start frame = the brochure render. Keep clips 5–10 s, and keep orbits to the side the render shows (≤ 20°).
- People and cars stay as they are in the render, with at most one or two subjects per shot moving.
- Check each clip frame by frame against its render: windows, doors, screens, floor patterns, vehicle shape, feet contact. Reject any clip that drifts.
- Interiors connect only through openings visible in the renders (e.g. living → dining doorway on page 37) or on the floor plan.
