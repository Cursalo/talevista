import * as fal from "@fal-ai/serverless-client";

fal.config({
  credentials: process.env.FAL_KEY || "",
});

export interface FalImageParams {
  prompt: string;
  imageSize?: "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9";
  numImages?: number;
  style?: string;
}

export async function generateImageFast(params: FalImageParams) {
  try {
    const result = await fal.subscribe("fal-ai/fast-sdxl", {
      input: {
        prompt: params.prompt,
        image_size: params.imageSize || "square_hd",
        num_images: params.numImages || 1,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Image generation in progress...");
        }
      },
    });

    return result;
  } catch (error) {
    console.error("Error generating image with fal.ai:", error);
    throw error;
  }
}

export async function generateConsistentCharacterFal(params: {
  prompt: string;
  characterReference?: string;
  style?: string;
}) {
  try {
    const stylePrompt = params.style ? `, ${params.style}` : ", detailed illustration, character design";
    const fullPrompt = `${params.prompt}${stylePrompt}, consistent character, professional character art`;

    const result = await fal.subscribe("fal-ai/fast-sdxl", {
      input: {
        prompt: fullPrompt,
        image_size: "portrait_4_3",
        num_images: 1,
        negative_prompt: "inconsistent, multiple characters, varying appearance, ugly, distorted, blurry",
      },
    });

    return result;
  } catch (error) {
    console.error("Error generating character with fal.ai:", error);
    throw error;
  }
}

export async function generateSceneIllustration(params: {
  sceneDescription: string;
  style?: string;
  characters?: string[];
}) {
  try {
    let prompt = params.sceneDescription;

    if (params.characters && params.characters.length > 0) {
      prompt += ` featuring ${params.characters.join(", ")}`;
    }

    if (params.style) {
      prompt += `, ${params.style}`;
    }

    prompt += ", detailed illustration, storybook art, professional digital art";

    const result = await fal.subscribe("fal-ai/fast-sdxl", {
      input: {
        prompt: prompt,
        image_size: "landscape_16_9",
        num_images: 1,
        negative_prompt: "ugly, distorted, blurry, low quality, text, watermark",
      },
    });

    return result;
  } catch (error) {
    console.error("Error generating scene illustration:", error);
    throw error;
  }
}

// Fast Lightning model for quick generations
export async function generateImageLightning(prompt: string) {
  try {
    const result = await fal.subscribe("fal-ai/fast-lightning-sdxl", {
      input: {
        prompt: prompt,
        image_size: "square_hd",
      },
    });

    return result;
  } catch (error) {
    console.error("Error generating lightning image:", error);
    throw error;
  }
}
