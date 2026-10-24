import { useMemo } from "react";
import { sketch, type Shape } from "@/lib/rough";

type Props = {
  w: number;
  h: number;
  shapes: Shape[];
  seed?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Stretch to the parent box instead of keeping the aspect ratio. Strokes stay the same width. */
  stretch?: boolean;
  /** preserveAspectRatio alignment, e.g. "xMidYMax meet" to sit on the bottom edge. */
  align?: string;
  title?: string;
};

/** Renders rough.js shapes as a static SVG. Safe for server and client rendering. */
export default function Sketch({ w, h, shapes, seed = 1, className, style, stretch, align, title }: Props) {
  const paths = useMemo(() => sketch(shapes, seed), [shapes, seed]);
  return (
    <svg
      viewBox={`-4 -4 ${w + 8} ${h + 8}`}
      className={className}
      style={style}
      preserveAspectRatio={stretch ? "none" : (align ?? "xMidYMid meet")}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      overflow="visible"
    >
      {title && <title>{title}</title>}
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          fill={p.fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect={stretch ? "non-scaling-stroke" : undefined}
          suppressHydrationWarning
        />
      ))}
    </svg>
  );
}
