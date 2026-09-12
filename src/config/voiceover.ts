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
     * Kokoro, rather than Piper. The difference is not depth or clarity - it
     * is sentence rhythm and word linking, which is most of what separates a
     * read that sounds like a person from one that sounds like a narrator
     * working through a list.
     */
    engine: 'kokoro',

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
    enabled: true,
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
