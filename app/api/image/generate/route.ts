import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { generateImageFast } from "@/lib/ai/fal";
import { generateImage } from "@/lib/ai/replicate";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, provider, style, width, height } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    let result;

    if (provider === "replicate") {
      result = await generateImage({
        prompt: `${prompt}${style ? `, ${style}` : ", storybook illustration style"}`,
        width: width || 1024,
        height: height || 1024,
      });
    } else {
      // Default to fal.ai for faster generation
      result = await generateImageFast({
        prompt: `${prompt}${style ? `, ${style}` : ", storybook illustration style"}`,
        imageSize: "square_hd",
      });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
