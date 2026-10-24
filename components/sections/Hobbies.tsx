"use client";

import { Tape } from "@/components/sketch/Paper";
import SectionTitle from "@/components/ui/SectionTitle";
import Marquee from "@/components/ui/Marquee";
import { useLightbox } from "@/components/ui/PhotoStrip";
import { hobbyPhotos } from "@/data/gallery";
import { jitter } from "@/lib/rough";

// Pinterest-style board: columns of two photos at their own shapes, column widths varying,
// each photo bobbing a little while the whole board drifts sideways.
const WIDTHS = [200, 250, 180, 230, 270, 210];
const TAPES = ["#ffc700", "#ee46d3", "#1bc47d", "#18a0fb"];

export default function Hobbies() {
  const lightbox = useLightbox(hobbyPhotos);
  const r = jitter(77);
  const columns: { i: number }[][] = [];
  for (let i = 0; i < hobbyPhotos.length; i += 2) columns.push([{ i }, ...(i + 1 < hobbyPhotos.length ? [{ i: i + 1 }] : [])]);
  const boardWidth = columns.reduce((sum, _, c) => sum + WIDTHS[c % WIDTHS.length] + 40, 0);

  return (
    <section id="hobbies" aria-labelledby="hobbies-title" className="relative scroll-mt-20 overflow-hidden py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionTitle id="hobbies-title" color="#c9ecff" aside="What I do when I'm not building or pitching.">
          Off the clock
        </SectionTitle>
      </div>

      <Marquee duration={boardWidth / 36} className="mt-14" label="Hobby photos">
        {columns.map((col, c) => {
          const width = WIDTHS[c % WIDTHS.length];
          return (
            <div key={c} className="hobby-col flex shrink-0 flex-col gap-8 px-5 pt-6" style={{ ["--w" as string]: `${width}px`, marginTop: c % 2 ? 46 : 0 }}>
              {col.map(({ i }) => {
                const p = hobbyPhotos[i];
                const tilt = Math.round((r() * 2 - 1) * 3.5 * 10) / 10;
                return (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => lightbox.open(i)}
                    aria-label={`Open photo ${i + 1}`}
                    className="bob relative block"
                    style={{ ["--bob-dur" as string]: `${5 + (i % 4)}s`, ["--bob-delay" as string]: `${-i * 0.7}s` }}
                  >
                    <span className="block overflow-hidden rounded-[14px] bg-mist shadow-paper transition-transform duration-300 hover:scale-[1.03]" style={{ transform: `rotate(${tilt}deg)` }}>
                      <img src={p.src} alt={`Off the clock, photo ${i + 1}`} width={width} height={Math.round((width * p.h) / p.w)} loading="lazy" decoding="async" className="block h-auto w-full" />
                    </span>
                    <Tape color={TAPES[i % TAPES.length]} className="-top-3 left-1/2 -translate-x-1/2" style={{ transform: `translateX(-50%) rotate(${tilt * 2}deg)` }} />
                  </button>
                );
              })}
            </div>
          );
        })}
      </Marquee>
      {lightbox.node}
    </section>
  );
}
