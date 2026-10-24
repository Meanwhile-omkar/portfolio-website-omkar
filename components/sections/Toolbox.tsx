"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Sticker, WordSticker } from "@/components/sketch/Paper";
import Sketch from "@/components/sketch/Sketch";
import SectionTitle from "@/components/ui/SectionTitle";
import { skillGroups, type SkillGroup } from "@/data/skills";
import { jitter } from "@/lib/rough";

// A loose freehand loop, like circling things on a page.
function loopPoints(seed: number): [number, number][] {
  const r = jitter(seed);
  return Array.from({ length: 11 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 + 0.2;
    const k = 1 + (r() - 0.5) * 0.14;
    return [200 + Math.cos(a) * 186 * k, 150 + Math.sin(a) * 132 * k] as [number, number];
  });
}

function Group({ g, index }: { g: SkillGroup; index: number }) {
  const area = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const r = jitter(index * 13 + 4);
  return (
    <div className="relative flex flex-col">
      <p className="mb-2 text-center font-marker text-[38px] leading-none text-ink">{g.label}</p>
      {/* the loop stretches around however many stickers the group has */}
      <div ref={area} className="relative mx-auto flex min-h-[330px] w-full max-w-[420px] flex-1 items-center px-[12%] py-[14%]">
        <Sketch
          w={400}
          h={300}
          seed={index + 3}
          stretch
          className="pointer-events-none absolute inset-0 h-full w-full"
          shapes={[{ t: "curve", pts: loopPoints(index + 9), o: { stroke: g.color, strokeWidth: 3, roughness: 1.6 } }]}
        />
        <ul className="relative flex w-full flex-wrap content-center items-center justify-center gap-x-3 gap-y-3">
          {g.items.map((it, i) => {
            const tilt = Math.round((r() * 2 - 1) * 9);
            return (
              <motion.li
                key={"icon" in it ? it.icon.title : it.word}
                drag={!reduce}
                dragConstraints={area}
                dragElastic={0.2}
                dragMomentum={false}
                whileDrag={{ scale: 1.12, zIndex: 10 }}
                whileHover={reduce ? undefined : { y: -3 }}
                className="cursor-grab touch-none active:cursor-grabbing"
              >
                {"icon" in it ? (
                  <Sticker icon={it.icon} size={46} tilt={tilt} />
                ) : (
                  <WordSticker color={it.color} ink={it.ink} tilt={tilt * 0.5}>
                    {it.word}
                  </WordSticker>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function Toolbox() {
  return (
    <section id="toolbox" aria-labelledby="toolbox-title" className="relative scroll-mt-20 py-28 md:py-36">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionTitle id="toolbox-title" color="#d4f5e6" aside="What I use day to day. The stickers come off, try dragging one.">
          Toolbox
        </SectionTitle>
        <div className="mt-14 grid items-stretch gap-12 md:grid-cols-3 md:gap-6">
          {skillGroups.map((g, i) => (
            <Group key={g.id} g={g} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
