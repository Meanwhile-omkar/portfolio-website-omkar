"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import type { Shape } from "@/lib/rough";
import Doodle from "@/components/sketch/Doodle";
import Sketch from "@/components/sketch/Sketch";
import type { CaseStudy } from "@/data/caseStudies";
import { BadgeSticker, Record } from "./Vinyl";

export const SLEEVE = 176;

type Props = {
  study: CaseStudy;
  seed: number;
  tilt: number;
  active: boolean;
  onActivate: (on: boolean) => void;
  onOpen: (e: React.MouseEvent, pointer: string) => void;
};

export default function RecordSleeve({ study, seed, tilt, active, onActivate, onOpen }: Props) {
  const reduce = useReducedMotion();
  const s = SLEEVE;
  const shapes = useMemo<Shape[]>(
    () => [
      { t: "rect", x: 0, y: 0, w: s, h: s, o: { fill: "#ffffff", fillStyle: "solid", strokeWidth: 2.4 } },
      { t: "rect", x: 0, y: 0, w: s, h: s, o: { fill: study.sleeve.color, hachureGap: 5, fillWeight: 1.5, stroke: "transparent", hachureAngle: 30 } },
      { t: "ellipse", cx: s / 2, cy: s * 0.38, w: s * 0.5, h: s * 0.5, o: { fill: "#ffffff", fillStyle: "solid", strokeWidth: 1.8 } },
      { t: "rect", x: 14, y: s * 0.7, w: s - 28, h: s * 0.24, o: { fill: "#ffffff", fillStyle: "solid", strokeWidth: 1.4 } },
    ],
    [s, study.sleeve.color],
  );
  const pointer = useRef("mouse");
  const lifted = active && !reduce;

  return (
    <motion.button
      type="button"
      aria-label={`${study.title}, ${study.badge} at ${study.host}. Open the record.`}
      className="relative block shrink-0 outline-offset-8"
      style={{ width: s, height: s, zIndex: active ? 30 : 1 }}
      initial={false}
      animate={{ rotate: lifted ? 0 : tilt, y: lifted ? -22 : 0 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
      onPointerEnter={(e) => e.pointerType === "mouse" && onActivate(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onActivate(false)}
      onPointerDown={(e) => (pointer.current = e.pointerType)}
      onFocus={() => onActivate(true)}
      onBlur={() => onActivate(false)}
      onClick={(e) => onOpen(e, pointer.current)}
    >
      <motion.span
        className="absolute left-[6%] top-0 block"
        initial={false}
        animate={{ y: lifted ? -s * 0.42 : -4, rotate: lifted ? 40 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <Record size={s * 0.88} color={study.sleeve.color} />
      </motion.span>
      <span className="absolute inset-0 block" style={{ filter: lifted ? "drop-shadow(0 18px 16px rgba(29,29,31,0.25))" : "drop-shadow(0 2px 2px rgba(29,29,31,0.12))" }}>
        <Sketch w={s} h={s} shapes={shapes} seed={seed} className="absolute" style={{ left: -4, top: -4, width: s + 8, height: s + 8 }} />
        <Doodle name={study.sleeve.icon} color={study.sleeve.color} size={s * 0.32} seed={seed} className="absolute" style={{ top: s * 0.22, left: s * 0.34 }} />
        <span className="absolute line-clamp-2 text-center font-marker text-[21px] leading-[0.86] text-ink" style={{ left: 20, top: s * 0.725, width: s - 40 }}>
          {study.title}
        </span>
      </span>
      <BadgeSticker badge={study.badge} size={56} tilt={tilt * -3 - 10} className="absolute -left-4 -top-5" />
    </motion.button>
  );
}
