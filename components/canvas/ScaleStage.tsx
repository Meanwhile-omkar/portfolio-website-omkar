"use client";

import { useLayoutEffect, useRef, useState } from "react";

type Props = {
  width: number;
  height: number;
  children: React.ReactNode;
  /** "width": fill the parent width (height follows). "contain": fit inside the parent box. */
  fit?: "width" | "contain";
  /** Never scale above this (keeps desktop at 1:1 on wide screens). */
  maxScale?: number;
  className?: string;
};

/**
 * Lays out children on a fixed design canvas and scales it to fit, so phones see the
 * exact desktop composition, only smaller (Omkar's call for the two big sections).
 */
export default function ScaleStage({ width, height, children, fit = "width", maxScale = 1, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const s = fit === "width" ? el.clientWidth / width : Math.min(el.clientWidth / width, el.clientHeight / height);
      setScale(Math.min(maxScale, s));
      setReady(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height, fit, maxScale]);

  return (
    <div
      ref={ref}
      className={`relative ${fit === "contain" ? "h-full w-full" : "w-full"} ${className}`}
      style={fit === "width" ? { height: height * scale } : undefined}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width,
          height,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "50% 50%",
          visibility: ready ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
