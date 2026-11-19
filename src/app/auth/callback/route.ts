import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const errorDescription = searchParams.get("error_description");
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/auth/verified";

  const origin = request.nextUrl.origin;

  if (errorDescription) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription)}`, origin)
    );
  }

  const supabase = await createClient();

  // Handle PKCE code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // Handle OTP / token_hash verification (works across browsers and devices)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  // If verification fails or link expired
  return NextResponse.redirect(
    new URL(
      "/login?error=" +
        encodeURIComponent(
          "Verification link is invalid or has expired. Please sign in or request a new confirmation email."
        ),
      origin
    )
  );
}
