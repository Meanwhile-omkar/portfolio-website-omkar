"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ScaleStage from "@/components/canvas/ScaleStage";
import HandArrow from "@/components/sketch/HandArrow";
import RoughFrame from "@/components/sketch/RoughFrame";
import Sketch from "@/components/sketch/Sketch";
import SectionTitle from "@/components/ui/SectionTitle";
import { experience } from "@/data/experience";
import ClubOverlay from "./ClubOverlay";
import Door, { DOOR, playKnock, type DoorPhase } from "./Door";

const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const count = (n: number) => words[n] ?? String(n);

export default function ExperienceClub() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<DoorPhase>("idle");
  const [club, setClub] = useState<{ start: number } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const enter = useCallback(
    (start: number, knock: boolean) => {
      if (phase !== "idle") return;
      const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, reduce ? 0 : ms));
      if (knock && !reduce) {
        setPhase("knock");
        playKnock();
        later(780, () => setPhase("open"));
        later(1450, () => setPhase("zoom"));
        later(1560, () => setClub({ start }));
      } else {
        setPhase("open");
        later(650, () => setPhase("zoom"));
        later(760, () => setClub({ start }));
      }
    },
    [phase, reduce],
  );

  const exit = useCallback(() => {
    setClub(null);
    timers.current.push(setTimeout(() => setPhase("idle"), 350));
  }, []);

  return (
    <section id="experience" aria-labelledby="experience-title" className="section-mist relative scroll-mt-20 overflow-hidden py-28 md:py-36">
      <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-5 md:grid-cols-[1fr_minmax(0,420px)]">
        <div>
          <SectionTitle id="experience-title" color="#dcdcff">
            The experience club
          </SectionTitle>
          <p className="mt-7 max-w-[44ch] text-[18px] leading-relaxed text-ink-soft">
            {count(experience.length)} internships so far, from live events to fintech and health tech. Knock on the door to walk through them one by one: what each company does, what I did there, and what I took away.
          </p>

          <RoughFrame className="mt-10 max-w-[480px] rotate-[-1deg] bg-white px-7 pb-6 pt-8" seed={14} o={{ strokeWidth: 2.2 }}>
            <Sketch
              w={120}
              h={30}
              seed={3}
              className="absolute -top-[22px] left-1/2 h-[30px] w-[120px] -translate-x-1/2"
              shapes={[{ t: "rect", x: 0, y: 4, w: 120, h: 24, o: { fill: "#8a8a8e", hachureGap: 3.5, strokeWidth: 2.2 } }]}
            />
            <p className="font-marker text-[36px] leading-none text-ink">guest list</p>
            <ol className="mt-4 divide-y divide-dashed divide-ink/15">
              {experience.map((e, i) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => enter(i, false)}
                    className="group flex w-full items-baseline gap-3 py-2.5 text-left"
                    aria-label={`Enter the club at ${e.company}`}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 translate-y-[-1px] rounded-full border-2 border-ink" style={{ background: e.accent }} />
                    <span className="font-note text-[18px] text-ink group-hover:underline group-hover:decoration-wavy group-hover:underline-offset-4">{e.company}</span>
                    <span className="ml-auto whitespace-nowrap text-right text-[14px] text-ink-faint">
                      <span className="hidden sm:inline">{e.role.replace(" Intern", "")} · </span>
                      {e.dates.slice(-4) || e.mode}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </RoughFrame>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <HandArrow
            w={150}
            h={90}
            pts={[[8, 20], [70, 8], [138, 70]]}
            size={4}
            color="#424242"
            className="absolute -left-[150px] top-[260px] hidden w-[150px] lg:block"
          />
          <p className="absolute -left-[210px] top-[220px] hidden w-[160px] font-note text-[17px] leading-snug text-ink-soft lg:block">click the door</p>
          <ScaleStage width={DOOR.W} height={DOOR.H}>
            <motion.div
              className="absolute inset-0"
              style={{ transformOrigin: `${(DOOR.cx / DOOR.W) * 100}% ${(DOOR.cy / DOOR.H) * 100}%` }}
              animate={{ scale: phase === "zoom" && !reduce ? 6 : 1 }}
              transition={{ duration: 0.55, ease: [0.6, 0, 0.3, 1] }}
            >
              <Door phase={phase} count={experience.length} onKnock={() => enter(0, true)} />
            </motion.div>
          </ScaleStage>
        </div>
      </div>

      <AnimatePresence>{club && <ClubOverlay key="club" start={club.start} onExit={exit} />}</AnimatePresence>
    </section>
  );
}
