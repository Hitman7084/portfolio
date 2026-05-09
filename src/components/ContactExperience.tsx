"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";

const EMAIL = "hello@yourname.com";

export default function ContactExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef     = useRef<HTMLAnchorElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Typography lines stagger in
      gsap.from(".cx-line", {
        opacity: 0,
        yPercent: 18,
        duration: 1.5,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      });

      // CTA button fades in after lines
      gsap.from(btnRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out",
        delay: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      });

      // Ambient glow rises with scroll
      gsap.fromTo(
        glowRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          },
        }
      );

      // Section slowly darkens as the experience concludes
      gsap.fromTo(
        sectionRef.current,
        { backgroundColor: "#0a0a0a" },
        {
          backgroundColor: "#040404",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "center center",
            scrub: 2,
          },
        }
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  // Magnetic CTA
  const handleBtnMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const btn = btnRef.current;
    if (!btn) return;
    const { left, top, width, height } = btn.getBoundingClientRect();
    gsap.to(btn, {
      x: (e.clientX - (left + width  / 2)) * 0.4,
      y: (e.clientY - (top  + height / 2)) * 0.4,
      duration: 0.4, ease: "power2.out", overwrite: "auto",
    });
  };

  const handleBtnLeave = () => {
    gsap.to(btnRef.current, {
      x: 0, y: 0,
      duration: 0.8, ease: "elastic.out(1,0.4)", overwrite: "auto",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-6"
    >
      {/* ambient glow — fades in as user arrives */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(124,58,237,0.09) 0%, transparent 70%)",
        }}
      />

      <div className="absolute top-12 right-12 pointer-events-none select-none">
        <p className="text-white/15 text-xs tracking-[0.35em] uppercase font-medium">Contact</p>
      </div>

      {/* Cinematic outro typography */}
      <div className="text-center mb-16 relative z-10" aria-hidden="true">
        <div
          className="cx-line font-extrabold leading-none text-white/90 block select-none"
          style={{ fontSize: "clamp(4rem,13vw,12rem)", letterSpacing: "-0.05em" }}
        >
          LET&apos;S
        </div>
        <div
          className="cx-line font-extrabold leading-none text-white/70 block select-none"
          style={{ fontSize: "clamp(4rem,13vw,12rem)", letterSpacing: "-0.05em" }}
        >
          BUILD
        </div>
        <div
          className="cx-line font-extrabold leading-none text-white/45 block select-none"
          style={{ fontSize: "clamp(4rem,13vw,12rem)", letterSpacing: "-0.05em" }}
        >
          SOMETHING
        </div>
        <div
          className="cx-line font-extrabold leading-none block select-none"
          style={{
            fontSize: "clamp(4rem,13vw,12rem)",
            letterSpacing: "-0.05em",
            color: "rgba(124,58,237,0.9)",
          }}
        >
          UNFORGETTABLE.
        </div>
      </div>
      <p className="sr-only">Let&apos;s build something unforgettable.</p>

      {/* Magnetic CTA */}
      <a
        ref={btnRef}
        href={`mailto:${EMAIL}`}
        className="relative z-10 group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/15 text-white/70 text-sm font-medium tracking-wide hover:border-violet-500/50 hover:text-white transition-colors duration-500"
        onMouseMove={handleBtnMove}
        onMouseLeave={handleBtnLeave}
        aria-label={"Send email to " + EMAIL}
      >
        {/* hover glow behind button */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.2) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
        <span className="relative z-10">{EMAIL}</span>
        <svg
          aria-hidden="true"
          className="relative z-10 w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}