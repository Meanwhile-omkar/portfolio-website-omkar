import type { Options } from "roughjs/bin/core";
import type { Pt, Shape } from "@/lib/rough";

// Doodle icons in the style of the reference infographic packs: wobbly ink outline,
// hatched colour fill. Every icon lives in a 100x100 box. "A" is replaced by the accent colour.
export const ACCENT = "A";

const f = (fill: string = ACCENT, more: Options = {}): Options => ({ fill, ...more });
const solid = (fill: string): Options => ({ fill, fillStyle: "solid" });
const R = (x: number, y: number, w: number, h: number, o?: Options): Shape => ({ t: "rect", x, y, w, h, o });
const E = (cx: number, cy: number, w: number, h: number, o?: Options): Shape => ({ t: "ellipse", cx, cy, w, h, o });
const L = (x1: number, y1: number, x2: number, y2: number, o?: Options): Shape => ({ t: "line", x1, y1, x2, y2, o });
const P = (pts: Pt[], o?: Options): Shape => ({ t: "poly", pts, o });
const C = (pts: Pt[], o?: Options): Shape => ({ t: "curve", pts, o });
const D = (d: string, o?: Options): Shape => ({ t: "path", d, o });

function ring(cx: number, cy: number, r1: number, r2: number, n: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? r2 : r1;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

function gear(cx: number, cy: number, r: number, teeth = 8): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = (Math.PI * 2 * i) / teeth;
    const w = Math.PI / teeth / 1.6;
    for (const [da, rr] of [[-w * 1.3, r], [-w, r + 9], [w, r + 9], [w * 1.3, r]] as const) {
      pts.push([cx + rr * Math.cos(a + da), cy + rr * Math.sin(a + da)]);
    }
  }
  return pts;
}

