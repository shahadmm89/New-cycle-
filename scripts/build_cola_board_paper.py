#!/usr/bin/env python3
"""
build_cola_board_paper.py
=========================

Generates the executive board deck:

    "Proposal for the Introduction of a Cost of Living Allowance (COLA)
     for Saudi Employees"

Output : COLA_Board_Paper.pptx  (16:9, 13.333 x 7.5 in, 8 slides)
Needs  : python-pptx  (pip install python-pptx) - no external images.

Usage  : python build_cola_board_paper.py [output_path]
         (defaults to ./COLA_Board_Paper.pptx)

Structure of this file
----------------------
1. SLIDES  - every word on every slide, plus speaker notes. Edit text here.
2. THEME   - colours, font, sizes and the page grid.
3. Helpers - add_title(), add_bullets(), add_table(), add_kpi_card(),
             add_footer() and a few small primitives they share.
4. Slide builders - one function per slide; layout only, no copy.
5. main()  - assembles the deck and saves it.
"""

import sys

from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Emu, Inches, Pt

# =============================================================================
# 1. CONTENT - all slide text lives here
# =============================================================================
SLIDES = {
    "footer": "Confidential — For Management Decision",

    # ---- Slide 1 ------------------------------------------------------------
    "title": {
        "title": "Proposal for the Introduction of a Cost of Living "
                 "Allowance (COLA) for Saudi Employees",
        "subtitle": "Board Paper — Human Resources | Compensation & Benefits",
        "decision": "Decision Required: Approval",
        "date": "Date: [DD Month YYYY]",
        "notes": (
            "This paper seeks management approval for a Cost of Living Allowance "
            "for Saudi national employees. The proposal is a voluntary company "
            "initiative prepared by Compensation & Benefits. A formal decision is "
            "requested at the end of this presentation."
        ),
    },

    # ---- Slide 2 ------------------------------------------------------------
    "purpose": {
        "title": "Purpose & Decision Requested",
        "bullets": [
            "Seek approval for a fixed monthly COLA of SAR 500 for all Saudi "
            "national employees",
            "~1,100 employees, regardless of grade, position or salary",
            "Estimated annual cost: SAR 6.6 million",
            "Voluntary company initiative — not a statutory requirement",
        ],
        # KPI cards shown on the right: (value, label)
        "kpis": [
            ("SAR 500", "Fixed allowance per employee per month"),
            ("~1,100", "Eligible Saudi national employees"),
            ("SAR 6.6M", "Estimated annual cost"),
        ],
        "notes": (
            "Management is asked to approve a flat monthly allowance of SAR 500 "
            "for approximately 1,100 Saudi national employees. The estimated "
            "annual cost is SAR 6.6 million. This is a voluntary initiative and "
            "not a statutory requirement."
        ),
    },

    # ---- Slide 3 ------------------------------------------------------------
    "context": {
        "title": "Context",
        "bullets": [
            "Oct 2026 Royal Order (reported by SPA): SAR 500/month for civil and "
            "military government employees, retirees and eligible social "
            "security beneficiaries",
            "Accompanies new electricity, water and sewage tariffs effective "
            "1 Jan 2027",
            "Does NOT extend to private-sector employees; the private-sector "
            "measure is the higher Nitaqat minimum wage "
            "(SAR 4,000 → 5,000 → 6,000)",
            "Company has no legal obligation; the government measure is a "
            "reference point only",
        ],
        # Right-hand reference panel
        "panel_title": "Reference Measures",
        "gov_label": "Government sector",
        "gov_value": "SAR 500 / month",
        "pvt_label": "Private sector — Nitaqat minimum wage",
        "pvt_steps": ["SAR 4,000", "SAR 5,000", "SAR 6,000"],
        "notes": (
            "In October 2026 a Royal Order, as reported by SPA, granted SAR 500 per "
            "month to government employees, retirees and eligible social security "
            "beneficiaries, alongside new utility tariffs from 1 January 2027. The "
            "measure does not extend to the private sector, where the relevant "
            "measure is the higher Nitaqat minimum wage. The Company therefore has "
            "no legal obligation and uses the government measure as a reference "
            "point only."
        ),
    },

    # ---- Slide 4 ------------------------------------------------------------
    "rationale": {
        "title": "Rationale",
        # (letter, heading, one line)
        "cards": [
            ("A", "Financial Wellbeing",
             "Direct, predictable support as living costs rise"),
            ("B", "Engagement",
             "Visible response reinforces perceived organizational support"),
            ("C", "Retention & Competitiveness",
             "Narrows public/private reward gap; strengthens EVP for Saudi talent"),
            ("D", "Internal Equity",
             "Flat amount, simple and transparent; greater relative support "
             "for lower bands"),
            ("E", "National Alignment",
             "Voluntary contribution as a responsible national employer"),
        ],
        "notes": (
            "The proposal rests on five considerations, from employee financial "
            "wellbeing to national alignment. A flat amount keeps the allowance "
            "simple and transparent and gives greater relative support to lower "
            "bands. Together these strengthen the Company's proposition for Saudi "
            "talent."
        ),
    },

    # ---- Slide 5 ------------------------------------------------------------
    "proposal": {
        "title": "Proposal",
        "header": ["Element", "Proposed Arrangement"],
        "rows": [
            ["Allowance name", "Cost of Living Allowance (COLA)"],
            ["Amount", "SAR 500 per month (fixed)"],
            ["Eligible population", "Saudi nationals — approx. 1,100"],
            ["Eligibility basis", "Equal for all grades, positions and salaries"],
            ["Payment", "Monthly through payroll"],
            ["Classification", "Separate fixed allowance; not part of basic salary"],
            ["Effective date", "Subject to management approval"],
        ],
        "note": "Not a salary increase; no change to salary structure, grading "
                "or merit framework.",
        "notes": (
            "The allowance would be a fixed SAR 500 per month, paid through "
            "payroll as a separate element and not part of basic salary. "
            "Eligibility is equal for all Saudi nationals regardless of grade, "
            "position or salary. It is not a salary increase and leaves the "
            "salary structure, grading and merit framework unchanged."
        ),
    },

    # ---- Slide 6 ------------------------------------------------------------
    "financial": {
        "title": "Financial Impact",
        "kpis": [
            ("SAR 550,000", "Monthly cost"),
            ("SAR 6,600,000", "Annual cost"),
            ("SAR 6,000/yr", "Per employee"),
        ],
        "table_title": "Headcount Sensitivity (SAR)",
        "header": ["Employees", "Monthly", "Annual"],
        "rows": [
            ["1,000", "500,000", "6,000,000"],
            ["1,100 (base)", "550,000", "6,600,000"],
            ["1,200", "600,000", "7,200,000"],
        ],
        "base_row": 1,                       # index into rows to highlight
        "chart_title": "Annual Cost by Headcount Scenario (SAR)",
        "chart_categories": ["1,000", "1,100 (base)", "1,200"],
        "chart_values": [6000000, 6600000, 7200000],
        "chart_series": "Annual cost",
        "footnote": "Estimates based on current headcount. Direct allowance cost "
                    "only; GOSI, end-of-service and payroll implications to be "
                    "validated by Finance and C&B.",
        "notes": (
            "At the base headcount of 1,100 the allowance costs SAR 550,000 per "
            "month, or SAR 6.6 million per year. Each 100-employee change in "
            "headcount moves the annual cost by SAR 600,000. These are direct "
            "allowance costs only and remain subject to validation by Finance "
            "and C&B."
        ),
    },

    # ---- Slide 7 ------------------------------------------------------------
    "implementation": {
        "title": "Implementation & Matters for Attention",
        "header": ["Area", "Action", "Owner"],
        "rows": [
            ["Eligible population", "Confirm headcount, pro-rating rules",
             "C&B / HR Ops"],
            ["Approval & budget", "Approve and confirm budget",
             "Finance / Management"],
            ["Payroll", "Configure separate COLA pay element",
             "Payroll / Finance"],
            ["Policy", "Document eligibility & payment rules", "C&B"],
            ["Communication", "Position as voluntary company initiative",
             "HR / Corp Comms"],
            ["Effective date", "Confirm start date & first cycle",
             "Management / Payroll"],
        ],
        "panel_title": "For Management Attention",
        "panel_bullets": [
            "Duration: ongoing vs periodic review",
            "Communication to non-Saudi employees",
            "Interaction with Nitaqat wage thresholds",
        ],
        "notes": (
            "Implementation is straightforward and is shared between C&B, HR "
            "Operations, Payroll, Finance and Corporate Communications. Three "
            "matters require management direction: the duration of the "
            "allowance, communication to non-Saudi employees, and its "
            "interaction with Nitaqat wage thresholds."
        ),
    },

    # ---- Slide 8 ------------------------------------------------------------
    "recommendation": {
        "title": "Recommendation & Approval Required",
        "statement": "It is recommended that Management approve a fixed monthly "
                     "Cost of Living Allowance of SAR 500 for all eligible Saudi "
                     "employees, as a voluntary company initiative.",
        "decisions_title": "Decisions Requested",
        "decisions": [
            "Approve SAR 500/month COLA for all eligible Saudi employees",
            "Approve estimated annual budget of SAR 6.6M, subject to Finance "
            "validation",
            "Confirm effective date and duration",
            "Authorize HR and Finance to proceed with policy, payroll and "
            "communication",
        ],
        "checkbox_label": "Decision:",
        "checkboxes": ["☐  Approved", "☐  Not Approved",
                       "☐  Approved with Amendments"],
        "sign_header": ["Role", "Name", "Signature", "Date"],
        "sign_roles": ["Prepared by C&B", "Reviewed by HR Director",
                       "Reviewed by Finance", "Approved by CEO"],
        "notes": (
            "Management is asked to approve the allowance and its estimated "
            "budget of SAR 6.6 million, subject to Finance validation, and to "
            "confirm the effective date and duration. Approval will authorize HR "
            "and Finance to proceed with policy, payroll and communication. The "
            "approval block records the decision and the required signatures."
        ),
    },
}

