"""Three design directions for the Sakhaa Mufti roll-up banner.

Run:  python3 -I designs.py [A|B|C ...]
Writes print PDFs to ../output/ (850 x 2000 mm + 5 mm bleed, CMYK).
"""
from __future__ import annotations

import json
import math
import sys

import numpy as np

from lib import (H, W, Font, Ink, Page, Region, ROOT, Text, WHITE, compose_cmyk,
                 draw_cover, draw_instagram_handle, draw_logo, draw_qr, floral_vine,
                 mottled_wash, place_cmyk_array, smoothstep, star_lattice, torn_band,
                 watercolor)

OUT = ROOT / "output"
OUT.mkdir(exist_ok=True)

SLOGAN_1 = "حين تتحاور الثقافات…"
SLOGAN_2 = "يولد الفهم"
NAME = "سخاء مفتي"
ROLE = "كاتبة وباحثة"

PLEX = Font("IBMPlexSansArabic-Medium.ttf")
PLEX_REG = Font("IBMPlexSansArabic-Regular.ttf")


def render_band(page, reg: Region, depth_fn, layers_fn, seed):
    """Generic: build depth field, torn edge, let layers_fn paint coverages."""
    rng = np.random.default_rng(seed)
    X, Y = reg.grid()
    depth = depth_fn(X, Y).astype(np.float32)
    del X
    inside, wash_w, tide, motif_fade = torn_band(depth, rng, fade_mm=layers_fn.fade)
    layers = layers_fn(reg, rng, inside, wash_w, tide, motif_fade, Y)
    arr = compose_cmyk(page.paper, layers)
    place_cmyk_array(page, arr, reg.x0, reg.y0, reg.x1 - reg.x0, reg.y1 - reg.y0,
                     f"band{seed}", quality=92)


def fit(font, lines, size, maxw):
    """Same size for all lines, shrunk so the widest fits maxw."""
    widest = max(Text(font, t, 100).width for t in lines) / 100
    return min(size, maxw / widest)


def stack_text(page, items, top, x, align):
    """items: list of (Text, Ink, gap_after_mm). Returns bottom y."""
    y = top
    for t, ink, gap in items:
        box = t.draw(page.c, x, y, ink, align=align)
        page.record(t.text, box)
        y = box[1] - gap
    return y


# ==========================================================================
# A — "Two Shores" : navy + muted gold on ivory, symmetric margins, no cover
# ==========================================================================
A_PAPER = Ink("Ivory (background)", 2, 3, 9, 0)
A_NAVY = Ink("Deep navy", 100, 80, 35, 35)
A_GOLD = Ink("Muted gold", 20, 38, 70, 8)


