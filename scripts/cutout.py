"""Cut the character art out of its plain background.

The illustrations have closed black outlines on a flat white/grey backdrop, so anything
light and grey-ish that is connected to the image border is background (that includes the
soft floor shadow). White clothes inside the outline are never touched.

usage: python scripts/cutout.py <in.png> <out.webp> [max_height]
"""

import sys

import numpy as np
from PIL import Image
from scipy import ndimage


def cutout(src: str, dst: str, max_h: int = 1400) -> None:
    rgb = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
    h, w, _ = rgb.shape

    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, axis=0)
    dist = np.sqrt(((rgb - bg) ** 2).sum(axis=2))

    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    # backdrop, plus the neutral grey floor shadow that fades out of it. The shadow rule only
    # applies near the feet: higher up, thin grey outlines (paper, a paper plane) look the same.
    floor = np.zeros((h, w), bool)
    floor[int(h * 0.8) :] = True
    candidate = (dist < 38) | (floor & (sat < 20) & (lum > 105) & (np.abs(lum - bg.mean()) < 120))

    labels, _ = ndimage.label(candidate)
    edge_labels = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    bgmask = np.isin(labels, edge_labels[edge_labels > 0])

    # soft edge: a 2px band around the background takes partial alpha from its colour distance
    band = ndimage.binary_dilation(bgmask, iterations=2) & ~bgmask
    alpha = np.ones((h, w), np.float32)
    alpha[bgmask] = 0
    alpha[band] = np.clip((dist[band] - 20) / 70, 0, 1)

    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    img = Image.fromarray(rgba, "RGBA")

    # crop to the figure so the feet sit on the bottom edge
    ys, xs = np.where(alpha > 0.1)
    pad = 6
    img = img.crop((max(0, xs.min() - pad), max(0, ys.min() - pad), min(w, xs.max() + pad), min(h, ys.max() + 2)))
    if img.height > max_h:
        img = img.resize((round(img.width * max_h / img.height), max_h), Image.LANCZOS)
    img.save(dst, "WEBP", quality=88, method=6)
    print(f"{dst}: {img.size}")


if __name__ == "__main__":
    cutout(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 1400)
