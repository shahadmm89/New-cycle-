# Fonts

| File | Family | Licence |
|---|---|---|
| `Manrope-Variable.woff2` | Manrope (variable, 400-800) | SIL Open Font License 1.1 |
| `Inter-Variable.woff2` | Inter (variable, 100-900) | SIL Open Font License 1.1 |

Manrope carries the display type - months, dates, ranges. Inter carries
everything else. Both are Google Fonts, redistributable under the OFL, which
permits bundling them with this project and with anything rendered from it.

They are loaded by `src/lib/fonts.ts`, which blocks rendering until they are
ready so no frame is ever rendered in a fallback face.

To swap a typeface, see [docs/BRANDING.md](../../docs/BRANDING.md#4-fonts).
