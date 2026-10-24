import Sketch from "./Sketch";

// Small hand-drawn icons for the contact buttons, in the same rough.js style as the rest of the site.

export function MailDoodle({ color = "#ffffff", className = "" }: { color?: string; className?: string }) {
  return (
    <Sketch
      w={26}
      h={20}
      seed={14}
      className={`h-[18px] w-[24px] ${className}`}
      shapes={[
        { t: "rect", x: 1, y: 1, w: 24, h: 18, o: { stroke: color, strokeWidth: 1.8, roughness: 1 } },
        { t: "poly", pts: [[1, 2], [13, 11], [25, 2]], o: { stroke: color, strokeWidth: 1.8, roughness: 1 } },
      ]}
    />
  );
}

export function LinkedInDoodle({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-grid h-[24px] w-[24px] place-items-center ${className}`} aria-hidden>
      <Sketch
        w={24}
        h={24}
        seed={9}
        className="absolute inset-0 h-full w-full"
        shapes={[{ t: "rect", x: 1, y: 1, w: 22, h: 22, o: { fill: "#0a66c2", fillStyle: "solid", stroke: "#1d1d1f", strokeWidth: 1.6, roughness: 1.1 } }]}
      />
      <span className="relative mt-px font-sans text-[14px] font-bold leading-none tracking-[-0.03em] text-white">in</span>
    </span>
  );
}
