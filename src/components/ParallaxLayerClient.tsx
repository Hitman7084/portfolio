"use client";

import dynamic from "next/dynamic";

// ssr: false is only valid inside a Client Component
const ParallaxLayer = dynamic(() => import("@/components/ParallaxLayer"), {
  ssr: false,
});

export default function ParallaxLayerClient() {
  return <ParallaxLayer />;
}
