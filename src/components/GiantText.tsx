"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

interface GiantTextProps {
  children: string;
  /** [from, to] yPercent as scroll progresses through trigger */
  yPercent?: [number, number];
  /** [from, to] xPercent */
  xPercent?: [number, number];
  /** [from, to] scale */
  scale?: [number, number];
  className?: string;
  style?: React.CSSProperties;
  scrollStart?: string;
  scrollEnd?: string;
  scrub?: number | boolean;
}

/**
 * Oversized typography that drifts independently of page content on scroll.
 * Used as artistic background text that gives sections depth and editorial feel.
 */
export default function GiantText({
  children,
  yPercent = [0, -15],
  xPercent = [0, 0],
  scale = [1, 1],
  className = "",
  style,
  scrollStart = "top bottom",
  scrollEnd = "bottom top",
  scrub = 1.5,
}: GiantTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { yPercent: yPercent[0], xPercent: xPercent[0], scale: scale[0] },
          {
            yPercent: yPercent[1],
            xPercent: xPercent[1],
            scale: scale[1],
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: scrollStart,
              end: scrollEnd,
              scrub,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={style}
      className={`select-none pointer-events-none font-extrabold leading-none tracking-tighter ${className}`}
    >
      {children}
    </div>
  );
}
