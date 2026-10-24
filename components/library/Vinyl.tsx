import type { Badge } from "@/data/caseStudies";

/** A vinyl record: black disc, grooves, coloured centre label. Static SVG, spin it from outside. */
export function Record({ size, color, className = "", style }: { size: number; color: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} style={style} aria-hidden>
      <circle cx="100" cy="100" r="98" fill="#1d1d1f" />
      {[88, 80, 72, 64, 56].map((r, i) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#ffffff" strokeOpacity={0.09 + (i % 2) * 0.05} strokeWidth="1.2" />
      ))}
      <path d="M40 54 A70 70 0 0 1 82 30" fill="none" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="34" fill={color} />
      <circle cx="100" cy="100" r="34" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeDasharray="3 4" />
      <circle cx="100" cy="100" r="4.5" fill="#ffffff" stroke="#1d1d1f" strokeWidth="1.5" />
    </svg>
  );
}

const badgeColor: Record<Badge, string> = {
  Winner: "#ffc700",
  "Runner-up": "#18a0fb",
  "Top 5": "#1bc47d",
  "Top 10": "#1bc47d",
  Finalist: "#ee46d3",
  Recognised: "#00b5ce",
};

/** Round sticker slapped on a record sleeve, like a "Grammy winner" sticker. */
export function BadgeSticker({ badge, field, size = 76, tilt = 12, className = "" }: { badge: Badge; field?: string; size?: number; tilt?: number; className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-full border-[3px] border-white text-center font-marker leading-[0.85] text-ink ${className}`}
      style={{
        width: size,
        height: size,
        background: badgeColor[badge],
        transform: `rotate(${tilt}deg)`,
        boxShadow: "0 3px 6px -1px rgba(29,29,31,0.35)",
        fontSize: size * 0.27 * Math.min(1, 7 / badge.length),
      }}
    >
      <span>
        {badge.toUpperCase()}
        {field && <span className="block font-note text-[0.55em] leading-tight">{field}</span>}
      </span>
    </span>
  );
}
