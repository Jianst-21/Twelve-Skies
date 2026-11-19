import crypto from "node:crypto";

export const MEMORY_STORAGE_BUCKET = "sky-memories";
export const MEMORY_STORAGE_PREFIX = "user-memories";

export interface NormalizedImageType {
  contentType: "image/webp" | "image/jpeg" | "image/png";
  extension: "webp" | "jpg" | "png";
}

const SAFE_USER_ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

export function normalizeImageContentType(
  rawContentType: string | null | undefined
): NormalizedImageType | null {
  if (!rawContentType) return null;
  const normalized = rawContentType.trim().toLowerCase().split(";")[0]?.trim();

  switch (normalized) {
    case "image/webp":
      return { contentType: "image/webp", extension: "webp" };
    case "image/jpeg":
    case "image/jpg":
      return { contentType: "image/jpeg", extension: "jpg" };
    case "image/png":
      return { contentType: "image/png", extension: "png" };
    default:
      return null;
  }
}

export function buildMemoryStoragePath(
  userId: string,
  extension: NormalizedImageType["extension"],
  options?: { now?: number; randomId?: string }
): string {
  const trimmedUserId = userId.trim();
  if (!SAFE_USER_ID_PATTERN.test(trimmedUserId)) {
    throw new Error("Invalid userId for storage path.");
  }

  const timestamp = options?.now ?? Date.now();
  const randomId = options?.randomId ?? crypto.randomBytes(6).toString("hex");
  return `${MEMORY_STORAGE_PREFIX}/${trimmedUserId}/${timestamp}-${randomId}.${extension}`;
}

export function extractMemoryStoragePath(
  imageUrl: string,
  supabaseUrl?: string
): string | null {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  let parsed: URL;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return null;
  }

  if (supabaseUrl) {
    try {
      const expectedHost = new URL(supabaseUrl).host;
      if (parsed.host !== expectedHost) {
        return null;
      }
    } catch {
      return null;
    }
  }

  const publicPrefix = `/storage/v1/object/public/${MEMORY_STORAGE_BUCKET}/`;
  if (!parsed.pathname.startsWith(publicPrefix)) {
    return null;
  }

  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(parsed.pathname.slice(publicPrefix.length));
  } catch {
    return null;
  }

  if (
    !decodedPath ||
    decodedPath.startsWith("/") ||
    decodedPath.includes("..") ||
    decodedPath.includes("\\")
  ) {
    return null;
  }

  return decodedPath;
}

export interface SignedMemoryUploadResult {
  ok: boolean;
  status: number;
  body:
    | {
        bucket: string;
        path: string;
        token: string;
        contentType: string;
        publicUrl: string;
      }
    | { error: string };
}

export async function createSignedMemoryUpload(params: {
  userId: string;
  contentType: string | null | undefined;
  createSignedUploadUrl: (path: string) => Promise<{
    data: { path: string; token: string } | null;
    error: { message: string } | null;
  }>;
  getPublicUrl: (path: string) => string;
  now?: number;
  randomId?: string;
}): Promise<SignedMemoryUploadResult> {
  const normalized = normalizeImageContentType(params.contentType);
  if (!normalized) {
    return {
      ok: false,
      status: 400,
      body: {
        error: "Unsupported image format. Allowed types: WebP, JPEG, PNG.",
      },
    };
  }

  let path: string;
  try {
    path = buildMemoryStoragePath(params.userId, normalized.extension, {
      now: params.now,
      randomId: params.randomId,
    });
  } catch {
    return {
      ok: false,
      status: 400,
      body: { error: "Invalid authenticated user identifier." },
    };
  }

  const { data, error } = await params.createSignedUploadUrl(path);
  if (error || !data?.token || !data?.path) {
    return {
      ok: false,
      status: 500,
      body: {
        error: error?.message
          ? `Failed to prepare storage upload: ${error.message}`
          : "Failed to prepare storage upload.",
      },
    };
  }

  return {
    ok: true,
    status: 200,
    body: {
      bucket: MEMORY_STORAGE_BUCKET,
      path: data.path,
      token: data.token,
      contentType: normalized.contentType,
      publicUrl: params.getPublicUrl(data.path),
    },
  };
}

export async function removeMemoryStorageObject(params: {
  imageUrl: string;
  supabaseUrl?: string;
  requireUserId?: string;
  removeObjects: (paths: string[]) => Promise<{ error: { message: string } | null }>;
}): Promise<{
  attempted: boolean;
  removed: boolean;
  path: string | null;
  error?: string;
}> {
  const objectPath = extractMemoryStoragePath(params.imageUrl, params.supabaseUrl);
  if (!objectPath) {
    return { attempted: false, removed: false, path: null };
  }

  if (params.requireUserId) {
    const requiredPrefix = `${MEMORY_STORAGE_PREFIX}/${params.requireUserId}/`;
    if (!objectPath.startsWith(requiredPrefix)) {
      return { attempted: false, removed: false, path: objectPath };
    }
  }

  try {
    const { error } = await params.removeObjects([objectPath]);
    if (error) {
      return {
        attempted: true,
        removed: false,
        path: objectPath,
        error: error.message,
      };
    }
    return { attempted: true, removed: true, path: objectPath };
  } catch (err) {
    return {
      attempted: true,
      removed: false,
      path: objectPath,
      error: err instanceof Error ? err.message : "Unknown storage delete error",
    };
  }
}
