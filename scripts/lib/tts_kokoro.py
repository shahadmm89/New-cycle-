"""
Synthesises one voice-over phrase with Kokoro via sherpa-onnx.

Kokoro is a much more natural model than Piper - the difference is most
audible in sentence rhythm and word linking, which is exactly what makes a
read sound like a person rather than a narrator.

Called by scripts/build-voiceover.mjs - not meant to be run by hand.
Usage: python3 tts_kokoro.py <model_dir> <out.wav> <speaker_id> <speed>
The text is read from stdin so quoting is never an issue.
"""
import sys
import wave

import numpy as np
import sherpa_onnx

model_dir, out_path, speaker_id, speed = sys.argv[1:5]
text = sys.stdin.read().strip()

config = sherpa_onnx.OfflineTtsConfig(
    model=sherpa_onnx.OfflineTtsModelConfig(
        kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
            model=f"{model_dir}/model.onnx",
            voices=f"{model_dir}/voices.bin",
            tokens=f"{model_dir}/tokens.txt",
            data_dir=f"{model_dir}/espeak-ng-data",
            # The US lexicon is what keeps the vowels and stress American.
            lexicon=f"{model_dir}/lexicon-us-en.txt",
        ),
        num_threads=4,
    ),
    max_num_sentences=1,
)

tts = sherpa_onnx.OfflineTts(config)
audio = tts.generate(text, sid=int(speaker_id), speed=float(speed))
samples = np.asarray(audio.samples, dtype=np.float32)

with wave.open(out_path, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(audio.sample_rate)
    w.writeframes((np.clip(samples, -1.0, 1.0) * 32767).astype(np.int16).tobytes())
