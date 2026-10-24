import Image from "next/image";
import { useMemo } from "react";
import type { Shape } from "@/lib/rough";
import Sketch from "@/components/sketch/Sketch";

type Pose = "stand" | "wave" | "plane";

type Props = {
  /** The real 3D render (transparent PNG/WebP). Without it, a sketched stand-in is drawn. */
  src: string | null;
  alt: string;
  accent: string;
  pose?: Pose;
  seed?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

const POSITIONED = ["absolute", "fixed", "relative"];

// The stand-in is a pencil mannequin whose shirt takes the accent colour, so the outfit
// still "changes" per company before the real art exists.
export default function Character({ src, alt, accent, pose = "stand", seed = 1, className = "", priority, sizes = "40vw" }: Props) {
  // Callers often position it absolutely; only fall back to relative when they don't.
  const positioned = className.split(/\s+/).some((c) => POSITIONED.includes(c));
  const box = positioned ? className : `relative ${className}`;
  if (src) {
    return (
      <div className={box}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-contain object-bottom" />
      </div>
    );
  }
  return <Mannequin accent={accent} pose={pose} seed={seed} className={box} label={alt} />;
}

function Mannequin({ accent, pose, seed, className, label }: { accent: string; pose: Pose; seed: number; className: string; label: string }) {
  const shapes = useMemo<Shape[]>(() => {
    const skin = "#f3c9a5";
    const leftArm: Shape =
      pose === "wave"
        ? { t: "curve", pts: [[84, 196], [52, 160], [40, 108], [46, 70]], o: { strokeWidth: 22, stroke: accent, roughness: 0.8 } }
        : pose === "plane"
          ? { t: "curve", pts: [[84, 196], [46, 176], [34, 134], [58, 110]], o: { strokeWidth: 22, stroke: accent, roughness: 0.8 } }
          : { t: "curve", pts: [[84, 196], [70, 260], [72, 330]], o: { strokeWidth: 22, stroke: accent, roughness: 0.8 } };
    const hand: Shape =
      pose === "wave"
        ? { t: "ellipse", cx: 46, cy: 62, w: 26, h: 30, o: { fill: skin, fillStyle: "solid" } }
        : pose === "plane"
          ? { t: "poly", pts: [[40, 96], [96, 76], [70, 120], [62, 104]], o: { fill: "#ffffff", fillStyle: "solid" } }
          : { t: "ellipse", cx: 72, cy: 338, w: 24, h: 26, o: { fill: skin, fillStyle: "solid" } };
    return [
      // legs
      { t: "poly", pts: [[96, 360], [126, 360], [122, 560], [96, 560]], o: { fill: "#2c3e66", hachureGap: 4, fillWeight: 1.6 } },
      { t: "poly", pts: [[134, 360], [164, 360], [164, 560], [138, 560]], o: { fill: "#2c3e66", hachureGap: 4, fillWeight: 1.6, hachureAngle: 30 } },
      { t: "ellipse", cx: 104, cy: 570, w: 50, h: 22, o: { fill: "#8a5a3c", fillStyle: "solid" } },
      { t: "ellipse", cx: 156, cy: 570, w: 50, h: 22, o: { fill: "#8a5a3c", fillStyle: "solid" } },
      // torso / outfit
      { t: "path", d: "M84 176 Q130 160 176 176 L184 372 Q130 384 76 372 Z", o: { fill: accent, hachureGap: 5, fillWeight: 2 } },
      { t: "line", x1: 130, y1: 178, x2: 130, y2: 372, o: { strokeWidth: 1.4 } },
      // arms
      leftArm,
      { t: "curve", pts: [[176, 196], [190, 262], [188, 330]], o: { strokeWidth: 22, stroke: accent, roughness: 0.8 } },
      hand,
      { t: "ellipse", cx: 188, cy: 338, w: 24, h: 26, o: { fill: skin, fillStyle: "solid" } },
      // neck + head
      { t: "rect", x: 118, y: 140, w: 24, h: 26, o: { fill: skin, fillStyle: "solid" } },
      { t: "ellipse", cx: 130, cy: 96, w: 104, h: 116, o: { fill: skin, fillStyle: "solid" } },
      { t: "path", d: "M78 92 C76 40 120 26 150 34 C176 40 188 64 182 94 C170 70 140 62 112 70 C98 74 86 82 78 92 Z", o: { fill: "#1d1d1f", hachureGap: 3, fillWeight: 1.4 } },
      { t: "ellipse", cx: 112, cy: 104, w: 9, h: 11, o: { fill: "#1d1d1f", fillStyle: "solid" } },
      { t: "ellipse", cx: 150, cy: 104, w: 9, h: 11, o: { fill: "#1d1d1f", fillStyle: "solid" } },
      { t: "curve", pts: [[114, 128], [130, 138], [148, 128]], o: { strokeWidth: 2.4 } },
    ];
  }, [accent, pose]);

  return (
    <div className={className} role="img" aria-label={`${label} (sketch placeholder)`}>
      <Sketch w={260} h={590} shapes={shapes} seed={seed} className="absolute inset-0 h-full w-full" align="xMidYMax meet" />
    </div>
  );
}
