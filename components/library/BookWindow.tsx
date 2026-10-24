"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import Doodle from "@/components/sketch/Doodle";
import Sketch from "@/components/sketch/Sketch";
import type { Project } from "@/data/projects";

const RULED = {
  backgroundColor: "#ffffff",
  backgroundImage: "repeating-linear-gradient(180deg, transparent 0 31px, rgba(24,160,251,0.16) 31px 32px)",
};

type Props = { project: Project; index: number; total: number; dir: number; firstOpen: boolean };

function useWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 860px)");
    const set = () => setWide(m.matches);
    set();
    m.addEventListener("change", set);
    return () => m.removeEventListener("change", set);
  }, []);
  return wide;
}

export default function BookWindow({ project, index, total, dir, firstOpen }: Props) {
  const reduce = useReducedMotion();
  const wide = useWide();
  const [coverGone, setCoverGone] = useState(!firstOpen || !!reduce);
  const animateCover = wide && !coverGone;

  return (
    <div className="w-full" style={{ perspective: 2400 }}>
      <motion.div
        className="relative mx-auto w-full"
        initial={firstOpen && !reduce ? { x: wide ? "-25%" : 0, y: wide ? 0 : 40, scale: 0.86, opacity: 0 } : false}
        animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1], x: { delay: 0.35, duration: 0.8, ease: [0.45, 0, 0.2, 1] } }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={project.id}
            custom={dir}
            // Each page carries its own paper: while the cover is closed there is nothing on the left.
            className={`relative grid max-h-[calc(100vh-130px)] overflow-y-auto rounded-[6px] min-[860px]:h-[min(calc(100vh-140px),680px)] min-[860px]:grid-cols-2 min-[860px]:grid-rows-[minmax(0,1fr)] min-[860px]:overflow-visible ${animateCover ? "" : "shadow-lift"}`}
            initial={firstOpen ? false : reduce ? { opacity: 0 } : { opacity: 0, x: dir * 50, rotateY: dir * 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -50, rotateY: dir * -10 }}
            transition={{ duration: 0.28, ease: [0.3, 0.7, 0.2, 1] }}
          >
            <div className="relative min-h-0 rounded-l-[6px]" style={{ ...RULED, visibility: animateCover ? "hidden" : "visible" }}>
              <LeftPage project={project} index={index} total={total} />
            </div>
            <div
              className={`relative min-h-0 border-t border-ink/10 min-[860px]:rounded-r-[6px] min-[860px]:border-l min-[860px]:border-t-0 ${animateCover ? "shadow-lift" : ""}`}
              style={RULED}
            >
              <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-[rgba(29,29,31,0.07)] to-transparent min-[860px]:block" />
              <RightPage project={project} />
            </div>

            {animateCover && (
              <motion.div
                className="absolute right-0 top-0 h-full w-1/2 origin-left"
                style={{ transformStyle: "preserve-3d", transformPerspective: 2400 }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -180 }}
                transition={{ delay: 0.45, duration: 0.95, ease: [0.5, 0, 0.25, 1] }}
                onAnimationComplete={() => setCoverGone(true)}
              >
                <div className="absolute inset-0 overflow-hidden rounded-[6px]" style={{ backfaceVisibility: "hidden" }}>
                  <Cover project={project} />
                </div>
                <div className="absolute inset-0 rounded-[6px]" style={{ ...RULED, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <LeftPage project={project} index={index} total={total} />
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Cover({ project }: { project: Project }) {
  const c = project.spine.color;
  return (
    <div className="relative h-full w-full bg-white">
      <Sketch
        w={400}
        h={600}
        stretch
        seed={7}
        className="absolute inset-0 h-full w-full"
        shapes={[
          { t: "rect", x: 0, y: 0, w: 400, h: 600, o: { fill: c, hachureGap: 7, fillWeight: 2.2, strokeWidth: 3 } },
          { t: "rect", x: 40, y: 150, w: 320, h: 220, o: { fill: "#ffffff", fillStyle: "solid", strokeWidth: 2.4 } },
        ]}
      />
      <div className="absolute inset-x-[14%] top-[27%] flex h-[34%] flex-col items-center justify-center text-center">
        <p className="font-marker text-[clamp(40px,4.4vw,64px)] leading-[0.85] text-ink">{project.name}</p>
        <p className="mt-2 font-note text-[16px] text-ink-soft">{project.tagline}</p>
      </div>
      <Doodle name={project.spine.icon} color="#ffffff" size={110} className="absolute bottom-[10%] left-1/2 -translate-x-1/2" />
    </div>
  );
}

function LeftPage({ project, index, total }: { project: Project; index: number; total: number }) {
  const c = project.spine.color;
  return (
    <div className="flex h-full min-h-0 flex-col px-7 pb-5 pt-7 sm:px-10">
      <h3 className="font-marker text-[clamp(42px,4.6vw,66px)] leading-[0.84] text-ink">
        <span className="hl" style={{ ["--hl" as string]: `${c}55` }}>
          {project.name}
        </span>
      </h3>
      <p className="mt-3 font-note text-[17px] leading-snug text-ink-soft">{project.tagline}</p>

      <div className="relative my-4 flex min-h-[70px] flex-1 items-center justify-center overflow-hidden">
        <Doodle name={project.spine.icon} color={c} size="min(150px, 17vh)" seed={11} />
      </div>

      <ul className="flex flex-wrap gap-2.5" aria-label="Built with">
        {project.stack.map((s, i) => (
          <li
            key={s}
            className="rounded-md border-2 border-ink/80 bg-white px-2 py-0.5 font-note text-[14px] text-ink"
            style={{ transform: `rotate(${((i * 7) % 5) - 2}deg)` }}
          >
            {s}
          </li>
        ))}
      </ul>
      {project.links.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {project.links.map((l, i) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={i === 0 ? "btn-blue !py-1.5 !text-[14px]" : "btn-ghost !py-1.5 !text-[14px]"}>
              {l.label}
            </a>
          ))}
        </div>
      )}
      <p className="mt-4 font-note text-[14px] text-ink-faint">
        book {index + 1} of {total}
      </p>
    </div>
  );
}

function RightPage({ project }: { project: Project }) {
  const c = project.spine.color;
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-7 pb-6 pt-7 sm:px-10" data-lenis-prevent>
      <PageHeading color={c}>what it is</PageHeading>
      <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.6] text-ink-soft">{project.what}</p>

      <PageHeading color={c} className="mt-5">
        how it works
      </PageHeading>
      <ol className="mt-2.5 space-y-2.5">
        {project.how.map((step, i) => (
          <li key={i} className="flex gap-3 text-[15px] leading-[1.55] text-ink-soft">
            <span className="relative mt-0.5 grid h-7 w-7 shrink-0 place-items-center font-marker text-[22px] text-ink">
              <Sketch w={28} h={28} seed={i + 3} className="absolute inset-0 h-7 w-7" shapes={[{ t: "ellipse", cx: 14, cy: 14, w: 26, h: 26, o: { strokeWidth: 1.6 } }]} />
              <span className="relative">{i + 1}</span>
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-auto pt-5">
        <div className="relative rotate-[-1.2deg] bg-[#fff1b8] px-5 py-3.5 shadow-paper">
          <p className="font-marker text-[23px] leading-none text-ink">what came out of it</p>
          <p className="mt-1.5 font-note text-[16px] leading-snug text-ink">{project.result}</p>
        </div>
      </div>
    </div>
  );
}

function PageHeading({ children, color, className = "" }: { children: React.ReactNode; color: string; className?: string }) {
  return (
    <h4 className={`relative inline-block self-start font-marker text-[30px] leading-none text-ink ${className}`}>
      {children}
      <Sketch
        w={140}
        h={10}
        stretch
        seed={children?.toString().length ?? 1}
        className="absolute -bottom-1.5 left-0 h-2.5 w-full"
        shapes={[{ t: "curve", pts: [[0, 6], [50, 3], [100, 7], [140, 4]], o: { stroke: color, strokeWidth: 3 } }]}
      />
    </h4>
  );
}
