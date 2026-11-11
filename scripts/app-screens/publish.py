# Turns the captures (390x722 CSS px at DPR 2) into the light pictures of the page: 540x1000 WebP, the phone frame's
# own proportions (0.54), so nothing is cropped and no byte is wasted.
# python publish.py <capture folder> [names...]   (default: every staff-*.png in the folder)
import glob, os, sys
from PIL import Image

src = sys.argv[1]
names = sys.argv[2:] or [os.path.basename(p)[:-4] for p in sorted(glob.glob(os.path.join(src, 'staff-*.png')))]
dst = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'lp')
for n in names:
    im = Image.open(os.path.join(src, n + '.png')).convert('RGB')
    w = 540
    h = round(im.height * w / im.width)
    im = im.resize((w, h), Image.LANCZOS)
    out = os.path.join(dst, n + '.webp')
    im.save(out, 'WEBP', quality=80, method=6)
    print(f'{n}.webp {w}x{h} {os.path.getsize(out) // 1024} KB')
