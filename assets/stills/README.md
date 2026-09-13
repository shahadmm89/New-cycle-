# Stills

The photographs the well-being film is built on, referenced from the `stills`
block in `src/config/wellbeing.design.ts`.

| File | Used in | Shows |
|---|---|---|
| `s01-office-arrival.png` | Scenes 1, 3 | A woman arriving at her desk in the morning, a colleague passing behind her |
| `s02-plant-walkway.png` | Scenes 1, 3, 6 | Two technicians in hard hats and hi-vis on a plant walkway |
| `s03-one-to-one.png` | Scenes 2, 7 | Two colleagues in a genuine one-to-one conversation |

All three are 2048×1152 (16:9), which is comfortably above the 1920×1080 render
so the slow push-in never runs out of pixels.

## These are placeholders

They are **AI-generated images, not photographs of real employees**, made to the
brief's description: candid, unposed, varied across environment, gender and
ethnicity, no exaggerated smiles, no readable text or logos.

Replace them with the company's own people photography before publishing if you
can — a film about listening to your people is better served by pictures of
them. Each slot is one line in `wellbeing.design.ts`; set `focusX`/`focusY` to
the point the push-in should move toward, so the move ends on a face.

A slot set to `null` falls back to the typographic treatment on the clean navy
stage. The film still reads correctly, it is just quieter.
