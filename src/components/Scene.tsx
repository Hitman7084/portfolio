"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import type { Mesh, DirectionalLight } from "three";

// ─── Cinematic Camera ────────────────────────────────────────────────────────
// Reads scrollProgress (0-1) every frame and smoothly lerps the camera
// through a three-phase journey: pull-back then arc left then rise.

function CinematicCamera({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number>;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const p = scrollProgress.current ?? 0;

    // Phase 1 (0→0.5): pull back + slow arc right
    // Phase 2 (0.5→1): arc peaks + camera rises
    const targetZ = 4 + p * 6;                      // 4 → 10
    const targetX = Math.sin(p * Math.PI) * 2.5;    // 0 → 2.5 → 0 (arc)
    const targetY = p * 1.5;                         // 0 → 1.5 (rise)

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Dynamic Lights ──────────────────────────────────────────────────────────
// Light position sweeps across the scene as the camera moves, creating
// a living, breathing lighting environment.

function DynamicLights({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number>;
}) {
  const dirRef = useRef<DirectionalLight>(null as unknown as DirectionalLight);

  useFrame(() => {
    if (dirRef.current == null) return;
    const p = scrollProgress.current ?? 0;
    // Key light sweeps from right (+3) to left (-3), following camera arc
    dirRef.current.position.set(3 - p * 6, 5, 5 - p * 2);
    dirRef.current.intensity = 1.2 + p * 0.8;
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight ref={dirRef} position={[3, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -3]} intensity={0.3} color="#a78bfa" />
    </>
  );
}

// ─── Floating Sphere ─────────────────────────────────────────────────────────
// Self-rotates and follows the cursor. Rotation speed increases with scroll
// progress, giving the impression of momentum building.

function FloatingSphere({
  mouse,
  scrollProgress,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  scrollProgress: React.RefObject<number>;
}) {
  const meshRef = useRef<Mesh>(null as unknown as Mesh);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (meshRef.current == null) return;
    const p = scrollProgress.current ?? 0;

    // Self-rotation — accelerates with scroll momentum
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * (0.2 + p * 0.6);

    // Vertical float — smooth sine bob
    const bob = Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
    meshRef.current.position.y += (bob - meshRef.current.position.y) * 0.04;

    // Horizontal cursor follow
    const targetX = (mouse.current.x * viewport.width) / 2;
    meshRef.current.position.x +=
      (targetX * 0.18 - meshRef.current.position.x) * 0.05;

    // Scale grows slightly as camera pulls back — keeps sphere visually prominent
    const targetScale = 1 + p * 0.5;
    meshRef.current.scale.setScalar(
      meshRef.current.scale.x + (targetScale - meshRef.current.scale.x) * 0.04
    );
  });

  return (
    <mesh ref={meshRef}>
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

// ─── Scene ───────────────────────────────────────────────────────────────────

export default function Scene({
  mouse,
  scrollProgress,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  scrollProgress: React.RefObject<number>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      performance={{ min: 0.5 }}
      style={{ background: "transparent" }}
    >
      <CinematicCamera scrollProgress={scrollProgress} />
      <DynamicLights scrollProgress={scrollProgress} />
      <FloatingSphere mouse={mouse} scrollProgress={scrollProgress} />
    </Canvas>
  );
}
