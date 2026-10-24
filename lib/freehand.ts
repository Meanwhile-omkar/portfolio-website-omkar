import { getStroke } from "perfect-freehand";
import type { Pt } from "./rough";

const avg = (a: number, b: number) => (a + b) / 2;

// From the perfect-freehand README: outline points -> smooth closed SVG path.
function outlineToPath(points: number[][]) {
  const len = points.length;
  if (len < 4) return "";
  let a = points[0];
  let b = points[1];
  const c = points[2];
  let d = `M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${b[0].toFixed(1)},${b[1].toFixed(1)} ${avg(b[0], c[0]).toFixed(1)},${avg(b[1], c[1]).toFixed(1)} T`;
  for (let i = 2; i < len - 1; i++) {
    a = points[i];
    b = points[i + 1];
    d += `${avg(a[0], b[0]).toFixed(1)},${avg(a[1], b[1]).toFixed(1)} `;
  }
  return d + "Z";
}

/** Catmull-Rom through the control points so a handful of points gives a smooth hand-drawn curve. */
export function smoothThrough(pts: Pt[], steps = 14): Pt[] {
  if (pts.length < 3) {
    const [p0, p1] = pts;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps;
      return [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t] as Pt;
    });
  }
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push([
        0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** A marker stroke along the given points, thicker in the middle and tapering at the start. */
export function markerPath(points: Pt[], size = 5) {
  return outlineToPath(
    getStroke(points, { size, thinning: 0.55, smoothing: 0.6, streamline: 0.4, simulatePressure: true, start: { taper: size * 3 }, end: { taper: size } }),
  );
}

export function polyline(points: Pt[]) {
  return points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
}

/** Two short strokes forming an arrowhead at the last point, aligned with the curve's end direction. */
export function arrowHead(points: Pt[], len = 16, spread = 0.5): [Pt[], Pt[]] {
  const end = points[points.length - 1];
  const back = points[Math.max(0, points.length - 4)];
  const ang = Math.atan2(end[1] - back[1], end[0] - back[0]);
  const wing = (s: number): Pt[] => [
    [end[0] - len * Math.cos(ang + s), end[1] - len * Math.sin(ang + s)],
    end,
  ];
  return [wing(spread), wing(-spread)];
}
