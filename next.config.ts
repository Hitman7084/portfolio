import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tree-shake large packages so only imported members land in the bundle
  experimental: {
    optimizePackageImports: [
      "gsap",
      "@gsap/react",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "lenis",
    ],
  },
  // Enforce strict mode for catching double-render issues early
  reactStrictMode: true,
};

export default nextConfig;
