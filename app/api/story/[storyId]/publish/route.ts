import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";

export async function POST(
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
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const updatedStory = await prisma.story.update({
      where: { id: params.storyId },
      data: {
        published: true,
        visibility: "public",
        status: "published",
      },
    });

    return NextResponse.json({ story: updatedStory });
  } catch (error) {
    console.error("Error publishing story:", error);
    return NextResponse.json(
      { error: "Failed to publish story" },
      { status: 500 }
    );
  }
}
