import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { executeKeepAlive, verifyCronAuthorization } from "@/lib/cronKeepAlive";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET(request: NextRequest) {
  const auth = verifyCronAuthorization(
    request.headers.get("authorization"),
    process.env.CRON_SECRET
  );

  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status, headers: NO_STORE_HEADERS }
    );
  }

  const result = await executeKeepAlive({
    pingDatabase: () => prisma.memory.count(),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  return NextResponse.json(result.body, {
    status: result.status,
    headers: NO_STORE_HEADERS,
  });
}
