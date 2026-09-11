"""
Mixes the narration with the background bed, ducking the bed whenever the
narrator is speaking.

Piper gives us clean speech with real silence between phrases, so the duck can
be driven straight from the narration envelope rather than guessed at.

Usage: python3 mix.py <voice.wav> <music.wav> <out.wav> <bed_db> <duck_db> <fade_in> <fade_out>
"""
import sys
import wave

import numpy as np

voice_path, music_path, out_path = sys.argv[1:4]
bed_db, duck_db, fade_in, fade_out = (float(x) for x in sys.argv[4:8])


def read_wav(path):
    with wave.open(path, "rb") as w:
        rate = w.getframerate()
        ch = w.getnchannels()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768.0
    if ch > 1:
        data = data.reshape(-1, ch).mean(axis=1)
    return data, rate


voice, rate = read_wav(voice_path)
music, mrate = read_wav(music_path)
assert mrate == rate, f"sample rate mismatch: {rate} vs {mrate}"

n = len(voice)
music = np.pad(music, (0, max(0, n - len(music))))[:n]

# --- speech envelope -> duck curve -------------------------------------------
# Short window to catch phrase boundaries, then a long smoothing so the bed
# breathes back in rather than pumping.
win = int(0.03 * rate)
energy = np.convolve(np.abs(voice), np.ones(win) / win, mode="same")
speaking = (energy > 0.008).astype(np.float64)

# Open fast (duck as soon as a word starts), release slowly (no pumping).
attack = int(0.08 * rate)
release = int(0.55 * rate)
duck = np.zeros(n)
level = 0.0
for i in range(n):
    target = speaking[i]
    coeff = 1.0 / attack if target > level else 1.0 / release
    level += (target - level) * coeff
    duck[i] = level

bed_gain = 10 ** (bed_db / 20.0)
duck_gain = 10 ** (duck_db / 20.0)
music_gain = bed_gain * (1.0 + duck * (duck_gain - 1.0))

# --- fades --------------------------------------------------------------------
fi = int(fade_in * rate)
fo = int(fade_out * rate)
if fi > 0:
    music_gain[:fi] *= np.linspace(0, 1, fi) ** 2
if fo > 0:
    music_gain[-fo:] *= np.linspace(1, 0, fo) ** 2

mix = voice + music * music_gain

peak = float(np.max(np.abs(mix)))
if peak > 0.97:
    mix = mix / peak * 0.97

pcm = (np.clip(mix, -1.0, 1.0) * 32767).astype(np.int16)
with wave.open(out_path, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(rate)
    w.writeframes(pcm.tobytes())

speech_pct = 100.0 * float(speaking.mean())
print(f"mixed -> {out_path}  speech {speech_pct:.0f}% of timeline  peak {peak:.3f}")