def design_a():
    page = Page(OUT / "A_two-shores_850x2000mm_print.pdf", A_PAPER,
                "Sakhaa Mufti roll-up - Direction A (Two Shores)")
    amiri = Font("Amiri-Bold.ttf")

    # ---- left margin: Russian folk florals (Gzhel/Khokhloma), navy wash
    left = Region(-5, -5, 240, H + 5)

    def depth_left(X, Y):
        w = 150 + 20 * np.sin(Y / 290.0) + 12 * np.sin(Y / 97.0 + 1.3)
        return w - X

    def paint_left(reg, rng, inside, wash_w, tide, fade, Y):
        floral_vine(reg, "fl", "acc", lambda y: 50 + 22 * math.sin(y / 170.0), -5, H + 5,
                    rng, scale=1.12, density=1.35)
        fl = watercolor(reg.arr("fl"), rng)
        acc = watercolor(reg.arr("acc"), rng)
        wash = mottled_wash(fl.shape, rng, 0.07) * wash_w + 0.08 * tide
        return [(wash + fl * fade * 0.52, A_NAVY), (acc * fade * 0.6, A_GOLD)]
    paint_left.fade = 150

    # ---- right margin: Islamic 8-point star lattice, gold wash
    right = Region(W - 240, -5, W + 5, H + 5)

    def depth_right(X, Y):
        w = 150 + 20 * np.sin(Y / 260.0 + 2.0) + 12 * np.sin(Y / 83.0)
        return X - (W - w)

    def paint_right(reg, rng, inside, wash_w, tide, fade, Y):
        star_lattice(reg, "geo", s=112, lw_mm=2.2, ox=W - 40, oy=31)
        geo = watercolor(reg.arr("geo"), rng, mottle_mm=30)
        wash = mottled_wash(geo.shape, rng, 0.13) * wash_w + 0.10 * tide
        return [(wash + geo * fade * 0.48, A_GOLD), (geo * fade * 0.04, A_NAVY)]
    paint_right.fade = 150

    render_band(page, left, depth_left, paint_left, 11)
    render_band(page, right, depth_right, paint_right, 12)

    # ---- text, centred in the top third. Everything stays above ~159 cm:
    # the author's head blocks the centre of the banner below that.
    e = fit(amiri, [SLOGAN_1, SLOGAN_2], 92, 560)
    s1 = Text(amiri, SLOGAN_1, e)
    s2 = Text(amiri, SLOGAN_2, e)
    name = Text(amiri, NAME, 52)
    role = Text(PLEX, ROLE, 26)
    cx = W / 2
    y = stack_text(page, [(s1, A_NAVY, 0.16 * e), (s2, A_NAVY, 0)], 1957, cx, "c")
    # divider: hairlines + small 8-point star in gold
    c = page.c
    dy = y - 20
    c.setStrokeColor(A_GOLD.rl)
    c.setLineWidth(1.0)
    c.line(cx - 95, dy, cx - 13, dy)
    c.line(cx + 13, dy, cx + 95, dy)
    c.setFillColor(A_GOLD.rl)
    for rot in (0, 45):
        p = c.beginPath()
        for k in range(4):
            a = math.radians(rot + 90 * k)
            (p.moveTo if k == 0 else p.lineTo)(cx + 7 * math.cos(a), dy + 7 * math.sin(a))
        p.close()
        c.drawPath(p, stroke=0, fill=1)
    stack_text(page, [(name, A_NAVY, 12), (role, A_GOLD, 0)], dy - 18, cx, "c")

    # ---- QR on the right, 100-140 cm from the floor
    card = 160
    qx, qy = W - 40 - card, 1150
    draw_qr(page, qx, qy, card, A_NAVY, WHITE, frame=A_GOLD)
    draw_instagram_handle(page, PLEX, qx + card / 2, qy - 14, 21, A_NAVY, A_GOLD)

    # ---- publisher logo, centred near the bottom (>= 15 cm from the floor)
    dpi = draw_logo(page, cx, 190, 250)
    page.save()
    return page, {"logo_dpi": dpi}


# ==========================================================================
# B — "The Margin" : burgundy + gold on off-white, one morphing band, with cover
# ==========================================================================
B_PAPER = Ink("Off-white (background)", 1, 3, 6, 0)
B_WINE = Ink("Deep burgundy", 20, 100, 80, 35)
B_GOLD = Ink("Antique gold", 15, 35, 65, 10)


