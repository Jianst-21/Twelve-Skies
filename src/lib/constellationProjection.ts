import { ConstellationData } from "@/types";

export interface ProjectedNode {
  index: number;
  x: number;
  y: number;
}

export interface ProjectedConstellation {
  nodes: ProjectedNode[];
  lines: Array<{ from: ProjectedNode; to: ProjectedNode }>;
}

/**
 * Projects a constellation's 3D celestial coordinates onto a 2D tangent plane
 * facing the constellation's center vector, normalized inside [padding, size - padding].
 */
export function projectConstellation2D(
  constellation: ConstellationData,
  width = 520,
  height = 340,
  padding = 46
): ProjectedConstellation {
  const [cx, cy, cz] = constellation.center;
  const cLen = Math.hypot(cx, cy, cz) || 1;
  // Forward unit vector pointing toward the constellation from origin (0,0,0)
  const fx = cx / cLen;
  const fy = cy / cLen;
  const fz = cz / cLen;

  // World up vector (0, 1, 0) -> camera right = normalize(forward x up)
  let rx = -fz;
  let ry = 0;
  let rz = fx;
  const rLen = Math.hypot(rx, ry, rz) || 1;
  rx /= rLen;
  ry /= rLen;
  rz /= rLen;

  // Local up = right x forward
  const ux = ry * fz - rz * fy;
  const uy = rz * fx - rx * fz;
  const uz = rx * fy - ry * fx;

  const rawPoints = constellation.nodes.map(([nx, ny, nz], index) => {
    const dx = nx - cx;
    const dy = ny - cy;
    const dz = nz - cz;
    return {
      index,
      px: dx * rx + dy * ry + dz * rz,
      py: -(dx * ux + dy * uy + dz * uz), // SVG Y grows downward
    };
  });

  const minX = Math.min(...rawPoints.map((p) => p.px));
  const maxX = Math.max(...rawPoints.map((p) => p.px));
  const minY = Math.min(...rawPoints.map((p) => p.py));
  const maxY = Math.max(...rawPoints.map((p) => p.py));

  const spanX = Math.max(maxX - minX, 0.001);
  const spanY = Math.max(maxY - minY, 0.001);
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;
  const scale = Math.min(usableW / spanX, usableH / spanY);

  const offsetX = (width - spanX * scale) / 2;
  const offsetY = (height - spanY * scale) / 2;

  const nodes: ProjectedNode[] = rawPoints.map((p) => ({
    index: p.index,
    x: Number((offsetX + (p.px - minX) * scale).toFixed(2)),
    y: Number((offsetY + (p.py - minY) * scale).toFixed(2)),
  }));

  const lines = constellation.lines
    .map(([fromIdx, toIdx]) => {
      const from = nodes[fromIdx];
      const to = nodes[toIdx];
      if (!from || !to) return null;
      return { from, to };
    })
    .filter((item): item is { from: ProjectedNode; to: ProjectedNode } => item !== null);

  return { nodes, lines };
}
