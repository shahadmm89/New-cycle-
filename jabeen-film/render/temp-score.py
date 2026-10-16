"""
TEMP SCORE - a timing guide for the animatic, NOT music for release.

Synthesises a simple string-pad sketch that follows the storyboard's music
cues (atmospheric open, build, reveal hit at S2, flowing walkthrough, softer
floor-plan passage, rebuild and finale), so the edit can be judged against
the intended emotional shape. Replace it with a licensed orchestral track
(public/audio/score.wav) for the release film - see docs/PRODUCTION-PLAN.md.

Usage: python3 -I render/temp-score.py <storyboard.json> <out.wav>  (then encode to public/audio/temp-score.mp3) [villa_count]
"""
import json
import sys
import wave

import numpy as np

board_path, out_path = sys.argv[1], sys.argv[2]
villas = int(sys.argv[3]) if len(sys.argv) > 3 else 1
SR = 48000

board = json.load(open(board_path))
fps = board["fps"]

# Scene start times in seconds, mirroring src/lib/timeline.ts (frame-rounded).
starts, t = {}, 0
for sc in board["scenes"]:
    starts[sc["id"]] = t / fps
    passes = villas if sc.get("perVilla") else 1
    for p in range(passes):
        for sh in sc["shots"]:
            if p > 0 and not sh.get("inCondensed"):
                continue
            d = sh.get("condensedDur", sh["dur"]) if p > 0 else sh["dur"]
            t += round(d * fps)
total = t / fps
n = int(total * SR)
time = np.arange(n) / SR

def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)

def strings(freq, length, bright):
    """Band-limited saw ensemble: 3 detuned voices, harmonics rolled off by brightness."""
    tt = np.arange(length) / SR
    out = np.zeros(length)
    for det in (-0.12, 0.0, 0.13):
        f = freq * (1 + det / 100 * 3)
        vib = 1 + 0.0025 * np.sin(2 * np.pi * 5.1 * tt + det * 40)
        for k in range(1, 9):
            if f * k > 9000:
                break
            out += (1 / k) * (bright ** (k - 1)) * np.sin(2 * np.pi * f * k * vib * tt + k * det)
    return out / 3

# (start_scene, offset_s, chord midi notes, seconds per chord, level, brightness)
S = starts
sections = [
    (S["S1"], [[38, 45, 50]], 12.0, 0.16, 0.25),                               # drone
    (S["S1"] + 12, [[38, 50, 53, 57], [34, 50, 53, 58], [41, 48, 53, 57], [36, 48, 52, 55]], 2.0, 0.30, 0.45),  # build Dm Bb F C
    (S["S2"], [[38, 50, 54, 57, 62], [43, 50, 55, 59, 62], [45, 52, 57, 61, 64], [38, 50, 54, 57, 62]], 3.5, 0.55, 0.6),  # reveal D G A D
    (S["S3"], [[38, 50, 54, 57], [47, 50, 54, 59], [43, 50, 55, 59], [45, 49, 52, 57]], 3.0, 0.42, 0.5),        # momentum D Bm G A
    (S["S4"], [[43, 55, 59, 62], [38, 54, 57, 62], [40, 55, 59, 64], [45, 52, 57, 61]], 4.0, 0.34, 0.4),        # walkthrough G D Em A
    (S["S6"], [[43, 59, 62, 67], [38, 57, 62, 66], [40, 59, 64, 67], [45, 57, 61, 64]], 5.0, 0.22, 0.3),        # softer
    (S["S7"], [[38, 50, 54, 57, 62], [47, 54, 59, 62], [43, 55, 59, 62, 67], [45, 57, 61, 64, 69]], 3.0, 0.48, 0.55),  # rebuild
    (S["S8"], [[38, 50, 57, 62, 66], [45, 52, 57, 61, 64], [47, 54, 59, 62, 66], [43, 55, 59, 62, 67]], 2.5, 0.68, 0.65),  # finale
]

mix = np.zeros(n)
for i, (start, chords, cs, level, bright) in enumerate(sections):
    end = sections[i + 1][0] if i + 1 < len(sections) else total
    tcur, ci = start, 0
    while tcur < end - 0.01:
        # Finale: hold the last chord (D major) to the end.
        last = i == len(sections) - 1 and tcur + cs * 2 > end
        chord = [38, 50, 57, 62, 66, 69] if last else chords[ci % len(chords)]
        dur = (end - tcur) if last else cs
        a, b = int(tcur * SR), min(n, int((tcur + dur + 0.8) * SR))
        L = b - a
        env = np.minimum(1, np.arange(L) / (0.6 * SR)) * np.minimum(1, (L - np.arange(L)) / (0.9 * SR))
        seg = sum(strings(hz(m), L, bright) for m in chord) / len(chord)
        mix[a:b] += level * env * seg
        tcur += dur
        ci += 1

# Crescendo into the reveal + timpani hits at S2 and S8.
def swell(at, length):
    a, b = int((at - length) * SR), int(at * SR)
    noise = np.random.default_rng(1).standard_normal(b - a)
    noise = np.convolve(noise, np.ones(40) / 40, mode="same")
    mix[a:b] += 0.25 * np.linspace(0, 1, b - a) ** 3 * noise

def timpani(at, level):
    a = int(at * SR)
    L = min(n - a, int(3.0 * SR))
    tt = np.arange(L) / SR
    f = 49 * (1 + 0.15 * np.exp(-tt * 18))
    mix[a:a + L] += level * np.exp(-tt * 1.6) * np.sin(2 * np.pi * np.cumsum(f) / SR)

swell(S["S2"], 2.5); timpani(S["S2"], 0.9)
swell(S["S8"], 2.0); timpani(S["S8"], 0.6)
timpani(total - 5.0, 0.5)

# Simple room: a few feedback delays for width, then normalise.
left, right = mix.copy(), mix.copy()
for d, g in ((0.031, 0.35), (0.047, 0.3), (0.089, 0.22), (0.113, 0.18)):
    k = int(d * SR)
    left[k:] += g * mix[:-k]
    right[int(k * 1.13):] += g * mix[: -int(k * 1.13)]
fade = np.minimum(1, (n - np.arange(n)) / (2.0 * SR))
stereo = np.stack([left * fade, right * fade], axis=1)
stereo /= np.max(np.abs(stereo)) / 0.85

with wave.open(out_path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((stereo * 32767).astype("<i2").tobytes())
print(f"temp score: {total:.1f}s -> {out_path}")
