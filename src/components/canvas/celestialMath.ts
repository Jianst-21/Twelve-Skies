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

export interface CatalogStarInput {
  ra: number;
  dec: number;
  mag: number;
  bv: number;
}

export interface ErgonomicSpacingOptions {
  minIntraDistance?: number;
  minInterDistance?: number;
  sphereRadius?: number;
  maxIterations?: number;
}

export interface DomeWaveOptions {
  sphereRadius?: number;
  waveElevationDeg?: number;
  minIntraDistance?: number;
  minConstellationSpan?: number;
  maxConstellationSpan?: number;
  maxIterations?: number;
}

export interface ErgonomicConstellationInput {
  id: string;
  center: Vec3;
  nodes: Vec3[];
}

function normalizeVec3(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function scaleVec3(v: Vec3, s: number): Vec3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function projectToSphere(v: Vec3, radius: number): Vec3 {
  return scaleVec3(normalizeVec3(v), radius);
}

/**
 * Converts J2000 equatorial coordinates (RA in decimal hours, Dec in degrees)
 * into Three.js inside-out celestial sphere coordinates matching CONSTELLATIONS.
 */
export function celestialToCartesian(
  raHours: number,
  decDeg: number,
  radius: number
): Vec3 {
  const raRad = (raHours * 15 * Math.PI) / 180;
  const decRad = (decDeg * Math.PI) / 180;
  const cosDec = Math.cos(decRad);
  return [
    radius * cosDec * Math.cos(raRad),
    radius * Math.sin(decRad),
    -radius * cosDec * Math.sin(raRad),
  ];
}

/**
 * Maps astronomical B-V color index (-0.3 blue-white to +2.0 orange-red)
 * to a realistic deep-space spectral RGB triplet.
 */
export function bvToSpectralColor(bv: number): Vec3 {
  const clamped = Math.max(-0.3, Math.min(2.0, bv));
  if (clamped < 0.0) {
    // O/B blue-white
    const t = (clamped + 0.3) / 0.3;
    return [0.68 + 0.24 * t, 0.82 + 0.14 * t, 1.0];
  }
  if (clamped < 0.4) {
    // A/F white to crisp cream
    const t = clamped / 0.4;
    return [0.92 + 0.08 * t, 0.96 + 0.02 * t, 1.0 - 0.06 * t];
  }
  if (clamped < 1.0) {
    // G/early-K warm ivory to soft gold
    const t = (clamped - 0.4) / 0.6;
    return [1.0, 0.98 - 0.11 * t, 0.94 - 0.28 * t];
  }
  // K/M amber to orange-red (Aldebaran, Betelgeuse, Antares)
  const t = (clamped - 1.0) / 1.0;
  return [1.0, 0.87 - 0.21 * t, 0.66 - 0.24 * t];
}

/**
 * Relaxes tightly clustered real astronomical star pairs on the celestial sphere
 * so hover hitboxes and memory preview popups never collide, while preserving
 * each constellation's sky sector, node order, and recognizable silhouette.
 */
export function computeErgonomicConstellations<T extends ErgonomicConstellationInput>(
  constellations: T[],
  options: ErgonomicSpacingOptions = {}
): T[] {
  const minIntra = options.minIntraDistance ?? 4.8;
  const minInter = options.minInterDistance ?? 7.5;
  const sphereRadius = options.sphereRadius ?? 45;
  const maxIterations = options.maxIterations ?? 80;

  const workingNodes: Vec3[][] = constellations.map((c) =>
    c.nodes.map((n) => projectToSphere(n, sphereRadius))
  );
  const anchorNodes: Vec3[][] = workingNodes.map((list) =>
    list.map((n) => [n[0], n[1], n[2]])
  );

  for (let iter = 0; iter < maxIterations; iter++) {
    let maxViolation = 0;
    const deltas: Vec3[][] = workingNodes.map((list) =>
      list.map(() => [0, 0, 0])
    );

    // 1. Intra-constellation minimum spacing
    for (let cIdx = 0; cIdx < workingNodes.length; cIdx++) {
      const nodes = workingNodes[cIdx];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j][0] - nodes[i][0];
          const dy = nodes[j][1] - nodes[i][1];
          const dz = nodes[j][2] - nodes[i][2];
          const dist = Math.hypot(dx, dy, dz) || 1e-4;
          if (dist < minIntra) {
            const overlap = minIntra - dist;
            if (overlap > maxViolation) maxViolation = overlap;
            const push = (overlap * 0.55) / dist;
            deltas[cIdx][i][0] -= dx * push;
            deltas[cIdx][i][1] -= dy * push;
            deltas[cIdx][i][2] -= dz * push;
            deltas[cIdx][j][0] += dx * push;
            deltas[cIdx][j][1] += dy * push;
            deltas[cIdx][j][2] += dz * push;
          }
        }
      }
    }

    // 2. Inter-constellation minimum spacing
    for (let a = 0; a < workingNodes.length; a++) {
      for (let b = a + 1; b < workingNodes.length; b++) {
        const nodesA = workingNodes[a];
        const nodesB = workingNodes[b];
        for (let i = 0; i < nodesA.length; i++) {
          for (let j = 0; j < nodesB.length; j++) {
            const dx = nodesB[j][0] - nodesA[i][0];
            const dy = nodesB[j][1] - nodesA[i][1];
            const dz = nodesB[j][2] - nodesA[i][2];
            const dist = Math.hypot(dx, dy, dz) || 1e-4;
            if (dist < minInter) {
              const overlap = minInter - dist;
              if (overlap > maxViolation) maxViolation = overlap;
              const push = (overlap * 0.55) / dist;
              deltas[a][i][0] -= dx * push;
              deltas[a][i][1] -= dy * push;
              deltas[a][i][2] -= dz * push;
              deltas[b][j][0] += dx * push;
              deltas[b][j][1] += dy * push;
              deltas[b][j][2] += dz * push;
            }
          }
        }
      }
    }

    // 3. Gentle early anchor pull so shapes stay faithful to J2000 sectors
    const anchorPull = iter < maxIterations * 0.5 ? 0.035 : 0;

    for (let cIdx = 0; cIdx < workingNodes.length; cIdx++) {
      const nodes = workingNodes[cIdx];
      const anchors = anchorNodes[cIdx];
      for (let i = 0; i < nodes.length; i++) {
        const nx =
          nodes[i][0] +
          deltas[cIdx][i][0] +
          (anchors[i][0] - nodes[i][0]) * anchorPull;
        const ny =
          nodes[i][1] +
          deltas[cIdx][i][1] +
          (anchors[i][1] - nodes[i][1]) * anchorPull;
        const nz =
          nodes[i][2] +
          deltas[cIdx][i][2] +
          (anchors[i][2] - nodes[i][2]) * anchorPull;
        nodes[i] = projectToSphere([nx, ny, nz], sphereRadius);
      }
    }

    if (maxViolation < 0.01 && anchorPull === 0) {
      break;
    }
  }

  return constellations.map((c, cIdx) => {
    const nodes = workingNodes[cIdx].map(
      (n): Vec3 => [
        Number(n[0].toFixed(2)),
        Number(n[1].toFixed(2)),
        Number(n[2].toFixed(2)),
      ]
    );

    const sum: Vec3 = [0, 0, 0];
    for (const n of nodes) {
      sum[0] += n[0];
      sum[1] += n[1];
      sum[2] += n[2];
    }
    const avg: Vec3 = [
      sum[0] / Math.max(nodes.length, 1),
      sum[1] / Math.max(nodes.length, 1),
      sum[2] / Math.max(nodes.length, 1),
    ];
    const center = projectToSphere(avg, sphereRadius);

    return {
      ...c,
      center: [
        Number(center[0].toFixed(2)),
        Number(center[1].toFixed(2)),
        Number(center[2].toFixed(2)),
      ] as Vec3,
      nodes,
    };
  });
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

