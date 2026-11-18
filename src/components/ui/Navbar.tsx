"use client";

import Link from "next/link";
import { Sparkles, Plus, RotateCcw, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onOpenUpload: () => void;
  onResetCamera: () => void;
}

export default function Navbar({ onOpenUpload, onResetCamera }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-5xl h-16 rounded-full px-5 sm:px-6 bg-space-navy/50 border border-cyan-glow/30 backdrop-blur-xl shadow-[0_0_30px_rgba(3,4,94,0.7)] flex items-center justify-between">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-full border border-cyan-glow/40 bg-space-navy/80 flex items-center justify-center text-cyan-glow group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(124,222,228,0.3)]">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="hidden sm:block">
          <span className="font-display text-sm font-bold tracking-wider text-white uppercase block leading-tight">
            Twelve Skies
          </span>
          <span className="text-[9px] tracking-[0.2em] text-cyan-glow uppercase block leading-tight">
            Celestial Vault
          </span>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Reset Camera Button */}
        <button
          type="button"
          onClick={onResetCamera}
          title="Reset Sudut Pandang Langit"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 border border-cyan-glow/20 text-xs text-nebula-silver hover:text-white hover:border-cyan-glow/60 transition-all duration-300"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset Langit</span>
        </button>

        {/* Add Photo Button (Pill Primary) */}
        <button
          type="button"
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-cyan-glow text-space-navy text-xs sm:text-sm font-bold hover:bg-transparent hover:text-white hover:border hover:border-white transition-all duration-300 shadow-[0_0_15px_rgba(124,222,228,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto</span>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          title="Keluar Akun"
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/50 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
