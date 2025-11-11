"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Sparkles, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SpeechToStoryProps {
  onStoryGenerated: (text: string) => void;
}

export function SpeechToStory({ onStoryGenerated }: SpeechToStoryProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [encouragement, setEncouragement] = useState("Tell me your story! 🌟");
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const encouragements = [
    "That's amazing! Keep going! ✨",
    "Wow! What happens next? 🎉",
    "I love this story! Tell me more! ⭐",
    "You're such a great storyteller! 🌈",
    "This is so exciting! Keep telling! 🎨",
    "Your imagination is wonderful! 🦄",
    "What an adventure! Continue! 🚀",
    "You're doing fantastic! 💫",
    "This story is magical! ✨",
    "I can't wait to hear more! 🎪",
  ];

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript + " ";
            // Show encouragement after each sentence
            if (Math.random() > 0.6) {
              const randomEncouragement =
                encouragements[Math.floor(Math.random() * encouragements.length)];
              setEncouragement(randomEncouragement);
              setTimeout(() => setEncouragement("Keep going! 🌟"), 3000);
            }
          } else {
            interim += result[0].transcript;
          }
        }

        if (final) {
          setTranscript((prev) => prev + final);
        }
        setInterimTranscript(interim);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          toast({
            title: "No speech detected",
            description: "Try speaking a little louder! 📢",
            variant: "default",
          });
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setTranscript("");
      setInterimTranscript("");
      setEncouragement("I'm listening! Start telling your story! 🎤");
      recognitionRef.current.start();

      toast({
        title: "Microphone on! 🎤",
        description: "Start telling your amazing story!",
        variant: "success",
      });
    } else {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
      setEncouragement("Great story! Ready to create? ✨");

      toast({
        title: "Recording stopped! 🛑",
        description: "Your story has been captured!",
        variant: "success",
      });
    }
  };

  const handleGenerateStory = () => {
    const fullStory = transcript + interimTranscript;
    if (fullStory.trim()) {
      onStoryGenerated(fullStory);
      toast({
        title: "Creating your story! ✨",
        description: "Your adventure is coming to life!",
        variant: "success",
      });
    }
  };

  const fullText = transcript + interimTranscript;

  return (
    <Card className="border-4 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Wand2 className="w-6 h-6 text-purple-600" />
          Tell Your Story! 🎤
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-purple-300">
          <p className="text-2xl font-bold text-purple-600 mb-2 animate-pulse">
            {encouragement}
          </p>
          {!isListening && !fullText && (
            <p className="text-gray-600 dark:text-gray-300">
              Click the microphone and start speaking! I'll listen to your amazing story! 🌈
            </p>
          )}
        </div>

        {fullText && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg min-h-[200px] max-h-[400px] overflow-y-auto">
            <p className="text-lg leading-relaxed">
              <span className="text-gray-900 dark:text-gray-100">{transcript}</span>
              <span className="text-purple-600 dark:text-purple-400 italic">
                {interimTranscript}
              </span>
              {isListening && <span className="animate-pulse">|</span>}
            </p>
            <div className="mt-4 text-sm text-gray-500">
              {transcript.split(" ").length} words so far! Keep going! 📝
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!isListening ? (
            <Button
              onClick={startListening}
              className="flex-1 h-16 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Mic className="w-6 h-6 mr-2" />
              Start Recording 🎤
            </Button>
          ) : (
            <Button
              onClick={stopListening}
              variant="destructive"
              className="flex-1 h-16 text-lg"
            >
              <MicOff className="w-6 h-6 mr-2" />
              Stop Recording 🛑
            </Button>
          )}

          {fullText && !isListening && (
            <Button
              onClick={handleGenerateStory}
              className="flex-1 h-16 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Create My Story! ✨
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <div className="font-bold text-yellow-800 dark:text-yellow-300">💡 Tip</div>
            <div className="text-yellow-700 dark:text-yellow-400">
              Speak clearly and loudly
            </div>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <div className="font-bold text-blue-800 dark:text-blue-300">🎨 Remember</div>
            <div className="text-blue-700 dark:text-blue-400">
              Describe your characters
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
          <p className="text-center text-purple-900 dark:text-purple-200 font-semibold">
            🌟 Every great story starts with imagination! 🌟
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
