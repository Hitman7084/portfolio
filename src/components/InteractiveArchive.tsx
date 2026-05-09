"use client";

import { useRef, useEffect } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

const FRAGMENTS = [
  { label: "WebGL Shaders",    sub: "GLSL / Three.js",  x: 10, y: 18, depth: 0.6 },
  { label: "Generative Art",   sub: "Canvas / p5.js",   x: 62, y: 10, depth: 0.4 },
  { label: "Physics Sims",     sub: "Matter.js",         x: 78, y: 52, depth: 0.8 },
  { label: "Creative Coding",  sub: "Processing",        x: 18, y: 68, depth: 0.5 },
  { label: "3D Environments",  sub: "React Three Fiber", x: 52, y: 72, depth: 0.7 },
  { label: "Motion Systems",   sub: "GSAP / Lenis",      x: 36, y: 38, depth: 0.3 },
  { label: "Type Experiments", sub: "SplitText",         x: 70, y: 28, depth: 0.9 },
];

export default function InteractiveArchive() {
  const sectionRef = useRef<HTMLElement>(null);
  const fragmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef   = useRef<number | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Entrance: staggered reveal from random positions
      gsap.from(fragmentRefs.current.filter(Boolean), {
        opacity: 0,
        scale: 0.82,
        filter: "blur(8px)",
        duration: 1.4,
        ease: "power3.out",
        stagger: { each: 0.1, from: "random" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });

      // Ambient float loop — each fragment unique rhythm
      fragmentRefs.current.forEach((el, i) => {
        if (!el) return;
        const yAmp = 8 + (i % 3) * 7;
        const dur  = 3.2 + (i % 4) * 0.8;
        gsap.to(el, {
          y: "+=" + yAmp,
          duration: dur,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      fragmentRefs.current.forEach((p) => { if (p) gsap.set(p, { clearProps: "all" }); });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  // Mouse parallax (imperative — runs outside GSAP scope)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMove = (e: MouseEvent) => {
      const { width, height, left, top } = section.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - left) / width)  * 2 - 1;
      mouseRef.current.y = ((e.clientY - top)  / height) * 2 - 1;

      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        fragmentRefs.current.forEach((el, i) => {
          if (!el) return;
          const depth = FRAGMENTS[i]?.depth ?? 0.5;
          gsap.to(el, {
            x: mouseRef.current.x * 22 * depth,
            y: mouseRef.current.y * 12 * depth,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      });
    };

    section.addEventListener("mousemove", handleMove);
    return () => section.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="archive"
      aria-label="Interactive archive"
      className="relative min-h-screen overflow-hidden bg-[#0a0a0a]"
    >
      {/* center ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="absolute top-12 left-12 z-30 pointer-events-none select-none">
        <p className="text-white/15 text-xs tracking-[0.35em] uppercase font-medium">Archive</p>
      </div>

      {/* giant ambient wordmark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="font-extrabold text-white/2.5 leading-none"
          style={{ fontSize: "clamp(8rem,24vw,22rem)", letterSpacing: "-0.05em" }}
        >
          LAB
        </span>
      </div>

      {/* section heading — visible, centered, under the fragments */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none select-none">
        <p className="text-white/20 text-sm font-medium tracking-[0.2em] uppercase">
          Explorations &amp; experiments
        </p>
      </div>

      {/* floating fragments */}
      {FRAGMENTS.map((frag, i) => (
        <div
          key={frag.label}
          ref={(el) => { fragmentRefs.current[i] = el; }}
          className="absolute group cursor-default"
          style={{ left: frag.x + "%", top: frag.y + "%" }}
        >
          <div className="relative px-4 py-3 rounded-xl border border-white/8 bg-white/3 backdrop-blur-sm hover:border-white/18 hover:bg-white/6 transition-all duration-500">
            <p className="text-white/65 text-sm font-semibold leading-tight">{frag.label}</p>
            <p className="text-white/28 text-xs mt-0.5 font-medium">{frag.sub}</p>
            {/* hover dot */}
            <div
              className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: "#7c3aed" }}
            />
          </div>
        </div>
      ))}
    </section>
  );
}