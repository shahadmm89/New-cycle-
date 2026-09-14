# Changing the voice-over

The narration is **not** baked into the animation. The timeline is driven by the
scene config, so swapping the voice never means rebuilding anything.

There are three ways to do it, from least to most work.

---

## What the pipeline produces

```
assets/audio/voiceover.wav   narration only
assets/audio/music.wav       the background bed, before ducking
assets/audio/mix.wav         what the video mounts  ← narration + ducked bed
```

## Which engine says it

`engine` in `src/config/voiceover.ts` picks one of three:

| `engine` | Voice | Needs |
|---|---|---|
| `elevenlabs` | **Alexander** (`hIru3zkEJ3dBYHTbMy2V`) | `ELEVENLABS_API_KEY` + outbound HTTPS to `api.elevenlabs.io`, or the ElevenLabs connector |
| `kokoro` | am_echo, local | `pip install sherpa-onnx` + the model. **What the committed mix was made with.** |
| `piper` | any Piper voice, local | `pip install piper-tts` |

The ElevenLabs path calls the account's own licensed voice by id. It does not
clone, sample or approximate anyone: if the key's account cannot use that voice,
the API refuses and the build stops with the refusal rather than quietly
substituting something else.

**Why Alexander and not Arthur.** The voice originally asked for
(`TtRFBnwQdH1k01vR0hMz`) needs a Creator-tier subscription this account does not
have - the API answers `You need to be on the creator tier or above to use this
voice`. It is also, by its own library description, "a vibrant, fun, and dynamic
young adult" social-media voice, which is the opposite of the mature, calm,
"not overly energetic" read the rest of the brief asks for. Alexander was picked
from the library against that brief and measured the same way as the local
voice; `output/voice-candidates.mp3` is the audition, and the numbers are in the
table below.

```bash
export ELEVENLABS_API_KEY=...
# set engine: 'elevenlabs' in src/config/voiceover.ts
npm run voiceover:build
npm run voiceover:plan -- --write     # re-time the scenes to the new read
npm run captions && npm run render
```

**The re-timing step is not optional.** See "Re-timing after a voice change"
below.

### If the host is blocked

Some sandboxes and CI networks do not allow `api.elevenlabs.io`. The build says
so plainly - the proxy's own words come back in the error:

```
ElevenLabs returned HTTP 403 - this account may not have access to Arthur
  Host not in allowlist: api.elevenlabs.io. Add this host to your network
  egress settings to allow access.
```

That is a network-policy problem, not a credentials problem. Allow the host, or
render with `engine: 'kokoro'` in the meantime.

---

## Re-timing after a voice change

Every beat in `scenes.ts` is pinned to the moment a particular word is said. A
different voice says the same words at different lengths, so the absolute times
stop meaning anything - but the *pacing* does not. How long the narrator waits
after each thought is the thing worth keeping.

That is what `src/config/voiceover.pacing.ts` stores, and it is measured
speech-to-speech, with each clip's own leading and trailing silence excluded, so
the numbers mean the same thing whichever engine produced the audio:

```
hook        lead 0.35  pauses [0.62]                          tail 0.74
example     lead 0.41  pauses [0.51, 0.71, 0.65, 0.55, 0.71]  tail 0.98
close       lead 0.50  pauses [0.39]                          tail 1.38
```

### The voices auditioned

Measured the same way as the local ones, on an identical line
(`output/voice-candidates.mp3` is the audition):

| Voice | Median F0 | Pitch range | Word rate | Read |
|---|---|---|---|---|
| **Alexander** | 115 Hz | 11.8 st | 164 wpm | **in use** - grounded baritone, corporate |
| Travis Hill | 102 Hz | 9.0 st | 186 wpm | deepest, but flat and very fast |
| Jacob L. | 145 Hz | 10.2 st | 182 wpm | description fits, pitch does not |
| Dan | 133 Hz | 7.3 st | 156 wpm | too monotone |
| Alexander, v3 + `[calm, measured]` | 94 Hz | 6.5 st | 148 wpm | deeper, but the tag flattened it |
| am_echo (local) | 109 Hz | 10.9 st | 139 wpm | the voice it replaced |

