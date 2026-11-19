import test from "node:test";
import assert from "node:assert/strict";
import {
  verifyCronAuthorization,
  executeKeepAlive,
} from "../src/lib/cronKeepAlive.ts";

test("verifyCronAuthorization fails closed with 500 when CRON_SECRET is missing or blank", () => {
  const missing = verifyCronAuthorization("Bearer some-token", undefined);
  assert.equal(missing.ok, false);
  assert.equal(missing.status, 500);

  const blank = verifyCronAuthorization("Bearer some-token", "   ");
  assert.equal(blank.ok, false);
  assert.equal(blank.status, 500);
});

test("verifyCronAuthorization rejects missing, malformed, or mismatched Bearer tokens with 401", () => {
  const secret = "super-secret-cron-token-123";

  assert.equal(verifyCronAuthorization(null, secret).status, 401);
  assert.equal(verifyCronAuthorization("", secret).status, 401);
  assert.equal(verifyCronAuthorization("Basic super-secret-cron-token-123", secret).status, 401);
  assert.equal(verifyCronAuthorization("Bearer wrong-token", secret).status, 401);
  assert.equal(verifyCronAuthorization("Bearer super-secret-cron-token-124", secret).status, 401);
});

test("verifyCronAuthorization accepts exact matching Bearer token", () => {
  const secret = "super-secret-cron-token-123";
  const result = verifyCronAuthorization(`Bearer ${secret}`, secret);
  assert.deepEqual(result, { ok: true, status: 200 });
});

test("executeKeepAlive queries database and pings Supabase Auth health endpoint", async () => {
  let dbCalls = 0;
  let capturedUrl = "";
  let capturedHeaders = {};

  const fixedDate = new Date("2026-11-20T00:00:00.000Z");

  const result = await executeKeepAlive({
    pingDatabase: async () => {
      dbCalls += 1;
      return 42;
    },
    supabaseUrl: "https://demo-project.supabase.co/",
    supabaseAnonKey: "anon-key-xyz",
    fetchImpl: async (url, init) => {
      capturedUrl = String(url);
      capturedHeaders = init?.headers ?? {};
      return new Response(JSON.stringify({ version: "2.0" }), { status: 200 });
    },
    now: () => fixedDate,
  });

  assert.equal(dbCalls, 1);
  assert.equal(capturedUrl, "https://demo-project.supabase.co/auth/v1/health");
  assert.equal(capturedHeaders.apikey, "anon-key-xyz");
  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  assert.equal(result.body.database, "ok");
  assert.equal(result.body.auth, "ok");
  assert.equal(result.body.checkedAt, "2026-11-20T00:00:00.000Z");
  assert.equal(typeof result.body.durationMs, "number");
  assert.equal("count" in result.body, false);
});

test("executeKeepAlive marks auth as skipped when Supabase URL is not configured", async () => {
  const result = await executeKeepAlive({
    pingDatabase: async () => 0,
    supabaseUrl: "",
    supabaseAnonKey: "",
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  assert.equal(result.body.database, "ok");
  assert.equal(result.body.auth, "skipped");
});

test("executeKeepAlive marks auth as degraded without failing keep-alive when Auth health ping fails or throws", async () => {
  const nonOk = await executeKeepAlive({
    pingDatabase: async () => 5,
    supabaseUrl: "https://demo-project.supabase.co",
    supabaseAnonKey: "anon-key-xyz",
    fetchImpl: async () => new Response("error", { status: 502 }),
  });

  assert.equal(nonOk.status, 200);
  assert.equal(nonOk.body.ok, true);
  assert.equal(nonOk.body.database, "ok");
  assert.equal(nonOk.body.auth, "degraded");

  const thrown = await executeKeepAlive({
    pingDatabase: async () => 5,
    supabaseUrl: "https://demo-project.supabase.co",
    supabaseAnonKey: "anon-key-xyz",
    fetchImpl: async () => {
      throw new Error("network timeout");
    },
  });

  assert.equal(thrown.status, 200);
  assert.equal(thrown.body.ok, true);
  assert.equal(thrown.body.database, "ok");
  assert.equal(thrown.body.auth, "degraded");
});

test("executeKeepAlive returns 503 when Prisma database ping fails", async () => {
  let fetchCalled = false;
  let loggedError = null;

  const result = await executeKeepAlive({
    pingDatabase: async () => {
      throw new Error("Connection refused");
    },
    supabaseUrl: "https://demo-project.supabase.co",
    supabaseAnonKey: "anon-key-xyz",
    fetchImpl: async () => {
      fetchCalled = true;
      return new Response("ok", { status: 200 });
    },
    onError: (err) => {
      loggedError = err;
    },
  });

  assert.equal(fetchCalled, false);
  assert.ok(loggedError instanceof Error);
  assert.equal(result.status, 503);
  assert.equal(result.body.ok, false);
  assert.equal(result.body.database, "error");
  assert.equal(result.body.auth, "skipped");
});
