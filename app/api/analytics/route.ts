import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all user stories
    const stories = await prisma.story.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        genre: true,
        views: true,
        likes: true,
        published: true,
        createdAt: true,
      },
    });

    // Calculate totals
    const totalViews = stories.reduce((sum, s) => sum + s.views, 0);
    const totalLikes = stories.reduce((sum, s) => sum + s.likes, 0);
    const totalStories = stories.length;
    const publishedStories = stories.filter(s => s.published).length;

    // Calculate engagement rate
    const engagementRate = totalViews > 0
      ? ((totalLikes / totalViews) * 100).toFixed(1)
      : 0;

    // Get top stories
    const topStories = stories
      .sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2))
      .slice(0, 5);

    // Stories by genre
    const genreCount: Record<string, number> = {};
    stories.forEach(story => {
      if (story.genre) {
        genreCount[story.genre] = (genreCount[story.genre] || 0) + 1;
      }
    });

    const storiesByGenre = Object.entries(genreCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));

    // Mock views over time (in production, you'd track this in StoryView model)
    const viewsOverTime = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views: Math.floor(Math.random() * 50) + 10,
    }));

    return NextResponse.json({
      totalViews,
      totalLikes,
      totalStories,
      publishedStories,
      engagementRate,
      viewsGrowth: Math.floor(Math.random() * 50),
      likesGrowth: Math.floor(Math.random() * 30),
      topStories,
      storiesByGenre,
      viewsOverTime,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
