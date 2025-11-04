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

    const { storyId } = params;

    // Check if already liked
    const existingLike = await prisma.storyLike.findUnique({
      where: {
        storyId_userId: {
          storyId,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.storyLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      await prisma.story.update({
        where: { id: storyId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({ liked: false });
    } else {
      // Like
      await prisma.storyLike.create({
        data: {
          storyId,
          userId: session.user.id,
        },
      });

      await prisma.story.update({
        where: { id: storyId },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
