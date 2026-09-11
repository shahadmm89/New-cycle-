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
    engine: 'piper',
    /**
     * Warm, confident US-English male. "High" quality model - noticeably more
     * natural than the medium models, which matters when the brief is
     * "senior HR colleague, not an AI reading a document".
     * Alternatives that drop straight in: en_US-hfc_female-medium,
     * en_GB-cori-high, en_US-lessac-high.
     */
    voice: 'en_US-ryan-high',
    /**
     * Base delivery speed. Individual phrases override this with `rate` in
     * scenes.ts - that is where the emphasis comes from: the lines that matter
     * are said slower and heavier than the connective tissue around them.
     */
    lengthScale: 1.0,
    /** The fastest the fitter may go when a phrase has to be squeezed. */
    minLengthScale: 0.88,
    /**
     * Expressiveness. Slightly above the Piper default, which gives more pitch
     * movement across a phrase and reads as engaged rather than flat.
     */
    noiseScale: 0.72,
    noiseW: 0.85,
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
