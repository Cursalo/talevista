import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export interface ImageGenerationParams {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numOutputs?: number;
  style?: string;
}

export async function generateImage(params: ImageGenerationParams) {
  try {
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: params.prompt,
          negative_prompt: params.negativePrompt || "ugly, distorted, blurry, low quality",
          width: params.width || 1024,
          height: params.height || 1024,
          num_outputs: params.numOutputs || 1,
          scheduler: "K_EULER",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          refine: "expert_ensemble_refiner",
          high_noise_frac: 0.8,
        },
      }
    );

    return output;
  } catch (error) {
    console.error("Error generating image with Replicate:", error);
    throw error;
  }
}

export async function generateConsistentCharacter(params: {
  prompt: string;
  referenceImage?: string;
  style?: string;
}) {
  try {
    // Using SDXL with specific prompting for character consistency
    const consistencyPrompt = `${params.prompt}, consistent character design, character sheet, reference sheet, ${params.style || "detailed digital art"}`;

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: consistencyPrompt,
          negative_prompt: "multiple people, inconsistent design, varying appearance, ugly, distorted",
          width: 1024,
          height: 1024,
          num_outputs: 1,
          guidance_scale: 8,
          num_inference_steps: 40,
        },
      }
    );

    return output;
  } catch (error) {
    console.error("Error generating consistent character:", error);
    throw error;
  }
}

export async function enhanceImage(imageUrl: string) {
  try {
    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: imageUrl,
          scale: 2,
          face_enhance: true,
        },
      }
    );

    return output;
  } catch (error) {
    console.error("Error enhancing image:", error);
    throw error;
  }
}
