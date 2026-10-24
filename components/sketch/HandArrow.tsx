"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useId, useMemo, useRef } from "react";
import { arrowHead, markerPath, polyline, smoothThrough } from "@/lib/freehand";
import type { Pt } from "@/lib/rough";

type Props = {
  /** Control points in the arrow's own w x h box; the curve passes through all of them. */
  pts: Pt[];
  w: number;
  h: number;
  color?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  /** When set, plays on this flag instead of on scroll-into-view. */
  play?: boolean;
  head?: boolean;
};

/** A marker arrow that draws itself in. */
export default function HandArrow({ pts, w, h, color = "#1d1d1f", size = 5, className, style, delay = 0, duration = 0.7, play, head = true }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const id = "m" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const shown = play ?? inView;

  const { body, center, heads } = useMemo(() => {
    const line = smoothThrough(pts);
    const [a, b] = arrowHead(line, size * 3.4);
    return {
      body: markerPath(line, size),
      center: polyline(line),
      heads: [markerPath(smoothThrough(a, 6), size * 0.9), markerPath(smoothThrough(b, 6), size * 0.9)],
    };
  }, [pts, size]);

  // Initial values must not depend on reduced motion: the server cannot know it, so markup would mismatch.
  const visible = shown || !!reduce;

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={-50} y={-50} width={w + 100} height={h + 100}>
          <motion.path
            d={center}
            fill="none"
            stroke="#fff"
            strokeWidth={size * 4}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: visible ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { duration, delay, ease: [0.3, 0.7, 0.2, 1] }}
          />
        </mask>
      </defs>
      <path d={body} fill={color} mask={`url(#${id})`} />
      {head &&
        heads.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill={color}
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.12, delay: reduce ? 0 : delay + duration * 0.92 + i * 0.06 }}
          />
        ))}
    </svg>
  );
}
