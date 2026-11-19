"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { MemoryItem } from "@/types";

interface StarNodeProps {
  position: [number, number, number];
  nodeIndex: number;
  constellationId: string;
  glowColor: string;
  dateRangeText: string;
  memories?: MemoryItem[];
  isSelected: boolean;
  isConstellationActive: boolean;
  interactive?: boolean;
  onSelect: (nodeIndex: number) => void;
  onHoverChange?: (hovered: boolean) => void;
}

const STAR_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  uniform float uScale;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    mvPosition.xy += position.xy * uScale;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;
  uniform vec3 uGlowColor;
  uniform float uHighlight;
  uniform float uHovered;
  uniform float uHasMemories;
  uniform float uConstellationActive;

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float dist = length(uv);
    if (dist > 1.0) discard;

    // Smooth boundary fade so diffraction spikes never clip at quad edges
    float edgeFade = smoothstep(1.0, 0.25, dist);

    // Intense white core + colored astronomical corona (brighter when holding memories)
    float core = exp(-dist * 11.5) * (1.0 + uHasMemories * 0.18);
    float corona = exp(-dist * 4.4) * (0.42 + uConstellationActive * 0.22 + uHasMemories * 0.18 + uHighlight * 0.42);

    // 4-point astronomical diffraction spikes
    float spikeWidth = mix(26.0, 20.0, uHighlight);
    float spikeLength = mix(3.8, 2.7, uHighlight);
    float spikeH = exp(-abs(uv.y) * spikeWidth) * exp(-abs(uv.x) * spikeLength);
    float spikeV = exp(-abs(uv.x) * spikeWidth) * exp(-abs(uv.y) * spikeLength);
    float spikes = (spikeH + spikeV) * (0.65 + uConstellationActive * 0.25 + uHasMemories * 0.15 + uHighlight * 0.5) * edgeFade;

    // Clean solid ring appears strictly on hover (no dashed reticle, no resting rings)
    float hoverRing = exp(-pow((dist - 0.44) * 26.0, 2.0)) * uHovered * 0.85;

    float dimFactor = mix(0.55, 1.0, max(uConstellationActive, uHighlight));
    vec3 color =
      vec3(1.0) * (core * 1.35 + spikes * 0.5) * dimFactor +
      uGlowColor * (corona + spikes * 0.72 + hoverRing);

    float alpha = clamp((core + corona + spikes + hoverRing) * edgeFade, 0.0, 1.0);
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(color, alpha);
  }
