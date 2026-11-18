"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { CONSTELLATIONS } from "@/data/constellations";
import { ConstellationData, MemoryItem } from "@/types";
import { getNodeDateRange } from "@/lib/dateDistributor";
import Navbar from "@/components/ui/Navbar";
import BottomPagination from "@/components/ui/BottomPagination";
import NodeSplitPanel from "@/components/ui/NodeSplitPanel";
import UploadPhotoModal from "@/components/ui/UploadPhotoModal";

// Dynamic import for Three.js canvas to prevent SSR hydration mismatch
const SkyCanvas = dynamic(() => import("@/components/canvas/SkyCanvas"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-space-black text-white overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen"
        style={{ backgroundImage: "url('/images/neowise/10-star-mini.jpg')" }}
      />
      <div className="relative z-10 w-12 h-12 rounded-full border-2 border-cyan-glow border-t-transparent animate-spin mb-4 shadow-[0_0_20px_rgba(124,222,228,0.5)]" />
      <span className="relative z-10 font-display tracking-[0.25em] text-cyan-glow uppercase text-xs font-semibold">
        Mempersiapkan Kubah Antariksa...
      </span>
    </div>
  ),
});

export default function SkyPage() {
  const [selectedConstellation, setSelectedConstellation] = useState<ConstellationData>(
    CONSTELLATIONS[0]
  );
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadInitialDate, setUploadInitialDate] = useState<Date | undefined>(undefined);
  const [resetCameraTrigger, setResetCameraTrigger] = useState(0);

  // Fetch memories from server
  const fetchMemories = useCallback(async () => {
    try {
      const res = await fetch("/api/memories");
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
      }
    } catch (err) {
      console.error("Failed to fetch memories:", err);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  // Select constellation from pagination or canvas
  const handleSelectConstellation = (c: ConstellationData) => {
    setSelectedConstellation(c);
    setSelectedNodeIndex(null); // Reset node selection when switching constellation
  };

  // Select node (opens Split View)
  const handleSelectNode = (nodeIdx: number) => {
    setSelectedNodeIndex(nodeIdx);
  };

  // Close split view
  const handleCloseSplitView = () => {
    setSelectedNodeIndex(null);
  };

  // Open upload modal pre-filled for active node
  const handleOpenUploadForNode = (nodeIdx: number) => {
    const range = getNodeDateRange(selectedConstellation.id, nodeIdx);
    setUploadInitialDate(range.startDate);
    setIsUploadOpen(true);
  };

  // Delete a memory
  const handleDeleteMemory = async (id: string) => {
    try {
      const res = await fetch(`/api/memories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMemories((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Error deleting memory:", err);
    }
  };

  // Update a memory caption / location
  const handleUpdateMemory = async (id: string, caption: string, location?: string) => {
    try {
      const res = await fetch(`/api/memories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, location }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMemories((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...updated.memory } : m))
        );
      }
    } catch (err) {
      console.error("Error updating memory:", err);
    }
  };

  const isSplitView = selectedNodeIndex !== null;

  // Filter memories belonging to current node
  const currentNodeMemories =
    selectedNodeIndex !== null
      ? memories.filter(
          (m) =>
            m.constellationId === selectedConstellation.id &&
            m.nodeIndex === selectedNodeIndex
        )
      : [];

  const currentNodeDateRange =
    selectedNodeIndex !== null
      ? getNodeDateRange(selectedConstellation.id, selectedNodeIndex).formattedRange
      : "";

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-black select-none">
      {/* Floating Navbar */}
      <Navbar
        onOpenUpload={() => {
          setUploadInitialDate(undefined);
          setIsUploadOpen(true);
        }}
        onResetCamera={() => {
          setSelectedNodeIndex(null);
          setResetCameraTrigger((prev) => prev + 1);
        }}
      />

      {/* 3D Canvas Area (Full Screen or Left 55% when Split View is Active) */}
      <div
        className={`w-full h-full transition-all duration-500 ${
          isSplitView ? "md:w-[55vw]" : "w-full"
        }`}
      >
        <SkyCanvas
          selectedConstellation={selectedConstellation}
          selectedNodeIndex={selectedNodeIndex}
          memories={memories}
          isSplitView={isSplitView}
          onSelectConstellation={handleSelectConstellation}
          onSelectNode={handleSelectNode}
          resetTrigger={resetCameraTrigger}
        />
      </div>

      {/* Bottom Pagination Bar (Constellation Switcher) */}
      {!isSplitView && (
        <BottomPagination
          currentConstellation={selectedConstellation}
          onSelectConstellation={handleSelectConstellation}
        />
      )}

      {/* Right Split Panel (when a star node is selected) */}
      {isSplitView && selectedNodeIndex !== null && (
        <NodeSplitPanel
          constellation={selectedConstellation}
          nodeIndex={selectedNodeIndex}
          dateRangeText={currentNodeDateRange}
          memories={currentNodeMemories}
          onClose={handleCloseSplitView}
          onOpenUploadForNode={handleOpenUploadForNode}
          onDeleteMemory={handleDeleteMemory}
          onUpdateMemory={handleUpdateMemory}
        />
      )}

      {/* Upload Photo Modal */}
      <UploadPhotoModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => fetchMemories()}
        initialDate={uploadInitialDate}
      />
    </main>
  );
}
