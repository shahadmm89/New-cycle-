# Company logo

Drop your logo here (SVG, or PNG with a transparent background) and point
`brand.logoSrc` in `src/config/branding.ts` at it:

```ts
logoSrc: 'logo/acme.svg',   // path is relative to /assets
```

It is drawn top-right for the whole film, scaled to 60px tall with its aspect
ratio preserved, so a wide wordmark works as well as a square mark.

While `logoSrc` is `null` a dashed **[COMPANY LOGO]** placeholder is shown
instead, so an unbranded render is obviously unfinished.
