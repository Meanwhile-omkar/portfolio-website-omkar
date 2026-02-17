'use client';

import { achievements, leadership } from '@/data/achievements';
import { Trophy, Medal, Award, Crown, Target } from 'lucide-react';

const getTrophyIcon = (emoji: string) => {
  if (emoji.includes('🏆')) return Trophy;
  if (emoji.includes('🥈')) return Medal;
  if (emoji.includes('🏅')) return Award;
  return Trophy;
};

export default function Winnings() {
  return (
    <section id="winnings" className="relative py-36 bg-black border-t border-border z-10">
      <div className="max-w-[1100px] mx-auto px-12">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-3">
          06 / Achievements
          <span className="flex-1 max-w-[60px] h-[1px] bg-gold opacity-40"></span>
        </p>
        <h2 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream mb-16">
          Trophies on the <em className="italic text-gold">board</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {achievements.map((achievement, index) => {
            const Icon = getTrophyIcon(achievement.trophy);
            return (
              <div
                key={index}
                className="group relative p-8 bg-surface border border-border rounded transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_20px_60px_rgba(201,168,76,0.15)]"
              >
                <div className="flex items-start gap-4">
                  <div className="text-gold flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-cream leading-tight mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-[13px] text-cream-dim leading-relaxed mb-1">
                      {achievement.org}
                    </p>
                    <p className="font-mono text-[10px] tracking-wider uppercase text-gold">
                      {achievement.year}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leadership Positions */}
        <div className="mt-20">
          <h3 className="font-display text-3xl font-bold text-cream mb-8">
            Leadership <em className="italic text-gold">Positions</em>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {leadership.map((position, index) => {
              const Icon = position.icon.includes('👑') ? Crown : Target;
              return (
                <div key={index} className="p-8 bg-surface border border-border rounded">
                  <div className="flex items-start gap-4">
                    <div className="text-gold">
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-display text-xl font-bold text-cream mb-2">{position.role}</h4>
                      <p className="text-[13px] text-cream-dim mb-1">{position.org}</p>
                      <p className="font-mono text-[10px] tracking-wider uppercase text-gold">{position.duration}</p>
                      <p className="text-[13px] text-cream-dim mt-3 leading-relaxed">
                        {position.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
