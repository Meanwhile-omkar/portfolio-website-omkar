"""Build the photo strips from assets-src/photos using scripts/photo-sort.json.

For every photo listed under a section it writes two WebPs into public/photos/<section>/:
  NN.webp       strip size (640px tall, enough for a 2x screen)
  NN-full.webp  lightbox size (1600px on the long side)
and data/photos.json with each photo's real width and height, so the site shows it uncropped.
Near-identical photos (difference hash) are skipped and reported.

usage: python scripts/photos.py
"""

import json
import os
import shutil

from PIL import Image, ImageOps

SRC = "assets-src/photos"
SORT = "scripts/photo-sort.json"
OUT = "public/photos"
STRIP_H = 640
FULL = 1600


def dhash(im: Image.Image) -> int:
    g = im.convert("L").resize((9, 8), Image.LANCZOS)
    px = list(g.getdata())
    return sum(1 << i for i in range(64) if px[(i // 8) * 9 + i % 8] > px[(i // 8) * 9 + i % 8 + 1])


def main() -> None:
    sort = json.load(open(SORT, encoding="utf-8"))
    manifest: dict[str, list[dict]] = {}
    seen: list[tuple[int, str]] = []
    for section, files in sort.items():
        out_dir = os.path.join(OUT, section)
        shutil.rmtree(out_dir, ignore_errors=True)
        os.makedirs(out_dir)
        manifest[section] = []
        for name in files:
            im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, name))).convert("RGB")
            h = dhash(im)
            dup = next((n for hh, n in seen if bin(hh ^ h).count("1") <= 5), None)
            if dup:
                print(f"skip {name} (same as {dup})")
                continue
            seen.append((h, name))
            i = len(manifest[section])
            strip = im.copy()
            strip.thumbnail((10_000, STRIP_H), Image.LANCZOS)
            strip.save(os.path.join(out_dir, f"{i:02d}.webp"), "WEBP", quality=80, method=6)
            full = im.copy()
            full.thumbnail((FULL, FULL), Image.LANCZOS)
            full.save(os.path.join(out_dir, f"{i:02d}-full.webp"), "WEBP", quality=84, method=6)
            manifest[section].append({"src": f"/photos/{section}/{i:02d}.webp", "full": f"/photos/{section}/{i:02d}-full.webp", "w": strip.width, "h": strip.height})
    json.dump(manifest, open("data/photos.json", "w", encoding="utf-8"), indent=1)
    print({k: len(v) for k, v in manifest.items()})


if __name__ == "__main__":
    main()
