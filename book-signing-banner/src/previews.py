"""PNG previews (soft-proofed through FOGRA39) + a comparison sheet that
shows a standing author (~160 cm) in front of each banner."""
import subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from lib import FONTS

OUT = Path(__file__).resolve().parent.parent / "output"
NAMES = {"A": "A — Two Shores", "B": "B — The Margin", "C": "C — Threshold"}

def render(pdf, dpi, dest):
    subprocess.run(["gs", "-q", "-dNOPAUSE", "-dBATCH", "-sDEVICE=png16m", f"-r{dpi}", "-dUseTrimBox",
                    "-dTextAlphaBits=4", "-dGraphicsAlphaBits=4",
                    "-sDefaultCMYKProfile=/usr/share/color/icc/colord/FOGRA39L_coated.icc",
                    f"-sOutputFile={dest}", str(pdf)], check=True)
    return Image.open(dest).convert("RGB")

def author(draw, cx, floor, pxmm, color=(60, 60, 66, 120)):
    """Very simple standing figure, ~160 cm tall, shoulders ~42 cm."""
    s = lambda v: v * pxmm
    head_c = floor - s(1490)
    draw.ellipse([cx - s(95), head_c - s(115), cx + s(95), head_c + s(115)], fill=color)
    draw.rounded_rectangle([cx - s(215), floor - s(1360), cx + s(215), floor - s(700)], radius=int(s(110)), fill=color)
    draw.polygon([(cx - s(215), floor - s(800)), (cx + s(215), floor - s(800)),
                  (cx + s(270), floor), (cx - s(270), floor)], fill=color)
    draw.rectangle([cx - s(45), floor - s(1390), cx + s(45), floor - s(1340)], fill=color)

sheet_imgs = []
font = ImageFont.truetype(str(FONTS / "IBMPlexSansArabic-Medium.ttf"), 26)
small = ImageFont.truetype(str(FONTS / "IBMPlexSansArabic-Regular.ttf"), 17)
for pdf in sorted(OUT.glob("*_print.pdf")):
    k = pdf.name[0]
    stem = pdf.name.replace("_print.pdf", "")
    with tempfile.TemporaryDirectory() as td:
        prev = render(pdf, 25, Path(td) / "p.png")          # ~837 x 1969
        prev.save(OUT / f"{stem}_preview.png", optimize=True)
        small_img = render(pdf, 14, Path(td) / "s.png")     # ~469 x 1102
    w, h = small_img.size
    pxmm = w / 850
    ctx = small_img.convert("RGBA")
    ov = Image.new("RGBA", ctx.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    author(d, w / 2, h, pxmm)
    for cm, lab in ((150, "150 cm"), (100, "100 cm"), (15, "15 cm")):
        y = h - cm * 10 * pxmm
        for x in range(0, w, 12):
            d.line([(x, y), (x + 6, y)], fill=(200, 40, 40, 170), width=1)
        d.text((4, y - 19), lab, fill=(200, 40, 40, 220), font=small)
    sheet_imgs.append((NAMES[k], small_img, Image.alpha_composite(ctx, ov).convert("RGB")))

pad, top = 36, 70
cw = sheet_imgs[0][1].width
ch = sheet_imgs[0][1].height
sheet = Image.new("RGB", (pad + len(sheet_imgs) * (2 * cw + pad + 16), ch + top + pad), (232, 230, 226))
d = ImageDraw.Draw(sheet)
x = pad
for name, clean, ctx in sheet_imgs:
    d.text((x, 22), name, fill=(40, 40, 40), font=font)
    sheet.paste(clean, (x, top))
    sheet.paste(ctx, (x + cw + 16, top))
    x += 2 * cw + 16 + pad
sheet.save(OUT / "comparison_all-directions.png", optimize=True)
print("ok", sheet.size)
