"use client";

import { motion, useReducedMotion } from "framer-motion";
import Sketch from "@/components/sketch/Sketch";
import type { Shape } from "@/lib/rough";

export type DoorPhase = "idle" | "knock" | "open" | "zoom";

const W = 420;
const H = 640;
// Doorway inside the frame
const DX = 70;
const DY = 150;
const DW = 280;
const DH = 420;

const frame: Shape[] = [
  // hanging sign strings + board
  { t: "line", x1: 120, y1: 0, x2: 140, y2: 46, o: { strokeWidth: 1.6 } },
  { t: "line", x1: 300, y1: 0, x2: 280, y2: 46, o: { strokeWidth: 1.6 } },
  { t: "rect", x: 64, y: 44, w: 292, h: 78, o: { fill: "#ffffff", fillStyle: "solid", strokeWidth: 2.6 } },
  // door frame
  { t: "rect", x: DX - 18, y: DY - 18, w: DW + 36, h: DH + 18, o: { strokeWidth: 3 } },
  { t: "rect", x: DX - 6, y: DY - 6, w: DW + 12, h: DH + 6, o: { strokeWidth: 1.6 } },
  // floor + mat
  { t: "line", x1: 0, y1: DY + DH + 2, x2: W, y2: DY + DH + 2, o: { strokeWidth: 2.2 } },
  { t: "rect", x: DX + 30, y: DY + DH + 12, w: DW - 60, h: 34, o: { fill: "#ffc700", hachureGap: 4.5, strokeWidth: 2 } },
];

const panel: Shape[] = [
  { t: "rect", x: 0, y: 0, w: DW, h: DH, o: { fill: "#6465ed", hachureGap: 5.5, fillWeight: 1.7, strokeWidth: 2.8 } },
  { t: "rect", x: 34, y: 40, w: DW - 68, h: 140, o: { fill: "#ffffff", fillStyle: "solid", strokeWidth: 2 } },
  { t: "rect", x: 34, y: 214, w: DW - 68, h: 170, o: { strokeWidth: 2 } },
  { t: "ellipse", cx: DW - 34, cy: 206, w: 26, h: 26, o: { fill: "#ffc700", fillStyle: "solid", strokeWidth: 2.2 } },
];

type Props = { phase: DoorPhase; onKnock: () => void; count: number };

/** The club door: sign, frame, mat, and a door panel that swings open. */
export default function Door({ phase, onKnock, count }: Props) {
  const reduce = useReducedMotion();
  const opening = phase === "open" || phase === "zoom";

  return (
    <div className="relative" style={{ width: W, height: H, perspective: 1400 }}>
      {/* light behind the door */}
      <div
        className="absolute overflow-hidden"
        style={{ left: DX, top: DY, width: DW, height: DH, background: "radial-gradient(120% 90% at 30% 60%, #fff6c9 0%, #ffe27a 45%, #ffc700 100%)" }}
      >
        <Sketch
          w={DW}
          h={DH}
          seed={12}
          className="absolute inset-0 h-full w-full opacity-50"
          shapes={[
            { t: "ellipse", cx: 70, cy: 120, w: 60, h: 60, o: { fill: "#ee46d3", hachureGap: 5 } },
            { t: "rect", x: 160, y: 220, w: 70, h: 90, o: { fill: "#18a0fb", hachureGap: 5 } },
            { t: "poly", pts: [[40, 330], [110, 260], [130, 360]], o: { fill: "#1bc47d", hachureGap: 5 } },
          ]}
        />
      </div>

      <Sketch w={W} h={H} shapes={frame} seed={21} className="pointer-events-none absolute" style={{ left: -4, top: -4, width: W + 8, height: H + 8 }} />
      <p className="pointer-events-none absolute left-[64px] top-[50px] w-[292px] text-center font-marker text-[46px] leading-[0.9] text-ink">EXPERIENCE CLUB</p>
      <p className="pointer-events-none absolute left-[64px] top-[94px] w-[292px] text-center font-note text-[15px] text-ink-soft">knock to enter</p>
      <p className="pointer-events-none absolute text-center font-marker text-[26px] leading-none text-ink" style={{ left: DX + 30, top: DY + DH + 17, width: DW - 60 }}>
        WELCOME
      </p>

      <motion.button
        type="button"
        onClick={onKnock}
        disabled={phase !== "idle"}
        aria-label={`Knock on the door to enter the experience club: ${count} internships inside`}
        className="absolute origin-left outline-offset-4 disabled:cursor-default"
        style={{ left: DX, top: DY, width: DW, height: DH, transformStyle: "preserve-3d" }}
        initial={false}
        animate={
          opening
            ? { rotateY: reduce ? 0 : -108, opacity: reduce ? 0 : 1 }
            : phase === "knock" && !reduce
              ? { rotateY: [0, -2, 0, -2, 0], x: [0, -3, 2, -3, 0] }
              : { rotateY: 0, x: 0 }
        }
        whileHover={phase === "idle" && !reduce ? { rotateY: -7 } : undefined}
        transition={opening ? { duration: 0.75, ease: [0.5, 0, 0.2, 1] } : { duration: phase === "knock" ? 0.6 : 0.3 }}
      >
        <Sketch w={DW} h={DH} shapes={panel} seed={33} className="absolute" style={{ left: -4, top: -4, width: DW + 8, height: DH + 8 }} />
        <span className="absolute inset-x-[34px] top-[52px] text-center font-marker text-[34px] leading-[0.9] text-ink" style={{ backfaceVisibility: "hidden" }}>
          {count} INSIDE
          <span className="mt-1 block font-note text-[15px] leading-tight text-ink-soft">members only: my internships</span>
        </span>
      </motion.button>

      {/* knock knock */}
      {phase === "knock" &&
        ["knock", "knock!"].map((word, i) => (
          <motion.span
            key={word}
            aria-hidden
            className="pointer-events-none absolute font-marker text-[40px] text-ink"
            style={{ left: i ? DX + DW - 10 : DX - 80, top: DY + 150 + i * 46 }}
            initial={{ opacity: 0, scale: 0.6, rotate: i ? 10 : -12 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.1, 1, 1] }}
            transition={{ delay: i * 0.22, duration: 0.9, times: [0, 0.2, 0.7, 1] }}
          >
            {word}
          </motion.span>
        ))}
    </div>
  );
}

export const DOOR = { W, H, cx: DX + DW / 2, cy: DY + DH / 2 };

/** Two soft knocks, synthesised so there is no audio file to load. Only ever runs after a click. */
export function playKnock() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.2].forEach((at) => {
      const t = ctx.currentTime + at;
      const len = 0.12;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * len), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 520;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.9, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + len);
      src.connect(lp).connect(gain).connect(ctx.destination);
      src.start(t);
    });
    setTimeout(() => ctx.close(), 800);
  } catch {
    // No audio is fine.
  }
}
