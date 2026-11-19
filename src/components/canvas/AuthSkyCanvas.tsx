"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MemoryItem } from "@/types";
import SpaceDome from "@/components/canvas/SpaceDome";
import Constellation from "@/components/canvas/Constellation";
import {
  DOME_CONSTELLATIONS,
  DOME_CONSTELLATION_MAP,
} from "@/components/canvas/domeConstellations";
import { computeLandingCameraDirection } from "@/components/canvas/celestialMath";

const ORBIT_RADIUS = 0.1;
const AUTH_FOV = 52;
const IDENTITY_QUAT = new THREE.Quaternion();
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const EMPTY_NODE_MEMORIES: Record<number, MemoryItem[]> = {};
const NOOP_SELECT_CONSTELLATION = () => {};
const NOOP_SELECT_NODE = () => {};

export type AuthSkyAlign = "left-panel" | "center";

interface AuthCameraRigProps {
  focusedConstellationId: string;
  desktopAlign: AuthSkyAlign;
}

function AuthCameraRig({
  focusedConstellationId,
  desktopAlign,
}: AuthCameraRigProps) {
  const currentDir = useRef(new THREE.Vector3(1, 0, 0));
  const goalDir = useRef(new THREE.Vector3(1, 0, 0));
  const fullQuat = useRef(new THREE.Quaternion());
  const stepQuat = useRef(new THREE.Quaternion());
  const reducedMotionRef = useRef(false);
  const initializedRef = useRef(false);
  const needsGoalRecomputeRef = useRef(true);
  const settledRef = useRef(false);
  const isDesktopRef = useRef(true);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handleResize = () => {
      const nextIsDesktop = window.innerWidth >= 1024;
      if (nextIsDesktop !== isDesktopRef.current) {
        isDesktopRef.current = nextIsDesktop;
        needsGoalRecomputeRef.current = true;
        settledRef.current = false;
      }
    };

    isDesktopRef.current = window.innerWidth >= 1024;
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    needsGoalRecomputeRef.current = true;
    settledRef.current = false;
  }, [focusedConstellationId, desktopAlign]);

  useFrame((state, delta) => {
    if (settledRef.current && !needsGoalRecomputeRef.current) {
      return;
    }

    const persp = state.camera as THREE.PerspectiveCamera;

    if (needsGoalRecomputeRef.current) {
      needsGoalRecomputeRef.current = false;

      const targetConstellation =
        DOME_CONSTELLATION_MAP[focusedConstellationId] ?? DOME_CONSTELLATIONS[0];
      const isDesktop = isDesktopRef.current;
      const horizontalShiftTan = isDesktop
        ? desktopAlign === "left-panel"
          ? -0.25
          : -0.24
        : 0;
      const verticalShiftTan = isDesktop
        ? desktopAlign === "left-panel"
          ? -0.05
          : -0.12
        : 0;

      const desired = computeLandingCameraDirection(
        targetConstellation.center,
        null,
        {
          horizontalShiftTan,
          verticalShiftTan,
          scrollProgress: 0,
        }
      );
      goalDir.current.set(desired[0], desired[1], desired[2]).normalize();
    }

    if (!initializedRef.current) {
      initializedRef.current = true;
      currentDir.current.copy(goalDir.current);
      persp.position.copy(currentDir.current).multiplyScalar(-ORBIT_RADIUS);
      persp.lookAt(0, 0, 0);
      settledRef.current = true;
      return;
    }

    const dot = THREE.MathUtils.clamp(
      currentDir.current.dot(goalDir.current),
      -1,
      1
    );

    if (reducedMotionRef.current || dot > 0.999995) {
      currentDir.current.copy(goalDir.current);
      settledRef.current = true;
    } else {
      const dt = Math.min(delta, 0.05);
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

export interface AuthSkyCanvasProps {
  focusedConstellationId: string;
  desktopAlign?: AuthSkyAlign;
}

export default function AuthSkyCanvas({
  focusedConstellationId,
  desktopAlign = "left-panel",
}: AuthSkyCanvasProps) {
  const [isTabVisible, setIsTabVisible] = useState(true);
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

  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState !== "hidden");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const initialCamPos = useMemo<[number, number, number]>(() => {
    const startConstellation =
      DOME_CONSTELLATION_MAP[focusedConstellationId] ?? DOME_CONSTELLATIONS[0];
    const isDesktop =
      typeof window !== "undefined" && window.innerWidth >= 1024;
    const horizontalShiftTan = isDesktop
      ? desktopAlign === "left-panel"
        ? -0.25
        : -0.24
      : 0;
    const verticalShiftTan = isDesktop
      ? desktopAlign === "left-panel"
        ? -0.05
        : -0.12
      : 0;
    const dir = computeLandingCameraDirection(startConstellation.center, null, {
      horizontalShiftTan,
      verticalShiftTan,
      scrollProgress: 0,
    });
    return [
      -dir[0] * ORBIT_RADIUS,
      -dir[1] * ORBIT_RADIUS,
      -dir[2] * ORBIT_RADIUS,
    ];
    // Mount-only initial camera alignment matching LandingSkyBackdrop and SkyCanvas
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
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-space-black"
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={isTabVisible ? "always" : "never"}
        camera={{
          position: initialCamPos,
          fov: AUTH_FOV,
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

        <AuthCameraRig
          focusedConstellationId={focusedConstellationId}
          desktopAlign={desktopAlign}
        />

        {DOME_CONSTELLATIONS.map((c) => (
          <Constellation
            key={c.id}
            constellation={c}
            memoriesByNode={EMPTY_NODE_MEMORIES}
            isSelected={c.id === focusedConstellationId}
            selectedNodeIndex={null}
            showNameplate={false}
            interactive={false}
            onSelectConstellation={NOOP_SELECT_CONSTELLATION}
            onSelectNode={NOOP_SELECT_NODE}
          />
        ))}
      </Canvas>
    </div>
  );
}
