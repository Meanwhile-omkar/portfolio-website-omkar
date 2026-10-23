'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const WIDTHS     = [280, 380, 260, 460, 320, 420, 300, 500, 340, 240];
const ROTATIONS  = [-3, 1.5, -1, 2.5, -2, 0.5, -1.5, 2, -2.5, 1];

const ROW_CONFIG = [
  { direction: 'left',  duration: 52, height: 280, offset: 0   },
  { direction: 'right', duration: 70, height: 310, offset: -80 },
  { direction: 'left',  duration: 38, height: 250, offset: 0   },
] as const;

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/images?folder=gallery')
      .then((r) => r.ok ? r.json() : [])
      .then((imgs: string[]) => setImages(shuffled(imgs)))
      .catch(() => {});
  }, []);

  const hasImages = images.length > 0;
  const rows = ROW_CONFIG.map((_, rowIdx) =>
    hasImages
      ? images.filter((_, i) => i % 3 === rowIdx)
      : Array.from({ length: 6 }, (_, i) => `ph-${rowIdx}-${i}`)
  );

  return (
    <section id="gallery" className="relative py-24 bg-deep border-t border-border overflow-hidden z-10">
      <div className="max-w-[1100px] mx-auto px-12 mb-16">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-3">
          07 / In The Field
          <span className="flex-1 max-w-[60px] h-[1px] bg-gold opacity-40"></span>
        </p>
        <h2 className="font-display text-[clamp(52px,7vw,96px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream">
          The <em className="italic text-gold">journey</em>
        </h2>
        <p className="mt-4 text-[15px] text-cream-dim">
          Hover a row to pause it.
        </p>
      </div>

      <div className="flex flex-col gap-8 -rotate-[1.2deg] scale-[1.05] origin-center">
        {ROW_CONFIG.map((cfg, rowIdx) => (
          <MarqueeRow
            key={rowIdx}
            items={rows[rowIdx]}
            isPlaceholder={!hasImages}
            direction={cfg.direction}
            duration={cfg.duration}
            rowHeight={cfg.height}
            offset={cfg.offset}
            rowIndex={rowIdx}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-deep to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-deep to-transparent z-20" />
    </section>
  );
}

function MarqueeRow({
  items, isPlaceholder, direction, duration, rowHeight, offset, rowIndex,
}: {
  items: string[];
  isPlaceholder: boolean;
  direction: 'left' | 'right';
  duration: number;
  rowHeight: number;
  offset: number;
  rowIndex: number;
}) {
  const [paused, setPaused] = useState(false);
  const loop = [...items, ...items, ...items, ...items];

  return (
    <div
      className="flex overflow-hidden"
      style={{ marginLeft: offset }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          display: 'flex',
          gap: '20px',
          animation: `${direction === 'left' ? 'marqueeLeft' : 'marqueeRight'} ${duration}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {loop.map((item, i) => {
          const idx = (rowIndex * 3 + i) % WIDTHS.length;
          return (
            <PhotoCard
              key={`${item}-${i}`}
              src={isPlaceholder ? null : `/gallery/${item}`}
              label={isPlaceholder ? null : item.split('.')[0].replace(/-/g, ' ')}
              width={WIDTHS[idx]}
              height={rowHeight}
              rotation={ROTATIONS[idx]}
            />
          );
        })}
      </div>
    </div>
  );
}

function PhotoCard({
  src, label, width, height, rotation,
}: {
  src: string | null;
  label: string | null;
  width: number;
  height: number;
  rotation: number;
}) {
  return (
    <div
      className="flex-shrink-0 cursor-pointer"
      style={{
        width,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        position: 'relative',
        zIndex: 1,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = `rotate(0deg) scale(1.07) translateY(-8px)`;
        el.style.zIndex = '20';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = `rotate(${rotation}deg) scale(1) translateY(0)`;
        el.style.zIndex = '1';
      }}
    >
      {/* Polaroid frame */}
      <div
        className="bg-[#f0ede6] shadow-[4px_8px_28px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.3)]"
        style={{ padding: '8px 8px 40px 8px' }}
      >
        <div className="relative overflow-hidden bg-surface" style={{ width: '100%', height }}>
          {src ? (
            <Image
              src={src}
              alt={label || 'Gallery photo'}
              fill
              sizes={`${width}px`}
              className="object-cover brightness-[0.9] saturate-[0.8] transition-all duration-700 hover:brightness-100 hover:saturate-100"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface to-border animate-pulse" />
          )}
        </div>

        <div className="mt-1.5 text-center font-mono text-[9px] tracking-[0.1em] uppercase truncate px-1"
          style={{ color: label ? '#5a5045' : 'transparent' }}>
          {label ?? '—'}
        </div>
      </div>
    </div>
  );
}
