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
     * Mature, measured US-English male. Chosen by measurement rather than by
     * ear: it sits at roughly 102 Hz - about seven semitones below the voice
     * this replaced - while still moving across ten semitones within a phrase.
     * That combination is what reads as "senior colleague" rather than
     * "narrator": deep and settled, but not flat.
     *
     * Alternatives that drop straight in, with their measured profile:
     *   en_US-hfc_male-medium   114 Hz / 11.1 st  - lighter, a little warmer
     *   en_US-joe-medium         99 Hz / 18.8 st  - deeper but theatrical
     *   en_US-bryce-medium      141 Hz /  7.7 st  - brighter, flatter
     */
    voice: 'en_US-norman-medium',
    /**
     * Base delivery speed. Individual phrases override this with `rate` in
     * scenes.ts - that is where the emphasis lives. Slightly above 1 gives the
     * unhurried, deliberate pace of someone who is not selling anything.
     */
    lengthScale: 1.05,
    /** The fastest the fitter may go when a phrase has to be squeezed. */
    minLengthScale: 0.9,
    /**
     * Expressiveness. Above the Piper defaults (0.667 / 0.8), which widens the
     * pitch movement across a phrase and is most of what separates a delivery
     * that sounds considered from one that sounds read out.
     */
    noiseScale: 0.75,
    noiseW: 0.88,
    /**
     * Optional final pitch trim, in semitones, applied with asetrate +
     * atempo so the duration is preserved. The chosen voice already lands in
     * the target range, so this is 0; keep any adjustment within about two
     * semitones, beyond which the formants smear and it starts to sound
     * processed.
     */
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
