import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { generateCharacterDescription } from "@/lib/ai/gemini";
import { generateConsistentCharacterFal } from "@/lib/ai/fal";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { storyId, name, role, additionalDetails, generateImage } = body;

    if (!storyId || !name || !role) {
      return NextResponse.json(
        { error: "Story ID, name, and role are required" },
        { status: 400 }
      );
    }

    // Verify story ownership
    const story = await prisma.story.findFirst({
      where: {
        id: storyId,
        userId: session.user.id,
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Generate character description
    const characterData = await generateCharacterDescription({
      name,
      role,
      storyContext: story.description || "",
      additionalDetails,
    });

    let imageUrl = null;

    // Generate character image if requested
    if (generateImage && characterData.imagePrompt) {
      const imageResult = await generateConsistentCharacterFal({
        prompt: characterData.imagePrompt,
        style: story.style || "detailed illustration",
      });

      imageUrl = imageResult.data?.[0]?.url || imageResult.images?.[0]?.url;
    }

    // Save character to database
    const character = await prisma.character.create({
      data: {
        storyId: story.id,
        name,
        role,
        description: characterData.description || characterData.rawText || "",
        appearance: characterData.appearance,
        personality: characterData.personality,
        image: imageUrl,
        imagePrompt: characterData.imagePrompt,
      },
    });

    return NextResponse.json({ character });
  } catch (error) {
    console.error("Error generating character:", error);
    return NextResponse.json(
      { error: "Failed to generate character" },
      { status: 500 }
    );
  }
}
