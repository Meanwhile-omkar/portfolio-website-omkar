"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Tape } from "@/components/sketch/Paper";
import HandArrow from "@/components/sketch/HandArrow";
import RoughFrame from "@/components/sketch/RoughFrame";
import Sketch from "@/components/sketch/Sketch";
import type { Experience } from "@/data/experience";
import StickerLayer from "./StickerLayer";

// Everything written on the canvas for one company, laid out on the 1600x900 stage.
// Order of appearance: logo block, then "what I did" line by line, arrow, skills, liked-most bubble.

export default function Notes({ exp, index, total }: { exp: Experience; index: number; total: number }) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const t = (d: number) => (reduce ? 0 : d);
  // Long lists (named investors, clients) drop a size so they stay clear of the skills row.
  const dense = exp.whatIDid.join(" ").length > 330;
  const pop = (delay: number, from: { x?: number; y?: number; rotate?: number } = {}) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, ...from },
    animate: { opacity: 1, x: 0, y: 0, rotate: 0 },
    exit: { opacity: 0, transition: { duration: 0.15 } },
    transition: { delay: t(delay), duration: 0.45, ease: [0.2, 0.8, 0.2, 1] as const },
  });

  return (
    <div ref={root} className="absolute inset-0">
      {/* data-zone marks text the stickers must keep clear of */}
      {exp.stickers && <StickerLayer stickers={exp.stickers} rootRef={root} playDelay={t(1.2)} />}

      {/* ── top right: who they are ── */}
      <motion.div className="absolute right-[80px] top-[50px] w-[520px]" {...pop(0.35, { y: -16 })}>
        <div data-zone className="inline-block">
          <Logo exp={exp} />
        </div>
        <h3 data-zone className="mt-4 w-fit font-marker text-[62px] leading-[0.82] text-ink">{exp.company}</h3>
        <div data-zone className="mt-4 inline-block rotate-[-1.5deg] whitespace-nowrap px-4 py-2 font-note text-[18px] text-ink" style={{ background: `${exp.accent}33` }}>
          {[exp.role, exp.dates, exp.mode].filter(Boolean).join(" · ")}
        </div>
        <p data-zone className="mt-4 max-w-[460px] font-note text-[22px] leading-[1.32] text-ink-soft">{exp.aboutCompany}</p>
        {exp.website && (
          <a
            href={exp.website}
            target="_blank"
            rel="noreferrer"
            data-zone
            className="mt-2 inline-block font-note text-[18px] text-ink underline decoration-wavy underline-offset-4"
            style={{ textDecorationColor: exp.accent }}
          >
            {exp.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
          </a>
        )}
        {exp.docs && (
          <div data-zone className="mt-3 flex flex-wrap gap-2">
            {exp.docs.map((d) => (
              <a
                key={d.href}
                href={d.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink/80 bg-white px-3 py-1 font-note text-[15px] text-ink transition-transform hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 12 14" className="h-3.5 w-3" aria-hidden>
                  <path d="M1 1h7l3 3v9H1z M8 1v3h3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
                {d.label}
              </a>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── left: what I did ── */}
      <div data-zone className="absolute left-[84px] top-[150px] w-[470px]">
        <motion.h4 className="relative inline-block font-marker text-[52px] leading-none text-ink" {...pop(0.6, { x: -12 })}>
          what I did
          {/* rough-notation measures in screen pixels, which breaks inside the scaled stage, so the underline is drawn here */}
          <motion.span
            className="absolute -bottom-2 left-0 block h-3 w-full"
            initial={{ clipPath: reduce ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ delay: t(0.95), duration: 0.5, ease: [0.3, 0.7, 0.2, 1] }}
          >
            <Sketch
              w={200}
              h={12}
              stretch
              seed={index + 9}
              className="h-full w-full"
              shapes={[{ t: "curve", pts: [[0, 8], [70, 4], [140, 9], [200, 5]], o: { stroke: exp.accent, strokeWidth: 5 } }]}
            />
          </motion.span>
        </motion.h4>
        <ol className={dense ? "mt-5 space-y-4" : "mt-6 space-y-6"}>
          {exp.whatIDid.map((line, i) => (
            <motion.li key={i} className="flex gap-4" {...pop(0.85 + i * 0.28, { x: -14, rotate: -1 })}>
              <span className="relative mt-0.5 grid h-10 w-10 shrink-0 place-items-center font-marker text-[30px] text-ink">
                <Sketch
                  w={40}
                  h={40}
                  seed={i + index * 3}
                  className="absolute inset-0 h-10 w-10"
                  shapes={[{ t: "ellipse", cx: 20, cy: 20, w: 38, h: 36, o: { fill: exp.accent, hachureGap: 4, strokeWidth: 1.8 } }]}
                />
                <span className="relative">{i + 1}</span>
              </span>
              <span className={`font-note leading-[1.3] text-ink ${dense ? "text-[20px]" : "text-[23px]"}`}>{line}</span>
            </motion.li>
          ))}
        </ol>
        <div data-zone className="absolute -right-[118px] bottom-[-96px] w-[150px]">
          <HandArrow w={150} h={110} pts={[[6, 14], [70, 30], [140, 96]]} size={5} play delay={t(1.8)} className="w-[150px]" />
        </div>
      </div>

      {/* ── bottom left: skills ── */}
      <motion.ul data-zone className="absolute bottom-[66px] left-[84px] flex w-[440px] flex-wrap gap-x-3 gap-y-2" aria-label="Skills used" {...pop(2.0, { y: 10 })}>
        {exp.skills.map((s, i) => (
          <li key={s} className="font-note text-[19px] text-ink" style={{ transform: `rotate(${(i % 2 ? 1.5 : -1.5)}deg)` }}>
            <span className="hl" style={{ ["--hl" as string]: `${exp.accent}55` }}>
              {s}
            </span>
          </li>
        ))}
      </motion.ul>

      {/* ── bottom right: what I liked most ── */}
      {exp.likedMost && (
        <motion.div data-zone className="absolute bottom-[70px] right-[90px] w-[470px]" {...pop(2.3, { y: 14, rotate: 3 })}>
          <RoughFrame className="bg-white px-7 py-5" seed={index + 40} o={{ strokeWidth: 2.4 }}>
            <p className="font-marker text-[32px] leading-none text-ink">what I liked most</p>
            <p className="mt-2 font-note text-[19px] leading-snug text-ink">{exp.likedMost}</p>
          </RoughFrame>
          <Sketch
            w={60}
            h={40}
            seed={index}
            className="absolute -left-[50px] top-[40%] h-10 w-[60px]"
            shapes={[{ t: "poly", pts: [[60, 4], [0, 22], [60, 30]], o: { fill: "#ffffff", fillStyle: "solid", strokeWidth: 2.4 } }]}
          />
        </motion.div>
      )}

    </div>
  );
}

function Logo({ exp }: { exp: Experience }) {
  if (exp.logo) {
    // Logos are mostly wide wordmarks, so they sit on a taped card instead of a square.
    return (
      <div className={`relative inline-block rotate-[-2deg] rounded-xl shadow-paper ${exp.logoSquare ? "p-2" : "px-6 py-5"}`} style={{ background: exp.logoBg ?? "#ffffff" }}>
        <Tape color={exp.accent} className="-top-3 left-1/2 w-24 -translate-x-1/2 rotate-[3deg]" />
        <div className={`relative ${exp.logoSquare ? "h-[124px] w-[124px]" : "h-[96px] w-[290px]"}`}>
          <Image src={exp.logo} alt={`${exp.company} logo`} fill sizes="290px" unoptimized={exp.logo.endsWith(".svg")} className="object-contain object-left" />
        </div>
      </div>
    );
  }
  const initials = exp.company
    .split(/[\s·]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className="relative grid h-[92px] w-[92px] shrink-0 place-items-center" aria-hidden>
      <Sketch
        w={92}
        h={92}
        seed={exp.id.length + 2}
        className="absolute inset-0 h-full w-full"
        shapes={[{ t: "ellipse", cx: 46, cy: 46, w: 88, h: 86, o: { fill: exp.accent, hachureGap: 4.5, fillWeight: 1.8, strokeWidth: 2.4 } }]}
      />
      <span className="relative rounded-md bg-white px-1.5 font-marker text-[40px] leading-none text-ink">{initials}</span>
    </div>
  );
}
