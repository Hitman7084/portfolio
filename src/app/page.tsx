import dynamic from "next/dynamic";
import Hero from "@/components/Hero";

const IdentitySequence   = dynamic(() => import("@/components/IdentitySequence"));
const CapabilityShowcase = dynamic(() => import("@/components/CapabilityShowcase"));
const InteractiveArchive = dynamic(() => import("@/components/InteractiveArchive"));
const VisionStatement    = dynamic(() => import("@/components/VisionStatement"));
const ContactExperience  = dynamic(() => import("@/components/ContactExperience"));

export default function Home() {
  return (
    <main className="relative bg-[#0a0a0a]">
      {/* 1. Hero World — cinematic 3D entry */}
      <Hero />
      {/* 2. Identity Sequence — who I am, told as cinematic scenes */}
      <IdentitySequence />
      {/* 3. Capability Showcase — what I build, not how I categorise it */}
      <CapabilityShowcase />
      {/* 4. Interactive Archive — floating experimental space */}
      <InteractiveArchive />
      {/* 5. Vision Statement — one massive editorial statement */}
      <VisionStatement />
      {/* 6. Final Contact Experience — cinematic outro */}
      <ContactExperience />
    </main>
  );
}
