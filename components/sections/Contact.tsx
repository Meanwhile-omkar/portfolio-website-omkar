'use client';

import { Mail, Linkedin, Github } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="relative py-36 pb-48 bg-black border-t border-border z-10 text-center">
      <div className="max-w-2xl mx-auto px-12">
        <span className="text-6xl block mb-8 animate-[float_4s_ease-in-out_infinite]">
          ♞
        </span>

        <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold text-cream mb-4">
          Let's make an<br /><em className="italic text-gold">unexpected move.</em>
        </h2>

        <p className="text-[15px] text-cream-dim leading-relaxed mb-12">
          Whether you're looking for a consulting intern, a product thinking partner, or someone who can bridge data and strategy — I'd love to talk. The knight is always open for its next gambit.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href="mailto:omkar.djsce27@gmail.com"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded bg-gold text-black font-mono text-xs tracking-wider uppercase font-medium transition-all hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(201,168,76,0.3)]"
          >
            <Mail size={14} strokeWidth={2} />
            Send a Message
          </a>

          <a
            href="https://www.linkedin.com/in/omkar-haryan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded border border-border text-cream font-mono text-xs tracking-wider uppercase transition-all hover:border-cream-dim hover:-translate-y-0.5"
          >
            <Linkedin size={14} strokeWidth={2} />
            LinkedIn
          </a>

          <a
            href="https://github.com/Meanwhile-omkar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded border border-border text-cream font-mono text-xs tracking-wider uppercase transition-all hover:border-cream-dim hover:-translate-y-0.5"
          >
            <Github size={14} strokeWidth={2} />
            GitHub
          </a>
        </div>

        <div className="mt-16 pt-8 border-t border-border/30">
          <p className="font-mono text-[10px] tracking-wider uppercase text-cream-dim/40">
            Built with Next.js · TypeScript · Tailwind CSS
          </p>
          <p className="font-mono text-[10px] tracking-wider uppercase text-cream-dim/40 mt-2">
            © 2026 Omkar Haryan · The Knight's Gambit
          </p>
        </div>
      </div>
    </section>
  );
}
