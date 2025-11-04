"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Brain, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AISettingsPage() {
  const [customPrompt, setCustomPrompt] = useState("");
  const [creativity, setCreativity] = useState(70);
  const [detailLevel, setDetailLevel] = useState(50);
  const [preferredStyle, setPreferredStyle] = useState("balanced");
  const [useCustomModel, setUseCustomModel] = useState(false);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/settings/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customPrompt,
          creativity,
          detailLevel,
          preferredStyle,
          useCustomModel,
        }),
      });

      if (response.ok) {
        alert("AI settings saved successfully!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    }
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Brain className="w-10 h-10 text-purple-600" />
            AI Model Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize how AI generates your stories
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Story Generation Settings</CardTitle>
              <CardDescription>
                Fine-tune the AI's behavior for story generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Preferred Writing Style</Label>
                <Select value={preferredStyle} onValueChange={setPreferredStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="descriptive">Descriptive</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                    <SelectItem value="poetic">Poetic</SelectItem>
                    <SelectItem value="action-packed">Action-Packed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Creativity Level</Label>
                  <span className="text-sm text-gray-600">{creativity}%</span>
                </div>
                <Slider
                  value={[creativity]}
                  onValueChange={([value]) => setCreativity(value)}
                  min={0}
                  max={100}
                  step={1}
                />
                <p className="text-xs text-gray-500">
                  Higher values make the AI more creative and unpredictable
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Detail Level</Label>
                  <span className="text-sm text-gray-600">{detailLevel}%</span>
                </div>
                <Slider
                  value={[detailLevel]}
                  onValueChange={([value]) => setDetailLevel(value)}
                  min={0}
                  max={100}
                  step={1}
                />
                <p className="text-xs text-gray-500">
                  Controls how much description and detail the AI includes
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Instructions</CardTitle>
              <CardDescription>
                Add specific instructions that will be included in all story generations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Always include strong character development, avoid clichés, focus on emotional depth..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={6}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Advanced Features
              </CardTitle>
              <CardDescription>
                Premium features for customizing AI behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Use Custom Fine-Tuned Model</Label>
                  <p className="text-sm text-gray-500">
                    Use your personally trained model (Premium only)
                  </p>
                </div>
                <Switch
                  checked={useCustomModel}
                  onCheckedChange={setUseCustomModel}
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Model Fine-Tuning</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Train a custom AI model on your writing style for more personalized stories
                </p>
                <Button variant="outline" disabled={!useCustomModel}>
                  Start Fine-Tuning
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
            <Button variant="outline" className="flex-1">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
