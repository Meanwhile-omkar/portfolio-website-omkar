"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import Sketch from "@/components/sketch/Sketch";

type Props = {
  open: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  label: string;
  prevLabel?: string;
  nextLabel?: string;
  children: React.ReactNode;
};

/**
 * The window a book or record opens into: sits inside the page (not full screen),
 * Esc closes, arrow keys flip, scroll is paused underneath.
 */
export default function SketchWindow({ open, onClose, onPrev, onNext, label, prevLabel = "previous", nextLabel = "next", children }: Props) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement;
    lenis?.stop();
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext?.();
      else if (e.key === "ArrowLeft") onPrev?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      lenis?.start();
      returnTo.current?.focus({ preventScroll: true });
    };
  }, [open, onClose, onNext, onPrev, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button aria-label="Close" tabIndex={-1} className="absolute inset-0 cursor-default bg-[rgba(29,29,31,0.28)] backdrop-blur-[3px]" onClick={onClose} />
          <div className="relative z-10 flex w-full max-w-[1120px] flex-col items-center">
            {children}
            <div className="mt-4 flex w-full max-w-[1120px] items-center justify-between gap-3 px-1">
              <WindowButton onClick={onPrev} disabled={!onPrev} dir="prev">
                {prevLabel}
              </WindowButton>
              <button
                ref={closeRef}
                onClick={onClose}
                className="rounded-full bg-white px-4 py-2 font-note text-[16px] text-ink shadow-paper transition-transform hover:-rotate-2"
              >
                close · esc
              </button>
              <WindowButton onClick={onNext} disabled={!onNext} dir="next">
                {nextLabel}
              </WindowButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WindowButton({ onClick, disabled, dir, children }: { onClick?: () => void; disabled?: boolean; dir: "prev" | "next"; children: React.ReactNode }) {
  const arrow = (
    <Sketch
      w={34}
      h={16}
      seed={dir === "prev" ? 3 : 5}
      className="h-4 w-8"
      shapes={
        dir === "next"
          ? [{ t: "line", x1: 2, y1: 8, x2: 32, y2: 8 }, { t: "poly", pts: [[24, 2], [32, 8], [24, 14]], o: { fill: "#1d1d1f", fillStyle: "solid" } }]
          : [{ t: "line", x1: 2, y1: 8, x2: 32, y2: 8 }, { t: "poly", pts: [[10, 2], [2, 8], [10, 14]], o: { fill: "#1d1d1f", fillStyle: "solid" } }]
      }
    />
  );
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group inline-flex min-w-0 items-center gap-2 rounded-full bg-white px-4 py-2 font-note text-[16px] text-ink shadow-paper transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-0"
    >
      {dir === "prev" && arrow}
      <span className="truncate">{children}</span>
      {dir === "next" && arrow}
    </button>
  );
}
