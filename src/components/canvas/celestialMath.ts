export type Vec3 = [number, number, number];

export interface ConstellationGeometryInput {
  center: Vec3;
  nodes: Vec3[];
}

export interface SpectralStarfieldBuffers {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  phases: Float32Array;
}

function normalizeVec3(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function crossVec3(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dotVec3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Computes a normalized look direction from the origin toward a constellation
 * or star node, optionally shifted right along the horizon tangent so the target
 * sits centered in the unobstructed 55vw left viewport during split-view.
 */
export function computeTargetDirection(
  center: Vec3,
  nodePos: Vec3 | null,
  splitOffsetTan = 0
): Vec3 {
  const target = nodePos ?? center;
  const forward = normalizeVec3(target);

  if (Math.abs(splitOffsetTan) < 1e-6) {
    return forward;
  }

  const worldUp: Vec3 = [0, 1, 0];
  let right = crossVec3(forward, worldUp);
  if (Math.hypot(right[0], right[1], right[2]) < 1e-4) {
    right = [1, 0, 0];
  } else {
    right = normalizeVec3(right);
  }

  return normalizeVec3([
    forward[0] + right[0] * splitOffsetTan,
    forward[1] + right[1] * splitOffsetTan,
    forward[2] + right[2] * splitOffsetTan,
  ]);
}

/**
 * Places a constellation's nameplate anchor cleanly below its lowest star node
 * on the celestial sphere surface so it never obscures star geometry or lines.
 */
export function computeConstellationLabelPosition(
  constellation: ConstellationGeometryInput,
  marginBelow = 2.6
): Vec3 {
  const [cx, cy, cz] = constellation.center;
  const sphereRadius = Math.hypot(cx, cy, cz) || 45;
  const forward = normalizeVec3(constellation.center);

  let right = crossVec3(forward, [0, 1, 0]);
  if (Math.hypot(right[0], right[1], right[2]) < 1e-4) {
    right = [1, 0, 0];
  } else {
    right = normalizeVec3(right);
  }
  const localUp = normalizeVec3(crossVec3(right, forward));

  let minProjUp = 0;
  for (const node of constellation.nodes) {
    const delta: Vec3 = [node[0] - cx, node[1] - cy, node[2] - cz];
    const projUp = dotVec3(delta, localUp);
    if (projUp < minProjUp) {
      minProjUp = projUp;
    }
  }

  const offset = minProjUp - marginBelow;
  const rawPos: Vec3 = [
    cx + localUp[0] * offset,
    cy + localUp[1] * offset,
    cz + localUp[2] * offset,
  ];
  const unit = normalizeVec3(rawPos);
  return [
    unit[0] * sphereRadius,
    unit[1] * sphereRadius,
    unit[2] * sphereRadius,
  ];
}

function createMulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Stellar spectral palette (O/B ice-blue, A/F pure white, G/K warm cream, M amber, cyan accent)
const SPECTRAL_COLORS: Vec3[] = [
  [0.72, 0.85, 1.0],  // O/B blue-white
  [0.95, 0.97, 1.0],  // A/F white
  [1.0, 0.96, 0.88],  // G cream-white
  [1.0, 0.86, 0.64],  // K/M warm gold-amber
  [0.54, 0.89, 0.95], // Subtle Twelve Skies cyan starlight
];

/**
 * Generates deterministic 3D spectral background starfield buffers with
 * higher density concentrated along a tilted Milky Way galactic plane.
 */
export function generateSpectralStarfield(
  count: number,
  minRadius: number,
  maxRadius: number,
  seed = 12026
): SpectralStarfieldBuffers {
  const rand = createMulberry32(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  // Tilted galactic basis
  const gNormal = normalizeVec3([0.28, 0.72, -0.63]);
  const gTangentA = normalizeVec3(crossVec3(gNormal, [0, 1, 0]));
  const gTangentB = normalizeVec3(crossVec3(gNormal, gTangentA));

  for (let i = 0; i < count; i++) {
    let dir: Vec3;
    const isGalactic = rand() < 0.55;

    if (isGalactic) {
      const azimuth = rand() * Math.PI * 2;
      // Box-Muller-like approximation via sum of uniforms for concentrated band
      const bandSpread = ((rand() + rand() + rand()) / 3 - 0.5) * 0.62;
      const cosA = Math.cos(azimuth);
      const sinA = Math.sin(azimuth);
      dir = normalizeVec3([
        gTangentA[0] * cosA + gTangentB[0] * sinA + gNormal[0] * bandSpread,
        gTangentA[1] * cosA + gTangentB[1] * sinA + gNormal[1] * bandSpread,
        gTangentA[2] * cosA + gTangentB[2] * sinA + gNormal[2] * bandSpread,
      ]);
    } else {
      const u = rand();
      const v = rand();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      dir = [
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta),
      ];
    }

    const r = minRadius + rand() * (maxRadius - minRadius);
    positions[i * 3] = dir[0] * r;
    positions[i * 3 + 1] = dir[1] * r;
    positions[i * 3 + 2] = dir[2] * r;

    const paletteRoll = rand();
    const color =
      paletteRoll < 0.25
        ? SPECTRAL_COLORS[0]
        : paletteRoll < 0.62
        ? SPECTRAL_COLORS[1]
        : paletteRoll < 0.84
        ? SPECTRAL_COLORS[2]
        : paletteRoll < 0.94
        ? SPECTRAL_COLORS[3]
        : SPECTRAL_COLORS[4];

    const brightness = 0.65 + rand() * 0.35;
    colors[i * 3] = color[0] * brightness;
    colors[i * 3 + 1] = color[1] * brightness;
    colors[i * 3 + 2] = color[2] * brightness;

    // Power-law size distribution: mostly fine pinpoints, occasional bright landmarks
    const mag = Math.pow(rand(), 3.2);
    sizes[i] = 1.0 + mag * 3.4;
    phases[i] = rand() * Math.PI * 2;
  }

  return { positions, colors, sizes, phases };
}
