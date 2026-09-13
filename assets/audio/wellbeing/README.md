# Well-being film audio

Everything the well-being film plays. It is committed as finished audio, so a
fresh clone renders the film with no API key and no network access.

| File | What it is |
|---|---|
| `p01.mp3` … `p20.mp3` | The narration, one file per phrase |
| `music-bed.mp3` | The 2-minute instrumental bed |

## The narration

ElevenLabs **Alexander** (`hIru3zkEJ3dBYHTbMy2V`) with `eleven_multilingual_v2`
— the same narrator as the salary-cycle film. The voice is referenced by id
through the account licensed to use it; nothing is cloned, sampled or imitated.

**One file per phrase, not one continuous track.** The film mounts each of them
at the second the timeline places it and lets Remotion mix them during the
render. That is what makes the pauses editable: they are `pauseAfter` values in
`src/config/wellbeing.ts` rather than silence baked into a .wav.

Each phrase's measured length is recorded alongside it in that config. If you
re-record, the durations must be re-measured — see "Changing it" in
[docs/WELLBEING-VIDEO.md](../../../docs/WELLBEING-VIDEO.md).

## The music

Generated with `eleven_music_v2`: soft piano and pad, no percussion, no vocals,
no swells.

It was checked for vocals by running it through speech-to-text — the transcript
came back empty. That is the only reliable way to confirm a generated
"instrumental" really is one, and worth repeating if the bed is ever replaced:
the brief requires music that never competes with the narration, and a stray
vocal line would do exactly that.

The level and the ducking live in `src/config/wellbeing.audio.ts`. The bed sits
at about −18 dB and drops a further 8 dB under every spoken phrase,
automatically, from the timeline.