def design_b():
    page = Page(OUT / "B_the-margin_850x2000mm_print.pdf", B_PAPER,
                "Sakhaa Mufti roll-up - Direction B (The Margin)")
    ruqaa = Font("ArefRuqaa-Bold.ttf")

    band = Region(-5, -5, 280, H + 5)

    def width(Y):
        t = np.abs((Y - 1020) / 1000.0)
        return 95 + 115 * np.clip(t, 0, 1) ** 1.6

    def depth(X, Y):
        return width(Y) + 10 * np.sin(Y / 120.0) - X

    def paint(reg, rng, inside, wash_w, tide, fade, Y):
        # top half: girih / star lattice (gold); bottom half: folk florals (burgundy)
        star_lattice(reg, "geo", s=92, lw_mm=2.1, ox=10, oy=H - 40,
                     clip=lambda x, y: y > 720)
        floral_vine(reg, "fl", "acc", lambda y: 46 + 20 * math.sin(y / 150.0), -5, 1240,
                    rng, scale=1.0, density=1.3)
        geo = watercolor(reg.arr("geo"), rng, mottle_mm=30)
        fl = watercolor(reg.arr("fl"), rng)
        acc = watercolor(reg.arr("acc"), rng)
        g = smoothstep(780, 1250, Y)            # 1 at top -> 0 below the meeting point
        f = 1 - smoothstep(820, 1260, Y)        # florals climb up to meet it
        base = mottled_wash(geo.shape, rng, 1.0)
        gold = base * 0.16 * wash_w * (0.35 + 0.65 * g) + 0.16 * tide * (0.4 + 0.6 * g) \
            + geo * fade * 0.55 * g + acc * fade * 0.5 * f
        wine = base * 0.06 * wash_w * f + 0.07 * tide * f + fl * fade * 0.40 * f
        return [(gold, B_GOLD), (wine, B_WINE)]
    paint.fade = 120

    render_band(page, band, depth, paint, 21)

    # ---- text, right-aligned (RTL), with a thin gold margin rule beside it.
    # Right alignment keeps the name clear of the author's head (centre).
    xr = W - 92
    e = 88
    lines = ["حين تتحاور", "الثقافات…", SLOGAN_2]
    assert " ".join(lines[:2]) == SLOGAN_1
    t = [Text(ruqaa, l, e) for l in lines]
    name = Text(ruqaa, NAME, 62)
    role = Text(PLEX, ROLE, 27)
    y = stack_text(page, [(t[0], B_WINE, 10), (t[1], B_WINE, 10), (t[2], B_WINE, 36)], 1958, xr, "r")
    c = page.c
    c.setStrokeColor(B_GOLD.rl)
    c.setLineWidth(1.0)
    c.line(xr - 110, y + 17, xr, y + 17)
    y = stack_text(page, [(name, B_WINE, 13), (role, B_GOLD, 0)], y, xr, "r")
    c.setLineWidth(1.2)
    c.line(W - 58, 1958, W - 58, y)
    c.setFillColor(B_GOLD.rl)
    c.circle(W - 58, 1958 + 7, 3.0, stroke=0, fill=1)

    # ---- cover on the left (over the quiet middle of the band), QR on the right
    cov_dpi, ch = draw_cover(page, 52, 1040, 140, B_GOLD, gap=6, line=0.9)
    card = 160
    qx, qy = W - 40 - card, 1120
    draw_qr(page, qx, qy, card, B_WINE, WHITE, frame=B_GOLD)
    draw_instagram_handle(page, PLEX, qx + card / 2, qy - 14, 21, B_WINE, B_GOLD)

    dpi = draw_logo(page, xr, 185, 250, align="r")
    page.save()
    return page, {"logo_dpi": dpi, "cover_dpi": cov_dpi}


# ==========================================================================
# C — "Threshold" : ink-teal + brass on warm white, diagonal corners, with cover
# ==========================================================================
C_PAPER = Ink("Warm white (background)", 1, 2, 5, 0)
C_TEAL = Ink("Ink teal", 90, 45, 45, 40)
C_BRASS = Ink("Brass", 25, 35, 75, 15)


