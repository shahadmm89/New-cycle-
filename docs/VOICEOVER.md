# Changing the voice-over

The narration is **not** baked into the animation. The timeline is driven by the
scene config, so swapping the voice never means rebuilding anything.

There are three ways to do it, from least to most work.

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
   faster - never below `minLengthScale`, so it can never turn into a rushed
   mumble. If it still does not fit, you get a warning naming the scene to
   lengthen.
3. **Lays the lines onto one silent 90-second bed** at exactly the times the
   animation expects.
4. **Normalises loudness** to −16 LUFS with a −1.5 dBTP ceiling (comfortable for
   Teams and laptop speakers, with no clipping).
5. **Writes the measured durations back** to `src/config/voiceover.timing.ts`,
   which is what makes the subtitles land on the narration.

Everything runs on the machine - no script text is sent anywhere.

### Voice settings

`src/config/voiceover.ts`:

```ts
tts: {
  engine: 'piper',
  voice: 'en_US-hfc_female-medium',  // warm, natural US-English female
  lengthScale: 1.06,                 // >1 is slower; 1.06 is a calm HR pace
  minLengthScale: 0.9,               // the floor when a line must be squeezed
  noiseScale: 0.667,
  noiseW: 0.8,
  sampleRate: 48000,
  loudnessTarget: -16,               // LUFS
}
```

Other voices from the same family drop straight in - for example
`en_US-amy-medium`, `en_US-lessac-medium`, `en_GB-alba-medium`,
`en_GB-northern_english_male-medium`. Change `voice` and re-run
`npm run voiceover:build`; the model (~63 MB) is fetched automatically on first
use and cached in `assets/tts/voices/` (git-ignored).

**Requirement:** `pip install piper-tts`. This is only needed to *generate*
narration - rendering the video needs nothing but Node.

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

## Option C - drop in one finished 90-second track

Simplest, if you already have a mixed narration bed.

1. Save it as `assets/audio/voiceover.wav` (48 kHz recommended; MP3 also works -
   set `audioFile: 'audio/voiceover.mp3'`).
2. Render.

Because nothing measured that file, the subtitles fall back to *estimated* line
durations. To re-sync them, edit the numbers in `src/config/voiceover.timing.ts`
- one entry per line ID, in seconds - and run `npm run captions`.

---

## Rendering with no narration at all

Set `audioFile: null` in `src/config/voiceover.ts`. The film still renders, and
still makes complete sense: every point is on screen and the captions are burned
in. The MP4 keeps a silent AAC track so players that expect audio behave.

---

## Direction notes for a human read

- Warm, confident, conversational. A friendly HR colleague explaining a change -
  not a policy announcement, and not a newsreader.
- Moderate pace. The whole script is 177 words over 90 seconds (~118 wpm), which
  is deliberately unhurried; every line has slack.
- Take a real breath between scenes. The gaps are built into the timeline.
- Scene 3 is neutral, not apologetic - the current process is simply the current
  process.
- Scene 6 is the reassurance beat. Slow down slightly on
  *"your performance appraisal cycle does not change."*
- Scene 5 carries the three facts people will repeat afterwards. Land
  **March payroll**, **April 1** and **April payroll** clearly.
