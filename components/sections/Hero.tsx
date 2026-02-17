'use client';

import { GraduationCap } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Giant knight background */}
      <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 w-[55vw] max-w-[700px] opacity-[0.04] pointer-events-none select-none text-white text-[200px]">
        ♞
      </div>

      <div className="relative z-10 max-w-[1100px] w-full px-12">
        <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-gold mb-6 flex items-center gap-3 opacity-0 animate-[fadeUp_0.8s_ease_0.3s_forwards]">
          <span className="w-8 h-[1px] bg-gold inline-block"></span>
          Pre-Final Year · DJ Sanghvi COE · Data Science Engineering
        </p>

        <h1 className="font-display text-[clamp(52px,8vw,110px)] font-black leading-[0.92] tracking-[-0.02em] text-cream opacity-0 animate-[fadeUp_0.8s_ease_0.5s_forwards]">
          Omkar<br />
          <em className="italic text-gold">Haryan.</em>
        </h1>

        <p className="mt-8 text-[15px] text-cream-dim max-w-[480px] leading-[1.7] opacity-0 animate-[fadeUp_0.8s_ease_0.7s_forwards]">
          An engineer who thinks in systems — and moves like a knight.
          Technical depth paired with strategic instinct, at the intersection of data science and business consulting.
        </p>

        <div className="mt-12 flex gap-4 opacity-0 animate-[fadeUp_0.8s_ease_0.9s_forwards]">
          <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-[rgba(74,158,255,0.3)] bg-[rgba(74,158,255,0.06)] text-tech-blue font-mono text-[11px] tracking-[0.1em] uppercase transition-transform hover:-translate-y-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-tech-blue"></span>
            Data Science & Engineering
          </div>
          <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-[rgba(201,168,76,0.3)] bg-gold-dim text-gold font-mono text-[11px] tracking-[0.1em] uppercase transition-transform hover:-translate-y-0.5">
            <span className="text-base">♞</span>
            Strategy & Consulting
          </div>
        </div>

        <div className="inline-flex items-center gap-4 px-6 py-4 border border-border rounded bg-surface mt-8 opacity-0 animate-[fadeUp_0.8s_ease_1.1s_forwards]">
          <GraduationCap size={28} className="text-gold" strokeWidth={1.5} />
          <div className="text-[13px] text-cream-dim leading-[1.5]">
            <div className="font-display text-[15px] text-cream font-bold">DJ Sanghvi College of Engineering</div>
            B.Tech Data Science Engineering · 2023 – 2027 · CGPA: 8.82
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-[fadeUp_0.8s_ease_1.2s_forwards] text-[rgba(245,239,224,0.3)] font-mono text-[10px] tracking-[0.15em] uppercase">
        <div className="w-[1px] h-10 bg-gradient-to-b from-[rgba(201,168,76,0.5)] to-transparent animate-[scrollPulse_2s_ease-in-out_infinite]"></div>
        scroll
      </div>
    </section>
  );
}