Two things that table settles. A direction tag is not a pace control - it moved
pitch and left the rate alone. And every hosted voice here speaks faster than
the local one, which is what the pause scaling below exists for.

### Pace from the pauses

A hosted voice speaks at whatever pace it speaks at. Alexander reads at about
150 wpm; this film wants 125-140. Slowing the rendered audio is what makes a
read sound dragged rather than calm, so the words keep their natural rate and
the unhurried feeling is recovered from the silence around them:

```bash
npm run voiceover:plan -- --pause-scale 1.15 --write
```

Every gap between phrases, and every scene lead-in and closing hold, gets that
much longer. Inter-phrase gaps are capped at 1.25s so none of them can turn into
dead air; lead-ins and tails are not capped, because a scene's opening and
closing holds are deliberate.

Picking the number, measured on the real assembled track rather than guessed:

| scale | runtime | median silence | longest | gaps over 1.5s |
|---|---|---|---|---|
| 1.0 | 101.7s | 0.66s | 1.61s | 3 |
| **1.15** | **105.5s** | **0.75s** | **1.82s** | 6 |
| 1.25 | 108.0s | 0.81s | 1.96s | 7 |
| 1.5 | 114.3s | 0.96s | 2.32s | 10 |

1.15 is in use: it puts the median squarely inside the 0.4-0.8s the brief asks
for, while 1.5 - which matched the old runtime - opened 2.3s holes at the scene
transitions. Note that the *configured* gaps in `scenes.ts` are about 0.2s
shorter than this, because each clip carries its own leading and trailing
silence; these figures are the silence you actually hear. `voiceover:plan` prints the word rate and the resulting
gap distribution so the number can be judged:

```
word rate 150 wpm (unchanged - the words are never slowed)
pauses between phrases: median 0.78s, longest 1.06s  [--pause-scale 1.35, capped at 1.25s]
```

```bash
npm run voiceover:plan                # what the current audio implies
npm run voiceover:plan -- --write     # apply it to scenes.ts
npm run voiceover:plan -- --snapshot  # re-capture, after approving a new cut
```

`--write` sets every line's `start`, every scene's `duration`, and shifts each
beat by the delta of the phrase it belongs to. **That last part is a first
approximation, not an answer** - it gets a beat into the right phrase, not onto
the right word. The tool prints every beat it moved so each can be checked.

Run against the audio it was captured from, the tool is a no-op to the
centisecond - which is the test that its arithmetic is right.

---

## Option A - regenerate with the built-in voice

The project ships a complete local text-to-speech pipeline. The script lives in
`src/config/scenes.ts`; edit a line's `text` and run:

```bash
npm run voiceover:build
npm run captions
npm run render
```

What that does, in order:

1. **Says each line on its own** with a local neural voice.
2. **Measures it.** If a line would run past its slot, it is re-said slightly
   faster - never past `minSpeed`, so it can never turn into a rushed mumble.
   If it still does not fit, you get a warning naming the scene to lengthen.
   In the current cut nothing is squeezed: every line is delivered at its
   configured pace.
3. **Lays the lines onto one silent bed** at exactly the times the animation
   expects.
4. **Normalises loudness.** ffmpeg's single-pass `loudnorm` is a *dynamic*
   normaliser and drifts badly on a track that is a third silence, so the
   script measures first and applies one flat gain - hitting the target exactly
   and leaving the delivery's own dynamics alone. It lands at roughly −17 LUFS
   with a −1.5 dBTP ceiling, which is where the peak limit bites.
5. **Builds the music bed**, ducks it against the narration envelope (fast
   attack so it drops as a word starts, slow release so it breathes back rather
   than pumps), and mixes. The voice ends up about 20 dB above the bed.
6. **Writes the measured durations back** to `src/config/voiceover.timing.ts`,
   which is what makes the subtitles land on the narration.

Everything runs on the machine - no script text is sent anywhere.

### Where the emphasis comes from

There is no SSML. Emphasis is produced two ways, both in `src/config/scenes.ts`:

