# Fonts

| File | Family | Licence |
|---|---|---|
| `Nunito-Variable.woff2` | Nunito (variable, 100–900) | SIL Open Font License 1.1 |
| `Caveat-Variable.woff2` | Caveat (variable, 400–700) | SIL Open Font License 1.1 |

Both are Google Fonts, redistributable under the OFL, which permits bundling
them with this project and with anything rendered from it.

They are loaded by `src/lib/fonts.ts`, which blocks rendering until they are
ready so no frame is ever rendered in a fallback face.

To swap a typeface, see [docs/BRANDING.md](../../docs/BRANDING.md#4-fonts).
