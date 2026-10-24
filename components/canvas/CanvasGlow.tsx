"use client";

import { useEffect } from "react";

/** Feeds the cursor position to the .dots-lit mask so the grid lights up under the pointer. */
export default function CanvasGlow() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const root = document.documentElement;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--mx", `${e.clientX}px`);
        root.style.setProperty("--my", `${e.clientY}px`);
      });
    };
    const leave = () => {
      root.style.setProperty("--mx", "-999px");
      root.style.setProperty("--my", "-999px");
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <div className="dots-lit" aria-hidden />;
}
