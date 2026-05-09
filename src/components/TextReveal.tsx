"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { SplitText } from "gsap/SplitText";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TextRevealProps {
  /** Plain text content — must be a string, not JSX, so SplitText can split it */
  children: string;
  /** HTML tag to render. Defaults to "p". */
  as?: keyof HTMLElementTagNameMap;
  className?: string;
  /**
   * ScrollTrigger start position.
   * @default "top 85%"
   */
  scrollStart?: string;
  /**
   * Extra delay before the stagger begins (seconds).
   * @default 0
   */
  delay?: number;
}

// ─── TextReveal ───────────────────────────────────────────────────────────────
/**
 * Splits text into individual words and animates each word in with a
 * staggered blur → sharp + upward fade reveal, triggered on scroll.
 *
 * Usage:
 *   <TextReveal className="text-white/80 text-lg leading-relaxed">
 *     Some text here.
 *   </TextReveal>
 */
export default function TextReveal({
  children,
  as: Tag = "p",
  className,
  scrollStart = "top 85%",
  delay = 0,
}: TextRevealProps) {
  const wrapRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = wrapRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Split into words; SplitText wraps each word in an inline element
        const split = new SplitText(el, { type: "words" });

        gsap.from(split.words, {
          opacity: 0,
          y: 20,
          filter: "blur(8px)",
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.05,
          delay,
          scrollTrigger: {
            trigger: el,
            start: scrollStart,
          },
        });

        // Revert the DOM split when the animation context cleans up
        return () => split.revert();
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Immediately visible, no blur, no stagger
        gsap.set(el, { clearProps: "all" });
      });

      return () => mm.revert();
    },
    { scope: wrapRef }
  );

  // Cast required because TypeScript can't infer the correct element type
  // for a generic `as` prop without complex conditional types.
  const Component = Tag as React.ElementType;

  return (
    <Component ref={wrapRef} className={className}>
      {children}
    </Component>
  );
}