def design_c():
    page = Page(OUT / "C_threshold_850x2000mm_print.pdf", C_PAPER,
                "Sakhaa Mufti roll-up - Direction C (Threshold)")
    kufi = Font("ReemKufi-SemiBold.ttf")

    # Islamic geometry enters from the top-right corner (where Arabic reading
    # begins) and Russian florals answer from the bottom-left corner.
    top = Region(150, 880, W + 5, H + 5)

    def depth_top(X, Y):
        htop = 128 * np.clip(1 - (W - X) / 600.0, 0, 1) ** 1.35
        wr = 160 * np.clip((Y - 930) / 1070.0, 0, 1) ** 1.25
        a = htop - (H - Y)
        b = wr - (W - X)
        k = 18.0                                     # smooth union of the two arms
        return k * np.log(np.exp(a / k) + np.exp(b / k))

    def paint_top(reg, rng, inside, wash_w, tide, fade, Y):
        star_lattice(reg, "geo", s=96, lw_mm=2.0, ox=W + 10, oy=H + 10)
        geo = watercolor(reg.arr("geo"), rng, mottle_mm=28)
        wash = mottled_wash(geo.shape, rng, 0.13) * wash_w + 0.10 * tide
        return [(wash + geo * fade * 0.50, C_BRASS), (geo * fade * 0.05, C_TEAL)]
    paint_top.fade = 105

    bot = Region(-5, -5, 700, 1120)

    def depth_bot(X, Y):
        hb_ = 210 * np.clip((650 - X) / 650.0, 0, 1) ** 1.35
        wl = 170 * np.clip((1060 - Y) / 1060.0, 0, 1) ** 1.15
        a = hb_ - Y
        b = wl - X
        k = 18.0
        return k * np.log(np.exp(a / k) + np.exp(b / k))

    def paint_bot(reg, rng, inside, wash_w, tide, fade, Y):
        from lib import tapered_stroke, curve, flower, leaf
        floral_vine(reg, "fl", "acc", lambda y: 55 + 22 * math.sin(y / 160.0), -5, 1100,
                    rng, scale=1.05, density=1.3)
        # a horizontal runner along the bottom edge
        xs = np.linspace(-5, 520, 300)
        tapered_stroke(reg, "fl", np.c_[xs, 52 + 16 * np.sin(xs / 70.0)], 3.0, 1.4, val=200)
        for i, x in enumerate(np.arange(130, 500, 100)):
            yb = 52 + 16 * math.sin(x / 70.0)
            tip = (x + 40, yb + 72)
            tapered_stroke(reg, "fl", curve((x, yb), (x + 8, yb + 42), tip), 2.4, 0.9, val=200)
            if i % 2 == 0:
                flower(reg, "fl", tip[0], tip[1], 24, n=6, rot=0.3 * i, accent="acc")
            else:
                leaf(reg, "fl", tip[0], tip[1], math.radians(60), 32, 14)
                leaf(reg, "fl", x + 8, yb + 20, math.radians(150), 28, 12)
        fl = watercolor(reg.arr("fl"), rng)
        acc = watercolor(reg.arr("acc"), rng)
        wash = mottled_wash(fl.shape, rng, 0.07) * wash_w + 0.08 * tide
        return [(wash + fl * fade * 0.50, C_TEAL), (acc * fade * 0.6, C_BRASS)]
    paint_bot.fade = 120

    render_band(page, top, depth_top, paint_top, 31)
    render_band(page, bot, depth_bot, paint_bot, 32)

    cx = W / 2
    e = fit(kufi, [SLOGAN_1, SLOGAN_2], 92, 570)
    s1 = Text(kufi, SLOGAN_1, e)
    s2 = Text(kufi, SLOGAN_2, e)
    name = Text(kufi, NAME, 52)
    role = Text(PLEX, ROLE, 26)
    y = stack_text(page, [(s1, C_TEAL, 0.3 * e), (s2, C_TEAL, 0)], 1930, cx, "c")
    c = page.c
    c.setStrokeColor(C_BRASS.rl)
    c.setLineWidth(1.4)
    c.line(cx - 40, y - 21, cx + 40, y - 21)
    stack_text(page, [(name, C_TEAL, 12), (role, C_BRASS, 0)], y - 42, cx, "c")

    card = 160
    qx, qy = 40, 1140
    draw_qr(page, qx, qy, card, C_TEAL, WHITE, frame=C_BRASS)
    draw_instagram_handle(page, PLEX, qx + card / 2, qy - 14, 21, C_TEAL, C_BRASS)
    cov_dpi, ch = draw_cover(page, W - 46 - 140, 1060, 140, C_BRASS, gap=6, line=0.9)

    dpi = draw_logo(page, W - 85, 200, 250, align="r")
    page.save()
    return page, {"logo_dpi": dpi, "cover_dpi": cov_dpi}


DESIGNS = {"A": (design_a, [A_PAPER, A_NAVY, A_GOLD]),
           "B": (design_b, [B_PAPER, B_WINE, B_GOLD]),
           "C": (design_c, [C_PAPER, C_TEAL, C_BRASS])}

if __name__ == "__main__":
    which = sys.argv[1:] or list(DESIGNS)
    report = {}
    for k in which:
        fn, inks = DESIGNS[k]
        page, info = fn()
        report[k] = {"pdf": page.path, "boxes": page.boxes, "inks": [i.label() for i in inks], **info}
        print(k, json.dumps(info), flush=True)
    (OUT / f"_layout_{''.join(which)}.json").write_text(json.dumps(report, ensure_ascii=False, indent=1))
