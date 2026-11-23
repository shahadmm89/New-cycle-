"""Shared drawing tools for the roll-up banner.

Everything is laid out in millimetres with the origin at the bottom-left
corner of the TRIM (final 850 x 2000 mm). The PDF page adds 5 mm bleed.

* Text: shaped with HarfBuzz (correct Arabic joining, RTL), converted to
  vector outlines and filled with exact CMYK values.
* QR code: vector modules.
* Watercolour ornaments: generated as rasters at 160 dpi from two coverage
  maps (one per palette ink), composited in CMYK so they never introduce a
  third colour.
"""
from __future__ import annotations

import math
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np
import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.basePen import BasePen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageCms, ImageDraw
from reportlab.lib.colors import CMYKColor
from reportlab.pdfgen import canvas as rl_canvas

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "assets" / "fonts"
EXTRACTED = ROOT / "assets" / "extracted"
TMP = ROOT / ".build"
TMP.mkdir(exist_ok=True)

MM = 72 / 25.4
W, H, BLEED = 850.0, 2000.0, 5.0
DPI = 160                       # ornament rasters (>= 150 dpi at final size)
PX = DPI / 25.4                 # pixels per mm

ICC_DIR = Path("/usr/share/color/icc/colord")
SRGB = ImageCms.ImageCmsProfile(str(ICC_DIR / "sRGB.icc"))
FOGRA39 = ImageCms.ImageCmsProfile(str(ICC_DIR / "FOGRA39L_coated.icc"))
RGB2CMYK = ImageCms.buildTransform(SRGB, FOGRA39, "RGB", "CMYK",
                                   renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC,
                                   flags=ImageCms.Flags.BLACKPOINTCOMPENSATION)
CMYK2RGB = ImageCms.buildTransform(FOGRA39, SRGB, "CMYK", "RGB",
                                   renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC,
                                   flags=ImageCms.Flags.BLACKPOINTCOMPENSATION)

INSTAGRAM_URL = "https://www.instagram.com/sakhaasami"


# --------------------------------------------------------------------------
# Colour
# --------------------------------------------------------------------------
@dataclass(frozen=True)
class Ink:
    name: str
    c: float
    m: float
    y: float
    k: float

    @property
    def cmyk(self):
        return np.array([self.c, self.m, self.y, self.k], dtype=np.float32) / 100.0

    @property
    def rl(self):
        return CMYKColor(self.c / 100, self.m / 100, self.y / 100, self.k / 100)

    @property
    def hex(self):
        px = Image.new("CMYK", (1, 1), tuple(int(round(v * 2.55)) for v in (self.c, self.m, self.y, self.k)))
        r, g, b = ImageCms.applyTransform(px, CMYK2RGB).getpixel((0, 0))
        return f"#{r:02X}{g:02X}{b:02X}"

    def label(self):
        return f"{self.name}: C{self.c:g} M{self.m:g} Y{self.y:g} K{self.k:g}  (~{self.hex})"


WHITE = Ink("Substrate white", 0, 0, 0, 0)


# --------------------------------------------------------------------------
# Text: HarfBuzz shaping -> vector outlines
# --------------------------------------------------------------------------
class PDFPathPen(BasePen):
    """fontTools pen -> reportlab canvas PDFPathObject (quadratics are
    converted to cubics by BasePen)."""

    def __init__(self, glyphSet, path):
        super().__init__(glyphSet)
        self.path = path

    def _moveTo(self, p):
        self.path.moveTo(*p)

    def _lineTo(self, p):
        self.path.lineTo(*p)

    def _curveToOne(self, p1, p2, p3):
        self.path.curveTo(*p1, *p2, *p3)

    def _closePath(self):
        self.path.close()