# =============================================================================
# 2. THEME - colours, typography, page grid
# =============================================================================
NAVY = RGBColor(0x0B, 0x25, 0x45)    # primary
SLATE = RGBColor(0x5C, 0x6B, 0x7A)   # secondary text
PANEL = RGBColor(0xF2, 0xF4, 0xF7)   # light grey panels / alt rows
TEAL = RGBColor(0x13, 0xA8, 0x9E)    # accent - used sparingly
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
DARK = RGBColor(0x1F, 0x2A, 0x37)    # body text (near-black, softer than pure)
RULE = RGBColor(0xD5, 0xDB, 0xE3)    # hairlines / borders
BASE_ROW = RGBColor(0xD9, 0xF2, 0xF0)  # tint of teal for highlighted table row
NAVY_SOFT = RGBColor(0x9F, 0xB3, 0xC8)  # muted navy for non-base chart bars

FONT = "Calibri"
TITLE_PT = 28
BODY_PT = 16
TABLE_PT = 13
FOOTER_PT = 10

SLIDE_W, SLIDE_H = 13.333, 7.5       # inches (16:9)
MARGIN = 0.6                         # left/right page margin (in)
CONTENT_W = SLIDE_W - 2 * MARGIN     # usable width
CONTENT_TOP = 1.45                   # first content y below title + accent
FOOTER_Y = 6.95                      # footer baseline area


