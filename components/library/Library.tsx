"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import ScaleStage from "@/components/canvas/ScaleStage";
import Doodle from "@/components/sketch/Doodle";
import Sketch from "@/components/sketch/Sketch";
import SectionTitle from "@/components/ui/SectionTitle";
import SketchWindow from "@/components/ui/SketchWindow";
import { caseStudies } from "@/data/caseStudies";
import { projects } from "@/data/projects";
import { jitter } from "@/lib/rough";
import BookSpine from "./BookSpine";
import BookWindow from "./BookWindow";
import RecordSleeve from "./RecordSleeve";
import RecordWindow from "./RecordWindow";
import { Bookend, FlatStack, Frame, Plank } from "./ShelfBits";

const W = 1200;
// Books keep the data order (Omkar's priority). The top shelf holds the first six.
const books = projects;
const TOP_SHELF = 6;
const rnd = jitter(42);
const sleeveTilts = caseStudies.map(() => Math.round((rnd() * 2 - 1) * 4));

// Records are grouped by how the competition went, one shelf per group.
const indexed = caseStudies.map((s, i) => ({ s, i }));
const recordShelves = [
  { label: "won it", items: indexed.filter(({ s }) => s.badge === "Winner" || s.badge === "Runner-up"), x: 0, y: 920, w: 600, tilt: -0.6, flip: false, hanging: false },
  { label: "top finishes", items: indexed.filter(({ s }) => s.badge === "Top 5" || s.badge === "Top 10"), x: 600, y: 1100, w: 600, tilt: 0.7, flip: true, hanging: false },
  { label: "made the finals", items: indexed.filter(({ s }) => s.badge === "Finalist" || s.badge === "Recognised"), x: 40, y: 1450, w: 620, tilt: -1, flip: false, hanging: true },
];

type Open = { kind: "book" | "record"; index: number; dir: number; first: boolean } | null;

