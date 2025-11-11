"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SpeechToStory } from "@/components/story/speech-to-story";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CreateWithVoicePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [genre, setGenre] = useState("fantasy");
  const [generating, setGenerating] = useState(false);
  const [spokenStory, setSpokenStory] = useState("");

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleStoryGenerated = async (text: string) => {
    setSpokenStory(text);
    setGenerating(true);

    try {
      const enhancedPrompt = `${text}

Please create a kid-friendly story based on what I just told you. Make sure to:
1. Keep all the characters I mentioned consistent throughout
2. Add exciting details and descriptions
3. Make it appropriate for children
4. Include dialogue and emotions
5. End with a positive message`;

      const response = await fetch("/api/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          genre,
          style: "descriptive",
          tone: "light",
          length: "medium",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const data = await response.json();

      toast({
        title: "Story Created! 🎉",
        description: "Your amazing story is ready!",
        variant: "success",
      });

      router.push(`/story/${data.story.id}`);
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Oops! 😅",
        description: "Something went wrong. Let's try again!",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text">
            🎤 Tell Your Story! 🎤
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Use your voice to create magical stories! 🌈✨
          </p>
        </div>

        <div className="space-y-6">
          <Card className="border-2 border-purple-300">
            <CardHeader>
              <CardTitle>Choose Your Story Type 📚</CardTitle>
              <CardDescription>
                What kind of adventure do you want to tell?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Story Genre</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger className="text-lg h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fantasy">🧙‍♂️ Fantasy Adventure</SelectItem>
                    <SelectItem value="sci-fi">🚀 Space Adventure</SelectItem>
                    <SelectItem value="adventure">🗺️ Treasure Hunt</SelectItem>
                    <SelectItem value="mystery">🔍 Mystery Detective</SelectItem>
                    <SelectItem value="animal">🦁 Animal Friends</SelectItem>
                    <SelectItem value="superhero">🦸‍♂️ Superhero Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <SpeechToStory onStoryGenerated={handleStoryGenerated} />

          {generating && (
            <Card className="bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-4xl mb-4 animate-bounce">✨</div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    Creating Your Amazing Story!
                  </p>
                  <p className="text-purple-800 dark:text-purple-200 mt-2">
                    Adding magic and bringing your characters to life... 🎨
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center border-2 border-green-300">
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-bold text-green-700 dark:text-green-300">Step 1</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Tell your story using your voice
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center border-2 border-blue-300">
              <div className="text-3xl mb-2">✨</div>
              <div className="font-bold text-blue-700 dark:text-blue-300">Step 2</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                AI adds magic & illustrations
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center border-2 border-purple-300">
              <div className="text-3xl mb-2">📖</div>
              <div className="font-bold text-purple-700 dark:text-purple-300">Step 3</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Share with family & friends!
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
