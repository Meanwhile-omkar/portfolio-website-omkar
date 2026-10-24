"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import type { RoughAnnotationType } from "rough-notation/lib/model";

type Props = {
  children: React.ReactNode;
  type?: RoughAnnotationType;
  color?: string;
  strokeWidth?: number;
  padding?: number | [number, number];
  delay?: number;
  duration?: number;
  /** When set, shows on this flag instead of on scroll-into-view. */
  show?: boolean;
  multiline?: boolean;
  iterations?: number;
  className?: string;
};

/** Marker circle / underline / highlight around live text, drawn when it scrolls into view. */
export default function Annotate({
  children,
  type = "underline",
  color = "#ef5533",
  strokeWidth = 2.5,
  padding = 4,
  delay = 0,
  duration = 700,
  show,
  multiline = true,
  iterations = 2,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const a = annotate(el, { type, color, strokeWidth, padding, multiline, iterations, animate: !reduce, animationDuration: duration });
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reveal = () => {
      timer = setTimeout(() => a.show(), reduce ? 0 : delay);
    };

    let io: IntersectionObserver | undefined;
    if (show === undefined) {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            reveal();
            io?.disconnect();
          }
        },
        { rootMargin: "0px 0px -15% 0px" },
      );
      io.observe(el);
    } else if (show) {
      reveal();
    }
    return () => {
      clearTimeout(timer);
      io?.disconnect();
      a.remove();
    };
  }, [type, color, strokeWidth, padding, delay, duration, show, multiline, iterations]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
