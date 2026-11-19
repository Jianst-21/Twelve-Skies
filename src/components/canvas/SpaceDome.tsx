"use client";

import { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BRIGHT_STARS } from "@/data/brightStars";
import { generateRealCatalogStarfield } from "./celestialMath";

const DOME_TIER_RAD = (46 * Math.PI) / 180;
const SKY_CUBE_RES = 512;

const SKY_VERTEX_SHADER = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Runs ONCE on mount into a WebGLCubeRenderTarget so per-frame sky cost is a single textureCube lookup
const SKY_BAKE_FRAGMENT_SHADER = /* glsl */ `
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

    vec3 milkyWay = vec3(0.0);
    vec3 coreColor = vec3(0.0);
    if (bandMask > 0.004) {
      float cloudA = fbm(dir * 3.4 + vec3(1.2, -0.8, 0.4));
      float cloudB = fbm(dir * 7.2 + vec3(cloudA * 0.6));
      float dustRift = smoothstep(0.38, 0.66, fbm(dir * 9.5 + vec3(-1.4, 0.5, 2.1)));

      // Restrained Neowise midnight navy + subtle cyan reflection dust
      vec3 navyNebula = vec3(0.015, 0.032, 0.16);
      vec3 cyanNebula = vec3(0.025, 0.105, 0.185);
      milkyWay = mix(navyNebula, cyanNebula, smoothstep(0.35, 0.8, cloudB));
      milkyWay *= bandMask * (0.45 + cloudA * 0.85) * (1.0 - dustRift * 0.68);

      // Faint warm galactic core hint toward Sagittarius/Scorpio sector
      vec3 coreDir = normalize(vec3(-0.06, -0.48, 0.87));
      vec3 dCore = dir - coreDir;
      float coreGlow = exp(-dot(dCore, dCore) * 5.2) * bandMask;
      coreColor = vec3(0.11, 0.075, 0.045) * coreGlow;
    }

    vec3 color = baseSky + milkyWay + coreColor;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const SKY_SAMPLE_FRAGMENT_SHADER = /* glsl */ `
  uniform samplerCube uSkyCube;
  varying vec3 vDir;

  void main() {
    gl_FragColor = textureCube(uSkyCube, normalize(vDir));
  }
`;

const STARFIELD_VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vPhase;
  uniform float uPixelRatio;

  void main() {
    vColor = color;
    vPhase = aPhase;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = max(-mvPosition.z, 1.0);
    gl_PointSize = clamp(aSize * uPixelRatio * (115.0 / dist), 1.0, 11.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STARFIELD_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vPhase;
  uniform float uTime;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(uv, uv);
    if (r2 > 1.0) discard;

    float core = exp(-r2 * 14.0);
    float halo = exp(-r2 * 3.8) * 0.35;

    // Gentle twinkle scaled down when uTime == 0 (reduced motion)
    float twinkle = uTime > 0.0
      ? 0.90 + 0.10 * sin(uTime * (0.85 + fract(vPhase) * 0.9) + vPhase)
      : 1.0;

    float intensity = (core + halo) * twinkle;
    gl_FragColor = vec4(vColor * intensity, clamp(intensity, 0.0, 1.0));
  }
`;

function pushRingSegments(
  positions: number[],
  colors: number[],
  radius: number,
  segments: number,
  plane: "xz" | "xy" | "yz",
  yOffset: number,
  r: number,
  g: number,
  b: number
) {
  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    const c0 = Math.cos(a0) * radius;
    const s0 = Math.sin(a0) * radius;
    const c1 = Math.cos(a1) * radius;
    const s1 = Math.sin(a1) * radius;

    if (plane === "xz") {
      positions.push(c0, yOffset, s0, c1, yOffset, s1);
    } else if (plane === "xy") {
      positions.push(c0, s0, 0, c1, s1, 0);
    } else {
      positions.push(0, s0, c0, 0, s1, c1);
    }
    colors.push(r, g, b, r, g, b);
  }
}

