"use client";

import { useRef, useEffect } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // Headline line refs (each is the inner <span> inside overflow-hidden)
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);

  // Floating blob refs
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  // Mount entrance timeline + idle blob floats
  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lines = [line1Ref.current, line2Ref.current, line3Ref.current];
        const blobs = [blob1Ref.current, blob2Ref.current, blob3Ref.current];

        // Entrance timeline
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        tl.from(lines, {
          y: 110,
          opacity: 0,
          stagger: 0.14,
          duration: 1.05,
        })
          .from(
            subheadingRef.current,
            { y: 24, opacity: 0, duration: 0.85 },
            "-=0.35"
          )
          .from(
            ctaRef.current,
            { y: 20, opacity: 0, duration: 0.75 },
            "-=0.45"
          )
          .from(
            scrollRef.current,
            { opacity: 0, y: -10, duration: 0.6 },
            "-=0.25"
          );

        // Idle floating blobs
        gsap.to(blobs, {
          y: "+=28",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 4.5,
          stagger: 1.3,
        });

        // Scroll indicator bounce
        gsap.to(chevronRef.current, {
          y: 7,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          duration: 0.85,
        });
      });

      // Reduced motion: ensure everything is visible
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            line1Ref.current,
            line2Ref.current,
            line3Ref.current,
            subheadingRef.current,
            ctaRef.current,
            scrollRef.current,
          ],
          { opacity: 1, y: 0 }
        );
      });
    },
    { scope: containerRef }
  );

  // Mouse parallax — separate useEffect so we can properly bind/unbind
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = contextSafe((e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const cx = innerWidth / 2;
      const cy = innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 → 1
      const dy = (e.clientY - cy) / cy; // -1 → 1

      gsap.to(blob1Ref.current, {
        x: dx * 32,
        y: dy * 32,
        duration: 1.4,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(blob2Ref.current, {
        x: dx * -20,
        y: dy * -20,
        duration: 1.6,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(blob3Ref.current, {
        x: dx * 14,
        y: dy * -14,
        duration: 1.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    });

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [contextSafe]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
      aria-label="Hero"
    >
      {/* ── Floating background blobs ── */}
      <div
        ref={blob1Ref}
        className="absolute -top-32 -left-32 w-145 h-145 rounded-full bg-violet-700 opacity-25 blur-[130px] pointer-events-none will-change-transform"
        aria-hidden="true"
      />
      <div
        ref={blob2Ref}
        className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-105 h-105 rounded-full bg-cyan-500 opacity-15 blur-[110px] pointer-events-none will-change-transform"
        aria-hidden="true"
      />
      <div
        ref={blob3Ref}
        className="absolute top-1/2 right-1/4 w-70 h-70 rounded-full bg-violet-400 opacity-10 blur-[90px] pointer-events-none will-change-transform"
        aria-hidden="true"
      />

      {/* ── Main content ── */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full">
        {/* Headline */}
        <h1 className="font-bold leading-[0.92] tracking-tight text-white">
          {/* Line 1 */}
          <div className="overflow-hidden">
            <span
              ref={line1Ref}
              className="block text-[clamp(3rem,10vw,9rem)]"
            >
              Crafting
            </span>
          </div>

          {/* Line 2 */}
          <div className="overflow-hidden">
            <span
              ref={line2Ref}
              className="block text-[clamp(3rem,10vw,9rem)]"
            >
              Digital{" "}
              <span className="text-violet-400">Experiences</span>
            </span>
          </div>

          {/* Line 3 */}
          <div className="overflow-hidden">
            <span
              ref={line3Ref}
              className="block text-[clamp(3rem,10vw,9rem)]"
            >
              That Move You
            </span>
          </div>
        </h1>

        {/* Subheading */}
        <p
          ref={subheadingRef}
          className="mt-7 text-[clamp(1rem,2vw,1.25rem)] text-[#888888] max-w-xl mx-auto leading-relaxed"
        >
          Full-stack developer &amp; creative technologist.
          <br className="hidden sm:block" /> I build interfaces that feel alive.
        </p>

        {/* CTA */}
        <a
          ref={ctaRef}
          href="#work"
          className="inline-block mt-10 px-9 py-4 rounded-full bg-violet-600 text-white font-semibold text-sm tracking-wide hover:bg-violet-500 active:scale-95 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
        >
          View My Work →
        </a>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#555555] pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
          Scroll
        </span>
        <svg
          ref={chevronRef}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
