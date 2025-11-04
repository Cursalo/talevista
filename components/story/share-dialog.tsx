"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Twitter, Facebook, Link2, Check, MessageCircle } from "lucide-react";

interface ShareDialogProps {
  storyId: string;
  storyTitle: string;
  storyDescription?: string;
}

export function ShareDialog({ storyId, storyTitle, storyDescription }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/story/${storyId}/public`;
  const shareText = `Check out my AI-generated story: ${storyTitle}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: storyTitle,
          text: storyDescription || shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Story</DialogTitle>
          <DialogDescription>
            Share this story with your friends and community
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input value={shareUrl} readOnly className="flex-1" />
            <Button size="sm" onClick={copyToClipboard}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Link2 className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={shareToTwitter} className="w-full">
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" onClick={shareToFacebook} className="w-full">
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button variant="outline" onClick={shareToWhatsApp} className="w-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            {navigator.share && (
              <Button variant="outline" onClick={shareNative} className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                More
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
