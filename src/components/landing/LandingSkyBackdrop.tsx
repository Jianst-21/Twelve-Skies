"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ILLUSTRATIVE_MEMORIES } from "@/data/illustrativeMemories";
import { MemoryItem } from "@/types";
import SpaceDome from "@/components/canvas/SpaceDome";
import Constellation from "@/components/canvas/Constellation";
import {
  DOME_CONSTELLATIONS,
  DOME_CONSTELLATION_MAP,
} from "@/components/canvas/domeConstellations";
import { computeLandingCameraDirection } from "@/components/canvas/celestialMath";

const ORBIT_RADIUS = 0.1;
const LANDING_FOV = 52;
const IDENTITY_QUAT = new THREE.Quaternion();
const WORLD_UP = new THREE.Vector3(0, 1, 0);

interface LandingCameraRigProps {
  focusedConstellationId: string;
  focusedNodeIndex: number | null;
  lockScrollDrift: boolean;
}

function LandingCameraRig({
  focusedConstellationId,
  focusedNodeIndex,
  lockScrollDrift,
}: LandingCameraRigProps) {
  const currentDir = useRef(new THREE.Vector3(1, 0, 0));
  const goalDir = useRef(new THREE.Vector3(1, 0, 0));
  const fullQuat = useRef(new THREE.Quaternion());
  const stepQuat = useRef(new THREE.Quaternion());
  const reducedMotionRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const persp = state.camera as THREE.PerspectiveCamera;

    const targetConstellation =
      DOME_CONSTELLATION_MAP[focusedConstellationId] ?? DOME_CONSTELLATIONS[0];

    const maxScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    const rawProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    const isDesktop = window.innerWidth >= 1024;

    // Frame the active constellation in the open upper-right sky on desktop hero
    // so it stays clear of both the left headline and bottom-right sample card.
    const heroWeight = Math.max(0, 1 - rawProgress * 2.6);
    const horizontalShiftTan = isDesktop ? -0.26 * heroWeight : 0;
    const verticalShiftTan = isDesktop ? -0.1 * heroWeight : 0;

    const effectiveScroll =
      reducedMotionRef.current || lockScrollDrift ? 0 : rawProgress;

    const nodePos =
      focusedNodeIndex !== null && targetConstellation.nodes[focusedNodeIndex]
        ? targetConstellation.nodes[focusedNodeIndex]
        : null;

    const desired = computeLandingCameraDirection(
      targetConstellation.center,
      nodePos,
      {
        horizontalShiftTan,
        verticalShiftTan,
        scrollProgress: effectiveScroll,
        maxYawRad: 0.28,
        maxPitchRad: 0.08,
      }
    );
    goalDir.current.set(desired[0], desired[1], desired[2]).normalize();

    if (!initializedRef.current) {
      initializedRef.current = true;
      currentDir.current.copy(goalDir.current);
      persp.position.copy(currentDir.current).multiplyScalar(-ORBIT_RADIUS);
      persp.lookAt(0, 0, 0);
      return;
    }

    const dot = THREE.MathUtils.clamp(
      currentDir.current.dot(goalDir.current),
      -1,
      1
    );

    if (reducedMotionRef.current || dot > 0.999995) {
      currentDir.current.copy(goalDir.current);
    } else {
      if (dot < -0.999) {
        fullQuat.current.setFromAxisAngle(WORLD_UP, Math.PI);
      } else {
        fullQuat.current.setFromUnitVectors(currentDir.current, goalDir.current);
      }
      const alpha = 1 - Math.exp(-3.2 * dt);
      stepQuat.current.copy(IDENTITY_QUAT).slerp(fullQuat.current, alpha);
      currentDir.current.applyQuaternion(stepQuat.current).normalize();
    }

    persp.position.copy(currentDir.current).multiplyScalar(-ORBIT_RADIUS);
    persp.lookAt(0, 0, 0);
  });

  return null;
}

export interface LandingSkyBackdropProps {
  focusedConstellationId: string;
  focusedNodeIndex: number | null;
  lockScrollDrift: boolean;
  onSelectStarNode: (constellationId: string, nodeIndex: number) => void;
}

export default function LandingSkyBackdrop({
  focusedConstellationId,
  focusedNodeIndex,
  lockScrollDrift,
  onSelectStarNode,
}: LandingSkyBackdropProps) {
  const [webglSupported] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const testCanvas = document.createElement("canvas");
      return Boolean(
        window.WebGLRenderingContext &&
          (testCanvas.getContext("webgl2") || testCanvas.getContext("webgl"))
      );
    } catch {
      return false;
    }
  });

  // Map illustrative sample entries into MemoryItem shape so the exact 3D StarNode
  // memory beacon rings and circular hover-bloom previews match /sky identically.
  const sampleMemoriesByConstellation = useMemo(() => {
    return ILLUSTRATIVE_MEMORIES.reduce((acc, entry) => {
      if (!acc[entry.constellationId]) {
        acc[entry.constellationId] = {};
      }
      if (!acc[entry.constellationId][entry.nodeIndex]) {
        acc[entry.constellationId][entry.nodeIndex] = [];
      }
      const memory: MemoryItem = {
        id: entry.id,
        userId: "sample",
        imageUrl: entry.image,
        caption: `${entry.title} (Sample)`,
        location: entry.location,
        memoryDate: `${entry.dateIso}T00:00:00.000Z`,
        constellationId: entry.constellationId,
        nodeIndex: entry.nodeIndex,
        createdAt: `${entry.dateIso}T00:00:00.000Z`,
      };
      acc[entry.constellationId][entry.nodeIndex].push(memory);
      return acc;
    }, {} as Record<string, Record<number, MemoryItem[]>>);
  }, []);

  const initialCamPos = useMemo<[number, number, number]>(() => {
    const startConstellation =
      DOME_CONSTELLATION_MAP[focusedConstellationId] ?? DOME_CONSTELLATIONS[0];
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    const dir = computeLandingCameraDirection(startConstellation.center, null, {
      horizontalShiftTan: isDesktop ? -0.26 : 0,
      verticalShiftTan: isDesktop ? -0.1 : 0,
      scrollProgress: 0,
    });
    return [
      -dir[0] * ORBIT_RADIUS,
      -dir[1] * ORBIT_RADIUS,
      -dir[2] * ORBIT_RADIUS,
    ];
    // Mount-only initial camera alignment
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!webglSupported) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-space-black"
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-0 bg-space-black"
      style={{ touchAction: "pan-y" }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{
          position: initialCamPos,
          fov: LANDING_FOV,
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

        {/* Exact procedural Milky Way dome + 4,200 J2000 catalog stars + armillary rings */}
        <SpaceDome />

        <LandingCameraRig
          focusedConstellationId={focusedConstellationId}
          focusedNodeIndex={focusedNodeIndex}
          lockScrollDrift={lockScrollDrift}
        />

        {/* Exact 12 3D constellations and 4-point diffraction-spike StarNodes from /sky */}
        {DOME_CONSTELLATIONS.map((c) => {
          const isFocused = c.id === focusedConstellationId;
          const nodeMemories = sampleMemoriesByConstellation[c.id] || {};
          return (
            <Constellation
              key={c.id}
              constellation={c}
              memoriesByNode={nodeMemories}
              isSelected={isFocused}
              selectedNodeIndex={isFocused ? focusedNodeIndex : null}
              showNameplate={false}
              interactive={isFocused}
              onSelectConstellation={() => {}}
              onSelectNode={(nodeIdx) => onSelectStarNode(c.id, nodeIdx)}
            />
          );
        })}
      </Canvas>
    </div>
  );
}
