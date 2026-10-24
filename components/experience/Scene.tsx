"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import Doodle from "@/components/sketch/Doodle";
import Sketch from "@/components/sketch/Sketch";
import type { Experience } from "@/data/experience";
import { jitter } from "@/lib/rough";

export const STAGE_W = 1600;
export const STAGE_H = 900;

// Doodle spots around the edges, clear of the text zones and the character.
const SLOTS: [number, number, number][] = [
  [26, 26, 104],
  [580, 34, 78],
  [960, 26, 70],
  [1340, 430, 84],
  [1470, 700, 90],
  [330, 590, 72],
];

// The edge of the wipe: a ragged, slightly slanted vertical line, like the end of a marker stroke.
const EDGE = Array.from({ length: 13 }, (_, i) => {
  const r = jitter(i * 31 + 7);
  return { y: (i / 12) * 100, dx: (r() - 0.5) * 7 - (i / 12) * 9 };
});

function wipePolygon(p: number, fromRight: boolean) {
  // p: 0 -> 1. The edge travels from -20% to 120% so the slant and jitter fully clear the frame.
  const x = -20 + p * 140;
  if (!fromRight) {
    const edge = EDGE.map((e) => `${x + e.dx}% ${e.y}%`).join(", ");
    return `polygon(-30% 0%, ${edge}, -30% 100%)`;
  }
  const edge = EDGE.map((e) => `${100 - x - e.dx}% ${e.y}%`).join(", ");
  return `polygon(130% 0%, ${edge}, 130% 100%)`;
}

/** One company's backdrop. Enters with a marker-stroke wipe over the previous one. */
export function SceneLayer({ exp, dir, first }: { exp: Experience; dir: number; first: boolean }) {
  const reduce = useReducedMotion();
  const p = useMotionValue(first || reduce ? 1 : 0);
  const clipPath = useTransform(p, (v) => (v >= 1 ? "none" : wipePolygon(v, dir < 0)));

  useEffect(() => {
    if (first || reduce) return;
    const controls = animate(p, 1, { duration: 0.85, ease: [0.55, 0.05, 0.25, 1] });
    return () => controls.stop();
  }, [p, first, reduce]);

  return (
    <motion.div className="absolute inset-0" style={{ clipPath }} exit={{ opacity: 0, transition: { delay: 0.85, duration: 0.05 } }}>
      {exp.background ? (
        <Image src={exp.background} alt="" fill sizes="100vw" className="object-cover" priority />
      ) : (
        <Placeholder exp={exp} />
      )}
    </motion.div>
  );
}

function Placeholder({ exp }: { exp: Experience }) {
  const r = jitter(exp.id.length * 17 + 3);
  return (
    <div className="absolute inset-0 bg-white" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(29,29,31,0.14) 1px, transparent 1.4px)", backgroundSize: "24px 24px" }}>
      {/* soft hatched disc behind the character, in the company colour */}
      <Sketch
        w={560}
        h={560}
        seed={exp.id.length}
        className="absolute"
        style={{ left: 520, top: 230, width: 560, height: 560, opacity: 0.55 }}
        shapes={[{ t: "ellipse", cx: 280, cy: 280, w: 540, h: 540, o: { fill: exp.accent, hachureGap: 9, fillWeight: 2.2, stroke: "transparent" } }]}
      />
      {!exp.stickers &&
        SLOTS.map(([x, y, s], i) => {
        const name = exp.doodles[i % exp.doodles.length];
        return (
          <Doodle
            key={i}
            name={name}
            color={exp.accent}
            size={s}
            seed={i + 5}
            className="absolute opacity-80"
            style={{ left: x, top: y, transform: `rotate(${Math.round((r() - 0.5) * 24)}deg)` }}
          />
        );
      })}
    </div>
  );
}
