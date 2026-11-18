"use client";

import { useMemo, useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { ConstellationData, MemoryItem } from "@/types";
import { getNodeDateRange } from "@/lib/dateDistributor";
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
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [constellation]);

  const activeOpacity = isSelected ? 0.95 : isHovered ? 0.8 : 0.35;
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
          <div
            className={`transition-all duration-300 cursor-pointer select-none px-3.5 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-2 shadow-lg ${
              isSelected
                ? "bg-space-navy/85 border-cyan-glow scale-110"
                : isHovered
                ? "bg-space-navy/70 border-white/40 scale-105"
                : "bg-black/40 border-white/10 opacity-70 hover:opacity-100"
            }`}
            style={{
              boxShadow: isSelected || isHovered ? `0 0 15px ${constellation.glowColor}50` : undefined,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectConstellation(constellation);
            }}
          >
            <span className="text-base" style={{ color: constellation.glowColor }}>
              {constellation.symbol}
            </span>
            <div className="text-left">
              <span className="font-display text-xs font-bold tracking-wider text-white block uppercase leading-none">
                {constellation.name}
              </span>
              <span className="text-[9px] text-nebula-silver block mt-0.5 leading-none">
                {constellation.periodText}
              </span>
            </div>
          </div>
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
