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
   * These two are set from measurements of the rendered mix, not from taste.
   *
   * The source material: the music bed is -18.7 dB RMS and the narration
   * phrases are about -16.7 dB RMS, so the gains below are what actually
   * decides the balance. An earlier pass used 0.125 / 0.05, which sounds
   * reasonable written down and put the bed 25 dB under the voice during
   * narration - not subtle, simply absent.
   *
   * Bed level between phrases: about -29 dB in the mix. Present enough that a
   * deliberate 1.5s pause has something in it, quiet enough that the film
   * still reads as narration rather than as a track with narration over it.
   */
  bedGain: 0.3,

  /**
   * Bed level while anybody is speaking: about -36 dB, roughly 16 dB under the
   * voice. That is the band where a bed supports a read without ever being
   * something the listener has to hear past.
   */
  duckedGain: 0.13,

  /**
   * Seconds of lead-in and release around each phrase for the duck.
   *
   * This was 0.45s, and measuring the rendered mix showed it was swallowing
   * the film: with ramps that long on both sides, even the 1.55s emphasis
   * pauses never reached the resting level, so the bed sat ducked from the
   * first word to the last and the pauses had no music in them to speak of.
   * At 0.30s a long pause gets the best part of a second at full level, which
   * is what stops a deliberate silence sounding like dead air.
   */
  duckRamp: 0.3,

  /**
   * Short, because the bed has to be established before the first word.
   *
   * At 2.6s the film opened in silence - the first two seconds measured below
   * -46 dB, and the voice then arrived at -21 dB with nothing underneath it.
   */
  fadeIn: 1.0,
  /** Long, so the bed is already gone under the final logo frame. */
  fadeOut: 3.4,
} as const;
