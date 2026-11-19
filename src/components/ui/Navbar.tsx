"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut, Plus, RotateCcw } from "lucide-react";
import CelestialLogo from "@/components/ui/CelestialLogo";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  memoryCount: number;
  isLoadingMemories: boolean;
  isIndexOpen: boolean;
  onToggleIndex: () => void;
  onOpenUpload: () => void;
  onResetCamera: () => void;
}

export default function Navbar({
  memoryCount,
  isLoadingMemories,
  isIndexOpen,
  onToggleIndex,
  onOpenUpload,
  onResetCamera,
}: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="fixed top-[max(0.75rem,env(safe-area-inset-top))] sm:top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-6xl min-h-[56px] sm:h-16 rounded-xl px-3 sm:px-6 py-1.5 sm:py-0 bg-space-abyss/80 border border-cyan-glow/25 backdrop-blur-md flex items-center justify-between gap-2 sm:gap-3">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-h-[44px] min-w-[44px] shrink-0">
        <div className="w-9 h-9 rounded-lg border border-cyan-glow/30 bg-black/60 flex items-center justify-center text-cyan-glow group-hover:border-cyan-glow transition-colors shrink-0">
          <CelestialLogo size={24} />
        </div>
        <div className="hidden sm:block">
          <span className="font-display text-sm font-bold tracking-[0.14em] text-ink-primary uppercase block leading-tight">
            Twelve Skies
          </span>
          <span className="font-mono text-[10px] text-ink-secondary block leading-tight">
            {isLoadingMemories
              ? "Syncing vault..."
              : `${memoryCount} ${memoryCount === 1 ? "memory" : "memories"} archived`}
          </span>
        </div>
      </Link>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <button
          type="button"
          onClick={onToggleIndex}
          aria-expanded={isIndexOpen}
          aria-label="Browse vault index"
          title="Browse archived memories"
          className={`min-w-[44px] min-h-[44px] px-2.5 sm:px-3.5 rounded-lg border text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors ${
            isIndexOpen
              ? "bg-cyan-glow/15 border-cyan-glow text-cyan-glow"
              : "bg-black/45 border-white/15 text-ink-secondary hover:text-ink-primary hover:border-cyan-glow/50"
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="hidden md:inline">Vault Index</span>
        </button>

        <button
          type="button"
          onClick={onResetCamera}
          aria-label="Reset sky camera view"
          title="Reset sky camera view"
          className="min-w-[44px] min-h-[44px] px-2.5 sm:px-3.5 rounded-lg bg-black/45 border border-white/15 text-xs font-medium text-ink-secondary hover:text-ink-primary hover:border-cyan-glow/50 inline-flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="hidden md:inline">Reset Sky</span>
        </button>

        <button
          type="button"
          onClick={onOpenUpload}
          className="min-h-[44px] px-3 sm:px-4 rounded-lg bg-cyan-glow text-space-navy text-xs sm:text-sm font-bold hover:bg-white inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
        >
          <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Add Photo</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sign out"
          title="Sign out"
          className="min-w-[44px] min-h-[44px] rounded-lg flex items-center justify-center bg-black/45 border border-rose-500/25 text-rose-300 hover:bg-rose-500/20 hover:border-rose-400 transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
