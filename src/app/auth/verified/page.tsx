import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CelestialLogo from "@/components/ui/CelestialLogo";
import WakeStarfieldBackground from "@/components/canvas/WakeStarfieldBackground";

async function VerifiedSessionActions() {
  let verifiedEmail: string | null = null;
  let hasActiveSession = false;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
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
        <div className="mt-5 px-3.5 py-2.5 rounded-lg bg-black/55 border border-white/10 text-xs font-mono text-ink-secondary break-all">
          {verifiedEmail}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {hasActiveSession ? (
          <Link
            href="/sky"
            className="w-full min-h-[44px] px-6 py-2.5 rounded-lg bg-cyan-glow text-space-navy font-bold text-sm inline-flex items-center justify-center hover:bg-ink-primary transition-colors"
          >
            Enter 3D Sky Vault
          </Link>
        ) : (
          <Link
            href="/login?verified=true"
            className="w-full min-h-[44px] px-6 py-2.5 rounded-lg bg-cyan-glow text-space-navy font-bold text-sm inline-flex items-center justify-center hover:bg-ink-primary transition-colors"
          >
            Sign In to Twelve Skies
          </Link>
        )}

        <Link
          href="/"
          className="w-full min-h-[44px] px-6 py-2.5 rounded-lg border border-white/20 bg-transparent text-ink-primary font-medium text-sm inline-flex items-center justify-center hover:border-cyan-glow/60 hover:bg-white/[0.04] transition-colors"
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
          className="w-full min-h-[44px] px-6 py-2.5 rounded-lg border border-white/20 bg-transparent text-ink-primary font-medium text-sm inline-flex items-center justify-center hover:border-cyan-glow/60 hover:bg-white/[0.04] transition-colors"
        >
          Return to Observatory
        </Link>
      </div>
    </>
  );
}

export default function EmailVerifiedPage() {
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

      {/* Centered Confirmation Card */}
      <main className="relative z-10 w-full max-w-md mx-auto my-8">
        <section
          aria-labelledby="verified-heading"
          className="rounded-xl border border-cyan-glow/25 bg-space-abyss/85 backdrop-blur-md p-6 sm:p-8 text-center"
        >
          <div className="w-12 h-12 rounded-xl border border-cyan-glow/35 bg-black/60 flex items-center justify-center text-cyan-glow mx-auto mb-5">
            <CelestialLogo size={24} />
          </div>

          <div className="inline-flex items-center justify-center gap-2 text-emerald-300 mb-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold">Verification Complete</span>
          </div>

          <h1
            id="verified-heading"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary"
          >
            Email Address Confirmed
          </h1>

          <Suspense fallback={<VerifiedActionsFallback />}>
            <VerifiedSessionActions />
          </Suspense>
        </section>
      </main>

      <footer className="relative z-10 text-center text-xs text-ink-muted">
        Protected by Supabase Auth and private Prisma ORM server boundaries.
      </footer>
    </div>
  );
}
