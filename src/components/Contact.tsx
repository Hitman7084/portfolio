"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/hooks/useGSAP";
import TextReveal from "@/components/TextReveal";

const EMAIL = "hello@yourname.com";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  // ── Entrance animation ────────────────────────────────────────────────
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });

        tl.from(".contact-label", {
          y: 20,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
        })
          .from(
            ".contact-heading",
            { y: 60, autoAlpha: 0, duration: 1, ease: "power3.out" },
            "-=0.4"
          )
          .from(
            btnRef.current,
            { y: 20, autoAlpha: 0, duration: 0.7, ease: "power3.out" },
            "-=0.5"
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [".contact-label", ".contact-heading", btnRef.current],
          { clearProps: "all" }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  // ── Magnetic button ───────────────────────────────────────────────────
  const handleBtnMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const btn = btnRef.current;
    if (!btn) return;
    const { left, top, width, height } = btn.getBoundingClientRect();
    const dx = (e.clientX - (left + width / 2)) * 0.35;
    const dy = (e.clientY - (top + height / 2)) * 0.35;
    gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: "power2.out", overwrite: "auto" });
  };

  const handleBtnMouseLeave = () => {
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
      overwrite: "auto",
    });
  };

  return (
    <section id="contact" ref={sectionRef} className="section">
      <div className="container">
        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-20" />

        <div className="flex flex-col items-center text-center gap-8 max-w-2xl mx-auto">
          <p className="contact-label text-violet-400 text-sm font-medium tracking-[0.2em] uppercase">
            Get in touch
          </p>

          <h2 className="contact-heading heading-xl text-white">
            Let&apos;s work
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-cyan-400">
              together.
            </span>
          </h2>

          <TextReveal
            className="text-white/50 text-lg leading-relaxed text-center"
            scrollStart="top 80%"
          >
            Have a project in mind? I&#x27;d love to hear about it. Drop me a line and let&#x27;s make something great.
          </TextReveal>

          <a
            ref={btnRef}
            href={`mailto:${EMAIL}`}
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
            aria-label={`Send email to ${EMAIL}`}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors duration-300 text-sm"
          >
            {EMAIL}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 13L13 3M13 3H7M13 3V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}