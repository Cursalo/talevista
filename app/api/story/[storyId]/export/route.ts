import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const story = await prisma.story.findFirst({
      where: {
        id: params.storyId,
        userId: session.user.id,
      },
      include: {
        chapters: {
          orderBy: {
            order: 'asc',
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const exportData = {
      title: story.title,
      description: story.description,
      author: story.user.name || 'Anonymous',
      coverImage: story.coverImage,
      chapters: story.chapters.map(ch => ({
        title: ch.title,
        content: ch.content,
        image: ch.image,
      })),
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error("Error exporting story:", error);
    return NextResponse.json(
      { error: "Failed to export story" },
      { status: 500 }
    );
  }
}
