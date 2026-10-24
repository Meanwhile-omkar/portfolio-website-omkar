type Props = {
  children: React.ReactNode;
  /** Seconds for one full loop. Longer = slower. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  label?: string;
};

/** An endless strip. Hover or focus pauses it; reduced motion turns it into a sideways scroller. */
export default function Marquee({ children, duration = 70, reverse, className = "", label }: Props) {
  return (
    <div className={`marquee ${className}`} role="region" aria-label={label}>
      <div className="marquee-track" data-reverse={reverse ? "true" : undefined} style={{ ["--marquee-dur" as string]: `${duration}s` }}>
        <div className="flex shrink-0 items-start">{children}</div>
        {/* second copy only exists to close the loop */}
        <div className="flex shrink-0 items-start" aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}
