import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  MEMORY_STORAGE_BUCKET,
  createSignedMemoryUpload,
} from "@/lib/memoryStorage";

// POST /api/memories/upload-url - Mint a user-scoped signed upload URL for sky-memories
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json(
        { error: "Storage service is not configured on the server." },
        { status: 500 }
      );
    }

    let contentType = "image/webp";
    try {
      const body = await request.json();
      if (typeof body?.contentType === "string" && body.contentType.trim()) {
        contentType = body.contentType;
      }
    } catch {
      // Allow empty body and fall back to image/webp
    }

    const result = await createSignedMemoryUpload({
      userId: user.id,
      contentType,
      createSignedUploadUrl: (path) =>
        admin.storage.from(MEMORY_STORAGE_BUCKET).createSignedUploadUrl(path),
      getPublicUrl: (path) =>
        admin.storage.from(MEMORY_STORAGE_BUCKET).getPublicUrl(path).data.publicUrl,
    });

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Error creating signed upload URL:", error);
    return NextResponse.json(
      { error: "Internal server error preparing image upload" },
      { status: 500 }
    );
  }
}
