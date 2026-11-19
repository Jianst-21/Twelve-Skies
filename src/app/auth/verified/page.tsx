import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CelestialLogo from "@/components/ui/CelestialLogo";
import AuthSkyBackdrop from "@/components/canvas/AuthSkyBackdrop";

async function VerifiedSessionActions() {
  let verifiedEmail: string | null = null;
  let hasActiveSession = false;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        hasActiveSession = true;
        verifiedEmail = user.email ?? null;
      }
    } catch {
      hasActiveSession = false;
    }
  }

  return (
    <>
      <p className="text-sm text-ink-secondary leading-relaxed mt-3">
        {hasActiveSession
          ? "Your Twelve Skies account is active. You can now enter your private 3D celestial dome and begin archiving photographs."
          : "Your email verification is complete. Sign in with your credentials to enter your private 3D sky vault."}
      </p>

      {verifiedEmail && (
        <div className="mt-5 px-3.5 py-2.5 rounded-lg bg-space-black/75 border border-white/12 text-xs font-mono text-ink-secondary break-all">
          {verifiedEmail}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {hasActiveSession ? (
          <Link
            href="/sky"
            className="w-full min-h-[44px] px-6 py-2.5 rounded-lg bg-cyan-glow text-space-navy font-bold text-sm inline-flex items-center justify-center hover:bg-ink-primary active:scale-[0.99] transition-colors"
          >
            Enter 3D Sky Vault
          </Link>
        ) : (
          <Link
            href="/login?verified=true"
            className="w-full min-h-[44px] px-6 py-2.5 rounded-lg bg-cyan-glow text-space-navy font-bold text-sm inline-flex items-center justify-center hover:bg-ink-primary active:scale-[0.99] transition-colors"
          >
            Sign In to Twelve Skies
          </Link>
        )}

        <Link
          href="/"
          className="w-full min-h-[44px] px-6 py-2.5 rounded-lg border border-white/20 bg-transparent text-ink-primary font-medium text-sm inline-flex items-center justify-center hover:border-cyan-glow hover:bg-white/[0.04] transition-colors"
        >
          Return to Observatory
        </Link>
      </div>
    </>
  );
}

function VerifiedActionsFallback() {
  return (
    <>
      <p className="text-sm text-ink-secondary leading-relaxed mt-3">
        Confirming your session status for Twelve Skies...
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <div className="w-full min-h-[44px] rounded-lg bg-white/10 animate-pulse" />
        <Link
          href="/"
          className="w-full min-h-[44px] px-6 py-2.5 rounded-lg border border-white/20 bg-transparent text-ink-primary font-medium text-sm inline-flex items-center justify-center hover:border-cyan-glow hover:bg-white/[0.04] transition-colors"
        >
          Return to Observatory
        </Link>
      </div>
    </>
  );
}

export default function EmailVerifiedPage() {
  return (
    <div className="relative min-h-dvh bg-space-black text-ink-primary flex flex-col">
      <AuthSkyBackdrop focusedConstellationId="leo" desktopAlign="center" />

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

      {/* Centered Confirmation Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 sm:px-8 py-10 sm:py-14">
        <section
          aria-labelledby="verified-heading"
          className="w-full max-w-md rounded-xl border border-white/15 bg-space-abyss/72 backdrop-blur-md p-6 sm:p-8 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 text-emerald-300 mb-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold">Verification Complete</span>
          </div>

          <h1
            id="verified-heading"
            className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-ink-primary"
          >
            Email Address Confirmed
          </h1>

          <Suspense fallback={<VerifiedActionsFallback />}>
            <VerifiedSessionActions />
          </Suspense>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/12 bg-space-black pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 text-center text-xs text-ink-muted">
          Protected by Supabase Auth and private Prisma ORM server boundaries.
        </div>
      </footer>
    </div>
  );
}
