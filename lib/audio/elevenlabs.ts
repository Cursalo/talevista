// ElevenLabs Text-to-Speech integration
export interface VoiceOptions {
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export const AVAILABLE_VOICES = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel - Calm Female" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi - Strong Female" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella - Soft Female" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni - Well-Rounded Male" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli - Emotional Female" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh - Deep Male" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold - Crisp Male" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam - Narrative Male" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam - Dynamic Male" },
];

export async function generateSpeech(
  text: string,
  options: VoiceOptions = { voiceId: "21m00Tcm4TlvDq8ikWAM" }
): Promise<ArrayBuffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error("ElevenLabs API key not configured");
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${options.voiceId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: options.stability ?? 0.5,
        similarity_boost: options.similarityBoost ?? 0.75,
        style: options.style ?? 0,
        use_speaker_boost: options.useSpeakerBoost ?? true,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  return await response.arrayBuffer();
}

export async function generateChapterAudio(
  chapterText: string,
  voiceId: string = "21m00Tcm4TlvDq8ikWAM"
): Promise<ArrayBuffer> {
  // Split long text into chunks if needed (ElevenLabs has character limits)
  const maxChars = 5000;

  if (chapterText.length <= maxChars) {
    return await generateSpeech(chapterText, { voiceId });
  }

  // For longer texts, we'd need to split and combine
  // This is a simplified version
  const truncated = chapterText.substring(0, maxChars);
  return await generateSpeech(truncated, { voiceId });
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
