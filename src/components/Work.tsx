"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

const PROJECTS = [
  { title: "Orbital",  subtitle: "Real-time collaborative whiteboard",    year: "2026", color: "#7c3aed", tags: ["Next.js",  "WebSockets",      "GSAP"]        },
  { title: "Prism",    subtitle: "Design system for motion interfaces",    year: "2025", color: "#06b6d4", tags: ["React",    "TypeScript",      "Storybook"]   },
  { title: "Void",     subtitle: "Generative art platform",                year: "2025", color: "#a21caf", tags: ["Three.js", "React Three Fiber","Solidity"]   },
  { title: "Cascade",  subtitle: "E-commerce with sub-second transitions", year: "2024", color: "#f472b6", tags: ["Next.js",  "Shopify",         "Tailwind CSS"] },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const hoverRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Build a timeline that just slides the track — one beat per project.
      // Text is always visible; no from-tweens that hide content on load.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Hold on slide 0 for a moment, then slide to each subsequent project.
      tl.to({}, { duration: 1 }); // hold on first slide

      for (let i = 1; i < PROJECTS.length; i++) {
        tl.to(trackRef.current, {
          x: () => -(i * window.innerWidth),
          duration: 1,
          ease: "power4.inOut",
          invalidateOnRefresh: true,
        }).to({}, { duration: 1 }); // hold on each slide
      }
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  const onMove = (i: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    const el = hoverRefs.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      rotateX: ((e.clientY - r.top)  / r.height - 0.5) *  8,
      rotateY: ((e.clientX - r.left) / r.width  - 0.5) * -8,
      scale: 1.03,
      duration: 0.5, ease: "power3.out", overwrite: "auto",
    });
  };

  const onLeave = (i: number) => () => {
    const el = hoverRefs.current[i];
    if (!el) return;
    gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.7, ease: "power4.out", overwrite: "auto" });
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="Selected work"
      className="relative h-screen overflow-hidden bg-[#0a0a0a]"
    >
      {/* label */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none">
        <p className="text-white/25 text-xs tracking-[0.4em] uppercase font-medium text-center">
          Selected Work
        </p>
      </div>

      {/* scrolling track — clipped so off-screen slides are invisible */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: (PROJECTS.length * 100) + "vw" }}
        >
          {PROJECTS.map((proj, i) => (
            <div
              key={proj.title}
              className="relative flex-none h-full flex items-center justify-center"
              style={{ width: "100vw" }}
            >
              {/* per-slide ambient glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 60% at 60% 50%," + proj.color + "14 0%,transparent 70%)" }}
              />

              {/* giant index number */}
              <span
                aria-hidden="true"
                className="absolute left-8 bottom-8 font-black text-white/5 select-none pointer-events-none leading-none"
                style={{ fontSize: "clamp(9rem,28vw,24rem)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* tilt card */}
              <div
                ref={(el) => { hoverRefs.current[i] = el; }}
                className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-24 px-10 md:px-20 max-w-6xl w-full"
                style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
                onMouseMove={onMove(i)}
                onMouseLeave={onLeave(i)}
              >
                {/* left: editorial text */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/30 text-xs font-medium tracking-[0.35em] uppercase mb-5">
                    {proj.year}
                  </p>
                  <h2
                    className="font-extrabold leading-none text-white/90 mb-5"
                    style={{ fontSize: "clamp(2.8rem,7vw,6.5rem)", letterSpacing: "-0.04em" }}
                  >
                    {proj.title}
                  </h2>
                  <p className="text-white/50 text-lg md:text-xl font-medium mb-8">
                    {proj.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full border text-xs font-medium"
                        style={{ borderColor: proj.color + "50", color: proj.color + "cc" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div
                    className="mt-10 h-px w-20 rounded-full"
                    style={{ background: "linear-gradient(to right," + proj.color + ",transparent)" }}
                  />
                </div>

                {/* right: cinematic preview */}
                <div
                  className="flex-none w-full md:w-[45%] aspect-video rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg," + proj.color + "20 0%,#111 100%)",
                    boxShadow: "0 24px 80px 0 " + proj.color + "28",
                  }}
                >
                  <div
                    className="w-full h-full"
                    style={{ background: "radial-gradient(ellipse at 40% 40%," + proj.color + "25 0%,transparent 70%)" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}