"""Extract the publisher logo and the book cover from the previous banner.

The PDF that was supplied is a single-page banner made of one flat JPEG
(5101 x 12000 px, ~152 dpi at 850 x 2000 mm). Both the logo and the cover
only exist inside that picture, so they are cropped from it here at the
source's full resolution - no upscaling.

Usage: python3 -I extract_assets.py <banner.pdf-or-jpg> <out_dir>
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None


def load_source(path):
    path = Path(path)
    if path.suffix.lower() == ".pdf":
        import pymupdf
        doc = pymupdf.open(path)
        xref = doc[0].get_images()[0][0]
        info = doc.extract_image(xref)
        from io import BytesIO
        return Image.open(BytesIO(info["image"])).convert("RGB")
    return Image.open(path).convert("RGB")


def extract_logo(src, out_dir):
    # Logo strip at the foot of the old banner (pixel box found by inspection).
    crop = src.crop((1740, 10915, 3365, 11215))
    a = np.asarray(crop).astype(np.float32)
    # Background = the banner's ivory, sampled from the crop's corners.
    corners = np.concatenate([a[:6, :6].reshape(-1, 3), a[-6:, -6:].reshape(-1, 3),
                              a[:6, -6:].reshape(-1, 3), a[-6:, :6].reshape(-1, 3)])
    bg = np.median(corners, axis=0)
    # Un-mix: observed = alpha*fg + (1-alpha)*bg, with fg darker than bg in at
    # least one channel. alpha is the largest per-channel darkening.
    alpha = np.max((bg - a) / np.maximum(bg, 1), axis=2)
    alpha = np.clip((alpha - 0.04) / 0.96, 0, 1)          # drop JPEG noise floor
    alpha = np.clip(alpha * 1.06, 0, 1)
    safe = np.maximum(alpha, 1e-3)[..., None]
    fg = np.clip((a - (1 - alpha[..., None]) * bg) / safe, 0, 255)
    fg[alpha < 1e-3] = 0
    # Trim to the ink bounding box plus a small margin.
    ys, xs = np.where(alpha > 0.08)
    y0, y1, x0, x1 = ys.min() - 6, ys.max() + 7, xs.min() - 6, xs.max() + 7
    rgba = np.dstack([fg, alpha * 255])[y0:y1, x0:x1].astype(np.uint8)
    img = Image.fromarray(rgba, "RGBA")
    img.save(out_dir / "publisher-logo_extracted.png")
    return img


def extract_cover(src, out_dir):
    # Cover thumbnail in the old banner; the box is the cover art itself,
    # inside the old white mat and brown frame.
    box = (700 + 129, 4050 + 133, 700 + 1329, 4050 + 1877)
    img = src.crop(box)
    img.save(out_dir / "book-cover_extracted.png")
    return img


if __name__ == "__main__":
    src = load_source(sys.argv[1])
    out = Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    logo = extract_logo(src, out)
    cover = extract_cover(src, out)
    print("logo", logo.size, "cover", cover.size)
