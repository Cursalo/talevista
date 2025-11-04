"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportStoryToPDF, downloadPDF } from "@/lib/pdf/export";

interface ExportButtonProps {
  storyId: string;
  storyTitle: string;
}

export function ExportButton({ storyId, storyTitle }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch(`/api/story/${storyId}/export`);
      if (!response.ok) {
        throw new Error('Failed to fetch story data');
      }

      const storyData = await response.json();
      const pdfBlob = await exportStoryToPDF(storyData);

      const filename = `${storyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      downloadPDF(pdfBlob, filename);
    } catch (error) {
      console.error('Error exporting story:', error);
      alert('Failed to export story. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={exporting} variant="outline">
      <Download className="w-4 h-4 mr-2" />
      {exporting ? 'Exporting...' : 'Export PDF'}
    </Button>
  );
}