function SpaceDome() {
  const gl = useThree((s) => s.gl);
  const starsRef = useRef<THREE.Points>(null);
  const starMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const skyMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const skyUniforms = useMemo(
    () => ({
      uSkyCube: { value: null as THREE.CubeTexture | null },
    }),
    []
  );

  // Bake procedural Milky Way sky dome once into a cubemap texture
  useLayoutEffect(() => {
    const cubeTarget = new THREE.WebGLCubeRenderTarget(SKY_CUBE_RES, {
      generateMipmaps: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });

    const bakeScene = new THREE.Scene();
    const bakeGeo = new THREE.BoxGeometry(20, 20, 20);
    const bakeMat = new THREE.ShaderMaterial({
      vertexShader: SKY_VERTEX_SHADER,
      fragmentShader: SKY_BAKE_FRAGMENT_SHADER,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const bakeMesh = new THREE.Mesh(bakeGeo, bakeMat);
    bakeScene.add(bakeMesh);

    const cubeCam = new THREE.CubeCamera(0.1, 50, cubeTarget);
    cubeCam.update(gl, bakeScene);

    bakeGeo.dispose();
    bakeMat.dispose();

    const skyMat = skyMaterialRef.current;
    if (skyMat) {
      skyMat.uniforms.uSkyCube.value = cubeTarget.texture;
      skyMat.needsUpdate = true;
    }

    return () => {
      if (skyMat) {
        skyMat.uniforms.uSkyCube.value = null;
      }
      cubeTarget.dispose();
    };
  }, [gl]);

  const starData = useMemo(() => {
    const isCompactViewport =
      typeof window !== "undefined" && window.innerWidth < 768;
    const fillerCount = isCompactViewport ? 1400 : 2400;
    return generateRealCatalogStarfield(BRIGHT_STARS, fillerCount, 96, 132, 12026);
  }, []);

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
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 1.5) : 1,
      },
    }),
    []
  );

  // Merged 3D celestial dome parallels (+46 deg, 0 deg, -46 deg), prime meridians, and sector ticks (1 draw call)
  const armillaryGeometry = useMemo(() => {
    const radius = 54;
    const tierRadius = radius * Math.cos(DOME_TIER_RAD);
    const tierY = radius * Math.sin(DOME_TIER_RAD);
    const base = new THREE.Color("#7cdee4");
    const maxOpacity = 0.1;

    const positions: number[] = [];
    const colors: number[] = [];

    const addRing = (
      rad: number,
      segs: number,
      plane: "xz" | "xy" | "yz",
      y: number,
      opacity: number
    ) => {
      const k = opacity / maxOpacity;
      pushRingSegments(positions, colors, rad, segs, plane, y, base.r * k, base.g * k, base.b * k);
    };

    addRing(radius, 96, "xz", 0, 0.07);
    addRing(tierRadius, 72, "xz", tierY, 0.045);
    addRing(tierRadius, 72, "xz", -tierY, 0.045);
    addRing(radius, 96, "xy", 0, 0.03);
    addRing(radius, 96, "yz", 0, 0.03);

    for (let deg = 0; deg < 360; deg += 15) {
      const rad = (deg * Math.PI) / 180;
      const isSectorDivider = deg % 30 === 0;
      const halfTick = isSectorDivider ? 0.9 : 0.38;
      const x = Math.cos(rad) * radius;
      const z = Math.sin(rad) * radius;
      positions.push(x, -halfTick, z, x, halfTick, z);
      colors.push(base.r, base.g, base.b, base.r, base.g, base.b);
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geom;
  }, []);

  useEffect(() => {
    return () => {
      starGeometry.dispose();
      armillaryGeometry.dispose();
    };
  }, [starGeometry, armillaryGeometry]);

  useFrame((state) => {
    const mat = starMaterialRef.current;
    if (reducedMotionRef.current) {
      if (mat && mat.uniforms.uTime.value !== 0) mat.uniforms.uTime.value = 0;
      return;
    }

    if (mat) {
      mat.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {/* Baked deep-space & Milky Way skybox (12 triangles, 1 cubemap lookup/pixel) */}
      <mesh renderOrder={-2} frustumCulled={false}>
        <boxGeometry args={[260, 260, 260]} />
        <shaderMaterial
          ref={skyMaterialRef}
          uniforms={skyUniforms}
          vertexShader={SKY_VERTEX_SHADER}
          fragmentShader={SKY_SAMPLE_FRAGMENT_SHADER}
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

      {/* Merged 3D celestial dome parallels, meridians & sector ticks */}
      <lineSegments geometry={armillaryGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export default memo(SpaceDome);
