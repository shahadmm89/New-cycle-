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


def peak_f1(path, tail=TAIL):
    """Highest first formant anywhere in the last `tail` seconds of speech."""
    a0, sr0 = F.load(str(path))
    a, sr = F.decimate(a0, sr0)
    a = a[-int(tail * sr):]
    best = 0.0
    for s, e in F.voiced_runs(a, sr):
        fr = F.formants(a, sr, s, e)
        if len(fr):
            best = max(best, fr[:, 0].max())
    return best


def main():
    if not TAKE.exists():
        print(f'No take to check yet: {TAKE.relative_to(ROOT)}')
        print('Generate the narration first - see docs/VOICEOVER.md.')
        return 2

    right = peak_f1(FIXTURES / 'ref-letter-i.wav')
    wrong = peak_f1(FIXTURES / 'ref-word-is.wav')
    got = peak_f1(TAKE)
    # Halfway between the two references, so the bar moves with the voice
    # rather than being a number someone once wrote down.
    midpoint = (right + wrong) / 2

    print(f'reference  "kay pee eyes"  (letters, correct)   peak F1 {right:6.0f} Hz')
    print(f'reference  "kay pee is"    (the word, wrong)    peak F1 {wrong:6.0f} Hz')
    print(f'threshold  halfway between them                         {midpoint:6.0f} Hz')
    print(f'take       {TAKE.name:<32}       peak F1 {got:6.0f} Hz')

    if got >= midpoint:
        print(f'\nPASS - the take ends on an open vowel, so the letter I is being said.')
        return 0
    print(
        f'\nFAIL - the take ends closed, which means "KPIs" is being read as the\n'
        f'word "is". Change `kpiTermSpoken` in src/config/copy.ts to the next\n'
        f'candidate listed there and re-generate s3-l4 ONLY (about 54 credits).'
    )
    return 1


if __name__ == '__main__':
    sys.exit(main())
