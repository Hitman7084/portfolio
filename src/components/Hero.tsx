"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import dynamic from "next/dynamic";

// Load the Canvas-based scene only on the client (no SSR)
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

// ─── Hero ────────────────────────────────────────────────────────────────────

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const sceneWrapRef = useRef<HTMLDivElement>(null);

  // Shared mouse position for both parallax and 3D scene
  const mouse = useRef({ x: 0, y: 0 });

  // ── Mouse move: parallax text + feed to Scene ──────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    mouse.current.x = (clientX / width) * 2 - 1;
    mouse.current.y = -((clientY / height) * 2 - 1);

    // Subtle parallax on headline
    if (headlineRef.current) {
      gsap.to(headlineRef.current, {
        x: mouse.current.x * 12,
        y: mouse.current.y * 6,
        duration: 1,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    if (subtitleRef.current) {
      gsap.to(subtitleRef.current, {
        x: mouse.current.x * 6,
        y: mouse.current.y * 3,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  // ── GSAP entrance animations ───────────────────────────────────────────
  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Headline lines: clip-path reveal + upward motion
        const lines =
          headlineRef.current?.querySelectorAll(".hero-line") ?? [];

        tl.from(lines, {
          y: "110%",
          autoAlpha: 0,
          duration: 1,
          stagger: 0.12,
        })
          .from(
            subtitleRef.current,
            { y: 24, autoAlpha: 0, duration: 0.8 },
            "-=0.5"
          )
          .from(
            scrollHintRef.current,
            { y: 16, autoAlpha: 0, duration: 0.6 },
            "-=0.4"
          )
          .from(
            sceneWrapRef.current,
            { autoAlpha: 0, scale: 0.9, duration: 1.2, ease: "power2.out" },
            "-=1.2"
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            headlineRef.current?.querySelectorAll(".hero-line"),
            subtitleRef.current,
            scrollHintRef.current,
            sceneWrapRef.current,
          ],
          { autoAlpha: 1 }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* 3D background canvas */}
      <div
        ref={sceneWrapRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Overlay so text stays readable */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10" />
        <Scene mouse={mouse} />
      </div>

      {/* Content */}
      <div className="container relative z-20">
        <div className="max-w-3xl">
          {/* Overline */}
          <p className="text-violet-400 text-sm font-medium tracking-[0.2em] uppercase mb-6">
            Full-stack developer &amp; creative coder
          </p>

          {/* Headline — each line is clipped independently for the reveal */}
          <h1
            ref={headlineRef}
            className="heading-xl text-white mb-6 overflow-hidden"
          >
            <span className="hero-line block">Crafting</span>
            <span className="hero-line block">
              digital&nbsp;
              <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-cyan-400">
                experiences
              </span>
            </span>
            <span className="hero-line block">that matter.</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-white/60 text-lg md:text-xl max-w-xl leading-relaxed mb-10"
          >
            I design and build fast, beautiful, interactive products — from
            concept to deployment.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <a
              href="#work"
              className="px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors duration-300"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-full border border-white/20 hover:border-white/50 text-white/70 hover:text-white text-sm font-medium transition-colors duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40 text-xs tracking-widest uppercase"
      >
        <span>Scroll</span>
        {/* Animated line */}
        <span className="w-px h-10 bg-linear-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}