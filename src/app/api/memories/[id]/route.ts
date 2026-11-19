import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  MEMORY_STORAGE_BUCKET,
  removeMemoryStorageObject,
} from "@/lib/memoryStorage";
import { getConstellationAndNode } from "@/lib/dateDistributor";

// PATCH /api/memories/[id] - Update caption, location, or memoryDate
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.memory.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Memory not found or you don't have permission to edit it." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { location, caption, memoryDate } = body;

    const updateData: {
      location?: string | null;
      caption?: string;
      memoryDate?: Date;
      constellationId?: string;
      nodeIndex?: number;
    } = {};

    if (location !== undefined) {
      updateData.location = location || null;
    }

    if (caption !== undefined) {
      updateData.caption = caption.trim();
    }

    if (memoryDate) {
      const targetDate = new Date(memoryDate);
      if (!isNaN(targetDate.getTime())) {
        const mapping = getConstellationAndNode(targetDate);
        updateData.memoryDate = targetDate;
        updateData.constellationId = mapping.constellation.id;
        updateData.nodeIndex = mapping.nodeIndex;
      }
    }

    const updated = await prisma.memory.update({
      where: {
        id,
      },
      data: updateData,
    });

    return NextResponse.json({ memory: updated });
  } catch (error) {
    console.error("Error updating memory:", error);
    return NextResponse.json(
      { error: "Internal server error updating memory" },
      { status: 500 }
    );
  }
}

// DELETE /api/memories/[id] - Delete a memory
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.memory.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Memory not found or permission denied" },
        { status: 404 }
      );
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    });

    const admin = createAdminClient();
    if (admin) {
      const cleanup = await removeMemoryStorageObject({
        imageUrl: existing.imageUrl,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        removeObjects: (paths) =>
          admin.storage.from(MEMORY_STORAGE_BUCKET).remove(paths),
      });
      if (cleanup.attempted && !cleanup.removed) {
        console.warn("Storage cleanup warning after memory deletion:", cleanup.error);
      }
    }

    return NextResponse.json({ success: true, message: "Memory deleted successfully." });
  } catch (error) {
    console.error("Error deleting memory:", error);
    return NextResponse.json(
      { error: "Internal server error deleting memory" },
      { status: 500 }
    );
  }
}
