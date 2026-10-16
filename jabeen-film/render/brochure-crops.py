"""Crops the clean 16:9 picture areas out of the Sumou brochure pages.
Usage: python3 -I render/brochure-crops.py public/project/brochure/pages public/project/brochure/crops
"""
import sys
from PIL import Image, ImageFilter
P, O = sys.argv[1], sys.argv[2]
# (page file, out name, box) - boxes are 16:9 regions clear of text panels and logos.
CROPS = [
  ('p36-master-bedroom', 'bedroom', (46, 420, 650, 760)),
  ('p37-living', 'living', (46, 330, 650, 670)),
  ('p33-street-dusk', 'street', (46, 200, 650, 540)),
  ('p35-facade-dusk', 'facade-left', (46, 385, 718, 763)),
  ('p35-facade-dusk', 'facade-gate', (280, 385, 952, 763)),
  ('p34-dining', 'dining', (46, 330, 680, 687)),
  ('p31-aziziyah-aerial', 'aziziyah-aerial', (46, 45, 1026, 596)),
  ('p31-aziziyah-aerial', 'aziziyah-cluster', (400, 150, 1000, 488)),
  ('p31-nakheel-aerial', 'nakheel-aerial', (46, 45, 1000, 582)),
  ('p30-aziziyah-map', 'aziziyah-map', (200, 320, 988, 763)),
  # Pages 21-25, supplied 16 Oct: daytime exteriors and a wider living room.
  ('p25-living-wide', 'living-wide', (46, 380, 690, 742)),
  ('p22-street-day', 'street-day', (46, 130, 626, 456)),
  ('p21-plaza-day', 'plaza-day', (46, 400, 680, 757)),
  ('p23-corner-day', 'corner-day', (400, 425, 1000, 763)),
]
for page, name, box in CROPS:
    im = Image.open(f'{P}/{page}.jpg').convert('RGB').crop(box)
    w, h = im.size
    assert abs(w / h - 16 / 9) < 0.02, (name, w / h)
    im = im.resize((1920, 1080), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    im.save(f'{O}/{name}.jpg', quality=92)
    print(name, box)
# Site plans: the drawing only, kept portrait; shown "contained" on the paper tone.
for page, name, box in [('p29-aziziyah-siteplan', 'aziziyah-siteplan', (120, 85, 480, 700)), ('p29-nakheel-siteplan', 'nakheel-siteplan', (75, 225, 505, 695))]:
    im = Image.open(f'{P}/{page}.jpg').convert('RGB').crop(box)
    im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    im.save(f'{O}/{name}.jpg', quality=92)
    print(name, box)
