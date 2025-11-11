"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LiveStorybook } from "@/components/story/live-storybook";
import { useToast } from "@/components/ui/use-toast";

export default function LiveStorybookPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleComplete = async (storyData: { text: string; scenes: any[] }) => {
    setSaving(true);

    try {
      // Create the story
      const storyResponse = await fetch("/api/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: storyData.text,
          genre: "adventure",
          style: "kid-friendly",
          tone: "light",
          length: "medium",
        }),
      });

      if (!storyResponse.ok) {
        throw new Error("Failed to create story");
      }

      const { story } = await storyResponse.json();

      // Save scenes as chapters
      for (let i = 0; i < storyData.scenes.length; i++) {
        const scene = storyData.scenes[i];
        await fetch(`/api/story/${story.id}/chapter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `Scene ${i + 1}`,
            content: scene.text,
            order: i + 1,
            image: scene.image,
          }),
        });
      }

      toast({
        title: "Storybook Saved! 🎉",
        description: "Your amazing storybook is ready to share!",
        variant: "success",
      });

      router.push(`/story/${story.id}`);
    } catch (error) {
      console.error("Error saving storybook:", error);
      toast({
        title: "Oops! 😅",
        description: "Couldn't save your story. Let's try again!",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 via-blue-100 to-green-100">
      <nav className="border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">📚✨</div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 via-blue-600 to-green-600 text-transparent bg-clip-text">
            Live Storybook!
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            Tell your story and watch it come to life! 🎨
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            As you speak, magical pictures will appear to show your story!
            Perfect for young storytellers! 🌈
          </p>
        </div>

        <LiveStorybook onComplete={handleComplete} />

        {saving && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center max-w-md">
              <div className="text-6xl mb-4 animate-bounce">✨</div>
              <h2 className="text-2xl font-bold mb-2">Saving Your Storybook!</h2>
              <p className="text-gray-600">Adding final touches...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
