import test from "node:test";
import assert from "node:assert/strict";
import {
  MEMORY_STORAGE_BUCKET,
  normalizeImageContentType,
  buildMemoryStoragePath,
  extractMemoryStoragePath,
  createSignedMemoryUpload,
  removeMemoryStorageObject,
} from "../src/lib/memoryStorage.ts";

test("normalizeImageContentType accepts webp, jpeg/jpg, and png and rejects unsafe types", () => {
  assert.deepEqual(normalizeImageContentType("image/webp"), {
    contentType: "image/webp",
    extension: "webp",
  });
  assert.deepEqual(normalizeImageContentType("IMAGE/JPEG"), {
    contentType: "image/jpeg",
    extension: "jpg",
  });
  assert.deepEqual(normalizeImageContentType("image/jpg"), {
    contentType: "image/jpeg",
    extension: "jpg",
  });
  assert.deepEqual(normalizeImageContentType("image/png"), {
    contentType: "image/png",
    extension: "png",
  });

  assert.equal(normalizeImageContentType("image/svg+xml"), null);
  assert.equal(normalizeImageContentType("text/plain"), null);
  assert.equal(normalizeImageContentType(""), null);
});

test("buildMemoryStoragePath scopes uploads under user-memories/<userId>/", () => {
  const path = buildMemoryStoragePath("user-uuid-123", "webp", {
    now: 1732051200000,
    randomId: "abc1234",
  });

  assert.equal(path, "user-memories/user-uuid-123/1732051200000-abc1234.webp");
});

test("buildMemoryStoragePath rejects path traversal or invalid userId", () => {
  assert.throws(() => buildMemoryStoragePath("../admin", "webp"));
  assert.throws(() => buildMemoryStoragePath("user/nested", "webp"));
  assert.throws(() => buildMemoryStoragePath("", "webp"));
});

test("extractMemoryStoragePath parses valid sky-memories public URLs and ignores external URLs", () => {
  const supabaseUrl = "https://pmjozzpjcatryzdomimu.supabase.co";

  const scopedUrl =
    "https://pmjozzpjcatryzdomimu.supabase.co/storage/v1/object/public/sky-memories/user-memories/user-1/173205-abc.webp";
  assert.equal(
    extractMemoryStoragePath(scopedUrl, supabaseUrl),
    "user-memories/user-1/173205-abc.webp"
  );

  const legacyUrl =
    "https://pmjozzpjcatryzdomimu.supabase.co/storage/v1/object/public/sky-memories/user-memories/legacy-photo.webp?t=123";
  assert.equal(
    extractMemoryStoragePath(legacyUrl, supabaseUrl),
    "user-memories/legacy-photo.webp"
  );

  // Wrong bucket
  assert.equal(
    extractMemoryStoragePath(
      "https://pmjozzpjcatryzdomimu.supabase.co/storage/v1/object/public/other-bucket/photo.webp",
      supabaseUrl
    ),
    null
  );

  // Wrong host
  assert.equal(
    extractMemoryStoragePath(
      "https://evil.example.com/storage/v1/object/public/sky-memories/user-memories/user-1/a.webp",
      supabaseUrl
    ),
    null
  );

  // Path traversal attempt
  assert.equal(
    extractMemoryStoragePath(
      "https://pmjozzpjcatryzdomimu.supabase.co/storage/v1/object/public/sky-memories/user-memories/..%2Fsecret.webp",
      supabaseUrl
    ),
    null
  );

  // Non-URL string
  assert.equal(extractMemoryStoragePath("not-a-url", supabaseUrl), null);
});

test("createSignedMemoryUpload mints a user-scoped signed upload URL and public URL", async () => {
  let requestedPath = "";

  const result = await createSignedMemoryUpload({
    userId: "user-42",
    contentType: "image/webp",
    now: 1732051200000,
    randomId: "xyz9876",
    createSignedUploadUrl: async (path) => {
      requestedPath = path;
      return {
        data: { path, token: "signed-upload-token-123" },
        error: null,
      };
    },
    getPublicUrl: (path) =>
      `https://demo.supabase.co/storage/v1/object/public/${MEMORY_STORAGE_BUCKET}/${path}`,
  });

  assert.equal(requestedPath, "user-memories/user-42/1732051200000-xyz9876.webp");
  assert.equal(result.ok, true);
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, {
    bucket: "sky-memories",
    path: "user-memories/user-42/1732051200000-xyz9876.webp",
    token: "signed-upload-token-123",
    contentType: "image/webp",
    publicUrl:
      "https://demo.supabase.co/storage/v1/object/public/sky-memories/user-memories/user-42/1732051200000-xyz9876.webp",
  });
});

test("createSignedMemoryUpload rejects unsupported MIME types with 400", async () => {
  let called = false;

  const result = await createSignedMemoryUpload({
    userId: "user-42",
    contentType: "application/pdf",
    createSignedUploadUrl: async () => {
      called = true;
      return { data: null, error: null };
    },
    getPublicUrl: () => "",
  });

  assert.equal(called, false);
  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
});

test("createSignedMemoryUpload returns 500 when Supabase Storage signing fails", async () => {
  const result = await createSignedMemoryUpload({
    userId: "user-42",
    contentType: "image/webp",
    createSignedUploadUrl: async () => ({
      data: null,
      error: { message: "Bucket not found" },
    }),
    getPublicUrl: () => "",
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 500);
});

test("removeMemoryStorageObject deletes matching bucket object and enforces optional user prefix", async () => {
  const supabaseUrl = "https://demo.supabase.co";
  const removedBatches = [];

  const ok = await removeMemoryStorageObject({
    imageUrl:
      "https://demo.supabase.co/storage/v1/object/public/sky-memories/user-memories/user-42/photo.webp",
    supabaseUrl,
    requireUserId: "user-42",
    removeObjects: async (paths) => {
      removedBatches.push(paths);
      return { error: null };
    },
  });

  assert.equal(ok.attempted, true);
  assert.equal(ok.removed, true);
  assert.deepEqual(removedBatches, [["user-memories/user-42/photo.webp"]]);

  // Refuses deleting another user's object when requireUserId is set
  const blocked = await removeMemoryStorageObject({
    imageUrl:
      "https://demo.supabase.co/storage/v1/object/public/sky-memories/user-memories/other-user/photo.webp",
    supabaseUrl,
    requireUserId: "user-42",
    removeObjects: async (paths) => {
      removedBatches.push(paths);
      return { error: null };
    },
  });

  assert.equal(blocked.attempted, false);
  assert.equal(blocked.removed, false);
  assert.equal(removedBatches.length, 1);
});
