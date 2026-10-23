'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { caseStudies } from '@/data/caseStudies';
import { Award, TrendingUp, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 4;

export default function CaseStudies() {
  const [page, setPage] = useState(0);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [caseImages, setCaseImages] = useState<Record<string, string[]>>({});

  const totalPages = Math.ceil(caseStudies.length / PAGE_SIZE);
  const visible = caseStudies.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
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

  return (
    <>
      <section id="case-studies" className="relative py-36 bg-black border-t border-border z-10">
        <div className="max-w-[1100px] mx-auto px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-3">
                03 / Case Competitions
                <span className="flex-1 max-w-[60px] h-[1px] bg-gold opacity-40"></span>
              </p>
              <h2 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream">
                Where the <em className="italic text-gold">knight</em><br />made its move
              </h2>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-3 pb-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-9 h-9 flex items-center justify-center rounded border border-border text-cream-dim hover:border-gold/50 hover:text-gold transition-all disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-mono text-[11px] text-cream-dim tracking-wider">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="w-9 h-9 flex items-center justify-center rounded border border-border text-cream-dim hover:border-gold/50 hover:text-gold transition-all disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Cards Grid — always 2 cols, 2 rows = 4 visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visible.map((caseItem) => (
              <button
                key={caseItem.id}
                onClick={() => setSelectedCase(caseItem.id)}
                className="group relative bg-surface border border-border rounded p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_20px_60px_rgba(201,168,76,0.2)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gold after:to-transparent after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-400"
              >
                <div className="flex items-start justify-between mb-4">
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

          {/* Page dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === page ? 'w-6 bg-gold' : 'w-2 bg-border hover:bg-gold/40'
                }`}
              />
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
                  <span className={`font-mono text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded mb-3 inline-block ${
                    selectedData.badgeStyle === 'win' ? 'bg-gold/12 text-gold border border-gold/30' :
                    'bg-cream/8 text-cream-dim border border-border'
                  }`}>
                    {selectedData.badge}
                  </span>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
