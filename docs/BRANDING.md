# Changing the branding

Everything a company would want to swap lives in **`src/config/branding.ts`**.
No colour, font or placeholder is repeated anywhere else in the project, so this
one file is the whole job. Re-render afterwards with `npm run render`.

## 1. Colours

```ts
export const colors = {
  primary:   '#2F5FE0',   // headings, key strokes, primary highlights
  secondary: '#12B5A5',   // supporting shapes, the "new" side of comparisons
  accent:    '#F5A524',   // spotlight colour for the three key dates
  success:   '#1F9D63',   // checkmarks, the "NO CHANGE" stamp
  background:'#FBFAF6',   // the paper the whole film is drawn on
  surface:   '#FFFFFF',   // cards and panels
  text:      '#1F2933',   // body text AND the "pen" colour of every sketch line
  textSoft:  '#5C6B7A',   // secondary labels
  line:      '#DFE3E8',   // notebook grid, dividers
  neutral:   '#8C9AA8',   // the calm "current state" colour
  captionBg: 'rgba(31, 41, 51, 0.88)',
  captionText: '#FFFFFF',
};
```

Replace the hex values with your corporate palette. A few things worth knowing:

- **`text` is also the ink.** Every hand-drawn stroke uses it. Keep it dark;
  a mid-grey will make the sketch look washed out.
- **`accent` carries the three key dates.** Pick something that stands out
  against `background` - it is what the eye lands on in scene 5.
- **`background`** should stay very light. The captions and the paper grid
  assume a light stage.
- **Contrast:** keep `text` and `textSoft` at 4.5:1 or better against
  `background`, and white at 4.5:1 against `primary`/`success`, which both
  carry white text.

Nothing else needs touching - the scenes read these tokens, they never contain
literal colours.

## 2. Company logo

```ts
export const brand = {
  companyName: '[COMPANY NAME]',
  logoSrc: null,                        // ← set this
  logoPlaceholderLabel: '[COMPANY LOGO]',
  …
};
```

1. Drop your file into `assets/logo/` (SVG or a transparent PNG).
2. Set `logoSrc: 'logo/your-logo.svg'` - the path is relative to `assets/`.

The logo then appears top-right for the whole 90 seconds, scaled to 60px tall.
While `logoSrc` is `null`, the dashed `[COMPANY LOGO]` placeholder box is shown
instead, so it is obvious the film is not finished.

## 3. HR contact details

```ts
hrContactName: '[HR CONTACT]',
hrEmail:       '[HR EMAIL]',
hrPortal:      '[HR PORTAL]',
```

These fill the contact card in the closing scene. Keep each under about 28
characters so it fits the card comfortably.

## 4. Fonts

The project ships two typefaces in `assets/fonts/`:

| Role | Font | Used for |
|---|---|---|
| `body` | Nunito | all headings, labels and captions |
| `hand` | Caveat | handwritten annotations |

To swap one:

1. Put the `.woff2` in `assets/fonts/`.
2. Update the matching entry in `FACES` in `src/lib/fonts.ts`.
3. Update `fonts.body` / `fonts.hand` in `src/config/branding.ts`.

Rendering is blocked until the fonts load, so no frame is ever rendered in a
fallback face. Always keep a real fallback stack in the CSS value.

## 5. The hand-drawn look

```ts
export const sketch = {
  roughness: 1.05,   // 0 = clean vector lines, 2+ = very scruffy
  bowing: 1.2,       // how much straight lines bow
  strokeWidth: 3,
  seed: 20260401,    // change to reshuffle every wobble in the film
};
```

Setting `roughness: 0` turns the whole film into crisp vector line art if a more
formal look is wanted. The `seed` is what keeps the wobble identical on every
frame - without it the sketch would boil.
