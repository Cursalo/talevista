import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-purple-600">TaleVista</div>
        <div className="space-x-4">
          <Link href="/auth/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          Create Amazing Stories with AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Generate captivating stories with beautiful AI-generated illustrations.
          Powered by Gemini AI, Replicate, and fal.ai
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg">
              Start Creating Free
            </Button>
          </Link>
          <Link href="/story/explore">
            <Button size="lg" variant="outline" className="text-lg">
              Explore Stories
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-bold mb-2">AI Story Writing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Generate unique stories with advanced AI powered by Gemini
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Beautiful Illustrations</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create stunning visuals with Replicate and fal.ai
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-bold mb-2">Share & Export</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Export your stories as PDFs or share with the community
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
