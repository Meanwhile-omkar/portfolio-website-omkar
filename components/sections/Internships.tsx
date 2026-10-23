'use client';

import { useState } from 'react';
import { internships } from '@/data/internships';
import { Briefcase, MapPin } from 'lucide-react';

export default function Internships() {
  const [selectedInternship, setSelectedInternship] = useState<number | null>(null);

  const selectedData = internships.find((i) => i.id === selectedInternship);

  return (
    <>
      <section id="internships" className="relative py-36 bg-deep border-t border-border z-10">
        <div className="max-w-[1100px] mx-auto px-12">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-3">
            04 / Work Experience
            <span className="flex-1 max-w-[60px] h-[1px] bg-gold opacity-40"></span>
          </p>
          <h2 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream mb-16">
            Where I&apos;ve <em className="italic text-gold">contributed</em>
          </h2>

          {/* Horizontal Timeline */}
          <div className="relative">
            {/* Timeline bar */}
            <div className="absolute top-[28px] left-0 right-0 h-[1px] bg-border z-0" />
            <div className="absolute top-[28px] left-0 right-0 h-[1px] bg-gradient-to-r from-gold/60 via-gold/20 to-transparent z-0" />

            {/* Nodes row */}
            <div className="relative z-10 grid grid-cols-5 gap-2 mb-12">
              {internships.map((internship) => (
                <button
                  key={internship.id}
                  onClick={() => setSelectedInternship(internship.id === selectedInternship ? null : internship.id)}
                  className="flex flex-col items-center gap-0 group"
                >
                  {/* Dot */}
                  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 mb-3 ${
                    selectedInternship === internship.id
                      ? 'bg-gold border-gold shadow-[0_0_12px_rgba(201,168,76,0.6)]'
                      : 'bg-deep border-border group-hover:border-gold/60'
                  }`} />
                  {/* Period label */}
                  <span className="font-mono text-[9px] tracking-[0.1em] text-cream-dim group-hover:text-gold transition-colors text-center">
                    {internship.period}
                  </span>
                </button>
              ))}
            </div>

            {/* Cards row */}
            <div className="grid grid-cols-5 gap-2">
              {internships.map((internship) => (
                <button
                  key={internship.id}
                  onClick={() => setSelectedInternship(internship.id === selectedInternship ? null : internship.id)}
                  className={`relative p-5 rounded border text-left transition-all duration-300 hover:-translate-y-1 ${
                    selectedInternship === internship.id
                      ? 'bg-surface border-gold/40 shadow-[0_16px_40px_rgba(201,168,76,0.15)]'
                      : 'bg-surface border-border hover:border-gold/25'
                  } after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gold after:to-transparent after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300`}
                >
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className={`font-mono text-[8px] tracking-[0.15em] uppercase px-1.5 py-0.5 rounded ${
                      internship.type === 'on-site' ? 'bg-tech-blue/10 text-tech-blue' :
                      internship.type === 'remote' ? 'bg-gold/10 text-gold' :
                      'bg-cream/10 text-cream'
                    }`}>
                      {internship.type}
                    </span>
                  </div>
                  <h3 className="font-display text-[13px] font-bold text-cream leading-tight mb-1">
                    {internship.company}
                  </h3>
                  <p className="text-[11px] text-gold flex items-center gap-1 mb-2">
                    <Briefcase size={9} />
                    {internship.role}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {internship.skills.slice(0, 2).map((skill) => (
                      <span key={skill} className="font-mono text-[8px] text-[rgba(245,239,224,0.3)] border border-border px-1.5 py-0.5 rounded-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedInternship && selectedData && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8 overflow-y-auto"
          onClick={() => setSelectedInternship(null)}
        >
          <div
            className="bg-surface border border-gold/30 rounded-lg max-w-2xl w-full my-8 animate-[fadeUp_0.3s_ease_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded flex items-center gap-1.5 ${
                      selectedData.type === 'on-site' ? 'bg-tech-blue/10 text-tech-blue' :
                      selectedData.type === 'remote' ? 'bg-gold/10 text-gold' :
                      'bg-cream/10 text-cream'
                    }`}>
                      <MapPin size={10} />
                      {selectedData.type}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-cream leading-tight mb-1">{selectedData.company}</h3>
                  <p className="text-base text-gold flex items-center gap-2 mb-1">
                    <Briefcase size={14} />
                    {selectedData.role}
                  </p>
                  <p className="text-sm text-cream-dim">{selectedData.duration}</p>
                </div>
                <button onClick={() => setSelectedInternship(null)} className="text-cream-dim hover:text-gold transition-colors text-2xl leading-none">×</button>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-gold mb-2">About</div>
                  <p className="text-[14px] text-cream-dim leading-relaxed">{selectedData.description}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-gold mb-3">What I Did</div>
                  <ul className="space-y-2">
                    {selectedData.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex gap-3 text-[13px] text-cream-dim leading-relaxed">
                        <span className="text-gold mt-1 flex-shrink-0">—</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-gold mb-2">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedData.skills.map((skill) => (
                      <span key={skill} className="font-mono text-[11px] text-cream-dim border border-border px-3 py-1 rounded">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
