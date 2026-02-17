'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { caseStudies } from '@/data/caseStudies';
import { Award, TrendingUp, Users } from 'lucide-react';

type FilterType = 'all' | 'winner' | 'top3' | 'finalist';

export default function CaseStudies() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [caseImages, setCaseImages] = useState<Record<string, string[]>>({});

  const selectedData = caseStudies.find((c) => c.id === selectedCase);

  useEffect(() => {
    const loadImages = async () => {
      const imageMap: Record<string, string[]> = {};
      for (const caseItem of caseStudies) {
        try {
          const res = await fetch(`/api/images?folder=case-studies/${caseItem.imageFolder}`);
          if (res.ok) imageMap[caseItem.imageFolder] = await res.json();
          else imageMap[caseItem.imageFolder] = [];
        } catch { imageMap[caseItem.imageFolder] = []; }
      }
      setCaseImages(imageMap);
    };
    loadImages();
  }, []);

  const filtered = caseStudies.filter((c) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'winner') return c.badgeStyle === 'win';
    if (activeFilter === 'top3') return c.rank.includes('#') && parseInt(c.rank.slice(1)) <= 3;
    if (activeFilter === 'finalist') return c.badgeStyle === 'finalist';
    return true;
  });

  return (
    <>
      <section id="case-studies" className="relative py-36 bg-black border-t border-border z-10">
        <div className="max-w-[1100px] mx-auto px-12">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-3">
            03 / Case Competitions
            <span className="flex-1 max-w-[60px] h-[1px] bg-gold opacity-40"></span>
          </p>
          <h2 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream mb-12">
            Where the <em className="italic text-gold">knight</em><br />made its move
          </h2>

          {/* Filter Tabs */}
          <div className="flex gap-1 bg-surface border border-border rounded-full p-1 w-fit mb-12">
            {[
              { key: 'all', label: 'ALL' },
              { key: 'winner', label: 'WINNERS' },
              { key: 'top3', label: 'TOP 3' },
              { key: 'finalist', label: 'FINALISTS' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as FilterType)}
                className={`px-6 py-2 rounded-full font-mono text-[11px] tracking-[0.1em] uppercase transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-gold-dim text-gold'
                    : 'text-cream-dim hover:text-cream'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((caseItem) => (
              <button
                key={caseItem.id}
                onClick={() => setSelectedCase(caseItem.id)}
                className="group relative bg-surface border border-border rounded p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_20px_60px_rgba(201,168,76,0.2)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gold after:to-transparent after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-400"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`font-display text-4xl font-black italic leading-none ${
                    caseItem.badgeStyle === 'win' ? 'text-gold' : 'text-gold/30'
                  }`}>
                    {caseItem.rank}
                  </div>
                  <span className={`font-mono text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded whitespace-nowrap ${
                    caseItem.badgeStyle === 'win' ? 'bg-gold/12 text-gold border border-gold/30' :
                    caseItem.badgeStyle === 'runner-up' ? 'bg-cream/8 text-cream-dim border border-border' :
                    'bg-cream/6 text-cream-dim border border-border'
                  }`}>
                    {caseItem.badge}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-cream leading-tight mb-2">
                  {caseItem.title}
                </h3>
                <p className="font-mono text-[10px] tracking-[0.1em] text-cream-dim/50 uppercase mb-4">
                  {caseItem.meta}
                </p>
                <p className="text-[13px] text-cream-dim leading-relaxed line-clamp-2">
                  {caseItem.problem}
                </p>

                <div className="flex items-center gap-2 mt-4 text-gold text-[11px] font-mono tracking-wider uppercase">
                  Click for details
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedCase && selectedData && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-8 overflow-y-auto"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="bg-surface border border-gold/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8 animate-[fadeUp_0.3s_ease_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            {caseImages[selectedData.imageFolder]?.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border-b border-border/30">
                {caseImages[selectedData.imageFolder].map((img, idx) => (
                  <div key={idx} className="relative h-40 rounded overflow-hidden bg-black/20 border border-border">
                    <Image src={`/case-studies/${selectedData.imageFolder}/${img}`} alt={`${selectedData.title} ${idx + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            )}

            <div className="p-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-display text-3xl font-black italic text-gold">{selectedData.rank}</span>
                    <span className={`font-mono text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded ${
                      selectedData.badgeStyle === 'win' ? 'bg-gold/12 text-gold border border-gold/30' :
                      'bg-cream/8 text-cream-dim border border-border'
                    }`}>
                      {selectedData.badge}
                    </span>
                  </div>
                  <h3 className="font-display text-3xl font-bold text-cream leading-tight mb-2">{selectedData.title}</h3>
                  <p className="text-sm text-cream-dim">{selectedData.meta}</p>
                </div>
                <button onClick={() => setSelectedCase(null)} className="text-cream-dim hover:text-gold transition-colors text-2xl leading-none">×</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: <Award size={16} />, label: 'Problem', text: selectedData.problem },
                  { icon: <TrendingUp size={16} />, label: 'Solution', text: selectedData.solution },
                  { icon: <Users size={16} />, label: 'Impact', text: selectedData.impact },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase text-gold mb-2">
                      {item.icon}
                      {item.label}
                    </div>
                    <p className="text-[13px] text-cream-dim leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              {selectedData.pptLink && (
                <div className="mt-6">
                  <a href={selectedData.pptLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-black font-mono text-[11px] tracking-wider uppercase rounded hover:bg-gold-light transition-colors">
                    <Award size={14} /> View Presentation
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