export default function Library() {
  const [active, setActive] = useState<string | null>(null);
  const armed = useRef<string | null>(null);
  const [open, setOpen] = useState<Open>(null);

  const activate = (id: string) => (on: boolean) => setActive((cur) => (on ? id : cur === id ? null : cur));

  // Mouse: hover lifts, click opens. Touch: first tap lifts, second tap opens.
  const tryOpen = (kind: "book" | "record", index: number, id: string, pointer: string) => {
    if (pointer === "touch" && armed.current !== id) {
      armed.current = id;
      setActive(id);
      return;
    }
    armed.current = null;
    setOpen({ kind, index, dir: 1, first: true });
  };

  const total = open?.kind === "book" ? books.length : caseStudies.length;
  const go = useCallback(
    (d: number) => setOpen((o) => (o ? { ...o, index: (o.index + d + total) % total, dir: d, first: false } : o)),
    [total],
  );
  const close = useCallback(() => {
    setOpen(null);
    setActive(null);
  }, []);
  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  const neighbour = (d: number) => {
    if (!open) return "";
    const i = (open.index + d + total) % total;
    return open.kind === "book" ? books[i].name : caseStudies[i].title;
  };

  const shelf = (row: "top" | "bottom") => books.map((p, i) => ({ p, i })).filter(({ i }) => (row === "top" ? i < TOP_SHELF : i >= TOP_SHELF));

  return (
    <section id="library" aria-labelledby="library-title" className="relative scroll-mt-20 py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionTitle id="library-title" color="#c9ecff" aside="Hover a book or a record to see what it is. Click to open it.">
          The library
        </SectionTitle>
      </div>

      <div className="mx-auto mt-14 max-w-[1200px] px-3 sm:px-5">
        <ScaleStage width={W} height={1800}>
          {/* ── Shelf 1: the strongest six ── */}
          <div className="absolute inset-x-0 top-0 h-[400px]">
            <div className="absolute bottom-[26px] left-[40px] flex items-end gap-[14px]">
              <Doodle name="plant" color="#ef5533" size={128} seed={2} className="mr-6" />
              {shelf("top").map(({ p, i }, k) => (
                <BookSlot key={p.id} id={p.id} active={active === p.id} flip={false} teaser={p.teaser} name={p.name}>
                  <BookSpine
                    project={p}
                    seed={i + 10}
                    lean={k === TOP_SHELF - 1 ? 7 : 0}
                    active={active === p.id}
                    onActivate={activate(p.id)}
                    onOpen={(_, ptr) => tryOpen("book", i, p.id, ptr)}
                  />
                </BookSlot>
              ))}
              <div className="ml-7">
                <Bookend seed={4} />
              </div>
            </div>
            <div className="absolute bottom-[26px] right-[80px] flex items-end">
              <Frame seed={8} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[26px]">
              <Plank width={W} seed={1} />
            </div>
            <ShelfLabel className="left-[120px]">start here: my best work</ShelfLabel>
          </div>

          {/* ── Shelf 2: the rest ── */}
          <div className="absolute inset-x-0 top-[460px] h-[400px]">
            <div className="absolute bottom-[26px] left-[60px] flex items-end gap-[14px]">
              <div className="mr-6">
                <FlatStack seed={9} />
              </div>
              {shelf("bottom").map(({ p, i }, k) => (
                <BookSlot key={p.id} id={p.id} active={active === p.id} flip={false} teaser={p.teaser} name={p.name}>
                  <BookSpine
                    project={p}
                    seed={i + 10}
                    lean={k === 0 ? -6 : 0}
                    active={active === p.id}
                    onActivate={activate(p.id)}
                    onOpen={(_, ptr) => tryOpen("book", i, p.id, ptr)}
                  />
                </BookSlot>
              ))}
            </div>
            <div className="absolute bottom-[26px] right-[90px] flex items-end">
              <Doodle name="trophy" color="#ffc700" size={118} seed={5} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[26px]">
              <Plank width={W} seed={2} />
            </div>
            <ShelfLabel className="left-[300px]">more things I built</ShelfLabel>
          </div>

          {/* ── Records: three shorter shelves grouped by result, so the sleeves can breathe ── */}
          {recordShelves.map((shelf, si) => (
            <div key={shelf.label} className="absolute" style={{ left: shelf.x, top: shelf.y, width: shelf.w, height: 300, transform: `rotate(${shelf.tilt}deg)` }}>
              {shelf.hanging && (
                // two ropes from nails straight down to the plank ends, clear of the records
                <Sketch
                  w={shelf.w}
                  h={340}
                  seed={si + 50}
                  className="pointer-events-none absolute"
                  style={{ left: -4, top: -64, width: shelf.w + 8, height: 348 }}
                  shapes={[
                    { t: "line", x1: 10, y1: 6, x2: 12, y2: 340, o: { strokeWidth: 1.8 } },
                    { t: "line", x1: shelf.w - 10, y1: 6, x2: shelf.w - 12, y2: 340, o: { strokeWidth: 1.8 } },
                    { t: "ellipse", cx: 10, cy: 6, w: 12, h: 12, o: { fill: "#1d1d1f", fillStyle: "solid" } },
                    { t: "ellipse", cx: shelf.w - 10, cy: 6, w: 12, h: 12, o: { fill: "#1d1d1f", fillStyle: "solid" } },
                  ]}
                />
              )}
              <div className="absolute bottom-[26px] flex w-full items-end justify-center gap-[24px]">
                {shelf.items.map(({ s, i }) => (
                  <div key={s.id} className="relative" style={{ zIndex: active === s.id ? 40 : 1 }}>
                    <RecordSleeve
                      study={s}
                      seed={i + 30}
                      tilt={sleeveTilts[i]}
                      active={active === s.id}
                      onActivate={activate(s.id)}
                      onOpen={(_, ptr) => tryOpen("record", i, s.id, ptr)}
                    />
                    <HelperNote show={active === s.id} name={s.title} teaser={s.teaser} flip={shelf.flip} top={-110} />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[26px]">
                <Plank width={shelf.w} seed={si + 3} />
              </div>
              <ShelfLabel className="left-[70px]">{shelf.label}</ShelfLabel>
            </div>
          ))}
          <Doodle name="music" color="#18a0fb" size={84} seed={6} className="absolute left-[760px] top-[960px] rotate-[8deg]" />
          <Doodle name="headset" color="#ee46d3" size={110} seed={4} className="absolute left-[800px] top-[1560px] rotate-[-10deg]" />
          <Doodle name="sparkle" color="#ffc700" size={56} seed={8} className="absolute left-[960px] top-[1520px]" />
        </ScaleStage>
      </div>

      <SketchWindow
        open={!!open}
        onClose={close}
        onPrev={prev}
        onNext={next}
        label={open?.kind === "book" ? "Project book" : "Case study record"}
        prevLabel={neighbour(-1)}
        nextLabel={neighbour(1)}
      >
        {open?.kind === "book" && <BookWindow project={books[open.index]} index={open.index} total={books.length} dir={open.dir} firstOpen={open.first} />}
        {open?.kind === "record" && <RecordWindow study={caseStudies[open.index]} index={open.index} total={caseStudies.length} dir={open.dir} firstOpen={open.first} />}
      </SketchWindow>
    </section>
  );
}

function BookSlot({ children, active, flip, name, teaser }: { children: React.ReactNode; id: string; active: boolean; flip: boolean; name: string; teaser: string }) {
  return (
    <div className="relative" style={{ zIndex: active ? 40 : 1 }}>
      {children}
      <HelperNote show={active} name={name} teaser={teaser} flip={flip} top={40} />
    </div>
  );
}

function HelperNote({ show, name, teaser, flip, top }: { show: boolean; name: string; teaser: string; flip: boolean; top: number }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-50 w-[260px] bg-[#fff1b8] px-5 pb-4 pt-4 text-ink"
          style={{
            top,
            [flip ? "right" : "left"]: "calc(100% + 18px)",
            boxShadow: "0 1px 1px rgba(29,29,31,0.08), 0 16px 26px -14px rgba(29,29,31,0.45)",
            borderBottomRightRadius: "18px 6px",
          }}
          initial={{ opacity: 0, scale: 0.85, rotate: flip ? 6 : -6 }}
          animate={{ opacity: 1, scale: 1, rotate: flip ? 2 : -2 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
        >
          <p className="font-marker text-[30px] leading-[0.9]">{name}</p>
          <p className="mt-1.5 font-note text-[16px] leading-snug">{teaser}</p>
          <p className="mt-2 font-note text-[14px] text-ink/50">click to open it</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ShelfLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`absolute -bottom-[40px] flex items-center gap-1.5 font-note text-[18px] text-ink-faint ${className}`}>
      <Sketch w={12} h={20} seed={children?.toString().length} className="h-5 w-3" shapes={[{ t: "line", x1: 6, y1: 19, x2: 6, y2: 2, o: { stroke: "#8a8a8e" } }, { t: "line", x1: 1, y1: 7, x2: 6, y2: 1, o: { stroke: "#8a8a8e" } }, { t: "line", x1: 11, y1: 7, x2: 6, y2: 1, o: { stroke: "#8a8a8e" } }]} />
      {children}
    </p>
  );
}
