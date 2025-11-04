import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { generateChapter } from "@/lib/ai/gemini";
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
    const body = await req.json();
    const { prompt, chapterNumber } = body;

    // Verify story ownership
    const story = await prisma.story.findFirst({
      where: {
        id: storyId,
        userId: session.user.id,
      },
      include: {
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

    // Get previous chapters
    const previousChapters = story.chapters.map(
      (ch) => `Chapter ${ch.order}: ${ch.summary || ch.content.substring(0, 200)}`
    );

    // Generate new chapter
    const chapterData = await generateChapter({
      storyContext: story.description || "",
      previousChapters,
      characters: story.characters.map((ch) => ch.name),
      chapterNumber: chapterNumber || story.chapters.length + 1,
      prompt,
    });

    // Save chapter to database
    const chapter = await prisma.chapter.create({
      data: {
        storyId: story.id,
        title: chapterData.title || `Chapter ${chapterNumber}`,
        content: chapterData.content || chapterData.rawText || "",
        summary: chapterData.summary,
        order: chapterNumber || story.chapters.length + 1,
        imagePrompt: chapterData.imagePrompt,
      },
    });

    return NextResponse.json({
      chapter,
      keyScenes: chapterData.keyScenes,
    });
  } catch (error) {
    console.error("Error generating chapter:", error);
    return NextResponse.json(
      { error: "Failed to generate chapter" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { storyId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storyId } = params;

    const chapters = await prisma.chapter.findMany({
      where: {
        storyId,
        story: {
          userId: session.user.id,
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}
