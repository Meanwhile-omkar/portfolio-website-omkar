"use client";

import { useLayoutEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Seconds for one pass of the children. Longer = slower. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  label?: string;
};

/**
 * An endless strip that never stops. The children are repeated until one loop is wider than
 * the screen, so a short row of photos still never shows a gap. Reduced motion turns it into
 * a sideways scroller.
 */
export default function Marquee({ children, duration = 70, reverse, className = "", label }: Props) {
  const unit = useRef<HTMLDivElement>(null);
  const [reps, setReps] = useState(1);

  useLayoutEffect(() => {
    const el = unit.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      if (w > 0) setReps(Math.max(1, Math.ceil((window.innerWidth + 200) / w)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // One half of the track = the children `reps` times; the track holds two halves and slides by one.
  const half = (copy: number) => (
    <div className="flex shrink-0 items-start" aria-hidden={copy > 0 || undefined} inert={copy > 0 || undefined}>
      {Array.from({ length: reps }, (_, r) => (
        <div key={r} ref={copy === 0 && r === 0 ? unit : undefined} className="flex shrink-0 items-start" aria-hidden={r > 0 || undefined} inert={r > 0 || undefined}>
          {children}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${className}`} role="region" aria-label={label}>
      <div className="marquee-track" data-reverse={reverse ? "true" : undefined} style={{ ["--marquee-dur" as string]: `${duration * reps}s` }}>
        {half(0)}
        {half(1)}
      </div>
    </div>
  );
}
