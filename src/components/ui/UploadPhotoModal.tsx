"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  Calendar,
  FileImage,
  MapPin,
  Upload,
  X,
} from "lucide-react";
import { getConstellationAndNode } from "@/lib/dateDistributor";
import { createClient } from "@/lib/supabase/client";
import CelestialLogo from "@/components/ui/CelestialLogo";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date;
}

export default function UploadPhotoModal({
  isOpen,
  onClose,
  onSuccess,
  initialDate,
}: UploadPhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dateStr, setDateStr] = useState<string>(() =>
    initialDate ? initialDate.toISOString().slice(0, 10) : "2025-01-01"
  );
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onClose]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  const mapping = isValidDate ? getConstellationAndNode(dateStr) : null;

  // Client-side image compression (max 1920px, WebP quality 0.82)
  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const canvas = document.createElement("canvas");
        const maxDim = 1920;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Image compression failed"));
          },
          "image/webp",
          0.82
        );
      };
      img.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please choose a photograph before archiving.");
      return;
    }
    if (!caption.trim()) {
      setErrorMessage("Please enter a short story or caption for this memory.");
      return;
    }

    startTransition(async () => {
      setErrorMessage(null);
      try {
        const compressedBlob = await compressImage(selectedFile);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
        const filePath = `user-memories/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("sky-memories")
          .upload(filePath, compressedBlob, {
            contentType: "image/webp",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("sky-memories")
          .getPublicUrl(filePath);

        const publicImageUrl = urlData.publicUrl;

        const res = await fetch("/api/memories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: publicImageUrl,
            memoryDate: dateStr,
            location: location.trim() || null,
            caption: caption.trim(),
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to save memory to the server.");
        }

        setSelectedFile(null);
        setPreviewUrl(null);
        setCaption("");
        setLocation("");
        onSuccess();
        onClose();
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("An unexpected error occurred while saving your memory.");
        }
      }
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-xl bg-space-abyss/95 border border-cyan-glow/30 animate-modal-reveal max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-glow/15 border border-cyan-glow/40 flex items-center justify-center text-cyan-glow">
              <CelestialLogo size={23} />
            </div>
            <div>
              <h2
                id="upload-modal-title"
                className="font-display text-lg font-bold tracking-wide text-ink-primary"
              >
                Archive a Sky Memory
              </h2>
              <p className="text-xs text-ink-secondary">
                Automatically mapped to its zodiac star node by capture date
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close upload modal"
            className="min-w-[38px] min-h-[38px] rounded-lg bg-black/45 border border-white/15 flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:border-cyan-glow transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-start gap-2 text-xs text-rose-200"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Dropzone */}
          <div>
            <label
              htmlFor="memory-file-input"
              className="block text-xs font-medium text-ink-secondary mb-1.5"
            >
              Photograph (JPG, PNG, or WebP)
            </label>
            <input
              id="memory-file-input"
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative w-full h-44 rounded-lg overflow-hidden border border-cyan-glow/40 bg-black/50 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Selected memory preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center justify-center text-xs font-medium text-white transition-opacity gap-2"
                >
                  <FileImage className="w-4 h-4" aria-hidden="true" />
                  <span>Replace Photograph</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-lg border border-dashed border-cyan-glow/35 bg-black/40 hover:bg-black/60 hover:border-cyan-glow transition-colors flex flex-col items-center justify-center text-ink-secondary gap-1.5"
              >
                <Upload className="w-6 h-6 text-cyan-glow" aria-hidden="true" />
                <span className="text-xs font-medium text-ink-primary">
                  Choose a photograph from your device
                </span>
                <span className="text-[11px] text-ink-muted">
                  Compressed client-side to WebP (max 1920px) before upload
                </span>
              </button>
            )}
          </div>

          {/* Capture Date & Live Mapping Preview */}
          <div>
            <label
              htmlFor="memory-date-input"
              className="block text-xs font-medium text-ink-secondary mb-1.5"
            >
              Capture Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-glow pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="memory-date-input"
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-lg bg-black/55 border border-cyan-glow/30 text-ink-primary font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-glow"
              />
            </div>

            {mapping && (
              <div
                className="mt-2.5 p-3 rounded-lg border flex items-center justify-between gap-2 text-xs"
                style={{
                  borderColor: `${mapping.constellation.glowColor}50`,
                  backgroundColor: `${mapping.constellation.glowColor}10`,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex items-center justify-center"
                    style={{ color: mapping.constellation.glowColor }}
                  >
                    <ZodiacGlyph id={mapping.constellation.id} size={18} />
                  </span>
                  <div>
                    <span className="font-display font-bold uppercase text-ink-primary">
                      {mapping.constellation.name}
                    </span>
                    <span className="font-mono text-[11px] text-ink-secondary block">
                      Star Node #{mapping.nodeIndex + 1} ({mapping.formattedRange})
                    </span>
                  </div>
                </div>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded border"
                  style={{
                    borderColor: `${mapping.constellation.glowColor}45`,
                    color: mapping.constellation.glowColor,
                  }}
                >
                  Auto-Assigned
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="memory-location-input"
              className="block text-xs font-medium text-ink-secondary mb-1.5"
            >
              Location (Optional)
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-star pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="memory-location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kyoto, Mount Bromo, Lake Toba"
                maxLength={150}
                className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-lg bg-black/55 border border-cyan-glow/30 text-ink-primary placeholder-ink-muted text-xs sm:text-sm focus:outline-none focus:border-cyan-glow"
              />
            </div>
          </div>

          {/* Story / Caption */}
          <div>
            <label
              htmlFor="memory-caption-input"
              className="block text-xs font-medium text-ink-secondary mb-1.5"
            >
              Memory Story
            </label>
            <textarea
              id="memory-caption-input"
              required
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write what happened when this photograph was taken..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-black/55 border border-cyan-glow/30 text-ink-primary placeholder-ink-muted text-xs sm:text-sm focus:outline-none focus:border-cyan-glow resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full min-h-[44px] py-2.5 rounded-lg bg-cyan-glow text-space-navy font-bold text-sm hover:bg-white transition-colors disabled:opacity-50"
          >
            {isPending ? "Compressing and Archiving..." : "Place in Constellation"}
          </button>
        </form>
      </div>
    </div>
  );
}