- **Short phrases.** Each line is its own take, so the voice lands a real
  sentence-final cadence on it. `"From January to December…"` and
  `"…to April to March."` are separate phrases precisely so there is a beat
  between them.
- **Per-phrase `rate`.** Above 1 is slower and heavier, below 1 is brisker.
  The lines that carry the message (`From April to March.` at 1.12) are
  delivered noticeably slower than the connective tissue around them. The
  engine re-synthesises at that pace - nothing is time-stretched afterwards,
  which is what keeps a slow line sounding unhurried rather than dragged.

```ts
{
  id: 's4-l2',
  start: 3.63,
  text: 'From April to March.',
  spoken: 'From April, to March.',  // what the engine is given
  rate: 1.12,                       // slower = heavier = emphasis
  captions: ['From APRIL to MARCH'],
}
```

Keep `rate` inside roughly 0.95-1.15. Past that the pace stops reading as
emphasis and starts reading as a different speaker.

### Acronyms

Write the acronym normally and let the engine phonemise it. `KPIs` comes out as
the three letters K-P-I with a plural /z/, which is what an American speaker
says.

**Do not respell an acronym with spaces or hyphens to "help" it.** `K P Is` is
what the first cut of this film used, and the engine read the last two letters
as the word *is* - "kay pee **iz**". Measured against a reference recording of
"kay pee is", that take came back at a distance of 0.002 on a mel-DTW: not close
to wrong, identical to it.

The two readings are easy to tell apart without listening, because they differ
in one vowel and that vowel is wide open in one case and close in the other:

| | final vowel F1 | F2 | reading |
|---|---|---|---|
| reference "…kay pee eyes" | 695 Hz | 1174 Hz | /aɪz/ |
| reference "…kay pee is" | 509 Hz | 2018 Hz | /ɪz/ |
| `K P Is` (the old cut) | **224 Hz** | **2743 Hz** | /ɪz/ — wrong |
| `KPIs` (shipping) | **876 Hz** | **1143 Hz** | /aɪz/ — right |

A high F1 with a low F2 is the open `/aɪ/` nucleus of the letter I. A low F1
with a high F2 is the close `/ɪ/` of *is*. Anything above about 550 Hz F1 is the
letter; anything near 400 Hz is the word.

`HSE` was checked the same way and needs no help either - it renders identically
to a spelled-out "aitch ess ee" (distance 0.002). The `H-S-E` spelling in
`scenes.ts` is kept only because it is what the approved take used; plain `HSE`
measures the same.

If you do ever need to force a pronunciation, the Kokoro lexicon accepts extra
files: pass `lexicon` a comma-separated list in `scripts/lib/tts_kokoro.py` and
add `word p h o n e m e s` lines in the same format as `lexicon-us-en.txt`.
Reach for that only after measuring, not instead of it.

### Checking the American vowels

The `lexicon-us-en.txt` the pipeline passes to Kokoro is what keeps the read
American, and two words give it away immediately:

```
schedule   s k ˈ ɛ ʤ ˌ u l          "SKED-jool", not "SHED-yool"
january    ʤ ˈ æ n j ə w ˌ ɛ ɹ i    four syllables, not "JAN-yoo-ree"
```

Everything the film leans on is in there and rhotic - `performance`
p ə **ɹ** f ˈ ɔ **ɹ** m ə n s, `market` m ˈ ɑ **ɹ** k ə t, `first`
f ˈ ɜ **ɹ** s t. If a word starts sounding British, check whether it is in the
lexicon at all: anything missing falls through to espeak's own rules.

### Choosing a voice by measurement

The voice was not picked by browsing a list. Candidates were made to say the
same line and measured for median fundamental frequency (how deep) and the
semitone spread within a phrase (how monotone). That turns "sounds robotic"
into something you can check.

**Engine first.** Depth and clarity were never the problem - sentence rhythm
and word linking were, and those are a property of the model, not the speaker.
Piper says a sentence as a run of correctly pronounced words; Kokoro phrases it.
That is the single biggest reason the current read sounds less synthetic.

The nine American male Kokoro voices, measured:

