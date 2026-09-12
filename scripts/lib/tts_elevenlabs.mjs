/**
 * Says one voice-over phrase with ElevenLabs, using the account's own licensed
 * voice. The voice is referenced by id - nothing is cloned, sampled or
 * recreated; if the key's account cannot use that voice, the API refuses and we
 * surface the refusal rather than substituting something.
 *
 * The key is read from ELEVENLABS_API_KEY and never written to disk or logged.
 *
 * Returns raw 24 kHz mono PCM; the caller wraps it as a WAV.
 */
const ENDPOINT = 'https://api.elevenlabs.io/v1/text-to-speech';

/** ElevenLabs accepts 0.7-1.2. Outside that it errors, so clamp and say so. */
export const clampSpeed = (speed) => {
  const v = Math.min(1.2, Math.max(0.7, speed));
  return {value: Number(v.toFixed(3)), clamped: Math.abs(v - speed) > 1e-6};
};

export const synthesise = async (text, {cfg, speed, apiKey}) => {
  if (!apiKey) {
    throw new Error(
      'ELEVENLABS_API_KEY is not set.\n' +
        `  engine is "elevenlabs", which needs the key for the account licensed to use ${cfg.voiceName}.\n` +
        '    export ELEVENLABS_API_KEY=...\n' +
        '  Or set engine: \'kokoro\' in src/config/voiceover.ts to use the local voice.',
    );
  }

  const {value: spd, clamped} = clampSpeed(speed);
  if (clamped) {
    console.log(`  note: speed ${speed.toFixed(3)} is outside the API's 0.7-1.2 range, sent as ${spd}`);
  }

  const url =
    `${ENDPOINT}/${encodeURIComponent(cfg.voiceId)}` +
    `?output_format=pcm_24000`;

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {'xi-api-key': apiKey, 'content-type': 'application/json'},
      body: JSON.stringify({
        text,
        model_id: cfg.modelId,
        language_code: cfg.languageCode,
        voice_settings: {
          stability: cfg.stability,
          similarity_boost: cfg.similarityBoost,
          style: cfg.style,
          use_speaker_boost: cfg.speakerBoost,
          speed: spd,
        },
      }),
    });
  } catch (err) {
    throw new Error(
      `Could not reach api.elevenlabs.io (${err.message}).\n` +
        '  Some sandboxes and CI networks block it. Check outbound HTTPS to that host,\n' +
        '  or set engine: \'kokoro\' in src/config/voiceover.ts to render with the local voice.',
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    const hint =
      res.status === 401 ? ' - the key was rejected'
      : res.status === 403 ? ` - this account may not have access to ${cfg.voiceName} (${cfg.voiceId})`
      : res.status === 422 ? ' - the API rejected a setting; check modelId and voice_settings'
      : res.status === 429 ? ' - rate limited or out of quota'
      : '';
    throw new Error(`ElevenLabs returned HTTP ${res.status}${hint}\n  ${body.slice(0, 500)}`);
  }

  return {pcm: Buffer.from(await res.arrayBuffer()), sampleRate: 24000};
};
