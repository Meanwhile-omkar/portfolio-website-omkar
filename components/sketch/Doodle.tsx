import { useMemo } from "react";
import type { Shape } from "@/lib/rough";
import Sketch from "./Sketch";
import { ACCENT, doodles, type DoodleName } from "./doodles";

type Props = {
  name: DoodleName;
  color?: string;
  size?: number | string;
  seed?: number;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
};

export default function Doodle({ name, color = "#ffc700", size = 64, seed = 3, className, style, title }: Props) {
  const shapes = useMemo<Shape[]>(
    () =>
      doodles[name].map((s) => {
        // Icons are drawn small, so ink and hatching run heavier than the 1:1 defaults.
        const o = { strokeWidth: 2.7, fillWeight: 2, hachureGap: 5.5, ...s.o };
        if (o.fill === ACCENT) o.fill = color;
        if (o.stroke === ACCENT) o.stroke = color;
        return { ...s, o };
      }),
    [name, color],
  );
  return <Sketch w={100} h={100} shapes={shapes} seed={seed} className={className} style={{ width: size, height: size, ...style }} title={title} />;
}
