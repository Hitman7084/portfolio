import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register plugins only in the browser — GSAP requires DOM APIs that are not
// available during Next.js server-side rendering.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Animate one or more elements in with a fade + upward motion.
 * @param targets - CSS selector, element, or array of elements
 * @param options - Override any gsap.from() vars
 */
export function fadeUp(
  targets: gsap.TweenTarget,
  options: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    y: 40,
    autoAlpha: 0,
    duration: 0.9,
    ease: "power3.out",
    ...options,
  });
}

/**
 * Create a pre-configured GSAP timeline with project defaults.
 * @param vars - Any gsap.TimelineVars (delay, repeat, scrollTrigger, …)
 */
export function createTimeline(vars: gsap.TimelineVars = {}) {
  return gsap.timeline({
    defaults: { ease: "power3.out", duration: 0.9 },
    ...vars,
  });
}

export { gsap, ScrollTrigger, SplitText };