"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import { MemoryItem } from "@/types";

interface StarNodeProps {
  position: [number, number, number];
  nodeIndex: number;
  constellationId: string;
  glowColor: string;
  dateRangeText: string;
  memories?: MemoryItem[];
  isSelected: boolean;
  onSelect: (nodeIndex: number) => void;
}

export default function StarNode({
  position,
  nodeIndex,
  glowColor,
  dateRangeText,
  memories = [],
  isSelected,
  onSelect,
}: StarNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const latestMemory = memories.length > 0 ? memories[0] : null;

  return (
    <group position={position}>
      {/* 3D point light for subtle ambient glow */}
      <pointLight color={glowColor} intensity={isSelected ? 1.5 : 0.6} distance={6} />

      <Html center distanceFactor={18} zIndexRange={[10, 0]}>
        <div
          className="relative flex items-center justify-center cursor-pointer select-none group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(nodeIndex);
          }}
        >
          {/* Pulsing ring when selected */}
          {isSelected && (
            <div
              className="absolute -inset-3 rounded-full border-2 border-dashed animate-spin-slow pointer-events-none"
              style={{ borderColor: glowColor }}
            />
          )}

          {/* 4-point sparkle star icon */}
          <div
            className={`transition-transform duration-300 ${
              isHovered || isSelected ? "scale-125" : "scale-100"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-[0_0_8px_var(--glow)]"
              style={{ ["--glow" as string]: glowColor }}
            >
              <path
                d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
                fill="#FFFFFF"
              />
              <circle cx="12" cy="12" r="2.5" fill={glowColor} />
            </svg>
          </div>

          {/* Radial Expand Photo Thumbnail on Hover */}
          {isHovered && latestMemory && (
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-50 animate-in fade-in zoom-in-50 duration-200">
              <div
                className="w-[76px] h-[76px] rounded-full overflow-hidden border-2 p-0.5 bg-space-navy shadow-[0_0_20px_rgba(124,222,228,0.5)]"
                style={{ borderColor: glowColor }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={latestMemory.imageUrl}
                  alt={latestMemory.caption}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Tooltip badge */}
              <div className="mt-1 px-2.5 py-1 rounded-full bg-space-navy/90 border border-cyan-glow/30 backdrop-blur-md text-[10px] text-white whitespace-nowrap font-medium shadow-lg">
                <span>{dateRangeText}</span>
                <span className="text-cyan-glow ml-1.5 font-bold">({memories.length} foto)</span>
              </div>
            </div>
          )}

          {/* Fallback tooltip when hovering without memories */}
          {isHovered && !latestMemory && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-space-navy/90 border border-cyan-glow/30 backdrop-blur-md text-[10px] text-white whitespace-nowrap font-medium shadow-lg pointer-events-none z-50">
              <span>{dateRangeText}</span>
              <span className="text-nebula-silver ml-1">(Kosong)</span>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