# =============================================================================
# 3. HELPERS
# =============================================================================
def _style_run(run, size=BODY_PT, bold=False, color=DARK, italic=False):
    """Apply the standard font settings to a text run."""
    f = run.font
    f.name = FONT
    f.size = Pt(size)
    f.bold = bold
    f.italic = italic
    f.color.rgb = color


def _textbox(slide, x, y, w, h, text, size=BODY_PT, bold=False, color=DARK,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, italic=False,
             margin=0.0, wrap=True):
    """Add a single-paragraph text box and return the shape."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = wrap
    tf.vertical_anchor = anchor
    for side in ("left", "right", "top", "bottom"):
        setattr(tf, f"margin_{side}", Inches(margin))
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    _style_run(run, size, bold, color, italic)
    return tb


def _rect(slide, x, y, w, h, fill, rounded=False, line=None):
    """Add a filled rectangle (optionally rounded) with no outline by default."""
    shape_type = MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE
    shp = slide.shapes.add_shape(shape_type, Inches(x), Inches(y),
                                 Inches(w), Inches(h))
    if rounded:
        shp.adjustments[0] = 0.08          # gentle corner radius
    shp.fill.solid()
    shp.fill.fore_color.rgb = fill
    if line is None:
        shp.line.fill.background()
    else:
        shp.line.color.rgb = line
        shp.line.width = Pt(0.75)
    _flatten(shp)                          # flat: no theme shadow/effects
    return shp


def _flatten(shape):
    """Remove the theme style reference (and its shadow) from an autoshape."""
    shape.shadow.inherit = False
    style = shape._element.find(qn("p:style"))
    if style is not None:
        shape._element.remove(style)


def _set_bullet(paragraph, char="•", color=TEAL, indent_in=0.28):
    """Turn a paragraph into a hanging-indent bullet using DrawingML XML."""
    pPr = paragraph._p.get_or_add_pPr()
    pPr.set("marL", str(Emu(Inches(indent_in))))
    pPr.set("indent", str(-Emu(Inches(indent_in))))
    for tag in ("a:buClr", "a:buFont", "a:buChar", "a:buNone", "a:buAutoNum"):
        for el in pPr.findall(qn(tag)):
            pPr.remove(el)
    buClr = pPr.makeelement(qn("a:buClr"), {})
    srgb = buClr.makeelement(qn("a:srgbClr"), {"val": str(color)})
    buClr.append(srgb)
    buFont = pPr.makeelement(qn("a:buFont"), {"typeface": "Arial"})
    buChar = pPr.makeelement(qn("a:buChar"), {"char": char})
    pPr.append(buClr)
    pPr.append(buFont)
    pPr.append(buChar)


def _set_numbered(paragraph, color=TEAL, indent_in=0.38):
    """Turn a paragraph into an auto-numbered '1)' list item."""
    pPr = paragraph._p.get_or_add_pPr()
    pPr.set("marL", str(Emu(Inches(indent_in))))
    pPr.set("indent", str(-Emu(Inches(indent_in))))
    buClr = pPr.makeelement(qn("a:buClr"), {})
    buClr.append(buClr.makeelement(qn("a:srgbClr"), {"val": str(color)}))
    buFont = pPr.makeelement(qn("a:buFont"), {"typeface": FONT})
    num = pPr.makeelement(qn("a:buAutoNum"), {"type": "arabicParenR"})
    pPr.append(buClr)
    pPr.append(buFont)
    pPr.append(num)


def _add_notes(slide, text):
    """Write presenter speaker notes for a slide."""
    slide.notes_slide.notes_text_frame.text = text


def add_title(slide, text):
    """Slide title, top-left, 28pt bold navy, with a thin teal accent line."""
    _textbox(slide, MARGIN, 0.42, CONTENT_W, 0.6, text, size=TITLE_PT,
             bold=True, color=NAVY, anchor=MSO_ANCHOR.BOTTOM)
    # Thin accent line directly under the title (short, left-aligned)
    _rect(slide, MARGIN, 1.1, 1.4, 0.045, TEAL)


def add_bullets(slide, x, y, w, h, items, size=BODY_PT, color=DARK,
                numbered=False, space_after=10, bullet_color=TEAL):
    """Bulleted (or numbered) list of short phrases. Max 5 items enforced."""
    assert len(items) <= 5, "Design rule: maximum 5 bullets per slide"
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    for side in ("left", "right", "top", "bottom"):
        setattr(tf, f"margin_{side}", 0)
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_after = Pt(space_after)
        run = p.add_run()
        run.text = item
        _style_run(run, size, False, color)
        if numbered:
            _set_numbered(p, color=bullet_color)
        else:
            _set_bullet(p, color=bullet_color)
    return tb


def _is_number(text):
    """True if a cell holds a figure (digits, commas, optional suffix)."""
    core = text.split(" ")[0].replace(",", "").replace(".", "")
    return core.isdigit()


def add_table(slide, x, y, w, header, rows, col_widths=None, row_h=0.42,
              size=TABLE_PT, highlight_row=None, bold_first_col=False,
              header_h=None):
    """
    Branded table: navy header with white bold text, alternating light-grey
    rows, numeric cells right-aligned. `highlight_row` (index into rows) gets
    a teal tint and bold text. Returns the graphic-frame shape.
    """
    n_rows, n_cols = len(rows) + 1, len(header)
    header_h = header_h or row_h
    total_h = header_h + row_h * len(rows)
    gf = slide.shapes.add_table(n_rows, n_cols, Inches(x), Inches(y),
                                Inches(w), Inches(total_h))
    table = gf.table
    # Switch off the built-in style's banding so our fills are the only fills
    tbl_pr = gf._element.graphic.graphicData.tbl.tblPr
    tbl_pr.set("bandRow", "0")
    tbl_pr.set("firstRow", "1")

    # Column widths (fractions of total width)
    col_widths = col_widths or [1.0 / n_cols] * n_cols
    for i, frac in enumerate(col_widths):
        table.columns[i].width = Inches(w * frac)
    table.rows[0].height = Inches(header_h)
    for r in range(1, n_rows):
        table.rows[r].height = Inches(row_h)

    # Which columns are numeric (decided from body rows, so header aligns too)
    numeric_cols = [all(_is_number(r[c]) for r in rows if r[c]) and
                    any(r[c] for r in rows) for c in range(n_cols)]

    def fill_cell(cell, text, bg, color, bold, align):
        cell.fill.solid()
        cell.fill.fore_color.rgb = bg
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        cell.margin_left = cell.margin_right = Inches(0.12)
        cell.margin_top = cell.margin_bottom = Inches(0.04)
        tf = cell.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = align
        run = p.add_run()
        run.text = text
        _style_run(run, size, bold, color)

    for c, text in enumerate(header):
        align = PP_ALIGN.RIGHT if numeric_cols[c] else PP_ALIGN.LEFT
        fill_cell(table.cell(0, c), text, NAVY, WHITE, True, align)

    for r, row in enumerate(rows):
        is_hl = highlight_row is not None and r == highlight_row
        bg = BASE_ROW if is_hl else (PANEL if r % 2 == 1 else WHITE)
        for c, text in enumerate(row):
            align = PP_ALIGN.RIGHT if numeric_cols[c] else PP_ALIGN.LEFT
            bold = is_hl or (bold_first_col and c == 0)
            color = NAVY if (is_hl or (bold_first_col and c == 0)) else DARK
            fill_cell(table.cell(r + 1, c), text, bg, color, bold, align)
    return gf


def add_kpi_card(slide, x, y, w, h, value, label, value_pt=28, label_pt=13,
                 dark=False):
    """KPI card: large value with a small descriptive label underneath."""
    bg = NAVY if dark else PANEL
    val_color = WHITE if dark else NAVY
    lab_color = RGBColor(0xC9, 0xD3, 0xDE) if dark else SLATE
    _rect(slide, x, y, w, h, bg, rounded=True)
    pad = 0.25
    _textbox(slide, x + pad, y + 0.12, w - 2 * pad, h * 0.55, value,
             size=value_pt, bold=True, color=val_color, anchor=MSO_ANCHOR.BOTTOM)
    _textbox(slide, x + pad, y + 0.12 + h * 0.55, w - 2 * pad, h * 0.45 - 0.2,
             label, size=label_pt, color=lab_color, anchor=MSO_ANCHOR.TOP)


def add_footer(slide, number):
    """Footer: confidentiality line (left) and slide number (right)."""
    rule = slide.shapes.add_connector(1, Inches(MARGIN), Inches(FOOTER_Y - 0.06),
                                      Inches(SLIDE_W - MARGIN),
                                      Inches(FOOTER_Y - 0.06))   # 1 = straight
    rule.line.color.rgb = RULE
    rule.line.width = Pt(0.75)
    style = rule._element.find(qn("p:style"))      # drop theme shadow
    if style is not None:
        rule._element.remove(style)
    _textbox(slide, MARGIN, FOOTER_Y, 8.0, 0.3, SLIDES["footer"],
             size=FOOTER_PT, color=SLATE, anchor=MSO_ANCHOR.MIDDLE)
    _textbox(slide, SLIDE_W - MARGIN - 1.0, FOOTER_Y, 1.0, 0.3, str(number),
             size=FOOTER_PT, color=SLATE, align=PP_ALIGN.RIGHT,
             anchor=MSO_ANCHOR.MIDDLE)


def _new_slide(prs):
    """Blank slide with a white background."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])   # 6 = Blank
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = WHITE
    return slide


