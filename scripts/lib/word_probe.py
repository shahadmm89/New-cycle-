"""
WHERE DOES A GIVEN WORD START INSIDE A RECORDED PHRASE?

Counting syllable nuclei and handing them out to words in order is a guess, and
it fails in both directions: miss a nucleus and every later word is placed too
late, find a spurious one and they are all placed too early. On this voice the
counts were out by up to six on a nineteen-syllable line, which is a third of a
second of error on exactly the beats that must land on a month name.

So don't count. Say the word on its own in the same voice, and find where in
the phrase it fits best.

The match is on log-mel frames with per-frame normalisation, so it keys on the
shape of the spectrum rather than loudness, and a word spoken in isolation
still matches the same word spoken inside a sentence.

A short template will happily match a spectrally similar syllable somewhere
else in the line - "April" in "Merit increases and promotions will take effect
on April first" matched a point a quarter of the way in, six words early. So the
search is confined to a window around where the word roughly ought to be, taken
from its position in the sentence. The rough estimate chooses the region; the
match chooses the moment inside it.

Local, offline, and free - it is the same model that produced the phrase.
"""
import numpy as np
import subprocess
import tempfile
import wave
from pathlib import Path

LIB = Path(__file__).parent
TTS = LIB / 'tts_kokoro.py'


def load(p):
    with wave.open(str(p)) as w:
        sr = w.getframerate()
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    return a.astype(np.float64) / 32768, sr


def say(text, model_dir, speaker, speed, out):
    """One phrase, through the same local model that made the narration."""
    r = subprocess.run(
        ['python3', str(TTS), str(model_dir), str(out), str(speaker), str(speed)],
        input=text, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f'kokoro failed: {r.stderr[-300:]}')
    return out


def _mel_filters(sr, n_fft, n_mels=40, fmin=80, fmax=7600):
    def hz2mel(f): return 2595 * np.log10(1 + f / 700)
    def mel2hz(m): return 700 * (10 ** (m / 2595) - 1)
    pts = mel2hz(np.linspace(hz2mel(fmin), hz2mel(fmax), n_mels + 2))
    bins = np.floor((n_fft + 1) * pts / sr).astype(int)
    fb = np.zeros((n_mels, n_fft // 2 + 1))
    for m in range(1, n_mels + 1):
        l, c, r = bins[m - 1], bins[m], bins[m + 1]
        if c == l: c = l + 1
        if r == c: r = c + 1
        fb[m - 1, l:c] = (np.arange(l, c) - l) / max(1, c - l)
        fb[m - 1, c:r] = (r - np.arange(c, r)) / max(1, r - c)
    return fb


def logmel(a, sr, hop_s=0.010, win_s=0.025, n_mels=40):
    hop, win = int(sr * hop_s), int(sr * win_s)
    n_fft = 1 << (win - 1).bit_length()
    fb = _mel_filters(sr, n_fft, n_mels)
    w = np.hanning(win)
    out = []
    for i in range(0, max(1, len(a) - win), hop):
        sp = np.abs(np.fft.rfft(a[i:i + win] * w, n_fft)) ** 2
        out.append(np.log(fb @ sp + 1e-10))
    m = np.array(out)
    # Per-frame normalisation: match on spectral shape, not on how loud the
    # word happened to be said.
    m -= m.mean(axis=1, keepdims=True)
    n = np.linalg.norm(m, axis=1, keepdims=True)
    return m / np.maximum(n, 1e-9)


def syllables(word):
    import re
    w = re.sub(r'[^a-z]', '', word.lower())
    if len(w) <= 3: return 1
    n, prev = 0, False
    for c in w:
        v = c in 'aeiouy'
        if v and not prev: n += 1
        prev = v
    if w.endswith('e') and n > 1: n -= 1
    return max(1, n)


def rough_onset(a, sr, text, word_index):
    """Where the word would fall if the phrase were spoken at an even rate per
    syllable. Wrong by a few tenths, which is fine - it only has to pick the
    region the real match is in."""
    env = np.abs(a)
    thr = max(env.max() * 0.02, 0.004)
    on = np.where(env > thr)[0]
    t0, t1 = (on[0] / sr, on[-1] / sr) if len(on) else (0.0, len(a) / sr)
    syl = [syllables(w) for w in text.split()]
    total = sum(syl) or 1
    return t0 + (t1 - t0) * sum(syl[:word_index]) / total


def find(phrase_wav, word_text, model_dir, speaker, speed, hop_s=0.010,
         text=None, word_index=None, window=1.0):
    """
    Returns (onset_seconds, score). Score is mean cosine similarity over the
    best-matching window, 1.0 being identical - in practice a confident hit on
    this voice sits around 0.6 and upwards.

    Pass `text` and `word_index` to confine the search to +/- `window` seconds
    of where the word roughly belongs. Without them the whole phrase is searched
    and a short word can match the wrong place.
    """
    a, sr = load(phrase_wav)
    with tempfile.TemporaryDirectory() as d:
        probe = Path(d) / 'w.wav'
        say(word_text, model_dir, speaker, speed, probe)
        b, sr2 = load(probe)
    if sr2 != sr:
        raise RuntimeError('sample rate mismatch between phrase and probe')

    # Trim the probe's own leading and trailing silence, so the match is the
    # word rather than the word plus a pause.
    env = np.abs(b)
    thr = max(env.max() * 0.02, 0.004)
    on = np.where(env > thr)[0]
    if len(on):
        b = b[on[0]:on[-1] + 1]

    P, Q = logmel(a, sr, hop_s), logmel(b, sr, hop_s)
    if len(Q) < 3 or len(P) <= len(Q):
        return None, 0.0
    # Cosine similarity of every aligned window, which with normalised frames
    # is just the mean of the elementwise products.
    scores = np.array([
        float((P[i:i + len(Q)] * Q).sum()) / len(Q)
        for i in range(len(P) - len(Q) + 1)
    ])

    if text is not None and word_index is not None:
        centre = rough_onset(a, sr, text, word_index)
        lo = max(0, int((centre - window) / hop_s))
        hi = min(len(scores), int((centre + window) / hop_s) + 1)
        if hi > lo:
            k = lo + int(np.argmax(scores[lo:hi]))
            return k * hop_s, float(scores[k])

    k = int(np.argmax(scores))
    return k * hop_s, float(scores[k])
