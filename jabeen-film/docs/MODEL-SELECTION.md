# Image-to-video model selection and test-sequence estimate (16 Oct 2026)

**Status: nothing generated. Waiting for your approval and for the setup below.**

## 1. Setup check

| Check | Result |
|---|---|
| `FAL_KEY` in this session | **Not set.** A key added to the environment reaches only a session started *after* it was saved. |
| Network: fal.run, queue.fal.run, fal.ai, fal.media, v3.fal.media | **Blocked** (no connection through the environment proxy). |
| fal.ai documentation and pricing pages | Unreachable from here for the same reason. The figures below come from web search results, including fal's own page snippets, and are **provisional** until confirmed on fal's live pages. |

## 2. Candidate models on fal.ai

| Model | fal endpoint | Clip length | End-frame input | Price, no audio (provisional) | Strengths for this project | Risks |
|---|---|---|---|---|---|---|
| **Kling 3.0 Pro** | `fal-ai/kling-video/v3/pro/image-to-video` | 3–15 s | Not on this endpoint (the Kling O3 endpoints take `end_image_url`) | $0.112–0.224/s (sources disagree) | Follows the start frame closely, supports negative prompts ("no morphing"), flexible lengths, cheapest | Fine lattice and repetitive patterns can shimmer; geometry on unseen sides is invented |
| **Veo 3.1** | `fal-ai/veo3.1/image-to-video`, `fal-ai/veo3.1/first-last-frame-to-video` | up to 8 s | **Yes** (first + last frame) | $0.20/s (Fast tier: $0.10/s) | Most realistic light and outdoor environments; first/last frame can lock *both* ends of a move to real renders | Close-up people soften; more expensive; 8 s cap |
| **Seedance 2.0** | `fal-ai/bytedance/seedance/…` (confirm exact id) | up to ~10 s | Yes (confirm) | ≈ $0.30/s at 720p | Rated highest for consistency and reference alignment in recent benchmarks | Priciest, and 720p at the quoted price; slow |

No public test covers rigid architecture (straight walls, window lines, lattice screens) across camera moves. The only reliable way to choose is a short side-by-side test on our own renders.

## 3. Recommendation

1. **Bake-off on one shot (T1, the daytime street).** Generate it once each with Kling 3.0 Pro, Veo 3.1 and Seedance 2.0. Compare frame by frame for wall and window straightness, lattice stability, walking gait and foot contact, car shape, and how closely the result matches the source render.
2. **Generate the rest of the test with the winner.** Use Veo 3.1 first/last-frame only where both ends are real renders.
3. **Upscale the source renders first.** The brochure crops are only 580–650 px wide, and the output can't be sharper than the input. An AI upscale costs about $0.05 per image (Topaz, already priced on the ElevenLabs account).

My provisional favourite is **Kling 3.0 Pro**: it is faithful to the start frame, has the most flexible clip lengths, and is the lowest cost. The bake-off decides.

## 4. Test sequence (41 s of finished footage, audio off; music is added separately)

| # | Source render | Move | Allowed motion | Length |
|---|---|---|---|---|
| T1 | p22 daytime street | Stabilised forward track along the street | One resident walking on the pavement, one car driving slowly; palms sway | 8 s |
| T2 | p23 daytime corner | Slow approach, then a partial orbit (≤ 20°) on the visible facade | One resident near a gate; leaves move | 8 s |
| T3a | p23, gate region | Push in to the timber gate, ending close on it (the threshold) | none | 5 s |
| T3b | p25 living room (wide) | Eye-level entry and slow forward move | Curtains and courtyard plants move slightly | 8 s |
| T3c | p37 living room | Diagonal glide toward the open doorway to the dining area | none | 6 s |
| T3d | p34 dining room | Glide along the table toward the planted courtyard | Plants move | 6 s |

**On the entrance:** no render shows the villa's front door or foyer. Generating a continuous walk from the street through the door would invent that space. The test therefore uses a **threshold transition**: T3a ends close on the real gate, then a light-bloom dissolve leads into T3b. From living to dining, the camera follows the doorway visible on page 37 (T3c), then cuts to T3d. A real door → foyer → living shot becomes possible only with renders of the entrance and foyer.

## 5. Estimated cost (provisional; confirmed against fal's live prices before any job)

