"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import CelestialLogo from "@/components/ui/CelestialLogo";
import { ArrowLeft, Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage(
            "Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi atau silakan masuk."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          router.push("/sky");
          router.refresh();
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Terjadi kesalahan saat memproses autentikasi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-space-black text-white flex items-center justify-center p-6 overflow-hidden">
      {/* Authentic Neowise Continuous Cosmic Background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-45 mix-blend-screen"
        style={{
          backgroundImage: "url('/images/neowise/10-star-mini.jpg')",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-space-black via-space-navy/40 to-space-black opacity-90"
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-top opacity-30 mix-blend-lighten"
        style={{
          backgroundImage: "url('/images/neowise/2-star-mini.jpg')",
        }}
      />
      <div className="pointer-events-none fixed -top-40 -left-40 z-0 w-[500px] h-[500px] rounded-full bg-cyan-glow/10 blur-[130px]" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 z-0 w-[500px] h-[500px] rounded-full bg-space-navy/60 blur-[140px]" />

      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-space-navy/40 border border-cyan-glow/20 text-xs sm:text-sm text-nebula-silver hover:text-white hover:border-cyan-glow/60 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-space-navy/60 border border-cyan-glow/20 backdrop-blur-xl shadow-2xl shadow-black/80">
        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-cyan-glow/30 bg-space-navy/80 flex items-center justify-center text-cyan-glow mb-3">
            <CelestialLogo size={24} />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-wider uppercase text-white">
            {isSignUp ? "Daftar Akun Baru" : "Masuk ke Twelve Skies"}
          </h1>
          <p className="text-xs sm:text-sm text-nebula-silver mt-1">
            {isSignUp
              ? "Buat arsip memori rasi bintang Anda"
              : "Buka kembali galeri kenangan langit Anda"}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 mb-6 rounded-full bg-black/40 border border-cyan-glow/20">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
              !isSignUp
                ? "bg-cyan-glow text-space-navy shadow-[0_0_15px_rgba(124,222,228,0.3)]"
                : "text-nebula-silver hover:text-white"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
              isSignUp
                ? "bg-cyan-glow text-space-navy shadow-[0_0_15px_rgba(124,222,228,0.3)]"
                : "text-nebula-silver hover:text-white"
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Feedback messages */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-nebula-silver mb-1.5 pl-3">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-glow/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-11 pr-5 py-3 rounded-[30px] bg-white/5 border border-cyan-glow/30 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-nebula-silver mb-1.5 pl-3">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-glow/70" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-11 pr-5 py-3 rounded-[30px] bg-white/5 border border-cyan-glow/30 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-[30px] bg-cyan-glow text-space-navy font-bold text-sm tracking-wide uppercase hover:bg-transparent hover:text-white hover:border hover:border-white transition-all duration-300 shadow-[0_0_20px_rgba(124,222,228,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : isSignUp ? "Buat Akun Vault" : "Masuk Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
}
