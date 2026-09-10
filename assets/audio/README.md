# Audio

| Path | What it is |
|---|---|
| `voiceover.wav` | The finished 90-second narration bed the video mounts. |
| `lines/` | One WAV per voice line, named after its line ID (git-ignored). |

Both are produced by `npm run voiceover:build`. To use your own recording,
see [docs/VOICEOVER.md](../../docs/VOICEOVER.md) - you can replace the whole
track, or drop individual takes into `lines/` and re-assemble.
