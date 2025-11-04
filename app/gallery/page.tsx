"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Heart, Search, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GalleryPage() {
  const router = useRouter();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("trending");

  useEffect(() => {
    fetchStories();
  }, [selectedGenre, sortBy]);

  const fetchStories = async () => {
    try {
      const params = new URLSearchParams({
        genre: selectedGenre,
        sortBy,
      });

      const response = await fetch(`/api/gallery?${params}`);
      const data = await response.json();
      setStories(data.stories || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLike = async (storyId: string) => {
    try {
      await fetch(`/api/story/${storyId}/like`, {
        method: "POST",
      });
      fetchStories();
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-600">
            TaleVista
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="outline">My Stories</Button>
            </Link>
            <Link href="/story/create">
              <Button>Create Story</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Community Gallery</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover amazing AI-generated stories from the community
          </p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              <SelectItem value="fantasy">Fantasy</SelectItem>
              <SelectItem value="sci-fi">Sci-Fi</SelectItem>
              <SelectItem value="mystery">Mystery</SelectItem>
              <SelectItem value="romance">Romance</SelectItem>
              <SelectItem value="horror">Horror</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </div>
              </SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="liked">Most Liked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg">Loading stories...</div>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-lg mb-2">No stories found</div>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {story.coverImage && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full capitalize">
                      {story.genre}
                    </span>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {story.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {story.likes}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{story.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {story.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => router.push(`/story/${story.id}/public`)}
                    >
                      Read Story
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleLike(story.id)}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <img
                      src={story.user?.image || '/default-avatar.png'}
                      alt={story.user?.name || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>by {story.user?.name || 'Anonymous'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
