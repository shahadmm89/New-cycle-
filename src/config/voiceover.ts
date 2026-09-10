/**
 * VOICE-OVER CONFIGURATION
 * ------------------------
 * The script itself lives in src/config/scenes.ts (each scene owns its lines),
 * so that narration, captions and animation can never drift apart.
 * This file only says HOW the audio is produced and mounted.
 *
 * See docs/VOICEOVER.md
 */

export const voiceover = {
  /**
   * Path (relative to /assets) of the finished narration track.
   * `npm run voiceover:build` writes exactly this file.
   * Drop in your own recording with the same name - nothing else changes.
   * Set to null to render the video silent.
   */
  audioFile: 'audio/voiceover.wav' as string | null,

  /** Playback gain applied to the narration inside the video. */
  volume: 1,

  /**
   * Text-to-speech settings used by `npm run voiceover:build`.
   * Ignored completely if you supply your own recording.
   */
  tts: {
    engine: 'piper',
    /** Neural voice. Warm, natural US-English female - suits HR comms. */
    voice: 'en_US-hfc_female-medium',
    /**
     * Base speaking rate. 1.0 is the voice's natural pace; higher is slower.
     * 1.06 gives a calm, moderate delivery that is easy to follow.
     */
    lengthScale: 1.06,
    /** Fastest the fitter is allowed to speak when a line must be squeezed. */
    minLengthScale: 0.9,
    /** Expressiveness / variation. Piper defaults are 0.667 and 0.8. */
    noiseScale: 0.667,
    noiseW: 0.8,
    /** Extra silence added after each sentence, in seconds. */
    sentenceSilence: 0.12,
    /** Output sample rate of the assembled track. */
    sampleRate: 48000,
    /** Broadcast-style loudness normalisation (EBU R128 integrated LUFS). */
    loudnessTarget: -16,
  },
} as const;
