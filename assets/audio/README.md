# Audio

| Path | What it is |
|---|---|
| `mix.wav` | What the video mounts: narration + ducked background bed. |
| `voiceover.wav` | Narration only, before the bed is added. |
| `music.wav` | The generated background bed, before ducking. |
| `lines/` | One WAV per spoken phrase, named after its line ID (git-ignored). |

All four are produced by `npm run voiceover:build`. To use your own recording,
see [docs/VOICEOVER.md](../../docs/VOICEOVER.md) - you can replace the whole
mix, swap the music bed, or drop individual takes into `lines/` and re-assemble.
