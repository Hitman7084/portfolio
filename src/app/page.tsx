import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import ParallaxLayerClient from "@/components/ParallaxLayerClient";

// Below-fold sections: dynamically imported so their JS is only fetched
// after the initial page paint. Hero is kept eager (above the fold).
const Work = dynamic(() => import("@/components/Work"));
const About = dynamic(() => import("@/components/About"));
const Services = dynamic(() => import("@/components/Services"));
const Lab = dynamic(() => import("@/components/Lab"));
const Contact = dynamic(() => import("@/components/Contact"));


export default function Home() {
  return (
    <main className="relative">
      {/* Page-level parallax: drives .parallax-slow / .parallax-fast across all sections */}
      <ParallaxLayerClient />
      {/* 1. Hook — cinematic full-screen intro */}
      <Hero />
      {/* 2. Proof — show the work immediately */}
      <Work />
      {/* 3. Story — who is behind the work */}
      <About />
      {/* 4. Offer — what I can do for you */}
      <Services />
      {/* 5. Play — experimental side */}
      <Lab />
      {/* 6. CTA — let's connect */}
      <Contact />
    </main>
  );
}