| Speaker | id | Median F0 | Pitch range | Read |
|---|---|---|---|---|
| am_echo | 12 | 108 Hz | 11.2 st | the local fallback - settled, warm, still moving |
| am_michael | 16 | 118 Hz | 8.2 st | balanced, a little lighter |
| am_onyx | 17 | 89 Hz | 6.4 st | deeper, but close to monotone |
| am_adam | 11 | 123 Hz | 6.8 st | flat |
| am_puck | 18 | 132 Hz | 7.6 st | flat and brighter |
| am_liam | 15 | 128 Hz | 14.3 st | lively - too animated for this |
| am_fenrir | 14 | 154 Hz | 10.6 st | too high to read as senior |
| am_eric | 13 | 163 Hz | 13.0 st | too high to read as senior |
| am_santa | 19 | 181 Hz | 13.7 st | character voice |

Target for a senior-HR read: **100-118 Hz with 9-12 semitones of movement**.
Below about 6 semitones a voice reads as robotic no matter how deep it is; above
about 15 it starts to sound like an advertisement.

### Local voice settings

`src/config/voiceover.ts`, under `engine: 'kokoro'`:

```ts
tts: {
  engine: 'kokoro',
  speakerId: 12,          // am_echo
  speakerName: 'am_echo',
  speed: 0.82,            // LOWER is slower - measured at 132 wpm
  minSpeed: 0.92,         // the briskest the fitter may go
  pitchShiftSemitones: 0,
  sampleRate: 48000,
  loudnessTarget: -16,    // LUFS
}
```

**Mind the direction.** Kokoro's control is a *speed multiplier*, so lower is
slower. Piper's is a *length scale*, so higher is slower. The build script
handles both, but the numbers are not interchangeable between engines.

Pace is worth measuring rather than guessing. Over this script, `speed: 0.92`
came out at 152 words per minute, which reads as brisk; `0.82` comes out at
132 wpm, which is an unhurried presenting pace. Somewhere around 125-140 wpm is
the range that sounds like a person talking to a room.

**Requirement:** `pip install sherpa-onnx`, plus the Kokoro model in
`assets/tts/kokoro/` (384 MB, git-ignored). `npm run voiceover:build` prints the
exact two commands to fetch it if it is missing. This is only needed to
*generate* narration - rendering the video needs nothing but Node.

### Still using Piper

The Piper path has not been removed. Set `engine: 'piper'` with a `voice`,
`lengthScale`, `minLengthScale`, `noiseScale` and `noiseW`, and the pipeline
behaves exactly as before - the model (~63 MB) is fetched on first use into
`assets/tts/voices/`. It needs `pip install piper-tts`.

---

## Option B - drop in your own recordings, line by line

Best if you want a real human read but still want perfect sync.

1. `npm run voiceover:script` → `output/voiceover-script.md`.
   It lists every line with its **line ID**, its in-point, and how many seconds
   it has. Hand that to whoever is recording.
2. Save each take as `assets/audio/lines/<line-id>.wav` - `s1-l1.wav`,
   `s5-l2.wav`, and so on. Mono or stereo, any sample rate; trim leading silence.
3. Assemble:

```bash
npm run voiceover:build -- --assemble-only
npm run captions
npm run render
```

This skips synthesis entirely, places your takes at their configured times,
normalises the mix, and re-measures every line so the subtitles follow the new
read. If a take overruns its slot, lengthen that scene's `duration` in
`src/config/scenes.ts`.

---

## Option C - drop in one finished track

Simplest, if you already have a mixed narration bed.

1. Save it as `assets/audio/voiceover.wav` (48 kHz recommended; MP3 also works -
   set `audioFile: 'audio/voiceover.mp3'`).
2. Render.

Because nothing measured that file, the subtitles fall back to *estimated* line
durations. To re-sync them, edit the numbers in `src/config/voiceover.timing.ts`
- one entry per line ID, in seconds - and run `npm run captions`.

---

### Pitch trim

If you swap to a voice that sits outside the target range, nudge it with
`pitchShiftSemitones`. It resamples to shift the pitch and then restores the
original duration with `atempo`, so nothing downstream needs re-timing.

Keep it within about **two semitones**. Beyond that the formants smear and the
result sounds processed - at which point you want a different voice, not more
shift.

