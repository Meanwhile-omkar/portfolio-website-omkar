'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { projects } from '@/data/projects';
import { Code2, Zap, Package, FlaskRound } from 'lucide-react';

type FilterType = 'all' | 'technical' | 'hackathon' | 'product' | 'research';

const typeIcons = {
  tech: Code2,
  hack: Zap,
  strategy: Package,
  research: FlaskRound,
};

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projectImages, setProjectImages] = useState<Record<string, string[]>>({});

  const selectedData = projects.find((p) => p.id === selectedProject);

  useEffect(() => {
    const loadImages = async () => {
      const imageMap: Record<string, string[]> = {};
      for (const project of projects) {
        try {
          const res = await fetch(`/api/images?folder=projects/${project.imageFolder}`);
          if (res.ok) imageMap[project.imageFolder] = await res.json();
          else imageMap[project.imageFolder] = [];
        } catch { imageMap[project.imageFolder] = []; }
      }
      setProjectImages(imageMap);
    };
    loadImages();
  }, []);

  const filtered = projects.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'technical') return p.typeColor === 'tech';
    if (activeFilter === 'hackathon') return p.typeColor === 'hack';
    if (activeFilter === 'product') return p.typeColor === 'strategy';
    if (activeFilter === 'research') return p.typeColor === 'research';
    return true;
  });

  return (
    <>
      <section id="projects" className="relative py-36 bg-deep border-t border-border z-10">
        <div className="max-w-[1100px] mx-auto px-12">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-3">
            05 / Projects
            <span className="flex-1 max-w-[60px] h-[1px] bg-gold opacity-40"></span>
          </p>
          <h2 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream mb-12">
            Things I've <em className="italic text-gold">built</em>
          </h2>

          {/* Filter Tabs */}
          <div className="flex gap-1 bg-surface border border-border rounded-full p-1 w-fit mb-12">
            {[
              { key: 'all', label: 'ALL' },
              { key: 'technical', label: 'TECHNICAL' },
              { key: 'hackathon', label: 'HACKATHON' },
              { key: 'product', label: 'PRODUCT' },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project) => {
              const Icon = typeIcons[project.typeColor as keyof typeof typeIcons];
              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className="relative bg-surface border border-border rounded p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.25)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gold after:to-transparent after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-400"
                >
                  <p className={`font-mono text-[9px] tracking-[0.2em] uppercase mb-4 flex items-center gap-2 ${
                    project.typeColor === 'tech' ? 'text-tech-blue' :
                    project.typeColor === 'strategy' ? 'text-gold' :
                    project.typeColor === 'research' ? 'text-[#10b981]' :
                    'text-[#a855f7]'
                  }`}>
                    <Icon size={12} strokeWidth={2} />
                    {project.type}
                  </p>
                  <h3 className="font-display text-xl font-bold text-cream leading-tight mb-3">
                    {project.name}
                  </h3>
                  <p className="text-[13px] text-cream-dim leading-relaxed mb-5 line-clamp-3">
                    {project.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span key={tech} className="font-mono text-[9px] tracking-[0.08em] text-[rgba(245,239,224,0.35)] border border-border px-2 py-0.5 rounded-sm">
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 4 && <span className="font-mono text-[9px] text-[rgba(245,239,224,0.35)]">+{project.stack.length - 4}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal (same as before but with icons) */}
      {selectedProject && selectedData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8 overflow-y-auto" onClick={() => setSelectedProject(null)}>
          <div className="bg-surface border border-gold/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8" onClick={(e) => e.stopPropagation()}>
            {projectImages[selectedData.imageFolder]?.length > 0 && (
              <div className="grid grid-cols-1 gap-2 p-4 border-b border-border/30">
                {projectImages[selectedData.imageFolder].map((img, idx) => (
                  <div key={idx} className="relative h-64 rounded overflow-hidden bg-black/20">
                    <Image src={`/projects/${selectedData.imageFolder}/${img}`} alt={`${selectedData.name} screenshot ${idx + 1}`} fill className="object-contain" />
                  </div>
                ))}
              </div>
            )}

            <div className="p-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className={`font-mono text-[10px] tracking-[0.2em] uppercase mb-3 flex items-center gap-2 ${
                    selectedData.typeColor === 'tech' ? 'text-tech-blue' : selectedData.typeColor === 'strategy' ? 'text-gold' : selectedData.typeColor === 'research' ? 'text-[#10b981]' : 'text-[#a855f7]'
                  }`}>
                    {React.createElement(typeIcons[selectedData.typeColor as keyof typeof typeIcons], { size: 12 })}
                    {selectedData.type}
                  </p>
                  <h3 className="font-display text-3xl font-bold text-cream leading-tight">{selectedData.name}</h3>
                  <p className="text-sm text-cream-dim mt-1">{selectedData.subtitle}</p>
                </div>
                <button onClick={() => setSelectedProject(null)} className="text-cream-dim hover:text-gold transition-colors text-2xl leading-none">×</button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-gold mb-2">Overview</div>
                  <p className="text-[14px] text-cream-dim leading-relaxed">{selectedData.fullDesc}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-gold mb-2">Impact</div>
                  <p className="text-[14px] text-cream-dim leading-relaxed">{selectedData.impact}</p>
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-gold mb-2">Tech Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedData.stack.map((tech) => (
                      <span key={tech} className="font-mono text-[11px] tracking-[0.08em] text-cream-dim border border-border px-3 py-1 rounded">{tech}</span>
                    ))}
                  </div>
                </div>
                {Object.keys(selectedData.links).length > 0 && (
                  <div className="flex gap-3 pt-4">
                    {selectedData.links.demo && (
                      <a href={selectedData.links.demo} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-gold text-black font-mono text-[11px] tracking-wider uppercase rounded hover:bg-gold-light transition-colors flex items-center gap-2">
                        <Zap size={14} /> Live Demo
                      </a>
                    )}
                    {selectedData.links.github && (
                      <a href={selectedData.links.github} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-border text-cream font-mono text-[11px] tracking-wider uppercase rounded hover:border-cream-dim transition-colors flex items-center gap-2">
                        <Code2 size={14} /> GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
