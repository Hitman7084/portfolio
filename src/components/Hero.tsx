"use client";

import { useRef } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/hooks/useGSAP";
import dynamic from "next/dynamic";
import MagneticButton from "@/components/MagneticButton";

// Load the Canvas-based scene only on the client (no SSR)
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

// ─── Hero ────────────────────────────────────────────────────────────────────

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const overlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const sceneWrapRef = useRef<HTMLDivElement>(null);

  // Shared mouse position for both parallax and 3D scene
  const mouse = useRef({ x: 0, y: 0 });
  // RAF guard — prevent firing GSAP tweens faster than the screen refresh rate
  const rafPending = useRef(false);
  // Scroll progress (0–1) fed to Scene for camera + lighting control
  const scrollProgress = useRef<number>(0);

  // ── Mouse move: parallax text + feed to Scene ──────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    mouse.current.x = (clientX / width) * 2 - 1;
    mouse.current.y = -((clientY / height) * 2 - 1);

    if (rafPending.current) return;
    rafPending.current = true;

    requestAnimationFrame(() => {
      rafPending.current = false;
      // Skip animation when user prefers reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    });
  };

  // ── GSAP entrance animations ───────────────────────────────────────────
  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        const lines = headlineRef.current?.querySelectorAll(".hero-line") ?? [];

        // 3D scene breathes in behind everything from the very start
        tl.from(
          sceneWrapRef.current,
          { autoAlpha: 0, scale: 0.95, duration: 1.8, ease: "power2.out" },
          0
        )
          // Overline fades up
          .from(overlineRef.current, { y: 20, autoAlpha: 0, duration: 0.7 }, 0.2)
          // Headline lines: per-line clip reveal + upward motion
          .from(
            lines,
            { y: 100, autoAlpha: 0, duration: 1, stagger: 0.15 },
            0.5
          )
          // Subtitle follows last headline line
          .from(
            subtitleRef.current,
            { y: 28, autoAlpha: 0, duration: 0.8 },
            "-=0.4"
          )
          // CTA buttons stagger in
          .from(
            ctaRef.current?.querySelectorAll("a") ?? [],
            { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.1 },
            "-=0.5"
          )
          // Scroll hint drifts in last
          .from(
            scrollHintRef.current,
            { y: 16, autoAlpha: 0, duration: 0.6 },
            "-=0.4"
          );

        // ── Cinematic pin: scroll controls camera for 2.5× viewport height ──
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            scrollProgress.current = self.progress;
          },
        });

        // Giant text breathes outward as camera pulls back
        gsap.fromTo(
          ".hero-giant-text",
          { scale: 1, yPercent: 0 },
          {
            scale: 1.7,
            yPercent: -5,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=250%",
              scrub: 1,
            },
          }
        );

        // UI content retreats as user enters the 3D world
        gsap.to(".hero-content", {
          yPercent: -10,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 1,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            headlineRef.current?.querySelectorAll(".hero-line"),
            overlineRef.current,
            subtitleRef.current,
            ctaRef.current?.querySelectorAll("a"),
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
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* 3D background canvas */}
      <div
        ref={sceneWrapRef}
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Gradient overlay keeps text readable against the 3D scene */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-[#0a0a0a]/75 to-transparent z-10" />
        <Scene mouse={mouse} scrollProgress={scrollProgress} />
      </div>

      {/* Giant background text — drifts independently during scroll */}
      <div
        className="hero-giant-text absolute inset-0 z-10 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="text-white font-extrabold leading-none tracking-tighter"
          style={{ fontSize: "clamp(8rem, 28vw, 24rem)", opacity: 0.04 }}
        >
          MOTION
        </span>
      </div>

      {/* Content — fades as camera enters the 3D world */}
      <div className="hero-content container relative z-20">
        <div className="max-w-3xl">
          {/* Overline */}
          <p ref={overlineRef} className="text-violet-400 text-sm font-medium tracking-[0.2em] uppercase mb-6">
            Full-stack developer &amp; creative coder
          </p>

          {/* Headline — each line is clipped independently for the reveal */}
          <h1
            id="hero-heading"
            ref={headlineRef}
            className="heading-xl text-white mb-6"
          >
            {/* Each line is clipped independently so the reveal is per-line */}
            <span className="block overflow-hidden">
              <span className="hero-line block">Crafting</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block">
                digital&nbsp;
                <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-cyan-400">
                  experiences
                </span>
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block">that matter.</span>
            </span>
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
          <div ref={ctaRef} className="flex items-center gap-4">
            <MagneticButton
              href="#work"
              className="px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors duration-300"
            >
              View Work
            </MagneticButton>
            <MagneticButton
              href="#contact"
              className="px-6 py-3 rounded-full border border-white/20 hover:border-white/50 text-white/70 hover:text-white text-sm font-medium transition-colors duration-300"
            >
              Get in Touch
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll indicator — also retreats with hero content */}
      <div
        ref={scrollHintRef}
        aria-hidden="true"
        className="hero-content absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/40 text-xs tracking-widest uppercase"
      >
        <span>Scroll</span>
        {/* Animated line */}
        <span className="w-px h-10 bg-linear-to-b from-white/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}