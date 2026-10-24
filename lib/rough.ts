import rough from "roughjs";
import type { Options } from "roughjs/bin/core";

// rough.js generator is pure math (no DOM), so sketches render identically on server and client
// as long as every shape carries a fixed seed.
const gen = rough.generator();

export type Pt = [number, number];

export type Shape =
  | { t: "rect"; x: number; y: number; w: number; h: number; o?: Options }
  | { t: "ellipse"; cx: number; cy: number; w: number; h: number; o?: Options }
  | { t: "line"; x1: number; y1: number; x2: number; y2: number; o?: Options }
  | { t: "poly"; pts: Pt[]; o?: Options }
  | { t: "curve"; pts: Pt[]; o?: Options }
  | { t: "path"; d: string; o?: Options };

export type SketchPath = { d: string; stroke: string; strokeWidth: number; fill: string };

export const INK = "#1d1d1f";

const base: Options = {
  stroke: INK,
  strokeWidth: 2,
  roughness: 1.3,
  bowing: 1.1,
  fillStyle: "hachure",
  hachureGap: 6,
  fillWeight: 1.3,
  hachureAngle: -41,
  disableMultiStrokeFill: true,
};

export function sketch(shapes: Shape[], seed = 1): SketchPath[] {
  const out: SketchPath[] = [];
  shapes.forEach((s, i) => {
    const o: Options = { ...base, seed: seed * 97 + i * 13 + 1, ...s.o };
    const d =
      s.t === "rect" ? gen.rectangle(s.x, s.y, s.w, s.h, o)
      : s.t === "ellipse" ? gen.ellipse(s.cx, s.cy, s.w, s.h, o)
      : s.t === "line" ? gen.line(s.x1, s.y1, s.x2, s.y2, o)
      : s.t === "poly" ? gen.polygon(s.pts, o)
      : s.t === "curve" ? gen.curve(s.pts, o)
      : gen.path(s.d, o);
    for (const p of gen.toPaths(d)) {
      // Node and the browser can disagree in the last float digits of trig results; rounding keeps
      // server and client markup identical (and the HTML smaller).
      const rounded = p.d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 100) / 100));
      out.push({ d: rounded, stroke: p.stroke, strokeWidth: p.strokeWidth, fill: p.fill ?? "none" });
    }
  });
  return out;
}

/** Small deterministic PRNG for layout jitter (tilts, offsets) that must match on server and client. */
export function jitter(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}
