# Step 2: Storyboard

**All on-screen text is Arabic, right to left** (wording in `src/config/project.ts`; the English below is the meaning).

**2:30 · 16:9 · 1920×1080 (4K-ready) · 24 fps · orchestral score only, with no voice-over, narration or dialogue.**
Source of truth for timing: `src/config/storyboard.json`. Timecodes below are for **one villa type**. Each additional type adds a condensed pass of about 30 s (exterior → living → kitchen → master bedroom → plan). Up to three types fit in 3:00.

Transitions are dissolves of 0.75 to 2 s unless noted. There are no flashy wipes. The two "designed" transitions are the **cloud break** (1C) and the **doorway threshold** (4C → 5A).

| TC | Shot | Camera | Visual | On-screen text | Music |
|---|---|---|---|---|---|
| **S1 FROM EARTH TO YANBU** | | | | | |
| 0:00 | 1A | Slow drift forward, fade from black (2 s) | Earth from orbit at dawn; the terminator crosses the Arabian Peninsula, and the Red Sea catches first light | none | A single low string note with a high shimmer, near silence |
| 0:06 | 1B | Continuous push down | Toward Saudi Arabia's Red Sea coast; cirrus streaks past the lens | none | Low strings swell slightly |
| 0:13 | 1C | Descent; **cloud-break transition** | The camera punches through the cloud layer: Yanbu coastline, Royal Commission city grid, heading to site | none | **Build** begins: ostinato strings, rising |
| **S2 THE JABEEN PROJECT REVEAL** | | | | | |
| 0:20 | 2A | Aerial reveal, then a slow 30° orbit | The actual site. The master-plan linework traces onto the terrain, then resolves into the 3D neighbourhood, camera-matched to the aerial plate | 0:23 **[COMPANY] × JABEEN** · 0:25.5 *A New Home Ownership Opportunity* (both out at 0:31.5) | **Reveal hit**: timpani and full strings on the cut, then a sustained chord under the title |
| **S3 EXPLORING THE NEIGHBOURHOOD** | | | | | |
| 0:34 | 3A | Descent | From reveal height toward the rooftops | 0:35.5 lower-right: **[NEIGHBOURHOOD]** / Yanbu · Royal Commission | Momentum: strings in motion, light pulse |
| 0:41 | 3B | Low lateral glide | Along a residential street from the master plan, villas on both sides | none | continues |
| 0:49 | 3C | Orbit | Villa cluster with the supplied landscaping and outdoor spaces | none | Pulse eases out |
| **S4 APPROACHING THE VILLA** | | | | | |
| 0:56 | 4A | Slow push | Wide exterior of the selected villa type in its plot | 0:56.75 lower-right: **VILLA [TYPE]** | Warm low strings |
| 1:00 | 4B | Dolly in | Facade: materials, openings, entrance, outdoor space | none | |
| 1:05 | 4C | Push through the door | The doorway frame fills the screen; **threshold bloom** into the interior | none | Phrase resolves |
| **S5 THE INTERIOR EXPERIENCE** | | | | | |
| 1:10 | 5A | Lateral glide | Living area: space and daylight | small label: room name *(as on plan)* | **Flowing theme**: strings and piano, unhurried |
| 1:16 | 5B | Gentle push | Kitchen | room name | |
| 1:21 | 5C | Crane | Stair or hallway between zones *(only if the design has one; otherwise its 4 s go to 5A/5D)* | none | |
| 1:25 | 5D | Slow arc to window | Master bedroom | room name | |
| 1:31 | 5E | Push | Second bedroom | room name | |
| 1:35 | 5F | Push | Bathroom detail: materials, fittings | room name | Theme thins |
| **S6 THE ARCHITECTURAL FLOOR-PLAN REVEAL** | | | | | |
| 1:40 | 6A | **Crane straight up** through ceiling and roof | The roof dissolves into a cutaway; the camera settles directly overhead (orthographic) | none | **Softer**: high sustained strings and piano |
| 1:44 | 6B | Locked overhead | The cutaway render (camera-matched to the plan) holds 1.5 s, then sinks back as the **actual 2D plan** wipes on behind a gold scan line. Room names and printed dimensions appear one by one; the spec panel builds on the right. With several floors, each floor gets its own pass | Villa type · built-up area · plot · bedrooms · bathrooms · outdoor items, **each shown only if confirmed** | |
| **S7 NEIGHBOURHOOD AND LANDSCAPING** | | | | | |
| 2:02 | 7A | Pull up and out | The villa plan widens into the site/landscape plan, which dissolves into the real 3D environment | none | **Rebuild**: theme returns, fuller |
| 2:07 | 7B | Ground-level glide | Through the supplied landscaping and outdoor areas | none | |
| 2:12 | 7C | Low aerial | Streets and landscape, villa in context | none | Rising |
| **S8 INSPIRATIONAL CLOSING** | | | | | |
| 2:16 | 8A | Sweeping, rising aerial at golden hour | The whole neighbourhood | 2:18.5 **Your Future Home Begins Here** (out 2:24.5) | **Finale**: full orchestra, uplifting; timpani on the cut |
| 2:25 | 8B | Locked | End frame: company logo · JABEEN logo on warm ivory, original colours | none | Long final D-major chord, fade by 2:30 |

### Text rules
- Every on-screen line is listed above. There are no other cards, bullets or slides.
- Labels sit lower-right (where an Arabic reader starts) with a thin gold rule, in IBM Plex Sans Arabic Light with a soft shadow for legibility over footage. No letter-spacing on Arabic.
- Every fact (names, areas, dimensions, counts) comes from `src/config/project.ts` and is shown **only if filled in**.
- No prices, financing, eligibility or benefit claims appear anywhere.
