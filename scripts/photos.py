"""Build the photo strips from assets-src/photos using scripts/photo-sort.json.

For every photo listed under a section it writes two WebPs into public/photos/<section>/:
  NN.webp       strip size (640px tall, enough for a 2x screen)
  NN-full.webp  lightbox size (1600px on the long side)
and data/photos.json with each photo's real width and height, so the site shows it uncropped.
Near-identical photos (difference hash) are skipped and reported.
The order in photo-sort.json does not matter: photos are shuffled so that similar-looking ones
(same outfit, same place) never sit next to each other in the strips.

usage: python scripts/photos.py
"""

import json
import os
import random
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


def look(im: Image.Image) -> list[float]:
    """A tiny colour + layout fingerprint: 8x8 RGB thumbnail, normalised."""
    px = [c / 255 for p in im.resize((8, 8), Image.BILINEAR).getdata() for c in p]
    mean = sum(px) / len(px)
    return [v - mean for v in px]


def spread(items: list, window: int = 6, seed: int = 7, steps: int = 40_000) -> list:
    """Seeded shuffle that keeps similar photos apart. Positions closer than `window` count as
    neighbours (that covers both strip rows and the hobby columns, including the loop back to
    the start); random swaps are kept whenever they lower the total closeness of neighbours."""
    n = len(items)
    if n < 3:
        return items[:]
    rnd = random.Random(seed)
    d = [[sum((x - y) ** 2 for x, y in zip(a["look"], b["look"])) for b in items] for a in items]
    scale = sorted(v for row in d for v in row if v > 0)[len(d) * len(d) // 4] or 1.0

    def close(i: int, j: int) -> float:
        return pow(2.718, -d[i][j] / scale)

    order = list(range(n))
    rnd.shuffle(order)
    w = min(window, n // 2)

    def cost_at(pos: int) -> float:
        return sum(close(order[pos], order[(pos + k) % n]) * (w + 1 - k) for k in range(1, w + 1)) + sum(
            close(order[pos], order[(pos - k) % n]) * (w + 1 - k) for k in range(1, w + 1)
        )

    for _ in range(steps):
        a, b = rnd.randrange(n), rnd.randrange(n)
        if a == b:
            continue
        before = cost_at(a) + cost_at(b)
        order[a], order[b] = order[b], order[a]
        if cost_at(a) + cost_at(b) > before:
            order[a], order[b] = order[b], order[a]
    return [items[i] for i in order]


def main() -> None:
    sort = json.load(open(SORT, encoding="utf-8"))
    manifest: dict[str, list[dict]] = {}
    seen: list[tuple[int, str]] = []
    for section, files in sort.items():
        out_dir = os.path.join(OUT, section)
        shutil.rmtree(out_dir, ignore_errors=True)
        os.makedirs(out_dir)
        manifest[section] = []
        items = []
        for name in files:
            im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, name))).convert("RGB")
            h = dhash(im)
            dup = next((n for hh, n in seen if bin(hh ^ h).count("1") <= 5), None)
            if dup:
                print(f"skip {name} (same as {dup})")
                continue
            seen.append((h, name))
            items.append({"name": name, "im": im, "look": look(im)})
        for item in spread(items):
            im = item["im"]
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