def _content_slide(prs, key, number):
    """Blank slide + title + footer + speaker notes for a content slide."""
    slide = _new_slide(prs)
    add_title(slide, SLIDES[key]["title"])
    add_footer(slide, number)
    _add_notes(slide, SLIDES[key]["notes"])
    return slide


# =============================================================================
# 4. SLIDE BUILDERS (layout only - text comes from SLIDES)
# =============================================================================
def build_title(prs):
    """Slide 1 - title slide on a navy field."""
    d = SLIDES["title"]
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = NAVY

    _textbox(slide, 0.9, 1.7, 10.8, 2.1, d["title"], size=40, bold=True,
             color=WHITE, anchor=MSO_ANCHOR.BOTTOM)
    _rect(slide, 0.9, 4.0, 1.6, 0.06, TEAL)                     # accent line
    _textbox(slide, 0.9, 4.25, 11.0, 0.5, d["subtitle"], size=20,
             color=RGBColor(0xC9, 0xD3, 0xDE))
    # "Decision Required" pill
    pill = _rect(slide, 0.9, 5.15, 3.6, 0.5, TEAL, rounded=True)
    pill.adjustments[0] = 0.5
    _textbox(slide, 0.9, 5.15, 3.6, 0.5, d["decision"], size=15, bold=True,
             color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    _textbox(slide, 0.9, 6.55, 6.0, 0.35, d["date"], size=13,
             color=RGBColor(0xC9, 0xD3, 0xDE))
    _add_notes(slide, d["notes"])


def build_purpose(prs):
    """Slide 2 - bullets left, three headline KPI cards stacked right."""
    d = SLIDES["purpose"]
    slide = _content_slide(prs, "purpose", 2)
    add_bullets(slide, MARGIN, CONTENT_TOP + 0.25, 6.9, 4.8, d["bullets"],
                size=18, space_after=18)
    x, w, h, gap = 8.25, 4.48, 1.48, 0.25
    for i, (value, label) in enumerate(d["kpis"]):
        add_kpi_card(slide, x, CONTENT_TOP + 0.1 + i * (h + gap), w, h, value,
                     label, value_pt=30, dark=(i == 2))


def build_context(prs):
    """Slide 3 - bullets left, reference-measures panel right."""
    d = SLIDES["context"]
    slide = _content_slide(prs, "context", 3)
    add_bullets(slide, MARGIN, CONTENT_TOP + 0.15, 7.2, 5.2, d["bullets"],
                size=16, space_after=14)

    # Right panel
    px, py, pw, ph = 8.35, CONTENT_TOP + 0.05, 4.38, 5.25
    _rect(slide, px, py, pw, ph, PANEL, rounded=True)
    ix, iw = px + 0.3, pw - 0.6
    _textbox(slide, ix, py + 0.25, iw, 0.4, d["panel_title"], size=16,
             bold=True, color=NAVY)
    # Government measure
    _textbox(slide, ix, py + 0.9, iw, 0.35, d["gov_label"], size=13, color=SLATE)
    _textbox(slide, ix, py + 1.25, iw, 0.55, d["gov_value"], size=26,
             bold=True, color=NAVY)
    _rect(slide, ix, py + 2.05, iw, 0.012, RULE)
    # Private-sector Nitaqat wage progression as three step blocks
    _textbox(slide, ix, py + 2.3, iw, 0.6, d["pvt_label"], size=13, color=SLATE)
    steps = d["pvt_steps"]
    gap = 0.12
    sw = (iw - gap * (len(steps) - 1)) / len(steps)
    for i, step in enumerate(steps):
        sx = ix + i * (sw + gap)
        sh = 0.9 + i * 0.5                        # rising bars show the step-up
        sy = py + ph - 0.35 - sh
        fill = NAVY if i == len(steps) - 1 else NAVY_SOFT
        _rect(slide, sx, sy, sw, sh, fill, rounded=True)
        _textbox(slide, sx, sy, sw, sh, step, size=13, bold=True, color=WHITE,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


def build_rationale(prs):
    """Slide 4 - five cards: three on the top row, two centred below."""
    d = SLIDES["rationale"]
    slide = _content_slide(prs, "rationale", 4)
    gap = 0.3
    cw = (CONTENT_W - 2 * gap) / 3
    ch = 2.4
    top = CONTENT_TOP + 0.05
    positions = [(MARGIN + i * (cw + gap), top) for i in range(3)]
    row2_x0 = MARGIN + (CONTENT_W - (2 * cw + gap)) / 2
    positions += [(row2_x0 + i * (cw + gap), top + ch + gap) for i in range(2)]

    for (letter, heading, line), (x, y) in zip(d["cards"], positions):
        _rect(slide, x, y, cw, ch, PANEL, rounded=True)
        # Letter badge (teal circle)
        badge = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(x + 0.3),
                                       Inches(y + 0.3), Inches(0.55), Inches(0.55))
        badge.fill.solid()
        badge.fill.fore_color.rgb = TEAL
        badge.line.fill.background()
        _flatten(badge)
        _textbox(slide, x + 0.3, y + 0.3, 0.55, 0.55, letter, size=18,
                 bold=True, color=WHITE, align=PP_ALIGN.CENTER,
                 anchor=MSO_ANCHOR.MIDDLE)
        _textbox(slide, x + 0.3, y + 1.0, cw - 0.6, 0.4, heading, size=17,
                 bold=True, color=NAVY)
        _textbox(slide, x + 0.3, y + 1.45, cw - 0.6, 0.85, line, size=14,
                 color=SLATE)


def build_proposal(prs):
    """Slide 5 - two-column proposal table with a note panel below."""
    d = SLIDES["proposal"]
    slide = _content_slide(prs, "proposal", 5)
    add_table(slide, MARGIN, CONTENT_TOP + 0.05, CONTENT_W, d["header"],
              d["rows"], col_widths=[0.3, 0.7], row_h=0.52, size=14,
              bold_first_col=True)
    # Note panel (bottom)
    ny = 6.05
    _rect(slide, MARGIN, ny, CONTENT_W, 0.58, PANEL, rounded=True)
    _textbox(slide, MARGIN + 0.3, ny, 0.9, 0.58, "Note", size=14, bold=True,
             color=TEAL, anchor=MSO_ANCHOR.MIDDLE)
    _textbox(slide, MARGIN + 1.1, ny, CONTENT_W - 1.4, 0.58, d["note"],
             size=14, color=NAVY, anchor=MSO_ANCHOR.MIDDLE)


def build_financial(prs):
    """Slide 6 - KPI cards, sensitivity table and a native bar chart."""
    d = SLIDES["financial"]
    slide = _content_slide(prs, "financial", 6)

    # Top: three KPI cards
    gap = 0.3
    kw = (CONTENT_W - 2 * gap) / 3
    for i, (value, label) in enumerate(d["kpis"]):
        add_kpi_card(slide, MARGIN + i * (kw + gap), CONTENT_TOP, kw, 1.3,
                     value, label, value_pt=28, dark=(i == 1))

    # Bottom-left: sensitivity table
    by = CONTENT_TOP + 1.65
    lw = 5.8
    _textbox(slide, MARGIN, by, lw, 0.35, d["table_title"], size=14,
             bold=True, color=NAVY)
    add_table(slide, MARGIN, by + 0.45, lw, d["header"], d["rows"],
              col_widths=[0.36, 0.30, 0.34], row_h=0.48, size=14,
              highlight_row=d["base_row"])

    # Bottom-right: native clustered column chart
    cx, cw = MARGIN + lw + 0.5, CONTENT_W - lw - 0.5
    _textbox(slide, cx, by, cw, 0.35, d["chart_title"], size=14, bold=True,
             color=NAVY)
    chart_data = CategoryChartData()
    chart_data.categories = d["chart_categories"]
    chart_data.add_series(d["chart_series"], d["chart_values"])
    gf = slide.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(cx),
                                Inches(by + 0.35), Inches(cw), Inches(2.6),
                                chart_data)
    chart = gf.chart
    chart.has_legend = False
    chart.has_title = False
    chart.font.name = FONT
    chart.font.size = Pt(12)
    chart.font.color.rgb = SLATE
    plot = chart.plots[0]
    plot.gap_width = 80
    plot.has_data_labels = True
    labels = plot.data_labels
    labels.number_format = '#,##0'
    labels.number_format_is_linked = False
    labels.position = XL_LABEL_POSITION.OUTSIDE_END
    labels.font.size = Pt(12)
    labels.font.bold = True
    labels.font.color.rgb = NAVY
    # Colour bars: base case navy, alternative scenarios muted navy
    series = plot.series[0]
    series.format.fill.solid()
    series.format.fill.fore_color.rgb = NAVY_SOFT
    pt = series.points[d["base_row"]]
    pt.format.fill.solid()
    pt.format.fill.fore_color.rgb = NAVY
    # Quiet axes
    va = chart.value_axis
    va.visible = False
    va.has_major_gridlines = False
    va.minimum_scale = 0
    va.maximum_scale = 8000000
    ca = chart.category_axis
    ca.format.line.color.rgb = RULE
    ca.tick_labels.font.size = Pt(12)
    ca.tick_labels.font.color.rgb = SLATE

    # Footnote
    _textbox(slide, MARGIN, 6.38, CONTENT_W, 0.45, d["footnote"], size=11,
             italic=True, color=SLATE)