| Item | Calculation | Estimate |
|---|---|---|
| Bake-off on T1 | 8 s × (Kling $0.224 + Veo $0.20 + Seedance $0.30) | $5.79 |
| Remaining shots with the winner (33 s) | Kling at $0.224/s: $7.39 · Veo at $0.20/s: $6.60 · Seedance at $0.30/s: $9.90 | $6.60–$9.90 |
| One retake allowance per shot (33 s) | same rates | $6.60–$9.90 |
| Upscaling 5 source renders | 5 × $0.05 | $0.25 |
| **Expected total** (no retakes) | | **≈ $12.60–$15.90** |
| **Ceiling** (one retake of every shot) | | **≈ $19.20–$25.80** |

If Kling's lower quoted rate ($0.112/s) proves current, the Kling path costs about half as much.

## 6. Review criteria for each generated clip
- **Architecture:** wall and roof lines stay straight; windows, doors, lattice and pergolas don't move or change count; no new openings or floors.
- **People:** natural gait; feet stay planted with no sliding; faces and limbs aren't distorted; nobody appears or vanishes mid-shot.
- **Vehicles:** constant shape and size; wheels turn and match the speed; the car stays on the road.
- **Light:** sun direction and white balance are constant within a shot and match across shots.
- **Transitions:** the T3a → T3b threshold reads as entering the home; the T3c doorway direction matches the dining view.

Any clip that fails is regenerated once or dropped. It is never stretched or looped.

## 7. Essential material for the 5–6 min film

| Needed | Why |
|---|---|
| **Which villa model** (A, B1, B2 or C) and confirmation of which renders show it | Every villa shot must be the same house |
| **Floor plans for every level** of that model | Decides the walkthrough route and which doors connect which rooms; needed for the floor-plan scene |
| **Front door and entrance foyer** renders (outside and inside) | The real door-to-interior transition |
| **Kitchen** render | Core room in the walkthrough |
| **Staircase / corridor** renders (if two storeys) | Connects ground and upper floors without inventing a route |
| **Additional bedrooms** (at least one) and **a bathroom** | Required by the walkthrough brief |
| **Upper-floor family area, terrace or roof** (if present) | The upper-floor and outdoor sequences |
| **High-resolution originals** of all renders (or the brochure print PDF) | Sharp 1080p/4K output |
| **A daytime exterior of the chosen model** from a second angle | The orbit can then cover more than one side |

Without these, the faithful runtime stays at about 3½ minutes. The film will not be lengthened with invented rooms, repeated shots or stretched clips.

## Sources
- [Kling Video v3 Pro image-to-video (fal API docs)](https://fal.ai/models/fal-ai/kling-video/v3/pro/image-to-video/api)
- [Kling O3 Pro image-to-video (fal docs)](https://fal.ai/docs/model-api-reference/video-generation-api/kling-video-o3-pro-image-to-video)
- [Kling Video V3 Pro API reference (fal docs)](https://fal.ai/docs/model-api-reference/video-generation-api/kling-video-v3-pro)
- [Veo 3.1 first-last-frame-to-video (fal)](https://fal.ai/models/fal-ai/veo3.1/first-last-frame-to-video)
- [Veo 3.1 Fast first-last-frame-to-video (fal)](https://fal.ai/models/fal-ai/veo3.1/fast/first-last-frame-to-video)
- [Veo 3.1 is now available on fal (fal blog)](https://blog.fal.ai/veo-3-1-is-now-available-on-fal/)
- [Seedance 2.0 vs Veo 3.1 (fal)](https://fal.ai/learn/tools/seedance-2-0-vs-veo-3-1)
- [Grok Imagine vs Veo 3.1 (fal)](https://fal.ai/learn/tools/grok-imagine-vs-veo-3-1)
- [AI video API pricing 2026 (DevTk.AI)](https://devtk.ai/en/blog/ai-video-generation-pricing-2026/)
- [Best AI video models, Sept 2026 (TeamDay)](https://www.teamday.ai/blog/best-ai-video-models-2026)
- [AI image and video API pricing, Sept 2026 (TeamDay)](https://www.teamday.ai/blog/ai-api-pricing-comparison-2026)
- [Veo 3.1 vs Kling 3.0 vs Seedance 2.0 (3D AI Studio)](https://www.3daistudio.com/blog/best-ai-video-generator-2026)
- [Veo vs Kling vs Seedance comparison (Yang's Web)](https://www.yangsweb.com/blog/veo-vs-kling-vs-seedance-comparison-2026)
- [Veo 3.1 first-last-frame pricing (Verna)](https://verna.one/models/veo3.1-first-last-frame-to-video)
- [fal.ai pricing overview (vibecoding.gallery)](https://vibecoding.gallery/en/tools/fal-ai/)
- [Seedance 2.0 technical report (arXiv)](https://arxiv.org/pdf/2604.14148)
