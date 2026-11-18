"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CONSTELLATIONS } from "@/data/constellations";
import { ConstellationData, MemoryItem } from "@/types";
import SpaceDome from "./SpaceDome";
import Constellation from "./Constellation";

interface CameraControllerProps {
  targetPosition: THREE.Vector3 | null;
  targetLookAt: THREE.Vector3 | null;
  isSplitView: boolean;
  onMovementComplete?: () => void;
}

function CameraController({
  targetPosition,
  targetLookAt,
  isSplitView,
}: CameraControllerProps) {
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ camera }) => {
    if (targetPosition) {
      // Lerp camera position towards target
      camera.position.lerp(targetPosition, 0.05);
    }

    if (targetLookAt) {
      currentLookAt.current.lerp(targetLookAt, 0.05);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}

interface SkyCanvasProps {
  selectedConstellation: ConstellationData | null;
  selectedNodeIndex: number | null;
  memories: MemoryItem[];
  isSplitView: boolean;
  onSelectConstellation: (c: ConstellationData) => void;
  onSelectNode: (nodeIndex: number) => void;
  resetTrigger: number;
}

export default function SkyCanvas({
  selectedConstellation,
  selectedNodeIndex,
  memories,
  isSplitView,
  onSelectConstellation,
  onSelectNode,
  resetTrigger,
}: SkyCanvasProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  // Group memories by constellation and node
  const memoriesByConstellationAndNode = memories.reduce((acc, m) => {
    if (!acc[m.constellationId]) {
      acc[m.constellationId] = {};
    }
    if (!acc[m.constellationId][m.nodeIndex]) {
      acc[m.constellationId][m.nodeIndex] = [];
    }
    acc[m.constellationId][m.nodeIndex].push(m);
    return acc;
  }, {} as Record<string, Record<number, MemoryItem[]>>);

  // Calculate target camera position and lookAt vector
  let targetPos: THREE.Vector3 | null = null;
  let targetLookAt: THREE.Vector3 | null = null;

  if (selectedConstellation) {
    if (selectedNodeIndex !== null && selectedConstellation.nodes[selectedNodeIndex]) {
      // Focus on specific star node
      const nodePos = selectedConstellation.nodes[selectedNodeIndex];
      const nodeVec = new THREE.Vector3(...nodePos);
      targetLookAt = nodeVec;

      // Position camera back along the vector from origin
      const dir = nodeVec.clone().normalize();
      targetPos = nodeVec.clone().add(dir.clone().multiplyScalar(isSplitView ? -12 : -18));
    } else {
      // Focus on entire constellation center
      const centerVec = new THREE.Vector3(...selectedConstellation.center);
      targetLookAt = centerVec;
      const dir = centerVec.clone().normalize();
      targetPos = centerVec.clone().add(dir.clone().multiplyScalar(-24));
    }
  }

  // Handle camera reset
  useEffect(() => {
    if (controlsRef.current && resetTrigger > 0) {
      controlsRef.current.reset();
    }
  }, [resetTrigger]);

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 65, near: 0.1, far: 200 }}
        className="w-full h-full"
      >
        <SpaceDome />

        {/* Orbit Controls for free drag/rotation */}
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.06}
          rotateSpeed={-0.35} // Inverted rotate for natural celestial dome experience
          minDistance={0.05}
          maxDistance={35}
        />

        <CameraController
          targetPosition={targetPos}
          targetLookAt={targetLookAt}
          isSplitView={isSplitView}
        />

        {/* Render all 12 constellations */}
        {CONSTELLATIONS.map((c) => {
          const isSelected = selectedConstellation?.id === c.id;
          const nodeMemories = memoriesByConstellationAndNode[c.id] || {};

          return (
            <Constellation
              key={c.id}
              constellation={c}
              memoriesByNode={nodeMemories}
              isSelected={isSelected}
              selectedNodeIndex={isSelected ? selectedNodeIndex : null}
              onSelectConstellation={onSelectConstellation}
              onSelectNode={onSelectNode}
            />
          );
        })}
      </Canvas>
    </div>
  );
}
