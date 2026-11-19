"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import CelestialLogo from "@/components/ui/CelestialLogo";
import WakeStarfieldBackground from "@/components/canvas/WakeStarfieldBackground";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const supabase = createClient();

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
    <div className="relative min-h-screen bg-space-black text-ink-primary flex flex-col justify-between p-5 sm:p-8">
      <WakeStarfieldBackground />

      {/* Top Back Navigation */}
      <div className="relative z-20 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link
          href="/"
          className="min-h-[44px] px-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/60 text-sm text-ink-secondary hover:text-ink-primary hover:border-cyan-glow/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Observatory</span>
        </Link>
      </div>

      {/* Centered Observatory Access Panel */}
      <main className="relative z-10 w-full max-w-md mx-auto my-8">
        <div className="rounded-xl border border-cyan-glow/25 bg-space-abyss/85 backdrop-blur-md p-6 sm:p-8">
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-12 h-12 rounded-xl border border-cyan-glow/35 bg-black/60 flex items-center justify-center text-cyan-glow mb-3.5">
              <CelestialLogo size={30} />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-wide text-ink-primary">
              {isSignUp ? "Create Your Sky Vault" : "Sign In to Twelve Skies"}
            </h1>
            <p className="text-sm text-ink-secondary mt-1.5">
              {isSignUp
                ? "Start archiving personal photographs inside your private 3D dome"
                : "Return to your private constellation gallery"}
            </p>
          </div>

          {/* Mode Tabs */}
          <div
            role="tablist"
            aria-label="Authentication mode"
            className="grid grid-cols-2 p-1 mb-6 rounded-lg bg-black/50 border border-white/10"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isSignUp}
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage(null);
              }}
              className={`min-h-[40px] text-xs font-semibold rounded-md transition-colors ${
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
              }}
              className={`min-h-[40px] text-xs font-semibold rounded-md transition-colors ${
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
              className="mb-5 p-3.5 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-200"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mb-5 p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-start gap-2.5 text-xs text-emerald-200"
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
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-lg bg-black/55 border border-cyan-glow/25 text-ink-primary placeholder-ink-muted text-sm focus:outline-none focus:border-cyan-glow transition-colors"
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
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full min-h-[44px] pl-10 pr-11 py-2.5 rounded-lg bg-black/55 border border-cyan-glow/25 text-ink-primary placeholder-ink-muted text-sm focus:outline-none focus:border-cyan-glow transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-md text-ink-secondary hover:text-ink-primary transition-colors"
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
              className="w-full min-h-[44px] mt-2 py-2.5 rounded-lg bg-cyan-glow text-space-navy font-bold text-sm hover:bg-white transition-colors disabled:opacity-50"
            >
              {loading
                ? "Authenticating..."
                : isSignUp
                ? "Create Vault Account"
                : "Enter 3D Sky Vault"}
            </button>
          </form>
        </div>
      </main>

      <footer className="relative z-10 text-center text-xs text-ink-muted">
        Protected by Supabase Auth and private Prisma ORM server boundaries.
      </footer>
    </div>
  );
}
