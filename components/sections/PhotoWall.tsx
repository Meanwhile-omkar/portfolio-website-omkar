"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Polaroid } from "@/components/sketch/Paper";
import Marquee from "@/components/ui/Marquee";
import type { Photo } from "@/data/gallery";
import { jitter } from "@/lib/rough";

const TAPES = ["#18a0fb", "#ffc700", "#ee46d3", "#1bc47d"];
const RATIOS = ["1 / 1", "4 / 5", "4 / 3"];
const WIDTHS: Record<string, number> = { "1 / 1": 230, "4 / 5": 210, "4 / 3": 290 };

/**
 * Taped polaroids drifting past in two rows going opposite ways, so the wall can grow
 * without the page getting longer. Click one to see it large.
 */
export default function PhotoWall({ photos, seed = 5 }: { photos: Photo[]; seed?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const r = jitter(seed);
  const tilts = photos.map(() => Math.round((r() * 2 - 1) * 4 * 10) / 10);
  const rows = [photos.map((p, i) => ({ p, i })).filter((_, k) => k % 2 === 0), photos.map((p, i) => ({ p, i })).filter((_, k) => k % 2 === 1)];

  const close = useCallback(() => setOpen(null), []);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, photos.length]);

  return (
    <>
      <div className="mt-20 space-y-6">
        {rows.map((row, ri) => (
          <Marquee key={ri} duration={Math.max(40, row.length * 9)} reverse={ri === 1} label={ri ? undefined : "Photos from competitions and hackathons"}>
            {row.map(({ p, i }) => {
              const ratio = RATIOS[i % RATIOS.length];
              return (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => setOpen(i)}
                  className="mx-4 block shrink-0 py-5 transition-transform duration-300 hover:-translate-y-1.5"
                  style={{ width: WIDTHS[ratio] }}
                  aria-label={`Open photo: ${p.caption}`}
                >
                  <Polaroid src={p.src} alt={p.alt} caption={p.caption} tilt={tilts[i]} tape={TAPES[i % TAPES.length]} ratio={ratio} sizes="300px" />
                </button>
              );
            })}
          </Marquee>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={photos[open].caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button aria-label="Close photo" className="absolute inset-0 bg-[rgba(29,29,31,0.55)] backdrop-blur-[3px]" onClick={close} />
            <motion.figure
              key={open}
              className="relative z-10 bg-white p-3 pb-4 shadow-lift"
              initial={{ scale: 0.92, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
            >
              <div className="relative h-[min(72vh,760px)] w-[min(86vw,1100px)]">
                <Image src={photos[open].src} alt={photos[open].alt} fill sizes="90vw" className="object-contain" />
              </div>
              <figcaption className="pt-3 text-center font-note text-[18px] text-ink">{photos[open].caption}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