`;

function HoverMemoryThumb({
  src,
  alt,
  glowColor,
}: {
  src: string;
  alt: string;
  glowColor: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="w-[88px] h-[88px] rounded-full overflow-hidden border-2 p-0.5 bg-space-abyss/95 shadow-[0_0_24px_rgba(124,222,228,0.45)] flex items-center justify-center"
      style={{ borderColor: glowColor }}
    >
      {failed ? (
        <span className="text-[10px] font-mono text-ink-secondary text-center px-2 leading-tight">
          Photo saved
        </span>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover rounded-full"
        />
      )}
    </div>
  );
}

export default function StarNode({
  position,
  nodeIndex,
  constellationId,
  glowColor,
  dateRangeText,
  memories = [],
  isSelected,
  isConstellationActive,
  interactive = true,
  onSelect,
  onHoverChange,
}: StarNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupMounted, setIsPopupMounted] = useState(false);
  const exitTimerRef = useRef<number | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const highlightRef = useRef(0);
  const hoveredRef = useRef(0);
  const scaleRef = useRef(2.8);
  const activeRef = useRef(isConstellationActive ? 1 : 0);

  const latestMemory = memories.length > 0 ? memories[0] : null;
  const hasMemories = memories.length > 0;

  const uniforms = useMemo(
    () => ({
      uGlowColor: { value: new THREE.Color(glowColor) },
      uScale: { value: 2.8 },
      uHighlight: { value: 0 },
      uHovered: { value: 0 },
      uHasMemories: { value: 0 },
      uConstellationActive: { value: 0 },
    }),
    [glowColor]
  );

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
      document.body.style.cursor = "auto";
    };
  }, []);

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    const dt = Math.min(delta, 0.05);
    const targetHighlight = isHovered || isSelected ? 1 : 0;
    const targetHovered = isHovered ? 1 : 0;
    const targetActive = isConstellationActive ? 1 : 0;
    const targetScale =
      isHovered || isSelected
        ? 4.1
        : hasMemories
        ? 3.35
        : isConstellationActive
        ? 2.95
        : 2.35;

    highlightRef.current = THREE.MathUtils.damp(highlightRef.current, targetHighlight, 10, dt);
    hoveredRef.current = THREE.MathUtils.damp(hoveredRef.current, targetHovered, 10, dt);
    activeRef.current = THREE.MathUtils.damp(activeRef.current, targetActive, 7, dt);
    scaleRef.current = THREE.MathUtils.damp(scaleRef.current, targetScale, 10, dt);

    mat.uniforms.uHighlight.value = highlightRef.current;
    mat.uniforms.uHovered.value = hoveredRef.current;
    mat.uniforms.uHasMemories.value = hasMemories ? 1 : 0;
    mat.uniforms.uConstellationActive.value = activeRef.current;
    mat.uniforms.uScale.value = scaleRef.current;
  });

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    setIsPopupMounted(true);
    setIsHovered(true);
    onHoverChange?.(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setIsHovered(false);
    onHoverChange?.(false);
    document.body.style.cursor = "auto";

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setIsPopupMounted(false);
      return;
    }

    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
    }
    exitTimerRef.current = window.setTimeout(() => {
      setIsPopupMounted(false);
      exitTimerRef.current = null;
    }, 195);
  };

  return (
    <group position={position}>
      {/* True 3D billboarded 4-point astronomical sparkle star */}
      <mesh renderOrder={4}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={STAR_VERTEX_SHADER}
          fragmentShader={STAR_FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Generous invisible 3D raycast sphere sized for clean, non-overlapping hover */}
      {interactive && (
        <mesh
          aria-label={`${constellationId} star node ${nodeIndex + 1}`}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(nodeIndex);
          }}
        >
          <sphereGeometry args={[1.05, 14, 14]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      {/* Two-way star-origin hover popup (blooms from star core, retracts back into star core) */}
      {isPopupMounted && (
        <Html center zIndexRange={[40, 20]} style={{ pointerEvents: "none" }}>
          {latestMemory ? (
            <div
              className={`flex flex-col items-center pointer-events-none select-none ${
                isHovered ? "star-popup-enter" : "star-popup-exit"
              }`}
            >
              <HoverMemoryThumb
                key={latestMemory.imageUrl}
                src={latestMemory.imageUrl}
                alt={latestMemory.caption}
                glowColor={glowColor}
              />

              <div className="mt-2 px-3 py-1.5 rounded-lg bg-space-abyss/95 border border-cyan-glow/40 text-xs text-ink-primary whitespace-nowrap max-w-[220px] text-center">
                <div className="font-medium truncate">{latestMemory.caption}</div>
                <div className="font-mono text-[11px] text-ink-secondary mt-0.5">
                  <span>{dateRangeText}</span>
                  <span className="text-cyan-glow ml-1.5 font-semibold">
                    ({memories.length} {memories.length === 1 ? "photo" : "photos"})
                  </span>
                </div>
              </div>

              <span
                aria-hidden="true"
                className="w-px h-3.5 mt-0.5 opacity-70"
                style={{
                  background: `linear-gradient(to bottom, ${glowColor}, transparent)`,
                }}
              />
            </div>
          ) : (
            <div
              className={`flex flex-col items-center pointer-events-none select-none ${
                isHovered ? "star-badge-enter" : "star-badge-exit"
              }`}
            >
              <div className="px-2.5 py-1 rounded-md bg-space-abyss/95 border border-white/20 text-xs font-mono text-ink-primary whitespace-nowrap">
                <span>Star {String(nodeIndex + 1).padStart(2, "0")}</span>
                <span className="text-ink-secondary ml-1.5">{dateRangeText}</span>
                <span className="text-ink-muted ml-1.5">Click to add</span>
              </div>
              <span
                aria-hidden="true"
                className="w-px h-2.5 mt-0.5 opacity-60"
                style={{
                  background: `linear-gradient(to bottom, ${glowColor}, transparent)`,
                }}
              />
            </div>
          )}
        </Html>
      )}
    </group>
  );
}