## The music bed

Generated locally by `scripts/lib/music.py`: a slow I–V–vi–IV pad in D, no
drums, no risers, no cinematic swell. It exists only so the gaps between phrases
do not feel like dead air.

```ts
music: {
  enabled: false,   // currently off
  bedGainDb: -14,   // bed level relative to the narration
  duckDb: -6,       // extra attenuation while the narrator is speaking
  fadeIn: 1.6,
  fadeOut: 2.2,
}
```

**Currently off** - the film runs on narration alone. Turning it back on is one
flag; the rest of the pipeline is unchanged either way, because `mix.py` still
performs the loudness pass and the limiting when the bed is silent. Those two
own the output ceiling, so skipping them would leave the track free to clip:
the narration alone measured -4.5 dBTP before its +4.7 dB gain, which is exactly
0 dBTP without a limiter.

To use your own track, drop a
48 kHz mono WAV at `assets/audio/music.wav` and run
`npm run voiceover:build -- --assemble-only`; the ducking and mix still apply.

## Rendering with no narration at all

Set `audioFile: null` in `src/config/voiceover.ts`. The film still renders, and
still makes complete sense: every point is on screen and the captions are burned
in. The MP4 keeps a silent AAC track so players that expect audio behave.

---

## Direction notes for a human read

- Warm, confident, conversational. A friendly HR colleague explaining a change -
  not a policy announcement, and not a newsreader.
- A professional American male presenter talking to colleagues. Not a
  commercial voice-over, not a news anchor, not a trailer.
- Moderate pace. The script is 202 words over 117 seconds; the narration itself
  runs at about 132 wpm with real pauses between phrases, which is deliberately
  unhurried. Every line has slack.
- Use contractions and link words together. Reading the line word by word is
  what makes a read sound synthetic, whoever is doing it.
- Take a real breath between scenes. The gaps are built into the timeline -
  0.4-0.8s after a statement, up to about 1.2s before a major visual reveal.
- Land these, without pushing them: **January to December**, **April to March**,
  **15 months**, **April 1**, **merit and promotion**, **March payroll**,
  **December**, and **5% → 6.25%**.
- Scene 3 is neutral, not apologetic - the current process is simply the current
  process.
- Scene 7 is the reassurance beat. Slow down slightly on
  *"your performance appraisal stays on the same schedule."*
- Scene 8 is the only arithmetic in the film. Explain it, do not teach it: the
  tone is "here is something useful to know", not a lesson.

## The Alexander read (partial)

20 of the 34 phrases of the refined script have been recorded with Alexander
(`hIru3zkEJ3dBYHTbMy2V`) through the ElevenLabs connector, and are committed to
`assets/audio/lines/` - an exception to the rule above that per-line takes are
disposable, because these ones cannot be reproduced from this repository: the
account is at zero credits (quota 10,000, 0 remaining) and re-generating them
costs credits.

Missing, and needing credits before the film can be scored end to end:

    s2-l1  s2-l2  s8-l3
    s9-l1  s9-l2  s9-l3  s9-l4  s9-l5  s9-l6  s9-l7
    s10-l1 s10-l2 s11-l1 s11-l2

Once the account has credits, generate exactly those fourteen with the same
voice and model, land them in `assets/audio/lines/`, then:

    npm run voiceover:build -- --assemble-only
    npm run voiceover:plan -- --pause-scale 1.5 --write
    npm run check:sync && npm run captions && npm run render

Note the account allows only **2 concurrent requests** - generate in pairs, or
every third request comes back as a concurrency failure that still bills.

### Pronunciation, verified on the delivered take

`s3-l4` ends on "Company Performance KPI's". Measured by peak F1 across the end
of the phrase (the open /ai/ of the letter I against the close /I/ of the word
"is"):

| take | peak F1 |
|---|---|
| reference "kay pee eyes" (letter I - correct) | 773 Hz |
| reference "kay pee is" (the word - wrong) | 625 Hz |
| **Alexander, s3-l4** | **828 Hz** |

The last three voiced runs of the clip read /keI/ - /pi:/ - /aI/, so the letters
are spelled out as the brief requires.
