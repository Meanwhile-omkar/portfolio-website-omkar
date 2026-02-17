'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetch('/api/images?folder=gallery');
        if (response.ok) {
          const images = await response.json();
          setGalleryImages(images);
        }
      } catch (error) {
        console.error('Error loading gallery images:', error);
      }
    };

    loadImages();
  }, []);

  return (
    <section id="gallery" className="relative py-36 bg-deep border-t border-border z-10">
      <div className="max-w-[1100px] mx-auto px-12">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-4 flex items-center gap-3">
          07 / In The Field
          <span className="flex-1 max-w-[60px] h-[1px] bg-gold opacity-40"></span>
        </p>
        <h2 className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-[1.0] tracking-[-0.02em] text-cream mb-8">
          The <em className="italic text-gold">journey</em>
        </h2>
        <p className="text-[15px] text-cream-dim max-w-2xl mb-12">
          Moments from case competitions, hackathons, speaking engagements, and late-night builds. The candid shots that tell the real story.
        </p>
      </div>

      {galleryImages.length > 0 ? (
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gold scrollbar-track-black pb-4">
          <div className="flex gap-6 px-12 min-w-max">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-80 h-96 group cursor-pointer"
              >
                <div className="w-full h-full rounded overflow-hidden border border-border transition-all duration-300 group-hover:border-gold/50 group-hover:shadow-[0_8px_32px_rgba(201,168,76,0.2)]">
                  <Image
                    src={`/gallery/${img}`}
                    alt={`Gallery photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="font-mono text-[10px] text-cream-dim/60 mt-2 tracking-wide">
                  {img.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-[1100px] mx-auto px-12">
          <div className="bg-surface border border-border rounded-lg p-16 text-center">
            <Camera size={48} className="mx-auto mb-4 text-gold" strokeWidth={1.5} />
            <p className="text-lg text-cream-dim mb-2">Gallery Coming Soon</p>
            <p className="text-sm text-cream-dim/60">
              Add your photos to <code className="text-gold font-mono text-xs">public/gallery/</code> and they'll appear here automatically!
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
