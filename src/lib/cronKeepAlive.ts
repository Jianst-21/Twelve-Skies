import { timingSafeEqual } from "node:crypto";

export type CronAuthResult =
  | { ok: true; status: 200 }
  | { ok: false; status: 401 | 500; error: string };

export type AuthPingStatus = "ok" | "degraded" | "skipped";

export interface KeepAliveBody {
  ok: boolean;
  database: "ok" | "error";
  auth: AuthPingStatus;
  checkedAt: string;
  durationMs: number;
  error?: string;
}

export interface KeepAliveResult {
  status: 200 | 503;
  body: KeepAliveBody;
}

export interface KeepAliveDeps {
  pingDatabase: () => Promise<unknown>;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  fetchImpl?: typeof fetch;
  now?: () => Date;
  onError?: (error: unknown) => void;
}

export function verifyCronAuthorization(
  authHeader: string | null,
  cronSecret: string | undefined
): CronAuthResult {
  const normalizedSecret = cronSecret?.trim();
  if (!normalizedSecret) {
    return { ok: false, status: 500, error: "CRON_SECRET is not configured" };
  }

  if (!authHeader) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const expected = Buffer.from(`Bearer ${normalizedSecret}`, "utf8");
  const provided = Buffer.from(authHeader, "utf8");

  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  return { ok: true, status: 200 };
}

export async function executeKeepAlive(deps: KeepAliveDeps): Promise<KeepAliveResult> {
  const now = deps.now ?? (() => new Date());
  const startedAt = Date.now();
  const checkedAt = now().toISOString();

  try {
    await deps.pingDatabase();
  } catch (error) {
    const logError = deps.onError ?? ((err) => console.error("Supabase keep-alive database check failed:", err));
    logError(error);
    return {
      status: 503,
      body: {
        ok: false,
        database: "error",
        auth: "skipped",
        checkedAt,
        durationMs: Math.max(0, Date.now() - startedAt),
        error: "Database keep-alive check failed",
      },
    };
  }

  let authStatus: AuthPingStatus = "skipped";
  const baseUrl = deps.supabaseUrl?.trim().replace(/\/+$/, "");

  if (baseUrl && !baseUrl.includes("placeholder.supabase.co")) {
    const fetchImpl = deps.fetchImpl ?? fetch;
    const headers: Record<string, string> = {};
    if (deps.supabaseAnonKey?.trim()) {
      headers.apikey = deps.supabaseAnonKey.trim();
    }

    try {
      const response = await fetchImpl(`${baseUrl}/auth/v1/health`, {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(5000),
      });
      authStatus = response.ok ? "ok" : "degraded";
    } catch {
      authStatus = "degraded";
    }
  }

  return {
    status: 200,
    body: {
      ok: true,
      database: "ok",
      auth: authStatus,
      checkedAt,
      durationMs: Math.max(0, Date.now() - startedAt),
    },
  };
}
