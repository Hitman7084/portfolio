"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

const STATEMENTS = [
  {
    verb: "I design",
    noun: "systems.",
    color: "#7c3aed",
    body: "Architecture, component libraries, design tokens — structures that scale elegantly.",
  },
  {
    verb: "I engineer",
    noun: "motion.",
    color: "#06b6d4",
    body: "Timelines, physics, scroll storytelling — interfaces that feel genuinely alive.",
  },
  {
    verb: "I build",
    noun: "experiences.",
    color: "#a21caf",
    body: "Products people remember long after they close the tab.",
  },
];

export default function IdentitySequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const panels = panelRefs.current.filter((p): p is HTMLDivElement => p !== null);

      // Panels 1+ start hidden
      gsap.set(panels.slice(1), { opacity: 0, yPercent: 8, filter: "blur(14px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      for (let i = 0; i < panels.length - 1; i++) {
        tl.to({}, { duration: 1.4 })
          .to(panels[i],     { opacity: 0, yPercent: -8, filter: "blur(14px)", duration: 0.5, ease: "power3.in" })
          .to(panels[i + 1], { opacity: 1, yPercent: 0,  filter: "blur(0px)",  duration: 0.6, ease: "power3.out" }, "<");
      }
      tl.to({}, { duration: 1.4 });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      panelRefs.current.forEach((p) => { if (p) gsap.set(p, { clearProps: "all" }); });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      aria-label="Identity"
      className="relative h-screen overflow-hidden bg-[#0a0a0a]"
    >
      <div className="absolute top-12 right-12 z-30 pointer-events-none select-none">
        <p className="text-white/15 text-xs tracking-[0.35em] uppercase font-medium">Identity</p>
      </div>

      {STATEMENTS.map((stmt, i) => (
        <div
          key={i}
          ref={(el) => { panelRefs.current[i] = el; }}
          className="absolute inset-0 flex flex-col justify-center px-10 md:px-24 lg:px-32"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 25% 60%, ${stmt.color}10 0%, transparent 70%)`,
            }}
          />

          <div className="relative z-10 max-w-5xl">
            <p className="text-white/20 text-xs tracking-[0.4em] uppercase font-medium mb-12">
              {String(i + 1).padStart(2, "0")}&nbsp;&mdash;&nbsp;{String(STATEMENTS.length).padStart(2, "0")}
            </p>

            <div
              className="font-extrabold leading-none text-white/85"
              style={{ fontSize: "clamp(4rem,11vw,10rem)", letterSpacing: "-0.04em" }}
            >
              {stmt.verb}
            </div>
            <div
              className="font-extrabold leading-none mb-10"
              style={{ fontSize: "clamp(4rem,11vw,10rem)", letterSpacing: "-0.04em", color: stmt.color }}
            >
              {stmt.noun}
            </div>
            <p className="text-white/40 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              {stmt.body}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}