class Font:
    def __init__(self, filename):
        path = str(FONTS / filename)
        self.face = hb.Face(hb.Blob.from_file_path(path))
        self.hb = hb.Font(self.face)
        self.tt = TTFont(path)
        self.gs = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()
        self.upem = self.tt["head"].unitsPerEm

    def shape(self, text, direction):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        buf.direction = direction
        hb.shape(self.hb, buf, {"kern": True, "liga": True, "calt": True})
        out, x = [], 0
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            name = self.order[info.codepoint]
            if name == ".notdef":
                raise ValueError(f"missing glyph in font for text {text!r}")
            out.append((name, x + pos.x_offset, pos.y_offset))
            x += pos.x_advance
        return out, x


class Text:
    """A shaped single line. Positions are in mm; bounds are ink bounds."""

    def __init__(self, font: Font, text: str, size_mm: float, direction="rtl", tracking=0.0):
        self.font, self.text, self.size = font, text, size_mm
        self.s = size_mm / font.upem
        glyphs, adv = font.shape(text, direction)
        if tracking:
            glyphs = [(n, x + i * tracking * font.upem, y) for i, (n, x, y) in enumerate(glyphs)]
        self.glyphs = glyphs
        bp = BoundsPen(font.gs)
        for name, gx, gy in glyphs:
            font.gs[name].draw(TransformPen(bp, (1, 0, 0, 1, gx, gy)))
        x0, y0, x1, y1 = bp.bounds
        self.x0, self.y0, self.x1, self.y1 = (v * self.s for v in (x0, y0, x1, y1))

    @property
    def width(self):
        return self.x1 - self.x0

    @property
    def height(self):
        return self.y1 - self.y0

    def place(self, x, top, align="c"):
        """Return (origin_x, baseline_y) so that the ink box hits x / top."""
        base = top - self.y1
        if align == "c":
            ox = x - (self.x0 + self.x1) / 2
        elif align == "r":
            ox = x - self.x1
        else:
            ox = x - self.x0
        return ox, base

    def draw(self, c, x, top, ink: Ink, align="c"):
        ox, base = self.place(x, top, align)
        path = c.beginPath()
        pen = PDFPathPen(self.font.gs, path)
        for name, gx, gy in self.glyphs:
            t = (self.s, 0, 0, self.s, ox + gx * self.s, base + gy * self.s)
            self.font.gs[name].draw(TransformPen(pen, t))
        c.setFillColor(ink.rl)
        c.drawPath(path, stroke=0, fill=1, fillMode=1)   # non-zero winding
        return (ox + self.x0, base + self.y0, ox + self.x1, base + self.y1)


# --------------------------------------------------------------------------
# PDF page
# --------------------------------------------------------------------------
class Page:
    def __init__(self, path, paper: Ink, title):
        self.path = str(path)
        pw, ph = (W + 2 * BLEED) * MM, (H + 2 * BLEED) * MM
        c = rl_canvas.Canvas(self.path, pagesize=(pw, ph), pageCompression=1)
        c.setTitle(title)
        c.setAuthor("Sakhaa Mufti")
        c.setSubject("Roll-up banner 850 x 2000 mm + 5 mm bleed")
        trim = (BLEED * MM, BLEED * MM, (W + BLEED) * MM, (H + BLEED) * MM)
        c.setTrimBox(trim)
        c.setArtBox(trim)
        c.setBleedBox((0, 0, pw, ph))
        c.translate(BLEED * MM, BLEED * MM)
        c.scale(MM, MM)
        self.c = c
        self.paper = paper
        self.boxes = {}
        c.setFillColor(paper.rl)
        c.rect(-BLEED, -BLEED, W + 2 * BLEED, H + 2 * BLEED, stroke=0, fill=1)

    def record(self, name, box):
        self.boxes[name] = box

    def save(self):
        self.c.showPage()
        self.c.save()
        finalize_pdf(self.path)


