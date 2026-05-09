"use client";

import { useGSAP, gsap, ScrollTrigger } from "@/hooks/useGSAP";

/**
 * Page-level parallax controller.
 *
 * Loops over every `.section` element and creates a scrubbed ScrollTrigger
 * for any `.parallax-slow` / `.parallax-fast` children found inside it.
 *
 * Depth convention:
 *   .parallax-slow  →  moves in the same direction as scroll (y +100px)
 *                      background layers — appear to lag behind = depth
 *   .parallax-fast  →  moves against scroll direction (y -60px)
 *                      foreground layers — appear to jump ahead
 *
 * Usage: add the class to any element inside a `.section`, mount this
 * component once in the root layout / page.
 */
export default function ParallaxLayer() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const sections = gsap.utils.toArray<HTMLElement>(".section");

      sections.forEach((section) => {
        const slowEls = section.querySelectorAll<HTMLElement>(".parallax-slow");
        const fastEls = section.querySelectorAll<HTMLElement>(".parallax-fast");

        const base: ScrollTrigger.Vars = {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        };

        // Background / slow layers drift downward (same direction as scroll)
        if (slowEls.length) {
          gsap.to(slowEls, {
            y: 100,
            ease: "none",
            scrollTrigger: base,
          });
        }

        // Foreground / fast layers drift upward (opposite direction)
        if (fastEls.length) {
          gsap.to(fastEls, {
            y: -60,
            ease: "none",
            scrollTrigger: base,
          });
        }
      });
    });

    // No animation under reduced-motion — elements stay in natural position
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([".parallax-slow", ".parallax-fast"], { clearProps: "y" });
    });

    return () => mm.revert();
  });

  return null;
}
