"use client";

import { useState } from "react";
import {
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit2,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { ConstellationData, MemoryItem } from "@/types";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";

interface NodeSplitPanelProps {
  constellation: ConstellationData;
  nodeIndex: number;
  dateRangeText: string;
  memories: MemoryItem[];
  onClose: () => void;
  onOpenUploadForNode: (nodeIndex: number, defaultDate: Date) => void;
  onDeleteMemory: (id: string) => Promise<void>;
  onUpdateMemory: (id: string, caption: string, location?: string) => Promise<void>;
}

export default function NodeSplitPanel({
  constellation,
  nodeIndex,
  dateRangeText,
  memories,
  onClose,
  onOpenUploadForNode,
  onDeleteMemory,
  onUpdateMemory,
}: NodeSplitPanelProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeIndex =
    memories.length > 0 ? Math.min(activeSlideIndex, memories.length - 1) : 0;
  const currentSlide = memories.length > 0 ? memories[safeIndex] : null;

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % memories.length);
  };

  const startEdit = (memory: MemoryItem) => {
    setConfirmDeleteId(null);
    setEditingId(memory.id);
    setEditCaption(memory.caption);
    setEditLocation(memory.location || "");
  };

  const saveEdit = async (id: string) => {
    if (!editCaption.trim()) return;
    setIsSubmitting(true);
    try {
      await onUpdateMemory(id, editCaption, editLocation);
      setEditingId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      await onDeleteMemory(id);
      setConfirmDeleteId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside
      aria-label={`${constellation.name} Star Node ${nodeIndex + 1} memories`}
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[85vw] md:w-[48vw] lg:w-[45vw] bg-space-abyss/90 backdrop-blur-xl border-l border-cyan-glow/30 flex flex-col animate-panel-slide-in"
    >
      {/* Top Header */}
      <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex items-center" style={{ color: constellation.glowColor }}>
              <ZodiacGlyph id={constellation.id} size={20} />
            </span>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-wider text-ink-primary uppercase">
              {constellation.name} · Star Node {String(nodeIndex + 1).padStart(2, "0")}
            </h2>
          </div>
          <p className="text-xs text-ink-secondary mt-1 font-mono">
            Date Window: <span className="text-cyan-glow">{dateRangeText}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close star node panel"
          className="min-w-[40px] min-h-[40px] rounded-lg bg-black/50 border border-white/15 flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:border-cyan-glow transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {memories.length === 0 ? (
          /* Empty State */
          <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-cyan-glow/25 rounded-xl bg-black/35">
            <div className="w-14 h-14 rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow flex items-center justify-center mb-4">
              <Camera className="w-7 h-7" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-bold text-ink-primary mb-1.5">
              No Memories Archived at This Star
            </h3>
            <p className="text-sm text-ink-secondary max-w-sm mb-6 leading-relaxed">
              Star Node #{nodeIndex + 1} holds photographs captured between{" "}
              <span className="text-cyan-glow font-mono">{dateRangeText}</span>.
            </p>
            <button
              type="button"
              onClick={() => onOpenUploadForNode(nodeIndex, new Date())}
              className="min-h-[44px] px-5 py-2.5 rounded-lg bg-cyan-glow text-space-navy font-bold text-sm hover:bg-white transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Photo to This Star</span>
            </button>
          </div>
        ) : (
          <>
            {/* Interactive Photo Slideshow */}
            <div className="relative rounded-xl overflow-hidden border border-cyan-glow/30 bg-black aspect-[16/10] group">
              {currentSlide && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/75 border border-white/15 text-[11px] font-mono text-cyan-glow">
                    {safeIndex + 1} / {memories.length}
                  </div>

                  {memories.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        aria-label="Previous photo"
                        className="absolute left-3 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] rounded-lg bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-cyan-glow hover:text-space-navy transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        aria-label="Next photo"
                        className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] rounded-lg bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-cyan-glow hover:text-space-navy transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-xs sm:text-sm text-white/95 font-medium line-clamp-2">
                      {currentSlide.caption}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* List Header & Add Button */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                Memory Journal ({memories.length})
              </span>
              <button
                type="button"
                onClick={() => onOpenUploadForNode(nodeIndex, new Date())}
                className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-glow/15 border border-cyan-glow/40 text-cyan-glow text-xs font-semibold hover:bg-cyan-glow hover:text-space-navy transition-colors"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Photo</span>
              </button>
            </div>

            {/* Scrollable Timeline Cards */}
            <div className="space-y-3.5">
              {memories.map((m, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      isActive
                        ? "bg-black/65 border-cyan-glow"
                        : "bg-black/35 border-white/10 hover:border-cyan-glow/35"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail Button */}
                      <button
                        type="button"
                        onClick={() => setActiveSlideIndex(idx)}
                        aria-label={`View photo from ${new Date(m.memoryDate).toLocaleDateString("en-US")}`}
                        className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-white/15 bg-black focus-visible:ring-2 focus-visible:ring-cyan-glow"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.imageUrl}
                          alt={m.caption}
                          className="w-full h-full object-cover"
                        />
                      </button>

                      {/* Metadata & Actions */}
                      <div className="flex-1 min-w-0">
                        {editingId === m.id ? (
                          <div className="space-y-2.5">
                            <div>
                              <label
                                htmlFor={`edit-loc-${m.id}`}
                                className="block text-[11px] text-ink-secondary mb-1"
                              >
                                Location (optional)
                              </label>
                              <input
                                id={`edit-loc-${m.id}`}
                                type="text"
                                value={editLocation}
                                onChange={(e) => setEditLocation(e.target.value)}
                                placeholder="e.g. Kyoto, Mount Bromo"
                                className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/60 border border-cyan-glow/30 text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cyan-glow"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`edit-cap-${m.id}`}
                                className="block text-[11px] text-ink-secondary mb-1"
                              >
                                Memory Story
                              </label>
                              <textarea
                                id={`edit-cap-${m.id}`}
                                value={editCaption}
                                onChange={(e) => setEditCaption(e.target.value)}
                                rows={2}
                                placeholder="Write the story behind this moment..."
                                className="w-full px-3 py-1.5 text-xs rounded-lg bg-black/60 border border-cyan-glow/30 text-ink-primary placeholder-ink-muted focus:outline-none focus:border-cyan-glow resize-none"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={isSubmitting || !editCaption.trim()}
                                onClick={() => saveEdit(m.id)}
                                className="min-h-[34px] px-3 py-1 rounded-md bg-cyan-glow text-space-navy text-xs font-bold inline-flex items-center gap-1 hover:bg-white disabled:opacity-50"
                              >
                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>{isSubmitting ? "Saving..." : "Save"}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="min-h-[34px] px-3 py-1 rounded-md bg-white/10 text-ink-primary text-xs hover:bg-white/20"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <button
                                type="button"
                                onClick={() => setActiveSlideIndex(idx)}
                                className="flex flex-wrap items-center gap-2 text-left text-[11px] text-ink-secondary font-mono"
                              >
                                <span className="inline-flex items-center gap-1">
                                  <Calendar
                                    className="w-3 h-3 text-cyan-glow"
                                    aria-hidden="true"
                                  />
                                  {new Date(m.memoryDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                {m.location && (
                                  <span className="inline-flex items-center gap-1 text-amber-star">
                                    <MapPin className="w-3 h-3" aria-hidden="true" />
                                    <span className="truncate max-w-[140px]">
                                      {m.location}
                                    </span>
                                  </span>
                                )}
                              </button>

                              {/* Edit & Inline Delete Controls */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEdit(m)}
                                  aria-label="Edit story or location"
                                  title="Edit story or location"
                                  className="min-w-[32px] min-h-[32px] inline-flex items-center justify-center rounded-md text-ink-secondary hover:text-cyan-glow hover:bg-white/5 transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmDeleteId((prev) =>
                                      prev === m.id ? null : m.id
                                    )
                                  }
                                  aria-label="Delete memory"
                                  title="Delete memory"
                                  className="min-w-[32px] min-h-[32px] inline-flex items-center justify-center rounded-md text-ink-secondary hover:text-rose-400 hover:bg-white/5 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                              </div>
                            </div>

                            {confirmDeleteId === m.id ? (
                              <div className="mt-2 p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                                <span className="text-rose-200">
                                  Remove this memory from the sky?
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => confirmDelete(m.id)}
                                    className="px-2.5 py-1 rounded bg-rose-500 text-white font-semibold hover:bg-rose-400 disabled:opacity-50"
                                  >
                                    {isSubmitting ? "Removing..." : "Delete"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-2.5 py-1 rounded bg-white/10 text-ink-primary hover:bg-white/20"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs sm:text-sm text-ink-primary/90 leading-relaxed">
                                {m.caption}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
