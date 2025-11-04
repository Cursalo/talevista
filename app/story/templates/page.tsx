"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { STORY_TEMPLATES } from "@/lib/templates/story-templates";

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const genres = Array.from(new Set(STORY_TEMPLATES.map(t => t.genre)));

  const filteredTemplates = selectedGenre
    ? STORY_TEMPLATES.filter(t => t.genre === selectedGenre)
    : STORY_TEMPLATES;

  const handleSelectTemplate = (templateId: string) => {
    router.push(`/story/create?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Story Templates</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose from our curated templates to jumpstart your story
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedGenre === null ? "default" : "outline"}
            onClick={() => setSelectedGenre(null)}
            size="sm"
          >
            All Templates
          </Button>
          {genres.map(genre => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              onClick={() => setSelectedGenre(genre)}
              size="sm"
              className="capitalize"
            >
              {genre}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                  <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full capitalize">
                    {template.genre}
                  </span>
                </div>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between mb-1">
                    <span>Setting:</span>
                    <span className="font-medium">{template.setting.substring(0, 30)}...</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Style:</span>
                    <span className="font-medium capitalize">{template.style}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Chapters:</span>
                    <span className="font-medium">~{template.estimatedChapters}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold">Plot Points:</div>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
                    {template.plotPoints.slice(0, 3).map((point, idx) => (
                      <li key={idx}>• {point}</li>
                    ))}
                    {template.plotPoints.length > 3 && (
                      <li>• And {template.plotPoints.length - 3} more...</li>
                    )}
                  </ul>
                </div>

                <Button
                  className="w-full"
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
