import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getConstellationAndNode } from "@/lib/dateDistributor";

// GET /api/memories - Fetch memories for authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const constellationId = searchParams.get("constellationId");
    const nodeIndexParam = searchParams.get("nodeIndex");

    const whereClause: {
      userId: string;
      constellationId?: string;
      nodeIndex?: number;
    } = {
      userId: user.id,
    };

    if (constellationId) {
      whereClause.constellationId = constellationId;
    }

    if (nodeIndexParam !== null && nodeIndexParam !== undefined && nodeIndexParam !== "") {
      whereClause.nodeIndex = parseInt(nodeIndexParam, 10);
    }

    const memories = await prisma.memory.findMany({
      where: whereClause,
      orderBy: {
        memoryDate: "desc",
      },
    });

    return NextResponse.json({ memories });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return NextResponse.json(
      { error: "Internal server error fetching memories" },
      { status: 500 }
    );
  }
}

// POST /api/memories - Save a memory with auto-assigned constellation & node
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

    const body = await request.json();
    const { imageUrl, memoryDate, location, caption } = body;

    if (!imageUrl || !memoryDate || !caption) {
      return NextResponse.json(
        { error: "Missing required fields: imageUrl, memoryDate, and caption are required." },
        { status: 400 }
      );
    }

    const targetDate = new Date(memoryDate);
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json({ error: "Invalid memoryDate format." }, { status: 400 });
    }

    // Determine constellation and node according to single source of truth algorithm
    const mapping = getConstellationAndNode(targetDate);

    const newMemory = await prisma.memory.create({
      data: {
        userId: user.id,
        constellationId: mapping.constellation.id,
        nodeIndex: mapping.nodeIndex,
        memoryDate: targetDate,
        location: location || null,
        caption: caption.trim(),
        imageUrl: imageUrl.trim(),
      },
    });

    return NextResponse.json({ memory: newMemory, mapping }, { status: 201 });
  } catch (error) {
    console.error("Error creating memory:", error);
    return NextResponse.json(
      { error: "Internal server error creating memory" },
      { status: 500 }
    );
  }
}
