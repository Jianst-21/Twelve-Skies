"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { ConstellationData, MemoryItem } from "@/types";
import { getNodeDateRange } from "@/lib/dateDistributor";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";
import StarNode from "./StarNode";
import { computeConstellationLabelPosition } from "./celestialMath";

interface ConstellationProps {
  constellation: ConstellationData;
  memoriesByNode: Record<number, MemoryItem[]>;
  isSelected: boolean;
  selectedNodeIndex: number | null;
  onSelectConstellation: (constellation: ConstellationData) => void;
  onSelectNode: (nodeIndex: number) => void;
}

const FORWARD_AXIS = new THREE.Vector3(0, 0, -1);

export default function Constellation({
  constellation,
  memoriesByNode,
  isSelected,
  selectedNodeIndex,
  onSelectConstellation,
  onSelectNode,
}: ConstellationProps) {
  const [isLabelHovered, setIsLabelHovered] = useState(false);
  const [hoveredNodeCount, setHoveredNodeCount] = useState(0);
  const [isInFront, setIsInFront] = useState(true);

  const camForwardRef = useRef(new THREE.Vector3());
  const inFrontRef = useRef(true);

  const isHovered = isLabelHovered || hoveredNodeCount > 0;
  const isActive = isSelected || isHovered;

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

  const labelPosition = useMemo(
    () => computeConstellationLabelPosition(constellation, 2.7),
    [constellation]
  );

  const centerDir = useMemo(
    () => new THREE.Vector3(...constellation.center).normalize(),
    [constellation.center]
  );

  // Hide HTML nameplates for constellations behind the camera to avoid edge artifacts
  useFrame(({ camera }) => {
    camForwardRef.current.copy(FORWARD_AXIS).applyQuaternion(camera.quaternion);
    const dot = camForwardRef.current.dot(centerDir);
    const nextInFront = dot > 0.22;
    if (nextInFront !== inFrontRef.current) {
      inFrontRef.current = nextInFront;
      setIsInFront(nextInFront);
    }
  });

  const activeOpacity = isSelected ? 0.92 : isHovered ? 0.78 : 0.3;
  const activeColor = isActive ? constellation.glowColor : "#7c91b0";

  return (
    <group>
      {/* Crisp screen-space constellation filaments */}
      {linePoints.length > 0 && (
        <Line
          points={linePoints}
          segments
          color={activeColor}
          lineWidth={isSelected ? 2.1 : isHovered ? 1.7 : 1.0}
          transparent
          opacity={activeOpacity}
          depthWrite={false}
        />
      )}

      {/* Subtle additive glow filament when constellation is focused or hovered */}
      {isActive && linePoints.length > 0 && (
        <Line
          points={linePoints}
          segments
          color={constellation.glowColor}
          lineWidth={5.2}
          transparent
          opacity={isSelected ? 0.2 : 0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      )}

      {/* Offset Astronomical Nameplate (positioned cleanly below lowest star) */}
      {isInFront && (
        <group position={labelPosition}>
          <Html center distanceFactor={32} zIndexRange={[5, 0]}>
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
            onHoverChange={(hovered) => {
              setHoveredNodeCount((c) => Math.max(0, c + (hovered ? 1 : -1)));
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
