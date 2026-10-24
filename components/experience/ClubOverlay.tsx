"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ScaleStage from "@/components/canvas/ScaleStage";
import Character from "@/components/character/Character";
import Sketch from "@/components/sketch/Sketch";
import { experience } from "@/data/experience";
import Notes from "./Notes";
import { SceneLayer, STAGE_H, STAGE_W } from "./Scene";

const STEP_LOCK_MS = 950;

export default function ClubOverlay({ onExit, start = 0 }: { onExit: () => void; start?: number }) {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const [state, setState] = useState({ index: start, dir: 1, seq: 0 });
  const lock = useRef(0);
  const wheelAcc = useRef(0);
  const wheelIdle = useRef<ReturnType<typeof setTimeout>>(undefined);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const exitRef = useRef<HTMLButtonElement>(null);
  const total = experience.length;
  const exp = experience[state.index];

  const current = useRef(state);
  current.current = state;

  // One gesture = one company: steps are locked while a transition plays.
  const goTo = useCallback(
    (target: number) => {
      const now = Date.now();
      const s = current.current;
      const index = Math.max(0, Math.min(total - 1, target));
      if (now < lock.current || index === s.index) return;
      lock.current = now + (reduce ? 250 : STEP_LOCK_MS);
      setState({ index, dir: index > s.index ? 1 : -1, seq: s.seq + 1 });
    },
    [total, reduce],
  );
  const step = useCallback((d: number) => goTo(current.current.index + d), [goTo]);

  // Lock page scroll, own the keyboard, and hand focus to the exit button.
  useEffect(() => {
    lenis?.stop();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    exitRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
      else if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        step(1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
      lenis?.start();
    };
  }, [lenis, onExit, step, goTo, total]);

  // Preload the next and previous scenes so the wipe never reveals a blank.
  useEffect(() => {
    for (const d of [-1, 1]) {
      const e = experience[state.index + d];
      for (const src of [e?.background, e?.character]) if (src) new window.Image().src = src;
    }
  }, [state.index]);

  const onWheel = (e: React.WheelEvent) => {
    wheelAcc.current += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    clearTimeout(wheelIdle.current);
    wheelIdle.current = setTimeout(() => (wheelAcc.current = 0), 180);
    if (Math.abs(wheelAcc.current) > 50) {
      step(Math.sign(wheelAcc.current));
      wheelAcc.current = 0;
    }
  };
  const onTouchStart = (e: React.TouchEvent) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY });
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    const d = Math.abs(dy) > Math.abs(dx) ? -dy : -dx;
    if (Math.abs(d) > 40) step(Math.sign(d));
    touch.current = null;
  };

  const last = state.index === total - 1;

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="The experience club"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.1 : 0.45 }}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <ScaleStage width={STAGE_W} height={STAGE_H} fit="contain" maxScale={2}>
        <div className="absolute inset-0 overflow-hidden bg-white">
          <AnimatePresence initial={false}>
            <div key={state.seq} className="absolute inset-0" style={{ zIndex: state.seq }}>
              <SceneLayer exp={exp} dir={state.dir} first={state.seq === 0} />
            </div>
          </AnimatePresence>

          <div className="absolute inset-0" style={{ zIndex: 10_000 }}>
            <AnimatePresence mode="wait">
              <motion.div key={exp.id} className="absolute inset-0">
                <Notes exp={exp} index={state.index} total={total} />
              </motion.div>
            </AnimatePresence>

            {/* The character: centre stage, ~3/4 of the height, feet on the floor */}
            <div className="absolute bottom-[26px] left-1/2 h-[700px] w-[420px] -translate-x-1/2">
              <Sketch
                w={300}
                h={40}
                seed={4}
                className="absolute -bottom-3 left-1/2 h-10 w-[300px] -translate-x-1/2"
                shapes={[{ t: "ellipse", cx: 150, cy: 20, w: 280, h: 30, o: { fill: "#1d1d1f", hachureGap: 5, fillWeight: 1, stroke: "transparent" } }]}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={exp.id}
                  className="absolute inset-0 origin-bottom"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scaleY: 0.72, scaleX: 1.14, y: 50 }}
                  animate={{ opacity: 1, scaleY: 1, scaleX: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scaleY: 0.8, scaleX: 1.1, y: 24, transition: { duration: 0.18, ease: "easeIn" } }}
                  transition={{ type: "spring", stiffness: 420, damping: 18, delay: reduce ? 0 : 0.28 }}
                >
                  <Character src={exp.character} alt={`Omkar at ${exp.company}`} accent={exp.accent} seed={state.index + 2} className="h-full w-full" priority sizes="40vw" />
                </motion.div>
              </AnimatePresence>
              {!reduce && <Puff key={`puff-${state.seq}`} show={state.seq > 0} />}
            </div>
          </div>
        </div>
      </ScaleStage>

      {/* Chrome stays outside the scaled stage so it is always tappable. */}
      <button
        ref={exitRef}
        onClick={onExit}
        className="absolute left-4 top-4 z-[10001] rounded-full bg-white/90 px-4 py-2 font-note text-[16px] text-ink shadow-paper backdrop-blur transition-transform hover:-translate-x-0.5 sm:left-6 sm:top-6 [@media(max-height:520px)]:left-2 [@media(max-height:520px)]:top-2 [@media(max-height:520px)]:py-1 [@media(max-height:520px)]:text-[14px]"
      >
        leave the club · esc
      </button>

      <nav aria-label="Companies" className="absolute right-3 top-1/2 z-[10001] -translate-y-1/2 sm:right-6">
        <ol className="flex flex-col items-end gap-2.5">
          {experience.map((e, i) => (
            <li key={e.id}>
              <button
                onClick={() => goTo(i)}
                aria-current={i === state.index ? "step" : undefined}
                aria-label={e.company}
                title={e.company}
                className="flex items-center p-1"
              >
                <span
                  className="block h-3 w-3 rounded-full border-2 border-ink transition-transform"
                  style={{ background: i === state.index ? e.accent : "#fff", transform: i === state.index ? "scale(1.35)" : "none" }}
                />
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <button
        onClick={() => (last ? onExit() : step(1))}
        className="absolute bottom-4 left-1/2 z-[10001] flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-note text-[16px] text-ink shadow-paper backdrop-blur sm:bottom-6 [@media(max-height:520px)]:bottom-2 [@media(max-height:520px)]:left-auto [@media(max-height:520px)]:right-3 [@media(max-height:520px)]:translate-x-0 [@media(max-height:520px)]:py-1 [@media(max-height:520px)]:text-[14px]"
      >
        {last ? "that's all of them · leave" : `next: ${experience[state.index + 1].company}`}
        {!last && (
          <motion.span animate={reduce ? undefined : { y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <Sketch
              w={16}
              h={22}
              seed={2}
              className="h-[22px] w-4"
              shapes={[
                { t: "line", x1: 8, y1: 1, x2: 8, y2: 20 },
                { t: "line", x1: 2, y1: 13, x2: 8, y2: 21 },
                { t: "line", x1: 14, y1: 13, x2: 8, y2: 21 },
              ]}
            />
          </motion.span>
        )}
      </button>

      <p className="pointer-events-none absolute bottom-16 left-1/2 z-[10001] -translate-x-1/2 rounded bg-white/80 px-2 font-note text-[14px] text-ink-faint portrait:block landscape:hidden">
        turn your phone sideways for a bigger view
      </p>
    </motion.div>
  );
}

/** Little burst of doodle lines at the feet when the outfit swaps. */
function Puff({ show }: { show: boolean }) {
  if (!show) return null;
  const rays = Array.from({ length: 9 }, (_, i) => (Math.PI * (i + 0.5)) / 9);
  return (
    <motion.svg
      viewBox="-120 -120 240 120"
      className="pointer-events-none absolute bottom-[-6px] left-1/2 h-[120px] w-[240px] -translate-x-1/2"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 1.25] }}
      transition={{ delay: 0.2, duration: 0.55, times: [0, 0.4, 1] }}
      aria-hidden
    >
      {rays.map((a, i) => (
        <line key={i} x1={-Math.cos(a) * 60} y1={-Math.sin(a) * 40} x2={-Math.cos(a) * 104} y2={-Math.sin(a) * 76} stroke="#1d1d1f" strokeWidth="4" strokeLinecap="round" />
      ))}
    </motion.svg>
  );
}
