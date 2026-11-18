"use client";

import { useState } from "react";
import { ConstellationData, MemoryItem } from "@/types";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";
import {
  X,
  Plus,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  Camera,
  Check,
} from "lucide-react";

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
  const [editCaption, setEditCaption] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSlide = memories.length > 0 ? memories[activeSlideIndex] : null;

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % memories.length);
  };

  const startEdit = (memory: MemoryItem) => {
    setEditingId(memory.id);
    setEditCaption(memory.caption);
    setEditLocation(memory.location || "");
  };

  const saveEdit = async (id: string) => {
    setIsSubmitting(true);
    try {
      await onUpdateMemory(id, editCaption, editLocation);
      setEditingId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[85vw] md:w-[48vw] lg:w-[45vw] bg-space-navy/80 backdrop-blur-2xl border-l border-cyan-glow/30 flex flex-col shadow-[-15px_0_40px_rgba(3,4,94,0.7)] animate-in slide-in-from-right duration-300">
      {/* Top Header */}
      <div className="p-5 sm:p-6 border-b border-cyan-glow/20 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex items-center" style={{ color: constellation.glowColor }}>
              <ZodiacGlyph id={constellation.id} size={20} />
            </span>
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-wider text-white uppercase">
              {constellation.name} : Titik {nodeIndex + 1}
            </h2>
          </div>
          <p className="text-xs text-nebula-silver mt-0.5">
            Rentang Waktu:{" "}
            <span className="text-cyan-glow font-medium">{dateRangeText}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/5 border border-cyan-glow/20 flex items-center justify-center text-nebula-silver hover:text-white hover:border-cyan-glow transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        {memories.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-cyan-glow/20 rounded-[28px] bg-black/20 my-auto">
            <div className="w-16 h-16 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow flex items-center justify-center mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1">
              Belum Ada Kenangan di Titik Ini
            </h3>
            <p className="text-xs sm:text-sm text-nebula-silver max-w-sm mb-6 leading-relaxed">
              Titik bintang #{nodeIndex + 1} mengarsipkan memori yang diambil pada rentang{" "}
              <span className="text-cyan-glow">{dateRangeText}</span>.
            </p>
            <button
              type="button"
              onClick={() => onOpenUploadForNode(nodeIndex, new Date())}
              className="px-6 py-3 rounded-full bg-cyan-glow text-space-navy font-bold text-xs uppercase tracking-wider hover:bg-transparent hover:text-white hover:border hover:border-white transition-all shadow-[0_0_20px_rgba(124,222,228,0.3)] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Foto di Titik Ini</span>
            </button>
          </div>
        ) : (
          <>
            {/* Upper: Interactive Photo Slideshow / Carousel */}
            <div className="relative rounded-[24px] overflow-hidden border border-cyan-glow/30 bg-black/50 aspect-[16/10] group">
              {currentSlide && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Counter badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 border border-cyan-glow/30 backdrop-blur-md text-[11px] font-mono text-cyan-glow">
                    {activeSlideIndex + 1} / {memories.length}
                  </div>

                  {/* Slideshow Controls */}
                  {memories.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-cyan-glow hover:text-space-navy transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-cyan-glow hover:text-space-navy transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Slide caption preview */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs text-white/90 font-medium line-clamp-2">
                      {currentSlide.caption}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Quick Add Button */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-nebula-silver">
                Daftar Kenangan ({memories.length})
              </span>
              <button
                type="button"
                onClick={() => onOpenUploadForNode(nodeIndex, new Date())}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-glow/15 border border-cyan-glow/40 text-cyan-glow text-xs font-medium hover:bg-cyan-glow hover:text-space-navy transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Foto</span>
              </button>
            </div>

            {/* Lower: Scrollable Timeline Cards */}
            <div className="space-y-4">
              {memories.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-[20px] border transition-all ${
                    idx === activeSlideIndex
                      ? "bg-space-navy/70 border-cyan-glow shadow-[0_0_15px_rgba(124,222,228,0.2)]"
                      : "bg-black/30 border-white/10 hover:border-cyan-glow/30"
                  }`}
                  onClick={() => setActiveSlideIndex(idx)}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.imageUrl}
                        alt={m.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex-1 min-w-0">
                      {editingId === m.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            placeholder="Lokasi (opsional)"
                            className="w-full px-3 py-1 text-xs rounded-lg bg-white/10 border border-cyan-glow/30 text-white placeholder-white/30 focus:outline-none"
                          />
                          <textarea
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                            rows={2}
                            placeholder="Cerita foto..."
                            className="w-full px-3 py-1 text-xs rounded-lg bg-white/10 border border-cyan-glow/30 text-white placeholder-white/30 focus:outline-none resize-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => saveEdit(m.id)}
                              className="px-3 py-1 rounded-md bg-cyan-glow text-space-navy text-[11px] font-bold flex items-center gap-1 hover:bg-white"
                            >
                              <Check className="w-3 h-3" />
                              <span>Simpan</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1 rounded-md bg-white/10 text-white text-[11px] hover:bg-white/20"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2 text-[11px] text-nebula-silver">
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-cyan-glow" />
                                {new Date(m.memoryDate).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              {m.location && (
                                <span className="inline-flex items-center gap-1 text-amber-star">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate max-w-[120px]">{m.location}</span>
                                </span>
                              )}
                            </div>

                            {/* Edit & Delete Action Icons */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEdit(m);
                                }}
                                title="Edit Cerita / Lokasi"
                                className="p-1 rounded text-nebula-silver hover:text-cyan-glow transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm("Hapus foto kenangan ini dari langit?")) {
                                    onDeleteMemory(m.id);
                                  }
                                }}
                                title="Hapus Foto"
                                className="p-1 rounded text-nebula-silver hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-white/90 leading-relaxed font-body">
                            {m.caption}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
