import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  try {
    const story = await prisma.story.findFirst({
      where: {
        id: params.storyId,
        published: true,
        visibility: "public",
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        chapters: {
          orderBy: {
            order: "asc",
          },
        },
        characters: true,
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Increment view count
    await prisma.story.update({
      where: { id: params.storyId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      story,
      chapters: story.chapters,
      characters: story.characters,
    });
  } catch (error) {
    console.error("Error fetching public story:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}
