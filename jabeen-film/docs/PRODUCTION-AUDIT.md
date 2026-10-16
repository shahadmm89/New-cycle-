# Production audit and proof of concept (16 Oct 2026)

## 1. Why the previous MP4 looked weak

| Cause | Detail |
|---|---|
| Static images with zooms | Every shot was a still with a flat scale/pan (Ken Burns). Nothing in the frame moved in depth. |
| Placeholders | 10 of 23 shots had no imagery at all (Earth descent, entrance, kitchen, bathroom, bedroom 2, crane-up, floor plan, landscaping). |
| Low resolution | Brochure pages are 1080×763. The clean picture areas are only 600–1000 px wide, upscaled about 2–3× to 1080p: soft, with JPEG blocking. |
| Inconsistent light | Aerials are golden hour, exteriors are dusk/night, interiors are daylight. The brief now asks for daytime throughout. |
| Repeated images | The Al-Aziziyah aerial was used in three shots (2A, 3C, 8A). |
| Map as "descent" | Shot 1C used the brochure's location map as a stand-in for the Earth-to-Yanbu descent. |

## 2. Capabilities in this environment

| Capability | Status |
|---|---|
| GPU | **None.** 4 CPU cores, 15 GB RAM. No local diffusion or video model is practical. |
| Local libraries | ffmpeg (with `minterpolate`, `v360`, `perspective`), numpy, Pillow, Remotion. Installed for this audit: OpenCV and ONNX Runtime. |
| Depth estimation | **Available.** MiDaS v2.1 small (ONNX, from the MiDaS GitHub release) runs on CPU. |
| Image-to-video (Kling 3, Veo 3.1, Seedance 2.5, Runway Gen-4.5 and others via the ElevenLabs connector) | **Listed but blocked.** The service returns *"Video generation needs a paid plan"*. Nothing was generated or charged. |
| Music generation (ElevenLabs Music v2.5) | **Available.** Estimate for a 150 s instrumental: 900 credits, about **$0.09**. Not run yet. |
| Image upscaling (Topaz via ElevenLabs) | **Available.** Estimate: about **$0.05 per image**. Not run yet. |
| Satellite / Earth imagery | **Blocked by the environment's network policy.** EOX Sentinel-2, NASA GIBS, NASA EO and Esri World Imagery are all unreachable. Hugging Face is also blocked. |
| Google Earth Studio, Blender, Twinmotion, Unreal | Not available here (browser apps or desktop software). |
| API credentials for other video services (Runway, Luma, Kling, fal) | None configured. |

## 3. Asset inventory

All brochure pages are 1080×763 (1.42:1) JPEG. "Usable area" is the clean picture region, clear of text panels and logos.

| File (`public/project/brochure/pages/`) | Category | Usable area | Light | Architectural details | Image-to-video suitability | Scene |
|---|---|---|---|---|---|---|
| p31-aziziyah-aerial.jpg | Neighbourhood aerial | 980×551 | Golden hour | Terraced villa blocks, commercial strip, mosque, roads | Good (high oblique view, simple depth) | Descent, reveal, finale |
| p31-nakheel-aerial.jpg | Neighbourhood aerial | 954×537 | Dusk | Villa blocks, central mosque, lit windows | Good | Neighbourhood |
| p29-aziziyah-siteplan.jpg | Site plan | 360×615 drawing | n/a | Plot layout colour-coded by model | Graphic only | Plan reveal |
| p29-nakheel-siteplan.jpg | Site plan | 430×470 drawing | n/a | Plot layout colour-coded by model | Graphic only | Plan reveal |
| p30-aziziyah-map.jpg / p30-nakheel-map.jpg | Location maps | 788×443 | n/a | Site within Yanbu Industrial City | Graphic only, not footage | Location reference |
| p33-street-dusk.jpg | Exterior street | 604×340 (text panel covers the rest) | Dusk | Timber screens, pergolas, green walls, carports | Fair (people and cars are frozen) | Street |
| p35-facade-dusk.jpg | Exterior facade | 672×378 | Dusk | Hejazi lattice screens, timber pergola, gates, carport | Fair (frozen jogger and car) | Villa exterior |
| p37-living.jpg | Interior | 604×340 | Day | Living area, sofas, doorway to dining | Good | Interior |
| p34-dining.jpg | Interior | 634×357 | Day | Dining table, planted courtyard | Good | Interior |
| p36-master-bedroom.jpg | Interior | 604×340 | Day | Bed, panelled wall, lighting | Good | Interior |
| ../../brand/jabeen-logo.png | Branding | 1497×1109 | n/a | Mark plus wordmark | n/a | End frame |

