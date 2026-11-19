import { CONSTELLATIONS, CONSTELLATION_MAP } from "@/data/constellations";
import { ConstellationData } from "@/types";

export interface NodeDistributionInfo {
  constellation: ConstellationData;
  nodeIndex: number;
  totalNodes: number;
  dayInConstellation: number; // 0-indexed day within the constellation
  totalDays: number;
  nodeStartDate: Date;
  nodeEndDate: Date;
  formattedRange: string;
}

export interface NodeBucketSummary {
  nodeIndex: number;
  days: number;
  startDate: Date;
  endDate: Date;
  formattedRange: string;
}

const MONTH_NAMES_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function toUtcMidnight(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Parses YYYY-MM-DD strings as local calendar dates to prevent UTC timezone shifts.
 */
function parseCalendarDate(dateInput: Date | string): Date {
  if (typeof dateInput !== "string") return dateInput;
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateInput.trim());
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  return new Date(dateInput);
}

function formatDayRange(startDate: Date, endDate: Date): string {
  return `${MONTH_NAMES_EN[startDate.getMonth()]} ${startDate.getDate()} - ${
    MONTH_NAMES_EN[endDate.getMonth()]
  } ${endDate.getDate()}`;
}

/**
 * Finds the constellation and cycle dates for any given Date.
 */
export function getConstellationCycle(date: Date): {
  constellation: ConstellationData;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  dayOffset: number;
} {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const c of CONSTELLATIONS) {
    let cStart: Date;
    let cEnd: Date;

    if (c.id === "capricorn") {
      // Capricorn spans Dec 22 - Jan 19 across the new year
      if (month === 12 && day >= c.startDay) {
        cStart = new Date(year, c.startMonth - 1, c.startDay);
        cEnd = new Date(year + 1, c.endMonth - 1, c.endDay);
      } else if (month === 1 && day <= c.endDay) {
        cStart = new Date(year - 1, c.startMonth - 1, c.startDay);
        cEnd = new Date(year, c.endMonth - 1, c.endDay);
      } else {
        continue;
      }
    } else {
      cStart = new Date(year, c.startMonth - 1, c.startDay);
      cEnd = new Date(year, c.endMonth - 1, c.endDay);
    }

    const tDate = toUtcMidnight(date);
    const tStart = toUtcMidnight(cStart);
    const tEnd = toUtcMidnight(cEnd);

    if (tDate >= tStart && tDate <= tEnd) {
      const msPerDay = 1000 * 60 * 60 * 24;
      const totalDays = Math.round((tEnd - tStart) / msPerDay) + 1;
      const dayOffset = Math.round((tDate - tStart) / msPerDay);

      return {
        constellation: c,
        startDate: cStart,
        endDate: cEnd,
        totalDays,
        dayOffset,
      };
    }
  }

  // Fallback (safe default to Capricorn)
  const defaultC = CONSTELLATION_MAP["capricorn"] || CONSTELLATIONS[0];
  const cStart = new Date(year, 11, 22);
  const cEnd = new Date(year + 1, 0, 19);
  const msPerDay = 1000 * 60 * 60 * 24;
  return {
    constellation: defaultC,
    startDate: cStart,
    endDate: cEnd,
    totalDays: Math.round((toUtcMidnight(cEnd) - toUtcMidnight(cStart)) / msPerDay) + 1,
    dayOffset: 0,
  };
}

/**
 * Calculates the exact node and sub-range for a given date according to PRD Section 3.3.
 *
 * D = total days, N = node count
 * B = floor(D / N)
 * R = D % N
 * The first R nodes get (B + 1) days, the remaining (N - R) nodes get B days.
 */
export function getConstellationAndNode(dateInput: Date | string): NodeDistributionInfo {
  const date = parseCalendarDate(dateInput);
  const { constellation, startDate, totalDays, dayOffset } = getConstellationCycle(date);

  const N = constellation.nodes.length;
  const D = totalDays;
  const B = Math.floor(D / N);
  const R = D % N;

  let currentOffset = 0;
  let targetNodeIndex = 0;
  let nodeStartOffset = 0;
  let nodeEndOffset = 0;

  for (let i = 0; i < N; i++) {
    const bucketSize = i < R ? B + 1 : B;
    const nextOffset = currentOffset + bucketSize;

    if (dayOffset >= currentOffset && dayOffset < nextOffset) {
      targetNodeIndex = i;
      nodeStartOffset = currentOffset;
      nodeEndOffset = nextOffset - 1;
      break;
    }
    currentOffset = nextOffset;
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const nodeStartDate = new Date(startDate.getTime() + nodeStartOffset * msPerDay);
  const nodeEndDate = new Date(startDate.getTime() + nodeEndOffset * msPerDay);

  return {
    constellation,
    nodeIndex: targetNodeIndex,
    totalNodes: N,
    dayInConstellation: dayOffset,
    totalDays: D,
    nodeStartDate,
    nodeEndDate,
    formattedRange: formatDayRange(nodeStartDate, nodeEndDate),
  };
}

/**
 * Gets the date range of a specific node within a constellation for a given reference year.
 */
export function getNodeDateRange(
  constellationId: string,
  nodeIndex: number,
  refYear = 2025
): { startDate: Date; endDate: Date; formattedRange: string } {
  const buckets = getConstellationBuckets(constellationId, refYear);
  const match = buckets[nodeIndex] || buckets[0];
  return {
    startDate: match.startDate,
    endDate: match.endDate,
    formattedRange: match.formattedRange,
  };
}

/**
 * Returns all proportional day-buckets for a constellation using the single-source-of-truth formula.
 */
export function getConstellationBuckets(
  constellationId: string,
  refYear = 2025
): NodeBucketSummary[] {
  const constellation = CONSTELLATION_MAP[constellationId] || CONSTELLATIONS[0];
  let cStart: Date;
  let cEnd: Date;

  if (constellation.id === "capricorn") {
    cStart = new Date(refYear, 11, 22);
    cEnd = new Date(refYear + 1, 0, 19);
  } else {
    cStart = new Date(refYear, constellation.startMonth - 1, constellation.startDay);
    cEnd = new Date(refYear, constellation.endMonth - 1, constellation.endDay);
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const D = Math.round((toUtcMidnight(cEnd) - toUtcMidnight(cStart)) / msPerDay) + 1;
  const N = constellation.nodes.length;
  const B = Math.floor(D / N);
  const R = D % N;

  const buckets: NodeBucketSummary[] = [];
  let currentOffset = 0;

  for (let i = 0; i < N; i++) {
    const days = i < R ? B + 1 : B;
    const startDate = new Date(cStart.getTime() + currentOffset * msPerDay);
    const endDate = new Date(cStart.getTime() + (currentOffset + days - 1) * msPerDay);
    buckets.push({
      nodeIndex: i,
      days,
      startDate,
      endDate,
      formattedRange: formatDayRange(startDate, endDate),
    });
    currentOffset += days;
  }

  return buckets;
}
