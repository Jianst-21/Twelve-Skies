export interface StarNodeData {
  index: number;
  position: [number, number, number];
}

export interface ConstellationData {
  id: string;
  name: string;
  symbol: string;
  periodText: string;
  startMonth: number; // 1 - 12
  startDay: number;
  endMonth: number;   // 1 - 12
  endDay: number;
  glowColor: string;
  lineColor: string;
  nodes: [number, number, number][];
  lines: [number, number][]; // pairs of node indices [from, to]
  center: [number, number, number];
}

export interface DateNodeMapping {
  constellation: ConstellationData;
  nodeIndex: number;
  dayInConstellation: number;
  totalDays: number;
  nodeStartDate: Date;
  nodeEndDate: Date;
}

export interface MemoryItem {
  id: string;
  userId: string;
  constellationId: string;
  nodeIndex: number;
  memoryDate: string; // ISO date string
  location?: string | null;
  caption: string;
  imageUrl: string;
  createdAt: string;
}