**Missing:** floor plans; kitchen, bathroom, bedroom 2 and entrance renders; any **daytime** exterior; high-resolution originals; and confirmation of which villa model these renders show.

## 4. Proof of concept: depth-parallax camera moves

`render/parallax.py` estimates depth for a render, then moves a virtual camera through it (dolly, truck, pedestal) with motion blur, so near objects move more than far ones. This is real perspective parallax rather than a flat zoom. No content is invented. `poc/jabeen-poc-parallax.mp4` (22 s) contains:

1. **Descent:** procedural cloud layers part as the camera descends onto the Al-Aziziyah aerial.
2. **Reveal:** a lateral drone glide across the villa blocks.
3. **Exterior:** a lateral truck past the facade. The car and screens separate in depth.
4. **Interior:** a glide and push into the living area. The sofa and plant move against the doorway.

### Evaluation
- **Architectural fidelity: good.** Lattice screens, walls and openings stay straight. Nothing is added or changed, because the method only re-projects the supplied pixels.
- **Motion: convincing for small moves**, but limited to about 5–8% of frame width. It cannot orbit a villa, turn a corner or walk through a door: there is no geometry behind what the render shows.
- **Giveaways:** the frozen jogger and moving car in the facade render. The clouds are synthetic.
- **Image quality: soft.** The cause is the 1080 px brochure source, not the method.
- **Geography: not achieved.** No real Saudi Arabia or Yanbu imagery is reachable from this environment.

**Verdict:** this beats the Ken Burns slideshow, and it is the best that's possible here without a video generator. It does **not** meet the brief's "real camera operator" standard for orbits, entrance transitions and walkthroughs.

## 5. Routes to the brief's standard

| Route | What it unlocks | Needs | Indicative cost |
|---|---|---|---|
| **A. Enable video generation on ElevenLabs** (recommended) | Image-to-video from each render with Kling 3 / Veo 3.1 / Seedance (start frame = render; for the descent, end frame = aerial). Clips of up to 10–15 s, 1080p, plus music in the same workspace. | Upgrade the ElevenLabs plan; I then price every clip with a free estimate before generating. | Set by the plan; per-clip estimates are free to check. |
| **B. Another video service** (Runway, Luma, Kling or fal.ai) | Same as A. | An API key added as an environment secret, plus that host allowed in Network access. | Per that service. |
| **C. Unblock satellite imagery** | A real orbit-to-Yanbu zoom on Sentinel-2 / NASA imagery. | Allow `tiles.maps.eox.at` and/or `gibs.earthdata.nasa.gov` in the environment's network settings. | Free (with attribution). |
| **D. Better sources** | Sharp 1080p/4K output, a daytime exterior, interior continuity. | Original renders or the brochure print PDF, plus the 3D model if one exists (enables a true orbit and walkthrough). | n/a |
| **E. Upscale the current renders** | Sharper 2–4× sources for any route. | Approval to spend about $0.05 per image (about $0.55 for all 11). | ~$0.55 |

### Rules for any generated footage
- The render is the start frame. The prompt names only camera motion and asks for no changes to the building. Keep clips short (5–8 s) to limit drift.
- Check every clip frame by frame against its render for windows, doors, screens and floors; reject any that drift.
- No orbit beyond the visible side of a building, and no doorway that the floor plan doesn't have.

## 6. Open issue: the repository is public

`github.com/shahadmm89/New-cycle-` is publicly readable, including the brochure pages and the JABEEN logo. If the material is confidential, make the repository private.
