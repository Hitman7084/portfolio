"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

export default function VisionStatement() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Slow drift upward while scrolling through — cinematic parallax
      gsap.fromTo(
        ".vs-text",
        { scale: 1, yPercent: 4 },
        {
          scale: 1.1,
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2.5,
          },
        }
      );

      // Lines stagger in on entrance
      gsap.from(".vs-line", {
        opacity: 0,
        yPercent: 12,
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 68%",
        },
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      aria-label="Vision"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] px-6"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="vs-text text-center relative z-10 select-none" aria-hidden="true">
        <div
          className="vs-line font-extrabold leading-none text-white/85 block"
          style={{ fontSize: "clamp(4.5rem,14vw,13rem)", letterSpacing: "-0.05em" }}
        >
          I build
        </div>
        <div
          className="vs-line font-extrabold leading-none block"
          style={{ fontSize: "clamp(4.5rem,14vw,13rem)", letterSpacing: "-0.05em", color: "rgba(255,255,255,0.45)" }}
        >
          experiences
        </div>
        <div
          className="vs-line font-extrabold leading-none text-white/85 block"
          style={{ fontSize: "clamp(4.5rem,14vw,13rem)", letterSpacing: "-0.05em" }}
        >
          people remember.
        </div>
      </div>

      {/* real accessible text for screen readers */}
      <p className="sr-only">I build experiences people remember.</p>
    </section>
  );
}