function buildTangentBasis(forwardInput: Vec3): {
  forward: Vec3;
  right: Vec3;
  up: Vec3;
} {
  const forward = normalizeVec3(forwardInput);
  let right = crossVec3(forward, [0, 1, 0]);
  if (Math.hypot(right[0], right[1], right[2]) < 1e-4) {
    right = [1, 0, 0];
  } else {
    right = normalizeVec3(right);
  }
  const up = normalizeVec3(crossVec3(right, forward));
  return { forward, right, up };
}

/**
 * Arranges all 12 constellations into a full 360-degree 3D dome wave across
 * upper (+waveElevationDeg), equatorial (0 deg), and lower (-waveElevationDeg)
 * latitudes in chronological order. Each constellation keeps its authentic
 * star silhouette while gaining >50 deg center separation and generous
 * intra-constellation hover spacing.
 */
export function computeDomeConstellations<T extends ErgonomicConstellationInput>(
  constellations: T[],
  options: DomeWaveOptions = {}
): T[] {
  const sphereRadius = options.sphereRadius ?? 52;
  const waveElevationDeg = options.waveElevationDeg ?? 46;
  const minIntra = options.minIntraDistance ?? 4.8;
  const minSpan = options.minConstellationSpan ?? 13.5;
  const maxSpan = options.maxConstellationSpan ?? 21.0;
  const maxIterations = options.maxIterations ?? 80;
  const count = constellations.length;

  return constellations.map((c, idx) => {
    // 1. Extract authentic silhouette in the constellation's original tangent plane
    const origBasis = buildTangentBasis(c.center);
    const [cx, cy, cz] = c.center;

    const uvPoints = c.nodes.map((node) => {
      const delta: Vec3 = [node[0] - cx, node[1] - cy, node[2] - cz];
      return {
        u: dotVec3(delta, origBasis.right),
        v: dotVec3(delta, origBasis.up),
      };
    });

    const minU = Math.min(...uvPoints.map((p) => p.u));
    const maxU = Math.max(...uvPoints.map((p) => p.u));
    const minV = Math.min(...uvPoints.map((p) => p.v));
    const maxV = Math.max(...uvPoints.map((p) => p.v));

    const midU = (minU + maxU) / 2;
    const midV = (minV + maxV) / 2;
    const rawSpan = Math.max(maxU - minU, maxV - minV, 1e-3);

    // Uniform scale keeps natural constellation proportions while fitting dome sectors
    let uniformScale = 1;
    if (rawSpan > maxSpan) {
      uniformScale = maxSpan / rawSpan;
    } else if (rawSpan < minSpan) {
      uniformScale = minSpan / rawSpan;
    }

    const working = uvPoints.map((p) => ({
      u: (p.u - midU) * uniformScale,
      v: (p.v - midV) * uniformScale,
    }));
    const anchors = working.map((p) => ({ u: p.u, v: p.v }));

    // 2. Relax tightly clustered intra-constellation pairs in tangent space
    const target2DMin = minIntra * 1.06;
    for (let iter = 0; iter < maxIterations; iter++) {
      let maxViolation = 0;
      const du = new Array<number>(working.length).fill(0);
      const dv = new Array<number>(working.length).fill(0);

      for (let i = 0; i < working.length; i++) {
        for (let j = i + 1; j < working.length; j++) {
          const dx = working[j].u - working[i].u;
          const dy = working[j].v - working[i].v;
          const dist = Math.hypot(dx, dy) || 1e-4;
          if (dist < target2DMin) {
            const overlap = target2DMin - dist;
            if (overlap > maxViolation) maxViolation = overlap;
            const push = (overlap * 0.55) / dist;
            du[i] -= dx * push;
            dv[i] -= dy * push;
            du[j] += dx * push;
            dv[j] += dy * push;
          }
        }
      }

      const anchorPull = iter < maxIterations * 0.45 ? 0.04 : 0;
      for (let i = 0; i < working.length; i++) {
        working[i].u += du[i] + (anchors[i].u - working[i].u) * anchorPull;
        working[i].v += dv[i] + (anchors[i].v - working[i].v) * anchorPull;
      }

      if (maxViolation < 0.01 && anchorPull === 0) break;
    }

    // Re-center after relaxation so constellation stays anchored on its wave target
    const meanU = working.reduce((s, p) => s + p.u, 0) / Math.max(working.length, 1);
    const meanV = working.reduce((s, p) => s + p.v, 0) / Math.max(working.length, 1);
    for (const p of working) {
      p.u -= meanU;
      p.v -= meanV;
    }

    // 3. Place on Pattern 2 continuous 3D dome wave (+elev, 0, -elev, 0 repeating 3x)
    const azimuth = (idx / count) * Math.PI * 2;
    const waveFactor = Math.round(Math.cos((idx * Math.PI) / 2));
    const elevRad = (waveFactor * waveElevationDeg * Math.PI) / 180;
    const targetForward: Vec3 = [
      Math.cos(elevRad) * Math.cos(azimuth),
      Math.sin(elevRad),
      Math.cos(elevRad) * Math.sin(azimuth),
    ];
    const targetBasis = buildTangentBasis(targetForward);

    const nodes: Vec3[] = working.map((p) => {
      const raw: Vec3 = [
        targetBasis.forward[0] * sphereRadius +
          targetBasis.right[0] * p.u +
          targetBasis.up[0] * p.v,
        targetBasis.forward[1] * sphereRadius +
          targetBasis.right[1] * p.u +
          targetBasis.up[1] * p.v,
        targetBasis.forward[2] * sphereRadius +
          targetBasis.right[2] * p.u +
          targetBasis.up[2] * p.v,
      ];
      const onSphere = projectToSphere(raw, sphereRadius);
      return [
        Number(onSphere[0].toFixed(2)),
        Number(onSphere[1].toFixed(2)),
        Number(onSphere[2].toFixed(2)),
      ];
    });

    const centerOnSphere = projectToSphere(targetBasis.forward, sphereRadius);
    const center: Vec3 = [
      Number(centerOnSphere[0].toFixed(2)),
      Number(centerOnSphere[1].toFixed(2)),
      Number(centerOnSphere[2].toFixed(2)),
    ];

    return {
      ...c,
      center,
      nodes,
    };
  });
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

  // Tilted Milky Way galactic basis aligned with J2000 North Galactic Pole
  const gNormal = normalizeVec3([-0.868, 0.456, 0.197]);
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

/**
 * Combines real J2000 bright-star catalog landmarks (exact RA/Dec, magnitude-scaled
 * size, and B-V spectral color) with a subtle Milky Way deep-field star layer.
 */
export function generateRealCatalogStarfield(
  catalogStars: CatalogStarInput[],
  fillerCount: number,
  minRadius: number,
  maxRadius: number,
  seed = 12026
): SpectralStarfieldBuffers {
  const rand = createMulberry32(seed);
  const catalogCount = catalogStars.length;
  const totalCount = catalogCount + fillerCount;

  const positions = new Float32Array(totalCount * 3);
  const colors = new Float32Array(totalCount * 3);
  const sizes = new Float32Array(totalCount);
  const phases = new Float32Array(totalCount);

  // 1. Place real J2000 bright catalog stars at their astronomical coordinates
  for (let i = 0; i < catalogCount; i++) {
    const star = catalogStars[i];
    const r = minRadius + 2 + rand() * 8;
    const pos = celestialToCartesian(star.ra, star.dec, r);
    positions[i * 3] = pos[0];
    positions[i * 3 + 1] = pos[1];
    positions[i * 3 + 2] = pos[2];

    const spectral = bvToSpectralColor(star.bv);
    const normMag = Math.max(0.08, Math.min(1.0, (5.0 - star.mag) / 6.5));
    const brightness = 0.68 + normMag * 0.32;
    colors[i * 3] = spectral[0] * brightness;
    colors[i * 3 + 1] = spectral[1] * brightness;
    colors[i * 3 + 2] = spectral[2] * brightness;

    sizes[i] = 1.65 + Math.pow(normMag, 1.55) * 3.65;
    phases[i] = rand() * Math.PI * 2;
  }

  // 2. Append subtle deep-field Milky Way dust stars subordinate to real landmarks
  const filler = generateSpectralStarfield(
    fillerCount,
    minRadius + 6,
    maxRadius,
    seed ^ 0x5f3759df
  );

  for (let i = 0; i < fillerCount; i++) {
    const outIdx = catalogCount + i;
    positions[outIdx * 3] = filler.positions[i * 3];
    positions[outIdx * 3 + 1] = filler.positions[i * 3 + 1];
    positions[outIdx * 3 + 2] = filler.positions[i * 3 + 2];

    colors[outIdx * 3] = filler.colors[i * 3] * 0.72;
    colors[outIdx * 3 + 1] = filler.colors[i * 3 + 1] * 0.72;
    colors[outIdx * 3 + 2] = filler.colors[i * 3 + 2] * 0.72;

    sizes[outIdx] = Math.min(2.2, filler.sizes[i] * 0.68);
    phases[outIdx] = filler.phases[i];
  }

  return { positions, colors, sizes, phases };
}
