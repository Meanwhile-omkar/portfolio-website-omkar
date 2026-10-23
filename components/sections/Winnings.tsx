'use client';

import { achievements, leadership } from '@/data/achievements';
import { Trophy, Medal, Crown, Megaphone, ArrowUpRight } from 'lucide-react';

export default function Winnings() {
  return (
    <section id="winnings" className="relative py-28 bg-black border-t border-border z-10">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-12">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-3">
            06 / Achievements
            <span className="flex-1 max-w-[60px] h-[1px] bg-gold opacity-40"></span>
          </p>
          <h2 className="font-display text-[clamp(28px,4vw,52px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream">
            Trophies on the <em className="italic text-gold">board</em>
          </h2>
        </div>

        {/* ACHIEVEMENTS - Clean Timeline List */}
        <div className="flex flex-col mb-20 relative">
          {/* Vertical decorative line for timeline effect */}
          <div className="absolute left-[27px] md:left-[35px] top-4 bottom-4 w-[1px] bg-white/10 hidden md:block" />

          {achievements.map((item, index) => {
            // Determine icon and color based on trophy emoji
            const isGold = item.trophy.includes('🏆');
            const Icon = isGold ? Trophy : Medal;
            
            // Split the title to separate the Rank (Winner) from the Event
            // Assuming format is "Rank – Event" or "Rank- Event"
            const parts = item.title.split(/[–-]/); 
            const rank = parts[0] || item.title;
            const details = parts.slice(1).join('–');

            return (
              <div 
                key={index}
                className="group relative grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] items-start gap-6 py-6 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors duration-300 px-2"
              >
                {/* Year Column */}
                <div className="font-mono text-xs text-cream-dim/60 pt-1 text-right md:text-center group-hover:text-gold transition-colors">
                  {item.year}
                </div>

                {/* Content Column */}
                <div className="flex items-start gap-4">
                  {/* Icon with glow effect */}
                  <div className={`
                    relative flex items-center justify-center w-8 h-8 rounded-full border bg-black z-10
                    ${isGold ? 'border-gold/30 text-gold shadow-[0_0_15px_-3px_rgba(255,215,0,0.3)]' : 'border-cream/20 text-cream-dim'}
                  `}>
                    <Icon size={14} strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 pt-0.5">
                    <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                      <span className={`text-sm font-bold tracking-wide ${isGold ? 'text-gold' : 'text-cream'}`}>
                        {rank.trim()}
                      </span>
                      {details && (
                        <span className="hidden md:inline-block w-1 h-1 rounded-full bg-white/20"></span>
                      )}
                      <span className="text-sm text-cream-dim group-hover:text-cream transition-colors">
                        {details ? details.trim() : ''}
                      </span>
                    </div>
                    
                    {/* Organization subtext */}
                    <div className="mt-1.5 text-xs text-white/40 font-mono tracking-tight flex items-center gap-2">
                      <span className="w-2 h-[1px] bg-white/20"></span>
                      {item.org}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* LEADERSHIP - Glass Grid */}
        <div className="space-y-6">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold flex items-center gap-3">
            Leadership
            <span className="flex-1 max-w-[40px] h-[1px] bg-gold opacity-40"></span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leadership.map((pos, index) => {
              const isCrown = pos.icon.includes('👑');
              return (
                <div 
                  key={index} 
                  className="group relative p-6 rounded-lg bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 hover:border-gold/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Hover Glow Background */}
                  <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative flex justify-between items-start mb-4">
                    <div className={`p-2 rounded border bg-black/50 backdrop-blur-sm ${isCrown ? 'border-gold/30 text-gold' : 'border-white/10 text-cream-dim'}`}>
                      {isCrown ? <Crown size={18} strokeWidth={1.5} /> : <Megaphone size={18} strokeWidth={1.5} />}
                    </div>
                    <span className="font-mono text-[10px] text-cream-dim/60 border border-white/5 px-2 py-1 rounded bg-black/30">
                      {pos.duration}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-cream text-base font-bold leading-tight mb-1 group-hover:text-gold transition-colors">
                      {pos.role}
                    </h3>
                    <p className="text-xs text-cream-dim mb-3">{pos.org}</p>
                    <p className="text-xs text-white/40 leading-relaxed border-t border-white/5 pt-3">
                      {pos.description}
                    </p>
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