'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { projects } from '@/data/projects';
import { Code2, Zap, Package, FlaskRound, ChevronLeft, ChevronRight } from 'lucide-react';

const typeIcons = {
  tech: Code2,
  hack: Zap,
  strategy: Package,
  research: FlaskRound,
};

const PAGE_SIZE = 4;

export default function Projects() {
  const [page, setPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projectImages, setProjectImages] = useState<Record<string, string[]>>({});

  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const visible = projects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
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

  return (
    <>
      <section id="projects" className="relative py-36 bg-deep border-t border-border z-10">
        <div className="max-w-[1100px] mx-auto px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-3">
                05 / Projects
                <span className="flex-1 max-w-[60px] h-[1px] bg-gold opacity-40"></span>
              </p>
              <h2 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream">
                Things I&apos;ve <em className="italic text-gold">built</em>
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

          {/* Cards Grid — 2×2 = 4 visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visible.map((project) => {
              const Icon = typeIcons[project.typeColor as keyof typeof typeIcons];
              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className="group relative bg-surface border border-border rounded p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.25)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-gold after:to-transparent after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-400"
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
                  <div className="flex items-center gap-2 mt-5 text-gold text-[11px] font-mono tracking-wider uppercase">
                    Click for details
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </button>
              );
            })}
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
                    {(() => { const ModalIcon = typeIcons[selectedData.typeColor as keyof typeof typeIcons]; return <ModalIcon size={12} />; })()}
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
                {(selectedData.links.demo || selectedData.links.github) && (
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
