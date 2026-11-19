"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { generateSpectralStarfield } from "./celestialMath";

const SKY_VERTEX_SHADER = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vDir;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.23));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(
        mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
        f.y
      ),
      mix(
        mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
        f.y
      ),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amp * noise(p);
      p *= 2.04;
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 dir = normalize(vDir);

    // Subtle deep-space ecliptic horizon wash (#000000 poles -> #04091e horizon)
    float horizon = exp(-abs(dir.y) * 2.6);
    vec3 baseSky = mix(vec3(0.0, 0.0, 0.0), vec3(0.012, 0.025, 0.085), horizon * 0.72);

    // Tilted Milky Way galactic plane (aligned with J2000 spectral starfield)
    vec3 galacticNormal = normalize(vec3(-0.868, 0.456, 0.197));
    float planeDist = abs(dot(dir, galacticNormal));
    float bandMask = exp(-planeDist * planeDist * 11.5);

    float cloudA = fbm(dir * 3.4 + vec3(1.2, -0.8, 0.4));
    float cloudB = fbm(dir * 7.2 + vec3(cloudA * 0.6));
    float dustRift = smoothstep(0.38, 0.66, fbm(dir * 9.5 + vec3(-1.4, 0.5, 2.1)));

    // Restrained Neowise midnight navy + subtle cyan reflection dust
    vec3 navyNebula = vec3(0.015, 0.032, 0.16);
    vec3 cyanNebula = vec3(0.025, 0.105, 0.185);
    vec3 milkyWay = mix(navyNebula, cyanNebula, smoothstep(0.35, 0.8, cloudB));
    milkyWay *= bandMask * (0.45 + cloudA * 0.85) * (1.0 - dustRift * 0.68);

    // Faint warm galactic core hint toward Sagittarius/Scorpio sector
    vec3 coreDir = normalize(vec3(-0.06, -0.48, 0.87));
    float coreDist = length(dir - coreDir);
    float coreGlow = exp(-coreDist * coreDist * 5.2) * bandMask;
    vec3 coreColor = vec3(0.11, 0.075, 0.045) * coreGlow;

    vec3 color = baseSky + milkyWay + coreColor;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const STARFIELD_VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vPhase;
  varying float vSize;
  uniform float uPixelRatio;

  void main() {
    vColor = color;
    vPhase = aPhase;
    vSize = aSize;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = max(-mvPosition.z, 1.0);
    gl_PointSize = clamp(aSize * uPixelRatio * (115.0 / dist), 1.0, 11.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STARFIELD_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vPhase;
  varying float vSize;
  uniform float uTime;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float r = length(uv);
    if (r > 1.0) discard;

    float core = exp(-r * r * 14.0);
    float halo = exp(-r * r * 3.8) * 0.35;

    // Gentle twinkle scaled down when uTime == 0 (reduced motion)
    float twinkle = uTime > 0.0
      ? 0.90 + 0.10 * sin(uTime * (0.85 + fract(vPhase) * 0.9) + vPhase)
      : 1.0;

    float intensity = (core + halo) * twinkle;
    gl_FragColor = vec4(vColor * intensity, clamp(intensity, 0.0, 1.0));
  }
`;

function createRingPoints(radius: number, segments: number, plane: "xz" | "xy" | "yz", yOffset = 0) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const c = Math.cos(a) * radius;
    const s = Math.sin(a) * radius;
    if (plane === "xz") pts.push(new THREE.Vector3(c, yOffset, s));
    else if (plane === "xy") pts.push(new THREE.Vector3(c, s, 0));
    else pts.push(new THREE.Vector3(0, s, c));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

export default function SpaceDome() {
  const starsRef = useRef<THREE.Points>(null);
  const starMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const starData = useMemo(() => generateSpectralStarfield(5200, 88, 118, 12026), []);

  const starGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(starData.positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(starData.colors, 3));
    geom.setAttribute("aSize", new THREE.BufferAttribute(starData.sizes, 1));
    geom.setAttribute("aPhase", new THREE.BufferAttribute(starData.phases, 1));
    return geom;
  }, [starData]);

  const starUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1,
      },
    }),
    []
  );

  // Calm equatorial horizon ring + 30-degree house ticks at sphere radius 46.5
  const armillaryGeometries = useMemo(() => {
    const radius = 46.5;
    const eclipticRing = createRingPoints(radius, 128, "xz", 0);

    // 36 ecliptic degree ticks (every 10 deg; longer every 30 deg)
    const tickPositions: THREE.Vector3[] = [];
    for (let deg = 0; deg < 360; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      const isHouseDivider = deg % 30 === 0;
      const halfTick = isHouseDivider ? 0.85 : 0.35;
      const x = Math.cos(rad) * radius;
      const z = Math.sin(rad) * radius;
      tickPositions.push(new THREE.Vector3(x, -halfTick, z));
      tickPositions.push(new THREE.Vector3(x, halfTick, z));
    }
    const ticks = new THREE.BufferGeometry().setFromPoints(tickPositions);

    return {
      eclipticRing,
      ticks,
    };
  }, []);

  useEffect(() => {
    return () => {
      starGeometry.dispose();
      Object.values(armillaryGeometries).forEach((g) => g.dispose());
    };
  }, [starGeometry, armillaryGeometries]);

  useFrame((state) => {
    const mat = starMaterialRef.current;
    if (reducedMotionRef.current) {
      if (mat) mat.uniforms.uTime.value = 0;
      return;
    }

    if (mat) {
      mat.uniforms.uTime.value = state.clock.elapsedTime;
    }
    // Keep background starfield locked to constellations to avoid motion shear/dizziness
  });

  return (
    <group>
      {/* Seamless procedural deep-space & Milky Way dome */}
      <mesh renderOrder={-2}>
        <sphereGeometry args={[130, 64, 48]} />
        <shaderMaterial
          vertexShader={SKY_VERTEX_SHADER}
          fragmentShader={SKY_FRAGMENT_SHADER}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Spectral twinkling background starfield */}
      <points ref={starsRef} geometry={starGeometry} renderOrder={-1}>
        <shaderMaterial
          ref={starMaterialRef}
          uniforms={starUniforms}
          vertexShader={STARFIELD_VERTEX_SHADER}
          fragmentShader={STARFIELD_FRAGMENT_SHADER}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Calm equatorial horizon reference ring (replaces dense meridian cage) */}
      <group>
        <lineLoop geometry={armillaryGeometries.eclipticRing}>
          <lineBasicMaterial color="#7cdee4" transparent opacity={0.09} depthWrite={false} />
        </lineLoop>
        <lineSegments geometry={armillaryGeometries.ticks}>
          <lineBasicMaterial color="#7cdee4" transparent opacity={0.12} depthWrite={false} />
        </lineSegments>
      </group>
    </group>
  );
}
