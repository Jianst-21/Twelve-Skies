"use client";

import { useMemo, useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { ConstellationData, MemoryItem } from "@/types";
import { getNodeDateRange } from "@/lib/dateDistributor";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";
import StarNode from "./StarNode";

interface ConstellationProps {
  constellation: ConstellationData;
  memoriesByNode: Record<number, MemoryItem[]>;
  isSelected: boolean;
  selectedNodeIndex: number | null;
  onSelectConstellation: (constellation: ConstellationData) => void;
  onSelectNode: (nodeIndex: number) => void;
}

export default function Constellation({
  constellation,
  memoriesByNode,
  isSelected,
  selectedNodeIndex,
  onSelectConstellation,
  onSelectNode,
}: ConstellationProps) {
  const [isHovered, setIsHovered] = useState(false);

  const totalConstellationMemories = useMemo(
    () =>
      Object.values(memoriesByNode).reduce((sum, list) => sum + list.length, 0),
    [memoriesByNode]
  );

  // Build line geometry connecting constellation nodes
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (const [fromIdx, toIdx] of constellation.lines) {
      const fromPos = constellation.nodes[fromIdx];
      const toPos = constellation.nodes[toIdx];
      if (fromPos && toPos) {
        points.push(new THREE.Vector3(...fromPos));
        points.push(new THREE.Vector3(...toPos));
      }
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [constellation]);

  const activeOpacity = isSelected ? 0.95 : isHovered ? 0.85 : 0.38;
  const activeColor = isSelected || isHovered ? constellation.glowColor : "#64748B";

  return (
    <group>
      {/* Constellation line segments */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color={activeColor}
          transparent
          opacity={activeOpacity}
          linewidth={isSelected || isHovered ? 2 : 1}
        />
      </lineSegments>

      {/* Center Label / Constellation Marker */}
      <group position={constellation.center}>
        <Html center distanceFactor={22} zIndexRange={[5, 0]}>
          <button
            type="button"
            className={`transition-all duration-300 cursor-pointer select-none px-3.5 py-1.5 rounded-lg border backdrop-blur-md flex items-center gap-2.5 ${
              isSelected
                ? "bg-space-abyss/90 border-cyan-glow scale-105"
                : isHovered
                ? "bg-space-abyss/80 border-white/40 scale-105"
                : "bg-black/65 border-white/15 opacity-80 hover:opacity-100"
            }`}
            style={{
              boxShadow:
                isSelected || isHovered ? `0 0 16px ${constellation.glowColor}40` : undefined,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectConstellation(constellation);
            }}
          >
            <span
              className="flex items-center justify-center shrink-0"
              style={{ color: constellation.glowColor }}
            >
              <ZodiacGlyph id={constellation.id} size={15} />
            </span>
            <div className="text-left">
              <span className="font-display text-xs font-bold tracking-wider text-ink-primary block uppercase leading-none">
                {constellation.name}
              </span>
              <span className="font-mono text-[9px] text-ink-secondary block mt-0.5 leading-none">
                {constellation.periodText}
                {totalConstellationMemories > 0
                  ? ` · ${totalConstellationMemories} saved`
                  : ""}
              </span>
            </div>
          </button>
        </Html>
      </group>

      {/* Render Star Nodes */}
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
