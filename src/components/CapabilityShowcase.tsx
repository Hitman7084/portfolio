"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

const PROJECTS = [
  {
    title: "Orbital",
    subtitle: "Real-time collaborative whiteboard",
    year: "2026",
    color: "#7c3aed",
    tags: ["Next.js", "WebSockets", "GSAP"],
  },
  {
    title: "Prism",
    subtitle: "Design system for motion interfaces",
    year: "2025",
    color: "#06b6d4",
    tags: ["React", "TypeScript", "Storybook"],
  },
  {
    title: "Void",
    subtitle: "Generative art platform",
    year: "2025",
    color: "#a21caf",
    tags: ["Three.js", "React Three Fiber", "Solidity"],
  },
  {
    title: "Cascade",
    subtitle: "E-commerce with sub-second transitions",
    year: "2024",
    color: "#f472b6",
    tags: ["Next.js", "Shopify", "Tailwind CSS"],
  },
];

export default function CapabilityShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const hoverRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const panels = panelRefs.current.filter((p): p is HTMLDivElement => p !== null);

      // All panels except first start scaled/blurred out
      gsap.set(panels.slice(1), { opacity: 0, scale: 1.04, filter: "blur(16px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=600%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      for (let i = 0; i < panels.length - 1; i++) {
        tl.to({}, { duration: 1.8 })
          // current panel retreats into depth
          .to(panels[i], {
            opacity: 0, scale: 0.96, filter: "blur(12px)",
            duration: 0.6, ease: "power3.in",
          })
          // next panel emerges from slightly larger scale
          .to(panels[i + 1], {
            opacity: 1, scale: 1, filter: "blur(0px)",
            duration: 0.7, ease: "power3.out",
          }, "<0.2");
      }
      tl.to({}, { duration: 1.8 });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      panelRefs.current.forEach((p) => { if (p) gsap.set(p, { clearProps: "all" }); });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  // Perspective tilt on hover
  const onMove = (i: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    const el = hoverRefs.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      rotateX: ((e.clientY - r.top)  / r.height - 0.5) *  6,
      rotateY: ((e.clientX - r.left) / r.width  - 0.5) * -6,
      duration: 0.5, ease: "power3.out", overwrite: "auto",
    });
  };

  const onLeave = (i: number) => () => {
    const el = hoverRefs.current[i];
    if (!el) return;
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power4.out", overwrite: "auto" });
  };

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-label="Capability showcase"
      className="relative h-screen overflow-hidden bg-[#0a0a0a]"
    >
      <div className="absolute top-12 left-12 z-30 pointer-events-none select-none">
        <p className="text-white/15 text-xs tracking-[0.35em] uppercase font-medium">Capability</p>
      </div>

      {PROJECTS.map((proj, i) => (
        <div
          key={proj.title}
          ref={(el) => { panelRefs.current[i] = el; }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* per-project ambient glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 55% 50%, ${proj.color}10 0%, transparent 70%)`,
            }}
          />

          {/* giant index number — background depth layer */}
          <span
            aria-hidden="true"
            className="absolute right-8 bottom-8 font-black text-white/4 select-none pointer-events-none leading-none"
            style={{ fontSize: "clamp(9rem,26vw,22rem)" }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          {/* tilt card */}
          <div
            ref={(el) => { hoverRefs.current[i] = el; }}
            className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20 px-10 md:px-20"
            style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
            onMouseMove={onMove(i)}
            onMouseLeave={onLeave(i)}
          >
            {/* left: editorial typography */}
            <div className="flex-1 min-w-0">
              <p className="text-white/25 text-xs font-medium tracking-[0.35em] uppercase mb-6">
                {proj.year}&nbsp;&mdash;&nbsp;{String(i + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(PROJECTS.length).padStart(2, "0")}
              </p>
              <h2
                className="font-extrabold leading-none text-white/90 mb-5"
                style={{ fontSize: "clamp(3rem,8vw,7.5rem)", letterSpacing: "-0.04em" }}
              >
                {proj.title}
              </h2>
              <p className="text-white/45 text-lg md:text-xl font-medium mb-8 max-w-md leading-snug">
                {proj.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 mb-10">
                {proj.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full border text-xs font-medium"
                    style={{ borderColor: proj.color + "45", color: proj.color + "cc" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div
                className="h-px w-20 rounded-full"
                style={{ background: `linear-gradient(to right, ${proj.color}, transparent)` }}
              />
            </div>

            {/* right: cinematic preview panel */}
            <div
              className="flex-none w-full md:w-[44%] aspect-video rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${proj.color}18 0%, #0d0d0d 100%)`,
                boxShadow: `0 24px 80px 0 ${proj.color}20`,
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: `radial-gradient(ellipse at 40% 35%, ${proj.color}22 0%, transparent 65%)`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}