"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Doodle from "@/components/sketch/Doodle";
import { Polaroid } from "@/components/sketch/Paper";
import Sketch from "@/components/sketch/Sketch";
import type { CaseStudy } from "@/data/caseStudies";
import { BadgeSticker, Record } from "./Vinyl";

type Props = { study: CaseStudy; index: number; total: number; dir: number; firstOpen: boolean };

export default function RecordWindow({ study, index, total, dir, firstOpen }: Props) {
  const reduce = useReducedMotion();
  const c = study.sleeve.color;
  const hasPhotos = study.images.length > 0;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={study.id}
        className="relative grid max-h-[calc(100vh-130px)] w-full overflow-y-auto rounded-[6px] bg-white shadow-lift min-[860px]:h-[min(calc(100vh-140px),660px)] min-[860px]:grid-cols-[0.95fr_1.05fr] min-[860px]:grid-rows-[minmax(0,1fr)] min-[860px]:overflow-visible"
        initial={firstOpen && !reduce ? { opacity: 0, scale: 0.94 } : reduce ? { opacity: 0 } : { opacity: 0, x: dir * 50 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -50 }}
        transition={{ duration: 0.28, ease: [0.3, 0.7, 0.2, 1] }}
        data-lenis-prevent
      >
        {/* Sleeve opens, record slides out and keeps spinning */}
        <div className="section-mist relative flex min-h-0 flex-col items-center justify-center gap-6 overflow-hidden rounded-l-[6px] px-6 py-10 min-[860px]:py-8">
          <div className={`relative aspect-square ${hasPhotos ? "w-[min(52%,250px)]" : "w-[min(64%,300px)]"}`}>
            <motion.div
              className="absolute inset-[4%]"
              initial={reduce ? false : { x: "0%" }}
              animate={{ x: "46%" }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.3, 0.7, 0.2, 1] }}
            >
              <Record size={400} color={c} className={`h-full w-full ${reduce ? "" : "animate-[spin_3.6s_linear_infinite]"}`} />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={reduce ? false : { x: "0%" }}
              animate={{ x: "-14%" }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.3, 0.7, 0.2, 1] }}
              style={{ filter: "drop-shadow(0 16px 18px rgba(29,29,31,0.25))" }}
            >
              <Sketch
                w={300}
                h={300}
                seed={index + 2}
                className="absolute inset-0 h-full w-full"
                shapes={[
                  { t: "rect", x: 0, y: 0, w: 300, h: 300, o: { fill: c, hachureGap: 6, fillWeight: 2, strokeWidth: 3, hachureAngle: 30 } },
                  { t: "ellipse", cx: 150, cy: 126, w: 168, h: 168, o: { fill: "#ffffff", fillStyle: "solid", strokeWidth: 2.4 } },
                ]}
              />
              <Doodle name={study.sleeve.icon} color={c} size="34%" className="absolute left-1/2 top-[25%] -translate-x-1/2" />
              <p className="absolute inset-x-[8%] bottom-[7%] text-center font-marker text-[clamp(26px,2.6vw,38px)] leading-[0.86] text-ink">{study.title}</p>
              <BadgeSticker badge={study.badge} field={study.field} size={92} tilt={12} className="absolute -right-6 -top-6" />
            </motion.div>
          </div>

          {/* photos from the day, pinned under the record like postcards */}
          {hasPhotos && (
            <div className="relative flex w-full max-w-[420px] justify-center">
              {study.images.slice(0, 3).map((src, i) => (
                <motion.div
                  key={src}
                  className="relative -mx-2 w-[34%] max-w-[140px] transition-transform hover:z-10 hover:-translate-y-2"
                  initial={reduce ? false : { opacity: 0, y: 24, rotate: 0 }}
                  animate={{ opacity: 1, y: [0, 10, 0][i], rotate: [-6, 3, -2][i] }}
                  transition={{ delay: reduce ? 0 : 0.9 + i * 0.12, type: "spring", stiffness: 220, damping: 18 }}
                >
                  <Polaroid src={src} alt={`${study.title}, photo ${i + 1}`} tape={["#ffc700", "#18a0fb", "#ee46d3"][i]} ratio="1 / 1" sizes="140px" />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <motion.div
          className="flex min-h-0 flex-col overflow-y-auto px-7 pb-5 pt-6 sm:px-10"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45 }}
        >
          <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-faint">
            {study.event} · {study.host} · {study.date}
          </p>
          <h3 className="mt-2 text-[clamp(28px,3vw,40px)] font-semibold leading-[1.05] tracking-[-0.025em] text-ink">{study.title}</h3>

          <Block label="the problem" color={c}>
            {study.problem}
          </Block>
          <Block label="what we did" color={c}>
            {study.approach}
          </Block>
          <div className="mt-5 rotate-[-1deg] bg-[#fff1b8] px-5 py-3.5 shadow-paper">
            <p className="font-marker text-[24px] leading-none text-ink">result</p>
            <p className="mt-1.5 font-note text-[16px] leading-snug text-ink">{study.result}</p>
          </div>

          {study.links && study.links.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2.5">
              {study.links.map((l, i) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={`${i === 0 ? "btn-blue" : "btn-ghost"} !py-1.5 !text-[14px]`}>
                  {l.label}
                </a>
              ))}
            </div>
          )}

          <p className="mt-auto pt-4 font-note text-[14px] text-ink-faint">
            record {index + 1} of {total}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Block({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="relative inline-block font-marker text-[27px] leading-none text-ink">
        {label}
        <span aria-hidden className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full" style={{ background: color, transform: "rotate(-1deg)" }} />
      </p>
      <p className="mt-2 max-w-[56ch] text-[15px] leading-[1.6] text-ink-soft">{children}</p>
    </div>
  );
}
