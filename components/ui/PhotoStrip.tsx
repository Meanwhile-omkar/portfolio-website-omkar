"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Tape } from "@/components/sketch/Paper";
import Marquee from "@/components/ui/Marquee";
import type { Photo } from "@/data/gallery";
import { jitter } from "@/lib/rough";

const TAPES = ["#18a0fb", "#ffc700", "#ee46d3", "#1bc47d"];
const PX_PER_SECOND = 42;

/** A taped print at the photo's own shape: row height (--row-h, shorter on phones), width from the real aspect ratio. */
export function Print({ photo, height, tilt, tape, alt, onOpen }: { photo: Photo; height: number; tilt: number; tape: string; alt: string; onOpen?: () => void }) {
  const width = Math.round((height * photo.w) / photo.h);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open photo: ${alt}`}
      className="relative block shrink-0 bg-white p-2 shadow-paper transition-transform duration-300 hover:-translate-y-1.5"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <Tape color={tape} className="-top-3 left-1/2 w-20 -translate-x-1/2 rotate-[4deg]" />
      {/* plain img: these are already sized WebPs, so no runtime image service is needed */}
      <img
        src={photo.src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="block bg-mist"
        style={{ height: "var(--row-h)", width: "auto", aspectRatio: `${photo.w} / ${photo.h}` }}
      />
    </button>
  );
}

/** Photos drifting past in rows that never stop. Click one to see it large. */
export default function PhotoStrip({ photos, rows = 2, height = 250, alt, seed = 5, reverseFirst = false }: { photos: Photo[]; rows?: number; height?: number; alt: string; seed?: number; reverseFirst?: boolean }) {
  const lightbox = useLightbox(photos);
  const r = jitter(seed);
  const tilts = photos.map(() => Math.round((r() * 2 - 1) * 3 * 10) / 10);
  const lines = Array.from({ length: rows }, (_, k) => photos.map((p, i) => ({ p, i })).filter((_, i) => i % rows === k));

  return (
    <>
      <div className="photo-strip space-y-4" style={{ ["--row-h-d" as string]: `${height}px`, ["--row-h-m" as string]: `${Math.round(height * 0.64)}px` }}>
        {lines.map((line, k) => {
          const width = line.reduce((sum, { p }) => sum + (height * p.w) / p.h + 48, 0);
          return (
            <Marquee key={k} duration={width / PX_PER_SECOND} reverse={(k % 2 === 1) !== reverseFirst} label={k ? undefined : alt}>
              {line.map(({ p, i }) => (
                <div key={p.src} className="px-4 py-5">
                  <Print photo={p} height={height} tilt={tilts[i]} tape={TAPES[i % TAPES.length]} alt={`${alt}, photo ${i + 1}`} onOpen={() => lightbox.open(i)} />
                </div>
              ))}
            </Marquee>
          );
        })}
      </div>
      {lightbox.node}
    </>
  );
}

export function useLightbox(photos: Photo[]) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, photos.length]);

  const node = (
    <AnimatePresence>
      {index !== null && (
        <motion.div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Photo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close photo" className="absolute inset-0 bg-[rgba(29,29,31,0.6)] backdrop-blur-[3px]" onClick={close} />
          <motion.img
            key={index}
            src={photos[index].full}
            alt=""
            className="relative z-10 max-h-[86vh] max-w-[92vw] bg-white object-contain p-2.5 shadow-lift"
            style={{ aspectRatio: `${photos[index].w} / ${photos[index].h}` }}
            initial={{ scale: 0.94, rotate: -1.5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          />
          <p className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/90 px-4 py-1.5 font-note text-[15px] text-ink">
            {index + 1} / {photos.length} · arrows to browse · esc to close
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { open: setIndex, node };
}
