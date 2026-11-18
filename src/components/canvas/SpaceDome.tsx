"use client";

import { useRef, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

function CelestialDomeSphere() {
  const texture = useTexture("/images/neowise/10-star-mini.jpg");
  const domeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (domeRef.current) {
      domeRef.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <mesh ref={domeRef}>
      <sphereGeometry args={[95, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

export default function SpaceDome() {
  const starsRef = useRef<THREE.Group>(null);

  // Subtle cosmic rotation
  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <>
      {/* Ambient background light */}
      <ambientLight intensity={0.6} />

      {/* Rotating Background Stars Field */}
      <group ref={starsRef}>
        <Stars
          radius={80}
          depth={40}
          count={4500}
          factor={4}
          saturation={0.5}
          fade
          speed={0.8}
        />
      </group>

      {/* Realistic Neowise Starfield Dome */}
      <Suspense fallback={null}>
        <CelestialDomeSphere />
      </Suspense>

      {/* Deep Space Navy Atmosphere Tint */}
      <mesh>
        <sphereGeometry args={[96, 32, 32]} />
        <meshBasicMaterial
          color="#03045E"
          side={THREE.BackSide}
          transparent
          opacity={0.2}
        />
      </mesh>
    </>
  );
}
