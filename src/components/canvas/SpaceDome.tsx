"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

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
      <ambientLight intensity={0.4} />

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

      {/* Deep Space Dome Sphere (Nebula dust gradient) */}
      <mesh>
        <sphereGeometry args={[95, 32, 32]} />
        <meshBasicMaterial
          color="#03045E"
          side={THREE.BackSide}
          transparent
          opacity={0.15}
        />
      </mesh>
    </>
  );
}
