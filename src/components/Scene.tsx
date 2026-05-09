"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { Timer } from "three";
import type { Mesh } from "three";

// THREE.Clock is deprecated in r168+. Build a compatible adapter using Timer
// so R3F's internal render loop doesn't trigger the deprecation warning.
function createTimerClock() {
  const timer = new Timer();
  let elapsed = 0;
  return {
    autoStart: true,
    getDelta() {
      timer.update();
      const d = timer.getDelta();
      elapsed += d;
      return d;
    },
    getElapsedTime() {
      return elapsed;
    },
    start() {},
    stop() {},
  };
}

// ─── Floating mesh ──────────────────────────────────────────────────────────

function FloatingSphere({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<Mesh>(null!);
  const { viewport } = useThree();

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Slow self-rotation
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.25;

    // Soft cursor follow
    const targetX = (mouse.current.x * viewport.width) / 2;
    const targetY = (mouse.current.y * viewport.height) / 2;
    meshRef.current.position.x +=
      (targetX * 0.18 - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y +=
      (targetY * 0.18 - meshRef.current.position.y) * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      {/* 24 segments — visually identical to 32, ~25% fewer vertices */}
      <sphereGeometry args={[1.4, 24, 24]} />
      <MeshDistortMaterial
        color="#7c3aed"
        distort={0.35}
        speed={1.8}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  );
}

// ─── Scene ──────────────────────────────────────────────────────────────────

export default function Scene({
  mouse,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      performance={{ min: 0.5 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -3]} intensity={0.3} color="#a78bfa" />
      <FloatingSphere mouse={mouse} />
    </Canvas>
  );
}