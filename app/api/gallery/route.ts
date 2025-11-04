import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre") || "all";
    const sortBy = searchParams.get("sortBy") || "trending";

    const where: any = {
      published: true,
      visibility: "public",
    };

    if (genre !== "all") {
      where.genre = genre;
    }

    let orderBy: any = {};

    switch (sortBy) {
      case "recent":
        orderBy = { createdAt: "desc" };
        break;
      case "popular":
        orderBy = { views: "desc" };
        break;
      case "liked":
        orderBy = { likes: "desc" };
        break;
      case "trending":
      default:
        // Trending: combination of recent views and likes
        orderBy = [{ likes: "desc" }, { views: "desc" }];
        break;
    }

    const stories = await prisma.story.findMany({
      where,
      orderBy,
      take: 50,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            chapters: true,
          },
        },
      },
    });

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Error fetching gallery stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