def finalize_pdf(path):
    """Drop reportlab's unused default font and declare the CMYK condition
    (FOGRA39 output intent) so a RIP knows what the numbers mean."""
    import pymupdf
    doc = pymupdf.open(path)
    pg = doc[0]
    res = doc.xref_get_key(pg.xref, "Resources")
    if res[0] == "xref":
        rx = int(res[1].split()[0])
        doc.xref_set_key(rx, "Font", "null")
    else:
        doc.xref_set_key(pg.xref, "Resources/Font", "null")
    icc = (ICC_DIR / "FOGRA39L_coated.icc").read_bytes()
    sx = doc.get_new_xref()
    doc.update_object(sx, "<< /N 4 >>")
    doc.update_stream(sx, icc)
    ox = doc.get_new_xref()
    doc.update_object(ox, f"<< /Type /OutputIntent /S /GTS_PDFX /OutputConditionIdentifier (FOGRA39) "
                          f"/RegistryName (http://www.color.org) /Info (Coated FOGRA39 \\(ISO 12647-2:2004\\)) "
                          f"/DestOutputProfile {sx} 0 R >>")
    doc.xref_set_key(doc.pdf_catalog(), "OutputIntents", f"[{ox} 0 R]")
    tmp = path + ".tmp"
    doc.save(tmp, garbage=3, deflate=True)
    doc.close()
    Path(tmp).replace(path)


# --------------------------------------------------------------------------
# Images
# --------------------------------------------------------------------------
def rgb_to_cmyk(img: Image.Image) -> Image.Image:
    return ImageCms.applyTransform(img.convert("RGB"), RGB2CMYK)


def place_cmyk_array(page: Page, arr: np.ndarray, x, y, w, h, name, quality=93):
    """arr: float32 HxWx4 in 0..1 (CMYK). Embedded as a CMYK JPEG."""
    img = Image.fromarray(np.clip(arr * 255 + 0.5, 0, 255).astype(np.uint8), "CMYK")
    return place_cmyk_image(page, img, x, y, w, h, name, quality)


def place_cmyk_image(page: Page, img: Image.Image, x, y, w, h, name, quality=93):
    p = TMP / f"{Path(page.path).stem}_{name}.jpg"
    img.save(p, "JPEG", quality=quality, subsampling=0, dpi=(DPI, DPI))
    page.c.drawImage(str(p), x, y, w, h)
    return p


def logo_cmyk(paper: Ink) -> tuple[Image.Image, float]:
    """Logo composited onto the exact paper CMYK (so no box shows)."""
    rgba = Image.open(EXTRACTED / "publisher-logo_extracted.png")
    fg = rgb_to_cmyk(rgba.convert("RGB"))
    a = np.asarray(rgba)[..., 3:4].astype(np.float32) / 255
    f = np.asarray(fg).astype(np.float32) / 255
    out = paper.cmyk[None, None, :] * (1 - a) + f * a
    img = Image.fromarray(np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8), "CMYK")
    return img, rgba.width


def draw_logo(page: Page, cx, bottom, width_mm, align="c"):
    img, wpx = logo_cmyk(page.paper)
    h = width_mm * img.height / img.width
    x = cx - width_mm / 2 if align == "c" else (cx - width_mm if align == "r" else cx)
    place_cmyk_image(page, img, x, bottom, width_mm, h, "logo", quality=95)
    dpi = img.width / (width_mm / 25.4)
    page.record("logo", (x, bottom, x + width_mm, bottom + h))
    return dpi


def draw_cover(page: Page, x, y, width_mm, frame: Ink, gap=5.0, line=0.9):
    img = Image.open(EXTRACTED / "book-cover_extracted.png")
    h = width_mm * img.height / img.width
    c = page.c
    # Clean flat thumbnail: substrate-white mat + one thin frame line.
    c.setFillColor(WHITE.rl)
    c.rect(x - gap, y - gap, width_mm + 2 * gap, h + 2 * gap, stroke=0, fill=1)
    place_cmyk_image(page, rgb_to_cmyk(img), x, y, width_mm, h, "cover", quality=94)
    c.setStrokeColor(frame.rl)
    c.setLineWidth(line)
    c.rect(x - gap, y - gap, width_mm + 2 * gap, h + 2 * gap, stroke=1, fill=0)
    page.record("cover", (x - gap, y - gap, x + width_mm + gap, y + h + gap))
    return img.width / (width_mm / 25.4), h


