"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import type { Line2, LineSegments2 } from "three-stdlib";
import * as THREE from "three";
import { ConstellationData, MemoryItem } from "@/types";
import { getNodeDateRange } from "@/lib/dateDistributor";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";
import StarNode from "./StarNode";
import {
  computeConstellationLabelPosition,
  computeSegmentHitbox,
} from "./celestialMath";

interface ConstellationProps {
  constellation: ConstellationData;
  memoriesByNode: Record<number, MemoryItem[]>;
  isSelected: boolean;
  selectedNodeIndex: number | null;
  onSelectConstellation: (constellation: ConstellationData) => void;
  onSelectNode: (nodeIndex: number) => void;
  showNameplate?: boolean;
  interactive?: boolean;
}

const FORWARD_AXIS = new THREE.Vector3(0, 0, -1);
const CYLINDER_UP = new THREE.Vector3(0, 1, 0);

export default function Constellation({
  constellation,
  memoriesByNode,
  isSelected,
  selectedNodeIndex,
  onSelectConstellation,
  onSelectNode,
  showNameplate = true,
  interactive = true,
}: ConstellationProps) {
  const [isLabelHovered, setIsLabelHovered] = useState(false);
  const [hoveredNodeIndex, setHoveredNodeIndex] = useState<number | null>(null);
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);
  const [isInFront, setIsInFront] = useState(true);

  const camForwardRef = useRef(new THREE.Vector3());
  const inFrontRef = useRef(true);
  const baseLineRef = useRef<Line2 | LineSegments2 | null>(null);
  const glowLineRef = useRef<Line2 | LineSegments2 | null>(null);
  const baseOpacityRef = useRef(isSelected ? 0.88 : 0.3);
  const glowOpacityRef = useRef(isSelected ? 0.2 : 0);
  const reducedMotionRef = useRef(false);

  const isHovered =
    isLabelHovered || hoveredNodeIndex !== null || hoveredLineIndex !== null;
  const isActive = isSelected || isHovered;

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  const totalConstellationMemories = useMemo(
    () =>
      Object.values(memoriesByNode).reduce((sum, list) => sum + list.length, 0),
    [memoriesByNode]
  );

  // Pairwise segment list for screen-space anti-aliased Drei <Line segments />
  const linePoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (const [fromIdx, toIdx] of constellation.lines) {
      const fromPos = constellation.nodes[fromIdx];
      const toPos = constellation.nodes[toIdx];
      if (fromPos && toPos) {
        pts.push(fromPos, toPos);
      }
    }
    return pts;
  }, [constellation]);

  // Invisible trimmed raycast cylinders along each filament for effortless line hover
  const segmentHitboxes = useMemo(() => {
    return constellation.lines
      .map(([fromIdx, toIdx], lineIdx) => {
        const fromPos = constellation.nodes[fromIdx];
        const toPos = constellation.nodes[toIdx];
        if (!fromPos || !toPos) return null;

        const hitbox = computeSegmentHitbox(fromPos, toPos, 1.15);
        if (!hitbox) return null;

        const dir = new THREE.Vector3(...hitbox.direction);
        const quat = new THREE.Quaternion().setFromUnitVectors(CYLINDER_UP, dir);
        return {
          lineIdx,
          midpoint: hitbox.midpoint,
          length: hitbox.length,
          quaternion: quat,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [constellation]);

  const labelPosition = useMemo(
    () => computeConstellationLabelPosition(constellation, 2.7),
    [constellation]
  );

  const centerDir = useMemo(
    () => new THREE.Vector3(...constellation.center).normalize(),
    [constellation.center]
  );

  // Hide HTML nameplates behind the camera + smoothly warm/fade uniform constellation glow
  useFrame(({ camera }, delta) => {
    camForwardRef.current.copy(FORWARD_AXIS).applyQuaternion(camera.quaternion);
    const dot = camForwardRef.current.dot(centerDir);
    const nextInFront = dot > 0.22;
    if (nextInFront !== inFrontRef.current) {
      inFrontRef.current = nextInFront;
      setIsInFront(nextInFront);
    }

    const dt = Math.min(delta, 0.05);
    const targetBaseOpacity = isSelected
      ? isHovered
        ? 1.0
        : 0.88
      : isHovered
      ? 0.9
      : 0.3;
    const targetGlowOpacity = isSelected
      ? isHovered
        ? 0.36
        : 0.2
      : isHovered
      ? 0.3
      : 0;

    if (reducedMotionRef.current) {
      baseOpacityRef.current = targetBaseOpacity;
      glowOpacityRef.current = targetGlowOpacity;
    } else {
      baseOpacityRef.current = THREE.MathUtils.damp(
        baseOpacityRef.current,
        targetBaseOpacity,
        10,
        dt
      );
      glowOpacityRef.current = THREE.MathUtils.damp(
        glowOpacityRef.current,
        targetGlowOpacity,
        10,
        dt
      );
    }

    if (baseLineRef.current?.material) {
      baseLineRef.current.material.opacity = baseOpacityRef.current;
    }
    if (glowLineRef.current?.material) {
      glowLineRef.current.material.opacity = glowOpacityRef.current;
    }
  });

  const activeColor = isActive ? constellation.glowColor : "#7c91b0";

  return (
    <group>
      {/* Crisp screen-space constellation filaments */}
      {linePoints.length > 0 && (
        <Line
          ref={baseLineRef}
          points={linePoints}
          segments
          color={activeColor}
          lineWidth={isSelected ? (isHovered ? 2.3 : 2.0) : isHovered ? 2.0 : 1.0}
          transparent
          opacity={isSelected ? 0.88 : isHovered ? 0.9 : 0.3}
          depthWrite={false}
        />
      )}

      {/* Smooth uniform additive glow across the entire constellation */}
      {linePoints.length > 0 && (
        <Line
          ref={glowLineRef}
          points={linePoints}
          segments
          color={constellation.glowColor}
          lineWidth={isHovered ? 6.4 : 5.0}
          transparent
          opacity={isSelected ? 0.2 : 0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      )}

      {/* Invisible trimmed raycast cylinders so hovering or clicking any line lights the whole constellation */}
      {interactive &&
        segmentHitboxes.map((seg) => (
          <mesh
            key={`${constellation.id}-seg-hit-${seg.lineIdx}`}
            position={seg.midpoint}
            quaternion={seg.quaternion}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredLineIndex(seg.lineIdx);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredLineIndex((curr) => (curr === seg.lineIdx ? null : curr));
              document.body.style.cursor = "auto";
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectConstellation(constellation);
            }}
          >
            <cylinderGeometry args={[0.55, 0.55, seg.length, 6, 1, true]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}

      {/* Offset Astronomical Nameplate (positioned cleanly below lowest star) */}
      {showNameplate && isInFront && (
        <group position={labelPosition}>
          <Html center zIndexRange={[5, 0]}>
            <button
              type="button"
              className={`transition-all duration-200 cursor-pointer select-none px-3 py-1 rounded-lg border flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? "bg-space-abyss/85 border-cyan-glow/60 text-ink-primary"
                  : isHovered
                  ? "bg-space-abyss/80 border-white/35 text-ink-primary"
                  : "bg-transparent border-transparent text-ink-secondary/80 hover:text-ink-primary"
              }`}
              onMouseEnter={() => setIsLabelHovered(true)}
              onMouseLeave={() => setIsLabelHovered(false)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectConstellation(constellation);
              }}
            >
              <span
                className="flex items-center justify-center shrink-0"
                style={{ color: constellation.glowColor }}
              >
                <ZodiacGlyph id={constellation.id} size={14} />
              </span>
              <span className="font-display text-xs font-semibold tracking-wider uppercase leading-none">
                {constellation.name}
              </span>
              {(isActive || totalConstellationMemories > 0) && (
                <span className="font-mono text-xs text-ink-secondary leading-none">
                  {totalConstellationMemories > 0
                    ? `${totalConstellationMemories} saved`
                    : constellation.periodText}
                </span>
              )}
            </button>
          </Html>
        </group>
      )}

      {/* 3D 4-Point Sparkle Star Nodes */}
      {constellation.nodes.map((pos, idx) => {
        const dateRange = getNodeDateRange(constellation.id, idx);
        const nodeMemories = memoriesByNode[idx] || [];
        const isNodeSelected = isSelected && selectedNodeIndex === idx;

        return (
          <StarNode
            key={`${constellation.id}-node-${idx}`}
            position={pos}
            nodeIndex={idx}
            constellationId={constellation.id}
            glowColor={constellation.glowColor}
            dateRangeText={dateRange.formattedRange}
            memories={nodeMemories}
            isSelected={isNodeSelected}
            isConstellationActive={isActive}
            interactive={interactive}
            onHoverChange={(hovered) => {
              setHoveredNodeIndex((curr) =>
                hovered ? idx : curr === idx ? null : curr
              );
            }}
            onSelect={(nodeIdx) => {
              if (!isSelected) {
                onSelectConstellation(constellation);
              }
              onSelectNode(nodeIdx);
            }}
          />
        );
      })}
    </group>
  );
}
