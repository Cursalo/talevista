"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Image as ImageIcon, Sparkles, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { ExportButton } from "@/components/story/export-button";
import { ShareDialog } from "@/components/story/share-dialog";
import { NarrationPlayer } from "@/components/story/narration-player";
import { useToast } from "@/components/ui/use-toast";

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [story, setStory] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingChapter, setGeneratingChapter] = useState(false);
  const [chapterPrompt, setChapterPrompt] = useState("");
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchStoryData();
    }
  }, [status]);

  const fetchStoryData = async () => {
    try {
      const [storyRes, chaptersRes, charactersRes] = await Promise.all([
        fetch(`/api/story/${params.storyId}`),
        fetch(`/api/story/${params.storyId}/chapter`),
        fetch(`/api/story/${params.storyId}/characters`),
      ]);

      if (storyRes.ok) {
        const storyData = await storyRes.json();
        setStory(storyData.story);
      }

      if (chaptersRes.ok) {
        const chaptersData = await chaptersRes.json();
        setChapters(chaptersData.chapters || []);
      }

      if (charactersRes.ok) {
        const charactersData = await charactersRes.json();
        setCharacters(charactersData.characters || []);
      }
    } catch (error) {
      console.error("Error fetching story data:", error);
      toast({
        title: "Error",
        description: "Failed to load story data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateChapter = async () => {
    setGeneratingChapter(true);
    try {
      const response = await fetch(`/api/story/${params.storyId}/chapter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: chapterPrompt,
          chapterNumber: chapters.length + 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate chapter");
      }

      const data = await response.json();
      setChapters([...chapters, data.chapter]);
      setChapterPrompt("");
      setShowChapterForm(false);

      toast({
        title: "Success!",
        description: "Chapter generated successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error generating chapter:", error);
      toast({
        title: "Error",
        description: "Failed to generate chapter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingChapter(false);
    }
  };

  const handlePublish = async () => {
    try {
      const response = await fetch(`/api/story/${params.storyId}/publish`, {
        method: "POST",
      });

      if (response.ok) {
        setStory({ ...story, published: true });
        toast({
          title: "Published!",
          description: "Your story is now public",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish story",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading story...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Story not found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex gap-2">
            {!story.published && (
              <Button onClick={handlePublish} variant="default">
                Publish Story
              </Button>
            )}
            <ShareDialog
              storyId={story.id}
              storyTitle={story.title}
              storyDescription={story.description}
            />
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Collaborate
            </Button>
            <ExportButton storyId={story.id} storyTitle={story.title} />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{story.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {story.description}
              </p>
            </div>
            {story.published && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                Published
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {story.genre && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm capitalize">
                {story.genre}
              </span>
            )}
            {story.style && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm capitalize">
                {story.style}
              </span>
            )}
          </div>
        </div>

        {characters.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Characters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.map((character) => (
                  <div key={character.id} className="p-4 border rounded-lg">
                    {character.image && (
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <h3 className="font-semibold">{character.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                      {character.role}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Chapters ({chapters.length})
            </h2>
            <Button onClick={() => setShowChapterForm(!showChapterForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Chapter
            </Button>
          </div>

          {showChapterForm && (
            <Card>
              <CardHeader>
                <CardTitle>Generate New Chapter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe what should happen in this chapter... (optional)"
                  value={chapterPrompt}
                  onChange={(e) => setChapterPrompt(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateChapter}
                    disabled={generatingChapter}
                  >
                    {generatingChapter ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Chapter
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowChapterForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {chapters.length === 0 ? (
            <Card className="p-12 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold mb-2">No chapters yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Start writing your story by generating the first chapter
              </p>
              <Button onClick={() => setShowChapterForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Generate First Chapter
              </Button>
            </Card>
          ) : (
            chapters.map((chapter) => (
              <Card key={chapter.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Chapter {chapter.order}
                      </div>
                      <CardTitle>{chapter.title}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedChapter(
                          expandedChapter === chapter.id ? null : chapter.id
                        )
                      }
                    >
                      {expandedChapter === chapter.id ? "Hide" : "Show"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {chapter.image && (
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}

                  {expandedChapter === chapter.id && (
                    <>
                      <div className="prose dark:prose-invert max-w-none mb-6">
                        <p className="whitespace-pre-wrap">{chapter.content}</p>
                      </div>

                      {/* Voice Narration */}
                      <div className="mt-6">
                        <NarrationPlayer
                          text={chapter.content}
                          chapterId={chapter.id}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
