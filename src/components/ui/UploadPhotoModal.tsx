"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { getConstellationAndNode } from "@/lib/dateDistributor";
import { createClient } from "@/lib/supabase/client";
import CelestialLogo from "@/components/ui/CelestialLogo";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";
import {
  X,
  Upload,
  Calendar,
  MapPin,
  AlertCircle,
  FileImage,
} from "lucide-react";

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
  const [dateStr, setDateStr] = useState<string>(
    initialDate ? initialDate.toISOString().slice(0, 10) : "2025-01-01"
  );
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (initialDate) {
      setDateStr(initialDate.toISOString().slice(0, 10));
    } else {
      setDateStr(new Date().toISOString().slice(0, 10));
    }
  }, [initialDate]);

  if (!isOpen) return null;

  // Real-time live preview of constellation and node mapping
  const targetDate = new Date(dateStr);
  const mapping = !isNaN(targetDate.getTime())
    ? getConstellationAndNode(targetDate)
    : null;

  // Client-side image compression
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
      setErrorMessage("Silakan pilih file foto terlebih dahulu.");
      return;
    }
    if (!caption.trim()) {
      setErrorMessage("Cerita kenangan wajib diisi.");
      return;
    }

    startTransition(async () => {
      setErrorMessage(null);
      try {
        // 1. Client-side compression
        const compressedBlob = await compressImage(selectedFile);

        // 2. Upload to Supabase Storage bucket 'sky-memories'
        const fileExt = "webp";
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `user-memories/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("sky-memories")
          .upload(filePath, compressedBlob, {
            contentType: "image/webp",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Gagal mengunggah foto ke storage: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("sky-memories")
          .getPublicUrl(filePath);

        const publicImageUrl = urlData.publicUrl;

        // 3. Post memory record to server API via Prisma ORM
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
          throw new Error(errData.error || "Gagal menyimpan data memori ke server.");
        }

        // Success: Reset and close
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
          setErrorMessage("Terjadi kesalahan tidak terduga saat menyimpan memori.");
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-[32px] bg-space-navy/90 border border-cyan-glow/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(3,4,94,0.8)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-glow/20 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-glow/15 border border-cyan-glow/40 flex items-center justify-center text-cyan-glow">
              <CelestialLogo size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                Tambah Memori Langit
              </h2>
              <p className="text-[11px] text-nebula-silver">
                Foto akan otomatis diposisikan pada rasi zodiak yang sesuai
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-cyan-glow/20 flex items-center justify-center text-nebula-silver hover:text-white hover:border-cyan-glow transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Dropzone / Upload area */}
          <div>
            <label className="block text-xs font-semibold text-nebula-silver mb-1.5 pl-2">
              Pilih Foto Kenangan
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-cyan-glow/40 bg-black/40 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-medium text-white transition-opacity gap-2"
                >
                  <FileImage className="w-4 h-4" />
                  <span>Ganti Foto</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-2xl border-2 border-dashed border-cyan-glow/30 bg-white/5 hover:bg-white/10 hover:border-cyan-glow transition-all flex flex-col items-center justify-center text-nebula-silver gap-2"
              >
                <Upload className="w-6 h-6 text-cyan-glow" />
                <span className="text-xs font-medium text-white">
                  Klik untuk memilih foto (JPG, PNG, WebP)
                </span>
                <span className="text-[10px] text-nebula-silver">
                  Dikompresi otomatis secara aman
                </span>
              </button>
            )}
          </div>

          {/* Date Picker + Real-time Constellation Live Preview */}
          <div>
            <label className="block text-xs font-semibold text-nebula-silver mb-1.5 pl-2">
              Tanggal Pengambilan Foto
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-glow" />
              <input
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-[30px] bg-white/5 border border-cyan-glow/30 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-glow"
              />
            </div>

            {/* Live destination preview badge */}
            {mapping && (
              <div
                className="mt-2 p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors"
                style={{
                  borderColor: `${mapping.constellation.glowColor}50`,
                  backgroundColor: `${mapping.constellation.glowColor}10`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center justify-center"
                    style={{ color: mapping.constellation.glowColor }}
                  >
                    <ZodiacGlyph id={mapping.constellation.id} size={16} />
                  </span>
                  <div>
                    <span className="font-display font-bold uppercase text-white">
                      Rasi {mapping.constellation.name}
                    </span>
                    <span className="text-[10px] text-nebula-silver block">
                      Titik Bintang #{mapping.nodeIndex + 1} ({mapping.formattedRange})
                    </span>
                  </div>
                </div>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                  style={{
                    borderColor: `${mapping.constellation.glowColor}40`,
                    color: mapping.constellation.glowColor,
                  }}
                >
                  Tujuan Otomatis
                </span>
              </div>
            )}
          </div>

          {/* Location (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-nebula-silver mb-1.5 pl-2">
              Lokasi Kenangan (Opsional)
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-star" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Danau Toba, Kyoto, Pantai Parangtritis"
                maxLength={150}
                className="w-full pl-11 pr-4 py-2.5 rounded-[30px] bg-white/5 border border-cyan-glow/30 text-white placeholder-white/25 text-xs sm:text-sm focus:outline-none focus:border-cyan-glow"
              />
            </div>
          </div>

          {/* Caption / Story */}
          <div>
            <label className="block text-xs font-semibold text-nebula-silver mb-1.5 pl-2">
              Cerita / Catatan Momen
            </label>
            <textarea
              required
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Ceritakan momen di balik foto ini..."
              className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-cyan-glow/30 text-white placeholder-white/25 text-xs sm:text-sm focus:outline-none focus:border-cyan-glow resize-none"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 rounded-[30px] bg-cyan-glow text-space-navy font-bold text-xs uppercase tracking-wider hover:bg-transparent hover:text-white hover:border hover:border-white transition-all shadow-[0_0_20px_rgba(124,222,228,0.3)] disabled:opacity-50"
          >
            {isPending ? "Mengompresi & Menyimpan..." : "Semayamkan ke Rasi Bintang"}
          </button>
        </form>
      </div>
    </div>
  );
}
