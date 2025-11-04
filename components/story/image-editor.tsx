"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RotateCw, Contrast, Sun, Palette } from "lucide-react";

interface ImageEditorProps {
  imageUrl: string;
  onSave?: (editedImageUrl: string) => void;
}

export function ImageEditor({ imageUrl, onSave }: ImageEditorProps) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyFilters = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    };
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob && onSave) {
        const url = URL.createObjectURL(blob);
        onSave(url);
      }
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Apply filters whenever values change
  useState(() => {
    applyFilters();
  }, [brightness, contrast, saturation, rotation, imageUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Image Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center min-h-[300px]">
          <canvas ref={canvasRef} className="max-w-full max-h-[400px]" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4" />
              <Label>Brightness</Label>
              <span className="ml-auto text-sm">{brightness}%</span>
            </div>
            <Slider
              value={[brightness]}
              onValueChange={([value]) => setBrightness(value)}
              min={0}
              max={200}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Contrast className="w-4 h-4" />
              <Label>Contrast</Label>
              <span className="ml-auto text-sm">{contrast}%</span>
            </div>
            <Slider
              value={[contrast]}
              onValueChange={([value]) => setContrast(value)}
              min={0}
              max={200}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <Label>Saturation</Label>
              <span className="ml-auto text-sm">{saturation}%</span>
            </div>
            <Slider
              value={[saturation]}
              onValueChange={([value]) => setSaturation(value)}
              min={0}
              max={200}
              step={1}
            />
          </div>

          <Button onClick={handleRotate} variant="outline" className="w-full">
            <RotateCw className="w-4 h-4 mr-2" />
            Rotate 90°
          </Button>
        </div>

        <div className="flex gap-2">
          {onSave && (
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
          )}
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
