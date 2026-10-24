"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import type { Shape } from "@/lib/rough";
import Doodle from "@/components/sketch/Doodle";
import Sketch from "@/components/sketch/Sketch";
import type { Project } from "@/data/projects";

type Props = {
  project: Project;
  seed: number;
  lean?: number;
  active: boolean;
  onActivate: (on: boolean) => void;
  onOpen: (e: React.MouseEvent | React.KeyboardEvent, pointer: string) => void;
};

export default function BookSpine({ project, seed, lean = 0, active, onActivate, onOpen }: Props) {
  const { width: w, height: h, color, icon } = project.spine;
  const reduce = useReducedMotion();

  const shapes = useMemo<Shape[]>(
    () => [
      { t: "rect", x: 0, y: 0, w, h, o: { fill: color, hachureGap: 4.5, fillWeight: 1.6, strokeWidth: 2.4 } },
      { t: "line", x1: 4, y1: 18, x2: w - 4, y2: 18, o: { strokeWidth: 1.6 } },
      { t: "line", x1: 4, y1: 25, x2: w - 4, y2: 25, o: { strokeWidth: 1.2 } },
      { t: "rect", x: 12, y: 38, w: w - 24, h: h - 132, o: { fill: "#ffffff", fillStyle: "solid", strokeWidth: 1.8 } },
      { t: "ellipse", cx: w / 2, cy: h - 50, w: w * 0.62, h: w * 0.62, o: { fill: "#ffffff", fillStyle: "solid", strokeWidth: 1.8 } },
      { t: "line", x1: 4, y1: h - 12, x2: w - 4, y2: h - 12, o: { strokeWidth: 1.4 } },
    ],
    [w, h, color],
  );

  const pointer = useRef("mouse");

  return (
    <motion.button
      type="button"
      aria-label={`${project.name}: ${project.tagline}. Open the book.`}
      className="relative block shrink-0 outline-offset-8"
      style={{ width: w, height: h, transformOrigin: lean > 0 ? "100% 100%" : "0% 100%", zIndex: active ? 20 : 1 }}
      initial={false}
      animate={
        active && !reduce
          ? { rotate: 0, y: -30, scale: 1.05, filter: "drop-shadow(0 22px 18px rgba(29,29,31,0.28))" }
          : { rotate: lean, y: 0, scale: 1, filter: "drop-shadow(0 0px 0px rgba(29,29,31,0))" }
      }
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      onPointerEnter={(e) => e.pointerType === "mouse" && onActivate(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onActivate(false)}
      onPointerDown={(e) => (pointer.current = e.pointerType)}
      onFocus={() => onActivate(true)}
      onBlur={() => onActivate(false)}
      onClick={(e) => onOpen(e, pointer.current)}
    >
      <Sketch w={w} h={h} shapes={shapes} seed={seed} className="absolute" style={{ left: -4, top: -4, width: w + 8, height: h + 8 }} />
      <span
        className="absolute left-1/2 top-[46px] flex -translate-x-1/2 items-center justify-center text-center font-marker leading-[0.9] text-ink"
        style={{ writingMode: "vertical-rl", height: h - 148, fontSize: Math.min(34, w * 0.36) }}
      >
        {project.name}
      </span>
      <Doodle name={icon} color={color} size={w * 0.46} seed={seed} className="absolute left-1/2 -translate-x-1/2" style={{ top: h - 50 - w * 0.23 }} />
    </motion.button>
  );
}
