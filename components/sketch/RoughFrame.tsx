"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Options } from "roughjs/bin/core";
import type { Shape } from "@/lib/rough";
import Sketch from "./Sketch";

type Props = {
  children: React.ReactNode;
  className?: string;
  seed?: number;
  shape?: "rect" | "ellipse";
  o?: Options;
  as?: "div" | "section" | "article" | "li" | "figure";
  style?: React.CSSProperties;
};

/** A box with a hand-drawn outline (and optional hatched fill) that follows its content size. */
export default function RoughFrame({ children, className = "", seed = 1, shape = "rect", o, as: Tag = "div", style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      setSize((s) => (s && s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shapes = useMemo<Shape[]>(() => {
    if (!size) return [];
    const { w, h } = size;
    return shape === "ellipse"
      ? [{ t: "ellipse", cx: w / 2, cy: h / 2, w: w + 10, h: h + 6, o }]
      : [{ t: "rect", x: 1, y: 1, w: w - 2, h: h - 2, o }];
  }, [size, shape, o]);

  return (
    <Tag ref={ref as React.Ref<never>} className={`relative ${className}`} style={style}>
      {size && (
        <Sketch
          w={size.w}
          h={size.h}
          shapes={shapes}
          seed={seed}
          className="pointer-events-none absolute"
          style={{ left: -4, top: -4, width: size.w + 8, height: size.h + 8 }}
        />
      )}
      <div className="relative">{children}</div>
    </Tag>
  );
}
