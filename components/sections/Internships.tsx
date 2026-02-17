'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { internships } from '@/data/internships';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

export default function Internships() {
  const [selectedInternship, setSelectedInternship] = useState<number | null>(null);
  const [internshipImages, setInternshipImages] = useState<Record<string, string[]>>({});

  const selectedData = internships.find((i) => i.id === selectedInternship);

  useEffect(() => {
    const loadImages = async () => {
      const imageMap: Record<string, string[]> = {};
      for (const internship of internships) {
        try {
          const res = await fetch(`/api/images?folder=internships/${internship.imageFolder}`);
          if (res.ok) imageMap[internship.imageFolder] = await res.json();
          else imageMap[internship.imageFolder] = [];
        } catch { imageMap[internship.imageFolder] = []; }
      }
      setInternshipImages(imageMap);
    };
    loadImages();
  }, []);

  return (
    <>
      <section id="internships" className="relative py-36 bg-deep border-t border-border z-10">
        <div className="max-w-[1100px] mx-auto px-12">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-3">
            04 / Work Experience
            <span className="flex-1 max-w-[60px] h-[1px] bg-gold opacity-40"></span>
          </p>
          <h2 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream mb-16">
            Where I've <em className="italic text-gold">contributed</em>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {internships.map((internship) => (
              <button
                key={internship.id}
                onClick={() => setSelectedInternship(internship.id)}
                className="relative bg-surface border border-border rounded p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.25)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gold after:to-transparent after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-400"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 rounded flex items-center gap-1.5 ${
                    internship.type === 'on-site' ? 'bg-tech-blue/10 text-tech-blue' :
                    internship.type === 'remote' ? 'bg-gold/10 text-gold' :
                    'bg-cream/10 text-cream'
                  }`}>
                    <MapPin size={10} />
                    {internship.type}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-cream leading-tight mb-2">{internship.company}</h3>
                <p className="text-[13px] text-gold mb-3 flex items-center gap-1.5">
                  <Briefcase size={12} />
                  {internship.role}
                </p>
                <p className="text-[13px] text-cream-dim leading-relaxed mb-5 line-clamp-3">{internship.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {internship.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="font-mono text-[9px] tracking-[0.08em] text-[rgba(245,239,224,0.35)] border border-border px-2 py-0.5 rounded-sm">{skill}</span>
                  ))}
                  {internship.skills.length > 3 && <span className="font-mono text-[9px] text-[rgba(245,239,224,0.35)]">+{internship.skills.length - 3}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedInternship && selectedData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8 overflow-y-auto" onClick={() => setSelectedInternship(null)}>
          <div className="bg-surface border border-gold/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8" onClick={(e) => e.stopPropagation()}>
            {internshipImages[selectedData.imageFolder]?.length > 0 && (
              <div className="grid grid-cols-2 gap-2 p-4 border-b border-border/30">
                {internshipImages[selectedData.imageFolder].map((img, idx) => (
                  <div key={idx} className="relative h-48 rounded overflow-hidden bg-black/20">
                    <Image src={`/internships/${selectedData.imageFolder}/${img}`} alt={`${selectedData.company} ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="p-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded flex items-center gap-1.5 ${
                      selectedData.type === 'on-site' ? 'bg-tech-blue/10 text-tech-blue' : selectedData.type === 'remote' ? 'bg-gold/10 text-gold' : 'bg-cream/10 text-cream'
                    }`}>
                      <MapPin size={10} />
                      {selectedData.type}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-cream-dim flex items-center gap-1.5">
                      <Calendar size={10} />
                      {selectedData.location}
                    </span>
                  </div>
                  <h3 className="font-display text-3xl font-bold text-cream leading-tight mb-2">{selectedData.company}</h3>
                  <p className="text-lg text-gold mb-1 flex items-center gap-2">
                    <Briefcase size={16} />
                    {selectedData.role}
                  </p>
                  <p className="text-sm text-cream-dim">{selectedData.duration}</p>
                </div>
                <button onClick={() => setSelectedInternship(null)} className="text-cream-dim hover:text-gold transition-colors text-2xl leading-none">×</button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-gold mb-2">About</div>
                  <p className="text-[14px] text-cream-dim leading-relaxed">{selectedData.description}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-gold mb-3">Key Responsibilities</div>
                  <ul className="space-y-2">
                    {selectedData.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex gap-3 text-[14px] text-cream-dim leading-relaxed">
                        <span className="text-gold mt-1 flex-shrink-0">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-gold mb-2">Impact</div>
                  <p className="text-[14px] text-cream-dim leading-relaxed">{selectedData.impact}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-gold mb-2">Skills Used</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedData.skills.map((skill) => (
                      <span key={skill} className="font-mono text-[11px] tracking-[0.08em] text-cream-dim border border-border px-3 py-1 rounded">{skill}</span>
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
