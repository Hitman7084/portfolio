"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

/**
 * Full-screen page transition curtain.
 *
 * On mount: a dark panel covers the viewport, then sweeps upward revealing
 * the page beneath. The timeline stays under 1 second total.
 *
 * Two-layer design:
 *   1. .pt-bg  — solid background panel (slides out first, fast)
 *   2. .pt-bar — thin accent stripe (lingers a beat, then follows)
 * This creates a satisfying two-step wipe rather than a plain fade.
 */
export default function PageTransition() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

        // 1. Accent bar snaps in instantly (it was already visible as part of bg)
        // 2. Main panel slides up and away
        // 3. Accent bar follows just behind
        // 4. Wrapper is hidden so it never blocks interaction
        tl.to(".pt-bg", { yPercent: -100, duration: 0.7 }, 0)
          .to(".pt-bar", { yPercent: -100, duration: 0.55 }, 0.12)
          .set(wrapRef.current, { display: "none" });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Instant reveal — no animation
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
      className="fixed inset-0 z-200 pointer-events-none overflow-hidden"
    >
      {/* Main curtain — fills the viewport */}
      <div className="pt-bg absolute inset-0 bg-[#0a0a0a]" />

      {/* Accent stripe — sits on top of the curtain, slightly delayed */}
      <div className="pt-bar absolute inset-x-0 bottom-0 h-0.75 bg-linear-to-r from-violet-500 to-cyan-400" />
    </div>
  );
}
