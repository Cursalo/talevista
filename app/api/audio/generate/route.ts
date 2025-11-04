import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { generateChapterAudio, arrayBufferToBase64 } from "@/lib/audio/elevenlabs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, voiceId } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const audioBuffer = await generateChapterAudio(text, voiceId);
    const base64Audio = arrayBufferToBase64(audioBuffer);

    return NextResponse.json({
      audio: `data:audio/mpeg;base64,${base64Audio}`,
    });
  } catch (error) {
    console.error("Error generating audio:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
