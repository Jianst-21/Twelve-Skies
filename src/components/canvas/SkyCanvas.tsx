"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { ConstellationData, MemoryItem } from "@/types";
import SpaceDome from "./SpaceDome";
import Constellation from "./Constellation";
import { computeTargetDirection } from "./celestialMath";
import { DOME_CONSTELLATIONS, DOME_CONSTELLATION_MAP } from "./domeConstellations";

const ORBIT_RADIUS = 0.1;
const MIN_FOV = 28;
const MAX_FOV = 70;
const OVERVIEW_FOV = 58;
const CONSTELLATION_FOV = 52;
const NODE_FOV = 42;
const EMPTY_NODE_MEMORIES: Record<number, MemoryItem[]> = {};

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
  const lastAppliedFovRef = useRef(-1);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useFrame((state, delta) => {
    const persp = state.camera as THREE.PerspectiveCamera;
    const controls = controlsRef.current;

    // 1. Scale orbit drag speed smoothly only when FOV changes
    if (controls && lastAppliedFovRef.current !== persp.fov) {
      lastAppliedFovRef.current = persp.fov;
      controls.rotateSpeed = -0.28 * (persp.fov / CONSTELLATION_FOV);
    }

    if (!isZoomingRef.current && !isFlyingRef.current) {
      return;
    }

    const dt = Math.min(delta, 0.05);

    // 2. Smooth FOV zoom transition
    if (isZoomingRef.current) {
      if (reducedMotionRef.current) {
        persp.fov = targetFovRef.current;
        isZoomingRef.current = false;
      } else {
        const nextFov = THREE.MathUtils.damp(persp.fov, targetFovRef.current, 5.2, dt);
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
        const alpha = 1 - Math.exp(-3.6 * dt);
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
  const hasMountedRef = useRef(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState !== "hidden");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const activeDomeConstellation = selectedConstellation
    ? DOME_CONSTELLATION_MAP[selectedConstellation.id] ?? selectedConstellation
    : null;

  const initialCamPos = useMemo<[number, number, number]>(() => {
    const startConstellation =
      activeDomeConstellation ?? DOME_CONSTELLATIONS[0];
    const dir = computeTargetDirection(startConstellation.center, null, 0);
    return [
      -dir[0] * ORBIT_RADIUS,
      -dir[1] * ORBIT_RADIUS,
      -dir[2] * ORBIT_RADIUS,
    ];
    // Mount-only initial camera alignment so page entry never triggers a dizzying spin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group memories by constellation and node (memoized so React.memo on Constellation holds)
  const memoriesByConstellationAndNode = useMemo(
    () =>
      memories.reduce((acc, m) => {
        if (!acc[m.constellationId]) {
          acc[m.constellationId] = {};
        }
        if (!acc[m.constellationId][m.nodeIndex]) {
          acc[m.constellationId][m.nodeIndex] = [];
        }
        acc[m.constellationId][m.nodeIndex].push(m);
        return acc;
      }, {} as Record<string, Record<number, MemoryItem[]>>),
    [memories]
  );

  // Compute fly-to direction and FOV when selection, split-view, or reset changes
  useEffect(() => {
    if (!activeDomeConstellation) return;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      const initDir = computeTargetDirection(activeDomeConstellation.center, null, 0);
      goalDirRef.current.set(initDir[0], initDir[1], initDir[2]).normalize();
      if (selectedNodeIndex === null) {
        return;
      }
    }

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
      selectedNodeIndex !== null &&
      activeDomeConstellation.nodes[selectedNodeIndex]
        ? activeDomeConstellation.nodes[selectedNodeIndex]
        : null;

    // On desktop split-view (right 45vw panel open), shift look target right so
    // the selected star node centers in the unobstructed left 55vw sky region.
    let splitOffsetTan = 0;
    if (isSplitView && typeof window !== "undefined" && window.innerWidth >= 768) {
      const aspect = window.innerWidth / Math.max(window.innerHeight, 1);
      splitOffsetTan = Math.tan((nextFov * Math.PI) / 360) * aspect * 0.35;
    }

    const dir = computeTargetDirection(
      activeDomeConstellation.center,
      nodePos,
      splitOffsetTan
    );
    goalDirRef.current.set(dir[0], dir[1], dir[2]).normalize();
    isFlyingRef.current = true;
  }, [activeDomeConstellation, selectedNodeIndex, isSplitView, resetTrigger]);

  // Smooth wheel-to-FOV zoom inside the celestial sphere
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const next = THREE.MathUtils.clamp(
        targetFovRef.current + e.deltaY * 0.018,
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
        dpr={[1, 1.5]}
        frameloop={isTabVisible ? "always" : "never"}
        camera={{
          position: initialCamPos,
          fov: CONSTELLATION_FOV,
          near: 0.05,
          far: 300,
        }}
        gl={{
          antialias: true,
          stencil: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12,
        }}
        className="w-full h-full"
      >
        <color attach="background" args={["#000000"]} />

        <SpaceDome />

        {/* Inside-out celestial dome orbit controls; higher damping stops slippery coasting */}
        <OrbitControls
          ref={controlsRef}
          target={[0, 0, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.14}
          rotateSpeed={-0.28}
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

        {/* Render all 12 constellations across the 3D spherical dome wave */}
        {DOME_CONSTELLATIONS.map((c) => {
          const isSelected = selectedConstellation?.id === c.id;
          const nodeMemories =
            memoriesByConstellationAndNode[c.id] ?? EMPTY_NODE_MEMORIES;

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