def build_implementation(prs):
    """Slide 7 - action table left, 'For Management Attention' panel right."""
    d = SLIDES["implementation"]
    slide = _content_slide(prs, "implementation", 7)
    tw = 8.2
    add_table(slide, MARGIN, CONTENT_TOP + 0.05, tw, d["header"], d["rows"],
              col_widths=[0.27, 0.44, 0.29], row_h=0.66, size=13,
              header_h=0.48, bold_first_col=True)

    px = MARGIN + tw + 0.35
    pw = SLIDE_W - MARGIN - px
    py, ph = CONTENT_TOP + 0.05, 4.44
    _rect(slide, px, py, pw, ph, NAVY, rounded=True)
    _textbox(slide, px + 0.3, py + 0.3, pw - 0.6, 0.45, d["panel_title"],
             size=17, bold=True, color=WHITE)
    _rect(slide, px + 0.3, py + 0.85, 0.9, 0.04, TEAL)
    add_bullets(slide, px + 0.3, py + 1.15, pw - 0.6, ph - 1.4,
                d["panel_bullets"], size=15, color=WHITE, space_after=16)


def build_recommendation(prs):
    """Slide 8 - recommendation panel, decisions, approval block."""
    d = SLIDES["recommendation"]
    slide = _content_slide(prs, "recommendation", 8)

    # Navy recommendation panel
    ry, rh = CONTENT_TOP + 0.05, 0.95
    _rect(slide, MARGIN, ry, CONTENT_W, rh, NAVY, rounded=True)
    _textbox(slide, MARGIN + 0.35, ry, CONTENT_W - 0.7, rh, d["statement"],
             size=16, bold=True, color=WHITE, anchor=MSO_ANCHOR.MIDDLE)

    # Left: numbered decisions
    top = ry + rh + 0.3
    lw = 5.9
    _textbox(slide, MARGIN, top, lw, 0.35, d["decisions_title"], size=15,
             bold=True, color=NAVY)
    add_bullets(slide, MARGIN, top + 0.5, lw, 2.7, d["decisions"], size=14,
                numbered=True, space_after=9)

    # Right: signature table (Name / Signature / Date left blank)
    sx = MARGIN + lw + 0.4
    sw = CONTENT_W - lw - 0.4
    rows = [[role, "", "", ""] for role in d["sign_roles"]]
    add_table(slide, sx, top, sw, d["sign_header"], rows,
              col_widths=[0.37, 0.23, 0.23, 0.17], row_h=0.56, size=12,
              header_h=0.4, bold_first_col=True)

    # Bottom: decision checkbox row
    cy = 5.95
    _rect(slide, MARGIN, cy, CONTENT_W, 0.65, PANEL, rounded=True)
    _textbox(slide, MARGIN + 0.35, cy, 1.4, 0.65, d["checkbox_label"],
             size=15, bold=True, color=NAVY, anchor=MSO_ANCHOR.MIDDLE)
    bx, bw = MARGIN + 1.9, 3.3
    for i, label in enumerate(d["checkboxes"]):
        _textbox(slide, bx + i * bw, cy, bw, 0.65, label, size=15,
                 color=DARK, anchor=MSO_ANCHOR.MIDDLE)


# =============================================================================
# 5. MAIN
# =============================================================================
def main(out_path="COLA_Board_Paper.pptx"):
    prs = Presentation()
    prs.slide_width = Inches(SLIDE_W)
    prs.slide_height = Inches(SLIDE_H)
    prs.core_properties.title = SLIDES["title"]["title"]
    prs.core_properties.subject = SLIDES["title"]["subtitle"]

    build_title(prs)
    build_purpose(prs)
    build_context(prs)
    build_rationale(prs)
    build_proposal(prs)
    build_financial(prs)
    build_implementation(prs)
    build_recommendation(prs)

    prs.save(out_path)
    print(f"Saved {out_path} ({len(prs.slides)} slides)")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "COLA_Board_Paper.pptx")
