"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import { fadeUp } from "@/lib/gsap";
import TextReveal from "@/components/TextReveal";

const SKILLS = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    category: "Motion",
    items: ["GSAP", "ScrollTrigger", "Framer Motion", "Lenis"],
  },
  {
    category: "3D & Creative",
    items: ["Three.js", "React Three Fiber", "WebGL", "Blender"],
  },
];

const LINES = [
  "I'm a full-stack developer who lives at the intersection of engineering and design.",
  "I care deeply about the details — the easing curve, the micro-interaction, the pixel that most people never notice.",
  "Currently building tools and experiences that push the web forward.",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Background gradient parallax
        gsap.fromTo(
          bgRef.current,
          { opacity: 0, scale: 1.1 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );

        // Section label
        gsap.from(".about-label", {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });

        // Skills groups
        fadeUp(".skill-group", {
          stagger: 0.12,
          delay: 0.3,
          scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 80%",
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            bgRef.current,
            ".about-label",
            ".skill-group",
          ],
          { clearProps: "all" }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="section relative overflow-hidden"
    >
      {/* Living gradient background — parallax-slow: recedes as section scrolls */}
      <div
        ref={bgRef}
        aria-hidden="true"
        className="parallax-slow absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(124,58,237,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 20% 80%, rgba(6,182,212,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10">
        {/* Label */}
        <p
          id="about-heading"
          className="about-label text-violet-400 text-sm font-medium tracking-[0.2em] uppercase mb-10"
        >
          About me
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Text column — parallax-fast: rises slightly ahead of scroll */}
          <div className="parallax-fast space-y-6">
            {LINES.map((line, i) => (
              <TextReveal
                key={i}
                className="text-white/80 text-lg md:text-xl leading-relaxed"
                scrollStart="top 80%"
                delay={i * 0.05}
              >
                {line}
              </TextReveal>
            ))}
          </div>

          {/* Skills column */}
          <div className="skills-grid space-y-8">
            {SKILLS.map(({ category, items }) => (
              <div key={category} className="skill-group">
                <h3 className="text-white/50 text-xs font-medium tracking-[0.2em] uppercase mb-3">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
