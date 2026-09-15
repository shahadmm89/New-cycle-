#!/usr/bin/env python3
"""
DOES THE NARRATOR SAY "KPIs" CORRECTLY?
---------------------------------------
    npm run check:pronunciation

The bonus line ends on "Company Performance KPIs", and it has to come out as the
three letters - K, P, I - with a plural /z/. Speech engines get this wrong in one
specific way: the last two letters collapse into the word "is". It is an easy
mistake to miss by ear on a first listen and impossible to miss on the tenth.

HOW IT IS MEASURED. The letter I is the diphthong /ai/. Its nucleus is a
wide-open vowel, which puts the first formant high - around 800 Hz. The word
"is" is a close vowel with no open nucleus anywhere in it, and sits near 500.
So: scan the end of the phrase and take the HIGHEST F1 found there.

Two traps this avoids:

  - Do not take the last voiced stretch of the clip. That lands on the
    diphthong's OFFGLIDE, which is close and front, and reports a correct take
    as wrong. Scan for the peak across the tail instead.
  - Do not run LPC at 48 kHz with a small model order. Order has to match
    bandwidth (~2 + sr/1000), so the signal is decimated to 10 kHz first.
    Skipping this once produced an F1 of 1884 Hz, which no vowel has.

The verdict is relative, not absolute: the take is compared against two
known-answer references in assets/test/pronunciation/, so a deeper or brighter
voice does not move the threshold under it.
"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent / 'lib'))
import numpy as np
import formants as F

ROOT = pathlib.Path(__file__).resolve().parent.parent
FIXTURES = ROOT / 'assets' / 'test' / 'pronunciation'
# The line that ends on the term. Change it here if the script changes.
TAKE = ROOT / 'assets' / 'audio' / 'lines' / 's3-l4.wav'
TAIL = 0.9


# No vowel has a first formant outside this band. A frame that reports one has
# had F2 mistaken for F1, which happens on very close vowels where F1 sits low
# and the low-frequency peak is weak. Counting those frames turns a wrong take
# into a pass - one did, at 2216 Hz, which is not a sound a human mouth makes.
F1_MIN, F1_MAX = 200.0, 1100.0
# F1 and F2 that close together is a tracking failure too, not a vowel.
F1_F2_GAP = 200.0


def peak_f1(path, tail=TAIL):
    """
    Highest CREDIBLE first formant in the last `tail` seconds of speech.

    Returns (peak, frames_used, frames_rejected) so a measurement resting on
    almost no usable frames can be seen rather than reported as a number.
    """
    a0, sr0 = F.load(str(path))
    a, sr = F.decimate(a0, sr0)
    a = a[-int(tail * sr):]
    best, used, rejected = 0.0, 0, 0
    for s, e in F.voiced_runs(a, sr):
        for f1, f2 in F.formants(a, sr, s, e):
            if F1_MIN <= f1 <= F1_MAX and f2 - f1 >= F1_F2_GAP:
                best = max(best, f1)
                used += 1
            else:
                rejected += 1
    return best, used, rejected


def main():
    if not TAKE.exists():
        print(f'No take to check yet: {TAKE.relative_to(ROOT)}')
        print('Generate the narration first - see docs/VOICEOVER.md.')
        return 2

    right, _, _ = peak_f1(FIXTURES / 'ref-letter-i.wav')
    wrong, _, _ = peak_f1(FIXTURES / 'ref-word-is.wav')
    got, used, rejected = peak_f1(TAKE)
    # Halfway between the two references, so the bar moves with the voice
    # rather than being a number someone once wrote down.
    midpoint = (right + wrong) / 2

    print(f'reference  "kay pee eyes"  (letters, correct)   peak F1 {right:6.0f} Hz')
    print(f'reference  "kay pee is"    (the word, wrong)    peak F1 {wrong:6.0f} Hz')
    print(f'threshold  halfway between them                         {midpoint:6.0f} Hz')
    print(f'take       {TAKE.name:<32}       peak F1 {got:6.0f} Hz'
          f'   ({used} usable frames, {rejected} rejected)')
    if used < 3:
        print('\nINCONCLUSIVE - too few usable frames at the end of the phrase to'
              '\njudge it. Look at the clip by hand before trusting anything here.')
        return 1

    if got >= midpoint:
        print(f'\nPASS - the take ends on an open vowel, so the letter I is being said.')
        return 0
    print(
        f'\nFAIL - the take ends closed, which means "KPIs" is being read as the\n'
        f'word "is". Change `kpiTermSpoken` in src/config/copy.ts to the next\n'
        f'candidate listed there and re-generate s3-l4 ONLY - never the script.'
    )
    return 1


if __name__ == '__main__':
    sys.exit(main())
