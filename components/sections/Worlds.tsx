'use client';

import { Laptop } from 'lucide-react';

export default function Worlds() {
  return (
    <section id="worlds" className="relative py-36 bg-black border-t border-border z-10">
      <div className="max-w-[1100px] mx-auto px-12">
        <div className="text-center mb-20">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center justify-center gap-3">
            <span className="w-[60px] h-[1px] bg-gold opacity-40"></span>
            02 / Two Worlds
            <span className="w-[60px] h-[1px] bg-gold opacity-40"></span>
          </p>
          <h2 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream">
            Where I <em className="italic text-gold">live</em> & where I <em className="italic text-gold">thrive</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0.5">
          <div className="group relative p-16 min-h-[480px] overflow-hidden bg-[rgba(74,158,255,0.03)] border border-[rgba(74,158,255,0.12)] transition-all duration-400 hover:-translate-y-1 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top_left,rgba(74,158,255,0.08)_0%,transparent_70%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity">
            <Laptop size={32} className="text-tech-blue mb-6" strokeWidth={1.5} />
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-tech-blue mb-3">Technical Domain</p>
            <h3 className="font-display text-[32px] font-bold text-cream mb-5 leading-[1.1]">
              Data Science<br />& Engineering
            </h3>
            <p className="text-[14px] text-cream-dim leading-[1.8] mb-8">
              Building intelligent systems from the ground up — machine learning models, data pipelines, and full-stack products. The technical foundation that makes me dangerous in a boardroom.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Python', 'Machine Learning', 'SQL', 'Data Analysis', 'NLP', 'Power BI', 'GenAI'].map((tag) => (
                <span key={tag} className="font-mono text-[10px] tracking-[0.08em] uppercase px-3 py-1 rounded border border-[rgba(74,158,255,0.3)] bg-[rgba(74,158,255,0.06)] text-tech-blue">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="group relative p-16 min-h-[480px] overflow-hidden bg-[rgba(201,168,76,0.03)] border border-[rgba(201,168,76,0.12)] transition-all duration-400 hover:-translate-y-1 before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top_right,rgba(201,168,76,0.1)_0%,transparent_70%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity">
            <span className="text-4xl mb-6 block">♞</span>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-gold mb-3">Strategic Domain</p>
            <h3 className="font-display text-[32px] font-bold text-cream mb-5 leading-[1.1]">
              Consulting &<br />Product Strategy
            </h3>
            <p className="text-[14px] text-cream-dim leading-[1.8] mb-8">
              Solving real business problems. Frameworks, go-to-market strategy, product roadmaps, and case competition victories — this is where my heart lives. The knight's gambit.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Case Studies', 'Product Management', 'Business Strategy', 'Market Research', 'Consulting', 'Competitive Analysis'].map((tag) => (
                <span key={tag} className="font-mono text-[10px] tracking-[0.08em] uppercase px-3 py-1 rounded border border-[rgba(201,168,76,0.2)] bg-gold-dim text-gold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
