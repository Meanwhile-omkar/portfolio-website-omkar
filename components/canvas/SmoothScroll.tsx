"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.11, wheelMultiplier: 0.95, anchors: { offset: -24 } }}>
      {children}
    </ReactLenis>
  );
}
