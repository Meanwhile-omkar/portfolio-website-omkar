import Image from "next/image";

// Paper bits that sit on the canvas: washi tape, sticky notes, polaroids, die-cut stickers.

const TAPE_CLIP =
  "polygon(0 8%, 4% 0, 9% 10%, 14% 2%, 20% 9%, 80% 6%, 86% 0, 91% 10%, 96% 1%, 100% 9%, 100% 92%, 95% 100%, 90% 90%, 84% 99%, 78% 91%, 22% 94%, 15% 100%, 10% 90%, 4% 99%, 0 92%)";

export function Tape({ color = "#ffc700", className = "", style }: { color?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute block h-6 w-24 ${className}`}
      style={{ background: color, opacity: 0.72, clipPath: TAPE_CLIP, mixBlendMode: "multiply", ...style }}
    />
  );
}

export function StickyNote({
  children,
  color = "#ffe27a",
  tilt = -2,
  className = "",
  tape,
}: {
  children: React.ReactNode;
  color?: string;
  tilt?: number;
  className?: string;
  tape?: string;
}) {
  return (
    <div
      className={`${className.split(" ").includes("absolute") ? "" : "relative "}px-5 pb-6 pt-5 font-note text-[17px] leading-snug text-ink ${className}`}
      style={{
        background: color,
        transform: `rotate(${tilt}deg)`,
        boxShadow: "0 1px 1px rgba(29,29,31,0.08), 0 14px 22px -14px rgba(29,29,31,0.45)",
        borderBottomRightRadius: "18px 6px",
      }}
    >
      {tape && <Tape color={tape} className="-top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]" />}
      {children}
    </div>
  );
}

export function Polaroid({
  src,
  alt,
  caption,
  tilt = 0,
  tape = "#18a0fb",
  ratio = "4 / 5",
  sizes = "(max-width: 768px) 60vw, 320px",
  className = "",
  priority,
  focus = "50% 50%",
}: {
  src?: string;
  alt: string;
  caption?: React.ReactNode;
  tilt?: number;
  tape?: string | null;
  ratio?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** object-position for the crop, e.g. "20% 50%" to keep a person on the left in frame. */
  focus?: string;
}) {
  return (
    <figure
      className={`relative bg-white p-2.5 pb-3 shadow-paper ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {tape && <Tape color={tape} className="-top-3 left-1/2 -translate-x-1/2 rotate-[4deg]" />}
      <div className="relative w-full overflow-hidden bg-mist" style={{ aspectRatio: ratio }}>
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: focus }} priority={priority} />
        ) : (
          <div className="absolute inset-0 grid place-items-center border-2 border-dashed border-ink/20 p-4 text-center font-note text-[15px] text-ink-faint">
            {alt}
          </div>
        )}
      </div>
      {caption && <figcaption className="px-1 pt-2.5 text-center font-note text-[15px] leading-tight text-ink">{caption}</figcaption>}
    </figure>
  );
}

type SimpleIcon = { title: string; path: string; hex: string };

/** A brand logo cut out like a vinyl sticker: thick white border, soft shadow. */
export function Sticker({ icon, size = 56, tilt = 0, className = "" }: { icon: SimpleIcon; size?: number; tilt?: number; className?: string }) {
  const dark = parseInt(icon.hex, 16) < 0x333333;
  return (
    <svg
      viewBox="-3 -3 30 30"
      width={size}
      height={size}
      className={className}
      style={{ transform: `rotate(${tilt}deg)`, filter: "drop-shadow(0 3px 4px rgba(29,29,31,0.28))", overflow: "visible" }}
      role="img"
    >
      <title>{icon.title}</title>
      <path d={icon.path} fill={dark ? "#1d1d1f" : `#${icon.hex}`} stroke="#fff" strokeWidth={3.6} strokeLinejoin="round" paintOrder="stroke" />
    </svg>
  );
}

/** Word sticker for skills that have no logo. */
export function WordSticker({
  children,
  color = "#ffffff",
  ink = "#1d1d1f",
  tilt = 0,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  ink?: string;
  tilt?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded-[10px] border-[3px] border-white px-3 py-1 font-marker text-[22px] leading-none tracking-wide ${className}`}
      style={{ background: color, color: ink, transform: `rotate(${tilt}deg)`, boxShadow: "0 3px 6px -1px rgba(29,29,31,0.28)" }}
    >
      {children}
    </span>
  );
}
