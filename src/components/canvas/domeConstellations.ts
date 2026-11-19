import { CONSTELLATIONS } from "@/data/constellations";
import { ConstellationData } from "@/types";
import { computeDomeConstellations } from "./celestialMath";

export const DOME_CONSTELLATIONS: ConstellationData[] = computeDomeConstellations(
  CONSTELLATIONS,
  {
    sphereRadius: 52,
    waveElevationDeg: 46,
    minIntraDistance: 4.8,
  }
);

export const DOME_CONSTELLATION_MAP: Record<string, ConstellationData> =
  DOME_CONSTELLATIONS.reduce((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {} as Record<string, ConstellationData>);
