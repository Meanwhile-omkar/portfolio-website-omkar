"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type Box = { x: number; y: number; w: number; h: number };
type Slot = Box & { tilt: number };

// Candidate spots on the 1600x900 stage, best first. They all sit in open canvas, never
// beside the character. Which ones get used depends on how much text this slide has.
const SLOTS: Slot[] = [
  { x: 96, y: 590, w: 220, h: 180, tilt: -6 }, // under "what I did", left
  { x: 1010, y: 480, w: 250, h: 150, tilt: 5 }, // right column, between the company info and "liked most"
  { x: 1370, y: 26, w: 175, h: 160, tilt: 7 }, // top-right corner, beside the logo
  { x: 1120, y: 500, w: 190, h: 115, tilt: -5 }, // right column gap, smaller fallback
  { x: 330, y: 600, w: 200, h: 170, tilt: 6 }, // under "what I did", right
  { x: 280, y: 2, w: 200, h: 128, tilt: -7 }, // top band, left
  { x: 1040, y: 640, w: 280, h: 220, tilt: -4 }, // bottom right (only free when there is no "liked most")
  { x: 420, y: 2, w: 143, h: 126, tilt: 5 }, // top band, middle (stays left of the head)
];

// Areas that are always taken: the character (and the air above the head, so nothing looks
// like it's sitting on it), the exit button, the dot rail, the next button.
const FIXED: Box[] = [
  { x: 585, y: 0, w: 430, h: 900 },
  { x: 0, y: 0, w: 250, h: 85 },
  { x: 1530, y: 300, w: 70, h: 340 }, // the dot rail
  { x: 560, y: 835, w: 480, h: 65 },
];

const GAP = 18;
const hit = (a: Box, b: Box) => a.x < b.x + b.w + GAP && b.x < a.x + a.w + GAP && a.y < b.y + b.h + GAP && b.y < a.y + a.h + GAP;

/**
 * Stickers for one slide. Measures the slide's text blocks (anything marked data-zone inside
 * the same stage) and drops each sticker into the first open slot, shrinking it if the gap is tight.
 */
export default function StickerLayer({ stickers, rootRef, playDelay }: { stickers: string[]; rootRef: React.RefObject<HTMLDivElement | null>; playDelay: number }) {
  const reduce = useReducedMotion();
  const [placed, setPlaced] = useState<{ src: string; box: Slot }[]>([]);

  useEffect(() => {
    // The parent's ref is attached after this child's effects, so measure on the next frame.
    let raf = 0;
    let alive = true;
    const place = () => {
      const root = rootRef.current;
      if (!root || !alive) return;
      const rr = root.getBoundingClientRect();
      const k = rr.width / 1600 || 1;
      const taken: Box[] = [
        ...FIXED,
        ...[...root.querySelectorAll<HTMLElement>("[data-zone]")].map((el) => {
          const r = el.getBoundingClientRect();
          return { x: (r.left - rr.left) / k, y: (r.top - rr.top) / k, w: r.width / k, h: r.height / k };
        }),
      ];
      const out: { src: string; box: Slot }[] = [];
      for (const slot of SLOTS) {
        if (out.length >= stickers.length) break;
        for (const f of [1, 0.82, 0.66]) {
          const w = slot.w * f;
          const h = slot.h * f;
          const box = { ...slot, x: slot.x + (slot.w - w) / 2, y: slot.y + (slot.h - h) / 2, w, h };
          if (taken.every((t) => !hit(box, t))) {
            out.push({ src: stickers[out.length], box });
            taken.push(box);
            break;
          }
        }
      }
      setPlaced(out);
    };
    raf = requestAnimationFrame(place);
    // fonts can change text height after first paint
    document.fonts?.ready.then(() => requestAnimationFrame(place));
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [stickers, rootRef]);

  return (
    <>
      {placed.map(({ src, box }, i) => (
        <motion.div
          key={src}
          className="pointer-events-none absolute"
          style={{ left: box.x, top: box.y, width: box.w, height: box.h }}
          initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: box.tilt * 2 }}
          animate={{ opacity: 1, scale: 1, rotate: box.tilt }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ delay: reduce ? 0 : playDelay + i * 0.08, type: "spring", stiffness: 260, damping: 18 }}
        >
          <div className="bob relative h-full w-full" style={{ ["--bob-dur" as string]: `${5 + (i % 3)}s`, ["--bob-delay" as string]: `${-i * 0.8}s` }}>
            <Image src={src} alt="" fill sizes="280px" className="object-contain drop-shadow-[0_6px_8px_rgba(29,29,31,0.18)]" />
          </div>
        </motion.div>
      ))}
    </>
  );
}
