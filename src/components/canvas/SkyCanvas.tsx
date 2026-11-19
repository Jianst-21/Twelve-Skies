"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { CONSTELLATIONS } from "@/data/constellations";
import { ConstellationData, MemoryItem } from "@/types";
import SpaceDome from "./SpaceDome";
import Constellation from "./Constellation";
import { computeTargetDirection } from "./celestialMath";

const ORBIT_RADIUS = 0.1;
const MIN_FOV = 22;
const MAX_FOV = 76;
const OVERVIEW_FOV = 58;
const CONSTELLATION_FOV = 50;
const NODE_FOV = 36;

interface CameraRigProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  isFlyingRef: React.MutableRefObject<boolean>;
  isZoomingRef: React.MutableRefObject<boolean>;
  goalDirRef: React.MutableRefObject<THREE.Vector3>;
  targetFovRef: React.MutableRefObject<number>;
}

const IDENTITY_QUAT = new THREE.Quaternion();
const WORLD_UP = new THREE.Vector3(0, 1, 0);

function CameraRig({
  controlsRef,
  isFlyingRef,
  isZoomingRef,
  goalDirRef,
  targetFovRef,
}: CameraRigProps) {
  const currentDir = useRef(new THREE.Vector3(1, 0, 0));
  const stepQuat = useRef(new THREE.Quaternion());
  const fullQuat = useRef(new THREE.Quaternion());
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const persp = state.camera as THREE.PerspectiveCamera;
    const controls = controlsRef.current;

    // 1. Scale orbit drag speed smoothly with current zoom (FOV)
    if (controls) {
      controls.rotateSpeed = -0.36 * (persp.fov / CONSTELLATION_FOV);
    }

    // 2. Smooth FOV zoom transition
    if (isZoomingRef.current) {
      if (reducedMotionRef.current) {
        persp.fov = targetFovRef.current;
        isZoomingRef.current = false;
      } else {
        const nextFov = THREE.MathUtils.damp(persp.fov, targetFovRef.current, 8, dt);
        if (Math.abs(nextFov - targetFovRef.current) < 0.05) {
          persp.fov = targetFovRef.current;
          isZoomingRef.current = false;
        } else {
          persp.fov = nextFov;
        }
      }
      persp.updateProjectionMatrix();
    }

    // 3. Spherical direction fly-to without fighting OrbitControls
    if (isFlyingRef.current) {
      currentDir.current.copy(persp.position).negate().normalize();
      const goal = goalDirRef.current;
      const dot = THREE.MathUtils.clamp(currentDir.current.dot(goal), -1, 1);

      if (reducedMotionRef.current || dot > 0.999995) {
        persp.position.copy(goal).multiplyScalar(-ORBIT_RADIUS);
        isFlyingRef.current = false;
      } else {
        // Avoid 180-degree opposite-pole singularity by rotating around horizon up
        if (dot < -0.999) {
          fullQuat.current.setFromAxisAngle(WORLD_UP, Math.PI);
        } else {
          fullQuat.current.setFromUnitVectors(currentDir.current, goal);
        }
        const alpha = 1 - Math.exp(-5.5 * dt);
        stepQuat.current.copy(IDENTITY_QUAT).slerp(fullQuat.current, alpha);
        currentDir.current.applyQuaternion(stepQuat.current).normalize();
        persp.position.copy(currentDir.current).multiplyScalar(-ORBIT_RADIUS);
      }

      persp.lookAt(0, 0, 0);
      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }
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
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const isFlyingRef = useRef(false);
  const isZoomingRef = useRef(false);
  const goalDirRef = useRef(new THREE.Vector3(1, 0, 0));
  const targetFovRef = useRef(CONSTELLATION_FOV);
  const prevResetTriggerRef = useRef(resetTrigger);

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

  // Compute fly-to direction and FOV when selection, split-view, or reset changes
  useEffect(() => {
    if (!selectedConstellation) return;

    const didReset = resetTrigger !== prevResetTriggerRef.current;
    prevResetTriggerRef.current = resetTrigger;

    const nextFov = didReset
      ? OVERVIEW_FOV
      : selectedNodeIndex !== null
      ? NODE_FOV
      : CONSTELLATION_FOV;
    targetFovRef.current = nextFov;
    isZoomingRef.current = true;

    const nodePos =
      selectedNodeIndex !== null && selectedConstellation.nodes[selectedNodeIndex]
        ? selectedConstellation.nodes[selectedNodeIndex]
        : null;

    // On desktop split-view (right 45vw panel open), shift look target right so
    // the selected star node centers in the unobstructed left 55vw sky region.
    let splitOffsetTan = 0;
    if (isSplitView && typeof window !== "undefined" && window.innerWidth >= 768) {
      const aspect = window.innerWidth / Math.max(window.innerHeight, 1);
      splitOffsetTan = Math.tan((nextFov * Math.PI) / 360) * aspect * 0.45;
    }

    const dir = computeTargetDirection(
      selectedConstellation.center,
      nodePos,
      splitOffsetTan
    );
    goalDirRef.current.set(dir[0], dir[1], dir[2]).normalize();
    isFlyingRef.current = true;
  }, [selectedConstellation, selectedNodeIndex, isSplitView, resetTrigger]);

  // Smooth wheel-to-FOV zoom inside the celestial sphere
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const next = THREE.MathUtils.clamp(
        targetFovRef.current + e.deltaY * 0.025,
        MIN_FOV,
        MAX_FOV
      );
      targetFovRef.current = next;
      isZoomingRef.current = true;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Canvas
        dpr={[1, 2]}
        camera={{
          position: [-ORBIT_RADIUS, 0, 0],
          fov: CONSTELLATION_FOV,
          near: 0.05,
          far: 300,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
        className="w-full h-full"
      >
        <color attach="background" args={["#000000"]} />

        <SpaceDome />

        {/* Inside-out celestial dome orbit controls; immediately preempts auto-flight on drag */}
        <OrbitControls
          ref={controlsRef}
          target={[0, 0, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.07}
          rotateSpeed={-0.36}
          minDistance={ORBIT_RADIUS}
          maxDistance={ORBIT_RADIUS}
          minPolarAngle={0.22}
          maxPolarAngle={Math.PI - 0.22}
          onStart={() => {
            isFlyingRef.current = false;
          }}
        />

        <CameraRig
          controlsRef={controlsRef}
          isFlyingRef={isFlyingRef}
          isZoomingRef={isZoomingRef}
          goalDirRef={goalDirRef}
          targetFovRef={targetFovRef}
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
