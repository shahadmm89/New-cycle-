"""
Mixes the narration with the background bed, ducking the bed whenever the
narrator is speaking.

Piper gives us clean speech with real silence between phrases, so the duck can
be driven straight from the narration envelope rather than guessed at.

A gentle look-ahead limiter runs last. Without it the level has to be backed
off to keep the loudest consonant under the ceiling, which leaves the whole
track several dB quieter than it should be - the peaks in speech sit far above
its average, so a flat gain is always governed by the worst half-second.

Pass "none" as <music.wav> for a narration-only mix. The bed is then silent,
but the loudness pass and the limiter still run - which is the point: they own
the output ceiling, and skipping them would leave the track free to clip.

Usage: python3 mix.py <voice.wav> <music.wav|none> <out.wav> <bed_db> <duck_db>
                      <fade_in> <fade_out> [target_lufs] [ceiling_dbtp]
"""
import sys
import wave

import numpy as np

voice_path, music_path, out_path = sys.argv[1:4]
bed_db, duck_db, fade_in, fade_out = (float(x) for x in sys.argv[4:8])
target_lufs = float(sys.argv[8]) if len(sys.argv) > 8 else -16.0
ceiling_db = float(sys.argv[9]) if len(sys.argv) > 9 else -1.5


def read_wav(path):
    with wave.open(path, "rb") as w:
        rate = w.getframerate()
        ch = w.getnchannels()
        data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768.0
    if ch > 1:
        data = data.reshape(-1, ch).mean(axis=1)
    return data, rate


voice, rate = read_wav(voice_path)
if music_path == "none":
    music, mrate = np.zeros_like(voice), rate
else:
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


# --- loudness, then a gentle limiter ------------------------------------------
def integrated_lufs(x: np.ndarray) -> float:
    """BS.1770-style gated loudness. Close enough to steer a gain decision."""
    block = int(0.4 * rate)
    hop = block // 4
    powers = []
    for i in range(0, max(1, len(x) - block), hop):
        b = x[i : i + block]
        powers.append(float((b**2).mean()) + 1e-12)
    powers = np.array(powers)
    loud = -0.691 + 10 * np.log10(powers)
    # absolute gate, then the relative gate 10 LU below the ungated mean
    keep = loud > -70.0
    if not keep.any():
        return -70.0
    rel = -0.691 + 10 * np.log10(powers[keep].mean()) - 10.0
    keep &= loud > rel
    return -0.691 + 10 * np.log10(powers[keep].mean()) if keep.any() else -70.0


def limit(x: np.ndarray, ceiling: float, attack_s=0.003, release_s=0.18) -> np.ndarray:
    """Look-ahead peak limiter: smooth gain reduction, no hard clipping."""
    over = np.maximum(np.abs(x) / ceiling, 1.0)
    # Hold the maximum across a short look-ahead so gain is already down when
    # the peak arrives, rather than chasing it.
    look = max(1, int(attack_s * rate))
    pad = np.pad(over, (0, look), constant_values=1.0)
    target = np.maximum.reduce([pad[i : i + len(over)] for i in range(look + 1)])
    # One-pole release so the gain comes back smoothly instead of pumping.
    red = np.ones_like(target)
    coeff = np.exp(-1.0 / (release_s * rate))
    g = 1.0
    for i in range(len(target)):
        t = 1.0 / target[i]
        g = t if t < g else t + (g - t) * coeff
        red[i] = g
    return x * red


ceiling = 10 ** (ceiling_db / 20.0)
measured = integrated_lufs(mix)
mix = mix * (10 ** ((target_lufs - measured) / 20.0))
mix = limit(mix, ceiling)

peak = float(np.max(np.abs(mix)))
final = integrated_lufs(mix)

pcm = (np.clip(mix, -1.0, 1.0) * 32767).astype(np.int16)
with wave.open(out_path, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(rate)
    w.writeframes(pcm.tobytes())

speech_pct = 100.0 * float(speaking.mean())
print(
    f"mixed -> {out_path}  speech {speech_pct:.0f}% of timeline  "
    f"{final:.1f} LUFS  peak {20 * np.log10(peak):.1f} dBFS"
)
