"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

const PROJECTS = [
  {
    title: "Orbital",
    description:
      "A real-time collaborative whiteboard with physics-based animations and multiplayer cursors.",
    tags: ["Next.js", "WebSockets", "Canvas API", "GSAP"],
    year: "2026",
    size: "large",
  },
  {
    title: "Prism",
    description:
      "Design system and component library built for motion-first interfaces.",
    tags: ["React", "TypeScript", "Storybook"],
    year: "2025",
    size: "small",
  },
  {
    title: "Void",
    description:
      "Generative art platform turning on-chain data into interactive 3D sculptures.",
    tags: ["Three.js", "React Three Fiber", "Solidity"],
    year: "2025",
    size: "small",
  },
  {
    title: "Cascade",
    description:
      "High-performance e-commerce storefront with sub-second page transitions.",
    tags: ["Next.js", "Shopify", "Tailwind CSS"],
    year: "2024",
    size: "small",
  },
  {
    title: "Lumina",
    description:
      "AI-powered creative assistant that turns text prompts into animated scenes.",
    tags: ["Python", "WebGL", "GSAP", "OpenAI"],
    year: "2024",
    size: "small",
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  className = "",
}: {
  project: (typeof PROJECTS)[number];
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafPending = useRef(false);

  const handleMouseEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(cardRef.current, {
      boxShadow: "0 0 40px 4px rgba(124,58,237,0.25), 0 20px 60px rgba(0,0,0,0.5)",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || rafPending.current) return;
    rafPending.current = true;
    const clientX = e.clientX;
    const clientY = e.clientY;
    requestAnimationFrame(() => {
      rafPending.current = false;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      const rotateX = (y / height - 0.5) * 10;
      const rotateY = (x / width - 0.5) * -10;
      gsap.to(card, {
        rotateX,
        rotateY,
        scale: 1.03,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      boxShadow: "0 0 0px 0px rgba(124,58,237,0), 0 0px 0px rgba(0,0,0,0)",
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <div
      style={{ perspective: "800px" }}
      className={className}
    >
      <article
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label={project.title}
        className="project-card group h-full rounded-2xl border border-white/10 bg-white/3 p-8 flex flex-col justify-between"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-violet-400 text-xs font-medium tracking-[0.2em] uppercase">
              {project.year}
            </span>
            <span aria-hidden="true" className="text-white/20 text-sm">
              {String(PROJECTS.indexOf(project) + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="heading-lg text-white mb-3 group-hover:text-violet-300 transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-end justify-between">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full border border-white/10 text-white/50 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="text-white/20 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0 ml-4"
          >
            <path
              d="M4 16L16 4M16 4H8M16 4V12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </article>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=200%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });

        // Header fades in first
        tl.from([".work-label", ".work-heading"], {
          y: 24,
          autoAlpha: 0,
          duration: 0.2,
          stagger: 0.08,
        })
          // Cards stagger in: scale up from 0.8, rise from y:100
          .from(
            ".project-card",
            {
              opacity: 0,
              y: 100,
              scale: 0.8,
              stagger: 0.3,
              duration: 0.5,
              ease: "power3.out",
              transformOrigin: "center bottom",
            },
            "-=0.05"
          )
          // Parallax drift: cards float upward as scroll continues
          .to(
            ".project-card",
            {
              y: -30,
              stagger: 0.08,
              duration: 0.4,
              ease: "none",
            },
            ">"
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".project-card", ".work-label", ".work-heading"], {
          clearProps: "all",
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const [large, ...rest] = PROJECTS;

  return (
    <section id="work" ref={sectionRef} className="work-section section">
      <div className="container">
        {/* Header */}
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="work-label text-violet-400 text-sm font-medium tracking-[0.2em] uppercase mb-3">
              Selected work
            </p>
            <h2 className="work-heading heading-lg text-white">
              Things I&apos;ve built
            </h2>
          </div>
          <p className="text-white/50 text-sm leading-relaxed">A curated selection of projects spanning product, craft, and
            experimentation.
          </p>
        </div>

        {/* Asymmetric layout: large left + 2×2 right */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Large card */}
          <ProjectCard project={large} className="lg:col-span-3 lg:row-span-2" />

          {/* Four smaller cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {rest.map((p) => (
              <ProjectCard key={p.title} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
