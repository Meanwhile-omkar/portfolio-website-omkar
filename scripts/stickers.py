"""Split a sticker sheet into one file per sticker.

Transparent sheets: every opaque island is a sticker. Small accent marks floating next to a
sticker (the little "shine" ticks) are grouped with it by growing each island a few pixels
before labelling. Sheets on a plain white backdrop get the backdrop keyed out first.

usage: python scripts/stickers.py <sheet.png> <out_dir> [min_area] [grow_px]
Writes out_dir/NN.webp (largest first) and prints index, size, centre.
"""

import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage


def load_rgba(path: str) -> np.ndarray:
    im = Image.open(path)
    if im.mode == "RGBA":
        return np.asarray(im).copy()
    rgb = np.asarray(im.convert("RGB")).astype(np.float32)
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, axis=0)
    dist = np.sqrt(((rgb - bg) ** 2).sum(axis=2))
    # soft key: fully transparent near the paper colour, fully opaque past ~60 away
    alpha = np.clip((dist - 18) / 42, 0, 1) * 255
    return np.dstack([rgb, alpha]).astype(np.uint8)


def split(path: str, out_dir: str, min_area: int = 2500, grow: int = 12) -> None:
    rgba = load_rgba(path)
    solid = rgba[:, :, 3] > 40
    grown = ndimage.binary_dilation(solid, iterations=grow)
    labels, n = ndimage.label(grown)
    os.makedirs(out_dir, exist_ok=True)

    # work inside each island's bounding box only; a full-image mask per island is far too slow
    areas = ndimage.sum(solid, labels, index=np.arange(1, n + 1))
    pieces = []
    for lab, box in enumerate(ndimage.find_objects(labels), start=1):
        if box is None or areas[lab - 1] < min_area:
            continue
        region = (labels[box] == lab) & solid[box]
        ys, xs = np.where(region)
        y0, x0 = box[0].start + ys.min(), box[1].start + xs.min()
        y1, x1 = box[0].start + ys.max(), box[1].start + xs.max()
        pieces.append((areas[lab - 1], x0, y0, x1, y1, lab))

    pieces.sort(key=lambda p: -p[0])
    for i, (area, x0, y0, x1, y1, lab) in enumerate(pieces):
        crop = rgba[y0 : y1 + 1, x0 : x1 + 1].copy()
        crop[:, :, 3] = np.where(labels[y0 : y1 + 1, x0 : x1 + 1] == lab, crop[:, :, 3], 0)
        img = Image.fromarray(crop, "RGBA")
        scale = 440 / max(img.size)
        if scale < 1:
            img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
        img.save(os.path.join(out_dir, f"{i:02d}.webp"), "WEBP", quality=86, method=6)
        print(f"{i:02d}  {img.width}x{img.height}  at ({(x0 + x1) // 2},{(y0 + y1) // 2})")


if __name__ == "__main__":
    split(sys.argv[1], sys.argv[2], *(int(a) for a in sys.argv[3:5]))
