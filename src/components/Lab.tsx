"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

const EXPERIMENTS = [
  {
    title: "Magnetic Cursor",
    description:
      "DOM elements that warp and attract toward the cursor using spring physics.",
    accent: "#7c3aed",
    emoji: "🧲",
    minH: "min-h-[220px]",
  },
  {
    title: "Noise Field",
    description:
      "Perlin noise driving a WebGL particle system — 100k points in real time.",
    accent: "#06b6d4",
    emoji: "🌊",
    minH: "min-h-[160px]",
  },
  {
    title: "Shader Gradient",
    description:
      "Fully custom GLSL fragment shader producing a living, breathing gradient.",
    accent: "#ec4899",
    emoji: "✦",
    minH: "min-h-[280px]",
  },
  {
    title: "Text Scramble",
    description:
      "Character-level scramble effect that resolves to real text on scroll.",
    accent: "#f59e0b",
    emoji: "▓",
    minH: "min-h-[180px]",
  },
  {
    title: "Audio Visualiser",
    description:
      "Web Audio API FFT data mapped to a 3D mesh deformation in real time.",
    accent: "#10b981",
    emoji: "◉",
    minH: "min-h-[240px]",
  },
  {
    title: "Fluid Sim",
    description:
      "Stable-fluids algorithm running on the GPU via WebGL2 render targets.",
    accent: "#8b5cf6",
    emoji: "〜",
    minH: "min-h-[200px]",
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

function LabCard({ exp }: { exp: (typeof EXPERIMENTS)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const rafPending = useRef(false);

  const handleMouseEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(cardRef.current, {
      scale: 1.02,
      boxShadow: `0 0 40px ${exp.accent}40`,
      borderColor: `${exp.accent}60`,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const shimmer = shimmerRef.current;
    if (!card || !shimmer || rafPending.current) return;
    rafPending.current = true;
    const clientX = e.clientX;
    const clientY = e.clientY;
    requestAnimationFrame(() => {
      rafPending.current = false;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const { left, top } = card.getBoundingClientRect();
      gsap.to(shimmer, {
        x: clientX - left,
        y: clientY - top,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      boxShadow: "0 0 0px transparent",
      borderColor: "rgba(255,255,255,0.10)",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={exp.title}
      className={`lab-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-7 mb-5 break-inside-avoid ${exp.minH} flex flex-col justify-between`}
    >
      {/* Radial shimmer that follows the cursor */}
      <div
        ref={shimmerRef}
        aria-hidden
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${exp.accent}20 0%, transparent 70%)`,
        }}
      />

      {/* Emoji glyph */}
      <span
        className="text-4xl mb-4 block"
        style={{ filter: `drop-shadow(0 0 12px ${exp.accent}80)` }}
      >
        {exp.emoji}
      </span>

      <div>
        <h3 className="text-white font-semibold text-lg mb-2">{exp.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{exp.description}</p>
      </div>

      {/* Accent corner dot — decorative */}
      <span
        aria-hidden="true"
        className="absolute top-5 right-5 w-2 h-2 rounded-full"
        style={{ background: exp.accent }}
      />
    </article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Lab() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".lab-card", {
          y: 50,
          autoAlpha: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: { each: 0.12, from: "random" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });

        gsap.from(".lab-label, .lab-heading, .lab-sub", {
          y: 20,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [".lab-card", ".lab-label", ".lab-heading", ".lab-sub"],
          { clearProps: "all" }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="lab" ref={sectionRef} className="section">
      <div className="container">
        {/* Header */}
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="lab-label text-violet-400 text-sm font-medium tracking-[0.2em] uppercase mb-3">
              Lab
            </p>
            <h2 className="lab-heading heading-lg text-white">
              Experiments &amp; toys
            </h2>
          </div>
          <p className="lab-sub text-white/50 text-sm max-w-xs">
            Playgrounds where I push the limits of what the browser can render.
          </p>
        </div>

        {/* Masonry — CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {EXPERIMENTS.map((exp) => (
            <LabCard key={exp.title} exp={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}
