"""
Generates the background bed: a soft corporate pad, no drums, no swells.

Deliberately plain. It exists to stop the film feeling like a silent slideshow
between phrases, and nothing more - the brief is explicit that the voice must
sit clearly on top and that cinematic music is wrong for this piece.

Called by scripts/build-music.mjs.
Usage: python3 music.py <out.wav> <duration_seconds> <sample_rate>
"""
import sys
import wave

import numpy as np

out_path, duration_s, sample_rate = sys.argv[1], float(sys.argv[2]), int(sys.argv[3])

n = int(duration_s * sample_rate)
t = np.arange(n) / sample_rate

def note(midi: float) -> float:
    return 440.0 * (2.0 ** ((midi - 69) / 12.0))

# A quiet I - V - vi - IV in D, one chord every four seconds. Warm, resolved,
# and slow enough that it never pulls focus from a sentence.
PROGRESSION = [
    [50, 57, 62, 66],  # D
    [45, 57, 61, 64],  # A/C#-ish
    [47, 59, 62, 66],  # Bm
    [43, 55, 62, 67],  # G
]
CHORD_SECONDS = 4.0

audio = np.zeros(n, dtype=np.float64)

n_chords = int(np.ceil(duration_s / CHORD_SECONDS))
for c in range(n_chords):
    start = int(c * CHORD_SECONDS * sample_rate)
    end = min(n, int((c + 2) * CHORD_SECONDS * sample_rate))  # overlap so chords bleed
    if start >= n:
        break
    seg_len = end - start
    seg_t = np.arange(seg_len) / sample_rate

    # Slow attack and release: a pad, not a stab.
    env = np.sin(np.pi * np.linspace(0, 1, seg_len)) ** 1.6

    chord = PROGRESSION[c % len(PROGRESSION)]
    voice = np.zeros(seg_len)
    for vi, midi in enumerate(chord):
        f = note(midi)
        # Two slightly detuned partials per note give it width without chorus.
        for detune, amp in ((0.0, 1.0), (0.14, 0.55)):
            phase = 2 * np.pi * (f + detune) * seg_t + vi * 1.7
            voice += amp * np.sin(phase)
        # A touch of the octave, very quiet, for air.
        voice += 0.12 * np.sin(2 * np.pi * f * 2 * seg_t + vi)
    voice /= len(chord) * 2.0

    audio[start:end] += voice * env

# Gentle low-pass: a rolling average is enough to take the edge off the
# partials and leave something that sits under speech without hissing.
def lowpass(x: np.ndarray, cutoff_hz: float) -> np.ndarray:
    width = max(1, int(sample_rate / cutoff_hz))
    kernel = np.hanning(width * 2 + 1)
    kernel /= kernel.sum()
    return np.convolve(x, kernel, mode="same")

audio = lowpass(audio, 1600.0)

# A very slow breathing movement, so the bed is never perfectly static.
audio *= 0.82 + 0.18 * np.sin(2 * np.pi * t / 11.0)

peak = float(np.max(np.abs(audio))) or 1.0
audio = audio / peak * 0.9

pcm = (np.clip(audio, -1.0, 1.0) * 32767).astype(np.int16)
with wave.open(out_path, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(sample_rate)
    w.writeframes(pcm.tobytes())

print(f"{out_path} {duration_s:.2f}s {sample_rate}Hz")
