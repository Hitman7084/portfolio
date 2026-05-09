"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

/**
 * Cinematic loading curtain.
 *
 * Sequence:
 * 1. Split screen (top + bottom panels) fills viewport
 * 2. A counter counts 000 → 100 while a progress line expands
 * 3. Panels split apart: top panel flies up, bottom panel flies down
 * 4. Accent stripe fades — page is fully revealed
 *
 * Two-panel split creates a more dramatic 'iris open' feel vs a plain wipe.
 */
export default function PageTransition() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });
        const progress = { val: 0 };

        tl
          // Counter climbs 0 → 100
          .to(
            progress,
            {
              val: 100,
              duration: 1.4,
              ease: "power2.inOut",
              onUpdate() {
                if (counterRef.current) {
                  counterRef.current.textContent = String(
                    Math.round(progress.val)
                  ).padStart(3, "0");
                }
              },
            },
            0
          )
          // Loading bar expands from center
          .fromTo(
            ".pt-line",
            { scaleX: 0, transformOrigin: "center" },
            { scaleX: 1, duration: 1.2, ease: "power3.inOut" },
            0
          )
          // Top panel shoots upward
          .to(".pt-top", { yPercent: -100, duration: 0.85 }, 1.2)
          // Bottom panel shoots downward — slight delay for drama
          .to(".pt-bottom", { yPercent: 100, duration: 0.85 }, 1.32)
          // Accent bar fades
          .to(".pt-bar", { autoAlpha: 0, duration: 0.3 }, 1.55)
          // Remove entirely so it never blocks interaction
          .set(wrapRef.current, { display: "none" });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(wrapRef.current, { display: "none" });
      });

      return () => mm.revert();
    },
    { scope: wrapRef }
  );

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
    >
      {/* Top half curtain */}
      <div className="pt-top absolute inset-x-0 top-0 h-1/2 bg-[#0a0a0a]" />
      {/* Bottom half curtain */}
      <div className="pt-bottom absolute inset-x-0 bottom-0 h-1/2 bg-[#0a0a0a]" />

      {/* Center stage — counter + progress bar */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <span
          ref={counterRef}
          aria-hidden="true"
          className="text-white/10 font-extrabold tabular-nums leading-none select-none"
          style={{ fontSize: "clamp(5rem, 16vw, 13rem)" }}
        >
          000
        </span>
        <div className="mt-8 w-36 h-px bg-white/8 overflow-hidden">
          <div className="pt-line h-full bg-gradient-to-r from-violet-500 to-cyan-400 scale-x-0" />
        </div>
        <p className="mt-5 text-white/18 text-xs tracking-[0.45em] uppercase font-medium select-none">
          Loading
        </p>
      </div>

      {/* Bottom accent stripe */}
      <div className="pt-bar absolute inset-x-0 bottom-0 h-0.75 bg-gradient-to-r from-violet-500 to-cyan-400" />
    </div>
  );
}
