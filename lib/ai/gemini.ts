import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface StoryGenerationParams {
  genre?: string;
  style?: string;
  characters?: string[];
  setting?: string;
  tone?: string;
  length?: "short" | "medium" | "long";
  prompt: string;
}

export interface ChapterGenerationParams {
  storyContext: string;
  previousChapters?: string[];
  characters: string[];
  chapterNumber: number;
  prompt?: string;
}

export async function generateStoryIdea(params: StoryGenerationParams) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate a creative story idea with the following parameters:
Genre: ${params.genre || "any"}
Style: ${params.style || "engaging"}
Setting: ${params.setting || "interesting"}
Tone: ${params.tone || "balanced"}
Length: ${params.length || "medium"}
Additional prompt: ${params.prompt}

Provide a detailed story outline including:
1. Title
2. Brief summary (2-3 sentences)
3. Main plot points
4. Character suggestions
5. Key themes

Format the response as JSON with keys: title, summary, plotPoints (array), characters (array), themes (array)`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { rawText: text };
  } catch (error) {
    console.error("Error generating story idea:", error);
    throw error;
  }
}

export async function generateChapter(params: ChapterGenerationParams) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Write chapter ${params.chapterNumber} of a story with the following context:

Story Context: ${params.storyContext}

Characters: ${params.characters.join(", ")}

${params.previousChapters && params.previousChapters.length > 0 ?
  `Previous chapters summary:\n${params.previousChapters.join("\n\n")}` :
  "This is the first chapter."}

${params.prompt ? `Additional instructions: ${params.prompt}` : ""}

Write an engaging chapter that:
1. Continues the story naturally
2. Develops the characters
3. Advances the plot
4. Includes vivid descriptions suitable for illustration
5. Ends with a hook for the next chapter

Provide the response as JSON with keys:
- title: Chapter title
- content: Full chapter text (500-1000 words)
- summary: Brief summary (2-3 sentences)
- keyScenes: Array of 2-3 key scenes that could be illustrated with brief descriptions
- imagePrompt: A detailed prompt for generating a chapter cover image`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { rawText: text };
  } catch (error) {
    console.error("Error generating chapter:", error);
    throw error;
  }
}

export async function improveText(text: string, instruction: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Improve the following text based on this instruction: ${instruction}

Original text:
${text}

Provide the improved version maintaining the same general structure and length.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error improving text:", error);
    throw error;
  }
}

export async function generateCharacterDescription(params: {
  name: string;
  role: string;
  storyContext: string;
  additionalDetails?: string;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Create a detailed character description for a story character:

Name: ${params.name}
Role: ${params.role}
Story Context: ${params.storyContext}
${params.additionalDetails ? `Additional Details: ${params.additionalDetails}` : ""}

Provide a JSON response with:
- description: Overall character description (2-3 paragraphs)
- appearance: Physical appearance details
- personality: Personality traits and mannerisms
- background: Brief background story
- imagePrompt: Detailed prompt for generating a character portrait image (be specific about clothing, features, setting)`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { rawText: text };
  } catch (error) {
    console.error("Error generating character:", error);
    throw error;
  }
}
