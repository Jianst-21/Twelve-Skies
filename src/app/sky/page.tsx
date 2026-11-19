"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, MapPin, Plus, RefreshCw, X } from "lucide-react";
import { CONSTELLATIONS, CONSTELLATION_MAP } from "@/data/constellations";
import { ConstellationData, MemoryItem } from "@/types";
import { getNodeDateRange } from "@/lib/dateDistributor";
import Navbar from "@/components/ui/Navbar";
import BottomPagination from "@/components/ui/BottomPagination";
import NodeSplitPanel from "@/components/ui/NodeSplitPanel";
import UploadPhotoModal from "@/components/ui/UploadPhotoModal";
import CelestialLogo from "@/components/ui/CelestialLogo";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";

const SkyCanvas = dynamic(() => import("@/components/canvas/SkyCanvas"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-space-black text-ink-primary overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 mix-blend-screen"
        style={{ backgroundImage: "url('/images/neowise/10-star-mini.jpg')" }}
      />
      <div className="relative z-10 w-10 h-10 rounded-full border-2 border-cyan-glow border-t-transparent animate-spin mb-4" />
      <span className="relative z-10 font-display tracking-[0.18em] text-cyan-glow uppercase text-xs font-semibold">
        Preparing Celestial Dome...
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
  const [isLoadingMemories, setIsLoadingMemories] = useState<boolean>(true);
  const [memoriesError, setMemoriesError] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const [uploadInitialDate, setUploadInitialDate] = useState<Date | undefined>(undefined);
  const [resetCameraTrigger, setResetCameraTrigger] = useState(0);
  const [showVerifiedToast, setShowVerifiedToast] = useState(false);

  // Check if redirected after successful email confirmation
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") !== "true") return;

    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);

    let active = true;
    let hideTimer: number | undefined;
    Promise.resolve().then(() => {
      if (!active) return;
      setShowVerifiedToast(true);
      hideTimer = window.setTimeout(() => setShowVerifiedToast(false), 8000);
    });

    return () => {
      active = false;
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    };
  }, []);

  // Fetch memories from server with explicit loading & error state
  const fetchMemories = useCallback(async () => {
    setIsLoadingMemories(true);
    setMemoriesError(null);
    try {
      const res = await fetch("/api/memories");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Unable to load vault (${res.status})`);
      }
      const data = await res.json();
      setMemories(data.memories || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMemoriesError(err.message);
      } else {
        setMemoriesError("Failed to fetch memories from the vault.");
      }
    } finally {
      setIsLoadingMemories(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/memories");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Unable to load vault (${res.status})`);
        }
        const data = await res.json();
        if (active) {
          setMemories(data.memories || []);
          setMemoriesError(null);
        }
      } catch (err: unknown) {
        if (active) {
          setMemoriesError(
            err instanceof Error
              ? err.message
              : "Failed to fetch memories from the vault."
          );
        }
      } finally {
        if (active) {
          setIsLoadingMemories(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // Keyboard shortcuts: Escape closes overlays; ArrowLeft/ArrowRight switches constellations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditingField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";

      if (e.key === "Escape") {
        if (isUploadOpen) return; // UploadPhotoModal handles its own Escape
        if (isIndexOpen) {
          setIsIndexOpen(false);
          return;
        }
        if (selectedNodeIndex !== null) {
          setSelectedNodeIndex(null);
          return;
        }
      }

      if (isEditingField || isUploadOpen || isIndexOpen) return;

      if (e.key === "ArrowLeft") {
        const idx = CONSTELLATIONS.findIndex((c) => c.id === selectedConstellation.id);
        const prev = CONSTELLATIONS[(idx - 1 + CONSTELLATIONS.length) % CONSTELLATIONS.length];
        setSelectedConstellation(prev);
        setSelectedNodeIndex(null);
      } else if (e.key === "ArrowRight") {
        const idx = CONSTELLATIONS.findIndex((c) => c.id === selectedConstellation.id);
        const next = CONSTELLATIONS[(idx + 1) % CONSTELLATIONS.length];
        setSelectedConstellation(next);
        setSelectedNodeIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUploadOpen, isIndexOpen, selectedNodeIndex, selectedConstellation.id]);

  const handleSelectConstellation = (c: ConstellationData) => {
    setSelectedConstellation(c);
    setSelectedNodeIndex(null);
  };

  const handleSelectNode = (nodeIdx: number) => {
    setSelectedNodeIndex(nodeIdx);
    setIsIndexOpen(false);
  };

  const handleCloseSplitView = () => {
    setSelectedNodeIndex(null);
  };

  const handleOpenUploadForNode = (nodeIdx: number) => {
    const range = getNodeDateRange(selectedConstellation.id, nodeIdx);
    setUploadInitialDate(range.startDate);
    setIsUploadOpen(true);
  };

  const handleJumpToMemory = (memory: MemoryItem) => {
    const targetConstellation = CONSTELLATION_MAP[memory.constellationId];
    if (targetConstellation) {
      setSelectedConstellation(targetConstellation);
      setSelectedNodeIndex(memory.nodeIndex);
      setIsIndexOpen(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    const res = await fetch(`/api/memories/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMemories((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleUpdateMemory = async (id: string, caption: string, location?: string) => {
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
  };

  const isSplitView = selectedNodeIndex !== null;

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
      {/* Floating Observatory Navbar */}
      <Navbar
        memoryCount={memories.length}
        isLoadingMemories={isLoadingMemories}
        isIndexOpen={isIndexOpen}
        onToggleIndex={() => setIsIndexOpen((prev) => !prev)}
        onOpenUpload={() => {
          setUploadInitialDate(new Date());
          setIsUploadOpen(true);
        }}
        onResetCamera={() => {
          setSelectedNodeIndex(null);
          setIsIndexOpen(false);
          setResetCameraTrigger((prev) => prev + 1);
        }}
      />

      {/* Email Verification Success Toast */}
      {showVerifiedToast && (
        <div
          role="status"
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto px-4 py-3 rounded-xl bg-space-abyss/95 border border-cyan-glow/45 text-ink-primary backdrop-blur-md flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-glow/15 border border-cyan-glow/40 flex items-center justify-center text-cyan-glow shrink-0">
              <CelestialLogo size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-cyan-glow uppercase tracking-wider">
                Account Verified
              </p>
              <p className="text-xs text-ink-secondary">
                Welcome to Twelve Skies. Your private 3D sky vault is active.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowVerifiedToast(false)}
            aria-label="Dismiss notification"
            className="min-w-[32px] min-h-[32px] inline-flex items-center justify-center rounded text-ink-secondary hover:text-ink-primary"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Error State Banner with Retry */}
      {memoriesError && (
        <div
          role="alert"
          className="fixed top-24 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] sm:w-auto px-4 py-3 rounded-xl bg-rose-950/90 border border-rose-500/45 text-rose-100 backdrop-blur-md flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
            <span>{memoriesError}</span>
          </div>
          <button
            type="button"
            onClick={fetchMemories}
            className="px-2.5 py-1.5 rounded-md bg-rose-500/25 border border-rose-400/40 text-white font-semibold hover:bg-rose-500/40 inline-flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="w-3 h-3" aria-hidden="true" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* First-Run Empty Vault Guidance */}
      {!isLoadingMemories && !memoriesError && memories.length === 0 && !isSplitView && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30 max-w-md w-[92%] sm:w-auto px-4 py-3 rounded-xl bg-black/75 border border-white/15 backdrop-blur-md flex items-center justify-between gap-4 text-xs">
          <div className="text-ink-secondary">
            Your sky is open. Drag to orbit or add your first photograph to ignite a star node.
          </div>
          <button
            type="button"
            onClick={() => {
              setUploadInitialDate(new Date());
              setIsUploadOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-cyan-glow text-space-navy font-bold shrink-0 hover:bg-white inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add First</span>
          </button>
        </div>
      )}

      {/* Quick Vault Index Drawer */}
      {isIndexOpen && (
        <aside
          aria-label="Vault Memory Index"
          className="fixed top-24 left-4 sm:left-8 z-40 w-[92vw] max-w-sm max-h-[65vh] rounded-xl bg-space-abyss/95 border border-cyan-glow/30 backdrop-blur-xl flex flex-col overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-bold text-ink-primary uppercase tracking-wider">
                Vault Index
              </h2>
              <p className="font-mono text-[11px] text-ink-secondary">
                {memories.length} {memories.length === 1 ? "entry" : "entries"} chronologically
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsIndexOpen(false)}
              aria-label="Close vault index"
              className="min-w-[34px] min-h-[34px] rounded-lg bg-black/45 border border-white/15 flex items-center justify-center text-ink-secondary hover:text-ink-primary"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoadingMemories ? (
              <p className="text-xs text-ink-secondary p-4 text-center">
                Loading memories...
              </p>
            ) : memories.length === 0 ? (
              <div className="p-5 text-center text-xs text-ink-secondary">
                No memories saved yet. Upload a photograph to map it into a constellation.
              </div>
            ) : (
              memories.map((m) => {
                const c = CONSTELLATION_MAP[m.constellationId];
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleJumpToMemory(m)}
                    className="w-full p-2.5 rounded-lg border border-white/10 bg-black/45 hover:border-cyan-glow/60 text-left flex items-center gap-3 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden border border-white/10 shrink-0 bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.imageUrl}
                        alt={m.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        {c && (
                          <span style={{ color: c.glowColor }}>
                            <ZodiacGlyph id={c.id} size={12} />
                          </span>
                        )}
                        <span className="text-cyan-glow truncate">
                          {c?.name || m.constellationId} · Node {m.nodeIndex + 1}
                        </span>
                      </div>
                      <p className="text-xs text-ink-primary truncate mt-0.5">{m.caption}</p>
                      <div className="text-[10px] font-mono text-ink-muted flex items-center gap-2 mt-0.5">
                        <span>
                          {new Date(m.memoryDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {m.location && (
                          <span className="inline-flex items-center gap-0.5 truncate">
                            <MapPin className="w-2.5 h-2.5 text-amber-star" aria-hidden="true" />
                            {m.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>
      )}

      {/* 3D Canvas Area */}
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

      {/* Bottom Constellation Switcher */}
      {!isSplitView && (
        <BottomPagination
          currentConstellation={selectedConstellation}
          onSelectConstellation={handleSelectConstellation}
        />
      )}

      {/* Right Split Panel */}
      {isSplitView && selectedNodeIndex !== null && (
        <NodeSplitPanel
          key={`${selectedConstellation.id}-${selectedNodeIndex}`}
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
      {isUploadOpen && (
        <UploadPhotoModal
          key={uploadInitialDate?.toISOString() ?? "today"}
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onSuccess={() => fetchMemories()}
          initialDate={uploadInitialDate}
        />
      )}
    </main>
  );
}
