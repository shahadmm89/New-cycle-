# Changing the branding

Everything a company would want to swap lives in **`src/config/branding.ts`**.
No colour, font or placeholder is repeated anywhere else in the project, so this
one file is the whole job. Re-render afterwards with `npm run render`.

## 1. Colours

```ts
export const colors = {
  background: '#061024',   // deep navy stage - everything is drawn on this
  backgroundDeep: '#030913',
  surface: '#0E2044',      // raised cards
  surfaceLit: '#1B3A72',   // the lit top edge of a raised surface

  primary: '#5B8DEF',      // structural soft blue: rails, frames, secondary labels
  primaryDim: '#2C4C86',

  accent: '#FFC24B',       // THE energetic accent - see below
  accentDeep: '#E8A01F',
  accentGlow: 'rgba(255, 194, 75, 0.30)',

  steady: '#3DDC97',       // the "NO CHANGE" tick. Nothing else.
  muted: '#5E77A3',        // the OLD cycle: legible, deliberately quieter

  text: '#FFFFFF',
  textSoft: '#A9BEDE',
  line: '#1A3160',
};
```

The palette is deliberately small. Four colours do all the work, and the
discipline is what makes it read as premium rather than busy:

- **`accent` is reserved.** It means "this is the change" - the new cycle,
  April, March, the key dates. If you spend it on decoration it stops meaning
  anything, and the hero moment in scene 4 loses its punch.
- **`muted` is the old cycle.** Scenes 2, 3 and the BEFORE face of scene 8 are
  deliberately cooler and quieter, so the accent arriving in scene 4 feels like
  a lift. Keep the contrast between the two.
- **`steady` appears exactly once**, on the NO CHANGE tick in scene 7. That is
  what makes it read as reassurance rather than another highlight.
- **`background` should stay dark.** The type, the glow and the card shadows all
  assume a dark stage.

Contrast: this is signage, so keep white at 7:1 or better against `background`,
and `textSoft` at 4.5:1 minimum. `accent` on `background` is currently ~9:1.

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

The logo then appears top-right for the whole film, scaled to 60px tall.
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
| `display` | Manrope 800 | months, dates, ranges - the big type |
| `body` | Inter | labels, captions, everything else |

To swap one:

1. Put the `.woff2` in `assets/fonts/`.
2. Update the matching entry in `FACES` in `src/lib/fonts.ts`.
3. Update `fonts.display` / `fonts.body` in `src/config/branding.ts`.

Rendering is blocked until the fonts load, so no frame is ever rendered in a
fallback face. Always keep a real fallback stack in the CSS value.

## 5. Depth

```ts
export const depth = {
  perspective: 2000,   // every 3D transform shares this vanishing point
  shadowSoft:  '0 18px 50px rgba(0, 0, 0, 0.45)',
  shadowStrong:'0 30px 90px rgba(0, 0, 0, 0.60)',
  glow:        '0 0 90px rgba(255, 194, 75, 0.22)',
};
```

The film uses subtle, consistent 3D: one light source (top-left), one
perspective distance, two shadow strengths. Raising `perspective` flattens the
tilt on cards and rails; lowering it exaggerates it. Keep every scene on the
same value - mismatched perspective is what makes motion graphics look
assembled rather than designed.

## 6. Type scale

`src/lib/theme.ts` holds the scale, tuned for a screen several metres away:

```ts
hero: 190, display: 132, title: 84, headline: 64, subhead: 46, body: 34, label: 28
```

Nothing in the film is smaller than `label`. If you add a scene, pick from this
scale rather than inventing a size.
