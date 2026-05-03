"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId: number;

    function tick(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
// Implement smooth scrolling using Lenis.
// Requirements:
// - Initialize Lenis on mount
// - Sync with requestAnimationFrame
// - Ensure compatibility with GSAP ScrollTrigger
// - Wrap entire app with this component