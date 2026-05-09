"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

const SERVICES = [
  {
    number: "01",
    title: "Brand Strategy",
    description:
      "Positioning, visual identity, and narrative systems that make brands impossible to ignore.",
    tags: ["Identity", "Positioning", "Naming", "Voice"],
  },
  {
    number: "02",
    title: "Digital Design",
    description:
      "Interface design that balances aesthetics and usability — from wireframes to polished pixels.",
    tags: ["UI/UX", "Figma", "Prototyping", "Design Systems"],
  },
  {
    number: "03",
    title: "Development",
    description:
      "Production-grade code with cinematic motion — fast, accessible, and built to last.",
    tags: ["Next.js", "GSAP", "Three.js", "Full-stack"],
  },
];

const ICONS: React.ReactNode[] = [
  <svg key="brand" aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M9 14h10M14 9v10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.4" />
  </svg>,
  <svg key="design" aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="4" y="4" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 10h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="7" r="1" fill="currentColor" opacity="0.5" />
    <circle cx="12" cy="7" r="1" fill="currentColor" opacity="0.5" />
  </svg>,
  <svg key="dev" aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path
      d="M8 10l-4 4 4 4M20 10l4 4-4 4M15 7l-3 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
];

function ServiceBlock({
  svc,
  icon,
}: {
  svc: (typeof SERVICES)[number];
  icon: React.ReactNode;
}) {
  const blockRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(blockRef.current, {
      scaleY: 1.025,
      scaleX: 1.01,
      borderColor: "rgba(124,58,237,0.5)",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(blockRef.current, {
      scaleY: 1,
      scaleX: 1,
      borderColor: "rgba(255,255,255,0.10)",
      duration: 0.5,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={blockRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="service-block rounded-2xl border border-white/10 p-8 md:p-10 flex flex-col gap-6 origin-center cursor-default"
    >
      <div className="flex items-start justify-between">
        <span className="text-violet-400">{icon}</span>
        <span className="text-white/20 text-sm font-mono">{svc.number}</span>
      </div>
      <div>
        <h3 className="text-white text-2xl font-bold mb-3">{svc.title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{svc.description}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto">
        {svc.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full border border-white/10 text-white/40 text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".services-label, .services-heading", {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
          },
        });

        gsap.from(".service-block", {
          y: 50,
          autoAlpha: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [".services-label", ".services-heading", ".service-block"],
          { clearProps: "all" }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="services" ref={sectionRef} aria-labelledby="services-heading" className="section relative overflow-hidden">
      {/* Decorative ambient blob — parallax-slow: recedes with scroll */}
      <div
        aria-hidden="true"
        className="parallax-slow absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.07) 0%, transparent 70%)",
        }}
      />
      <div className="container">
        <div className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="services-label text-violet-400 text-sm font-medium tracking-[0.2em] uppercase mb-3">
              What I do
            </p>
            <h2 id="services-heading" className="services-heading heading-lg text-white">Services</h2>
          </div>
          <p className="text-white/50 text-sm max-w-xs">
            End-to-end creative and technical execution for teams that care about quality.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SERVICES.map((svc, i) => (
            <ServiceBlock key={svc.title} svc={svc} icon={ICONS[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}