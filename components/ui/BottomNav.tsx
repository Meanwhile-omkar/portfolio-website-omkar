'use client';

import { useState, useEffect } from 'react';
import { Home, User, Layers, Award, Briefcase, Wrench, Trophy, Camera, Mail } from 'lucide-react';

const navItems = [
  { id: 'hero', icon: Home, label: 'Home', desc: 'Back to top' },
  { id: 'about', icon: User, label: 'Philosophy', desc: 'The knight\'s mindset' },
  { id: 'worlds', icon: Layers, label: 'Domains', desc: 'Tech & Strategy' },
  { id: 'case-studies', icon: Award, label: 'Cases', desc: 'Competition wins' },
  { id: 'internships', icon: Briefcase, label: 'Work', desc: 'Experience' },
  { id: 'projects', icon: Wrench, label: 'Projects', desc: 'Things I built' },
  { id: 'winnings', icon: Trophy, label: 'Achievements', desc: 'Trophies & leadership' },
  { id: 'gallery', icon: Camera, label: 'Gallery', desc: 'Moments captured' },
  { id: 'contact', icon: Mail, label: 'Contact', desc: 'Let\'s connect' },
];

export default function BottomNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + window.innerHeight / 2;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-7 left-1/2 -translate-x-1/2 z-50 flex gap-1 bg-deep/90 backdrop-blur-xl border border-border rounded-full px-4 py-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(201,168,76,0.08)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        const isHovered = hoveredId === item.id;

        return (
          <div key={item.id} className="relative">
            <button
              onClick={() => scrollTo(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${
                isActive ? 'bg-gold-dim text-gold' : 'text-cream-dim hover:bg-gold-dim hover:text-gold'
              }`}
            >
              <Icon size={18} strokeWidth={1.5} className="transition-transform duration-300 hover:scale-110" />
            </button>

            {isHovered && (
              <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 pointer-events-none animate-[fadeUp_0.2s_ease_forwards]">
                <div className="bg-surface border border-border rounded px-3 py-2 shadow-lg whitespace-nowrap">
                  <div className="font-mono text-[10px] tracking-wider uppercase text-gold mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-cream-dim">
                    {item.desc}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
