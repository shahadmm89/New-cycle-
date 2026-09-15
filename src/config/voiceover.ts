/**
 * VOICE-OVER & AUDIO CONFIGURATION
 * --------------------------------
 * The script itself lives in src/config/scenes.ts (each scene owns its
 * phrases), so narration, captions and animation can never drift apart.
 * This file only says HOW the audio is produced and mounted.
 *
 * See docs/VOICEOVER.md
 */

export const voiceover = {
  /**
   * Path (relative to /assets) of the finished mix that the video mounts.
   * `npm run voiceover:build` writes exactly this file.
   * Drop in your own recording with the same name - nothing else changes.
   * Set to null to render the video silent.
   */
  audioFile: 'audio/mix.wav' as string | null,

  volume: 1,

  tts: {
    /**
     * WHICH ENGINE SAYS THE SCRIPT.
     *
     *   'elevenlabs'  the requested voice (Arthur). Needs ELEVENLABS_API_KEY in
     *                 the environment and outbound access to api.elevenlabs.io.
     *                 Uses the account's own licensed voice - nothing is cloned
     *                 or imitated.
     *   'kokoro'      the local fallback, and what the committed mix was made
     *                 with. Runs offline.
     *   'piper'       the older local engine. Still supported.
     *
     * To switch to ElevenLabs:
     *
     *   export ELEVENLABS_API_KEY=...
     *   # set engine: 'elevenlabs' below
     *   npm run voiceover:build
     *   npm run voiceover:plan -- --write   # re-time the scenes to the new read
     *   npm run captions && npm run render
     *
     * The re-timing step is not optional. A different voice says the same words
     * at different lengths, and every beat in scenes.ts is placed against a word.
     */
    engine: 'elevenlabs' as 'elevenlabs' | 'kokoro' | 'piper',

    /**
     * The narrator. Always a voice the account already licenses - `voiceId` is
     * a reference to their copy of it, never a recreation or a clone.
     */
    elevenlabs: {
      /**
       * Evan (TWutjvRaJqAX89preB4e). Specified by the client by id.
       *
       * The delivery the brief asks for: natural American English, warm, calm,
       * mature, professional, conversational, slightly deep and grounded. Not
       * an advertisement, not a news anchor, no exaggerated enthusiasm.
       *
       * Nothing about that is set here. `speed` stays at 1.0 and the words are
       * never slowed; the unhurried feel is built from the silence around them,
       * which src/config/voiceover.pacing.ts describes.
       *
       * Changing this line means re-recording the WHOLE script, not the part
       * that has changed: a film cannot switch narrator halfway. Takes from a
       * previous voice are kept under assets/audio/takes/ rather than deleted,
       * because they cost credits and cannot be remade for free.
       */
      voiceId: 'TWutjvRaJqAX89preB4e',
      voiceName: 'Evan',
      /** Their most natural English model at time of writing. */
      modelId: 'eleven_multilingual_v2',
      /** Forces the American pronunciations the script depends on. */
      languageCode: 'en',
      /**
       * Lower stability lets the read vary sentence to sentence, which is what
       * stops it sounding like a narrator working through a list. Too low and
       * it starts acting.
       */
      stability: 0.45,
      similarityBoost: 0.8,
      /** 0 is a plain read. Anything higher starts performing. */
      style: 0,
      speakerBoost: true,
      /**
       * 1.0 = the voice's own natural pace, and it stays there. The words are
       * never slowed; the unhurried feel is built from the silence around them,
       * which is what src/config/voiceover.pacing.ts describes.
       *
       * Those pauses are now authored at their final length, so the re-time is
       * a plain `npm run voiceover:plan -- --write` with no --pause-scale.
       * See "Pace from the pauses" in docs/VOICEOVER.md.
       */
      speed: 1.0,
    },

    /**
     * KOKORO SETTINGS (the local fallback).
     *
     * Kokoro rather than Piper: the difference is not depth or clarity, it is
     * sentence rhythm and word linking, which is most of what separates a read
     * that sounds like a person from one that sounds like a narrator working
     * through a list.
     */
    /**
     * am_echo. Chosen by measurement from the nine American male voices:
     * 108 Hz median with 11.4 semitones of movement within a phrase.
     *
     * The target for this brief is roughly 100-118 Hz with 9-12 semitones -
     * deep enough to read as mature, varied enough not to sound flat. The
     * measured alternatives:
     *   am_onyx   (17)   87 Hz /  7.0 st  - deeper, but close to monotone
     *   am_michael(16)  115 Hz /  8.7 st  - balanced, a little lighter
     *   am_adam   (11)  123 Hz /  6.8 st  - flat
     *   am_liam   (15)  128 Hz / 14.3 st  - lively, too animated for this
     *   am_eric   (13)  163 Hz / 13.0 st  - too high to read as senior
     */
    speakerId: 12,
    speakerName: 'am_echo',

    /**
     * Delivery speed. Kokoro re-synthesises at this pace rather than
     * time-stretching, so the voice stays natural - the pitch is identical at
     * 0.82 and at 1.0, which is what separates this from slowing an existing
     * recording down.
     *
     * Measured over the whole script, 0.82 lands at 132 words per minute: an
     * unhurried presenting pace. 0.92 measured 152 wpm, which read as brisk.
     */
    speed: 0.82,
    /** The briskest the fitter may go when a phrase has to be squeezed. */
    minSpeed: 0.92,

    /** Optional pitch trim in semitones. The chosen voice needs none. */
    pitchShiftSemitones: 0,
    sampleRate: 48000,
    /** Narration loudness, EBU R128 integrated. */
    loudnessTarget: -16,
  },

  /**
   * Background bed. Generated locally by scripts/build-music.mjs - a soft,
   * unobtrusive corporate pad, no drums, no cinematic swells.
   * Set `enabled: false` for a narration-only mix.
   */
  music: {
    /**
     * Off: the film runs on narration alone. mix.py still does the loudness
     * pass and the limiting - see the note there.
     */
    enabled: false,
    /**
     * Bed level. Tuned by ear against the narration: this leaves the voice
     * roughly 20 dB above the music while speaking - clearly dominant, but the
     * bed is still audible enough to stop the gaps feeling like dead air.
     */
    bedGainDb: -14,
    /** Extra attenuation applied while the narrator is speaking. */
    duckDb: -6,
    /** Seconds of fade at each end of the bed. */
    fadeIn: 1.6,
    fadeOut: 2.2,
  },
} as const;
