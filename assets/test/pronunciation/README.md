# Pronunciation fixtures

Two known-answer reference takes for `npm run check:pronunciation`.

| file | says | why it is here |
|---|---|---|
| `ref-letter-i.wav` | "kay pee eyes" | the **correct** reading: the three letters, ending on the letter I |
| `ref-word-is.wav` | "kay pee is" | the **wrong** reading: the last two letters collapsed into the word "is" |

Both were made with the local offline engine, so they cost nothing and can be
remade. They exist so the test has a scale rather than an absolute threshold:
the letter I is the diphthong /ai/, whose nucleus is a wide-open vowel and so
carries a high first formant; the word "is" has no open vowel in it at all.
A take is judged by which of these two it sits nearer to.