# --------------------------------------------------------------------------
# QR + Instagram handle
# --------------------------------------------------------------------------
def qr_matrix(url=INSTAGRAM_URL):
    import qrcode
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_Q, border=0)
    q.add_data(url)
    q.make(fit=True)
    return q.get_matrix()


def draw_qr(page: Page, x, y, size_mm, ink: Ink, card: Ink = WHITE, quiet=4,
            frame: Ink | None = None, radius=0.0):
    """Card (incl. quiet zone) with its lower-left corner at x,y. size_mm = card side."""
    m = qr_matrix()
    n = len(m)
    mod = size_mm / (n + 2 * quiet)
    c = page.c
    c.setFillColor(card.rl)
    if radius:
        c.roundRect(x, y, size_mm, size_mm, radius, stroke=0, fill=1)
    else:
        c.rect(x, y, size_mm, size_mm, stroke=0, fill=1)
    if frame is not None:
        c.setStrokeColor(frame.rl)
        c.setLineWidth(0.7)
        if radius:
            c.roundRect(x, y, size_mm, size_mm, radius, stroke=1, fill=0)
        else:
            c.rect(x, y, size_mm, size_mm, stroke=1, fill=0)
    c.setFillColor(ink.rl)
    p = c.beginPath()
    eps = 0.04  # tiny overlap so modules never show hairline seams
    for r, row in enumerate(m):
        j = 0
        while j < n:
            if row[j]:
                k = j
                while k < n and row[k]:
                    k += 1
                px = x + (quiet + j) * mod
                py = y + size_mm - (quiet + r + 1) * mod
                p.rect(px - eps, py - eps, (k - j) * mod + 2 * eps, mod + 2 * eps)
                j = k
            else:
                j += 1
    c.drawPath(p, stroke=0, fill=1, fillMode=1)
    page.record("qr", (x, y, x + size_mm, y + size_mm))
    return n, mod


def draw_instagram_handle(page: Page, font: Font, cx, top, size_mm, ink: Ink, icon_ink: Ink | None = None):
    """'@sakhaasami' (LTR) with a simple camera glyph before it, centred on cx."""
    t = Text(font, "@sakhaasami", size_mm, direction="ltr")
    icon = t.height * 1.02
    gap = icon * 0.45
    total = icon + gap + t.width
    left = cx - total / 2
    box = t.draw(page.c, left + icon + gap, top, ink, align="l")
    # icon vertically centred on the text's ink box
    iy = (box[1] + box[3]) / 2 - icon / 2
    c = page.c
    c.setStrokeColor((icon_ink or ink).rl)
    c.setLineWidth(icon * 0.09)
    c.roundRect(left, iy, icon, icon, icon * 0.28, stroke=1, fill=0)
    c.circle(left + icon / 2, iy + icon / 2, icon * 0.22, stroke=1, fill=0)
    c.setFillColor((icon_ink or ink).rl)
    c.circle(left + icon * 0.765, iy + icon * 0.765, icon * 0.055, stroke=0, fill=1)
    page.record("handle", (left, min(iy, box[1]), left + total, max(iy + icon, box[3])))


