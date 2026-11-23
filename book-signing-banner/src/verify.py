"""Pre-flight checks for the three banner PDFs.

* QR: render each PDF through FOGRA39 at 100 dpi, decode with OpenCV
  (at full size and at a phone-like downscale) and compare to the URL.
* Layout: margins >= 40 mm for text/QR, QR between 100-140 cm, logo above
  15 cm, headline block above head height.
* Colour: every colour operator and image in the PDF must be CMYK.
"""
import json, re, subprocess, sys, tempfile
from pathlib import Path
import cv2, numpy as np, pymupdf
from lib import INSTAGRAM_URL, W, H, BLEED

OUT = Path(__file__).resolve().parent.parent / "output"
ok_all = True

def check(cond, msg):
    global ok_all
    ok_all &= bool(cond)
    print(("  PASS " if cond else "  FAIL ") + msg)

layout = {}
for f in OUT.glob("_layout_*.json"):
    layout.update(json.loads(f.read_text()))

for pdf in sorted(OUT.glob("*_print.pdf")):
    key = pdf.name[0]
    print(f"\n{pdf.name}")
    # ---------- QR
    with tempfile.TemporaryDirectory() as td:
        png = Path(td) / "r.png"
        subprocess.run(["gs", "-q", "-dNOPAUSE", "-dBATCH", "-sDEVICE=png16m", "-r100", "-dUseTrimBox",
                        "-sDefaultCMYKProfile=/usr/share/color/icc/colord/FOGRA39L_coated.icc",
                        f"-sOutputFile={png}", str(pdf)], check=True)
        img = cv2.imread(str(png))
    x0, y0, x1, y1 = layout[key]["boxes"]["qr"]
    px = 100 / 25.4
    crop = img[int((H - y1 - 15) * px):int((H - y0 + 15) * px), int((x0 - 15) * px):int((x1 + 15) * px)]
    det = cv2.QRCodeDetector()
    for scale in (1.0, 0.35):
        im = cv2.resize(crop, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
        data, *_ = det.detectAndDecode(im)
        check(data == INSTAGRAM_URL, f"QR decodes at {scale:.0%} render: {data!r}")
    # ---------- layout
    b = layout[key]["boxes"]
    for name, (bx0, by0, bx1, by1) in b.items():
        if name in ("logo", "cover"):
            continue
        m = min(bx0, by0, W - bx1, H - by1)
        check(m >= 40, f"{name[:24]!r} >= 40 mm from trim (min {m:.0f} mm)")
    qy0, qy1 = b["qr"][1], b["qr"][3]
    check(950 <= qy0 and qy1 <= 1450, f"QR spans {qy0/10:.0f}-{qy1/10:.0f} cm from floor")
    check(b["logo"][1] >= 150, f"logo bottom at {b['logo'][1]/10:.1f} cm (>= 15 cm)")
    tops = [v for k, v in b.items() if k not in ("qr", "logo", "cover", "handle")]
    low = min(v[1] for v in tops)
    centred = key in "AC"
    need = 1600 if centred else 1495
    check(low >= need, f"headline/name block lowest ink at {low/10:.1f} cm "
          f"({'centred: must clear a ~160 cm head' if centred else 'right-aligned: beside the head'})")
    if "cover" in b:
        cy0, cy1 = b["cover"][1], b["cover"][3]
        print(f"  info cover spans {cy0/10:.0f}-{cy1/10:.0f} cm, x {b['cover'][0]:.0f}-{b['cover'][2]:.0f} mm")
    # ---------- PDF structure + colour
    doc = pymupdf.open(pdf)
    pg = doc[0]
    tb = pg.trimbox
    check(abs(tb.width / 72 * 25.4 - W) < 0.1 and abs(tb.height / 72 * 25.4 - H) < 0.1,
          f"TrimBox {tb.width/72*25.4:.1f} x {tb.height/72*25.4:.1f} mm")
    check(abs(pg.rect.width / 72 * 25.4 - (W + 2 * BLEED)) < 0.1, f"MediaBox incl. bleed {pg.rect.width/72*25.4:.1f} x {pg.rect.height/72*25.4:.1f} mm")
    cs = set()
    for img_ in pg.get_images(full=True):
        cs.add(img_[5])
        info = doc.extract_image(img_[0])
        bbox = pg.get_image_bbox(img_[7])
        dpi = info["width"] / (bbox.width / 72)
        check(dpi >= 150, f"image {info['width']}x{info['height']} {img_[5]} at {dpi:.0f} dpi")
    check(cs <= {"DeviceCMYK"}, f"image colour spaces: {cs}")
    content = b"".join(doc.xref_stream(x) for x in pg.get_contents()).decode("latin-1")
    rgb_ops = re.findall(r"\b[\d.]+ [\d.]+ [\d.]+ (rg|RG)\b", content)
    gray_ops = re.findall(r"\b[\d.]+ (g|G)\b", content)
    check(not rgb_ops and not gray_ops, f"vector colour ops CMYK only (rgb={len(rgb_ops)}, gray={len(gray_ops)})")
    check(pg.get_text().strip() == "", "no live text: all type converted to outlines")
    print(f"  info file size {pdf.stat().st_size/1e6:.1f} MB")

print("\nALL PASS" if ok_all else "\nSOME CHECKS FAILED")
sys.exit(0 if ok_all else 1)
