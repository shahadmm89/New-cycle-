# Roll-up banner: Sakhaa Mufti book signing

Three design directions for a reusable 85 × 200 cm roll-up banner for book signings of
«مركز الإعلام والدراسات العربية - الروسية ودوره في الاستعراب الروسي».

| | Print PDF | Preview |
|---|---|---|
| **A: Two Shores** | `output/A_two-shores_850x2000mm_print.pdf` | `output/A_two-shores_850x2000mm_preview.png` |
| **B: The Margin** | `output/B_the-margin_850x2000mm_print.pdf` | `output/B_the-margin_850x2000mm_preview.png` |
| **C: Threshold** | `output/C_threshold_850x2000mm_print.pdf` | `output/C_threshold_850x2000mm_preview.png` |

`output/comparison_all-directions.png` shows all three side by side, each also with a
~160 cm standing figure and the 150 / 100 / 15 cm lines, so you can see what stays visible.

## The three ideas

**A: Two Shores (الضفّتان).** Deep navy and muted gold on ivory, set in Amiri with IBM Plex Sans Arabic. No book cover.
The banner is a river with two banks. The right edge, where Arabic reading begins, carries
an Islamic 8-point-star (khatam) lattice in a gold wash. The left edge carries Russian
Gzhel/Khokhloma-style florals in a navy wash. Each border has a torn edge and fades toward the
centre, so the two traditions face each other across a quiet open middle where the author
stands. The text is centred and classical, with a small gold eight-point star as the only divider.

**B: The Margin (الهامش).** Deep burgundy (taken from the book cover) and antique gold on off-white, set in
Aref Ruqaa with IBM Plex Sans Arabic. Includes the cover.
This one draws on the manuscript page. A single torn watercolour band runs down the left margin. At the top it is
Islamic geometry in gold; halfway down it gradually *turns into* Russian folk florals in
burgundy. That's the dialogue in a single strip. The text is set right-aligned like a page of
Arabic, with a thin gold rule in the right margin. The slogan sits on three lines. Because
the text is right-aligned, the name stays beside the author's head, not behind it.

**C: Threshold (العتبة).** Ink teal and brass on warm white, set in Reem Kufi with IBM Plex Sans Arabic. Includes the cover.
The design runs on a diagonal. Islamic geometry enters from the top-right corner and Russian florals
answer from the bottom-left corner. The two never touch: the author, standing between them,
is the bridge. The modern Kufi lettering gives it the most contemporary feel of the three.

## Exact text used

- Slogan: «حين تتحاور الثقافات… يولد الفهم» (with the single ellipsis character «…»).
  A and C set it on two lines; B on three (حين تتحاور / الثقافات… / يولد الفهم).
- Name: «سخاء مفتي». Under it: «كاتبة وباحثة».
- Instagram: @sakhaasami, plus a QR code for `https://www.instagram.com/sakhaasami`.
- Publisher logo.
- No event name, date, venue or price.

## Layout (heights measured from the bottom edge of the print)

| | Top text, lowest line | QR card | Cover | Logo bottom |
|---|---|---|---|---|
| A | 161.6 cm (centred, clears the head) | 115–131 cm, right | none | 19.0 cm, centred |
| B | 149.9 cm (right-aligned, beside the head) | 112–128 cm, right | 103–125 cm, left | 18.5 cm, right |
| C | 160.3 cm (centred, clears the head) | 114–130 cm, left | 105–127 cm, right | 20.0 cm, right |

Centred text in A and C is kept above ~160 cm on purpose. A person of about 160 cm standing
in the middle would hide centred text at 150–160 cm.
The minimum safe margin for text and the QR card is 40 mm, measured from the trim. The centre column stays empty.

**Logo note:** at 19–20 cm from the floor the logo will be hidden behind the author's legs
whenever she stands directly in front of it. B and C place it off-centre so part of it stays
visible. If the logo must always be fully visible, consider moving it up beside the QR card.

**100 × 200 cm version:** everything is positioned from the edges and the centre line, so
widening means moving the side items (QR, cover, borders) outward by 75 mm each and leaving
the text block centred or right-aligned as it is.

## Colours (CMYK, coated FOGRA39; HEX values are approximate screen equivalents)

| Direction | Background | Colour 1 | Colour 2 |
|---|---|---|---|
| A | Ivory C2 M3 Y9 K0 (#FBF7EC) | Deep navy C100 M80 Y35 K35 (#123559) | Muted gold C20 M38 Y70 K8 (#C89B5A) |
| B | Off-white C1 M3 Y6 K0 (#FCF8F2) | Deep burgundy C20 M100 Y80 K35 (#921725) | Antique gold C15 M35 Y65 K10 (#CEA162) |
| C | Warm white C1 M2 Y5 K0 (#FCFAF4) | Ink teal C90 M45 Y45 K40 (#0E525D) | Brass C25 M35 Y75 K15 (#B5944E) |

The QR card is unprinted substrate white (C0 M0 Y0 K0). The watercolour borders are made only
from tints of each direction's two inks. The gold is a CMYK gold, not a metallic ink.
The maximum ink coverage is 250 %.

## Print specifications (checked by `src/verify.py`)

- Trim 850 × 2000 mm; media 860 × 2010 mm (5 mm bleed on all sides); TrimBox and BleedBox set.
- All colour is DeviceCMYK (no RGB or grey). The file carries a FOGRA39 output intent.
- All type is converted to vector outlines, so there are no fonts to install or embed.
  The shapes come from HarfBuzz, so Arabic joining and RTL order are correct.
- The QR code is vector, error correction level Q (25 %), with 33 × 33 modules (3.9 mm each) and a
  4-module quiet zone, dark on white. It decodes to exactly `https://www.instagram.com/sakhaasami`
  from a FOGRA39 soft-proof render, both at full size and at a 35 % (phone-like) downscale.
- Raster parts: watercolour borders at 160 dpi, cover at 218 dpi, logo at 153 dpi (all ≥ 150 dpi at final size).
- No crop marks, which is usual for roll-up printers. Ask your printer if they want them added.

## Assets: what needs an original file from you

1. **Publisher logo: please send the original (vector AI/EPS/PDF/SVG, or a PNG ≥ 3000 px wide).**
   The PDF you sent is a single flat picture of the old banner, not the book. Its page 3 and cover
   pages aren't in it, so I cropped the logo from the old banner itself. The result is only
   1502 × 227 px, with soft JPEG edges and a small Cyrillic/English line. That caps it at about 25 cm
   wide at 150 dpi, which is how it's used now. It will print acceptably for viewing from a distance, but up close the small
   lines will look soft. A vector logo would fix this, and you would just swap the file into
   `assets/extracted/publisher-logo_extracted.png` and rebuild.
2. **Book cover: an original front-cover file would be better (PDF or JPG ≥ 1500 px wide).**
   It was also cropped from the old banner, at 1200 × 1744 px. At 14 cm wide that's 218 dpi, which is fine for
   print. But it is a re-compressed copy and slightly soft, so the original is preferred.
3. Fonts are open source (SIL OFL) and are included in `assets/fonts`.

## Rebuilding

```bash
cd src
python3 -I extract_assets.py <old-banner.pdf> ../assets/extracted   # logo + cover
python3 designs.py            # A B C -> output/*_print.pdf
python3 verify.py             # pre-flight checks
python3 previews.py           # PNG previews + comparison sheet
```

Needs: Python 3 with numpy, opencv-python-headless, pillow, reportlab, uharfbuzz, fonttools,
qrcode, pymupdf; Ghostscript; the FOGRA39 profile (`colord-data` package on Ubuntu).
