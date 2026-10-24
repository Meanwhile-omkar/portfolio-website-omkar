import Doodle from "@/components/sketch/Doodle";
import Sketch from "@/components/sketch/Sketch";

/** A sketched wooden plank with two brackets underneath. */
export function Plank({ width, seed }: { width: number; seed: number }) {
  return (
    <Sketch
      w={width}
      h={40}
      seed={seed}
      className="pointer-events-none absolute"
      style={{ left: -4, top: -4, width: width + 8, height: 48 }}
      shapes={[
        { t: "rect", x: 0, y: 0, w: width, h: 15, o: { fill: "#1d1d1f", hachureGap: 3.6, fillWeight: 1.1, hachureAngle: -8, strokeWidth: 2.4 } },
        { t: "poly", pts: [[60, 15], [86, 15], [60, 38]], o: { strokeWidth: 2 } },
        { t: "poly", pts: [[width - 60, 15], [width - 86, 15], [width - 60, 38]], o: { strokeWidth: 2 } },
      ]}
    />
  );
}

/** Books lying flat, purely decorative. */
export function FlatStack({ seed }: { seed: number }) {
  const books = [
    { w: 150, c: "#18a0fb", x: 6 },
    { w: 134, c: "#ffc700", x: 16 },
    { w: 156, c: "#ee46d3", x: 0 },
  ];
  return (
    <Sketch
      w={160}
      h={84}
      seed={seed}
      className="h-[84px] w-[160px]"
      shapes={books.flatMap((b, i) => [
        { t: "rect" as const, x: b.x, y: i * 28, w: b.w, h: 26, o: { fill: b.c, hachureGap: 5, strokeWidth: 2 } },
        { t: "line" as const, x1: b.x + b.w - 18, y1: i * 28 + 3, x2: b.x + b.w - 18, y2: i * 28 + 23, o: { strokeWidth: 1.4 } },
      ])}
    />
  );
}

export function Bookend({ seed }: { seed: number }) {
  return (
    <Sketch
      w={60}
      h={150}
      seed={seed}
      className="h-[150px] w-[60px]"
      shapes={[{ t: "poly", pts: [[0, 150], [60, 150], [60, 138], [14, 138], [14, 0], [0, 0]], o: { fill: "#1d1d1f", hachureGap: 4, strokeWidth: 2.2 } }]}
    />
  );
}

export function Frame({ seed }: { seed: number }) {
  return (
    <div className="relative h-[120px] w-[100px] rotate-[-4deg]">
      <Sketch
        w={100}
        h={120}
        seed={seed}
        className="absolute inset-0 h-full w-full"
        shapes={[
          { t: "rect", x: 0, y: 0, w: 100, h: 120, o: { fill: "#ffc700", hachureGap: 4, strokeWidth: 2.4 } },
          { t: "rect", x: 12, y: 12, w: 76, h: 96, o: { fill: "#ffffff", fillStyle: "solid", strokeWidth: 1.6 } },
        ]}
      />
      <Doodle name="rocket" color="#ef5533" size={54} className="absolute left-[23px] top-[33px]" />
    </div>
  );
}
