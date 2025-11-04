import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { generateStoryIdea } from "@/lib/ai/gemini";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { genre, style, setting, tone, length, prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Generate story idea
    const storyIdea = await generateStoryIdea({
      genre,
      style,
      setting,
      tone,
      length,
      prompt,
    });

    // Create story in database
    const story = await prisma.story.create({
      data: {
        userId: session.user.id,
        title: storyIdea.title || "Untitled Story",
        description: storyIdea.summary || prompt,
        genre,
        style,
        status: "draft",
      },
    });

    return NextResponse.json({
      story,
      storyIdea,
    });
  } catch (error) {
    console.error("Error generating story:", error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
}
