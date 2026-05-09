"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

/**
 * Wraps any section with a cinematic entrance:
 * scale + blur + fade resolves as it scrolls into view.
 */
export default function SectionReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          scale: 0.96,
          filter: "blur(12px)",
          autoAlpha: 0,
          y: 28,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            end: "top 46%",
            scrub: 1.2,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
