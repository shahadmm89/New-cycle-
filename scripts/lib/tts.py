"""
Synthesises one voice-over line with Piper, a local neural text-to-speech model.

Called by scripts/build-voiceover.mjs - not meant to be run by hand.
Usage: python3 tts.py <model.onnx> <out.wav> <length_scale> <noise_scale> <noise_w>
The text is read from stdin so quoting is never an issue.
"""
import sys
import wave

from piper import PiperVoice, SynthesisConfig

model, out, length_scale, noise_scale, noise_w = sys.argv[1:6]
text = sys.stdin.read().strip()

voice = PiperVoice.load(model)
config = SynthesisConfig(
    length_scale=float(length_scale),
    noise_scale=float(noise_scale),
    noise_w_scale=float(noise_w),
)
with wave.open(out, "wb") as wav:
    voice.synthesize_wav(text, wav, syn_config=config)
