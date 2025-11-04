"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Volume2, Download } from "lucide-react";
import { AVAILABLE_VOICES } from "@/lib/audio/elevenlabs";

interface NarrationPlayerProps {
  text: string;
  chapterId?: string;
}

export function NarrationPlayer({ text, chapterId }: NarrationPlayerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState(AVAILABLE_VOICES[0].id);
  const audioRef = useRef<HTMLAudioElement>(null);

  const generateAudio = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/audio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId: selectedVoice }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const data = await response.json();
      setAudioUrl(data.audio);
    } catch (error) {
      console.error("Error generating audio:", error);
      alert("Failed to generate narration. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;

    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `narration-${chapterId || Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold">Voice Narration</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Voice</label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_VOICES.map(voice => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!audioUrl ? (
          <Button
            onClick={generateAudio}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate Narration"}
          </Button>
        ) : (
          <div className="space-y-2">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <div className="flex gap-2">
              <Button onClick={togglePlayback} className="flex-1">
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </>
                )}
              </Button>
              <Button onClick={downloadAudio} variant="outline">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={generateAudio}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Regenerate with Different Voice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