# --------------------------------------------------------------------------
# Raster ornament canvas
# --------------------------------------------------------------------------
class Region:
    """A raster area in page mm coordinates (y up), at DPI."""

    def __init__(self, x0, y0, x1, y1):
        self.x0, self.y0, self.x1, self.y1 = x0, y0, x1, y1
        self.w = int(round((x1 - x0) * PX))
        self.h = int(round((y1 - y0) * PX))
        self.layers = {}

    def layer(self, name):
        if name not in self.layers:
            self.layers[name] = Image.new("L", (self.w, self.h), 0)
        return self.layers[name]

    def draw(self, name):
        return ImageDraw.Draw(self.layer(name))

    def p(self, x, y):
        return ((x - self.x0) * PX, (self.y1 - y) * PX)

    def pts(self, seq):
        return [self.p(x, y) for x, y in seq]

    def grid(self):
        xs = self.x0 + (np.arange(self.w, dtype=np.float32) + 0.5) / PX
        ys = self.y1 - (np.arange(self.h, dtype=np.float32) + 0.5) / PX
        return np.meshgrid(xs, ys)

    def arr(self, name):
        if name not in self.layers:
            return np.zeros((self.h, self.w), np.float32)
        return np.asarray(self.layers[name], dtype=np.float32) / 255.0


def noise(shape, cell_px, rng):
    h, w = shape
    gh, gw = int(h / cell_px) + 4, int(w / cell_px) + 4
    n = rng.standard_normal((gh, gw)).astype(np.float32)
    n = cv2.GaussianBlur(n, (0, 0), 0.9)
    up = cv2.resize(n, (int(gw * cell_px), int(gh * cell_px)), interpolation=cv2.INTER_CUBIC)
    oy, ox = int(cell_px), int(cell_px)
    up = up[oy:oy + h, ox:ox + w]
    return (up - up.mean()) / (up.std() + 1e-6)


def fbm(shape, cell_px, rng, octaves=4, gain=0.5):
    out = np.zeros(shape, np.float32)
    amp, tot = 1.0, 0.0
    for i in range(octaves):
        cell = max(cell_px / (2 ** i), 1.5)
        out += amp * noise(shape, cell, rng)
        tot += amp
        amp *= gain
    return out / tot


