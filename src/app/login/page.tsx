"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CONSTELLATIONS, CONSTELLATION_MAP } from "@/data/constellations";
import { getConstellationAndNode } from "@/lib/dateDistributor";
import CelestialLogo from "@/components/ui/CelestialLogo";
import ZodiacGlyph from "@/components/ui/ZodiacGlyph";
import AuthSkyBackdrop from "@/components/canvas/AuthSkyBackdrop";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [focusedConstellationId, setFocusedConstellationId] = useState<string>("leo");
  const [hasAlignedToday, setHasAlignedToday] = useState(false);

  const supabase = createClient();

  // Align the 3D observatory sky to today's active zodiac constellation (matching /sky)
  useEffect(() => {
    let active = true;
    const todayId = getConstellationAndNode(new Date()).constellation.id;
    Promise.resolve().then(() => {
      if (!active) return;
      setFocusedConstellationId(todayId);
      setHasAlignedToday(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    const ver = params.get("verified");
    if (!err && ver !== "true") return;

    Promise.resolve().then(() => {
      if (!active) return;
      if (err) {
        setErrorMessage(err);
      }
      if (ver === "true") {
        setSuccessMessage(
          "Your email has been verified. Sign in below to enter your 3D sky vault."
        );
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const activeConstellation =
    CONSTELLATION_MAP[focusedConstellationId] ?? CONSTELLATIONS[7];
  const activeIdx = CONSTELLATIONS.findIndex(
    (c) => c.id === activeConstellation.id
  );

  const handlePrevConstellation = () => {
    const prev =
      CONSTELLATIONS[
        (activeIdx - 1 + CONSTELLATIONS.length) % CONSTELLATIONS.length
      ];
    setFocusedConstellationId(prev.id);
  };

  const handleNextConstellation = () => {
    const next = CONSTELLATIONS[(activeIdx + 1) % CONSTELLATIONS.length];
    setFocusedConstellationId(next.id);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const origin =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const emailRedirectTo = `${origin}/auth/callback`;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo,
          },
        });

        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessMessage(
            "Account created. A verification link has been sent to your email address. Please confirm it to unlock your vault."
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
        setErrorMessage("An unexpected error occurred during authentication.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh bg-space-black text-ink-primary flex flex-col">
      {hasAlignedToday ? (
        <AuthSkyBackdrop
          focusedConstellationId={focusedConstellationId}
          desktopAlign="left-panel"
        />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 bg-space-black"
        />
      )}

      {/* Top Observatory Bar (aligned with LandingHeader) */}
      <header className="sticky top-0 z-30 border-b border-white/12 bg-space-black pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-8 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-h-[44px] shrink-0">
            <span className="w-9 h-9 rounded-lg border border-cyan-glow/30 bg-space-abyss flex items-center justify-center text-cyan-glow group-hover:border-cyan-glow transition-colors shrink-0">
              <CelestialLogo size={24} />
            </span>
            <span className="font-display text-sm sm:text-lg font-bold tracking-[0.12em] uppercase text-ink-primary whitespace-nowrap">
              Twelve Skies
            </span>
          </Link>

          <Link
            href="/"
            aria-label="Back to Observatory"
            className="min-h-[44px] px-3.5 sm:px-4 inline-flex items-center gap-2 rounded-lg border border-white/20 text-sm font-medium text-ink-primary hover:border-cyan-glow hover:bg-white/[0.04] transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Back to Observatory</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      {/* Open-Sky Asymmetric Access View (mirrors HeroSkySection over the shared 3D dome) */}
      <main className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Frosted Observatory Access Panel */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="w-full max-w-md rounded-xl border border-white/15 bg-space-abyss/72 backdrop-blur-md p-6 sm:p-8">
                <div className="mb-6">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-ink-primary leading-tight">
                    {isSignUp
                      ? "Create Your Sky Vault"
                      : "Sign In to Twelve Skies"}
                  </h1>
                  <p className="text-sm text-ink-secondary mt-1.5 leading-relaxed">
                    {isSignUp
                      ? "Open your private 3D constellation vault."
                      : "Return to your private constellation gallery."}
                  </p>
                </div>

                {/* Mode Tabs */}
                <div
                  role="tablist"
                  aria-label="Authentication mode"
                  className="grid grid-cols-2 p-1 mb-6 rounded-lg bg-space-black/75 border border-white/12"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={!isSignUp}
                    onClick={() => {
                      setIsSignUp(false);
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className={`min-h-[44px] text-xs font-semibold rounded-md transition-colors ${
                      !isSignUp
                        ? "bg-cyan-glow text-space-navy"
                        : "text-ink-secondary hover:text-ink-primary"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isSignUp}
                    onClick={() => {
                      setIsSignUp(true);
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }}
                    className={`min-h-[44px] text-xs font-semibold rounded-md transition-colors ${
                      isSignUp
                        ? "bg-cyan-glow text-space-navy"
                        : "text-ink-secondary hover:text-ink-primary"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Error & Success Feedback */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-5 p-3.5 rounded-lg bg-rose-950/75 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-200"
                  >
                    <AlertCircle
                      className="w-4 h-4 shrink-0 mt-0.5 text-rose-400"
                      aria-hidden="true"
                    />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div
                    role="status"
                    className="mb-5 p-3.5 rounded-lg bg-emerald-950/75 border border-emerald-500/40 flex items-start gap-2.5 text-xs text-emerald-200"
                  >
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400"
                      aria-hidden="true"
                    />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <label
                      htmlFor="auth-email"
                      className="block text-xs font-medium text-ink-secondary mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-glow/80 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id="auth-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-lg bg-space-black/75 border border-cyan-glow/30 hover:border-cyan-glow/60 focus:border-cyan-glow text-ink-primary placeholder-ink-muted text-base lg:text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="auth-password"
                      className="block text-xs font-medium text-ink-secondary mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-glow/80 pointer-events-none"
                        aria-hidden="true"
                      />
                      <input
                        id="auth-password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        autoComplete={
                          isSignUp ? "new-password" : "current-password"
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full min-h-[44px] pl-10 pr-12 py-2.5 rounded-lg bg-space-black/75 border border-cyan-glow/30 hover:border-cyan-glow/60 focus:border-cyan-glow text-ink-primary placeholder-ink-muted text-base lg:text-sm transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-0.5 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-ink-secondary hover:text-ink-primary transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[44px] mt-2 py-2.5 rounded-lg bg-cyan-glow text-space-navy font-bold text-sm hover:bg-ink-primary active:scale-[0.99] transition-colors disabled:opacity-50"
                  >
                    {loading
                      ? "Authenticating..."
                      : isSignUp
                      ? "Create Vault Account"
                      : "Enter 3D Sky Vault"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Unobstructed Live 3D Constellation View + Quiet Sector Readout */}
            <div className="hidden lg:flex lg:col-span-7 flex-col justify-end min-h-[500px] pointer-events-none">
              <div className="mt-auto ml-auto pointer-events-auto rounded-xl border border-white/15 bg-space-black/80 px-4 py-3 flex items-center gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                    style={{
                      borderColor: `${activeConstellation.glowColor}55`,
                      backgroundColor: `${activeConstellation.glowColor}14`,
                      color: activeConstellation.glowColor,
                    }}
                    aria-hidden="true"
                  >
                    <ZodiacGlyph id={activeConstellation.id} size={16} />
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-sm font-semibold text-ink-primary leading-tight">
                      {activeConstellation.name}
                    </div>
                    <div className="font-mono text-xs text-ink-secondary leading-tight mt-0.5">
                      {activeConstellation.periodText} ·{" "}
                      {activeConstellation.nodes.length} stars
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pl-3 border-l border-white/12 shrink-0">
                  <button
                    type="button"
                    onClick={handlePrevConstellation}
                    aria-label="Previous constellation"
                    className="min-w-[44px] min-h-[44px] xl:min-w-[38px] xl:min-h-[38px] rounded-lg border border-white/15 bg-space-abyss/80 inline-flex items-center justify-center text-ink-primary hover:border-cyan-glow transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextConstellation}
                    aria-label="Next constellation"
                    className="min-w-[44px] min-h-[44px] xl:min-w-[38px] xl:min-h-[38px] rounded-lg border border-white/15 bg-space-abyss/80 inline-flex items-center justify-center text-ink-primary hover:border-cyan-glow transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/12 bg-space-black pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 text-center text-xs text-ink-muted">
          Protected by Supabase Auth and private Prisma ORM server boundaries.
        </div>
      </footer>
    </div>
  );
}