export const doodles = {
  bulb: [
    E(50, 40, 52, 56, f()),
    R(39, 66, 22, 16, f("#ffffff", { fillStyle: "solid" })),
    L(41, 88, 59, 88),
    L(18, 12, 25, 19), L(82, 12, 75, 19), L(8, 40, 16, 40), L(92, 40, 84, 40),
  ],
  rocket: [
    D("M50 6 C67 22 69 50 63 70 L37 70 C31 50 33 22 50 6 Z", f()),
    E(50, 36, 15, 15, solid("#ffffff")),
    P([[37, 54], [24, 74], [37, 70]], f("#1d1d1f")),
    P([[63, 54], [76, 74], [63, 70]], f("#1d1d1f")),
    P([[41, 72], [50, 94], [59, 72]], f("#ef5533")),
  ],
  gear: [P(gear(50, 50, 30), f()), E(50, 50, 22, 22, solid("#ffffff"))],
  magnifier: [E(42, 42, 52, 52, f()), L(61, 61, 88, 88, { strokeWidth: 6 })],
  trophy: [
    D("M30 12 L70 12 L66 42 C63 56 37 56 34 42 Z", f()),
    C([[31, 18], [15, 20], [19, 36], [34, 40]]),
    C([[69, 18], [85, 20], [81, 36], [66, 40]]),
    R(45, 54, 10, 15),
    R(31, 70, 38, 13, f("#1d1d1f")),
  ],
  plant: [
    D("M50 64 C40 42 26 38 16 30 C30 27 46 36 50 64", f("#1bc47d")),
    D("M50 64 C60 40 74 32 86 24 C73 23 55 34 50 64", f("#1bc47d")),
    D("M50 64 C47 42 49 24 54 8 C61 26 57 46 50 64", f("#1bc47d")),
    P([[31, 62], [69, 62], [63, 94], [37, 94]], f()),
  ],
  mug: [
    R(24, 32, 42, 54, f()),
    E(70, 56, 24, 28),
    C([[36, 24], [32, 16], [38, 8]]),
    C([[50, 24], [46, 16], [52, 8]]),
  ],
  star: [P(ring(50, 52, 44, 19, 5), f())],
  plane: [P([[6, 50], [94, 12], [62, 90], [47, 61]], f("#ffffff", { fillStyle: "solid" })), L(47, 61, 94, 12), P([[47, 61], [94, 12], [40, 82]], f())],
  scales: [
    L(50, 12, 50, 86), L(14, 26, 86, 26), L(30, 88, 70, 88, { strokeWidth: 3 }),
    L(14, 26, 4, 56), L(14, 26, 26, 56), L(86, 26, 74, 56), L(86, 26, 96, 56),
    D("M2 56 Q15 72 28 56 Z", f()), D("M72 56 Q85 72 98 56 Z", f()),
  ],
  cricket: [
    P([[18, 84], [26, 92], [72, 42], [64, 34]], f()),
    L(68, 38, 88, 14, { strokeWidth: 5 }),
    E(28, 28, 20, 20, f("#ef5533")),
  ],
  chat: [D("M12 18 H88 V64 H44 L26 84 L30 64 H12 Z", f()), L(26, 34, 74, 34), L(26, 47, 60, 47)],
  mic: [
    E(50, 26, 30, 38, f()),
    C([[28, 34], [30, 56], [50, 62], [70, 56], [72, 34]]),
    L(50, 62, 50, 82), L(32, 86, 68, 86, { strokeWidth: 3 }),
  ],
  doc: [
    P([[22, 8], [64, 8], [80, 24], [80, 92], [22, 92]], f("#ffffff", { fillStyle: "solid" })),
    P([[64, 8], [64, 24], [80, 24]]),
    L(32, 40, 70, 40), L(32, 54, 70, 54), L(32, 68, 56, 68),
    R(30, 18, 24, 12, f()),
  ],
  cap: [
    D("M28 46 L28 68 Q50 80 72 68 L72 46", f("#1d1d1f")),
    P([[6, 38], [50, 18], [94, 38], [50, 58]], f()),
    L(86, 42, 86, 68), E(86, 72, 7, 9, solid("#1d1d1f")),
  ],
  layers: [
    P([[50, 58], [92, 72], [50, 88], [8, 72]], f("#18a0fb")),
    P([[50, 38], [92, 52], [50, 68], [8, 52]], f("#ffc700")),
    P([[50, 16], [92, 30], [50, 46], [8, 30]], f()),
  ],
  org: [
    R(36, 6, 28, 20, f()), R(6, 66, 26, 20), R(37, 66, 26, 20), R(68, 66, 26, 20),
    L(50, 26, 50, 46), L(19, 46, 81, 46), L(19, 46, 19, 66), L(50, 46, 50, 66), L(81, 46, 81, 66),
  ],
  music: [
    P([[40, 22], [82, 10], [82, 24], [40, 36]], f("#1d1d1f")),
    L(40, 22, 40, 74), L(82, 10, 82, 64),
    E(30, 76, 24, 17, f()), E(72, 66, 24, 17, f()),
  ],
  pie: [
    E(50, 50, 82, 82, f("#ffc700", { hachureAngle: 60 })),
    D("M50 50 L50 9 A41 41 0 0 1 89 62 Z", f()),
    D("M50 50 L89 62 A41 41 0 0 1 40 90 Z", f("#18a0fb", { hachureAngle: 10 })),
  ],
  cart: [
    D("M6 18 L22 18 L33 66 L82 66"),
    P([[27, 30], [90, 30], [82, 58], [32, 58]], f()),
    E(40, 80, 13, 13, solid("#1d1d1f")), E(76, 80, 13, 13, solid("#1d1d1f")),
  ],
  pin: [
    D("M50 94 C30 66 20 52 20 38 A30 30 0 0 1 80 38 C80 52 70 66 50 94 Z", f()),
    E(50, 38, 20, 20, solid("#ffffff")),
  ],
  calculator: [
    R(22, 6, 56, 88, f()),
    R(31, 15, 38, 20, solid("#ffffff")),
    R(31, 46, 9, 9), R(46, 46, 9, 9), R(61, 46, 9, 9),
    R(31, 62, 9, 9), R(46, 62, 9, 9), R(61, 62, 9, 24, solid("#1d1d1f")),
    R(31, 77, 24, 9),
  ],
  venn: [E(36, 50, 56, 56, f()), E(64, 50, 56, 56, f("#18a0fb", { hachureAngle: 40 }))],
  steps: [
    P([[8, 92], [8, 72], [32, 72], [32, 52], [56, 52], [56, 32], [80, 32], [80, 92]], f()),
    D("M70 22 L88 6"), D("M76 6 L88 6 L88 18"),
  ],
  eye: [
    D("M4 50 Q50 4 96 50 Q50 96 4 50 Z", f("#ffffff", { fillStyle: "solid" })),
    E(50, 50, 36, 36, f()),
    E(50, 50, 13, 13, solid("#1d1d1f")),
    C([[14, 50], [22, 44], [26, 48]], { stroke: "#ef5533", strokeWidth: 1.4 }),
    C([[86, 50], [78, 56], [74, 52]], { stroke: "#ef5533", strokeWidth: 1.4 }),
  ],
  microscope: [
    P([[38, 14], [52, 8], [70, 50], [56, 56]], f()),
    C([[62, 56], [74, 68], [66, 82], [44, 84]]),
    L(34, 68, 70, 68), L(18, 90, 82, 90, { strokeWidth: 3 }), L(44, 84, 44, 90),
  ],
  drop: [D("M50 6 C66 32 78 48 78 62 A28 28 0 0 1 22 62 C22 48 34 32 50 6 Z", f())],
  pulse: [D("M2 54 L28 54 L36 32 L47 78 L58 18 L66 54 L98 54", { stroke: ACCENT, strokeWidth: 3.5 })],
  factory: [
    P([[6, 92], [6, 50], [28, 62], [28, 50], [50, 62], [50, 50], [72, 62], [72, 18], [90, 18], [90, 92]], f()),
    R(16, 72, 10, 10, solid("#ffffff")), R(38, 72, 10, 10, solid("#ffffff")), R(60, 72, 10, 10, solid("#ffffff")),
    C([[80, 14], [74, 8], [82, 2]]),
  ],
  blueprint: [
    R(8, 14, 84, 70, f("#18a0fb", { fillStyle: "solid" })),
    L(8, 36, 92, 36, { stroke: "#ffffff" }), L(8, 60, 92, 60, { stroke: "#ffffff" }),
    L(36, 14, 36, 84, { stroke: "#ffffff" }), L(64, 14, 64, 84, { stroke: "#ffffff" }),
    R(44, 42, 34, 30, { stroke: "#ffffff", strokeWidth: 2.5 }),
  ],
  candles: [
    L(22, 14, 22, 86), R(14, 30, 16, 36, f("#1bc47d")),
    L(50, 6, 50, 70), R(42, 18, 16, 34, f("#ef5533")),
    L(78, 24, 78, 94), R(70, 36, 16, 44, f("#1bc47d")),
  ],
  rise: [D("M8 82 L34 54 L52 66 L88 24", { strokeWidth: 4 }), D("M70 22 L90 22 L88 42", { strokeWidth: 4 }), L(8, 92, 92, 92, { strokeWidth: 1.5 })],
  phone: [
    R(28, 4, 44, 92, f("#ffffff", { fillStyle: "solid" })),
    R(34, 14, 32, 64, f()),
    E(50, 87, 8, 8),
  ],
  coin: [E(50, 50, 70, 70, f()), E(50, 50, 48, 48), L(50, 36, 50, 64, { strokeWidth: 3 })],
  bank: [
    P([[8, 34], [50, 8], [92, 34]], f()),
    L(20, 40, 20, 78), L(40, 40, 40, 78), L(60, 40, 60, 78), L(80, 40, 80, 78),
    R(8, 80, 84, 10, f("#1d1d1f")),
  ],
  shield: [
    D("M50 6 L86 18 C86 56 72 78 50 94 C28 78 14 56 14 18 Z", f()),
    D("M33 50 L46 63 L69 36", { strokeWidth: 4 }),
  ],
  ticket: [
    P([[8, 28], [92, 28], [92, 43], [85, 50], [92, 57], [92, 72], [8, 72], [8, 57], [15, 50], [8, 43]], f()),
    L(30, 30, 30, 70, { strokeLineDash: [4, 4] }),
  ],
  spotlight: [
    P([[34, 22], [66, 22], [96, 94], [4, 94]], f("#ffc700", { hachureGap: 9 })),
    R(32, 4, 36, 18, f("#1d1d1f")),
  ],
  speaker: [R(24, 6, 52, 88, f()), E(50, 64, 32, 32, solid("#ffffff")), E(50, 64, 12, 12, solid("#1d1d1f")), E(50, 27, 14, 14, solid("#ffffff"))],
  mask: [
    D("M18 16 Q50 6 82 16 Q86 62 50 92 Q14 62 18 16 Z", f()),
    C([[32, 56], [50, 72], [68, 56]], { strokeWidth: 3 }),
    C([[28, 36], [36, 30], [44, 36]]), C([[56, 36], [64, 30], [72, 36]]),
  ],
  college: [
    P([[6, 40], [50, 10], [94, 40]], f()),
    R(12, 40, 76, 48),
    L(26, 46, 26, 82), L(40, 46, 40, 82), L(60, 46, 60, 82), L(74, 46, 74, 82),
    L(6, 90, 94, 90, { strokeWidth: 3 }),
  ],
  tag: [P([[32, 14], [90, 14], [90, 62], [32, 62], [10, 38]], f()), E(28, 38, 9, 9, solid("#ffffff"))],
  lock: [D("M33 44 V30 A17 17 0 0 1 67 30 V44", { strokeWidth: 4 }), R(22, 44, 56, 46, f()), E(50, 64, 9, 9, solid("#1d1d1f"))],
  flow: [
    R(30, 4, 40, 18, f()), P([[50, 36], [72, 50], [50, 64], [28, 50]], f("#ffc700")), R(30, 78, 40, 18, f("#18a0fb")),
    L(50, 22, 50, 36), L(50, 64, 50, 78),
  ],
  people: [
    E(32, 30, 24, 24, f()), D("M10 82 Q10 52 32 52 Q54 52 54 82 Z", f()),
    E(70, 34, 22, 22, f("#18a0fb")), D("M50 84 Q50 58 70 58 Q90 58 90 84 Z", f("#18a0fb")),
  ],
  headset: [C([[18, 60], [16, 22], [50, 12], [84, 22], [82, 60]], { strokeWidth: 4 }), R(10, 52, 16, 28, f()), R(74, 52, 16, 28, f())],
  stack: [R(14, 62, 72, 16, f("#18a0fb")), R(20, 44, 64, 16, f()), R(10, 26, 70, 16, f("#ffc700")), R(18, 10, 60, 14, f("#1bc47d"))],
  sparkle: [P(ring(50, 50, 44, 10, 4), f())],
  branch: [
    L(28, 28, 28, 72, { strokeWidth: 3 }),
    C([[28, 62], [30, 46], [62, 44]], { strokeWidth: 3 }),
    E(28, 20, 18, 18, f()), E(28, 80, 18, 18, f()), E(72, 42, 20, 20, f("#ef5533")),
  ],
  battery: [
    R(14, 26, 66, 48, f("#1bc47d")),
    R(80, 40, 8, 20, solid("#1d1d1f")),
    P([[52, 32], [36, 54], [48, 54], [42, 70], [60, 46], [48, 46]], solid("#ffc700")),
  ],
  planet: [
    E(50, 50, 52, 52, f()),
    D("M8 62 C20 44 86 30 94 38 C100 46 34 72 8 62 Z", { strokeWidth: 2.4 }),
    P(ring(16, 18, 9, 3, 4), solid("#1d1d1f")), P(ring(84, 82, 7, 2.5, 4), solid("#1d1d1f")),
  ],
} satisfies Record<string, Shape[]>;

export type DoodleName = keyof typeof doodles;