def blur(a, sigma_mm):
    return cv2.GaussianBlur(a, (0, 0), max(sigma_mm * PX, 0.3))


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def warp(a, rng, amp_mm=0.7, cell_mm=5.0):
    """Small displacement so drawn lines wobble like a hand-held brush."""
    h, w = a.shape
    dx = noise((h, w), cell_mm * PX, rng) * amp_mm * PX
    dy = noise((h, w), cell_mm * PX, rng) * amp_mm * PX
    mx = (np.arange(w, dtype=np.float32)[None, :] + dx).astype(np.float32)
    my = (np.arange(h, dtype=np.float32)[:, None] + dy).astype(np.float32)
    return cv2.remap(a, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


def watercolor(motif, rng, soft_mm=0.5, pool=1.5, mottle_mm=22, wobble=0.7):
    """Turn a hard-edged motif mask (0..1) into a watercolour pigment map."""
    shape = motif.shape
    if wobble:
        motif = warp(motif, rng, wobble, 5.0)
    soft = blur(motif, soft_mm)
    # Pigment pools and dries darker at the edge of each brush mark.
    edge = np.clip(soft - blur(soft, 1.8), 0, None)
    mot = 0.70 + 0.30 * np.tanh(1.3 * fbm(shape, mottle_mm * PX, rng, 3))
    gran = 1.0 + 0.08 * noise(shape, 0.7 * PX, rng)
    return np.clip((soft * 0.76 + edge * pool) * mot * gran, 0, 1)


def torn_band(depth_mm, rng, fade_mm, wash_lo=0.22):
    """depth_mm: signed distance-like field (mm), >0 inside the decorated band.

    Returns (inside, wash_weight, motif_fade):
      inside      - deckled/torn edge mask
      wash_weight - wash strength: strongest at the page edge, lighter inward
      motif_fade  - multiplies the motif so it dissolves toward the centre
    """
    shape = depth_mm.shape
    jag = (fbm(shape, 60 * PX, rng, 3) * 7.0
           + fbm(shape, 6 * PX, rng, 3) * 1.6
           + noise(shape, 0.9 * PX, rng) * 0.35)
    d = depth_mm + jag
    inside = smoothstep(-0.22, 0.22, d)
    inner = np.clip(d / fade_mm, 0, 1)
    wash_weight = inside * (wash_lo + (1 - wash_lo) * inner ** 1.2)
    # the dried "tide line" of the wash right at the torn edge
    tide = inside * np.exp(-np.clip(d, 0, None) / 1.3)
    motif_fade = inside * smoothstep(0.0, 1.0, np.clip(d / (fade_mm * 1.15), 0, 1))
    return inside, wash_weight, tide, motif_fade


def mottled_wash(shape, rng, base, var=0.35, cell_mm=70):
    m = fbm(shape, cell_mm * PX, rng, 4)
    blooms = np.clip(fbm(shape, 140 * PX, rng, 2) * 0.8, -1, 1)
    return np.clip(base * (1 + var * m + 0.25 * blooms), 0, 1)


def compose_cmyk(paper: Ink, layers):
    """layers: list of (coverage HxW, Ink). Simple subtractive build-up."""
    h, w = layers[0][0].shape
    out = np.broadcast_to(paper.cmyk, (h, w, 4)).copy()
    for cov, ink in layers:
        out += cov[..., None] * ink.cmyk[None, None, :]
    return np.clip(out, 0, 1)


# --------------------------------------------------------------------------
# Motifs (vector drawing into raster layers)
# --------------------------------------------------------------------------
def poly_line(draw, pts, width_px, fill=255):
    draw.line(pts, fill=fill, width=max(1, int(round(width_px))), joint="curve")


def star_lattice(reg: Region, name, s, lw_mm, ox=0.0, oy=0.0, fill_val=95, clip=None, r_frac=0.37):
    """Islamic 8-point star (khatam) net: discrete stars (two interlaced
    squares) with an octagonal rosette, joined along the axes, with small
    four-point crosses in between - the classic 'star and cross' rhythm."""
    d = reg.draw(name)
    lw = lw_mm * PX
    r = r_frac * s
    ri = r * math.cos(math.radians(45)) / math.cos(math.radians(22.5))
    i0 = int(math.floor((reg.x0 - ox) / s)) - 1
    i1 = int(math.ceil((reg.x1 - ox) / s)) + 1
    j0 = int(math.floor((reg.y0 - oy) / s)) - 1
    j1 = int(math.ceil((reg.y1 - oy) / s)) + 1
    for i in range(i0, i1 + 1):
        for j in range(j0, j1 + 1):
            cx, cy = ox + i * s, oy + j * s
            if clip and not clip(cx, cy):
                continue
            star = []
            for k in range(16):
                ang = math.radians(k * 22.5)
                rr = r if k % 2 == 0 else ri
                star.append((cx + rr * math.cos(ang), cy + rr * math.sin(ang)))
            if fill_val:
                d.polygon(reg.pts(star), fill=fill_val)
            # the two interlaced squares
            for a0 in (0, 45):
                sq = [(cx + r * math.cos(math.radians(a0 + 90 * k)), cy + r * math.sin(math.radians(a0 + 90 * k)))
                      for k in range(5)]
                poly_line(d, reg.pts(sq), lw)
            ro = [(cx + 0.42 * r * math.cos(math.radians(22.5 + 45 * k)),
                   cy + 0.42 * r * math.sin(math.radians(22.5 + 45 * k))) for k in range(9)]
            poly_line(d, reg.pts(ro), lw * 0.7)
            dot(reg, name, cx, cy, 0.1 * r, 255)
            # bars to the right and upper neighbours
            poly_line(d, reg.pts([(cx + r, cy), (cx + s - r, cy)]), lw * 0.8)
            poly_line(d, reg.pts([(cx, cy + r), (cx, cy + s - r)]), lw * 0.8)
            # small cross (four-point star) in the cell centre
            mx, my = cx + s / 2, cy + s / 2
            cr = (s / 2 - r / math.sqrt(2)) * 0.95
            cross = []
            for k in range(8):
                ang = math.radians(45 + k * 45)
                rr = cr if k % 2 == 0 else cr * 0.32
                cross.append((mx + rr * math.cos(ang), my + rr * math.sin(ang)))
            d.polygon(reg.pts(cross), fill=int(fill_val * 1.6) if fill_val else 140)


def _rot(px, py, ang):
    ca, sa = math.cos(ang), math.sin(ang)
    return px * ca - py * sa, px * sa + py * ca


def petal(reg: Region, name, bx, by, ang, length, width, val=255, inner=None):
    """Brush-stroke petal (Gzhel style): thin at the base, round at the tip."""
    n = 28
    us = np.linspace(0, 1, n)
    half = width / 2 * np.sqrt(np.clip(np.sin(np.pi * us ** 0.75), 0, 1)) * (0.55 + 0.45 * us ** 0.5)
    pts = [(u * length, h) for u, h in zip(us, half)] + [(u * length, -h) for u, h in zip(us[::-1], half[::-1])]
    pts = [(bx + _rot(x, y, ang)[0], by + _rot(x, y, ang)[1]) for x, y in pts]
    reg.draw(name).polygon(reg.pts(pts), fill=val)
    if inner:
        petal(reg, name, bx, by, ang, length * inner[0], width * inner[1], val=inner[2])


def tapered_stroke(reg: Region, name, pts, w0, w1, val=255):
    d = reg.draw(name)
    pts = np.asarray(pts, dtype=np.float32)
    seg = np.r_[0, np.cumsum(np.hypot(*np.diff(pts, axis=0).T))]
    total = seg[-1] if seg[-1] > 0 else 1
    step = max(min(w0, w1) / 3, 0.25)
    for t in np.arange(0, total, step):
        x = np.interp(t, seg, pts[:, 0])
        y = np.interp(t, seg, pts[:, 1])
        r = (w0 + (w1 - w0) * (t / total)) / 2
        px, py = reg.p(x, y)
        d.ellipse([px - r * PX, py - r * PX, px + r * PX, py + r * PX], fill=val)


def curve(p0, p1, p2, n=40):
    t = np.linspace(0, 1, n)[:, None]
    p0, p1, p2 = map(np.asarray, (p0, p1, p2))
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2


def spiral(cx, cy, r0, turns, ang0, cw=True, n=90):
    t = np.linspace(0, turns * 2 * np.pi, n)
    r = r0 * np.exp(-t / (turns * 2 * np.pi) * 2.2)
    a = ang0 + (-t if cw else t)
    return np.c_[cx + r * np.cos(a), cy + r * np.sin(a)]


def dot(reg: Region, name, x, y, r, val=255):
    px, py = reg.p(x, y)
    reg.draw(name).ellipse([px - r * PX, py - r * PX, px + r * PX, py + r * PX], fill=val)


def flower(reg, name, cx, cy, radius, n=6, rot=0.0, accent=None, val=230):
    for k in range(n):
        a = rot + 2 * math.pi * k / n
        petal(reg, name, cx + math.cos(a) * radius * 0.16, cy + math.sin(a) * radius * 0.16, a,
              radius, radius * 0.62, val=int(val * 0.62), inner=(0.62, 0.45, val))
    if accent:
        dot(reg, accent, cx, cy, radius * 0.2, 255)
        for k in range(n):
            a = rot + 2 * math.pi * (k + 0.5) / n
            dot(reg, accent, cx + math.cos(a) * radius * 0.42, cy + math.sin(a) * radius * 0.42, radius * 0.05, 220)


def berries(reg, name, cx, cy, r, count, rng, val=230):
    for k in range(count):
        a = rng.uniform(0, 2 * math.pi)
        dd = r * 1.6 * math.sqrt(rng.uniform(0.1, 1))
        rr = r * rng.uniform(0.75, 1.05)
        x, y = cx + dd * math.cos(a), cy + dd * math.sin(a)
        dot(reg, name, x, y, rr, val)
        # little highlight left unpainted, as in Khokhloma berries
        dot(reg, name, x - rr * 0.3, y + rr * 0.3, rr * 0.28, int(val * 0.35))


def leaf(reg, name, bx, by, ang, length, width, val=210):
    petal(reg, name, bx, by, ang, length, width, val=int(val * 0.7), inner=(0.85, 0.22, val))


def floral_vine(reg: Region, name, accent, x_of_y, y_from, y_to, rng, scale=1.0, side_bias=0.0,
                density=1.0, outward=-1):
    """Khokhloma/Gzhel-inspired climbing vine. x_of_y gives the stem path.
    outward = -1 when the band is on the left edge (sprays curl to the right/inward
    a little, mostly upward), +1 for a right-edge band."""
    ys = np.linspace(y_from, y_to, 400)
    stem = np.c_[[x_of_y(y) for y in ys], ys]
    tapered_stroke(reg, name, stem, 3.4 * scale, 2.2 * scale, val=200)
    step = 125 * scale / density
    y = y_from + rng.uniform(0.2, 0.6) * step
    side = 1
    while y < y_to - 30:
        sx = x_of_y(y)
        side = -side
        # spray direction: alternate, leaning upward
        ang = math.radians(90 + side * rng.uniform(38, 58))
        L = 85 * scale * rng.uniform(0.85, 1.15)
        tip = (sx + math.cos(ang) * L, y + math.sin(ang) * L)
        ctrl = (sx + math.cos(ang - side * 0.5) * L * 0.6, y + math.sin(ang - side * 0.5) * L * 0.6)
        br = curve((sx, y), ctrl, tip)
        tapered_stroke(reg, name, br, 2.6 * scale, 1.0 * scale, val=200)
        kind = rng.choice(["flower", "berries", "curl"], p=[0.6, 0.22, 0.18])
        if kind == "flower":
            flower(reg, name, tip[0], tip[1], 26 * scale * rng.uniform(0.9, 1.15),
                   n=int(rng.choice([5, 6, 7])), rot=rng.uniform(0, 1), accent=accent)
        elif kind == "berries":
            berries(reg, accent or name, tip[0], tip[1], 6.5 * scale, 5, rng)
            leaf(reg, name, tip[0], tip[1], ang + side * 0.9, 30 * scale, 13 * scale)
        else:
            sp = spiral(tip[0], tip[1], 16 * scale, 1.25, ang + math.pi / 2 * side, cw=side > 0)
            tapered_stroke(reg, name, sp, 2.4 * scale, 0.6 * scale, val=210)
            dot(reg, accent or name, tip[0], tip[1], 4.2 * scale, 230)
        # leaves along the spray: Khokhloma "grass" strokes
        for t in (0.35, 0.62):
            i = int(t * (len(br) - 1))
            bx, by = br[i]
            for sgn in (-1, 1):
                la = ang + sgn * rng.uniform(0.7, 1.0)
                leaf(reg, name, bx, by, la, 28 * scale * rng.uniform(0.8, 1.1), 12 * scale)
        # small grass curls off the main stem
        if rng.uniform() < 0.7:
            ca = math.radians(90 - side * 60)
            ctip = (sx + math.cos(ca) * 30 * scale, y + 20 * scale + math.sin(ca) * 30 * scale)
            tapered_stroke(reg, name, curve((sx, y + 20 * scale), (sx - side * 14 * scale, y + 40 * scale), ctip),
                           2.0 * scale, 0.5 * scale, val=190)
        y += step * rng.uniform(0.85, 1.15)
