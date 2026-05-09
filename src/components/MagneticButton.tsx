"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

// ─── Constants ───────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

interface MagneticButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

// ─── MagneticButton ──────────────────────────────────────────────────────────
/**
 * Wraps an anchor tag with a subtle magnetic hover effect.
 * The outer <span> is the element that moves; the inner <a> handles semantics.
 * GSAP is scoped to the wrapper so animation is cleaned up on unmount.
 */
export default function MagneticButton({
  href,
  className,
  children,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  // contextSafe ensures event-handler tweens are reverted on unmount
  const { contextSafe } = useGSAP({ scope: wrapRef });

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLSpanElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = wrapRef.current;
    if (!el) return;

    const { left, top, width, height } = el.getBoundingClientRect();
    // Raw offset from button center, scaled down for subtle movement
    const x = (e.clientX - left - width / 2) * 0.2;
    const y = (e.clientY - top - height / 2) * 0.2;

    gsap.to(el, {
      x,
      y,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(wrapRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  });

  return (
    <span
      ref={wrapRef}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <a href={href} className={className}>
        {children}
      </a>
    </span>
  );
}
