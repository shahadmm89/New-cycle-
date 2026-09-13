/**
 * AUDIO CONFIGURATION for the well-being film.
 *
 * THE VOICE
 * ---------
 * The same narrator as the company's previous film: ElevenLabs "Alexander"
 * (hIru3zkEJ3dBYHTbMy2V), read with eleven_multilingual_v2, in English.
 * The voice is referenced by id through the account licensed to use it -
 * nothing is cloned, sampled or imitated.
 *
 * The read is unhurried by construction rather than by slowing anything down.
 * Alexander speaks at his own natural pace (~147 wpm across these phrases) and
 * the calm comes from the silence between them, which is declared per phrase as
 * `pauseAfter` in src/config/wellbeing.ts. Over the finished film that lands at
 * about 108 words per minute.
 *
 * THE MUSIC
 * ---------
 * A 2-minute instrumental bed generated with eleven_music_v2: soft piano and
 * pad, no percussion, no vocals, no swells. It was checked for vocals by
 * transcribing it - the transcript came back empty, which is the only reliable
 * way to be sure a generated "instrumental" really is one.
 *
 * It sits far under the voice. The brief is explicit that the music must never
 * compete with the narration, so on top of an already low bed level the track
 * ducks further under every spoken phrase, automatically, from the timeline.
 */

export const voice = {
  provider: 'elevenlabs',
  voiceId: 'hIru3zkEJ3dBYHTbMy2V',
  voiceName: 'Alexander',
  modelId: 'eleven_multilingual_v2',
  languageCode: 'en',
  /** Where the rendered phrases live, relative to /assets. */
  directory: 'audio/wellbeing',
} as const;

export const music = {
  /** Path inside /assets. */
  file: 'audio/wellbeing/music-bed.mp3',

  /**
   * Bed level between phrases, as a linear gain (about -18 dB).
   * Low enough that the film reads as narration over silence, present enough
   * that the long deliberate pauses do not sound like dead air.
   */
  bedGain: 0.125,

  /**
   * Bed level while anybody is speaking (about -26 dB) - roughly 8 dB below
   * the resting level. The voice is never in competition with it.
   */
  duckedGain: 0.05,

  /**
   * Seconds of lead-in and release around each phrase for the duck. Without
   * this the bed steps up and down audibly between close-packed phrases.
   */
  duckRamp: 0.45,

  fadeIn: 2.6,
  /** Long, so the bed is already gone under the final logo frame. */
  fadeOut: 3.4,
} as const;
