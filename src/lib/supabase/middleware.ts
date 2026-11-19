import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Forward Supabase auth redirects that land on Site URL "/" instead of "/auth/callback"
  if (request.nextUrl.pathname === "/") {
    const params = request.nextUrl.searchParams;
    const hasAuthCode = params.has("code");
    const hasOtpToken = params.has("token_hash") && params.has("type");
    const hasAuthError = params.has("error_description");

    if (hasAuthCode || hasOtpToken || hasAuthError) {
      const callbackUrl = request.nextUrl.clone();
      callbackUrl.pathname = "/auth/callback";
      return NextResponse.redirect(callbackUrl);
    }
  }

  const isProtectedPath =
    request.nextUrl.pathname.startsWith("/sky") ||
    request.nextUrl.pathname.startsWith("/api/memories");

  // If Supabase keys are not yet configured in environment, let development pass or redirect
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedPath && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && request.nextUrl.pathname === "/login") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/sky";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
