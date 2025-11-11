"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Eye, Share2 } from "lucide-react";
import Link from "next/link";
import { ShareDialog } from "@/components/story/share-dialog";

export default function PublicStoryPage() {
  const params = useParams();
  const [story, setStory] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchStoryData();
  }, []);

  const fetchStoryData = async () => {
    try {
      const response = await fetch(`/api/story/${params.storyId}/public`);
      const data = await response.json();

      setStory(data.story);
      setChapters(data.chapters || []);
      setCharacters(data.characters || []);
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await fetch(`/api/story/${params.storyId}/like`, {
        method: "POST",
      });
      setLiked(!liked);
      setStory({ ...story, likes: liked ? story.likes - 1 : story.likes + 1 });
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Story not found</h1>
          <Link href="/gallery">
            <Button>Browse Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/gallery" className="inline-flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              {story.views}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="w-4 h-4" />
              {story.likes}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          {story.coverImage && (
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-80 object-cover rounded-lg mb-6"
            />
          )}

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{story.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-4">
                {story.user?.image && (
                  <img
                    src={story.user.image}
                    alt={story.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>by {story.user?.name || "Anonymous"}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {story.description}
              </p>
              <div className="flex gap-2 mb-4">
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
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleLike}
              variant={liked ? "default" : "outline"}
              className="flex-1"
            >
              <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
              {liked ? "Liked" : "Like"}
            </Button>
            <ShareDialog
              storyId={story.id}
              storyTitle={story.title}
              storyDescription={story.description}
            />
          </div>
        </div>

        {characters.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Characters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {characters.map((character: any) => (
                  <div key={character.id} className="text-center">
                    {character.image && (
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <h3 className="font-semibold">{character.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{character.role}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Story</h2>
          {chapters.map((chapter: any) => (
            <Card key={chapter.id}>
              <CardHeader>
                <div className="text-sm text-gray-500 mb-1">
                  Chapter {chapter.order}
                </div>
                <CardTitle>{chapter.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {chapter.image && (
                  <img
                    src={chapter.image}
                    alt={chapter.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{chapter.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
