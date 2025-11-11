"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Sparkles, Image as ImageIcon, Volume2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LiveStorybookProps {
  onComplete: (story: { text: string; scenes: any[] }) => void;
}

export function LiveStorybook({ onComplete }: LiveStorybookProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [scenes, setScenes] = useState<any[]>([]);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [encouragement, setEncouragement] = useState("Ready to tell your story? 🌟");
  const [characters, setCharacters] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);
  const lastGeneratedLength = useRef(0);
  const { toast } = useToast();

  const encouragements = [
    "Wow! I'm drawing that scene! 🎨",
    "This is amazing! What happens next? ✨",
    "Your story is magical! Keep going! 🌈",
    "I love your imagination! 🦄",
    "Bringing your words to life! 🎪",
    "You're an incredible storyteller! ⭐",
    "Creating the pictures now! 🖼️",
    "This adventure is so exciting! 🚀",
  ];

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript + " ";
          } else {
            interim += result[0].transcript;
          }
        }

        if (final) {
          const newText = transcript + final;
          setTranscript(newText);

          // Generate image every 50-100 words
          const wordCount = newText.split(" ").length;
          if (wordCount - lastGeneratedLength.current >= 50 && !generatingImage) {
            generateSceneImage(newText);
            lastGeneratedLength.current = wordCount;
          }

          // Extract character names (simple detection)
          detectCharacters(final);

          // Show encouragement
          if (Math.random() > 0.5) {
            const randomEncouragement =
              encouragements[Math.floor(Math.random() * encouragements.length)];
            setEncouragement(randomEncouragement);
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== "no-speech") {
          console.error("Speech recognition error:", event.error);
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }
  }, [isListening, transcript, generatingImage]);

  const detectCharacters = (text: string) => {
    // Simple character detection - look for capitalized names
    const words = text.split(" ");
    const potentialNames = words.filter((word) => {
      const cleaned = word.replace(/[^a-zA-Z]/g, "");
      return (
        cleaned.length > 2 &&
        cleaned[0] === cleaned[0].toUpperCase() &&
        cleaned.slice(1) === cleaned.slice(1).toLowerCase()
      );
    });

    potentialNames.forEach((name) => {
      if (!characters.includes(name) && characters.length < 5) {
        setCharacters((prev) => [...prev, name]);
        toast({
          title: `New Character! 🎭`,
          description: `${name} joined your story!`,
          variant: "success",
        });
      }
    });
  };

  const generateSceneImage = async (text: string) => {
    setGeneratingImage(true);

    try {
      // Get the last 100 words for context
      const words = text.split(" ");
      const recentText = words.slice(-100).join(" ");

      const imagePrompt = `A colorful, kid-friendly storybook illustration of: ${recentText}.
      ${characters.length > 0 ? `Characters: ${characters.join(", ")}. ` : ""}
      Style: vibrant, cheerful, animated Disney/Pixar style, child-appropriate, whimsical`;

      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          provider: "fal", // Use fal.ai for speed
          style: "storybook illustration",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl =
          data.result?.data?.[0]?.url ||
          data.result?.images?.[0]?.url ||
          data.result?.[0];

        if (imageUrl) {
          setScenes((prev) => [
            ...prev,
            {
              text: recentText,
              image: imageUrl,
              timestamp: Date.now(),
            },
          ]);
          setCurrentScene((prev) => prev + 1);

          toast({
            title: "New Scene Created! 🎨",
            description: "Your story is coming to life!",
            variant: "success",
          });
        }
      }
    } catch (error) {
      console.error("Error generating scene:", error);
    } finally {
      setGeneratingImage(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setTranscript("");
      setScenes([]);
      setCharacters([]);
      setEncouragement("I'm listening! Start your adventure! 🎤");
      recognitionRef.current.start();

      toast({
        title: "🎤 Recording Started!",
        description: "Tell your magical story!",
        variant: "success",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
      setEncouragement("Your storybook is ready! ✨");
    }
  };

  const handleComplete = () => {
    onComplete({ text: transcript, scenes });
  };

  return (
    <div className="space-y-6">
      <Card className="border-4 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
            Live Storybook Creator! 📚
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-white rounded-lg border-2 border-dashed border-purple-300">
            <p className="text-3xl font-bold text-purple-600 mb-2 animate-bounce">
              {encouragement}
            </p>
            {generatingImage && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <ImageIcon className="w-5 h-5 animate-spin" />
                <span>Creating picture...</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!isListening ? (
              <Button
                onClick={startListening}
                className="flex-1 h-16 text-lg bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Mic className="w-6 h-6 mr-2" />
                Start My Story! 🎤
              </Button>
            ) : (
              <>
                <Button
                  onClick={stopListening}
                  variant="destructive"
                  className="flex-1 h-16 text-lg"
                >
                  <MicOff className="w-6 h-6 mr-2" />
                  Finish Story 🛑
                </Button>
                {transcript && (
                  <Button
                    onClick={() => generateSceneImage(transcript)}
                    disabled={generatingImage}
                    variant="outline"
                    className="h-16"
                  >
                    <ImageIcon className="w-6 h-6" />
                  </Button>
                )}
              </>
            )}
          </div>

          {characters.length > 0 && (
            <div className="p-4 bg-yellow-100 rounded-lg">
              <div className="font-bold text-yellow-800 mb-2">
                🎭 Characters in Your Story:
              </div>
              <div className="flex flex-wrap gap-2">
                {characters.map((char, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}

          {transcript && (
            <div className="p-4 bg-white rounded-lg min-h-[100px]">
              <div className="text-sm text-gray-500 mb-2">
                📝 {transcript.split(" ").length} words | 🖼️ {scenes.length} scenes
              </div>
              <p className="text-lg leading-relaxed">
                {transcript}
                {isListening && <span className="animate-pulse">|</span>}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {scenes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Story is Coming to Life! 🎨</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {scenes.map((scene, idx) => (
                <div
                  key={idx}
                  className="border-2 border-purple-300 rounded-lg overflow-hidden bg-white"
                >
                  <img
                    src={scene.image}
                    alt={`Scene ${idx + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <div className="text-xs text-purple-600 font-bold mb-1">
                      Scene {idx + 1}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {scene.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {!isListening && transcript && (
              <Button
                onClick={handleComplete}
                className="w-full mt-4 h-12 text-lg bg-gradient-to-r from-green-500 to-blue-500"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Save My Storybook! 📖
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
